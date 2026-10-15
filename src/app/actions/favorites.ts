'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { getConsumerSession } from '@/lib/session';

type Result =
  | { success: true; action: 'added' | 'removed' }
  | { error: string };

export async function toggleFavorite(farmerId: string): Promise<Result> {
  const session = await getConsumerSession();
  if (!session) {
    return { error: 'You need to be signed in as a consumer.' };
  }

  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        consumerId_farmerId: {
          consumerId: session.user.id,
          farmerId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      revalidatePath('/consumer');
      revalidatePath('/search');
      return { success: true, action: 'removed' };
    }

    await prisma.favorite.create({
      data: {
        consumerId: session.user.id,
        farmerId,
      },
    });
    revalidatePath('/consumer');
    revalidatePath('/search');
    return { success: true, action: 'added' };
  } catch {
    return { error: 'Something went wrong. Please try again.' };
  }
}

export async function isFavorited(farmerId: string): Promise<boolean> {
  const session = await getConsumerSession();
  if (!session) return false;

  const existing = await prisma.favorite.findUnique({
    where: {
      consumerId_farmerId: {
        consumerId: session.user.id,
        farmerId,
      },
    },
    select: { id: true },
  });

  return !!existing;
}

export async function getFavoriteFarmerIds(): Promise<string[]> {
  const session = await getConsumerSession();
  if (!session) return [];

  const favorites = await prisma.favorite.findMany({
    where: { consumerId: session.user.id },
    select: { farmerId: true },
  });

  return favorites.map((f) => f.farmerId);
}