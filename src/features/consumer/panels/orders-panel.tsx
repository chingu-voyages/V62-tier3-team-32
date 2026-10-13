import {
  EmptyPending,
  PastOrderRow,
  PendingOrderCard,
  type OrderView,
} from '@/features/orders/order-ui';
import { prisma } from '@/lib/prisma';

const PENDING_STATUSES = ['PENDING', 'CONFIRMED', 'READY'];
const HISTORY_LIMIT = 10;

export async function OrdersPanel({
  consumerId,
  firstName,
  zipCode
}: {
  consumerId: string;
  firstName: string;
  zipCode: string | null;
}) {
  const rows = await prisma.order.findMany({
    where: { consumerId },
    include: {
      items: true,
      farmer: { select: { name: true, farmerProfile: { select: { farmName: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const orders: OrderView[] = rows.map((o) => ({
    id: o.id,
    status: o.status,
    total: Number(o.total),
    createdAt: o.createdAt,
    farmerName: o.farmer.farmerProfile?.farmName ?? o.farmer.name,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
    })),
  }));

  const pending = orders.filter((o) => PENDING_STATUSES.includes(o.status));
  const past = orders.filter((o) => !PENDING_STATUSES.includes(o.status));

  const summary =
    pending.length === 0
      ? 'Nothing in progress right now.'
      : `${pending.length} ${pending.length === 1 ? 'order is' : 'orders are'} on the way.`;

  return (
    <div>
      <h1 className='font-display text-ink text-4xl leading-tight font-bold'>
        Hi {firstName}, here are your orders.
      </h1>
      <p className='text-ink/70 mt-2 text-lg'>{summary}</p>

      <section className='mt-8'>
        <h2 className='font-display text-ink mb-3 text-2xl font-semibold'>Pending</h2>
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

      <section className='mt-10'>
        <h2 className='font-display text-ink mb-3 text-2xl font-semibold'>Past</h2>
        {past.length === 0 ? (
          <p className='text-ink/60'>Completed and cancelled orders will show up here.</p>
        ) : (
          <>
            <div className='space-y-3'>
              {past.slice(0, HISTORY_LIMIT).map((o) => (
                <PastOrderRow key={o.id} order={o} name={o.farmerName} />
              ))}
            </div>
            {past.length > HISTORY_LIMIT && (
              <p className='text-ink/60 mt-3 text-sm'>
                Showing the latest {HISTORY_LIMIT} of {past.length}.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}