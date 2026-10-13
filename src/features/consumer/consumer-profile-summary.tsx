import Link from 'next/link';

import { initials } from '@/lib/format';

type Props = {
  user: { name: string; address: string; image: string | null };
  location: { zipCode: string; state: string } | null;
};

export function ConsumerProfileSummary({ user, location }: Props) {
  return (
    <aside className='bg-ink text-cream h-fit rounded-3xl p-8'>
      {user.image ? (
        <img src={user.image} alt='' className='border-cream/20 h-24 w-24 rounded-full border-4 object-cover' />
      ) : (
        <span aria-hidden className='bg-accent text-ink font-display grid h-24 w-24 place-items-center rounded-full text-3xl font-bold'>
          {initials(user.name)}
        </span>
      )}
      <h2 className='font-display mt-5 text-3xl leading-tight font-bold'>{user.name}</h2>

      {location ? (
        <dl className='mt-6 space-y-4 text-sm'>
          <div>
            <dt className='text-cream/60'>Address</dt>
            <dd className='mt-0.5'>{user.address}</dd>
          </div>
          <div>
            <dt className='text-cream/60'>ZIP code</dt>
            <dd className='mt-0.5'>
              {location.zipCode}, {location.state}
            </dd>
          </div>
        </dl>
      ) : (
        <p className='text-cream/80 mt-4 text-sm leading-relaxed'>
          Not set up yet. Add your ZIP code in the form so we can find farms near you. Your orders
          still work in the meantime.
        </p>
      )}

      <Link
        href='/consumer?tab=orders'
        className='bg-accent text-ink mt-8 inline-block rounded-full px-6 py-3 font-bold shadow-[3px_3px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5'
      >
        View my orders
      </Link>
    </aside>
  );
}