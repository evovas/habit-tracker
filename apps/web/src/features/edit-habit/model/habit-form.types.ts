import type { z } from 'zod';

import type { zHabitForm } from './habit-form.schema.ts';

export type HabitFormInput = z.input<typeof zHabitForm>;
export type HabitFormOutput = z.output<typeof zHabitForm>;
export type FormErrorState = Record<keyof HabitFormInput | 'body', string[]>;
