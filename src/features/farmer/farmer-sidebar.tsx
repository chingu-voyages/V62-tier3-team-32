import Link from 'next/link';
import { ClipboardList, Sprout, Store, TrendingUp, type LucideIcon } from 'lucide-react';

import { initials } from '@/lib/format';

export type FarmerTab = 'orders' | 'offerings' | 'revenue' | 'profile';

const TABS: { id: FarmerTab; label: string; icon: LucideIcon }[] = [
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'offerings', label: 'Offerings', icon: Sprout },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'profile', label: 'Farm profile', icon: Store },
];

type Props = {
  active: FarmerTab;
  pendingCount: number;
  ownerName: string;
  ownerImage: string | null;
  farmName: string | null;
};

export function FarmerSidebar({ active, pendingCount, ownerName, ownerImage, farmName }: Props) {
  const listed = farmName !== null;

  return (
    <aside className='h-fit lg:sticky lg:top-24'>
      <div className='border-ink/10 mb-4 hidden items-center gap-3 rounded-3xl border-2 bg-white p-4 lg:flex'>
        {ownerImage ? (
          <img src={ownerImage} alt='' className='h-12 w-12 shrink-0 rounded-full object-cover' />
        ) : (
          <span aria-hidden className='bg-accent text-ink font-display grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold'>
            {initials(ownerName)}
          </span>
        )}
        <div className='min-w-0'>
          <p className='font-display text-ink truncate text-lg leading-tight font-semibold'>
            {farmName ?? ownerName}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
              listed ? 'bg-brand/15 text-brand' : 'bg-coral/15 text-coral'
            }`}
          >
            {listed ? 'Listed' : 'Not listed yet'}
          </span>
        </div>
      </div>

      <nav aria-label='Dashboard sections' className='-mx-6 overflow-x-auto px-6 lg:mx-0 lg:overflow-visible lg:px-0'>
        <ul className='flex gap-2 pb-1 lg:flex-col lg:gap-1.5 lg:pb-0'>
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = id === active;
            return (
              <li key={id} className='shrink-0 lg:shrink'>
                <Link
                  href={`/farmer?tab=${id}`}
                  scroll={false}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand text-cream shadow-[3px_3px_0_rgba(33,48,28,0.3)]'
                      : 'text-ink/70 hover:bg-brand/10 border-ink/10 border-2 bg-white lg:border-0 lg:bg-transparent'
                  }`}
                >
                  <Icon aria-hidden className='h-5 w-5' />
                  <span>{label}</span>

                  {id === 'orders' && pendingCount > 0 && (
                    <span className='bg-coral text-cream ml-1 rounded-full px-2 py-0.5 text-xs lg:ml-auto'>
                      {pendingCount}
                      <span className='sr-only'> orders need attention</span>
                    </span>
                  )}
                  {id === 'profile' && !listed && (
                    <>
                      <span aria-hidden className='bg-coral ml-1 h-2 w-2 rounded-full lg:ml-auto' />
                      <span className='sr-only'>(incomplete)</span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}