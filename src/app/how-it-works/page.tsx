import { headers } from 'next/headers';
import {
  Heart,
  Leaf,
  MapPin,
  Search,
  ShoppingBasket,
  Sprout,
  LayoutDashboard,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { auth } from '@/lib/auth/auth';

export const metadata: Metadata = {
  title: 'How it works | RootSource',
  description:
    'Discover local farms, explore their harvests, and order fresh food directly from growers.',
};

const steps = [
  {
    number: '01',
    title: 'Find a farm',
    icon: MapPin,
    color: 'brand',
    description:
      'Enter your ZIP code and we map every farm within driving distance — sorted by how close they are to you.',
  },
  {
    number: '02',
    title: 'Explore the harvest',
    icon: Leaf,
    color: 'accent',
    description:
      'Browse each farm\u2019s current offerings, prices, and availability. Learn about growing practices, certifications, and how they work.',
  },
  {
    number: '03',
    title: 'Order & save favorites',
    icon: Heart,
    color: 'coral',
    description:
      'Create a free account to place orders directly with farmers and save your favorite farms for faster reordering.',
  },
];

const colorMap: Record<
  string,
  { bg: string; icon: string; border: string }
> = {
  brand: {
    bg: 'bg-brand/10',
    icon: 'text-brand',
    border: 'border-brand/20',
  },
  accent: {
    bg: 'bg-accent/20',
    icon: 'text-ink',
    border: 'border-accent/30',
  },
  coral: {
    bg: 'bg-coral/10',
    icon: 'text-coral',
    border: 'border-coral/20',
  },
};

export default async function HowItWorksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session;
  const role = session?.user.role ?? null; // 'CONSUMER' | 'FARMER' | null

  return (
    <main className='bg-cream text-ink min-h-screen w-full'>
      {/* TOP BAR */}
      <div className='mx-auto max-w-6xl px-6 pt-10'>
        <Link
          href='/'
          className='text-brand inline-flex items-center gap-1.5 text-sm font-bold hover:underline'
        >
          ← Back to home
        </Link>
      </div>

      {/* HERO */}
      <section className='mx-auto max-w-4xl px-6 pt-10 pb-12 text-center'>
        <span className='bg-brand/10 text-brand inline-block rounded-full px-4 py-1.5 text-sm font-bold tracking-widest uppercase'>
          Getting started
        </span>

        <h1 className='font-display text-ink mt-6 text-5xl leading-[1.05] font-bold lg:text-6xl'>
          How it <span className='text-brand'>works</span>.
        </h1>

        <p className='text-ink/70 mx-auto mt-6 max-w-2xl text-lg leading-relaxed'>
          RootSource connects you directly with local farms. Browse what&apos;s
          fresh today, order straight from the grower, and build your personal
          list of favorite farms.
        </p>
      </section>

      {/* STEPS */}
      <section className='mx-auto max-w-6xl px-6 pb-16'>
        <div className='grid gap-6 md:grid-cols-3'>
          {steps.map(({ number, title, icon: Icon, color, description }) => {
            const c = colorMap[color];
            return (
              <article
                key={title}
                className='border-ink/10 relative overflow-hidden rounded-3xl border-2 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(33,48,28,0.12)]'
              >
                <span className='font-display text-ink/5 absolute top-4 right-6 text-7xl leading-none font-bold'>
                  {number}
                </span>

                <span
                  className={`${c.bg} ${c.border} inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2`}
                >
                  <Icon
                    className={`${c.icon} h-7 w-7`}
                    aria-hidden
                    strokeWidth={1.75}
                  />
                </span>

                <h2 className='font-display text-ink mt-6 text-2xl leading-tight font-bold'>
                  {title}
                </h2>

                <p className='text-ink/70 mt-3 leading-relaxed'>
                  {description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* AUDIENCE CARDS */}
      <section className='mx-auto max-w-6xl px-6 pb-20'>
        <div className='grid gap-6 md:grid-cols-2'>
          {/* SHOPPER */}
          <article className='bg-ink text-cream relative overflow-hidden rounded-3xl p-10'>
            <span className='bg-brand/20 text-cream absolute top-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl'>
              <ShoppingBasket
                className='h-6 w-6'
                aria-hidden
                strokeWidth={1.75}
              />
            </span>

            <span className='bg-brand/20 text-cream inline-block rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase'>
              For shoppers
            </span>

            <h2 className='font-display mt-6 text-3xl leading-tight font-bold lg:text-4xl'>
              Eat fresher food, closer to home.
            </h2>

            <ul className='text-cream/80 mt-6 space-y-3 text-base leading-relaxed'>
              <li className='flex gap-3'>
                <span className='text-brand mt-1.5'>✓</span>
                <span>Search farms by ZIP code — no account needed</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-brand mt-1.5'>✓</span>
                <span>See what&apos;s in season right now</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-brand mt-1.5'>✓</span>
                <span>Order direct from the farmer — no middlemen</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-brand mt-1.5'>✓</span>
                <span>Save favorite farms for faster reordering</span>
              </li>
            </ul>

            <div className='mt-8 flex flex-wrap gap-3'>
              <Link
                href='/search'
                className='bg-accent text-ink inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold shadow-[3px_3px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5'
              >
                <Search className='h-4 w-4' aria-hidden />
                Find farms
              </Link>

              {/* Show signup OR dashboard depending on state */}
              {!isLoggedIn && (
                <Link
                  href='/signup?role=consumer'
                  className='border-cream/20 text-cream hover:bg-cream/10 inline-flex items-center rounded-full border-2 px-6 py-3 font-bold transition-colors'
                >
                  Create account
                </Link>
              )}

              {isLoggedIn && role === 'CONSUMER' && (
                <Link
                  href='/consumer'
                  className='border-cream/20 text-cream hover:bg-cream/10 inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 font-bold transition-colors'
                >
                  <LayoutDashboard className='h-4 w-4' aria-hidden />
                  My dashboard
                </Link>
              )}
            </div>
          </article>

          {/* FARMER */}
          <article className='bg-brand text-cream relative overflow-hidden rounded-3xl p-10'>
            <span className='bg-cream/20 text-cream absolute top-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl'>
              <Sprout className='h-6 w-6' aria-hidden strokeWidth={1.75} />
            </span>

            <span className='bg-cream/20 text-cream inline-block rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase'>
              For farmers
            </span>

            <h2 className='font-display mt-6 text-3xl leading-tight font-bold lg:text-4xl'>
              Reach customers in your neighborhood.
            </h2>

            <ul className='text-cream/90 mt-6 space-y-3 text-base leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-1.5'>✓</span>
                <span>
                  Build a public farm profile with photos and practices
                </span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-1.5'>✓</span>
                <span>List current offerings, prices, and availability</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-1.5'>✓</span>
                <span>Receive orders straight from local shoppers</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-1.5'>✓</span>
                <span>Manage everything from one dashboard</span>
              </li>
            </ul>

            <div className='mt-8 flex flex-wrap gap-3'>
              {/* Show signup OR dashboard depending on state */}
              {!isLoggedIn && (
                <Link
                  href='/signup?role=farmer'
                  className='bg-cream text-brand inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold shadow-[3px_3px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5'
                >
                  <Sprout className='h-4 w-4' aria-hidden />
                  Join as a farmer
                </Link>
              )}

              {isLoggedIn && role === 'FARMER' && (
                <Link
                  href='/farmer'
                  className='bg-cream text-brand inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold shadow-[3px_3px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5'
                >
                  <LayoutDashboard className='h-4 w-4' aria-hidden />
                  Go to my dashboard
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* FINAL CTA — only for guests */}
      {!isLoggedIn && (
        <section className='mx-auto max-w-4xl px-6 pb-20 text-center'>
          <h2 className='font-display text-ink text-3xl font-bold lg:text-4xl'>
            Ready to get started?
          </h2>
          <p className='text-ink/70 mx-auto mt-4 max-w-xl text-lg'>
            Whether you&apos;re shopping or growing, RootSource makes it easy to
            connect with the food community around you.
          </p>
          <div className='mt-8 flex flex-wrap justify-center gap-3'>
            <Link
              href='/signup'
              className='bg-brand text-cream inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
            >
              Create a free account
            </Link>
            <Link
              href='/search'
              className='border-ink/10 text-ink hover:bg-ink/5 inline-block rounded-full border-2 px-8 py-4 text-lg font-bold transition-colors'
            >
              Browse farms first
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}