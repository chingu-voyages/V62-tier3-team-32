// src/app/(consumer)/orders/page.tsx
import { headers } from 'next/headers';

import {
  EmptyPending,
  PastOrderRow,
  PendingOrderCard,
  type OrderView,
} from '@/features/orders/order-ui';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

const PENDING_STATUSES = ['PENDING', 'CONFIRMED', 'READY'];

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const rows = await prisma.order.findMany({
    where: { consumerId: session!.user.id },
    include: { items: true, farmer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const orders: OrderView[] = rows.map((o) => ({
    id: o.id,
    status: o.status,
    total: Number(o.total),
    createdAt: o.createdAt,
    farmerName: o.farmer.name,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
    })),
  }));

  const pending = orders.filter((o) => PENDING_STATUSES.includes(o.status));
  const past = orders.filter((o) => !PENDING_STATUSES.includes(o.status));
  const firstName = session!.user.name.split(' ')[0];

  const summary =
    pending.length === 0
      ? 'Nothing in progress right now.'
      : `${pending.length} ${pending.length === 1 ? 'order is' : 'orders are'} on the way.`;

  return (
    <div className='bg-cream min-h-screen w-full'>
      <div className='mx-auto max-w-3xl px-6 py-14'>
        <h1 className='font-display text-ink text-4xl leading-tight font-bold lg:text-5xl'>
          Hi {firstName}, here are your orders.
        </h1>
        <p className='text-ink/70 mt-3 text-lg'>{summary}</p>

        <section className='mt-10'>
          <h2 className='font-display text-ink mb-4 text-2xl font-semibold'>In progress</h2>
          {pending.length === 0 ? (
            <EmptyPending />
          ) : (
            <div className='space-y-5'>
              {pending.map((o) => (
                <PendingOrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </section>

        <section className='mt-12'>
          <h2 className='font-display text-ink mb-4 text-2xl font-semibold'>History</h2>
          {past.length === 0 ? (
            <p className='text-ink/60'>Completed and cancelled orders will show up here.</p>
          ) : (
            <div className='space-y-3'>
              {past.map((o) => (
                <PastOrderRow key={o.id} order={o} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}