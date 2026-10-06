import dayjs, { type Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import utc from 'dayjs/plugin/utc.js';

import type { IsoDate } from './types.ts';

dayjs.extend(isoWeek);
dayjs.extend(utc);

export const formatToISODate = (date: Dayjs): IsoDate => date.format('YYYY-MM-DD');

export const getISOWeekDay = (date: string): number =>
  dayjs.utc(date).isoWeekday();

export const getISOStartOfWeek = (date: string): IsoDate =>
  formatToISODate(dayjs.utc(date).startOf('isoWeek'));

export const offsetDate = (date: string, n: number): IsoDate =>
  formatToISODate(dayjs.utc(date).add(n, 'day'));

export const getISODateNow = (): IsoDate =>
  formatToISODate(dayjs.utc());

export { dayjs };
