'use client';

import Image from 'next/image';

import heroFarm from '@/assets/hero-farm.jpg';
import { SignupCard } from '../components/signup-form';

export function SignupView() {
  return (
    <div className='mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-2'>
      <div className='hidden lg:block'>
        <h1 className='font-display text-foreground text-5xl leading-tight font-bold'>
          Join the local <span className='text-primary'>market</span> today.
        </h1>
        <p className='text-muted-foreground mt-4 max-w-md text-lg'>
          Connect with trusted growers near you, secure ultra-fresh produce, and
          support sustainable community food systems.
        </p>
        <Image
          src={heroFarm}
          alt='Crates of fresh produce on a sunny farm'
          width={1024}
          height={1024}
          className='mt-8 aspect-4/3 w-full rounded-[2rem] border object-cover'
        />
      </div>
      <SignupCard />
    </div>
  );
}
