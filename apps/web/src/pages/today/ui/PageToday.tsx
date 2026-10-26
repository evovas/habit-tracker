import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useState } from 'react';

import { checkIsExistsCheckin, useCheckinsMockStore } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';
import {
  habitErrorMessageVocabulary,
  HabitItem,
  HabitItemSkeleton,
  habitQueryOptions,
} from '@/entities/habit';
import { HabitFormModal } from '@/features/edit-habit';
import { SingleCheckin } from '@/features/toggle-checkin';
import { getUserErrorMessage } from '@/shared/api';
import {
  dayjs,
  formatToISODate,
  getISOStartOfWeek,
  offsetDate,
} from '@/shared/lib/date';
import {
  DateRangeSelector,
  HugeIcon,
  icons,
  UICard,
} from '@/shared/ui';

import { filterHabitsForDate } from '../model/filter-habits.ts';
import { getStatusForHabits } from '../model/get-habits-status.ts';
import { DaySelector } from './DaySelector.tsx';
import { DaySummary } from './DaySummary.tsx';
import s from './PageToday.module.scss';

const EMPTY_HABITS: Habit[] = [] as const;

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

  const {
    data: habits,
    isPending,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery(habitQueryOptions.list());
  const checkins = useCheckinsMockStore((state) => state.items);

  const activeDayHabits = habits
    ? filterHabitsForDate(habits, activeDate)
    : [];
  const activeDayStatus = getStatusForHabits(
    activeDayHabits,
    checkins,
    activeDate,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getSingleCheckinContent = (
    habit: Habit,
    isChecked: boolean,
  ) => (
    <UICard
      className={s.checkin}
      as="span"
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
    </UICard>
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
        habits={habits ?? EMPTY_HABITS}
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
          {isPending && (
            Array.from({ length: 3 }, (_, index) => (
              <UICard
                key={index}
                className={s.checkin}
                as="span"
                shadowOnHover={false}
              >
                <HabitItemSkeleton compact />
                <span
                  className={s.checkinStatus}
                />
              </UICard>
            ))
          )}
          {isError && (
            <div className={s.habitsError} role="alert">
              <HugeIcon icon={icons.alert} />
              {getUserErrorMessage(habitErrorMessageVocabulary, error)}
              <button
                type="button"
                className={s.errorRetryButton}
                onClick={() => {
                  void refetch();
                }}
              >
                <HugeIcon icon={icons.retry} size={12} />
                Retry
              </button>
            </div>
          )}
          {isSuccess && (
            activeDayHabits.map((habit) => (
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
            ))
          )}
          <button
            className={s.addButton}
            type="button"
            onClick={() => {
              setIsFormOpen(true);
            }}
          >
            <span className={s.addButtonIconWrapper}>
              <HugeIcon icon={icons.add} />
            </span>
            Add Habit
          </button>
        </div>
      </div>

      <HabitFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
        }}
        onSave={() => {
          setIsFormOpen(false);
        }}
      />
    </div>
  );
};
