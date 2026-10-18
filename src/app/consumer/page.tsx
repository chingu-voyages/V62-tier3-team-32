import Link from 'next/link';

import {
  ConsumerSidebar,
  type ConsumerTab,
} from '@/features/consumer/consumer-sidebar';
import { FavoritesPanel } from '@/features/consumer/panels/favorites-panel';
import { OrdersPanel } from '@/features/consumer/panels/orders-panel';
import { ProfilePanel } from '@/features/consumer/panels/profile-panel';
import { syncConsumerProfile } from '@/lib/consumer-profile';
import { prisma } from '@/lib/prisma';
import { requireConsumer } from '@/lib/session';

const TABS: ConsumerTab[] = ['orders', 'favorites', 'profile'];

export default async function ConsumerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const session = await requireConsumer();
  const consumerId = session.user.id;

  const { tab, page } = await searchParams;
  const active: ConsumerTab = TABS.includes(tab as ConsumerTab)
    ? (tab as ConsumerTab)
    : 'orders';

  const requestedPage = Math.max(1, parseInt(page ?? '1', 10) || 1);

  const [user, pendingCount, favoritesCount, requestCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: consumerId },
      select: {
        name: true,
        address: true,
        image: true,
        consumerProfile: { select: { city: true, zipCode: true, state: true } },
      },
    }),
    prisma.order.count({
      where: { consumerId, status: { in: ['PENDING', 'CONFIRMED', 'READY'] } },
    }),
    prisma.favorite.count({ where: { consumerId } }),
    prisma.pickupDeliveryRequest.count({
      where: { consumerId, status: { in: ['PENDING', 'CONFIRMED'] } },
    }),
  ]);

  let profile = user?.consumerProfile ?? null;

  if (!profile && user?.address) {
    const synced = await syncConsumerProfile(consumerId, user.address);
    if (synced.ok) {
      const { city, state, zipCode } = synced.value.location;
      profile = { city, state, zipCode };
    }
  }

  const name = user?.name ?? session.user.name;
  const location = profile ? `${profile.zipCode}, ${profile.state}` : null;

  return (
    <div className='bg-cream min-h-screen w-full'>
      <main className='mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr] lg:gap-10 lg:py-12'>
        <ConsumerSidebar
          active={active}
          pendingCount={pendingCount + requestCount}
          favoritesCount={favoritesCount}
          name={name}
          image={user?.image ?? null}
          location={location}
        />

        <div className='min-w-0'>
          {!location && active !== 'profile' && (
            <div className='bg-accent/30 border-ink/10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 p-4'>
              <p className='text-ink text-sm font-semibold'>
                Share your address so we can show you farms near you.
              </p>
              <Link
                href='/consumer?tab=profile'
                className='bg-ink text-cream rounded-full px-5 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5'
              >
                Finish setting up your profile
              </Link>
            </div>
          )}

          {active === 'orders' && (
            <OrdersPanel
              consumerId={consumerId}
              firstName={name.split(' ')[0]}
            />
          )}

          {active === 'favorites' && (
            <FavoritesPanel
              consumerId={consumerId}
              requestedPage={requestedPage}
            />
          )}

          {active === 'profile' && <ProfilePanel consumerId={consumerId} />}
        </div>
      </main>
    </div>
  );
}