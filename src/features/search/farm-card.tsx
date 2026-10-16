import { MapPin, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { FavoriteButton } from '@/components/favorites/favorite-button';
import { formatDistance } from '@/lib/distance';
import { money } from '@/lib/format';
import type {
  FarmerProfile,
  Offering,
  User,
} from '../../../generated/prisma/client';

type FarmWithUser = FarmerProfile & {
  user: Pick<User, 'id' | 'name' | 'image'> & {
    offerings: Offering[];
  };
  distance: number;
};

type Props = {
  farm: FarmWithUser;
  isFavorited: boolean;
};

function CertificationBadge({ label }: { label: string }) {
  return (
    <span className='bg-brand/10 text-brand inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase'>
      {label}
    </span>
  );
}

function DistanceBadge({ distance }: { distance: number }) {
  return (
    <span className='bg-accent text-ink inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase'>
      <MapPin className='h-3.5 w-3.5' aria-hidden />
      {formatDistance(distance)}
    </span>
  );
}

function DeliveryBadge({ option }: { option: string }) {
  const labels: Record<string, string> = {
    PICKUP: 'Pickup',
    DELIVERY: 'Delivery',
    BOTH: 'Pickup & Delivery',
  };
  return (
    <span className='bg-ink/5 text-ink/70 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold'>
      <Truck className='h-3.5 w-3.5' aria-hidden />
      {labels[option] ?? option}
    </span>
  );
}

export function FarmCard({ farm, isFavorited }: Props) {
  const certifications = Array.isArray(farm.certifications)
    ? (farm.certifications as string[])
    : [];
  const offerings = farm.user.offerings ?? [];

  return (
    <article className='border-ink/10 group flex flex-col overflow-hidden rounded-3xl border-2 bg-white transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(33,48,28,0.15)]'>
      {/* COVER IMAGE */}
      <div className='relative aspect-4/3 w-full overflow-hidden'>
        {farm.coverPhotoUrl ? (
          <Image
            src={farm.coverPhotoUrl}
            alt={farm.farmName}
            fill
            unoptimized
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='bg-brand/10 grid h-full w-full place-items-center'>
            <span className='font-display text-brand text-6xl font-bold'>
              {farm.farmName[0]}
            </span>
          </div>
        )}
        <div className='absolute top-4 left-4 flex flex-wrap gap-2'>
          <DistanceBadge distance={farm.distance} />
        </div>
        <div className='absolute top-4 right-4'>
          <FavoriteButton
            farmerId={farm.user.id}
            initialFavorited={isFavorited}
            size='md'
          />
        </div>
      </div>

      {/* BODY */}
      <div className='flex flex-1 flex-col gap-3 p-6'>
        <div className='flex flex-wrap gap-2'>
          {certifications.slice(0, 1).map((c) => (
            <CertificationBadge key={c} label={c} />
          ))}
          <DeliveryBadge option={farm.deliveryOptions} />
        </div>

        <h3 className='font-display text-ink text-2xl leading-tight font-bold'>
          {farm.farmName}
        </h3>

        <p className='text-ink/60 text-sm'>
          {farm.state} · Run by {farm.user.name}
        </p>

        {farm.about && (
          <p className='text-ink/70 line-clamp-2 text-sm leading-relaxed'>
            {farm.about}
          </p>
        )}

        {offerings.length > 0 && (
          <div className='border-ink/10 mt-1 border-t pt-3'>
            <p className='text-ink/60 mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase'>
              <ShoppingBag className='h-3.5 w-3.5' aria-hidden />
              On the stand
            </p>
            <ul className='space-y-1 text-sm'>
              {offerings.map((o) => (
                <li
                  key={o.id}
                  className='text-ink/80 flex items-center justify-between'
                >
                  <span className='truncate'>
                    {o.name} · {o.unit}
                  </span>
                  <span className='text-brand ml-3 shrink-0 font-semibold'>
                    {money(Number(o.price))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={`/farmer-profile?farmerId=${farm.user.id}`}
          className='bg-accent text-ink mt-auto inline-block w-full rounded-full px-5 py-3 text-center font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
        >
          View farm
        </Link>
      </div>
    </article>
  );
}