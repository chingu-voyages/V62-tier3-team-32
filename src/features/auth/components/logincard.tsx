'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '../../../lib/auth/auth-client'; // same import path as SignupCard

export function UserLoginCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('remember') === 'on';

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (signInError) {
        setError(signInError.message ?? 'Invalid email or password.');
        return;
      }

      // The account's stored role decides where they land
      const destination = data?.user.role === 'FARMER' ? '/farmer' : '/consumer';
      router.replace(destination);
      router.refresh(); // make server components re-read the new session
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/consumer?tab=profile',
      });
    } catch {
      setError('Google login failed. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <Card className='mx-auto w-full max-w-md rounded-3xl border-2'>
      <CardHeader className='text-center'>
        <CardTitle className='font-display text-3xl font-bold'>Log in</CardTitle>
        <CardDescription>Welcome back to RootSource.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className='text-destructive bg-destructive/10 rounded-xl p-3 text-center text-sm font-medium'>
                {error}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@example.com'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Link
                  href='#'
                  className='text-primary text-sm font-semibold hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id='password'
                name='password'
                type='password'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field orientation='horizontal' className='gap-2'>
              <Checkbox id='remember' name='remember' disabled={isLoading} />
              <FieldLabel
                htmlFor='remember'
                className='text-muted-foreground font-normal'
              >
                Keep me logged in
              </FieldLabel>
            </Field>

            <Field>
              <Button
                type='submit'
                size='lg'
                disabled={isLoading}
                className='w-full rounded-full font-bold'
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </Field>

            <FieldSeparator className='flex-1'>or continue with</FieldSeparator>

            <Field>
              <Button
                type='button'
                variant='outline'
                size='lg'
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className='w-full rounded-full'
              >
                Continue with Google
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='text-muted-foreground justify-center text-sm'>
        New to RootSource?&nbsp;
        <Link href='/signup' className='text-primary font-semibold hover:underline'>
          Create an account
        </Link>
      </CardFooter>
    </Card>
  );
}