// prisma/seed.ts
import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';

import { prisma } from '../src/lib/prisma'; // adjust if your prisma file lives elsewhere
import { lookupZip } from '../src/lib/zip';

// Safety: never seed anything except a local database
const host = new URL(process.env.DATABASE_URL!).hostname;
if (!['localhost', '127.0.0.1'].includes(host)) {
  throw new Error(`Refusing to seed a non-local database (${host})`);
}

const DEV_PASSWORD = 'Password123!';

type Status = 'PENDING' | 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED';
type SeedOrder = {
  status: Status;
  daysAgo: number;
  items: { name: string; price: number; qty: number }[];
};

const farmerSeed = {
  name: 'Sunsprig Farm',
  email: 'farmer@seed.test',
  address: '1 Orchard Rd, Fresno, CA',
};

const consumerSeeds: {
  name: string;
  email: string;
  address: string;
  zip: string;
  withProfile: boolean;
  orders: SeedOrder[];
}[] = [
  {
    name: 'Ava Martinez',
    email: 'ava@seed.test',
    address: '350 5th Ave, New York, NY',
    zip: '10001',
    withProfile: true,
    orders: [
      { status: 'PENDING', daysAgo: 0, items: [{ name: 'Dark leafy greens', price: 4.5, qty: 2 }] },
      { status: 'READY', daysAgo: 1, items: [{ name: 'Heirloom tomatoes', price: 6, qty: 1 }, { name: 'Basil bunch', price: 2.5, qty: 2 }] },
      { status: 'COMPLETED', daysAgo: 12, items: [{ name: 'Free-range eggs (dozen)', price: 7, qty: 1 }] },
      { status: 'CANCELLED', daysAgo: 20, items: [{ name: 'Sweet corn', price: 0.9, qty: 6 }] },
    ],
  },
  {
    name: 'Ben Carter',
    email: 'ben@seed.test',
    address: '233 S Wacker Dr, Chicago, IL',
    zip: '60606',
    withProfile: true,
    orders: [], // profile but no orders: tests the empty states
  },
  {
    name: 'Cara Nguyen',
    email: 'cara@seed.test',
    address: '500 Congress Ave, Austin, TX',
    zip: '78701',
    withProfile: false, // no profile: tests the onboarding gate
    orders: [],
  },
];

async function upsertUser(input: {
  name: string;
  email: string;
  address: string;
  role: 'CONSUMER' | 'FARMER';
}) {
  const user = await prisma.user.upsert({
    where: { email: input.email },
    update: { name: input.name, address: input.address, role: input.role },
    create: {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      emailVerified: true,
      address: input.address,
      role: input.role,
    },
  });

  const credential = await prisma.account.findFirst({
    where: { userId: user.id, providerId: 'credential' },
  });
  if (!credential) {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        providerId: 'credential',
        userId: user.id,
        password: await hashPassword(DEV_PASSWORD),
      },
    });
  }

  return user;
}

async function main() {
  const farmer = await upsertUser({ ...farmerSeed, role: 'FARMER' });

  for (const c of consumerSeeds) {
    const user = await upsertUser({
      name: c.name,
      email: c.email,
      address: c.address,
      role: 'CONSUMER',
    });

    if (c.withProfile) {
      const location = lookupZip(c.zip);
      if (!location) throw new Error(`Unknown ZIP in seed data: ${c.zip}`);
      await prisma.consumerProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, ...location },
        update: location,
      });
    } else {
      await prisma.consumerProfile.deleteMany({ where: { userId: user.id } });
    }

    // Recreate orders each run so re-seeding never duplicates them
    await prisma.order.deleteMany({ where: { consumerId: user.id } });
    for (const o of c.orders) {
      const total = o.items.reduce((sum, i) => sum + i.price * i.qty, 0);
      await prisma.order.create({
        data: {
          consumerId: user.id,
          farmerId: farmer.id,
          status: o.status,
          total: Math.round(total * 100) / 100,
          createdAt: new Date(Date.now() - o.daysAgo * 86_400_000),
          items: {
            create: o.items.map((i) => ({
              name: i.name,
              unitPrice: i.price,
              quantity: i.qty,
            })),
          },
        },
      });
    }
  }

  console.log(`Seeded. Log in with any @seed.test email and password: ${DEV_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());