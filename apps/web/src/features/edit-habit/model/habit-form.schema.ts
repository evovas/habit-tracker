import { z } from 'zod';

import { withHabitRules, zHabitDraft } from '@/entities/habit';

const zNumberField = (requiredMessage: string) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .pipe(z
      .coerce
      .number<string>('The field must contain only numbers.')
      .int('The field must contain only whole number.'),
    );

const zHabitDraftShape = zHabitDraft.shape;

export const zHabitForm = withHabitRules(z.object({
  name: z.string().pipe(zHabitDraftShape.name),
  weekGoal: zNumberField('Enter your weekly goal.').pipe(zHabitDraftShape.weekGoal),
  activeDays: zHabitDraftShape.activeDays,
}));
