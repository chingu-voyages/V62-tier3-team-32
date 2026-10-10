import { FarmerOrderCard } from '@/features/farmer/farmer-order-card';
import { PastOrderRow, type FarmerOrderView } from '@/features/orders/order-ui';
import { prisma } from '@/lib/prisma';

const PENDING_STATUSES = ['PENDING', 'CONFIRMED', 'READY'];
const HISTORY_LIMIT = 10;

export async function OrdersPanel({ farmerId }: { farmerId: string }) {
  const rows = await prisma.order.findMany({
    where: { farmerId },
    include: { items: true, consumer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const orders: FarmerOrderView[] = rows.map((o) => ({
    id: o.id,
    status: o.status,
    total: Number(o.total),
    createdAt: o.createdAt,
    consumerName: o.consumer.name,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
    })),
  }));

  // Oldest first: pending orders are a work queue
  const pending = orders
    .filter((o) => PENDING_STATUSES.includes(o.status))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const fulfilled = orders.filter((o) => !PENDING_STATUSES.includes(o.status));

  return (
    <div>
      <h1 className='font-display text-ink text-4xl font-bold'>Orders</h1>
      <p className='text-ink/70 mt-2 text-lg'>
        {pending.length === 0
          ? 'No orders waiting on you.'
          : `${pending.length} ${pending.length === 1 ? 'order needs' : 'orders need'} your attention.`}
      </p>

      <section className='mt-8'>
        <h2 className='font-display text-ink mb-3 text-2xl font-semibold'>Pending</h2>
        {pending.length === 0 ? (
          <div className='border-ink/20 rounded-3xl border-2 border-dashed p-8 text-center'>
            <p className='text-ink/60'>New orders from shoppers will appear here.</p>
          </div>
        ) : (
          <div className='space-y-5'>
            {pending.map((o) => (
              <FarmerOrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </section>

      <section className='mt-10'>
        <h2 className='font-display text-ink mb-3 text-2xl font-semibold'>Fulfilled</h2>
        {fulfilled.length === 0 ? (
          <p className='text-ink/60'>Completed and cancelled orders will show up here.</p>
        ) : (
          <>
            <div className='space-y-3'>
              {fulfilled.slice(0, HISTORY_LIMIT).map((o) => (
                <PastOrderRow key={o.id} order={o} name={o.consumerName} />
              ))}
            </div>
            {fulfilled.length > HISTORY_LIMIT && (
              <p className='text-ink/60 mt-3 text-sm'>
                Showing the latest {HISTORY_LIMIT} of {fulfilled.length}.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}