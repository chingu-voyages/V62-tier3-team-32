import { redirect } from 'next/navigation';

import { FarmerProfileForm } from '@/features/farmer/farmer-profile-form';
import { prisma } from '@/lib/prisma';
import { requireFarmer } from '@/lib/session';

export default async function FarmerOnboardingPage() {
  const session = await requireFarmer();

  const existing = await prisma.farmerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (existing) redirect('/farmer/orders');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, address: true, image: true },
  });

  return (
    <main className='bg-cream min-h-screen px-4 py-12'>
      <div className='mx-auto max-w-xl'>
        <FarmerProfileForm
          mode='onboarding'
          defaults={{
            name: user?.name ?? '',
            farmName: '',
            address: user?.address ?? '',
            zipCode: '',
            deliveryOptions: 'BOTH',
            about: '',
            certifications: [],
            growingPractices: [],
            ownerImage: user?.image ?? null,
            farmImage: null,
          }}
        />
      </div>
    </main>
  );
}