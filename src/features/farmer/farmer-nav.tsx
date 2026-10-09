'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/farmer/orders', label: 'Orders' },
  { href: '/farmer/offerings', label: 'Offerings' },
  { href: '/farmer/profile', label: 'Profile' },
];

export function FarmerNav() {
  const pathname = usePathname();
  return (
    <nav aria-label='Farm sections' className='flex gap-1'>
      {LINKS.map((l) => {
        const active = pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              active ? 'bg-brand text-cream' : 'text-ink/70 hover:bg-brand/10'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}