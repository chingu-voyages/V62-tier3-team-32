// src/lib/consumer-profile.ts
import { resolveAddress } from './address';
import { prisma } from './prisma';

/** Parses an address and stores its ZIP, city, state and coordinates on the shopper's profile. */
export async function syncConsumerProfile(userId: string, address: string) {
  const resolved = resolveAddress(address);
  if (!resolved.ok) return resolved;

  await prisma.consumerProfile.upsert({
    where: { userId },
    create: { userId, ...resolved.value.location },
    update: resolved.value.location,
  });

  return resolved;
}