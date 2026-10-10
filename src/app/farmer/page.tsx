import Link from 'next/link';

import { FarmerSidebar, type FarmerTab } from '@/features/farmer/farmer-sidebar';
import { OfferingsPanel } from '@/features/farmer/panels/offerings-panel';
import { OrdersPanel } from '@/features/farmer/panels/orders-panel';
import { ProfilePanel } from '@/features/farmer/panels/profile-panel';
import { RevenuePanel, type RangeId } from '@/features/farmer/panels/revenue-panel';
import { prisma } from '@/lib/prisma';
import { requireFarmer } from '@/lib/session';

const TABS: FarmerTab[] = ['orders', 'offerings', 'revenue', 'profile'];
const RANGES: RangeId[] = ['7d', '30d', '12m'];

export default async function FarmerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; range?: string }>;
}) {
  const session = await requireFarmer();
  const farmerId = session.user.id;

  const params = await searchParams;
  const active: FarmerTab = TABS.includes(params.tab as FarmerTab) ? (params.tab as FarmerTab) : 'orders';
  const range: RangeId = RANGES.includes(params.range as RangeId) ? (params.range as RangeId) : '30d';

  const [user, pendingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: farmerId },
      select: { name: true, image: true, farmerProfile: { select: { farmName: true } } },
    }),
    prisma.order.count({
      where: { farmerId, status: { in: ['PENDING', 'CONFIRMED', 'READY'] } },
    }),
  ]);

  const farmName = user?.farmerProfile?.farmName ?? null;

  return (
    <div className='bg-cream min-h-screen w-full'>
      <main className='mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr] lg:gap-10 lg:py-12'>
        <FarmerSidebar
          active={active}
          pendingCount={pendingCount}
          ownerName={user?.name ?? session.user.name}
          ownerImage={user?.image ?? null}
          farmName={farmName}
        />

        <div className='min-w-0'>
          {!farmName && active !== 'profile' && (
            <div className='bg-accent/30 border-ink/10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 p-4'>
              <p className='text-ink text-sm font-semibold'>
                Shoppers can&apos;t find your farm yet. Finish your profile to get listed.
              </p>
              <Link
                href='/farmer?tab=profile'
                className='bg-ink text-cream rounded-full px-5 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5'
              >
                Finish your profile
              </Link>
            </div>
          )}

          {active === 'orders' && <OrdersPanel farmerId={farmerId} />}
          {active === 'offerings' && <OfferingsPanel farmerId={farmerId} />}
          {active === 'revenue' && <RevenuePanel farmerId={farmerId} range={range} />}
          {active === 'profile' && <ProfilePanel farmerId={farmerId} />}
        </div>
      </main>
    </div>
  );
}