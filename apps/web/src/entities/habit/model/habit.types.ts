import type { z } from 'zod';

import type { zHabit } from './habit.validator.ts';

export type Habit = z.infer<typeof zHabit>;
