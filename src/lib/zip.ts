// lib/zip.ts
import zipcodes from 'zipcodes';

export type ZipLocation = {
  zipCode: string;
  state: string;
  latitude: number;
  longitude: number;
};

export function lookupZip(zip: string): ZipLocation | null {
  const clean = zip.trim().slice(0, 5); // accepts ZIP+4 like 90210-1234
  if (!/^\d{5}$/.test(clean)) return null;

  const hit = zipcodes.lookup(clean);
  if (!hit) return null;

  return {
    zipCode: clean,
    state: hit.state,
    latitude: hit.latitude,
    longitude: hit.longitude,
  };
}