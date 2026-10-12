import zipcodes from 'zipcodes';

export const ADDRESS_EXAMPLE = '123 Main St, Fresno, CA 93721';

export type ResolvedAddress = {
  formatted: string; // "123 Main St, Fresno, CA 93721"
  location: {
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
};

type Result = { ok: true; value: ResolvedAddress } | { ok: false; error: string };

// street, city, ST 12345 (a comma between city and state is optional; ZIP+4 is accepted)
const ADDRESS_RE =
  /^(?<street>.+?)\s*,\s*(?<city>[^,]+?)\s*,?\s+(?<state>[A-Za-z]{2})\s+(?<zip>\d{5})(?:-\d{4})?$/;

export function resolveAddress(input: string): Result {
  const text = input.trim().replace(/\s+/g, ' ');
  const match = ADDRESS_RE.exec(text);

  if (!match?.groups) {
    return {
      ok: false,
      error: `Enter your address as street, city, state and ZIP code, for example ${ADDRESS_EXAMPLE}.`,
    };
  }

  const { street, city, zip } = match.groups;
  const state = match.groups.state.toUpperCase();

  const hit = zipcodes.lookup(zip);
  if (!hit) return { ok: false, error: `We couldn't find ZIP code ${zip}.` };
  if (hit.state !== state) {
    return { ok: false, error: `ZIP code ${zip} is in ${hit.state}, not ${state}.` };
  }
  if (hit.city.toLowerCase() !== city.toLowerCase()) {
    return { ok: false, error: `ZIP code ${zip} belongs to ${hit.city}, not ${city}.` };
  }

  return {
    ok: true,
    value: {
      formatted: `${street}, ${hit.city}, ${state} ${zip}`,
      location: {
        city: hit.city,
        state,
        zipCode: zip,
        latitude: hit.latitude,
        longitude: hit.longitude,
      },
    },
  };
}