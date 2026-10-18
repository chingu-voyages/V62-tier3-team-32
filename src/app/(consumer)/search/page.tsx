import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { FarmCard } from '@/features/search/farm-card';
import { RadiusFilter } from '@/features/search/radius-filter';
import { SearchBar } from '@/features/search/search-bar';
import { auth } from '@/lib/auth/auth';
import { distanceInMiles } from '@/lib/distance';
import { prisma } from '@/lib/prisma';
import { lookupZip } from '@/lib/zip';

export const metadata = {
  title: 'Farms near you | RootSource',
  description: 'Find local farms within driving distance of your ZIP code.',
};

const PAGE_SIZE = 6;
const RADIUS_OPTIONS = [25, 50, 100, 150, 200, 'all'] as const;
type RadiusOption = (typeof RADIUS_OPTIONS)[number];

function parseRadius(value: string | undefined): RadiusOption {
  if (!value) return 25;
  if (value === 'all') return 'all';
  const n = parseInt(value, 10);
  if (RADIUS_OPTIONS.includes(n as RadiusOption)) return n as RadiusOption;
  return 25;
}

function formatMiles(miles: number): string {
  if (miles < 1) return '< 1';
  if (miles < 10) return miles.toFixed(1);
  return Math.round(miles).toString();
}

