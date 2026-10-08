import Link from 'next/link';

import { money, shortDate } from '@/lib/format';

export type OrderBase = {
  id: string;
  status: string;
  total: number;
  createdAt: Date;
  items: { id: string; name: string; quantity: number; unitPrice: number }[];
};

const PILL: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Placed', className: 'bg-accent/40 text-ink' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-brand/15 text-brand' },
  READY: { label: 'Ready', className: 'bg-brand text-cream' },
  COMPLETED: { label: 'Completed', className: 'bg-ink/10 text-ink/70' },
  CANCELLED: { label: 'Cancelled', className: 'bg-coral/15 text-coral' },
};

export function StatusPill({ status }: { status: string }) {
  const pill = PILL[status] ?? {
    label: status,
    className: 'bg-ink/10 text-ink',
  };
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${pill.className}`}
    >
      {pill.label}
    </span>
  );
}

const STEPS = ['Placed', 'Confirmed', 'Ready'];
const STEP_INDEX: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  READY: 2,
};

export function OrderProgress({ status }: { status: string }) {
  const current = STEP_INDEX[status] ?? 0;
  return (
    <ol aria-label='Order progress' className='mt-5 flex items-center'>
      {STEPS.map((step, i) => {
        const reached = i <= current;
        return (
          <li key={step} className='flex flex-1 items-center last:flex-none'>
            <span
              aria-current={i === current ? 'step' : undefined}
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                reached ? 'bg-brand text-cream' : 'bg-ink/10 text-ink/50'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`ml-2 text-sm font-semibold ${
                reached ? 'text-ink' : 'text-ink/40'
              } ${i === current ? '' : 'hidden sm:inline'}`}
            >
              {step}
            </span>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`mx-3 h-0.5 flex-1 rounded ${i < current ? 'bg-brand' : 'bg-ink/10'}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function ItemLines({ items }: { items: OrderView['items'] }) {
  return (
    <ul className='space-y-1 text-sm'>
      {items.map((item) => (
        <li key={item.id} className='flex justify-between gap-4'>
          <span>
            {item.quantity} × {item.name}
          </span>
          <span className='text-ink/60'>
            {money(item.unitPrice * item.quantity)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PendingOrderCard({ order }: { order: OrderView }) {
  return (
    <article className='border-ink/10 rounded-3xl border-2 bg-white p-6 shadow-[4px_4px_0_rgba(33,48,28,0.15)]'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h3 className='font-display text-ink text-2xl font-semibold'>
            {order.farmerName}
          </h3>
          <p className='text-ink/60 text-sm'>
            Ordered {shortDate(order.createdAt)}
          </p>
        </div>
        <p className='font-display text-ink text-2xl font-semibold'>
          {money(order.total)}
        </p>
      </div>
      <OrderProgress status={order.status} />
      <div className='border-ink/10 mt-5 border-t pt-4'>
        <ItemLines items={order.items} />
      </div>
    </article>
  );
}

export function PastOrderRow({
  order,
  name,
}: {
  order: OrderBase;
  name: string;
}) {
  return (
    <details className='group border-ink/10 rounded-2xl border-2 bg-white'>
      <summary className='focus-visible:ring-brand flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-4 focus-visible:ring-2 [&::-webkit-details-marker]:hidden'>
        <div>
          <p className='text-ink font-semibold'>{name}</p>
          <p className='text-ink/60 text-sm'>{shortDate(order.createdAt)}</p>
        </div>
        <div className='flex items-center gap-3'>
          <StatusPill status={order.status} />
          <span className='text-ink font-semibold'>{money(order.total)}</span>
          <span
            aria-hidden
            className='text-ink/40 transition-transform group-open:rotate-90'
          >
            ›
          </span>
        </div>
      </summary>
      <div className='border-ink/10 border-t px-4 py-3'>
        <ItemLines items={order.items} />
      </div>
    </details>
  );
}

export function EmptyPending() {
  return (
    <div className='border-ink/20 rounded-3xl border-2 border-dashed p-8 text-center'>
      <p className='font-display text-ink text-2xl font-semibold'>
        Nothing on the way.
      </p>
      <p className='text-ink/60 mt-1'>
        Browse farms near you and place your first order.
      </p>
      <Link
        href='/#farms'
        className='bg-brand text-cream mt-5 inline-block rounded-full px-6 py-3 font-bold shadow-[4px_4px_0_rgba(33,48,28,0.3)] transition-transform hover:-translate-y-0.5'
      >
        Find farms near me
      </Link>
    </div>
  );
}

export type OrderView = OrderBase & { farmerName: string };
export type FarmerOrderView = OrderBase & { consumerName: string };
