import type { Dayjs } from 'dayjs';

import { dayjs } from './dayjs.ts';

export const formatToISODate = (date: Dayjs): string => date.format('YYYY-MM-DD');

export const getISOWeekDay = (date: string): number =>
  dayjs.utc(date).isoWeekday();

export const getISOStartOfWeek = (date: string): string =>
  formatToISODate(dayjs.utc(date).startOf('isoWeek'));

export const offsetDate = (date: string, n: number): string =>
  formatToISODate(dayjs.utc(date).add(n, 'day'));

export const getWeekDayShortName = (day: number): string => {
  const name = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1];
  if (!name) {
    throw new Error('Invalid day');
  }
  return name;
};
