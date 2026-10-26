import { getISOStartOfWeek, getISOWeekDay, offsetDate } from '../../shared/dates.ts';
import type { IsoDate } from '../../shared/types.ts';
import type { Habit } from '../habits/habits.types.ts';

export const getWeekActiveDates = (
  habit: Habit,
  weekCount: number,
  today: IsoDate,
): IsoDate[] => {
  const activeDays = habit.activeDays;
  const todayISOWeekDay = getISOWeekDay(today);
  const activeDaysIteration = activeDays.filter((day) =>
    weekCount === 0 ? day < todayISOWeekDay : true,
  ).toReversed();
  const iterationWeekStartDate = getISOStartOfWeek(
    offsetDate(today, -7 * weekCount),
  );
  return activeDaysIteration.map((day) =>
    offsetDate(iterationWeekStartDate, day - 1),
  );
};

export const getDaysStreakForHabit = (
  habit: Habit,
  checkins: Set<IsoDate>,
  today: IsoDate,
): number => {
  let isStreak = true;
  let streakCount = 0;
  let weekCount = 0;
  while (isStreak) {
    const iterationWeekActiveDates = getWeekActiveDates(
      habit,
      weekCount,
      today,
    );
    for (const date of iterationWeekActiveDates) {
      if (checkins.has(date)) {
        streakCount++;
      } else {
        isStreak = false;
        break;
      }
    }
    if (isStreak) {
      weekCount++;
    }
  }
  if (checkins.has(today)) {
    streakCount++;
  }
  return streakCount;
};

export const getWeeksStreakForHabit = (
  habit: Habit,
  checkins: Set<IsoDate>,
  today: IsoDate,
): number => {
  let isStreak = true;
  let streakCount = 0;
  let weekCount = 0;
  while (isStreak) {
    const iterationWeekActiveDates = getWeekActiveDates(
      habit,
      weekCount,
      today,
    );
    const todayCheckinCount = weekCount === 0 && checkins.has(today) ? 1 : 0;
    const weekCheckinCount = iterationWeekActiveDates.reduce((acc, date) => {
      if (checkins.has(date)) {
        return acc + 1;
      }
      return acc;
    }, todayCheckinCount);

    const activeDays = habit.activeDays;
    if (
      (weekCount === 0
        ? weekCheckinCount + (activeDays.length
          - iterationWeekActiveDates.length
          - todayCheckinCount)
        : weekCheckinCount
      ) >= habit.weekGoal
    ) {
      if (weekCheckinCount >= habit.weekGoal) {
        streakCount++;
      }
      weekCount++;
    } else {
      isStreak = false;
    }
  }
  return streakCount;
};
