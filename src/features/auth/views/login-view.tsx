'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import heroFarm from '@/assets/hero-farm.jpg';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginView() {
  const [role, setRole] = useState('consumer');

  // UI only — authentication is not wired up yet.
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-2'>
      <div className='hidden lg:block'>
        <h1 className='font-display text-foreground text-5xl leading-tight font-bold'>
          Welcome back to the <span className='text-primary'>market</span>.
        </h1>
        <p className='text-muted-foreground mt-4 max-w-md text-lg'>
          See what&apos;s growing near you, track your orders, and stay
          protected with instant recall alerts.
        </p>
        <Image
          src={heroFarm}
          alt='Crates of fresh produce on a sunny farm'
          width={1024}
          height={1024}
          className='mt-8 aspect-4/3 w-full rounded-[2rem] border object-cover'
        />
      </div>
      <Card className='mx-auto w-full max-w-md rounded-3xl border-2 shadow-[6px_6px_0_var(--border)]'>
        <CardHeader className='text-center'>
          <CardTitle className='font-display text-3xl font-bold'>
            Log in
          </CardTitle>
          <CardDescription>
            Choose your account type to continue.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-5'>
            <Tabs value={role} onValueChange={setRole}>
              <TabsList className='grid w-full grid-cols-2 rounded-full'>
                <TabsTrigger value='consumer' className='rounded-full'>
                  Shopper
                </TabsTrigger>
                <TabsTrigger value='farmer' className='rounded-full'>
                  Farmer
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                autoComplete='email'
                required
                className='rounded-xl'
              />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <a
                  href='#'
                  className='text-primary text-sm font-semibold hover:underline'
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id='password'
                type='password'
                autoComplete='current-password'
                required
                className='rounded-xl'
              />
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox id='remember' />
              <Label
                htmlFor='remember'
                className='text-muted-foreground font-normal'
              >
                Keep me logged in
              </Label>
            </div>
            <Button
              type='submit'
              size='lg'
              className='w-full rounded-full font-bold'
            >
              Log in as {role === 'farmer' ? 'farmer' : 'shopper'}
            </Button>
            <div className='flex items-center gap-3'>
              <Separator className='flex-1' />
              <span className='text-muted-foreground text-xs tracking-wider uppercase'>
                or
              </span>
              <Separator className='flex-1' />
            </div>
            <Button
              type='button'
              variant='outline'
              size='lg'
              className='w-full rounded-full'
            >
              Continue with Google
            </Button>
          </CardContent>
        </form>
        <CardFooter className='text-muted-foreground justify-center text-sm'>
          New to RootSource?&nbsp;
          <Link href='/' className='text-primary font-semibold hover:underline'>
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
