import farmProduce from '@/assets/farm-sunsprig2.png';
import farmer from '@/assets/farm-sunsprig3.png';
import farmHero from '@/assets/farm-sunsprig4.png';
import greenhouse from '@/assets/farm-sunsprig5.png';
import {
  ArrowLeft,
  Check,
  Droplet,
  Flower2,
  Leaf,
  Mail,
  Phone,
  RotateCw,
  Sprout,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { certifications, farmContact, harvest } from '../data/farmerProfile';
import styles from './farmerProfile.module.css';

const practices = [
  {
    title: 'No-till soil beds',
    icon: Sprout,
    description:
      'Beds are never plowed. Permanent soil structure keeps carbon in the ground and microbes feeding the roots.',
  },
  {
    title: 'Cover cropping & compost',
    icon: RotateCw,
    description:
      'Every field rests under clover and rye between plantings, plus on-farm compost instead of synthetic fertilizer.',
  },
  {
    title: 'Drip irrigation',
    icon: Droplet,
    description:
      'Water goes straight to the root zone from a spring-fed pond — no overhead spraying, no waste.',
  },
  {
    title: 'Pollinator hedgerows',
    icon: Flower2,
    description:
      'Native wildflower strips border every field, giving bees and beneficial insects a year-round home.',
  },
  {
    title: 'Year-round hoop house',
    icon: Leaf,
    description:
      'A heated hoop house keeps greens growing through the winter, so the stand never goes empty.',
  },
];

function FarmContactLinks() {
  return (
    <div className={styles.contactLinks}>
      <a href={farmContact.phoneHref}>
        <Phone size={16} aria-hidden='true' />
        {farmContact.phone}
      </a>
      <a href={`mailto:${farmContact.email}`}>
        <Mail size={16} aria-hidden='true' />
        {farmContact.email}
      </a>
    </div>
  );
}

export function FarmerProfileView() {
  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <Link href='/#farms' className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden='true' />
          Back to all farms
        </Link>
        <Image
          src={farmHero}
          alt='Rows of vegetables beside a red barn at Sunsprig Farm at sunset'
          className={styles.hero}
          sizes='(max-width: 1152px) 100vw, 1104px'
          preload
        />
        <section className={styles.intro} aria-labelledby='farm-name'>
          <div>
            <span className={styles.organic}>Certified organic</span>
            <h1 id='farm-name'>Sunsprig Farm</h1>
            <p className={styles.meta}>
              4.9 <span aria-label='out of 5 stars'>★</span> · 2.1 mi · No-till,
              regenerative
            </p>
            <p className={styles.summary}>
              No-till vegetables, pasture eggs, and small-batch honey from
              Millbrook.
            </p>
          </div>
          <div className={styles.actions}>
            <a
              className={styles.button}
              href={`mailto:${farmContact.email}?subject=Pickup%20order%20inquiry`}
            >
              Order pickup
            </a>
            <a
              className={`${styles.button} ${styles.delivery}`}
              href={`mailto:${farmContact.email}?subject=Delivery%20order%20inquiry`}
            >
              Order delivery
            </a>
            <a
              className={`${styles.button} ${styles.outline}`}
              href='#farm-contact'
            >
              Contact the farm
            </a>
          </div>
        </section>

        <div className={styles.columns}>
          <div className={styles.stack}>
            <section className={styles.card} aria-labelledby='about-farm'>
              <h2 id='about-farm'>About the farm</h2>
              <p>
                Sunsprig is a 12-acre family farm in the rolling hills of
                Millbrook. Maya and her small crew grow over 40 varieties of
                vegetables without synthetic pesticides or fertilizers, keeping
                living soil beds that feed the next season&apos;s harvest.
                Everything sold here is picked at dawn and on the stand the same
                day.
              </p>
              <figure className={styles.gallery}>
                <div>
                  <Image
                    src={farmProduce}
                    alt='Fresh tomatoes, squash, and zucchini on the farm stand'
                    sizes='(max-width: 600px) 90vw, (max-width: 900px) 45vw, 322px'
                  />
                  <Image
                    src={greenhouse}
                    alt='Tomatoes and leafy greens growing inside the hoop house'
                    sizes='(max-width: 600px) 90vw, (max-width: 900px) 45vw, 322px'
                  />
                </div>
                <figcaption>
                  Today&apos;s harvest on the stand · Inside the hoop house
                </figcaption>
              </figure>
            </section>

            <section className={styles.card} aria-labelledby='harvest-title'>
              <h2 id='harvest-title'>What&apos;s on the stand right now</h2>
              <ul className={styles.harvest}>
                {harvest.map((item) => (
                  <li key={item.name}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.detail}</p>
                    </div>
                    <span
                      className={item.available ? styles.today : styles.soon}
                    >
                      {item.available ? 'Today' : 'Soon'}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.card} aria-labelledby='growing-title'>
              <h2 id='growing-title'>How we grow</h2>
              <div className={styles.practices}>
                {practices.map(({ title, icon: Icon, description }) => (
                  <article key={title}>
                    <span className={styles.practiceIcon}>
                      <Icon size={21} aria-hidden='true' />
                    </span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.card} aria-labelledby='farmer-title'>
              <h2 id='farmer-title'>Where your food comes from</h2>
              <div className={styles.farmer}>
                <Image
                  src={farmer}
                  alt='Maya Ellison holding a crate of freshly harvested vegetables'
                  sizes='160px'
                />
                <div>
                  <h3>Maya Ellison</h3>
                  <p className={styles.role}>Owner &amp; Head Grower</p>
                  <p>
                    Everything on our stand is grown on our own 12 acres —
                    vegetables from our fields and hoop house, eggs from the
                    laying flock that rotationally grazes behind the barn, and
                    honey from the hives along the north hedgerow. Nothing is
                    resold or bought in from other growers, so we can answer for
                    every item on the table.
                  </p>
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
                  <dd>Maya Ellison</dd>
                </div>
                <div>
                  <dt>Farming here since</dt>
                  <dd>2014</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>12 acres</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>
                    482 Hollow Ridge Road
                    <br />
                    Millbrook, NY 12545
                  </dd>
                </div>
                <div>
                  <dt>Stand hours</dt>
                  <dd>Tue–Sat · 9:00am–5:00pm</dd>
                </div>
              </dl>
              <div className={styles.tags}>
                <span>Pickup</span>
                <span>Delivery</span>
                <span>2.1 mi away</span>
              </div>
            </section>
            <section
              className={`${styles.card} ${styles.sideCard}`}
              aria-labelledby='certifications-title'
            >
              <h2 id='certifications-title'>Certifications</h2>
              <ul className={styles.certifications}>
                {certifications.map((item) => (
                  <li key={item.name}>
                    <span className={styles.check}>
                      <Check size={21} aria-hidden='true' />
                    </span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section
              id='farm-contact'
              className={`${styles.card} ${styles.sideCard}`}
              aria-labelledby='contact-title'
            >
              <h2 id='contact-title'>Say hello</h2>
              <p>
                Questions about this week&apos;s harvest? The farm answers
                fastest by email.
              </p>
              <FarmContactLinks />
            </section>
          </aside>
        </div>
      </div>

      <section className={styles.cta} aria-labelledby='meet-title'>
        <h2 id='meet-title'>Meet your farmer.</h2>
        <p>
          Stop by the stand, or reach Maya Ellison directly — pickup and
          delivery are both available this week.
        </p>
        <div className={styles.actions}>
          <a className={styles.button} href={`mailto:${farmContact.email}`}>
            Email the farm
          </a>
          <a
            className={`${styles.button} ${styles.call}`}
            href={farmContact.phoneHref}
          >
            Call {farmContact.phone}
          </a>
        </div>
      </section>
    </div>
  );
}
