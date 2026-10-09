'use client';

import { useState, useTransition } from 'react';

import { setOrderStatus } from '@/app/actions/farmer';
import { FarmerOrderView, ItemLines, OrderProgress, type OrderView } from '@/features/orders/order-ui';
import { money, shortDate } from '@/lib/format';

type NextStatus = 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED';

const ACTIONS: Record<
  string,
  { primary: { label: string; status: NextStatus }; secondary: { label: string; status: NextStatus } }
> = {
  PENDING: {
    primary: { label: 'Confirm order', status: 'CONFIRMED' },
    secondary: { label: 'Decline', status: 'CANCELLED' },
  },
  CONFIRMED: {
    primary: { label: 'Mark ready', status: 'READY' },
    secondary: { label: 'Cancel order', status: 'CANCELLED' },
  },
  READY: {
    primary: { label: 'Mark completed', status: 'COMPLETED' },
    secondary: { label: 'Cancel order', status: 'CANCELLED' },
  },
};

export function FarmerOrderCard({ order }: { order: FarmerOrderView }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const actions = ACTIONS[order.status];

  function change(status: NextStatus) {
    if (status === 'CANCELLED' && !window.confirm('Cancel this order? The shopper will see it as cancelled.')) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await setOrderStatus(order.id, status);
      if ('error' in result) setError(result.error);
    });
  }

  return (
    <article className='border-ink/10 rounded-3xl border-2 bg-white p-6 shadow-[4px_4px_0_rgba(33,48,28,0.15)]'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h3 className='font-display text-ink text-2xl font-semibold'>{order.consumerName}</h3>
          <p className='text-ink/60 text-sm'>Ordered {shortDate(order.createdAt)}</p>
        </div>
        <p className='font-display text-ink text-2xl font-semibold'>{money(order.total)}</p>
      </div>

      <OrderProgress status={order.status} />

      <div className='border-ink/10 mt-5 border-t pt-4'>
        <ItemLines items={order.items} />
      </div>

      {error && (
        <p role='alert' className='text-destructive bg-destructive/10 mt-4 rounded-xl p-3 text-sm font-medium'>
          {error}
        </p>
      )}

      {actions && (
        <div className='mt-5 flex flex-wrap gap-3'>
          <button
            type='button'
            disabled={isPending}
            onClick={() => change(actions.primary.status)}
            className='bg-brand text-cream rounded-full px-6 py-3 font-bold shadow-[3px_3px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-50'
          >
            {isPending ? 'Updating...' : actions.primary.label}
          </button>
          <button
            type='button'
            disabled={isPending}
            onClick={() => change(actions.secondary.status)}
            className='text-coral hover:bg-coral/10 rounded-full px-5 py-3 font-bold transition-colors disabled:opacity-50'
          >
            {actions.secondary.label}
          </button>
        </div>
      )}
    </article>
  );
}