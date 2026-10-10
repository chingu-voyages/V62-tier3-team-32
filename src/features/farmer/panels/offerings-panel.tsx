import { OfferingsManager } from '@/features/farmer/offerings-manager';
import { prisma } from '@/lib/prisma';

export async function OfferingsPanel({ farmerId }: { farmerId: string }) {
  const rows = await prisma.offering.findMany({
    where: { farmerId },
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
    <div>
      <h1 className='font-display text-ink text-4xl font-bold'>Offerings</h1>
      <p className='text-ink/70 mt-2 mb-8 text-lg'>
        Keep prices and stock current. Hide anything you can&apos;t supply right now.
      </p>
      <OfferingsManager offerings={offerings} />
    </div>
  );
}