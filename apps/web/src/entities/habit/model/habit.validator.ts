import { z } from 'zod';

const zHabitShape = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Enter a habit name.')
    .max(120, 'Name must be 120 characters or less.'),
  activeDays: z
    .array(z.int().min(1).max(7))
    .nonempty('Select at least one active day.')
    .max(7),
  weekGoal: z
    .int('The field must contain only numbers.')
    .min(1, 'Weekly goal should be positive number.')
    .max(7, 'Goal should not exceed the number of days in a week.'),
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
          error: 'Your weekly goal can’t be greater than the number of active days.',
          path: ['weekGoal'],
        },
      )
      .refine((habit) =>
        new Set(habit.activeDays).size === habit.activeDays.length,
      {
        error: 'Each active day can only be selected once.',
        path: ['activeDays'],
      });

export const zHabit = withHabitRules(zHabitShape);
export const zHabitDraft = withHabitRules(zHabitShape.omit({ id: true }));
export const zHabitList = z.array(zHabit);
