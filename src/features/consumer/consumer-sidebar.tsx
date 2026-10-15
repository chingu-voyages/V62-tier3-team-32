import { ClipboardList, Heart, UserRound, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { initials } from '@/lib/format';

export type ConsumerTab = 'orders' | 'favorites' | 'profile';

const TABS: { id: ConsumerTab; label: string; icon: LucideIcon }[] = [
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

type Props = {
  active: ConsumerTab;
  pendingCount: number;
  favoritesCount: number;
  name: string;
  image: string | null;
  location: string | null;
};

export function ConsumerSidebar({
  active,
  pendingCount,
  favoritesCount,
  name,
  image,
  location,
}: Props) {
  const complete = location !== null;

  return (
    <aside className='h-fit lg:sticky lg:top-24'>
      <div className='border-ink/10 mb-4 hidden items-center gap-3 rounded-3xl border-2 bg-white p-4 lg:flex'>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=''
            className='h-12 w-12 shrink-0 rounded-full object-cover'
          />
        ) : (
          <span
            aria-hidden
            className='bg-accent text-ink font-display grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold'
          >
            {initials(name)}
          </span>
        )}
        <div className='min-w-0'>
          <p className='font-display text-ink truncate text-lg leading-tight font-semibold'>
            {name}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
              complete ? 'bg-brand/15 text-brand' : 'bg-coral/15 text-coral'
            }`}
          >
            {complete ? location : 'Add your address'}
          </span>
        </div>
      </div>

      <nav
        aria-label='Dashboard sections'
        className='-mx-6 overflow-x-auto px-6 lg:mx-0 lg:overflow-visible lg:px-0'
      >
        <ul className='flex gap-2 pb-1 lg:flex-col lg:gap-1.5 lg:pb-0'>
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = id === active;
            return (
              <li key={id} className='shrink-0 lg:shrink'>
                <Link
                  href={`/consumer?tab=${id}`}
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
                      <span className='sr-only'> orders in progress</span>
                    </span>
                  )}

                  {id === 'favorites' && favoritesCount > 0 && (
                    <span className='bg-coral/15 text-coral ml-1 rounded-full px-2 py-0.5 text-xs font-bold lg:ml-auto'>
                      {favoritesCount}
                      <span className='sr-only'> saved farms</span>
                    </span>
                  )}

                  {id === 'profile' && !complete && (
                    <>
                      <span
                        aria-hidden
                        className='bg-coral ml-1 h-2 w-2 rounded-full lg:ml-auto'
                      />
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