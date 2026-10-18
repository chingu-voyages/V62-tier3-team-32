'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';

import { lookupZip } from '@/lib/zip';

export function SearchBar({
  defaultValue = '',
  compact = false,
}: {
  defaultValue?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clean = value.trim();

    // Check: must be 5 digits
    if (!/^\d{5}$/.test(clean)) {
      setError('Please enter a 5-digit ZIP code (e.g., 90210).');
      return;
    }

    // Check: must be a real US ZIP code
    const location = lookupZip(clean);
    if (!location) {
      setError(`We couldn't find ZIP code ${clean}. Please try another.`);
      return;
    }

    setError(null);
    startTransition(() => {
      router.push(`/search?zip=${clean}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? 'flex flex-wrap gap-2' : 'flex flex-wrap gap-3'}
    >
      <label className='relative flex-1'>
        <span className='sr-only'>ZIP code</span>
        <Search
          className='text-ink/40 pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2'
          aria-hidden
        />
        <input
          type='text'
          inputMode='numeric'
          maxLength={5}
          placeholder='Enter your ZIP code (e.g., 90210)'
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, ''));
            setError(null);
          }}
          disabled={isPending}
          className='border-ink/10 focus-visible:border-ring focus-visible:ring-ring/50 h-12 w-full rounded-full border-2 bg-white pr-4 pl-11 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60'
        />
      </label>
      <button
        type='submit'
        disabled={isPending}
        className='bg-brand text-cream inline-flex h-12 min-w-[110px] items-center justify-center gap-2 rounded-full px-6 text-base font-bold shadow-[3px_3px_0_rgba(33,48,28,0.25)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isPending ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' aria-hidden />
            Searching...
          </>
        ) : (
          'Search'
        )}
      </button>
      {error && (
        <p className='text-coral w-full text-center text-sm font-medium'>
          {error}
        </p>
      )}
    </form>
  );
}