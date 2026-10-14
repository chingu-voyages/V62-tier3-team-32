import { Sprout } from 'lucide-react';

export default function LoadingPage() {
  return (
    <section
      aria-label='Loading RootSource'
      className='mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center'
    >
      <div
        aria-hidden='true'
        className='bg-brand/10 text-brand mb-6 grid size-20 place-items-center rounded-3xl'
      >
        <Sprout
          className='size-10 animate-pulse motion-reduce:animate-none'
          strokeWidth={1.8}
        />
      </div>

      <div role='status' aria-live='polite'>
        <p className='text-coral text-sm font-bold tracking-[0.2em] uppercase'>
          Fresh · Local · Real-time
        </p>
        <h1 className='font-display text-ink mt-3 text-3xl font-bold sm:text-4xl'>
          Gathering the harvest
        </h1>
        <p className='text-ink/70 mt-3 max-w-sm text-base leading-relaxed sm:text-lg'>
          We&apos;re getting your local food community ready.
        </p>
      </div>

      <div
        aria-hidden='true'
        className='bg-brand/15 mt-8 h-2 w-48 overflow-hidden rounded-full'
      >
        <div className='bg-brand h-full w-1/3 animate-pulse rounded-full motion-reduce:animate-none' />
      </div>
    </section>
  );
}
