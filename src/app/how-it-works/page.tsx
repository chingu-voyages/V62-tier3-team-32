import { Leaf, MapPin, Sprout } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How it works | RootSource',
  description:
    'Learn how to discover farms, explore their harvests, and manage your RootSource profile.',
};

const steps = [
  {
    title: 'Find a farm',
    icon: MapPin,
    description:
      'Browse our farmers and see where their farms are located. Open a farm profile to learn about the owner and how they grow their food.',
  },
  {
    title: 'Explore the harvest',
    icon: Leaf,
    description:
      'Check the farm’s current offerings, prices, and availability. See whether the farmer offers pickup, delivery, or both.',
  },
  {
    title: 'Contact your farmer',
    icon: Sprout,
    description:
      'Use the email links on the farm profile to ask about produce and arrange pickup or delivery directly with the farmer.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className='bg-cream text-ink min-h-screen px-6 py-14'>
      <div className='mx-auto max-w-6xl'>
        <Link href='/' className='text-brand font-bold'>
          Back to home
        </Link>
        <h1 className='font-display mt-6 text-5xl font-bold'>How it works</h1>
        <p className='text-ink/70 mt-4 max-w-2xl text-lg'>
          Get to know the people growing your food and explore what they have
          available.
        </p>
        <ol className='mt-10 grid gap-6 md:grid-cols-3'>
          {steps.map(({ title, icon: Icon, description }, index) => (
            <li
              key={title}
              className='border-ink/10 rounded-3xl border-2 bg-white p-8'
            >
              <span className='bg-brand/10 text-brand inline-flex h-12 w-12 items-center justify-center rounded-2xl'>
                <Icon aria-hidden='true' size={24} />
              </span>
              <h2 className='font-display mt-5 text-2xl font-bold'>
                {index + 1}. {title}
              </h2>
              <p className='text-ink/70 mt-3 leading-relaxed'>{description}</p>
            </li>
          ))}
        </ol>
        <div className='mt-12 grid gap-6 md:grid-cols-2'>
          <section className='bg-ink text-cream rounded-3xl p-8'>
            <h2 className='font-display text-3xl font-bold'>For shoppers</h2>
            <p className='text-cream/80 mt-3 leading-relaxed'>
              You can browse farms without an account. Create a consumer account
              to save your profile and location, and view your orders.
            </p>
            <Link
              href='/farms'
              className='bg-accent text-ink mt-6 inline-block rounded-full px-6 py-3 font-bold'
            >
              Explore all farms
            </Link>
          </section>
          <section className='bg-brand text-cream rounded-3xl p-8'>
            <h2 className='font-display text-3xl font-bold'>For farmers</h2>
            <p className='text-cream/80 mt-3 leading-relaxed'>
              Create a farmer account and complete your farm profile to get
              listed. Add your photos, growing practices, and certifications,
              then manage offerings and orders in your dashboard.
            </p>
            <Link
              href='/my-profile'
              className='bg-cream text-brand mt-6 inline-block rounded-full px-6 py-3 font-bold'
            >
              Manage my profile
            </Link>
          </section>
        </div>
        <p className='text-ink/70 mt-8'>
          New to RootSource?{' '}
          <Link href='/signup' className='text-brand font-bold underline'>
            Create an account
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
