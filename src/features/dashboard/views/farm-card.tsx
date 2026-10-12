import farmPhoto from '@/assets/farm-sunsprig.jpg';
import { toStringArray } from '@/features/farmer/constants';
import Image from 'next/image';
import Link from 'next/link';

type Farm = {
  userId: string;
  farmName: string;
  coverPhotoUrl: string | null;
  state: string;
  zipCode: string;
  certifications: unknown;
};

export function FarmCard({ farm }: { farm: Farm }) {
  return (
    <div className='border-ink/10 rounded-3xl border-2 bg-white p-6 transition-transform hover:-translate-y-1'>
      <Image
        src={farm.coverPhotoUrl || farmPhoto}
        alt={`${farm.farmName} farm photo`}
        width={1024}
        height={768}
        unoptimized
        loading='lazy'
        className='border-ink/10 mb-5 aspect-4/3 w-full rounded-2xl border object-cover'
      />
      {toStringArray(farm.certifications)[0] && (
        <span className='bg-brand/10 text-brand inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase'>
          {toStringArray(farm.certifications)[0]}
        </span>
      )}
      <h3 className='font-display text-ink mt-3 text-2xl font-semibold'>
        {farm.farmName}
      </h3>
      <p className='text-ink/60 mt-1 text-sm'>
        {farm.state} {farm.zipCode}
      </p>
      <Link
        href={`/farmer-profile?farmerId=${encodeURIComponent(farm.userId)}`}
        className='bg-accent text-ink mt-5 inline-block w-full rounded-full px-5 py-3 text-center font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
      >
        View farm profile
      </Link>
    </div>
  );
}
