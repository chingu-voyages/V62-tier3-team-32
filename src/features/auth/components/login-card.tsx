'use client';

import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from './login-form';

export function LoginCard() {
  return (
    <Card className='mx-auto w-full max-w-md rounded-3xl border-2'>
      <CardHeader className='text-center'>
        <CardTitle className='font-display text-3xl font-bold'>
          Log in
        </CardTitle>
        <CardDescription>Choose your account type to continue.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <LoginForm />
      </CardContent>
      <CardFooter className='text-muted-foreground justify-center text-sm'>
        New to RootSource?&nbsp;
        <Link
          href='/signup'
          className='text-primary font-semibold hover:underline'
        >
          Create an account
        </Link>
      </CardFooter>
    </Card>
  );
}
