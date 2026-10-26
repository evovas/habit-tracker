import { dayjs, formatWeekPeriod, getISOEndOfMonth, offsetDate } from '../lib/date';
import s from './DateRangeSelector.module.scss';

interface DateRangeSelectorProps {
  type: 'week' | 'month';
  maxDate: string;
  startDate: string;
  onChange: (date: string) => void;
}

export const DateRangeSelector = ({
  type,
  maxDate,
  startDate,
  onChange,
}: DateRangeSelectorProps) => {
  const endDate = type === 'week'
    ? offsetDate(startDate, 6, 'day')
    : getISOEndOfMonth(startDate);

  return (
    <div className={s.dateRangeSelector}>
      <button
        type="button"
        aria-label={`Previous ${type}`}
        onClick={() => {
          onChange(offsetDate(startDate, -1, type));
        }}
        className={s.dateRangeSelectorButton}
      >
        ‹
      </button>
      <span className={s.dateRangeSelectorPeriod}>
        {
          type === 'week'
            ? formatWeekPeriod(
                startDate,
                endDate,
              )
            : dayjs.utc(startDate).format('MMMM YYYY')
        }
      </span>
      <button
        type="button"
        aria-label={`Next ${type}`}
        onClick={() => {
          onChange(offsetDate(startDate, 1, type));
        }}
        disabled={endDate >= maxDate}
        className={s.dateRangeSelectorButton}
      >
        ›
      </button>
    </div>
  );
};
