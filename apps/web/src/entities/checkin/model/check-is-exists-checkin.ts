import type { CheckinEntry } from './checkin.types.ts';

export const checkIsExistsCheckin = (
  checkins: CheckinEntry[],
  habitId: CheckinEntry['habitId'],
  date: CheckinEntry['date'],
) =>
  checkins.some((checkin) =>
    checkin.habitId === habitId && checkin.date === date,
  );
