'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import logo from '@/assets/header_logo.png';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from './ui/toast';

export function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <nav className='mx-auto my-0 flex min-h-24 w-full max-w-300 items-center justify-between gap-6 px-5 py-0'>
      <Link href='/'>
        <div className='brand-wrap' aria-label='RootSource home'>
          <Image
            src={logo}
            alt='RootSource logo'
            width={64}
            height={64}
            className='brand-logo'
            priority
          />
          <span className='brand-name'>
            <span className='brand-name-root'>Root</span>
            <span className='brand-name-source'>Source</span>
          </span>
        </div>
      </Link>
      <div className='nav-actions'>
        <button type='button' className='search-button'>
          Search
        </button>
        {session ? (
          <button
            type='button'
            onClick={async () => {
              await authClient.signOut();

              router.push('/login');

              toast.add({
                type: 'success',
                description: 'Logged out successfully.',
              });
            }}
            className='login-button'
          >
            Log Out
          </button>
        ) : (
          <button type='button' className='login-button'>
            <Link href='/login'>Log in</Link>
          </button>
        )}
      </div>
    </nav>
  );
}
