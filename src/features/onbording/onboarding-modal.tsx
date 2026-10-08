'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { saveConsumerProfile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { initials } from '@/lib/format';

type Props = {
  mode: 'onboarding' | 'edit';
  defaults: {
    name: string;
    address: string;
    zipCode: string;
    image: string | null;
  };
};

export function ProfileForm({ mode, defaults }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaults.image);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSaved(false);

    const formData = new FormData(event.currentTarget);
    const photo = formData.get('photo') as File;

    try {
      let image: string | undefined;

      if (photo && photo.size > 0) {
        if (photo.size > 2 * 1024 * 1024) {
          setError('Image must be smaller than 2MB.');
          return;
        }
        image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo);
        });
      }

      const result = await saveConsumerProfile({
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        zipCode: formData.get('zipCode') as string,
        image,
      });

      if ('error' in result) {
        setError(result.error);
        return;
      }

      if (mode === 'onboarding') {
        router.replace('/orders');
      } else {
        router.refresh(); // re-fetch server data so the new values show everywhere
        setSaved(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <Card className='border-ink/10 w-full rounded-3xl border-2 bg-white'>
      <CardHeader className='text-center'>
        <CardTitle className='font-display text-3xl font-bold'>
          {mode === 'onboarding' ? 'Complete your profile' : 'Edit your details'}
        </CardTitle>
        <CardDescription>
          {mode === 'onboarding'
            ? 'Tell us a bit about yourself to get started.'
            : 'Keep your information up to date.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className='text-destructive bg-destructive/10 rounded-xl p-3 text-center text-sm font-medium'>
                {error}
              </div>
            )}
            {saved && (
              <div className='rounded-xl bg-green-100 p-3 text-center text-sm font-medium text-green-800'>
                Profile updated.
              </div>
            )}

            <Field>
              <FieldLabel htmlFor='name'>Full Name</FieldLabel>
              <Input
                id='name'
                name='name'
                defaultValue={defaults.name}
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
                defaultValue={defaults.address}
                placeholder='123 Main St, City'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='zipCode'>ZIP Code</FieldLabel>
              <Input
                id='zipCode'
                name='zipCode'
                defaultValue={defaults.zipCode}
                inputMode='numeric'
                placeholder='90210'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='photo'>Profile photo (optional)</FieldLabel>
              <div className='flex items-center gap-4'>
                {preview ? (
                  <img
                    src={preview}
                    alt=''
                    className='border-ink/10 h-16 w-16 shrink-0 rounded-full border-2 object-cover'
                  />
                ) : (
                  <span
                    aria-hidden
                    className='bg-accent text-ink font-display grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-semibold'
                  >
                    {initials(defaults.name) || '?'}
                  </span>
                )}
                <Input
                  id='photo'
                  name='photo'
                  type='file'
                  accept='image/*'
                  disabled={isLoading}
                  onChange={handlePhotoChange}
                  className='file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer rounded-xl file:mr-4 file:rounded-full file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold'
                />
              </div>
            </Field>

            <Field>
              <Button
                type='submit'
                size='lg'
                disabled={isLoading}
                className='w-full rounded-full font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-0.5'
              >
                {isLoading
                  ? 'Saving...'
                  : mode === 'onboarding'
                    ? 'Continue'
                    : 'Save changes'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