function buildSearchUrl(
  radius: RadiusOption,
  page: number,
  zip?: string
): string {
  const params = new URLSearchParams();
  if (zip) params.set('zip', zip);
  if (radius !== 25) params.set('radius', String(radius));
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/search?${qs}` : '/search';
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; radius?: string; zip?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Farmers → their own dashboard
  if (session && session.user.role !== 'CONSUMER') redirect('/farmer');

  const params = await searchParams;
  const requestedZip = params.zip;

  // Determine user coordinates
  let consumerLat: number | null = null;
  let consumerLng: number | null = null;
  let displayZip: string | null = null;
  let displayState: string | null = null;
  let isGuest = !session;

  if (session) {
    // Logged-in consumer
    const consumer = await prisma.consumerProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (consumer) {
      consumerLat = consumer.latitude;
      consumerLng = consumer.longitude;
      displayZip = consumer.zipCode;
      displayState = consumer.state;
    }
  }

  // Guest OR consumer without profile: use zip from URL
  if (!consumerLat && requestedZip) {
    const location = lookupZip(requestedZip);
    if (location) {
      consumerLat = location.latitude;
      consumerLng = location.longitude;
      displayZip = location.zipCode;
      displayState = location.state;
    }
  }

  // If we still don't have coordinates → show the search bar only
  if (!consumerLat || !consumerLng) {
    return (
      <div className='bg-cream min-h-screen w-full'>
        <div className='mx-auto max-w-2xl px-6 py-20 text-center'>
          <span className='bg-brand/10 text-brand inline-block rounded-full px-4 py-1.5 text-sm font-bold tracking-widest uppercase'>
            Find farms near you
          </span>
          <h1 className='font-display text-ink mt-6 text-4xl leading-tight font-bold lg:text-5xl'>
            Enter your ZIP code to get started.
          </h1>
          <p className='text-ink/70 mx-auto mt-4 max-w-md text-lg'>
            We&apos;ll map every farm within driving distance and show you
            what&apos;s available right now.
          </p>

          <div className='mt-8 text-left'>
            <SearchBar
              defaultValue={requestedZip ?? ''}
            />
          </div>

          {!session && (
            <p className='text-ink/60 mt-8 text-sm'>
              Want to save favorites and place orders?{' '}
              <Link
                href='/signup?role=consumer'
                className='text-brand font-bold hover:underline'
              >
                Create a free account
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    );
  }

  // Canonicalize radius
  const requestedRadius = params.radius;
  if (requestedRadius && requestedRadius !== 'all') {
    const n = parseInt(requestedRadius, 10);
    if (isNaN(n) || !RADIUS_OPTIONS.includes(n as RadiusOption)) {
      redirect(buildSearchUrl(25, 1, requestedZip));
    }
  }
  const radius = parseRadius(requestedRadius);
  const requestedPage = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const farms = await prisma.farmerProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          offerings: {
            where: { isAvailable: true },
            orderBy: { name: 'asc' },
            take: 3,
          },
        },
      },
    },
  });

  const farmsWithDistance = farms
    .map((farm) => ({
      ...farm,
      distance: distanceInMiles(
        consumerLat!,
        consumerLng!,
        farm.latitude,
        farm.longitude
      ),
    }))
    .filter((f) => radius === 'all' || f.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  const totalPages = Math.ceil(farmsWithDistance.length / PAGE_SIZE);

  if (totalPages === 0 && requestedPage > 1) {
    redirect(buildSearchUrl(radius, 1, requestedZip));
  }
  if (totalPages > 0 && requestedPage > totalPages) {
    redirect(buildSearchUrl(radius, totalPages, requestedZip));
  }

  const safePage = requestedPage;
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = farmsWithDistance.slice(start, start + PAGE_SIZE);

  // Favorites (only for logged-in consumers)
  const favoritedSet = new Set<string>();
  if (session && session.user.role === 'CONSUMER') {
    const farmerIds = visible.map((f) => f.user.id);
    const favorites = await prisma.favorite.findMany({
      where: {
        consumerId: session.user.id,
        farmerId: { in: farmerIds },
      },
      select: { farmerId: true },
    });
    favorites.forEach((f) => favoritedSet.add(f.farmerId));
  }

  const closest = farmsWithDistance[0]?.distance ?? 0;
  const farthest =
    farmsWithDistance[farmsWithDistance.length - 1]?.distance ?? 0;
  const hasResults = farmsWithDistance.length > 0;

  return (
    <div className='bg-cream w-full'>
      <section className='mx-auto max-w-6xl px-6 pt-14 pb-8'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <span className='bg-brand/10 text-brand inline-block rounded-full px-4 py-1.5 text-sm font-bold tracking-widest uppercase'>
            Near {displayZip} · {displayState}
          </span>

          {isGuest && (
            <Link
              href='/signup?role=consumer'
              className='text-brand text-sm font-bold hover:underline'
            >
              Sign up to place orders & save farms →
            </Link>
          )}
        </div>

        {/* Compact search bar for changing zip */}
        <div className='mt-6 max-w-md'>
          <SearchBar defaultValue={displayZip ?? ''} compact />
        </div>

        {hasResults ? (
          <>
            <h1 className='font-display text-ink mt-8 text-5xl leading-[1.05] font-bold lg:text-6xl'>
              {farmsWithDistance.length} farm
              {farmsWithDistance.length === 1 ? '' : 's'}{' '}
              <span className='text-brand'>near you</span>.
            </h1>

            <div className='text-ink/70 mt-6 max-w-2xl text-lg leading-relaxed'>
              {farmsWithDistance.length === 1 ? (
                <>
                  <p>
                    The closest farm is{' '}
                    <strong className='text-ink'>
                      {formatMiles(closest)} mi
                    </strong>{' '}
                    from your ZIP code.
                  </p>
                  {radius !== 'all' && (
                    <p className='mt-1'>
                      Within a{' '}
                      <strong className='text-ink'>{radius}-mile radius</strong>
                      .
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>
                    These farms are between{' '}
                    <strong className='text-ink'>
                      {formatMiles(closest)} mi
                    </strong>{' '}
                    and{' '}
                    <strong className='text-ink'>
                      {formatMiles(farthest)} mi
                    </strong>{' '}
                    from your ZIP code.
                  </p>
                  {radius !== 'all' && (
                    <p className='mt-1'>
                      Within a{' '}
                      <strong className='text-ink'>{radius}-mile radius</strong>
                      .
                    </p>
                  )}
                </>
              )}
            </div>

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <RadiusFilter value={radius} total={farmsWithDistance.length} />
              <span className='bg-ink/5 text-ink/70 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold'>
                {farmsWithDistance.length} farm
                {farmsWithDistance.length === 1 ? '' : 's'}
              </span>
              {totalPages > 1 && (
                <span className='bg-ink/5 text-ink/70 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold'>
                  Page {safePage} of {totalPages}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className='font-display text-ink mt-8 text-5xl leading-[1.05] font-bold lg:text-6xl'>
              No farms found <span className='text-coral'>nearby</span>.
            </h1>

            <p className='text-ink/70 mt-6 max-w-2xl text-lg leading-relaxed'>
              We couldn&apos;t find any farms{' '}
              {radius === 'all'
                ? 'in our directory.'
                : `within ${radius} miles of your ZIP code.`}{' '}
              Try a wider distance range or a different ZIP code.
            </p>

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <RadiusFilter value={radius} />
            </div>

            {radius !== 'all' && (
              <div className='mt-6 flex flex-wrap gap-3'>
                <Link
                  href={buildSearchUrl('all', 1, requestedZip)}
                  className='bg-brand text-cream inline-flex h-10 items-center rounded-full px-5 text-sm font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
                >
                  Show all farms
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* FARMS GRID */}
      {visible.length > 0 && (
        <section className='mx-auto max-w-6xl px-6 pb-12'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {visible.map((farm) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                isFavorited={favoritedSet.has(farm.user.id)}
                isGuest={isGuest}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label='Pagination'
              className='mt-12 flex items-center justify-center gap-2'
            >
              {safePage > 1 && (
                <Link
                  href={buildSearchUrl(radius, safePage - 1, requestedZip)}
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
                  href={buildSearchUrl(radius, safePage + 1, requestedZip)}
                  className='bg-brand text-cream hover:bg-brand/90 inline-flex h-10 items-center rounded-full px-5 text-sm font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </section>
      )}
    </div>
  );
}