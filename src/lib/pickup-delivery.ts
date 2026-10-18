import { z } from 'zod';

export const pickupDeliverySchema = z
  .object({
    id: z.uuid(),
    farmerId: z.string().min(1).max(200),
    method: z.enum(['PICKUP', 'DELIVERY']),
    consumerName: z.string().trim().min(1, 'Your name is required.').max(150),
    address: z.string().trim().max(500).optional(),
    slotStart: z.iso.datetime(),
    timeZone: z.string().min(1).max(100),
  })
  .superRefine((input, ctx) => {
    if (input.method === 'DELIVERY' && !input.address) {
      ctx.addIssue({
        code: 'custom',
        path: ['address'],
        message: 'Delivery address is required.',
      });
    }
  });

// Validate the same seven-day, noon-to-five schedule in the submitted time zone.
export function isRequestSlotValid(
  start: Date,
  timeZone: string,
  now = new Date()
) {
  if (!Number.isFinite(start.getTime()) || start <= now) return false;
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    const parts = (date: Date) =>
      Object.fromEntries(
        formatter.formatToParts(date).map(({ type, value }) => [type, value])
      );
    const slot = parts(start);
    const today = parts(now);
    const day = (p: Record<string, string>) =>
      Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day));
    const offset = (day(slot) - day(today)) / 86400000;
    return (
      offset >= 0 &&
      offset < 7 &&
      Number(slot.hour) >= 12 &&
      Number(slot.hour) < 17 &&
      slot.minute === '00' &&
      slot.second === '00' &&
      start.getUTCMilliseconds() === 0
    );
  } catch {
    return false;
  }
}
