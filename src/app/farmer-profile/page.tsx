import { headers } from 'next/headers';

import { FarmerProfileView } from '@/features/farmer-profile/views/farmerProfileView';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type Props = { searchParams: Promise<{ farmerId?: string | string[] }> };

const getFarm = cache((farmerId?: string) =>
  prisma.farmerProfile.findFirst({
    where: {
      ...(farmerId ? { userId: farmerId } : {}),
      user: { role: 'FARMER' },
    },
    orderBy: [{ farmName: 'asc' }, { userId: 'asc' }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          image: true,
          offerings: { orderBy: { name: 'asc' } },
        },
      },
    },
  })
);

export type PublicFarmerProfile = NonNullable<
  Awaited<ReturnType<typeof getFarm>>
>;

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { farmerId } = await searchParams;
  const farm =
    farmerId === undefined
      ? await getFarm()
      : typeof farmerId === 'string' && farmerId
        ? await getFarm(farmerId)
        : null;
  return {
    title: farm
      ? `${farm.farmName} | RootSource`
      : 'Farm profiles | RootSource',
    description:
      farm?.about ?? 'Meet local farmers and browse their current offerings.',
  };
}

export default async function FarmerProfilePage({ searchParams }: Props) {
  const { farmerId } = await searchParams;
  if (farmerId !== undefined && (typeof farmerId !== 'string' || !farmerId))
    notFound();

  const farm = await getFarm(farmerId);
  if (!farm) notFound();

  const session = await auth.api.getSession({ headers: await headers() });

  // Show favorite button only for logged-in consumers
  const isConsumer = session?.user.role === 'CONSUMER';
  let isFavorited = false;

  if (isConsumer && session) {
    const existing = await prisma.favorite.findUnique({
      where: {
        consumerId_farmerId: {
          consumerId: session.user.id,
          farmerId: farm.userId,
        },
      },
      select: { id: true },
    });
    isFavorited = !!existing;
  }

  return (
    <FarmerProfileView
      farm={farm}
      isFavorited={isFavorited}
      isLoggedIn={isConsumer}
    />
  );
}