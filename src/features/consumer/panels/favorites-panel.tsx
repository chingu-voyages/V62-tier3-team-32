import Link from 'next/link';
import { Heart } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { distanceInMiles, formatDistance } from '@/lib/distance';
import { FavoriteButton } from '@/components/favorites/favorite-button';

const PAGE_SIZE = 6;

function buildFavoritesUrl(page: number): string {
  return page > 1
    ? `/consumer?tab=favorites&page=${page}`
    : '/consumer?tab=favorites';
}

type Props = {
  consumerId: string;
  requestedPage?: number;
};

export async function FavoritesPanel({ consumerId, requestedPage = 1 }: Props) {
  const [consumer, totalCount] = await Promise.all([
    prisma.consumerProfile.findUnique({
      where: { userId: consumerId },
      select: { latitude: true, longitude: true },
    }),
    prisma.favorite.count({ where: { consumerId } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const safePage = Math.min(
    Math.max(1, requestedPage),
    Math.max(1, totalPages)
  );
  const skip = (safePage - 1) * PAGE_SIZE;

  const favorites = await prisma.favorite.findMany({
    where: { consumerId },
    include: {
      farmer: {
        select: {
          id: true,
          name: true,
          image: true,
          farmerProfile: {
            select: {
              farmName: true,
              coverPhotoUrl: true,
              about: true,
              state: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: PAGE_SIZE,
  });

  const savedFarms = favorites
    .filter((f) => f.farmer.farmerProfile)
    .map((f) => {
      const profile = f.farmer.farmerProfile!;
      const distance =
        consumer?.latitude && consumer?.longitude
          ? distanceInMiles(
              consumer.latitude,
              consumer.longitude,
              profile.latitude,
              profile.longitude
            )
          : null;
      return {
        id: f.id,
        farmerId: f.farmer.id,
        farmName: profile.farmName,
        ownerName: f.farmer.name,
        ownerImage: f.farmer.image,
        coverPhotoUrl: profile.coverPhotoUrl,
        about: profile.about,
        state: profile.state,
        distance,
      };
    });

  // Empty state
  if (totalCount === 0) {
    return (
      <div>
        <h1 className='font-display text-ink text-4xl leading-tight font-bold'>
          Your favorites
        </h1>
        <p className='text-ink/70 mt-2 text-lg'>
          Save farms you love for faster reordering.
        </p>

        <div className='border-ink/20 mt-8 rounded-3xl border-2 border-dashed bg-white p-12 text-center'>
          <span className='bg-coral/10 text-coral mx-auto grid h-16 w-16 place-items-center rounded-full'>
            <Heart className='h-8 w-8' aria-hidden />
          </span>
          <p className='font-display text-ink mt-6 text-2xl font-semibold'>
            No favorites yet
          </p>
          <p className='text-ink/60 mt-2 text-sm'>
            Browse farms near you and tap the heart to save them here.
          </p>
          <Link
            href='/search'
            className='bg-brand text-cream mt-8 inline-block rounded-full px-8 py-4 font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
          >
            Browse farms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='font-display text-ink text-4xl leading-tight font-bold'>
        Your favorites
      </h1>
      <p className='text-ink/70 mt-2 text-lg'>
        {totalCount} saved {totalCount === 1 ? 'farm' : 'farms'}.
      </p>

      {/* Count + page info */}
      <div className='mt-6 flex flex-wrap items-center gap-3'>
        <span className='bg-ink/5 text-ink/70 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold'>
          {totalCount} saved
        </span>
        {totalPages > 1 && (
          <span className='bg-ink/5 text-ink/70 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold'>
            Page {safePage} of {totalPages}
          </span>
        )}
      </div>

      {/* FARM GRID */}
      <div className='mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {savedFarms.map((farm) => (
          <article
            key={farm.id}
            className='border-ink/10 group flex flex-col overflow-hidden rounded-3xl border-2 bg-white transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(33,48,28,0.15)]'
          >
            <div className='relative aspect-4/3 w-full overflow-hidden'>
              {farm.coverPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={farm.coverPhotoUrl}
                  alt={farm.farmName}
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
              ) : (
                <div className='bg-brand/10 grid h-full w-full place-items-center'>
                  <span className='font-display text-brand text-6xl font-bold'>
                    {farm.farmName[0]}
                  </span>
                </div>
              )}
              <div className='absolute top-4 right-4'>
                <FavoriteButton
                  farmerId={farm.farmerId}
                  initialFavorited={true}
                  size='md'
                />
              </div>
              {farm.distance !== null && (
                <div className='absolute top-4 left-4'>
                  <span className='bg-accent text-ink inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase'>
                    {formatDistance(farm.distance)}
                  </span>
                </div>
              )}
            </div>

            <div className='flex flex-1 flex-col gap-3 p-6'>
              <h3 className='font-display text-ink text-2xl leading-tight font-bold'>
                {farm.farmName}
              </h3>
              <p className='text-ink/60 text-sm'>
                {farm.state} · Run by {farm.ownerName}
              </p>
              {farm.about && (
                <p className='text-ink/70 line-clamp-2 text-sm leading-relaxed'>
                  {farm.about}
                </p>
              )}
              <Link
                href={`/farmer-profile?farmerId=${farm.farmerId}`}
                className='bg-accent text-ink mt-auto inline-block w-full rounded-full px-5 py-3 text-center font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
              >
                View farm
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav
          aria-label='Favorites pagination'
          className='mt-12 flex items-center justify-center gap-2'
        >
          {safePage > 1 && (
            <Link
              href={buildFavoritesUrl(safePage - 1)}
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
              href={buildFavoritesUrl(safePage + 1)}
              className='bg-brand text-cream hover:bg-brand/90 inline-flex h-10 items-center rounded-full px-5 text-sm font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}