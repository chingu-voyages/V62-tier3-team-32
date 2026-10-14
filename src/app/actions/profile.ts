'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

import { resolveAddress } from '@/lib/address';
import { auth } from '@/lib/auth/auth';
import { syncConsumerProfile } from '@/lib/consumer-profile';
import { getConsumerSession } from '@/lib/session';

const MAX_IMAGE_CHARS = 3 * 1024 * 1024;

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  address: z.string().trim().min(1, 'Address is required.'),
  image: z.string().startsWith('data:image/').max(MAX_IMAGE_CHARS).optional(),
});

type Result = { error: string } | { success: true };

export async function saveConsumerProfile(
  input: z.input<typeof schema>
): Promise<Result> {
  const session = await getConsumerSession();
  if (!session) return { error: 'You need to be signed in as a shopper.' };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? 'Please check your details.',
    };
  }
  const { name, address, image } = parsed.data;

  // Validate first, write after: a bad address leaves nothing half-saved
  const resolved = resolveAddress(address);
  if (!resolved.ok) return { error: resolved.error };

  await auth.api.updateUser({
    headers: await headers(),
    body: {
      name,
      address: resolved.value.formatted,
      ...(image ? { image } : {}),
    },
  });

  await syncConsumerProfile(session.user.id, resolved.value.formatted);

  revalidatePath('/consumer');
  return { success: true };
}
