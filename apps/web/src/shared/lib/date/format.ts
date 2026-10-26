import { dayjs } from './dayjs.ts';

export const WEEK_DAYS = [
  {
    shortName: 'Mon',
    longName: 'Monday',
    num: 1,
  },
  {
    shortName: 'Tue',
    longName: 'Tuesday',
    num: 2,
  },
  {
    shortName: 'Wed',
    longName: 'Wednesday',
    num: 3,
  },
  {
    shortName: 'Thu',
    longName: 'Thursday',
    num: 4,
  },
  {
    shortName: 'Fri',
    longName: 'Friday',
    num: 5,
  },
  {
    shortName: 'Sat',
    longName: 'Saturday',
    num: 6,
  },
  {
    shortName: 'Sun',
    longName: 'Sunday',
    num: 7,
  },
] as const;

export const getWeekDayShortName = (day: number): string => {
  const dayData = WEEK_DAYS[day - 1];
  if (!dayData) {
    throw new Error('Invalid day');
  }
  return dayData.shortName;
};

export const formatWeekPeriod = (from: string, to: string): string => {
  const fromDayjs = dayjs.utc(from);
  const toDayjs = dayjs.utc(to);
  const fromYear = fromDayjs.year();
  const toYear = toDayjs.year();
  return `${
    fromYear === toYear
      ? fromDayjs.format('MMM D')
      : fromDayjs.format('MMM D, YYYY')
  } – ${
    toDayjs.format('MMM D, YYYY')
  }`;
};
