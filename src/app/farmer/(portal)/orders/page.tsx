import { FarmerOrderCard } from '@/features/farmer/farmer-order-card';
import { FarmerOrderView, PastOrderRow, type OrderView } from '@/features/orders/order-ui';
import { prisma } from '@/lib/prisma';
import { requireFarmer } from '@/lib/session';

const PENDING_STATUSES = ['PENDING', 'CONFIRMED', 'READY'];

export default async function FarmerOrdersPage() {
  const session = await requireFarmer();

  const rows = await prisma.order.findMany({
    where: { farmerId: session.user.id },
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

  // Oldest first: this is a work queue
  const pending = orders
    .filter((o) => PENDING_STATUSES.includes(o.status))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const fulfilled = orders.filter((o) => !PENDING_STATUSES.includes(o.status));

  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <h1 className='font-display text-ink text-4xl font-bold lg:text-5xl'>Orders</h1>
      <p className='text-ink/70 mt-3 text-lg'>
        {pending.length === 0
          ? 'No orders waiting on you.'
          : `${pending.length} ${pending.length === 1 ? 'order needs' : 'orders need'} your attention.`}
      </p>

      <section className='mt-10'>
        <h2 className='font-display text-ink mb-4 text-2xl font-semibold'>Pending orders</h2>
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

      <section className='mt-12'>
        <h2 className='font-display text-ink mb-4 text-2xl font-semibold'>Fulfilled orders</h2>
        {fulfilled.length === 0 ? (
          <p className='text-ink/60'>Completed and cancelled orders will show up here.</p>
        ) : (
          <div className='space-y-3'>
            {fulfilled.map((o) => (
              <PastOrderRow key={o.id} order={o} name={o.consumerName}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}