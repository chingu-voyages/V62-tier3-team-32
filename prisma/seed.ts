import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'node:crypto';

import { prisma } from '../src/lib/prisma';
import { lookupZip } from '../src/lib/zip';

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

// User.name is the OWNER's name. The farm's name lives on FarmerProfile.
const farmerSeed = {
  name: 'Maria Santos',
  email: 'farmer@seed.test',
  address: '1 Orchard Rd, Fresno, CA',
};

const farmSeed = {
  zip: '93701',
  farmName: 'Sunsprig Farm',
  deliveryOptions: 'BOTH' as const,
  about:
    'Family-run vegetable farm growing leafy greens and tomatoes on twelve acres.',
  certifications: ['USDA Organic'],
  growingPractices: [
    'No synthetic pesticides',
    'Seasonal crops only',
    'Cover cropping',
  ],
};

const offeringSeeds = [
  {
    name: 'Dark leafy greens',
    unit: 'bunch',
    price: 4.5,
    quantity: 40,
    isAvailable: true,
  },
  {
    name: 'Heirloom tomatoes',
    unit: 'lb',
    price: 6,
    quantity: 25,
    isAvailable: true,
  },
  {
    name: 'Sweet corn',
    unit: 'ear',
    price: 0.9,
    quantity: 0,
    isAvailable: true,
  }, // out of stock
  {
    name: 'Free-range eggs',
    unit: 'dozen',
    price: 7,
    quantity: 12,
    isAvailable: false,
  }, // hidden
];

// A second farmer with no FarmerProfile, to test the onboarding gate
const farmerNoProfileSeed = {
  name: 'Dale Okafor',
  email: 'farmer2@seed.test',
  address: '9 Ridge Rd, Bakersfield, CA',
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
      {
        status: 'PENDING',
        daysAgo: 0,
        items: [{ name: 'Dark leafy greens', price: 4.5, qty: 2 }],
      },
      {
        status: 'READY',
        daysAgo: 1,
        items: [
          { name: 'Heirloom tomatoes', price: 6, qty: 1 },
          { name: 'Basil bunch', price: 2.5, qty: 2 },
        ],
      },
      {
        status: 'COMPLETED',
        daysAgo: 12,
        items: [{ name: 'Free-range eggs (dozen)', price: 7, qty: 1 }],
      },
      {
        status: 'CANCELLED',
        daysAgo: 20,
        items: [{ name: 'Sweet corn', price: 0.9, qty: 6 }],
      },
    ],
  },
  {
    name: 'Ben Carter',
    email: 'ben@seed.test',
    address: '233 S Wacker Dr, Chicago, IL',
    zip: '60606',
    withProfile: true,
    orders: [], // profile but no orders: empty states
  },
  {
    name: 'Cara Nguyen',
    email: 'cara@seed.test',
    address: '500 Congress Ave, Austin, TX',
    zip: '78701',
    withProfile: false, // no profile: consumer onboarding gate
    orders: [],
  },
  {
    name: 'Dev Patel',
    email: 'dev@seed.test',
    address: '1 Market St, Fresno, CA',
    zip: '93721',
    withProfile: true,
    orders: [
      {
        status: 'COMPLETED',
        daysAgo: 2,
        items: [{ name: 'Heirloom tomatoes', price: 6, qty: 4 }],
      },
      {
        status: 'COMPLETED',
        daysAgo: 4,
        items: [
          { name: 'Dark leafy greens', price: 4.5, qty: 6 },
          { name: 'Basil bunch', price: 2.5, qty: 3 },
        ],
      },
      {
        status: 'COMPLETED',
        daysAgo: 9,
        items: [{ name: 'Free-range eggs (dozen)', price: 7, qty: 2 }],
      },
      {
        status: 'COMPLETED',
        daysAgo: 16,
        items: [{ name: 'Heirloom tomatoes', price: 6, qty: 5 }],
      },
      {
        status: 'COMPLETED',
        daysAgo: 23,
        items: [{ name: 'Dark leafy greens', price: 4.5, qty: 8 }],
      },
      {
        status: 'COMPLETED',
        daysAgo: 38,
        items: [{ name: 'Sweet corn', price: 0.9, qty: 24 }],
      },
      {
        status: 'COMPLETED',
        daysAgo: 71,
        items: [{ name: 'Heirloom tomatoes', price: 6, qty: 7 }],
      },
      {
        status: 'COMPLETED',
        daysAgo: 130,
        items: [{ name: 'Dark leafy greens', price: 4.5, qty: 10 }],
      },
      {
        status: 'COMPLETED',
        daysAgo: 220,
        items: [{ name: 'Free-range eggs (dozen)', price: 7, qty: 4 }],
      },
    ], // gives the farmer more pending work, and a shopper near the farm
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

async function seedFarmer() {
  const farmer = await upsertUser({ ...farmerSeed, role: 'FARMER' });

  const location = lookupZip(farmSeed.zip);
  if (!location) throw new Error(`Unknown ZIP in seed data: ${farmSeed.zip}`);

  const { zip: _zip, ...farmFields } = farmSeed;
  await prisma.farmerProfile.upsert({
    where: { userId: farmer.id },
    create: { userId: farmer.id, ...farmFields, ...location },
    update: { ...farmFields, ...location },
  });

  // Rebuilt each run so re-seeding never duplicates offerings
  await prisma.offering.deleteMany({ where: { farmerId: farmer.id } });
  await prisma.offering.createMany({
    data: offeringSeeds.map((o) => ({ ...o, farmerId: farmer.id })),
  });

  // Second farmer: no profile, no offerings
  const noProfile = await upsertUser({
    ...farmerNoProfileSeed,
    role: 'FARMER',
  });
  await prisma.farmerProfile.deleteMany({ where: { userId: noProfile.id } });
  await prisma.offering.deleteMany({ where: { farmerId: noProfile.id } });

  return farmer;
}

async function seedConsumers(farmerId: string) {
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

    await prisma.order.deleteMany({ where: { consumerId: user.id } });
    for (const o of c.orders) {
      const total = o.items.reduce((sum, i) => sum + i.price * i.qty, 0);
      const createdAt = new Date(Date.now() - o.daysAgo * 86_400_000);
      await prisma.order.create({
        data: {
          consumerId: user.id,
          farmerId,
          status: o.status,
          total: Math.round(total * 100) / 100,
          createdAt,
          completedAt:
            o.status === 'COMPLETED'
              ? new Date(createdAt.getTime() + 3 * 3_600_000)
              : null,
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
}

async function main() {
  const farmer = await seedFarmer();
  await seedConsumers(farmer.id);
  console.log(
    `Seeded. Log in with any @seed.test email and password: ${DEV_PASSWORD}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
