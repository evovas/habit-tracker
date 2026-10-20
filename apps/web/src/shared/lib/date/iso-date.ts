import type { Dayjs } from 'dayjs';

import { dayjs } from './dayjs.ts';

export const formatToISODate = (date: Dayjs): string => date.format('YYYY-MM-DD');

export const getISOWeekDay = (date: string): number =>
  dayjs.utc(date).isoWeekday();

export const getISOStartOfWeek = (date: string): string =>
  formatToISODate(dayjs.utc(date).startOf('isoWeek'));

export const getISOEndOfMonth = (date: string): string =>
  formatToISODate(dayjs.utc(date).endOf('month'));

export const offsetDate = (
  date: string,
  n: number,
  unit: 'day' | 'week' | 'month' = 'day',
): string =>
  formatToISODate(dayjs.utc(date).add(n, unit));
