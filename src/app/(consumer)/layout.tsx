// src/app/(consumer)/layout.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

export default async function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  if (session.user.role === 'CONSUMER') {
    const profile = await prisma.consumerProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!profile) redirect('/onboarding');
  }

  return <>{children}</>;
}