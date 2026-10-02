import logo from '@/assets/header_logo.png';
import Image from 'next/image';

export default function Logo() {
  return (
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
  );
}
