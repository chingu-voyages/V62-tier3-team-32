import { DELIVERY_OPTIONS, type DeliveryValue } from '@/features/farmer/constants';
import { initials } from '@/lib/format';

type Props = {
  owner: { name: string; address: string; image: string | null };
  farm: {
    farmName: string;
    about: string | null;
    zipCode: string;
    state: string;
    deliveryOptions: DeliveryValue;
    coverPhotoUrl: string | null;
    certifications: string[];
    growingPractices: string[];
  } | null;
};

function Chips({ title, items, tone }: { title: string; items: string[]; tone: 'accent' | 'soft' }) {
  return (
    <div className='mt-6'>
      <h3 className='text-cream/60 text-sm'>{title}</h3>
      {items.length === 0 ? (
        <p className='mt-1 text-sm'>None listed.</p>
      ) : (
        <ul className='mt-2 flex flex-wrap gap-2'>
          {items.map((item) => (
            <li
              key={item}
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                tone === 'accent' ? 'bg-accent text-ink' : 'bg-cream/10 text-cream'
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FarmProfileSummary({ owner, farm }: Props) {
  if (!farm) {
    return (
      <aside className='bg-ink text-cream h-fit rounded-3xl p-8'>
        <h2 className='font-display text-2xl leading-tight font-bold'>Not listed yet</h2>
        <p className='text-cream/80 mt-3 text-sm leading-relaxed'>
          Fill in the form to add your farm name, location and delivery options. Shoppers nearby
          can only find you once your profile is saved. Orders and offerings keep working in the
          meantime.
        </p>
      </aside>
    );
  }

  const delivery = DELIVERY_OPTIONS.find((o) => o.value === farm.deliveryOptions)?.label;

  return (
    <aside className='bg-ink text-cream h-fit rounded-3xl p-8 lg:sticky lg:top-6'>
      {farm.coverPhotoUrl && (
        <img src={farm.coverPhotoUrl} alt={farm.farmName} className='mb-6 aspect-4/3 w-full rounded-2xl object-cover' />
      )}

      <div className='flex items-center gap-4'>
        {owner.image ? (
          <img src={owner.image} alt='' className='border-cream/20 h-16 w-16 rounded-full border-4 object-cover' />
        ) : (
          <span aria-hidden className='bg-accent text-ink font-display grid h-16 w-16 place-items-center rounded-full text-xl font-bold'>
            {initials(owner.name)}
          </span>
        )}
        <div>
          <h2 className='font-display text-2xl leading-tight font-bold'>{farm.farmName}</h2>
          <p className='text-cream/70 text-sm'>Run by {owner.name}</p>
        </div>
      </div>

      {farm.about && <p className='text-cream/80 mt-5 text-sm leading-relaxed'>{farm.about}</p>}

      <dl className='mt-6 space-y-4 text-sm'>
        <div>
          <dt className='text-cream/60'>Address</dt>
          <dd className='mt-0.5'>{owner.address}</dd>
        </div>
        <div>
          <dt className='text-cream/60'>ZIP code</dt>
          <dd className='mt-0.5'>
            {farm.zipCode}, {farm.state}
          </dd>
        </div>
        <div>
          <dt className='text-cream/60'>Delivery</dt>
          <dd className='mt-0.5'>{delivery}</dd>
        </div>
      </dl>

      <Chips title='Certifications' items={farm.certifications} tone='accent' />
      <Chips title='Growing practices' items={farm.growingPractices} tone='soft' />
    </aside>
  );
}