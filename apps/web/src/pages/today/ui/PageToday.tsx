import { clsx } from 'clsx';
import { useState } from 'react';

import { checkIsExistsCheckin, useCheckinsMockStore } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';
import { HabitItem, useHabitsMockStore } from '@/entities/habit';
import { SingleCheckin } from '@/features/toggle-checkin';
import {
  dayjs,
  formatToISODate,
  getISOStartOfWeek,
  offsetDate,
} from '@/shared/lib/date';
import { DateRangeSelector } from '@/shared/ui';

import { filterHabitsForDate } from '../model/filter-habits.ts';
import { getStatusForHabits } from '../model/get-habits-status.ts';
import { DaySelector } from './DaySelector.tsx';
import { DaySummary } from './DaySummary.tsx';
import s from './PageToday.module.scss';

export const PageToday = () => {
  const today = formatToISODate(dayjs());
  const [activeDate, setActiveDate] = useState(today);
  const [firstDayOfActiveWeek, setFirstDayOfActiveWeek]
    = useState(() => getISOStartOfWeek(today));

  const handleWeekChange = (weekStart: string) => {
    setFirstDayOfActiveWeek(weekStart);
    const weekEnd = offsetDate(weekStart, 6);
    setActiveDate(weekEnd < today ? weekStart : today);
  };

  const habits = useHabitsMockStore((state) => state.items);
  const checkins = useCheckinsMockStore((state) => state.items);

  const activeDayHabits = filterHabitsForDate(habits, activeDate);
  const activeDayStatus = getStatusForHabits(
    activeDayHabits,
    checkins,
    activeDate,
  );

  const getSingleCheckinContent = (habit: Habit, isChecked: boolean) => (
    <span
      className={s.checkin}
    >
      <HabitItem habit={habit} compact>
        Streak 4
      </HabitItem>
      <span
        className={clsx(
          s.checkinStatus,
          isChecked && s.checked,
        )}
      />
    </span>
  );

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.text}>
          <h2 className={s.title}>{dayjs(activeDate).format('dddd, MMMM D')}</h2>
          <p className={s.paragraph}>
            Every check-in is a vote for the person you want to become.
          </p>
        </div>
        <DateRangeSelector
          type="week"
          maxDate={today}
          startDate={firstDayOfActiveWeek}
          onChange={handleWeekChange}
        />
      </header>

      <DaySelector
        weekStart={firstDayOfActiveWeek}
        maxDate={today}
        activeDate={activeDate}
        onDateChange={setActiveDate}
        habits={habits}
        checkins={checkins}
      />

      {activeDayHabits.length > 0 && (
        <DaySummary
          total={activeDayHabits.length}
          done={Object.values(activeDayStatus).filter(Boolean).length}
        />
      )}

      <div>
        <h3 className={s.checkinHeading}>Day Summary</h3>
        <div className={s.checkinsWrapper}>
          {activeDayHabits.map((habit) => (
            <SingleCheckin
              habitId={habit.id}
              checked={checkIsExistsCheckin(
                checkins,
                habit.id,
                activeDate,
              )}
              date={activeDate}
              key={habit.id}
            >
              {
                ({ checked }) =>
                  getSingleCheckinContent(habit, checked)
              }
            </SingleCheckin>
          ))}
        </div>
      </div>
    </div>
  );
};
