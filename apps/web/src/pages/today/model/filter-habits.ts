import type { Habit } from '@/entities/habit';
import { checkIsActiveDay } from '@/entities/habit';

export const filterHabitsForDate = (habits: Habit[], date: string) =>
  habits.filter(
    (habit) => checkIsActiveDay(habit, date),
  );
