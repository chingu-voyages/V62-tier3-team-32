import Link from 'next/link';
import { Heart } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { distanceInMiles, formatDistance } from '@/lib/distance';
import { FavoriteButton } from '@/components/favorites/favorite-button';

type Props = {
  consumerId: string;
};

export async function FavoritesPanel({ consumerId }: Props) {
  const [consumer, favorites] = await Promise.all([
    prisma.consumerProfile.findUnique({
      where: { userId: consumerId },
      select: { latitude: true, longitude: true },
    }),
    prisma.favorite.findMany({
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
    }),
  ]);

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

  if (savedFarms.length === 0) {
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
        {savedFarms.length} saved {savedFarms.length === 1 ? 'farm' : 'farms'}.
      </p>

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
    </div>
  );
}