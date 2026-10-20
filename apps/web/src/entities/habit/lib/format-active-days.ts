import { getWeekDayShortName } from '@/shared/lib/date';

const isArraysEqual = (a: number[], b: number[]) =>
  a.length === b.length && a.every((val, index) => val === b[index]);

export const formatActiveDays = (days: number[]): string => {
  const sortedDays = days.toSorted((a, b) => a - b);
  if (sortedDays.length === 7) {
    return 'Every day';
  } else if (isArraysEqual(sortedDays, [6, 7])) {
    return 'Weekends';
  } else if (isArraysEqual(sortedDays, [1, 2, 3, 4, 5])) {
    return 'Weekdays';
  }
  return sortedDays.map(getWeekDayShortName).join(', ');
};
