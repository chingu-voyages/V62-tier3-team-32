'use client';

import { useRef, useState, useTransition } from 'react';

import {
  deleteOffering,
  saveOffering,
  setOfferingAvailability,
} from '@/app/actions/farmer';
import { Input } from '@/components/ui/input';

export type OfferingView = {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
};

const primaryBtn =
  'bg-brand text-cream rounded-full px-5 py-2.5 text-sm font-bold shadow-[3px_3px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-50';

function AddOfferingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await saveOffering({
        name: fd.get('name') as string,
        unit: fd.get('unit') as string,
        price: Number(fd.get('price')),
        quantity: Number(fd.get('quantity')),
        isAvailable: true,
      });
      if ('error' in result) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className='border-ink/10 rounded-3xl border-2 bg-white p-6'>
      <h2 className='font-display text-ink text-2xl font-semibold'>Add an offering</h2>
      <div className='mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]'>
        <label className='text-sm font-medium'>
          Name
          <Input name='name' required placeholder='Heirloom tomatoes' disabled={isPending} className='mt-1 rounded-xl' />
        </label>
        <label className='text-sm font-medium'>
          Unit
          <Input name='unit' required placeholder='lb' disabled={isPending} className='mt-1 rounded-xl' />
        </label>
        <label className='text-sm font-medium'>
          Price ($)
          <Input name='price' type='number' step='0.01' min='0.01' required disabled={isPending} className='mt-1 rounded-xl' />
        </label>
        <label className='text-sm font-medium'>
          In stock
          <Input name='quantity' type='number' min='0' step='1' required defaultValue='0' disabled={isPending} className='mt-1 rounded-xl' />
        </label>
      </div>
      {error && (
        <p role='alert' className='text-destructive bg-destructive/10 mt-3 rounded-xl p-3 text-sm font-medium'>
          {error}
        </p>
      )}
      <button type='submit' disabled={isPending} className={`${primaryBtn} mt-4`}>
        {isPending ? 'Adding...' : 'Add offering'}
      </button>
    </form>
  );
}

function OfferingRow({ offering }: { offering: OfferingView }) {
  const [price, setPrice] = useState(String(offering.price));
  const [quantity, setQuantity] = useState(String(offering.quantity));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty = Number(price) !== offering.price || Number(quantity) !== offering.quantity;

  function run(fn: () => Promise<{ error: string } | { success: true }>) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if ('error' in result) setError(result.error);
    });
  }

  return (
    <li className={`border-ink/10 rounded-2xl border-2 bg-white p-4 ${offering.isAvailable ? '' : 'opacity-70'}`}>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='text-ink font-semibold'>{offering.name}</p>
          <p className='text-ink/60 text-sm'>
            per {offering.unit}
            {offering.isAvailable && offering.quantity === 0 ? ' (out of stock)' : ''}
          </p>
        </div>

        <div className='flex flex-wrap items-end gap-3'>
          <label className='text-xs font-medium'>
            Price ($)
            <Input
              type='number'
              step='0.01'
              min='0.01'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isPending}
              className='mt-1 w-24 rounded-xl'
            />
          </label>
          <label className='text-xs font-medium'>
            In stock
            <Input
              type='number'
              min='0'
              step='1'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isPending}
              className='mt-1 w-24 rounded-xl'
            />
          </label>
          {dirty && (
            <button
              type='button'
              disabled={isPending}
              onClick={() =>
                run(() =>
                  saveOffering({
                    id: offering.id,
                    name: offering.name,
                    unit: offering.unit,
                    price: Number(price),
                    quantity: Number(quantity),
                    isAvailable: offering.isAvailable,
                  }),
                )
              }
              className={primaryBtn}
            >
              Save
            </button>
          )}
        </div>
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-2'>
        <button
          type='button'
          disabled={isPending}
          aria-pressed={offering.isAvailable}
          onClick={() => run(() => setOfferingAvailability(offering.id, !offering.isAvailable))}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors disabled:opacity-50 ${
            offering.isAvailable ? 'bg-brand/15 text-brand hover:bg-brand/25' : 'bg-ink/10 text-ink/70 hover:bg-ink/20'
          }`}
        >
          {offering.isAvailable ? 'Available now' : 'Hidden from shoppers'}
        </button>
        <button
          type='button'
          disabled={isPending}
          onClick={() => {
            if (window.confirm(`Delete "${offering.name}"?`)) run(() => deleteOffering(offering.id));
          }}
          className='text-coral hover:bg-coral/10 rounded-full px-4 py-1.5 text-sm font-bold transition-colors disabled:opacity-50'
        >
          Delete
        </button>
      </div>

      {error && (
        <p role='alert' className='text-destructive mt-2 text-sm font-medium'>
          {error}
        </p>
      )}
    </li>
  );
}

export function OfferingsManager({ offerings }: { offerings: OfferingView[] }) {
  return (
    <div className='space-y-8'>
      <AddOfferingForm />
      {offerings.length === 0 ? (
        <div className='border-ink/20 rounded-3xl border-2 border-dashed p-8 text-center'>
          <p className='font-display text-ink text-2xl font-semibold'>Nothing listed yet.</p>
          <p className='text-ink/60 mt-1'>Add what you have today so shoppers can see it.</p>
        </div>
      ) : (
        <ul className='space-y-3'>
          {offerings.map((o) => (
            <OfferingRow key={`${o.id}-${o.price}-${o.quantity}`} offering={o} />
          ))}
        </ul>
      )}
    </div>
  );
}