import type { CheckinEntry } from '@/entities/checkin';
import { checkIsExistsCheckin } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';

export const getStatusForHabits = (
  habits: Habit[],
  checkins: CheckinEntry[],
  date: string,
): Record<Habit['id'], boolean> =>
  habits.reduce<Record<Habit['id'], boolean>>((acc, habit) => {
    acc[habit.id] = checkIsExistsCheckin(checkins, habit.id, date);
    return acc;
  }, {});
