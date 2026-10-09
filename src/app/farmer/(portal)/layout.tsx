import { redirect } from 'next/navigation';

import { FarmerNav } from '@/features/farmer/farmer-nav';
import { prisma } from '@/lib/prisma';
import { requireFarmer } from '@/lib/session';

export default async function FarmerPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireFarmer();

  const profile = await prisma.farmerProfile.findUnique({
    where: { userId: session.user.id },
    select: { farmName: true },
  });
  if (!profile) redirect('/farmer/onboarding');

  return (
    <div className='bg-cream min-h-screen w-full'>
      <div className='border-ink/10 border-b bg-white'>
        <div className='mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3'>
          <span className='font-display text-ink text-lg font-semibold'>{profile.farmName}</span>
          <FarmerNav />
        </div>
      </div>
      {children}
    </div>
  );
}