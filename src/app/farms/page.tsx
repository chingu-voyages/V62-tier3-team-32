import { FarmCard } from '@/features/dashboard/views/farm-card';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';

export const metadata: Metadata = {
  title: 'All farms | RootSource',
  description:
    'Meet our farmers and explore their farms and current offerings.',
};

const PAGE_SIZE = 12;

function buildFarmsUrl(page: number): string {
  return page > 1 ? `/farms?page=${page}` : '/farms';
}

export default async function FarmsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await connection();

  const params = await searchParams;
  const requestedPage = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const totalFarms = await prisma.farmerProfile.count({
    where: { user: { role: 'FARMER' } },
  });

  const totalPages = Math.ceil(totalFarms / PAGE_SIZE);

  // Canonicalize: redirect if page is out of range
  if (totalPages === 0 && requestedPage > 1) {
    redirect('/farms');
  }
  if (totalPages > 0 && requestedPage > totalPages) {
    redirect(buildFarmsUrl(totalPages));
  }

  const safePage = requestedPage;
  const skip = (safePage - 1) * PAGE_SIZE;

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
    skip,
    take: PAGE_SIZE,
  });

  return (
    <main className='bg-cream min-h-screen px-6 py-12'>
      <div className='mx-auto max-w-6xl'>
        <Link href='/' className='text-brand font-bold'>
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
          <>
            {/* COUNT + PAGE INFO */}
            <div className='mt-6 flex flex-wrap items-center gap-3'>
              <span className='bg-ink/5 text-ink/70 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold'>
                {totalFarms} farm{totalFarms === 1 ? '' : 's'} listed
              </span>
              {totalPages > 1 && (
                <span className='bg-ink/5 text-ink/70 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold'>
                  Page {safePage} of {totalPages}
                </span>
              )}
            </div>

            {/* FARMS GRID */}
            <div className='mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {farms.map((farm) => (
                <FarmCard key={farm.userId} farm={farm} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav
                aria-label='Pagination'
                className='mt-12 flex items-center justify-center gap-2'
              >
                {safePage > 1 && (
                  <Link
                    href={buildFarmsUrl(safePage - 1)}
                    className='border-ink/10 text-ink hover:bg-ink/5 inline-flex h-10 items-center rounded-full border-2 px-5 text-sm font-bold transition-colors'
                  >
                    Previous
                  </Link>
                )}

                <span className='text-ink/60 px-3 text-sm'>
                  Page {safePage} of {totalPages}
                </span>

                {safePage < totalPages && (
                  <Link
                    href={buildFarmsUrl(safePage + 1)}
                    className='bg-brand text-cream hover:bg-brand/90 inline-flex h-10 items-center rounded-full px-5 text-sm font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}