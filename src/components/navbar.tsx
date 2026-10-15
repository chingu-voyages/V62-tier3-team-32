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
  const isFarmer = session?.user?.role === 'FARMER';

  return (
    <nav className='mx-auto my-0 flex min-h-24 w-full max-w-300 items-center justify-between gap-6 px-5 py-0'>
      <Link href='/'>
        <div className='brand-wrap' aria-label='RootSource home'>
          <Image
            src={logo}
            alt='RootSource logo'
            width={48}
            height={48}
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
        {!isFarmer && (
          <Link href='/search' className='search-button'>
            Search
          </Link>
        )}
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
          <Link href='/login' className='login-button'>
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}