'use client';

import Link from 'next/link';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { login } from '@/features/actions';

// todo: decide between actions, RHF, Tanstack; refactor accordingly
export function LoginCard() {
  const [role, setRole] = useState('consumer');

  return (
    <Card className='mx-auto w-full max-w-md rounded-3xl border-2'>
      <CardHeader className='text-center'>
        <CardTitle className='font-display text-3xl font-bold'>
          Log in
        </CardTitle>
        <CardDescription>Choose your account type to continue.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <form action={login}>
          <FieldGroup>
            <Field>
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
            </Field>
            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@example.com'
                required
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
                className='rounded-xl'
              />
            </Field>
            <Field orientation='horizontal' className='gap-2'>
              <Checkbox id='remember' name='remember' />
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
                className='w-full rounded-full font-bold'
              >
                Log in as {role === 'farmer' ? 'farmer' : 'shopper'}
              </Button>
            </Field>
            <FieldSeparator className='flex-1'>or continue with</FieldSeparator>
            <Field>
              <Button
                type='button'
                variant='outline'
                size='lg'
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
