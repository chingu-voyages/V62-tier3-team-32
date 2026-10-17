import { StatusPill } from '@/features/orders/order-ui';
import Link from 'next/link';

type RequestView = {
  farmerId: string;
  farmerName: string;
  method: string;
  status: string;
  address: string | null;
  slotStart: Date;
  slotEnd: Date;
  timeZone: string;
};

export function PickupDeliveryRequestCard({
  request,
}: {
  request: RequestView;
}) {
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
  return (
    <article className='border-ink/10 rounded-3xl border-2 bg-white p-6 shadow-[4px_4px_0_rgba(33,48,28,0.15)]'>
      <div className='flex items-start justify-between gap-4'>
        <h3 className='font-display text-ink text-2xl font-semibold'>
          <Link
            href={`/farmer-profile?farmerId=${encodeURIComponent(request.farmerId)}`}
            className='hover:underline'
          >
            {request.farmerName}
          </Link>
        </h3>
        {request.status === 'PENDING' ? (
          <span className='bg-accent/40 text-ink rounded-full px-3 py-1 text-xs font-bold'>
            Awaiting confirmation
          </span>
        ) : (
          <StatusPill status={request.status} />
        )}
      </div>
      <p className='mt-3 font-semibold'>
        {request.method === 'PICKUP' ? 'Pickup' : 'Delivery'} request
      </p>
      <p>{date.format(request.slotStart)}</p>
      <p>
        {time.format(request.slotStart)} - {time.format(request.slotEnd)} (
        {request.timeZone})
      </p>
      <p className='mt-2 whitespace-pre-wrap'>
        <strong>
          {request.method === 'PICKUP' ? 'Pickup location' : 'Delivery address'}
          :
        </strong>{' '}
        {request.address || 'Confirm the location with the farmer.'}
      </p>
    </article>
  );
}
