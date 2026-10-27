import { z } from 'zod';

export const zCheckinEntry = z.object({
  habitId: z.uuid(),
  date: z.iso.date(),
});

export const zCheckinEntries = z.array(zCheckinEntry);
