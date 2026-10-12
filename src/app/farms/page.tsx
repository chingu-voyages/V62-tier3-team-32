import { FarmCard } from '@/features/dashboard/views/farm-card';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';

export const metadata: Metadata = {
  title: 'All farms | RootSource',
  description:
    'Meet our farmers and explore their farms and current offerings.',
};

export default async function FarmsPage() {
  await connection();
  const farms = await prisma.farmerProfile.findMany({
    where: { user: { role: 'FARMER' } },
    select: {
      userId: true,
      farmName: true,
      coverPhotoUrl: true,
      state: true,
      zipCode: true,
      certifications: true,
    },
    orderBy: [{ farmName: 'asc' }, { userId: 'asc' }],
  });

  return (
    <main className='bg-cream min-h-screen px-6 py-12'>
      <div className='mx-auto max-w-6xl'>
        <Link href='/#farms' className='text-brand font-bold'>
          Back to home
        </Link>
        <h1 className='font-display text-ink mt-6 text-4xl font-bold lg:text-5xl'>
          All farms
        </h1>
        <p className='text-ink/60 mt-2'>
          Meet our farmers and explore their current offerings.
        </p>
        {farms.length === 0 ? (
          <p className='text-ink/60 mt-8'>No farms are listed yet.</p>
        ) : (
          <div className='mt-10 grid gap-6 md:grid-cols-3'>
            {farms.map((farm) => (
              <FarmCard key={farm.userId} farm={farm} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
