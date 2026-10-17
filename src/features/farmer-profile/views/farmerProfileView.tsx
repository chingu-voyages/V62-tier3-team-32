import { ArrowLeft, Check, Mail, Sprout } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { PublicFarmerProfile } from '@/app/farmer-profile/page';
import farmerPhoto from '@/assets/farm-sunsprig3.png';
import farmHero from '@/assets/farm-sunsprig4.png';
import { FavoriteButton } from '@/components/favorites/favorite-button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toStringArray } from '@/features/farmer/constants';
import { DeliveryOptions, OfferingCategory } from '@generated/prisma/enums';
import styles from './farmerProfile.module.css';
import {
  PickupDeliverySlots,
  type ConsumerDetails,
} from './pickup-delivery-slots';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type Props = {
  farm: PublicFarmerProfile;
  isFavorited: boolean;
  consumer: ConsumerDetails | null;
};

export function FarmerProfileView({ farm, isFavorited, consumer }: Props) {
  const { user } = farm;
  const certifications = [...new Set(toStringArray(farm.certifications))];
  const practices = [...new Set(farm.growingPractices)];
  const pickup = farm.deliveryOptions !== 'DELIVERY';
  const delivery = farm.deliveryOptions !== 'PICKUP';
  const emailHref = `mailto:${user.email}`;
  const deliveryOptions = (farm.deliveryOptions === 'DELIVERY' && [
    {
      label: 'Delivery',
      value: DeliveryOptions.DELIVERY,
    },
  ]) ||
    (farm.deliveryOptions === 'PICKUP' && [
      {
        label: 'Pickup',
        value: DeliveryOptions.PICKUP,
      },
    ]) || [
      {
        label: 'Delivery',
        value: DeliveryOptions.DELIVERY,
      },
      {
        label: 'Pickup',
        value: DeliveryOptions.PICKUP,
      },
    ];

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <Link href='/farms' className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden='true' /> Back to all farms
        </Link>
        {
          <Image
            src={farm.coverPhotoUrl || farmHero}
            alt={`${farm.farmName} farm photo`}
            width={1104}
            height={420}
            className={styles.hero}
            sizes='(max-width: 1152px) 100vw, 1104px'
            unoptimized
            preload
          />
        }
        <section className={styles.intro} aria-labelledby='farm-name'>
          <div>
            {certifications.length > 0 && (
              <span className={styles.organic}>{certifications[0]}</span>
            )}
            <h1 id='farm-name'>{farm.farmName}</h1>
            <p className={styles.meta}>
              {farm.state} {farm.zipCode}
            </p>
            <p className={styles.summary}>
              {farm.about ||
                'This farmer has not added a farm description yet.'}
            </p>
          </div>
          <div className={styles.actions}>
            <FavoriteButton
              farmerId={user.id}
              initialFavorited={isFavorited}
              variant='pill'
            />
            <PickupDeliverySlots
              farmerId={farm.userId}
              farmName={farm.farmName}
              farmAddress={user.address}
              consumer={consumer}
              pickup={pickup}
              delivery={delivery}
            />
            {consumer && (
              <a
                className={`${styles.button} ${styles.outline}`}
                href='#farm-contact'
              >
                Contact the farm
              </a>
            )}
          </div>
        </section>
        <div className={styles.columns}>
          <div className={styles.stack}>
            <section className={styles.card} aria-labelledby='about-farm'>
              <h2 id='about-farm'>About the farm</h2>
              <p>
                {farm.about ||
                  'This farmer has not added a farm description yet.'}
              </p>
            </section>
            <section className={styles.card} aria-labelledby='harvest-title'>
              <h2 id='harvest-title'>What&apos;s on the stand right now</h2>
              {user.offerings.length === 0 ? (
                <p>
                  No offerings listed yet. Contact the farmer for current
                  availability.
                </p>
              ) : (
                <ul className={styles.harvest}>
                  {user.offerings.map((item) => {
                    const available = item.isAvailable && item.quantity > 0;
                    return (
                      <li
                        key={item.id}
                        className='flex! h-full! flex-col! items-stretch! justify-between!'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0'>
                            <h3>{item.name}</h3>
                            {item.category === OfferingCategory.PRODUCE && (
                              <p>Produce</p>
                            )}
                            {item.category === OfferingCategory.PROTEIN && (
                              <p>Protein</p>
                            )}
                            {item.category === OfferingCategory.OTHER && (
                              <p>Other</p>
                            )}
                            <p>
                              {currency.format(Number(item.price))} /{' '}
                              {item.unit}
                            </p>
                            {available && <p>{item.quantity} available</p>}
                          </div>
                          <span
                            className={available ? styles.today : styles.soon}
                          >
                            {available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <Select items={deliveryOptions} disabled={!available}>
                          <SelectTrigger className='min-h-10 w-full rounded-xl border-[#c9d0bd] bg-white font-semibold text-[#203323] shadow-sm hover:bg-[#f8faf5] focus-visible:border-[#008532] focus-visible:ring-[#008532]/30'>
                            <SelectValue
                              placeholder={
                                available
                                  ? 'Select Delivery Option'
                                  : 'Out of Stock'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {deliveryOptions.map((deliveryOption) => (
                                <SelectItem
                                  key={deliveryOption.label}
                                  value={deliveryOption.value}
                                >
                                  {deliveryOption.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
            <section className={styles.card} aria-labelledby='growing-title'>
              <h2 id='growing-title'>How we grow</h2>
              {practices.length === 0 ? (
                <p>No growing practices listed yet.</p>
              ) : (
                <div className={styles.practices}>
                  {practices.map((practice) => (
                    <article key={practice}>
                      <span className={styles.practiceIcon}>
                        <Sprout size={21} aria-hidden='true' />
                      </span>
                      <h3>{practice}</h3>
                    </article>
                  ))}
                </div>
              )}
            </section>
            <section className={styles.card} aria-labelledby='farmer-title'>
              <h2 id='farmer-title'>Meet your farmer</h2>
              <div className={styles.farmer}>
                <Image
                  src={user.image || farmerPhoto}
                  alt={user.name}
                  width={160}
                  height={160}
                  sizes='160px'
                  unoptimized
                />
                <div>
                  <h3>{user.name}</h3>
                  <p className={styles.role}>Farm owner</p>
                </div>
              </div>
            </section>
          </div>
          <aside className={styles.stack} aria-label='Farm information'>
            <section
              className={`${styles.card} ${styles.sideCard}`}
              aria-labelledby='details-title'
            >
              <h2 id='details-title'>Farm details</h2>
              <dl className={styles.details}>
                <div>
                  <dt>Owner</dt>
                  <dd>{user.name}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{user.address || 'Address not listed'}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>
                    {farm.state} {farm.zipCode}
                  </dd>
                </div>
              </dl>
              <div className={styles.tags}>
                {pickup && <span>Pickup</span>}
                {delivery && <span>Delivery</span>}
              </div>
            </section>
            <section
              className={`${styles.card} ${styles.sideCard}`}
              aria-labelledby='certifications-title'
            >
              <h2 id='certifications-title'>Certifications</h2>
              {certifications.length === 0 ? (
                <p>No certifications listed.</p>
              ) : (
                <ul className={styles.certifications}>
                  {certifications.map((certification) => (
                    <li key={certification}>
                      <span className={styles.check}>
                        <Check size={21} aria-hidden='true' />
                      </span>
                      <div>
                        <h3>{certification}</h3>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section
              id='farm-contact'
              className={`${styles.card} ${styles.sideCard}`}
              aria-labelledby='contact-title'
            >
              <h2 id='contact-title'>Say hello</h2>
              <p>
                Questions about this week&apos;s harvest? Contact {user.name} by
                email.
              </p>
              <div className={styles.contactLinks}>
                <a href={emailHref}>
                  <Mail size={16} aria-hidden='true' />
                  {user.email}
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>
      {consumer && (
        <section className={styles.cta} aria-labelledby='meet-title'>
          <h2 id='meet-title'>Meet your farmer.</h2>
          <p>
            Reach {user.name} to ask about current offerings at {farm.farmName}.
          </p>
          <div className={styles.actions}>
            <a className={styles.button} href={emailHref}>
              Email the farm
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
