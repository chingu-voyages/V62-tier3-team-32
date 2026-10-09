import Image from 'next/image';

import heroFarm from '@/assets/hero-farm.jpg';
import recallGreens from '@/assets/recall-greens.jpg';
import { farms } from '../data/farms';

export function DashboardView() {
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
            have on the shelf today. Enter your zipcode, browse live harvests,
            and get instant alerts — plus a local swap — the moment an FDA
            recall hits something you buy.
          </p>
          <div className='mt-8 flex flex-wrap gap-4'>
            <a
              href='#farms'
              className='bg-brand text-cream inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
            >
              Find farms near me
            </a>
            <a
              href='#join'
              className='bg-coral text-cream inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
            >
              Become a farm
            </a>
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
                We map every farm within reach and the produce available right
                now.
              </p>
            </div>
            <div className='border-cream/10 bg-cream/5 rounded-3xl border-2 p-8'>
              <span className='bg-accent font-display text-ink grid h-14 w-14 place-items-center rounded-2xl text-2xl font-semibold'>
                2
              </span>
              <h3 className='font-display text-cream mt-5 text-2xl font-semibold'>
                Browse &amp; order
              </h3>
              <p className='text-cream/70 mt-2'>
                Pick up crates, reserve a delivery slot, and pay in a tap.
              </p>
            </div>
            <div className='border-cream/10 bg-cream/5 rounded-3xl border-2 p-8'>
              <span className='bg-coral font-display text-cream grid h-14 w-14 place-items-center rounded-2xl text-2xl font-semibold'>
                3
              </span>
              <h3 className='font-display text-cream mt-5 text-2xl font-semibold'>
                Stay protected
              </h3>
              <p className='text-cream/70 mt-2'>
                Recall alerts ping your phone with a local alternative
                instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECALL ALERT */}
      <section id='alerts' className='bg-accent w-full scroll-mt-24'>
        <div className='mx-auto max-w-6xl px-6 py-12'>
          <div className='bg-cream flex flex-col gap-8 rounded-[2rem] p-8 shadow-[6px_6px_0_rgba(33,48,28,0.25)] md:flex-row md:items-center lg:p-12'>
            <div className='flex-1'>
              <span className='bg-coral/20 text-coral inline-block rounded-full px-4 py-1.5 text-sm font-bold tracking-widest uppercase'>
                ⚠ Live recall alert
              </span>
              <h2 className='font-display text-ink mt-4 text-3xl font-bold lg:text-4xl'>
                Your leafy greens are flagged.
              </h2>
              <p className='text-ink/70 mt-2 text-lg'>
                A recall hit the &quot;Dark Leafy Greens&quot; category. We
                found a local alternative at Sunsprig Farm — 2.1 mi away,
                available today.
              </p>
              <a
                href='#farms'
                className={
                  'bg-coral text-cream mt-6 inline-block rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-1'
                }
              >
                See local alternative
              </a>
            </div>
            <Image
              src={recallGreens}
              alt='Wooden crate of fresh chard and kale'
              width={768}
              height={768}
              loading='lazy'
              className='aspect-square w-full shrink-0 rounded-3xl object-cover md:w-56'
            />
          </div>
        </div>
      </section>

      {/* FARMS */}
      <section id='farms' className='bg-cream w-full scroll-mt-24'>
        <div className='mx-auto max-w-6xl px-6 py-16'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <h2 className='font-display text-ink text-4xl font-bold lg:text-5xl'>
                Farms near you
              </h2>
              <p className='text-ink/60 mt-2'>
                Real profiles, real practices, real produce.
              </p>
            </div>
            <a
              href='#'
              className='bg-brand/10 text-brand hover:bg-brand/20 rounded-full px-6 py-3 font-bold transition-colors'
            >
              View all farms →
            </a>
          </div>
          <div className='mt-10 grid gap-6 md:grid-cols-3'>
            {farms.map((farm) => (
              <div
                key={farm.name}
                className='border-ink/10 rounded-3xl border-2 bg-white p-6 transition-transform hover:-translate-y-1'
              >
                <Image
                  src={farm.image}
                  alt={farm.imageAlt}
                  width={1024}
                  height={768}
                  loading='lazy'
                  className='border-ink/10 mb-5 aspect-4/3 w-full rounded-2xl border object-cover'
                />
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${farm.badgeClass}`}
                >
                  {farm.badge}
                </span>
                <h3 className='font-display text-ink mt-3 text-2xl font-semibold'>
                  {farm.name}
                </h3>
                <p className='text-ink/60 mt-1 text-sm'>{farm.meta}</p>
                <a
                  href={farm.href ?? '#'}
                  className='bg-accent text-ink mt-5 inline-block w-full rounded-full px-5 py-3 text-center font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5'
                >
                  {farm.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id='join' className='bg-brand w-full scroll-mt-24'>
        <div className='mx-auto max-w-4xl px-6 py-16 text-center'>
          <h2 className='font-display text-cream text-4xl font-bold lg:text-6xl'>
            Ready to eat like a neighbor?
          </h2>
          <p className='text-cream/80 mx-auto mt-4 max-w-xl text-lg'>
            Join thousands of home cooks and local growers building a shorter,
            safer food loop.
          </p>
          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            <a
              href='/onboarding'
              className='bg-accent text-ink rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1'
            >
              Create consumer profile
            </a>
            <a
              href='/farmer/onboarding'
              className='bg-cream text-brand rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1'
            >
              Create farmer profile
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
