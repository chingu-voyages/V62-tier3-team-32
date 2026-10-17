'use client';

import { updatePickupDeliveryStatus } from '@/app/actions/pickup-delivery';
import { StatusPill } from '@/features/orders/order-ui';
import { useState, useTransition } from 'react';

type RequestView = {
  id: string;
  method: string;
  status: string;
  consumerName: string;
  address: string | null;
  slotStart: string;
  slotEnd: string;
  timeZone: string;
};

export function PickupDeliveryRequestCard({
  request,
}: {
  request: RequestView;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone: request.timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: request.timeZone,
    hour: 'numeric',
    minute: '2-digit',
  });
  function change(status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') {
    setError('');
    startTransition(async () => {
      try {
        const result = await updatePickupDeliveryStatus(request.id, status);
        if ('error' in result) setError(result.error);
      } catch {
        setError('Unable to update. Please try again.');
      }
    });
  }
  const active = request.status === 'PENDING' || request.status === 'CONFIRMED';
  return (
    <article className='border-ink/10 rounded-3xl border-2 bg-white p-6'>
      <div className='flex items-start justify-between gap-4'>
        <h3 className='font-display text-2xl font-semibold'>
          {request.consumerName}
        </h3>
        <StatusPill status={request.status} />
      </div>
      <p className='mt-2 font-semibold'>
        {request.method === 'PICKUP' ? 'Pickup' : 'Delivery'} request
      </p>
      <p>{date.format(new Date(request.slotStart))}</p>
      <p>
        {time.format(new Date(request.slotStart))} -{' '}
        {time.format(new Date(request.slotEnd))} ({request.timeZone})
      </p>
      <p className='mt-2 whitespace-pre-wrap'>
        <strong>
          {request.method === 'DELIVERY'
            ? 'Delivery address'
            : 'Pickup location'}
          :
        </strong>{' '}
        {request.address || 'Not listed'}
      </p>
      {error && (
        <p role='alert' className='mt-3 text-red-700'>
          {error}
        </p>
      )}
      {active && (
        <div className='mt-4 flex flex-wrap gap-3'>
          <button
            type='button'
            disabled={pending}
            onClick={() =>
              change(request.status === 'PENDING' ? 'CONFIRMED' : 'COMPLETED')
            }
            className='bg-brand text-cream rounded-full px-5 py-2 font-bold disabled:opacity-50'
          >
            {pending
              ? 'Updating...'
              : request.status === 'PENDING'
                ? 'Confirm request'
                : 'Mark completed'}
          </button>
          <button
            type='button'
            disabled={pending}
            onClick={() => change('CANCELLED')}
            className='text-coral rounded-full px-5 py-2 font-bold disabled:opacity-50'
          >
            {request.status === 'PENDING' ? 'Decline' : 'Cancel request'}
          </button>
        </div>
      )}
    </article>
  );
}
