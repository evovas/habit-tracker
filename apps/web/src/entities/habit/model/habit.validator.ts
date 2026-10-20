import { z } from 'zod';

export const zHabit = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(120),
  activeDays: z
    .array(z.int().min(1).max(7))
    .nonempty()
    .max(7)
    .refine((days) => new Set(days).size === days.length, {
      error: 'Entries in the activeDays must be unique',
    }),
  weekGoal: z.int().min(1).max(7),
})
  .refine((habit) => habit.weekGoal <= habit.activeDays.length, {
    error: 'weekGoal can\'t be greater than activeDays count',
    path: ['weekGoal'],
  });
