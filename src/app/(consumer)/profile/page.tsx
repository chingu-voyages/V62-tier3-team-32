import Link from 'next/link';
import { headers } from 'next/headers';

import { ProfileForm } from '@/features/onbording/onboarding-modal';
import { auth } from '@/lib/auth/auth';
import { initials } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      name: true,
      address: true,
      image: true,
      consumerProfile: { select: { zipCode: true, state: true } },
    },
  });

  const name = user?.name ?? '';
  const zip = user?.consumerProfile?.zipCode ?? '';
  const state = user?.consumerProfile?.state ?? '';

  return (
    <div className='bg-cream min-h-screen w-full'>
      <div className='mx-auto grid max-w-5xl gap-8 px-6 py-14 lg:grid-cols-[320px_1fr]'>
        <aside className='bg-ink text-cream rounded-3xl p-8 lg:sticky lg:top-24 lg:self-start'>
          {user?.image ? (
            <img
              src={user.image}
              alt=''
              className='border-cream/20 h-24 w-24 rounded-full border-4 object-cover'
            />
          ) : (
            <span
              aria-hidden
              className='bg-accent text-ink font-display grid h-24 w-24 place-items-center rounded-full text-3xl font-bold'
            >
              {initials(name)}
            </span>
          )}
          <h1 className='font-display mt-5 text-3xl leading-tight font-bold'>{name}</h1>

          <dl className='mt-6 space-y-4 text-sm'>
            <div>
              <dt className='text-cream/60'>Address</dt>
              <dd className='mt-0.5'>{user?.address}</dd>
            </div>
            <div>
              <dt className='text-cream/60'>ZIP code</dt>
              <dd className='mt-0.5'>
                {zip}
                {state ? `, ${state}` : ''}
              </dd>
            </div>
          </dl>

          <Link
            href='/orders'
            className='bg-accent text-ink mt-8 inline-block rounded-full px-6 py-3 font-bold shadow-[3px_3px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5'
          >
            View my orders
          </Link>
        </aside>

        <ProfileForm
          mode='edit'
          defaults={{
            name,
            address: user?.address ?? '',
            zipCode: zip,
            image: user?.image ?? null,
          }}
        />
      </div>
    </div>
  );
}