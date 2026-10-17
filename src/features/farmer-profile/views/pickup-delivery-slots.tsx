'use client';

import { createPickupDeliveryRequest } from '@/app/actions/pickup-delivery';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import styles from './farmerProfile.module.css';
import { getRequestDays } from './pickup-delivery-schedule';

export type ConsumerDetails = { name: string; address: string | null };
type Props = {
  farmerId: string;
  farmName: string;
  farmAddress: string | null;
  consumer: ConsumerDetails | null;
  pickup: boolean;
  delivery: boolean;
};
type Method = 'pickup' | 'delivery';

export function PickupDeliverySlots({
  farmerId,
  farmName,
  farmAddress,
  consumer,
  pickup,
  delivery,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [method, setMethod] = useState<Method>('pickup');
  const [days, setDays] = useState<ReturnType<typeof getRequestDays>>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const requestId = useRef('');
  const submitting = useRef(false);
  const selectedDay = days.find((day) => day.value === date);

  function open(next: Method) {
    if (submitting.current) return;
    const nextDays = getRequestDays(new Date());
    setMethod(next);
    setDays(nextDays);
    setDate(nextDays.find((day) => day.slots.length)?.value ?? '');
    setTime('');
    setError('');
    setSaved(false);
    requestId.current = crypto.randomUUID();
    dialog.current?.showModal();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || saved) return;
    const currentDay = getRequestDays(new Date()).find(
      (day) => day.value === date
    );
    const slot = currentDay?.slots.find((item) => item.value === time);
    if (!slot) {
      setDays(getRequestDays(new Date()));
      setTime('');
      setError('Choose a future date and time slot.');
      return;
    }
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const address = String(data.get('address') ?? '').trim();
    if (!name || (method === 'delivery' && !address)) {
      setError('Enter your name and delivery address.');
      return;
    }
    submitting.current = true;
    setSaving(true);
    setError('');
    try {
      const result = await createPickupDeliveryRequest({
        id: requestId.current,
        farmerId,
        method: method === 'pickup' ? 'PICKUP' : 'DELIVERY',
        consumerName: name,
        address,
        slotStart: slot.start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if ('error' in result) setError(result.error);
      else setSaved(true);
    } catch {
      setError('Unable to save your request. Please try again.');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  if (!consumer) return null;

  return (
    <>
      {pickup && (
        <button
          type='button'
          className={styles.button}
          onClick={() => open('pickup')}
        >
          Request pickup
        </button>
      )}
      {delivery && (
        <button
          type='button'
          className={`${styles.button} ${styles.delivery}`}
          onClick={() => open('delivery')}
        >
          Request delivery
        </button>
      )}
      <dialog
        ref={dialog}
        aria-labelledby='pickup-delivery-title'
        onCancel={(event) => {
          if (submitting.current) event.preventDefault();
        }}
        className='fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border border-[#d8dec7] bg-white p-6 text-[#203323] shadow-xl backdrop:bg-black/40'
      >
        <div className='mb-4 flex items-start justify-between gap-4'>
          <h2
            id='pickup-delivery-title'
            className='font-display text-2xl font-bold'
          >
            Choose {method} date and time
          </h2>
          <button
            type='button'
            className='rounded-lg px-2 py-1 font-bold focus-visible:outline-2'
            aria-label='Close scheduling'
            disabled={saving}
            onClick={() => dialog.current?.close()}
          >
            Close
          </button>
        </div>
        <p className='mb-5 text-sm'>
          Request a one-hour slot with {farmName}. Times use your device&apos;s
          local time zone. Availability must be confirmed by the farmer.
        </p>
        {!consumer ? (
          <p>
            <Link href='/login' className='font-bold underline'>
              Sign in as a shopper
            </Link>{' '}
            to choose a slot and use your delivery details.
          </p>
        ) : (
          <form
            key={method}
            onSubmit={submit}
            className='space-y-5'
            onChange={() => {
              setError('');
            }}
          >
            <fieldset disabled={saving || saved} className='space-y-5'>
              <Field>
                <FieldLabel htmlFor='pickup-delivery-name'>
                  Consumer name
                </FieldLabel>
                <Input
                  id='pickup-delivery-name'
                  name='name'
                  autoComplete='name'
                  defaultValue={consumer.name}
                  maxLength={150}
                  required
                />
              </Field>
              {method === 'delivery' ? (
                <Field>
                  <FieldLabel htmlFor='pickup-delivery-address'>
                    Delivery address
                  </FieldLabel>
                  <Input
                    id='pickup-delivery-address'
                    name='address'
                    autoComplete='street-address'
                    defaultValue={consumer.address ?? ''}
                    placeholder='Street, apartment, city, state, ZIP code'
                    maxLength={500}
                    required
                  />
                  <p className='text-sm'>
                    Prefilled from your profile. Changes here apply to this
                    request only.
                  </p>
                </Field>
              ) : (
                <p className='text-sm'>
                  <strong>Pickup location:</strong>{' '}
                  {farmAddress || 'Confirm the location with the farmer.'}
                </p>
              )}
              <fieldset>
                <legend className='mb-2 text-sm font-semibold'>
                  Choose a date
                </legend>
                <div className='flex flex-wrap gap-2'>
                  {days.map((day) => (
                    <label
                      key={day.value}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${day.slots.length ? 'cursor-pointer' : 'opacity-50'} ${date === day.value ? 'border-green-700 bg-green-50' : 'border-[#d8dec7]'}`}
                    >
                      <input
                        type='radio'
                        name='date'
                        value={day.value}
                        checked={date === day.value}
                        disabled={!day.slots.length}
                        onChange={() => {
                          setDate(day.value);
                          setTime('');
                        }}
                        required
                      />
                      {day.label}
                      {!day.slots.length && ' (No slots left)'}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className='mb-2 text-sm font-semibold'>
                  Choose a time
                </legend>
                <div className='flex flex-wrap gap-2'>
                  {selectedDay?.slots.map((slot) => (
                    <label
                      key={slot.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${time === slot.value ? 'border-green-700 bg-green-50' : 'border-[#d8dec7]'}`}
                    >
                      <input
                        type='radio'
                        name='time'
                        value={slot.value}
                        checked={time === slot.value}
                        onChange={() => setTime(slot.value)}
                        required
                      />
                      {slot.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </fieldset>
            {error && (
              <p role='alert' className='text-sm text-red-700'>
                {error}
              </p>
            )}
            {saved && (
              <p role='status' className='text-sm text-green-800'>
                Your {method} request has been saved. The farmer can review it
                in their Orders tab. Awaiting confirmation.
              </p>
            )}
            <button
              type='submit'
              className={styles.button}
              disabled={!date || !time || saving || saved}
            >
              {saving
                ? 'Saving...'
                : saved
                  ? 'Request saved'
                  : `Request ${method}`}
            </button>
          </form>
        )}
      </dialog>
    </>
  );
}
