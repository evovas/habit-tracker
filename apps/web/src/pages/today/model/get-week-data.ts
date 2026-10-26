import type { CheckinEntry } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';
import { offsetDate } from '@/shared/lib/date';

import { filterHabitsForDate } from './filter-habits.ts';
import { getStatusForHabits } from './get-habits-status.ts';

interface WeekDayData {
  date: string;
  status: boolean;
}

export const getWeekDayData = (
  habits: Habit[],
  checkins: CheckinEntry[],
  weekStart: string,
): WeekDayData[] =>
  [0, 1, 2, 3, 4, 5, 6].map<WeekDayData>((day) => {
    const date = offsetDate(weekStart, day);
    const filteredHabits = filterHabitsForDate(habits, date);
    const dateStatusForHabits = getStatusForHabits(
      filteredHabits,
      checkins,
      date,
    );
    const isDayCompleted = Object.values(dateStatusForHabits)
      .every(Boolean);
    return {
      date,
      status: Object.values(dateStatusForHabits).length > 0 && isDayCompleted,
    };
  });
