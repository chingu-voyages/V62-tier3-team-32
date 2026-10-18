import Link from 'next/link';

import { money } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export type RangeId = '7d' | '30d' | '12m';

const RANGES: { id: RangeId; label: string }[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '12m', label: '12 months' },
];

const DAY = 86_400_000;

type Bucket = { key: string; label: string; cents: number };

// Buckets are UTC days (7d, 30d) or UTC months (12m), zero-filled so the chart has no gaps
function buildBuckets(range: RangeId): Bucket[] {
  const now = new Date();
  const buckets: Bucket[] = [];

  if (range === '12m') {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
      );
      buckets.push({
        key: d.toISOString().slice(0, 7),
        label: d.toLocaleDateString('en-US', {
          month: 'short',
          timeZone: 'UTC',
        }),
        cents: 0,
      });
    }
    return buckets;
  }

  const days = range === '7d' ? 7 : 30;
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today - i * DAY);
    buckets.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }),
      cents: 0,
    });
  }
  return buckets;
}

function RevenueChart({
  buckets,
  range,
}: {
  buckets: Bucket[];
  range: RangeId;
}) {
  const max = Math.max(...buckets.map((b) => b.cents), 1);
  const unit = range === '12m' ? 'month' : 'day';
  const mid = buckets[Math.floor(buckets.length / 2)];

  return (
    <figure>
      <div
        role='img'
        aria-label={`Revenue by ${unit}`}
        className='border-ink/10 flex h-52 items-end gap-1 border-b'
      >
        {buckets.map((b) => (
          <div
            key={b.key}
            className='flex h-full flex-1 items-end'
            title={`${b.label}: ${money(b.cents / 100)}`}
          >
            <div
              className='bg-brand w-full rounded-t-md'
              style={{
                height:
                  b.cents > 0 ? `${Math.max((b.cents / max) * 100, 4)}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {range === '12m' ? (
        <div className='text-ink/60 mt-2 flex gap-1 text-xs'>
          {buckets.map((b) => (
            <span key={b.key} className='flex-1 text-center'>
              {b.label}
            </span>
          ))}
        </div>
      ) : (
        <div className='text-ink/60 mt-2 flex justify-between text-xs'>
          <span>{buckets[0].label}</span>
          <span>{mid.label}</span>
          <span>{buckets[buckets.length - 1].label}</span>
        </div>
      )}

      <table className='sr-only'>
        <caption>Revenue by {unit}</caption>
        <tbody>
          {buckets.map((b) => (
            <tr key={b.key}>
              <th scope='row'>{b.label}</th>
              <td>{money(b.cents / 100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export async function RevenuePanel({
  farmerId,
  range,
}: {
  farmerId: string;
  range: RangeId;
}) {
  const buckets = buildBuckets(range);
  const first = buckets[0].key;
  const since = new Date(
    `${range === '12m' ? `${first}-01` : first}T00:00:00Z`
  );

  const [completed, open] = await Promise.all([
    prisma.order.findMany({
      where: { farmerId, status: 'COMPLETED', completedAt: { gte: since } },
      select: {
        total: true,
        completedAt: true,
        items: { select: { name: true, quantity: true, unitPrice: true } },
      },
    }),
    prisma.order.aggregate({
      where: { farmerId, status: { in: ['PENDING', 'CONFIRMED', 'READY'] } },
      _sum: { total: true },
      _count: true,
    }),
  ]);

  const byKey = new Map(buckets.map((b) => [b.key, b]));
  const sellers = new Map<
    string,
    { name: string; units: number; cents: number }
  >();
  let earnedCents = 0;

  for (const o of completed) {
    const cents = Math.round(Number(o.total) * 100);
    earnedCents += cents;

    const iso = o.completedAt!.toISOString();
    const bucket = byKey.get(
      range === '12m' ? iso.slice(0, 7) : iso.slice(0, 10)
    );
    if (bucket) bucket.cents += cents;

    for (const i of o.items) {
      const s = sellers.get(i.name) ?? { name: i.name, units: 0, cents: 0 };
      s.units += i.quantity;
      s.cents += Math.round(Number(i.unitPrice) * 100) * i.quantity;
      sellers.set(i.name, s);
    }
  }

  const topSellers = [...sellers.values()]
    .sort((a, b) => b.cents - a.cents)
    .slice(0, 5);
  const topCents = topSellers[0]?.cents ?? 1;
  const avgCents = completed.length
    ? Math.round(earnedCents / completed.length)
    : 0;
  const pipeline = Number(open._sum.total ?? 0);
  const rangeLabel = RANGES.find((r) => r.id === range)!.label;

  return (
    <div>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='font-display text-ink text-4xl font-bold'>Revenue</h1>
          <p className='text-ink/70 mt-2 text-lg'>
            Counted when you mark an order completed.
          </p>
        </div>

        <nav aria-label='Time range'>
          <ul className='border-ink/10 inline-flex gap-1 rounded-full border-2 bg-white p-1'>
            {RANGES.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/farmer?tab=revenue&range=${r.id}`}
                  scroll={false}
                  aria-current={r.id === range ? 'true' : undefined}
                  className={`block rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                    r.id === range
                      ? 'bg-ink text-cream'
                      : 'text-ink/70 hover:bg-ink/10'
                  }`}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <dl className='mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4'>
        <div className='bg-ink text-cream col-span-2 rounded-3xl p-6 lg:col-span-1'>
          <dt className='text-cream/70 text-sm'>Earned, last {rangeLabel}</dt>
          <dd className='font-display mt-1 text-3xl font-bold'>
            {money(earnedCents / 100)}
          </dd>
        </div>
        <div className='border-ink/10 rounded-3xl border-2 bg-white p-6'>
          <dt className='text-ink/60 text-sm'>Completed orders</dt>
          <dd className='font-display text-ink mt-1 text-3xl font-bold'>
            {completed.length}
          </dd>
        </div>
        <div className='border-ink/10 rounded-3xl border-2 bg-white p-6'>
          <dt className='text-ink/60 text-sm'>Average order</dt>
          <dd className='font-display text-ink mt-1 text-3xl font-bold'>
            {money(avgCents / 100)}
          </dd>
        </div>
        <div className='border-ink/10 rounded-3xl border-2 bg-white p-6'>
          <dt className='text-ink/60 text-sm'>In the pipeline</dt>
          <dd className='font-display text-ink mt-1 text-3xl font-bold'>
            {money(pipeline)}
          </dd>
          <p className='text-ink/60 mt-1 text-xs'>
            {open._count} open {open._count === 1 ? 'order' : 'orders'}
          </p>
        </div>
      </dl>

      {completed.length === 0 ? (
        <div className='border-ink/20 mt-8 rounded-3xl border-2 border-dashed p-10 text-center'>
          <p className='font-display text-ink text-2xl font-semibold'>
            No completed orders in this period.
          </p>
          <p className='text-ink/60 mt-1'>
            Revenue shows up here once you mark an order as completed.
          </p>
        </div>
      ) : (
        <div className='mt-8 grid gap-6 xl:grid-cols-[1fr_320px]'>
          <section className='border-ink/10 rounded-3xl border-2 bg-white p-6'>
            <h2 className='font-display text-ink mb-5 text-xl font-semibold'>
              Revenue by {range === '12m' ? 'month' : 'day'}
            </h2>
            <RevenueChart buckets={buckets} range={range} />
          </section>

          <section className='border-ink/10 rounded-3xl border-2 bg-white p-6'>
            <h2 className='font-display text-ink mb-5 text-xl font-semibold'>
              Top sellers
            </h2>
            <ol className='space-y-4'>
              {topSellers.map((s) => (
                <li key={s.name}>
                  <div className='flex justify-between gap-3 text-sm'>
                    <span className='text-ink font-semibold'>{s.name}</span>
                    <span className='text-ink/70'>{money(s.cents / 100)}</span>
                  </div>
                  <div className='bg-ink/10 mt-1.5 h-2 rounded-full'>
                    <div
                      className='bg-brand h-2 rounded-full'
                      style={{ width: `${(s.cents / topCents) * 100}%` }}
                    />
                  </div>
                  <p className='text-ink/60 mt-1 text-xs'>{s.units} sold</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}
