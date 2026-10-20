import { getISOWeekDay } from '@/shared/lib/date';

import type { Habit } from './habit.types.ts';

export const checkIsActiveDay = (habit: Habit, date: string) =>
  habit.activeDays.includes(getISOWeekDay(date));
