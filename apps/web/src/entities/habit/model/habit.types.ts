import type { z } from 'zod';

import type { zHabit, zHabitDraft } from './habit.validator.ts';

export type Habit = z.infer<typeof zHabit>;
export type HabitDraft = z.infer<typeof zHabitDraft>;
