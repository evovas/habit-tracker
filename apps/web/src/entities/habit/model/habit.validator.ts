import { z } from 'zod';

const zHabitShape = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Enter habit name')
    .max(120, 'Name must be 120 characters or less'),
  activeDays: z
    .array(z.int().min(1).max(7))
    .nonempty('You need to select at least one active day')
    .max(7),
  weekGoal: z
    .int('The field must contain only numbers')
    .min(1, 'Weekly goal should be positive number')
    .max(7, 'Goal should not exceed the number of days in a week'),
});

type HabitRulesInput = Pick<
  z.infer<typeof zHabitShape>,
  'name' | 'activeDays' | 'weekGoal'
>;

export const withHabitRules
  = <S extends z.ZodType<HabitRulesInput>>(schema: S) =>
    schema
      .refine((habit) => habit.activeDays.length >= habit.weekGoal,
        {
          error: 'Number of active days can\'t be less than your goal',
          path: ['weekGoal'],
        },
      )
      .refine((habit) =>
        new Set(habit.activeDays).size === habit.activeDays.length,
      {
        error: 'Entries in the active days must be unique',
        path: ['activeDays'],
      });

export const zHabit = withHabitRules(zHabitShape);
export const zHabitDraft = withHabitRules(zHabitShape.omit({ id: true }));
