import type { Static } from 'typebox';

import type {
  CreateHabitBodySchema,
  HabitSchema,
  UpdateHabitBodySchema,
} from './habits.schemas.ts';

export type Habit = Static<typeof HabitSchema>;

export type CreateHabitInput = Static<typeof CreateHabitBodySchema>;

export type UpdateHabitInput = Static<typeof UpdateHabitBodySchema>;
