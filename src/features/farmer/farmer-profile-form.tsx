'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { saveFarmerProfile } from '@/app/actions/farmer';
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
import {
  CERTIFICATIONS,
  DELIVERY_OPTIONS,
  PRACTICES,
  type DeliveryValue,
} from '@/features/farmer/constants';
import { initials } from '@/lib/format';
import Image from 'next/image';

type Props = {
  isNew: boolean;
  defaults: {
    name: string;
    farmName: string;
    address: string;
    zipCode: string;
    deliveryOptions: DeliveryValue;
    about: string;
    certifications: string[];
    growingPractices: string[];
    ownerImage: string | null;
    farmImage: string | null;
  };
};

const MAX_BYTES = 2 * 1024 * 1024;

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PhotoField({
  id,
  label,
  current,
  fallback,
  round,
  disabled,
}: {
  id: string;
  label: string;
  current: string | null;
  fallback: string;
  round?: boolean;
  disabled: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(current);
  const shape = round ? 'rounded-full' : 'rounded-2xl';

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className='flex items-center gap-4'>
        {preview ? (
          <Image
            src={preview}
            width={64}
            height={64}
            alt=''
            className={`border-ink/10 h-16 w-16 shrink-0 border-2 object-cover ${shape}`}
          />
        ) : (
          <span
            aria-hidden
            className={`bg-accent text-ink font-display grid h-16 w-16 shrink-0 place-items-center text-xl font-semibold ${shape}`}
          >
            {fallback || '?'}
          </span>
        )}
        <Input
          id={id}
          name={id}
          type='file'
          accept='image/*'
          disabled={disabled}
          onChange={onChange}
          className='file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer rounded-xl file:mr-4 file:rounded-full file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold'
        />
      </div>
    </Field>
  );
}

function CheckGroup({
  legend,
  name,
  options,
  selected,
  disabled,
}: {
  legend: string;
  name: string;
  options: string[];
  selected: string[];
  disabled: boolean;
}) {
  return (
    <fieldset className='space-y-2'>
      <legend className='mb-1 text-sm font-medium'>{legend}</legend>
      <div className='grid gap-2 sm:grid-cols-2'>
        {options.map((option) => (
          <label key={option} className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              disabled={disabled}
              className='accent-brand h-4 w-4'
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function FarmerProfileForm({ isNew, defaults }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const otherCerts = defaults.certifications.filter(
    (c) => !CERTIFICATIONS.includes(c)
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSaved(false);

    const fd = new FormData(event.currentTarget);
    const ownerFile = fd.get('ownerPhoto') as File;
    const farmFile = fd.get('farmPhoto') as File;

    try {
      if (
        (ownerFile?.size ?? 0) > MAX_BYTES ||
        (farmFile?.size ?? 0) > MAX_BYTES
      ) {
        setError('Each photo must be smaller than 2MB.');
        return;
      }

      const certifications = [
        ...(fd.getAll('certification') as string[]),
        ...String(fd.get('otherCertifications') ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      ];

      const result = await saveFarmerProfile({
        name: fd.get('name') as string,
        farmName: fd.get('farmName') as string,
        address: fd.get('address') as string,
        zipCode: fd.get('zipCode') as string,
        deliveryOptions: fd.get('deliveryOptions') as DeliveryValue,
        about: (fd.get('about') as string) || undefined,
        certifications,
        growingPractices: fd.getAll('practice') as string[],
        ownerPhoto: ownerFile?.size ? await readFile(ownerFile) : undefined,
        farmPhoto: farmFile?.size ? await readFile(farmFile) : undefined,
      });

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.refresh();
      setSaved(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const textarea =
    'border-input bg-background w-full rounded-xl border px-3 py-2 text-sm disabled:opacity-50';

  return (
    <Card className='border-ink/10 w-full rounded-3xl border-2 bg-white'>
      <CardHeader>
        <CardTitle className='font-display text-3xl font-bold'>
          {isNew ? 'Finish your farm profile' : 'Edit your farm details'}
        </CardTitle>
        <CardDescription>
          Shoppers see this when they browse farms near them.
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
                Farm profile saved.
              </div>
            )}

            <Field>
              <FieldLabel htmlFor='name'>Owner name</FieldLabel>
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
              <FieldLabel htmlFor='farmName'>Farm name</FieldLabel>
              <Input
                id='farmName'
                name='farmName'
                defaultValue={defaults.farmName}
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='address'>Farm address</FieldLabel>
              <Input
                id='address'
                name='address'
                defaultValue={defaults.address}
                placeholder='1 Orchard Rd, Fresno, CA'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='zipCode'>ZIP code</FieldLabel>
              <Input
                id='zipCode'
                name='zipCode'
                defaultValue={defaults.zipCode}
                inputMode='numeric'
                placeholder='93701'
                required
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <fieldset className='space-y-2'>
              <legend className='mb-1 text-sm font-medium'>
                Delivery options
              </legend>
              {DELIVERY_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className='border-ink/10 flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3'
                >
                  <input
                    type='radio'
                    name='deliveryOptions'
                    value={o.value}
                    defaultChecked={defaults.deliveryOptions === o.value}
                    required
                    disabled={isLoading}
                    className='accent-brand mt-1 h-4 w-4'
                  />
                  <span>
                    <span className='block text-sm font-semibold'>
                      {o.label}
                    </span>
                    <span className='text-muted-foreground block text-xs'>
                      {o.hint}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>

            <Field>
              <FieldLabel htmlFor='about'>
                About your farm (optional)
              </FieldLabel>
              <textarea
                id='about'
                name='about'
                defaultValue={defaults.about}
                rows={4}
                maxLength={1000}
                disabled={isLoading}
                className={textarea}
              />
            </Field>

            <CheckGroup
              legend='Certifications'
              name='certification'
              options={CERTIFICATIONS}
              selected={defaults.certifications}
              disabled={isLoading}
            />

            <Field>
              <FieldLabel htmlFor='otherCertifications'>
                Other certifications (separate with commas)
              </FieldLabel>
              <Input
                id='otherCertifications'
                name='otherCertifications'
                defaultValue={otherCerts.join(', ')}
                disabled={isLoading}
                className='rounded-xl'
              />
            </Field>

            <CheckGroup
              legend='Growing practices'
              name='practice'
              options={PRACTICES}
              selected={defaults.growingPractices}
              disabled={isLoading}
            />

            <PhotoField
              id='ownerPhoto'
              label='Photo of you (optional)'
              current={defaults.ownerImage}
              fallback={initials(defaults.name)}
              round
              disabled={isLoading}
            />
            <PhotoField
              id='farmPhoto'
              label='Photo of your farm (optional)'
              current={defaults.farmImage}
              fallback=''
              disabled={isLoading}
            />
            <Field>
              <div className='flex gap-3'>
                <Button
                  type='submit'
                  size='lg'
                  disabled={isLoading}
                  className='w-full rounded-full font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-0.5'
                >
                  {isLoading
                    ? 'Saving...'
                    : isNew
                      ? 'Save farm profile'
                      : 'Save changes'}
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
