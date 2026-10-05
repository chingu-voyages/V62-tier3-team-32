import footerLogo from '@/assets/logo-footer.png';
import Image from 'next/image';

export default function FooterBrand() {
  return (
    <div className='footer-brand-block'>
      <div className='footer-brand'>
        <Image
          src={footerLogo}
          alt=''
          className='footer-brand-mark'
          sizes='32px'
        />
        <span>RootSource</span>
      </div>
      <p className='footer-copyright'>
        © 2026 RootSource · Voyage team 32 · Built for US.
      </p>
      <p className='footer-copy'>
        Local farms, live harvests, and recall protection — all in your
        neighborhood.
      </p>
    </div>
  );
}
