'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';
import { authClient } from '@/lib/auth/auth-client';

export function LoginForm() {
  const [role, setRole] = useState('consumer');
  const router = useRouter();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await authClient.signIn.email(
      {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
      {
        onSuccess: () => {
          router.replace('/');
          toast.add({
            type: 'success',
            description: 'Logged in successfully.',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FieldGroup>
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
            Log in as {role === 'farmer' ? 'farmer' : 'consumer'}
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
  );
}
