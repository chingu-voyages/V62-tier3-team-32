'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '../../../lib/auth/auth-client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SignupCard() {
  const [role, setRole] = useState('consumer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle traditional email & password sign up
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const password = formData.get('password') as string;

    const photoFile = formData.get('photo') as File;

    try {
      let base64Image: string | undefined = undefined;

      // 2. Convert the image file to a Base64 string only if a file was actually chosen
      if (photoFile && photoFile.size > 0) {
        // Basic client-side check to prevent huge image strings (e.g., limit to 2MB)
        if (photoFile.size > 2 * 1024 * 1024) {
          setError('Image must be smaller than 2MB.');
          setIsLoading(false);
          return;
        }

        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
      }

      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        address,
        role: role.toUpperCase(),
        image: base64Image,
      });

      if (signUpError) {
        setError(signUpError.message ?? 'Signup failed');
        return;
      }

      // Handle success routing here (e.g., router.push('/dashboard'))
    } catch (err: any) {
      setError(err?.message || 'Something went wrong during signup.');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google OAuth
  async function handleGoogleSignUp() {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: 'google',
      });
    } catch (err: any) {
      setError(err?.message || 'Google signup failed.');
      setIsLoading(false);
    }
  }

  return (
    <Card className='mx-auto w-full max-w-md rounded-3xl border-2'>
      <CardHeader className='text-center'>
        <CardTitle className='font-display text-3xl font-bold'>
          Create an account
        </CardTitle>
        <CardDescription>
          Choose your account type to get started.
        </CardDescription>
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
              <Tabs value={role} onValueChange={setRole}>
                <TabsList className='grid w-full grid-cols-2 rounded-full'>
                  <TabsTrigger value='consumer' className='rounded-full'>
                    Consumer
                  </TabsTrigger>
                  <TabsTrigger value='farmer' className='rounded-full'>
                    Farmer
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>

            <Field>
              <FieldLabel htmlFor='name'>Full Name</FieldLabel>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='John Doe'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='email'>Email Address</FieldLabel>
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
              <FieldLabel htmlFor='address'>Physical Address</FieldLabel>
              <Input
                id='address'
                name='address'
                type='text'
                placeholder='123 Main St, City'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='password'>Password</FieldLabel>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='photo'>Profile Photo (Optional)</FieldLabel>
              <Input
                id='photo'
                name='photo'
                type='file'
                accept='image/*'
                disabled={isLoading}
                className='file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer rounded-xl file:mr-4 file:rounded-full file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold'
              />
            </Field>

            <Field>
              <Button
                type='submit'
                size='lg'
                disabled={isLoading}
                className='w-full rounded-full font-bold'
              >
                {isLoading
                  ? 'Creating account...'
                  : `Sign up as ${role === 'farmer' ? 'farmer' : 'consumer'}`}
              </Button>
            </Field>

            <FieldSeparator className='flex-1'>or continue with</FieldSeparator>

            <Field>
              <Button
                type='button'
                variant='outline'
                size='lg'
                disabled={isLoading}
                onClick={handleGoogleSignUp}
                className='w-full rounded-full'
              >
                Continue with Google
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='text-muted-foreground justify-center text-sm'>
        Already have an account?&nbsp;
        <Link
          href='/login'
          className='text-primary font-semibold hover:underline'
        >
          Log in
        </Link>
      </CardFooter>
    </Card>
  );
}
