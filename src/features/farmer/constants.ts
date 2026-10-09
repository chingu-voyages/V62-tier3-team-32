// src/features/farmer/constants.ts
export const CERTIFICATIONS = [
  'USDA Organic',
  'Certified Naturally Grown',
  'Non-GMO Project Verified',
  'Good Agricultural Practices (GAP)',
  'Animal Welfare Approved',
];

export const PRACTICES = [
  'No synthetic pesticides',
  'Regenerative',
  'Pasture-raised',
  'Seasonal crops only',
  'Heirloom varieties',
  'Hydroponic',
  'Cover cropping',
  'Water-conserving irrigation',
];

export const DELIVERY_OPTIONS = [
  { value: 'PICKUP', label: 'Pickup only', hint: 'Customers collect from your farm.' },
  { value: 'DELIVERY', label: 'Delivery only', hint: 'You bring orders to customers.' },
  { value: 'BOTH', label: 'Pickup and delivery', hint: 'Customers choose.' },
] as const;

export type DeliveryValue = (typeof DELIVERY_OPTIONS)[number]['value'];

export function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}