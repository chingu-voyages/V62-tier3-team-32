import farmGreenline from '@/assets/farm-greenline.jpg';
import farmHazelwood from '@/assets/farm-hazelwood.jpg';
import farmSunsprig from '@/assets/farm-sunsprig.jpg';

export const farms = [
  {
    name: 'Sunsprig Farm',
    href: '/farmer-profile',
    badge: 'Certified Organic',
    badgeClass: 'bg-brand/10 text-brand',
    meta: '4.9 ★ · 2.1 mi · No-till, regenerative',
    action: 'Order pickup',
    image: farmSunsprig,
    imageAlt: 'Watermelon rows at Sunsprig Farm at golden hour',
    tint: 'bg-brand/10',
  },
  {
    name: 'Hazelwood Orchards',
    badge: 'Regenerative',
    badgeClass: 'bg-coral/15 text-coral',
    meta: '4.8 ★ · 5.4 mi · Cover-cropped, pollinator-friendly',
    action: 'Order delivery',
    image: farmHazelwood,
    imageAlt: 'Ripe peaches and apples at Hazelwood Orchards',
    tint: 'bg-accent/10',
  },
  {
    name: 'Greenline Gardens',
    badge: 'USDA Organic',
    badgeClass: 'bg-brand/10 text-brand',
    meta: '5.0 ★ · 3.7 mi · Heated greenhouses, year-round',
    action: 'Order pickup',
    image: farmGreenline,
    imageAlt: 'Greenhouse tomatoes at Greenline Gardens',
    tint: 'bg-coral/10',
  },
];
