'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { lookupZip } from '@/lib/zip';

const MAX_IMAGE_CHARS = 3 * 1024 * 1024;

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  address: z.string().trim().min(1, 'Address is required.'),
  zipCode: z.string().trim().min(5, 'ZIP code is required.'),
  image: z
    .string()
    .startsWith('data:image/')
    .max(MAX_IMAGE_CHARS)
    .optional(),
});

type Result = { error: string } | { success: true };

export async function saveConsumerProfile(input: z.input<typeof schema>): Promise<Result> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session) return { error: 'You need to be signed in.' };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check your details.' };
  }
  const { name, address, zipCode, image } = parsed.data;

  const location = lookupZip(zipCode);
  if (!location) return { error: "That ZIP code wasn't recognized." };

  await auth.api.updateUser({
    headers: reqHeaders,
    body: { name, address, ...(image ? { image } : {}) },
  });

  await prisma.consumerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...location },
    update: location,
  });

  return { success: true };
}