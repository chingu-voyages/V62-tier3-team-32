'use client';

import { authClient } from '@/lib/auth/auth-client';
import Link from 'next/link';

export default function FooterExplore() {
  const { data: session } = authClient.useSession();

  return (
    <nav className='footer-column' aria-label='Explore'>
      <h3>Explore</h3>
      <ul>
        <li>
          <Link href='/farms'>Search farms</Link>
        </li>
        <li>
          <Link href='/how-it-works'>How it works</Link>
        </li>
        {session && (
          <li>
            <Link href='/my-profile'>My profile</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
