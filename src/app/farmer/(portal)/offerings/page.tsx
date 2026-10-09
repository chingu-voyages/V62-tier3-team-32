import { OfferingsManager } from '@/features/farmer/offerings-manager';
import { prisma } from '@/lib/prisma';
import { requireFarmer } from '@/lib/session';

export default async function OfferingsPage() {
  const session = await requireFarmer();

  const rows = await prisma.offering.findMany({
    where: { farmerId: session.user.id },
    orderBy: [{ isAvailable: 'desc' }, { name: 'asc' }],
  });

  const offerings = rows.map((o) => ({
    id: o.id,
    name: o.name,
    unit: o.unit,
    price: Number(o.price),
    quantity: o.quantity,
    isAvailable: o.isAvailable,
  }));

  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <h1 className='font-display text-ink text-4xl font-bold lg:text-5xl'>Offerings</h1>
      <p className='text-ink/70 mt-3 text-lg'>
        Keep prices and stock current. Hide anything you can&apos;t supply right now.
      </p>
      <div className='mt-8'>
        <OfferingsManager offerings={offerings} />
      </div>
    </div>
  );
}