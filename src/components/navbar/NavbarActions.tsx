import Link from 'next/link';

export default function NavbarActions() {
  return (
    <div className='nav-actions'>
      <button type='button' className='search-button'>
        Search
      </button>

      <button type='button' className='login-button'>
        <Link href='/login'>Log in</Link>
      </button>
    </div>
  );
}
