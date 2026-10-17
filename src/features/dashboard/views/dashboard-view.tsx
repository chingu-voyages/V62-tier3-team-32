import Image from 'next/image';
import { headers } from 'next/headers';
import Link from 'next/link';
import { connection } from 'next/server';

import heroFarm from '@/assets/hero-farm.jpg';
import recallGreens from '@/assets/recall-greens.jpg';
import { FarmCard } from './farm-card';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

export async function DashboardView() {
  await connection();

  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session;
  const role = session?.user.role ?? null; // 'CONSUMER' | 'FARMER' | null

  const farms = await prisma.farmerProfile.findMany({
    where: { user: { role: 'FARMER' } },
    select: {
      userId: true,
      farmName: true,
      coverPhotoUrl: true,
      state: true,
      zipCode: true,
      certifications: true,
    },
    orderBy: [{ farmName: 'asc' }, { userId: 'asc' }],
    take: 3,
  });

  return (
    <div className='bg-cream w-full'>
      {/* HERO */}
      <section className='mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-8 lg:grid-cols-2'>
        <div>
          <span className='bg-coral/15 text-coral inline-block rounded-full px-4 py-1.5 text-sm font-bold tracking-widest uppercase'>
            Fresh · Local · Real-time
          </span>
          <h1 className='font-display text-ink mt-6 text-6xl leading-[0.95] font-bold lg:text-7xl'>
            Eat what&apos;s <span className='text-brand'>growing</span> right
            now.
          </h1>
          <p className='text-ink/70 mt-6 max-w-md text-lg leading-relaxed'>
            RootSource connects you to farms near your door and the food they
            have on the shelf today. Enter your ZIP code to browse live
            harvests, save your favorite farms, and order directly from local
            growers.
          </p>

          {/* HERO ACTIONS */}
          <div className='mt-8 flex flex-wrap gap-4'>
            {!isLoggedIn && (
              <>
                <a
                  href='/search'
                  className='bg-brand text-cream inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
                >
                  Find farms near me
                </a>
                <a
                  href='/signup?role=farmer'
                  className='bg-coral text-cream inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
                >
                  Become a farm
                </a>
              </>
            )}

            {isLoggedIn && role === 'CONSUMER' && (
              <>
                <a
                  href='/search'
                  className='bg-brand text-cream inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
                >
                  Find farms near me
                </a>
                <a
                  href='/consumer'
                  className='bg-accent text-ink inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
                >
                  My dashboard
                </a>
              </>
            )}

            {isLoggedIn && role === 'FARMER' && (
              <a
                href='/farmer'
                className='bg-brand text-cream inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
              >
                Go to my farm dashboard
              </a>
            )}
          </div>
        </div>

        <div>
          <Image
            src={heroFarm}
            alt='Sunlit farm fields with colorful crates of freshly harvested produce'
            width={1024}
            height={1024}
            className='border-ink/10 aspect-square w-full rounded-[2rem] border object-cover'
          />
        </div>
      </section>

            {/* HOW IT WORKS */}
      <section id='how' className='bg-ink w-full scroll-mt-24'>
        <div className='mx-auto max-w-6xl px-6 py-16'>
          <h2 className='font-display text-cream text-4xl font-bold lg:text-5xl'>
            How it works
          </h2>
          <p className='text-cream/70 mt-3 max-w-lg'>
            Three steps between you and the freshest food in your neighborhood.
          </p>
          <div className='mt-10 grid gap-6 md:grid-cols-3'>
            <div className='border-cream/10 bg-cream/5 rounded-3xl border-2 p-8'>
              <span className='bg-brand font-display text-cream grid h-14 w-14 place-items-center rounded-2xl text-2xl font-semibold'>
                1
              </span>
              <h3 className='font-display text-cream mt-5 text-2xl font-semibold'>
                Drop your zipcode
              </h3>
              <p className='text-cream/70 mt-2'>
                Enter your ZIP code and we map every farm within driving
                distance — sorted by how close they are to you.
              </p>
            </div>
            <div className='border-cream/10 bg-cream/5 rounded-3xl border-2 p-8'>
              <span className='bg-accent font-display text-ink grid h-14 w-14 place-items-center rounded-2xl text-2xl font-semibold'>
                2
              </span>
              <h3 className='font-display text-cream mt-5 text-2xl font-semibold'>
                Explore the harvest
              </h3>
              <p className='text-cream/70 mt-2'>
                Browse each farm&apos;s current offerings, prices, and
                availability. See their growing practices and certifications.
              </p>
            </div>
            <div className='border-cream/10 bg-cream/5 rounded-3xl border-2 p-8'>
              <span className='bg-coral font-display text-cream grid h-14 w-14 place-items-center rounded-2xl text-2xl font-semibold'>
                3
              </span>
              <h3 className='font-display text-cream mt-5 text-2xl font-semibold'>
                Order &amp; save
              </h3>
              <p className='text-cream/70 mt-2'>
                Create a free account to place orders and save your favorite
                farms for faster reordering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FARMS */}
      <section id='farms' className='bg-cream w-full scroll-mt-24'>
        <div className='mx-auto max-w-6xl px-6 py-16'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <h2 className='font-display text-ink text-4xl font-bold lg:text-5xl'>
                Meet our farmers
              </h2>
              <p className='text-ink/60 mt-2'>
                Real profiles, real practices, real produce.
              </p>
            </div>
            <Link
              href='/farms'
              className='bg-brand/10 text-brand hover:bg-brand/20 rounded-full px-6 py-3 font-bold transition-colors'
            >
              View all farms →
            </Link>
          </div>
          {farms.length === 0 && (
            <p className='text-ink/60 mt-8'>No farms are listed yet.</p>
          )}
          <div className='mt-10 grid gap-6 md:grid-cols-3'>
            {farms.map((farm) => (
              <FarmCard key={farm.userId} farm={farm} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id='join' className='bg-brand w-full scroll-mt-24'>
        <div className='mx-auto max-w-4xl px-6 py-16 text-center'>
          <h2 className='font-display text-cream text-4xl font-bold lg:text-6xl'>
            {isLoggedIn && role === 'FARMER'
              ? 'Keep your farm growing.'
              : isLoggedIn && role === 'CONSUMER'
                ? 'Ready to eat like a neighbor?'
                : 'Ready to eat like a neighbor?'}
          </h2>

          <p className='text-cream/80 mx-auto mt-4 max-w-xl text-lg'>
            {isLoggedIn && role === 'FARMER'
              ? 'Manage your offerings, orders, and profile from one dashboard.'
              : isLoggedIn && role === 'CONSUMER'
                ? 'Discover new farms, save favorites, and manage your orders.'
                : 'Join thousands of home cooks and local growers building a shorter, safer food loop.'}
          </p>

          {/* CTA ACTIONS */}
          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            {!isLoggedIn && (
              <>
                <a
                  href='/signup?role=consumer'
                  className='bg-accent text-ink rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1'
                >
                  Start shopping
                </a>
                <a
                  href='/signup?role=farmer'
                  className='bg-cream text-brand rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1'
                >
                  Join as a farmer
                </a>
              </>
            )}

            {isLoggedIn && role === 'CONSUMER' && (
              <>
                <a
                  href='/search'
                  className='bg-accent text-ink rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1'
                >
                  Browse farms
                </a>
                <a
                  href='/consumer?tab=favorites'
                  className='bg-cream text-brand rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1'
                >
                  My favorites
                </a>
              </>
            )}

            {isLoggedIn && role === 'FARMER' && (
              <a
                href='/farmer'
                className='bg-accent text-ink rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1'
              >
                Go to my farm dashboard
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}