'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { getFarmerSession } from '@/lib/session';
import { lookupZip } from '@/lib/zip';

type Result = { error: string } | { success: true };

const MAX_IMAGE_CHARS = 3 * 1024 * 1024;
const image = z.string().startsWith('data:image/').max(MAX_IMAGE_CHARS).optional();

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Owner name is required.'),
  farmName: z.string().trim().min(1, 'Farm name is required.'),
  address: z.string().trim().min(1, 'Address is required.'),
  zipCode: z.string().trim().min(5, 'ZIP code is required.'),
  deliveryOptions: z.enum(['PICKUP', 'DELIVERY', 'BOTH']),
  about: z.string().trim().max(1000, 'Keep the description under 1000 characters.').optional(),
  certifications: z.array(z.string().trim().min(1).max(80)).max(20),
  growingPractices: z.array(z.string().trim().min(1).max(80)).max(20),
  ownerPhoto: image,
  farmPhoto: image,
});

export async function saveFarmerProfile(input: z.input<typeof profileSchema>): Promise<Result> {
  const session = await getFarmerSession();
  if (!session) return { error: 'You need to be signed in as a farmer.' };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check your details.' };
  }
  const d = parsed.data;

  const location = lookupZip(d.zipCode);
  if (!location) return { error: "That ZIP code wasn't recognized." };

  await auth.api.updateUser({
    headers: await headers(),
    body: { name: d.name, address: d.address, ...(d.ownerPhoto ? { image: d.ownerPhoto } : {}) },
  });

  const fields = {
    farmName: d.farmName,
    deliveryOptions: d.deliveryOptions,
    about: d.about || null,
    certifications: d.certifications,
    growingPractices: d.growingPractices,
    ...(d.farmPhoto ? { coverPhotoUrl: d.farmPhoto } : {}),
    ...location,
  };

  await prisma.farmerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...fields },
    update: fields,
  });

  revalidatePath('/farmer', 'layout');
  return { success: true };
}

type NextStatus = 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED';

const ALLOWED: Record<string, NextStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['READY', 'CANCELLED'],
  READY: ['COMPLETED', 'CANCELLED'],
};

export async function setOrderStatus(orderId: string, status: NextStatus): Promise<Result> {
  const session = await getFarmerSession();
  if (!session) return { error: 'You need to be signed in as a farmer.' };

  const order = await prisma.order.findFirst({
    where: { id: orderId, farmerId: session.user.id },
    select: { status: true },
  });
  if (!order) return { error: 'Order not found.' };
  if (!ALLOWED[order.status]?.includes(status)) {
    return { error: "That status change isn't allowed." };
  }

  // Including the current status in `where` makes a double-click or a stale page a no-op
  const { count } = await prisma.order.updateMany({
    where: { id: orderId, farmerId: session.user.id, status: order.status },
    data: { status },
  });
  if (count === 0) return { error: 'This order was just updated. Refresh and try again.' };

  revalidatePath('/farmer/orders');
  revalidatePath('/orders'); // the shopper's page shows the new status
  return { success: true };
}

const offeringSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Name is required.').max(80),
  unit: z.string().trim().min(1, 'Unit is required (for example lb or bunch).').max(20),
  price: z.number().positive('Price must be more than 0.').max(10_000),
  quantity: z.number().int('Quantity must be a whole number.').min(0).max(100_000),
  isAvailable: z.boolean(),
});

export async function saveOffering(input: z.input<typeof offeringSchema>): Promise<Result> {
  const session = await getFarmerSession();
  if (!session) return { error: 'You need to be signed in as a farmer.' };

  const parsed = offeringSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the details.' };
  const { id, ...data } = parsed.data;

  if (id) {
    const { count } = await prisma.offering.updateMany({
      where: { id, farmerId: session.user.id },
      data,
    });
    if (count === 0) return { error: 'Offering not found.' };
  } else {
    await prisma.offering.create({ data: { ...data, farmerId: session.user.id } });
  }

  revalidatePath('/farmer/offerings');
  return { success: true };
}

export async function setOfferingAvailability(id: string, isAvailable: boolean): Promise<Result> {
  const session = await getFarmerSession();
  if (!session) return { error: 'You need to be signed in as a farmer.' };

  const { count } = await prisma.offering.updateMany({
    where: { id, farmerId: session.user.id },
    data: { isAvailable },
  });
  if (count === 0) return { error: 'Offering not found.' };

  revalidatePath('/farmer/offerings');
  return { success: true };
}

export async function deleteOffering(id: string): Promise<Result> {
  const session = await getFarmerSession();
  if (!session) return { error: 'You need to be signed in as a farmer.' };

  await prisma.offering.deleteMany({ where: { id, farmerId: session.user.id } });
  revalidatePath('/farmer/offerings');
  return { success: true };
}