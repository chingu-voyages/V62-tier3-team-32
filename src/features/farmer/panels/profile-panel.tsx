import FarmerProfileForm from '@/features/farmer/farmer-profile-form';
import { toStringArray, type DeliveryValue } from '@/features/farmer/constants';
import {FarmProfileSummary} from '@/features/farmer/farmer-profile-summary';
import { prisma } from '@/lib/prisma';

export async function ProfilePanel({ farmerId }: { farmerId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: farmerId },
    select: { name: true, address: true, image: true, farmerProfile: true },
  });
  if (!user) return null;

  const p = user.farmerProfile;
  const certifications = toStringArray(p?.certifications);

  return (
    <div className='grid gap-8 lg:grid-cols-[340px_1fr]'>
      <FarmProfileSummary
        owner={{ name: user.name, address: user.address ?? '', image: user.image }}
        farm={
          p
            ? {
                farmName: p.farmName,
                about: p.about,
                zipCode: p.zipCode,
                state: p.state,
                deliveryOptions: p.deliveryOptions as DeliveryValue,
                coverPhotoUrl: p.coverPhotoUrl,
                certifications,
                growingPractices: p.growingPractices,
              }
            : null
        }
      />

      <FarmerProfileForm
        isNew={!p}
        defaults={{
          name: user.name,
          farmName: p?.farmName ?? '',
          address: user.address ?? '',
          zipCode: p?.zipCode ?? '',
          deliveryOptions: (p?.deliveryOptions as DeliveryValue) ?? 'BOTH',
          about: p?.about ?? '',
          certifications,
          growingPractices: p?.growingPractices ?? [],
          ownerImage: user.image,
          farmImage: p?.coverPhotoUrl ?? null,
        }}
      />
    </div>
  );
}