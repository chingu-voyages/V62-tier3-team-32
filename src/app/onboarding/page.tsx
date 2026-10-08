import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ProfileForm } from '@/features/onbording/onboarding-modal';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/signup?role=consumer');
  if (session.user.role === 'FARMER') redirect('/');

  const profile = await prisma.consumerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (profile) redirect('/orders'); // already onboarded

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, address: true, image: true },
  });

  return (
    <main className='bg-cream min-h-screen px-4 py-12'>
      <div className='mx-auto max-w-md'>
        <ProfileForm
          mode='onboarding'
          defaults={{
            name: user?.name ?? '',
            address: user?.address ?? '',
            zipCode: '',
            image: user?.image ?? null,
          }}
        />
      </div>
    </main>
  );
}
