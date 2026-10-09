import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';

export async function requireFarmer() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');
  if (session.user.role !== 'FARMER') redirect('/');
  return session;
}

export async function getFarmerSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.role === 'FARMER' ? session : null;
}