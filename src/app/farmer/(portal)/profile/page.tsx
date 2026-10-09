import { FarmerProfileForm } from '@/features/farmer/farmer-profile-form';
import { DELIVERY_OPTIONS, toStringArray, type DeliveryValue } from '@/features/farmer/constants';
import { initials } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { requireFarmer } from '@/lib/session';
import Image from 'next/image';

export default async function FarmerProfilePage() {
  const session = await requireFarmer();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, address: true, image: true, farmerProfile: true },
  });
  const farm = user?.farmerProfile;
  if (!user || !farm) return null; // the layout gate already redirects in this case

  const certifications = toStringArray(farm.certifications);
  const delivery = DELIVERY_OPTIONS.find((o) => o.value === farm.deliveryOptions)?.label;

  return (
    <div className='mx-auto grid max-w-5xl gap-8 px-6 py-12 lg:grid-cols-[340px_1fr]'>
      <aside className='bg-ink text-cream rounded-3xl p-8 lg:sticky lg:top-6 lg:self-start'>
        {farm.coverPhotoUrl && (
          <Image src={farm.coverPhotoUrl} alt={`${farm.farmName}`}  width={64} height={64} unoptimized className='mb-6 aspect-4/3 w-full rounded-2xl object-cover' />
        )}

        <div className='flex items-center gap-4'>
          {user.image ? (
            <Image src={user.image} alt='' width={64} height={64} unoptimized className='border-cream/20 h-16 w-16 rounded-full border-4 object-cover' />
          ) : (
            <span aria-hidden className='bg-accent text-ink font-display grid h-16 w-16 place-items-center rounded-full text-xl font-bold'>
              {initials(user.name)}
            </span>
          )}
          <div>
            <h1 className='font-display text-2xl leading-tight font-bold'>{farm.farmName}</h1>
            <p className='text-cream/70 text-sm'>Run by {user.name}</p>
          </div>
        </div>

        {farm.about && <p className='text-cream/80 mt-5 text-sm leading-relaxed'>{farm.about}</p>}

        <dl className='mt-6 space-y-4 text-sm'>
          <div>
            <dt className='text-cream/60'>Address</dt>
            <dd className='mt-0.5'>{user.address}</dd>
          </div>
          <div>
            <dt className='text-cream/60'>ZIP code</dt>
            <dd className='mt-0.5'>{farm.zipCode}, {farm.state}</dd>
          </div>
          <div>
            <dt className='text-cream/60'>Delivery</dt>
            <dd className='mt-0.5'>{delivery}</dd>
          </div>
        </dl>

        <div className='mt-6'>
          <h2 className='text-cream/60 text-sm'>Certifications</h2>
          {certifications.length === 0 ? (
            <p className='mt-1 text-sm'>None listed.</p>
          ) : (
            <ul className='mt-2 flex flex-wrap gap-2'>
              {certifications.map((c) => (
                <li key={c} className='bg-accent text-ink rounded-full px-3 py-1 text-xs font-bold'>{c}</li>
              ))}
            </ul>
          )}
        </div>

        <div className='mt-6'>
          <h2 className='text-cream/60 text-sm'>Growing practices</h2>
          {farm.growingPractices.length === 0 ? (
            <p className='mt-1 text-sm'>None listed.</p>
          ) : (
            <ul className='mt-2 flex flex-wrap gap-2'>
              {farm.growingPractices.map((p) => (
                <li key={p} className='bg-cream/10 text-cream rounded-full px-3 py-1 text-xs font-semibold'>{p}</li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <FarmerProfileForm
        mode='edit'
        defaults={{
          name: user.name,
          farmName: farm.farmName,
          address: user.address ?? '',
          zipCode: farm.zipCode,
          deliveryOptions: farm.deliveryOptions as DeliveryValue,
          about: farm.about ?? '',
          certifications,
          growingPractices: farm.growingPractices,
          ownerImage: user.image,
          farmImage: farm.coverPhotoUrl,
        }}
      />
    </div>
  );
}