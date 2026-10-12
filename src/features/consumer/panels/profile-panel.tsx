import { ConsumerProfileForm } from '@/features/consumer/consumer-profile-form';
import { ConsumerProfileSummary } from '@/features/consumer/consumer-profile-summary';
import { prisma } from '@/lib/prisma';

export async function ProfilePanel({ consumerId }: { consumerId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: consumerId },
    select: {
      name: true,
      address: true,
      image: true,
      consumerProfile: { select: { city: true, zipCode: true, state: true } },
    },
  });
  if (!user) return null;

  const profile = user.consumerProfile;

  return (
    <div className='grid gap-8 xl:grid-cols-[320px_1fr]'>
      <ConsumerProfileSummary
        user={{ name: user.name, address: user.address ?? '', image: user.image }}
        location={profile ? { zipCode: profile.zipCode, state: profile.state } : null}
      />

      <ConsumerProfileForm
        isNew={!profile}
        defaults={{
          name: user.name,
          address: user.address ?? '',
          image: user.image,
        }}
      />
    </div>
  );
}