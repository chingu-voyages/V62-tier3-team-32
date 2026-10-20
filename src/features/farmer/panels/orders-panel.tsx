import { FarmerOrderCard } from '@/features/farmer/farmer-order-card';
import { PickupDeliveryRequestCard } from '@/features/farmer/pickup-delivery-request-card';
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

  const requests = await prisma.pickupDeliveryRequest.findMany({
    where: { farmerId },
    orderBy: { slotStart: 'asc' },
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

  const entries = [
    ...orders.map((order) => ({ kind: 'order' as const, ...order })),
    ...requests.map((request) => ({
      kind: 'request' as const,
      ...request,
      saleAmount:
        request.saleAmount === null ? null : Number(request.saleAmount),
      slotStart: request.slotStart.toISOString(),
      slotEnd: request.slotEnd.toISOString(),
    })),
  ];

  // Oldest first: pending orders and slot requests share one work queue.
  const pending = entries
    .filter((entry) => PENDING_STATUSES.includes(entry.status))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const fulfilled = entries
    .filter((entry) => ['COMPLETED', 'CANCELLED'].includes(entry.status))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div>
      <h1 className='font-display text-ink text-4xl font-bold'>Orders</h1>
      <p className='text-ink/70 mt-2 text-lg'>
        {pending.length === 0
          ? 'No orders or requests waiting on you.'
          : `${pending.length} ${pending.length === 1 ? 'order or request needs' : 'orders and requests need'} your attention.`}
      </p>

      <section className='mt-8'>
        <h2 className='font-display text-ink mb-3 text-2xl font-semibold'>
          Pending
        </h2>
        {pending.length === 0 ? (
          <div className='border-ink/20 rounded-3xl border-2 border-dashed p-8 text-center'>
            <p className='text-ink/60'>
              New orders and pickup/delivery requests from shoppers will appear
              here.
            </p>
          </div>
        ) : (
          <div className='space-y-5'>
            {pending.map((entry) =>
              entry.kind === 'request' ? (
                <PickupDeliveryRequestCard
                  key={`request-${entry.id}`}
                  request={entry}
                />
              ) : (
                <FarmerOrderCard key={`order-${entry.id}`} order={entry} />
              )
            )}
          </div>
        )}
      </section>

      <section className='mt-10'>
        <h2 className='font-display text-ink mb-3 text-2xl font-semibold'>
          Fulfilled
        </h2>
        {fulfilled.length === 0 ? (
          <p className='text-ink/60'>
            Completed and cancelled orders and pickup/delivery requests will
            show up here.
          </p>
        ) : (
          <>
            <div className='space-y-3'>
              {fulfilled
                .slice(0, HISTORY_LIMIT)
                .map((entry) =>
                  entry.kind === 'request' ? (
                    <PickupDeliveryRequestCard
                      key={`request-${entry.id}`}
                      request={entry}
                    />
                  ) : (
                    <PastOrderRow
                      key={`order-${entry.id}`}
                      order={entry}
                      name={entry.consumerName}
                    />
                  )
                )}
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
