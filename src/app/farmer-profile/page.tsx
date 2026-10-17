import { FarmerProfileView } from '@/features/farmer-profile/views/farmerProfileView';
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
  return <FarmerProfileView farm={farm} />;
}
