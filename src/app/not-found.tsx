import Link from 'next/link';
import { ArrowLeft, Home, Search, Sprout } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='relative bg-cream min-h-screen w-full overflow-hidden'>
      {/* Sky gradient at top */}
      <div className='pointer-events-none absolute top-0 left-0 h-64 w-full bg-gradient-to-b from-accent/20 to-transparent' />

      {/* Sun setting */}
      <div className='pointer-events-none absolute top-20 right-[15%] animate-[sunset_6s_ease-in-out_infinite]'>
        <div className='bg-accent/80 relative h-24 w-24 rounded-full shadow-[0_0_80px_20px_rgba(255,179,0,0.3)]'>
          <div className='bg-accent/40 absolute inset-0 animate-ping rounded-full' />
        </div>
      </div>

      {/* Floating clouds */}
      <div className='pointer-events-none absolute top-16 left-[10%] animate-[drift_30s_linear_infinite] opacity-40'>
        <svg width='120' height='60' viewBox='0 0 120 60' fill='currentColor' className='text-white'>
          <ellipse cx='40' cy='35' rx='30' ry='18' />
          <ellipse cx='70' cy='30' rx='35' ry='22' />
          <ellipse cx='95' cy='38' rx='22' ry='14' />
        </svg>
      </div>

      <div className='pointer-events-none absolute top-40 left-[45%] animate-[drift_40s_linear_infinite_5s] opacity-30'>
        <svg width='90' height='45' viewBox='0 0 120 60' fill='currentColor' className='text-white'>
          <ellipse cx='40' cy='35' rx='30' ry='18' />
          <ellipse cx='70' cy='30' rx='35' ry='22' />
          <ellipse cx='95' cy='38' rx='22' ry='14' />
        </svg>
      </div>

      {/* Birds flying */}
      <div className='pointer-events-none absolute top-32 left-[70%] animate-[fly_20s_linear_infinite]'>
        <svg width='40' height='20' viewBox='0 0 40 20' fill='none' stroke='currentColor' strokeWidth='1.5' className='text-ink/40'>
          <path d='M5 10 Q15 2 20 10 Q25 2 35 10' />
        </svg>
      </div>

      {/* Field / grass at bottom */}
      <div className='pointer-events-none absolute bottom-0 left-0 w-full'>
        <svg viewBox='0 0 1440 200' className='text-brand/30 h-32 w-full lg:h-48' preserveAspectRatio='none'>
          <path
            fill='currentColor'
            d='M0,120 C120,100 240,140 360,120 C480,100 600,140 720,120 C840,100 960,140 1080,120 C1200,100 1320,140 1440,120 L1440,200 L0,200 Z'
          />
        </svg>
        <svg viewBox='0 0 1440 200' className='text-brand/60 -mt-12 h-32 w-full lg:h-48' preserveAspectRatio='none'>
          <path
            fill='currentColor'
            d='M0,140 C160,110 320,160 480,140 C640,110 800,160 960,140 C1120,110 1280,160 1440,140 L1440,200 L0,200 Z'
          />
        </svg>
      </div>

      {/* Growing plants along the bottom */}
      <div className='pointer-events-none absolute bottom-8 left-[8%] animate-[sway_4s_ease-in-out_infinite]'>
        <svg width='60' height='100' viewBox='0 0 60 100' className='text-brand'>
          <line x1='30' y1='100' x2='30' y2='40' stroke='currentColor' strokeWidth='3' />
          <ellipse cx='20' cy='60' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(-30 20 60)' />
          <ellipse cx='40' cy='55' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(30 40 55)' />
          <ellipse cx='30' cy='30' rx='8' ry='14' fill='currentColor' />
        </svg>
      </div>

      <div className='pointer-events-none absolute bottom-6 left-[25%] animate-[sway_5s_ease-in-out_infinite_0.5s]'>
        <svg width='50' height='80' viewBox='0 0 60 100' className='text-brand/80'>
          <line x1='30' y1='100' x2='30' y2='40' stroke='currentColor' strokeWidth='3' />
          <ellipse cx='20' cy='60' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(-30 20 60)' />
          <ellipse cx='40' cy='55' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(30 40 55)' />
          <ellipse cx='30' cy='30' rx='8' ry='14' fill='currentColor' />
        </svg>
      </div>

      <div className='pointer-events-none absolute bottom-10 right-[15%] animate-[sway_4.5s_ease-in-out_infinite_1s]'>
        <svg width='70' height='110' viewBox='0 0 60 100' className='text-brand/90'>
          <line x1='30' y1='100' x2='30' y2='40' stroke='currentColor' strokeWidth='3' />
          <ellipse cx='20' cy='60' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(-30 20 60)' />
          <ellipse cx='40' cy='55' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(30 40 55)' />
          <ellipse cx='30' cy='30' rx='8' ry='14' fill='currentColor' />
        </svg>
      </div>

      <div className='pointer-events-none absolute bottom-4 right-[8%] animate-[sway_5.5s_ease-in-out_infinite_0.3s]'>
        <svg width='45' height='75' viewBox='0 0 60 100' className='text-brand/70'>
          <line x1='30' y1='100' x2='30' y2='40' stroke='currentColor' strokeWidth='3' />
          <ellipse cx='20' cy='60' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(-30 20 60)' />
          <ellipse cx='40' cy='55' rx='10' ry='18' fill='currentColor' opacity='0.8' transform='rotate(30 40 55)' />
          <ellipse cx='30' cy='30' rx='8' ry='14' fill='currentColor' />
        </svg>
      </div>

      {/* Main content */}
      <div className='relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-32 text-center lg:pt-32'>
        {/* Badge */}
        <div className='animate-[fadeInDown_0.8s_ease-out]'>
          <span className='border-ink/10 text-ink/70 inline-flex items-center gap-2 rounded-full border-2 bg-white/70 px-4 py-1.5 text-sm font-bold tracking-widest uppercase backdrop-blur-sm'>
            <span className='bg-coral h-2 w-2 animate-pulse rounded-full' />
            404 — Field not found
          </span>
        </div>

        {/* Big 404 with plant sprouting */}
        <div className='relative mt-8 inline-block'>
          <h1 className='font-display text-brand relative text-[140px] leading-none font-bold tracking-tight lg:text-[200px]'>
            404
            {/* Sprout growing out of the 0 */}
            <svg
              viewBox='0 0 60 100'
              className='text-accent absolute top-0 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-full animate-[grow_3s_ease-in-out_infinite] lg:h-24 lg:w-24'
            >
              <line x1='30' y1='100' x2='30' y2='50' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
              <ellipse cx='18' cy='60' rx='12' ry='20' fill='currentColor' transform='rotate(-35 18 60)' />
              <ellipse cx='42' cy='55' rx='12' ry='20' fill='currentColor' transform='rotate(35 42 55)' />
            </svg>
          </h1>
        </div>

        {/* Title */}
        <h2 className='font-display text-ink animate-[fadeInUp_0.8s_ease-out_0.2s_both] mt-10 text-4xl leading-tight font-bold lg:text-5xl'>
          This field is <span className='text-brand'>empty</span>.
        </h2>

        {/* Description */}
        <p className='text-ink/70 animate-[fadeInUp_0.8s_ease-out_0.4s_both] mx-auto mt-6 max-w-md text-lg leading-relaxed'>
          The page you&apos;re looking for was harvested, replanted, or never
          grew here. Let&apos;s get you back to greener pastures.
        </p>

        {/* Buttons */}
        <div className='animate-[fadeInUp_0.8s_ease-out_0.6s_both] mt-10 flex flex-wrap justify-center gap-3'>
          <Link
            href='/'
            className='bg-brand text-cream group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(33,48,28,0.3)]'
          >
            <Home className='h-5 w-5 transition-transform group-hover:scale-110' aria-hidden />
            Back to home
          </Link>
          <Link
            href='/search'
            className='border-ink/10 text-ink hover:bg-ink/5 inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-lg font-bold transition-colors'
          >
            <Search className='h-5 w-5' aria-hidden />
            Search farms
          </Link>
        </div>
      </div>

      {/* Custom keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sunset {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-8px) scale(1.05); opacity: 1; }
        }
        @keyframes drift {
          from { transform: translateX(-100%); }
          to { transform: translateX(120vw); }
        }
        @keyframes fly {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-10px) translateY(-5px); }
          50% { transform: translateX(-20px) translateY(0); }
          75% { transform: translateX(-30px) translateY(-5px); }
          100% { transform: translateX(-40px) translateY(0); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes grow {
          0%, 100% { transform: translate(-50%, -100%) scale(1); }
          50% { transform: translate(-50%, -100%) scale(1.08); }
        }
      `}</style>
    </div>
  );
}