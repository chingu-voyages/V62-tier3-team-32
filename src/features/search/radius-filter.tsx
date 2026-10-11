'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

type RadiusValue = 25 | 50 | 100 | 150 | 200 | 'all';

const OPTIONS: { value: RadiusValue; label: string }[] = [
  { value: 25, label: 'Within 25 miles' },
  { value: 50, label: 'Within 50 miles' },
  { value: 100, label: 'Within 100 miles' },
  { value: 150, label: 'Within 150 miles' },
  { value: 200, label: 'Within 200 miles' },
  { value: 'all', label: 'Any distance' },
];

export function RadiusFilter({
  value,
  total,
}: {
  value: RadiusValue;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams.toString());
    next.set('radius', e.target.value);
    next.delete('page'); // reset to page 1
    router.push(`/search?${next.toString()}`);
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <label className='relative inline-flex items-center'>
        <span className='sr-only'>Distance range</span>
        <select
          value={value}
          onChange={handleChange}
          className='border-ink/10 text-ink hover:bg-ink/5 focus-visible:ring-brand h-11 cursor-pointer appearance-none rounded-full border-2 bg-white pr-11 pl-5 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none'
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className='text-ink/60 pointer-events-none absolute right-4 h-4 w-4'
          aria-hidden
        />
      </label>
      {total > 0 && (
        <span className='bg-ink/5 text-ink/70 inline-block rounded-full px-3 py-1.5 text-xs font-bold'>
          {total} found
        </span>
      )}
    </div>
  );
}