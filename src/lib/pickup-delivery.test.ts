import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isRequestSlotValid,
  pickupDeliverySchema,
  requestSaleAmountSchema,
} from './pickup-delivery';

const now = new Date('2026-10-16T14:00:00Z');
const zone = 'America/New_York';

test('accepts a noon slot in the consumer time zone', () => {
  assert.equal(
    isRequestSlotValid(new Date('2026-10-16T16:00:00Z'), zone, now),
    true
  );
});
test('rejects past times, non-hour boundaries, invalid zones and out-of-hours slots', () => {
  for (const value of [
    '2026-10-15T16:00:00Z',
    '2026-10-16T15:00:00Z',
    '2026-10-16T21:00:00Z',
    '2026-10-16T16:30:00Z',
    '2026-10-16T16:00:00.001Z',
  ]) {
    assert.equal(isRequestSlotValid(new Date(value), zone, now), false, value);
  }
  assert.equal(
    isRequestSlotValid(new Date('2026-10-16T16:00:00Z'), 'Invalid/Zone', now),
    false
  );
});
test('enforces seven calendar days rather than seven 24-hour periods', () => {
  assert.equal(
    isRequestSlotValid(new Date('2026-10-22T20:00:00Z'), zone, now),
    true
  );
  assert.equal(
    isRequestSlotValid(new Date('2026-10-23T16:00:00Z'), zone, now),
    false
  );
});
test('handles DST and time zones with fractional offsets', () => {
  assert.equal(
    isRequestSlotValid(
      new Date('2026-11-01T17:00:00Z'),
      zone,
      new Date('2026-10-31T14:00:00Z')
    ),
    true
  );
  assert.equal(
    isRequestSlotValid(
      new Date('2026-10-16T06:30:00Z'),
      'Asia/Kolkata',
      new Date('2026-10-16T05:00:00Z')
    ),
    true
  );
});
test('requires a delivery address but permits pickup without one', () => {
  const input = {
    id: '11111111-1111-4111-8111-111111111111',
    farmerId: 'farmer',
    consumerName: 'Shopper',
    method: 'DELIVERY',
    slotStart: '2026-10-16T16:00:00Z',
    timeZone: zone,
  };
  assert.equal(pickupDeliverySchema.safeParse(input).success, false);
  assert.equal(
    pickupDeliverySchema.safeParse({ ...input, address: '   ' }).success,
    false
  );
  assert.equal(
    pickupDeliverySchema.safeParse({ ...input, address: '123 Main St' })
      .success,
    true
  );
  assert.equal(
    pickupDeliverySchema.safeParse({ ...input, method: 'PICKUP' }).success,
    true
  );
  assert.equal(
    pickupDeliverySchema.safeParse({ ...input, method: 'BOTH' }).success,
    false
  );
});

test('sale amounts accept zero and exact cents within the database limit', () => {
  for (const value of [
    '0',
    '0.00',
    '12',
    '12.5',
    '12.50',
    ' 12.50 ',
    '99999999.99',
  ])
    assert.equal(requestSaleAmountSchema.safeParse(value).success, true, value);
});

test('sale amounts reject missing, negative, fractional-cent, infinite and overflowing input', () => {
  for (const value of [
    undefined,
    null,
    '',
    ' ',
    '-1',
    '1.001',
    '100000000',
    'Infinity',
    'NaN',
    '1e3',
    12,
  ])
    assert.equal(
      requestSaleAmountSchema.safeParse(value).success,
      false,
      String(value)
    );
});
