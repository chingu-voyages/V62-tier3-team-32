'use client';

import Link from 'next/link';

import { authClient } from '@/lib/auth/auth-client';

export default function FooterExplore() {
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;
  const isFarmer = role === 'FARMER';

  const profileHref =
    role === 'FARMER'
      ? '/farmer?tab=profile'
      : role === 'CONSUMER'
        ? '/consumer?tab=profile'
        : null;

  return (
    <nav className='footer-column' aria-label='Explore'>
      <h3>Explore</h3>
      <ul>
        {!isFarmer && (
          <li>
            <Link href='/search'>Search farms</Link>
          </li>
        )}
        <li>
          <Link href='/how-it-works'>How it works</Link>
        </li>
        {profileHref && (
          <li>
            <Link href={profileHref}>My profile</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}