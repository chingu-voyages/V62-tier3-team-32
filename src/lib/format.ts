export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    n
  );

export const shortDate = (d: Date) =>
  d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatLocation = (loc: {
  city: string | null;
  state: string;
  zipCode: string;
}) => `${loc.city ? `${loc.city}, ` : ''}${loc.state} ${loc.zipCode}`; // "Fresno, CA 93721"

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
