import { clsx } from 'clsx';

import type { CheckinEntry } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';
import { dayjs } from '@/shared/lib/date';

import { getWeekDayData } from '../model/get-week-data.ts';
import s from './DaySelector.module.scss';

interface DaySelectorProps {
  weekStart: string;
  maxDate: string;
  habits: Habit[];
  checkins: CheckinEntry[];
  activeDate: string;
  onDateChange: (date: string) => void;
}

export const DaySelector = ({
  weekStart,
  maxDate,
  habits,
  checkins,
  activeDate,
  onDateChange,
}: DaySelectorProps) => {
  const chosenWeekDates = getWeekDayData(habits, checkins, weekStart);
  return (
    <div className={s.daySelector}>
      {chosenWeekDates.map((item) => (
        <button
          key={item.date}
          type="button"
          onClick={() => {
            onDateChange(item.date);
          }}
          disabled={item.date > maxDate}
          className={clsx(
            s.daySelectorButton,
            item.date === activeDate && s.active,
          )}
        >
          <span className={s.daySelectorName}>
            {dayjs(item.date).format('ddd')}
          </span>
          <span className={s.daySelectorNumber}>
            {dayjs(item.date).format('D')}
          </span>
          <span className={clsx(
            s.daySelectorCompletedMark,
            item.status && s.completed,
          )}
          />
        </button>
      ))}
    </div>
  );
};
