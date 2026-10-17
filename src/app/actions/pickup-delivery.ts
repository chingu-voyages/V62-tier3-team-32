'use server';

import {
  isRequestSlotValid,
  pickupDeliverySchema,
} from '@/lib/pickup-delivery';
import { prisma } from '@/lib/prisma';
import { getConsumerSession, getFarmerSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const DUPLICATE_MESSAGE =
  'You already have a pending or confirmed request for this farm and time slot.';

type Result = { success: true } | { error: string };

export async function createPickupDeliveryRequest(
  input: z.input<typeof pickupDeliverySchema>
): Promise<Result> {
  const session = await getConsumerSession();
  if (!session) return { error: 'Sign in as a shopper to request a slot.' };
  const parsed = pickupDeliverySchema.safeParse(input);
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message ?? 'Check your request details.',
    };
  const data = parsed.data;
  try {
    const existing = await prisma.pickupDeliveryRequest.findUnique({
      where: { id: data.id },
    });
    if (existing)
      return existing.consumerId === session.user.id &&
        existing.farmerId === data.farmerId
        ? { success: true }
        : { error: 'Please reopen the form and try again.' };
    const start = new Date(data.slotStart);
    if (!isRequestSlotValid(start, data.timeZone))
      return {
        error:
          'Choose a future slot within the next seven days, between noon and 5 p.m.',
      };
    const farm = await prisma.farmerProfile.findUnique({
      where: { userId: data.farmerId },
      include: { user: { select: { role: true, address: true } } },
    });
    if (!farm || farm.user.role !== 'FARMER')
      return { error: 'Farm not found.' };
    if (farm.deliveryOptions !== 'BOTH' && farm.deliveryOptions !== data.method)
      return {
        error: 'This farm does not offer that pickup or delivery option.',
      };
    const duplicate = await prisma.pickupDeliveryRequest.findFirst({
      where: {
        consumerId: session.user.id,
        farmerId: data.farmerId,
        slotStart: start,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { id: true },
    });
    if (duplicate) return { error: DUPLICATE_MESSAGE };
    const saved = await prisma.pickupDeliveryRequest.upsert({
      where: { id: data.id },
      update: {},
      create: {
        id: data.id,
        consumerId: session.user.id,
        farmerId: data.farmerId,
        method: data.method,
        consumerName: data.consumerName,
        address: data.method === 'DELIVERY' ? data.address : farm.user.address,
        slotStart: start,
        slotEnd: new Date(start.getTime() + 3600000),
        timeZone: data.timeZone,
      },
    });
    if (
      saved.consumerId !== session.user.id ||
      saved.farmerId !== data.farmerId
    )
      return { error: 'Please reopen the form and try again.' };
    revalidatePath('/farmer');
    return { success: true };
  } catch (error) {
    // The unique index also handles simultaneous requests with different IDs.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      const retry = await prisma.pickupDeliveryRequest.findUnique({
        where: { id: data.id },
      });
      if (
        retry?.consumerId === session.user.id &&
        retry.farmerId === data.farmerId
      )
        return { success: true };
      return { error: DUPLICATE_MESSAGE };
    }
    return { error: 'Unable to save your request. Please try again.' };
  }
}

export async function updatePickupDeliveryStatus(
  id: string,
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
): Promise<Result> {
  const session = await getFarmerSession();
  if (!session) return { error: 'Sign in as a farmer to update requests.' };
  const allowed: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
  };
  try {
    const request = await prisma.pickupDeliveryRequest.findFirst({
      where: { id, farmerId: session.user.id },
    });
    if (!request || !allowed[request.status]?.includes(status))
      return {
        error: 'This request cannot be updated. Refresh and try again.',
      };
    const result = await prisma.pickupDeliveryRequest.updateMany({
      where: { id, farmerId: session.user.id, status: request.status },
      data: { status },
    });
    if (!result.count)
      return { error: 'This request was just updated. Refresh and try again.' };
    revalidatePath('/farmer');
    return { success: true };
  } catch {
    return { error: 'Unable to update this request. Please try again.' };
  }
}
