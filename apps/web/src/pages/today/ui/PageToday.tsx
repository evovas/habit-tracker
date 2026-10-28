import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { CheckinEntry } from '@/entities/checkin';
import {
  checkinErrorMessageVocabulary,
  checkinQueryOptions,
  checkIsExistsCheckin,
} from '@/entities/checkin';
import type { Habit } from '@/entities/habit';
import {
  habitErrorMessageVocabulary,
  HabitItem,
  HabitItemSkeleton,
  habitQueryOptions,
} from '@/entities/habit';
import { HabitFormModal } from '@/features/edit-habit';
import { SingleCheckin } from '@/features/toggle-checkin';
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
  UIQueryError,
} from '@/shared/ui';

import { filterHabitsForDate } from '../model/filter-habits.ts';
import { getStatusForHabits } from '../model/get-habits-status.ts';
import { DaySelector } from './DaySelector.tsx';
import { DaySummary } from './DaySummary.tsx';
import s from './PageToday.module.scss';

const EMPTY_HABITS: Habit[] = [] as const;
const EMPTY_CHECKINS: CheckinEntry[] = [] as const;

export const PageToday = () => {
  const today = formatToISODate(dayjs());
  const [activeDate, setActiveDate] = useState(today);
  const [firstDayOfActiveWeek, setFirstDayOfActiveWeek]
    = useState(() => getISOStartOfWeek(today));
  const weekEndOfActiveWeek = offsetDate(firstDayOfActiveWeek, 6);

  const handleWeekChange = (weekStart: string) => {
    setFirstDayOfActiveWeek(weekStart);
    const weekEnd = offsetDate(weekStart, 6);
    setActiveDate(weekEnd < today ? weekStart : today);
  };

  const {
    data: habits,
    isPending: isPendingHabits,
    isError: isErrorHabits,
    error: habitsError,
    isSuccess: isSuccessHabits,
    refetch: refetchHabits,
  } = useQuery(habitQueryOptions.list());

  const {
    data: checkins,
    isPending: isPendingCheckins,
    isError: isErrorCheckins,
    error: checkinsError,
    isSuccess: isSuccessCheckins,
    refetch: refetchCheckins,
  } = useQuery(checkinQueryOptions.list(
    firstDayOfActiveWeek,
    weekEndOfActiveWeek < today ? weekEndOfActiveWeek : undefined,
  ));

  const refetch = () => {
    if (isErrorHabits) {
      void refetchHabits();
    }
    if (isErrorCheckins) {
      void refetchCheckins();
    }
  };

  const activeDayHabits = habits
    ? filterHabitsForDate(habits, activeDate)
    : [];
  const activeDayStatus = getStatusForHabits(
    activeDayHabits,
    checkins ?? EMPTY_CHECKINS,
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
      shadowOnHover={!isErrorCheckins && !isPendingCheckins}
    >
      <HabitItem habit={habit} compact>
        Streak 4
      </HabitItem>
      {isPendingCheckins && (
        <Skeleton
          className={clsx(s.checkinStatus, s.loading)}
          width={29}
          height={29}
          circle
        />
      )}
      {isSuccessCheckins && (
        <span
          className={clsx(
            s.checkinStatus,
            isChecked && s.checked,
          )}
        />
      )}
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
        checkins={checkins ?? EMPTY_CHECKINS}
      />

      {activeDayHabits.length > 0 && (
        <DaySummary
          total={activeDayHabits.length}
          done={Object.values(activeDayStatus).filter(Boolean).length}
          loading={isPendingCheckins}
          error={isErrorCheckins}
        />
      )}

      <div>
        <div className={s.checkinHeadingWrapper}>
          <h3 className={s.checkinHeading}>
            Day Summary
          </h3>
          {isErrorCheckins && (
            <div className={s.checkinsError}>
              <UIQueryError
                error={checkinsError}
                vocabulary={checkinErrorMessageVocabulary}
                onRefetch={refetch}
              />
            </div>
          )}
        </div>
        <div className={s.checkinsWrapper}>
          {isPendingHabits && (
            Array.from({ length: 3 }, (_, index) => (
              <UICard
                key={index}
                className={s.checkin}
                as="span"
                shadowOnHover={false}
              >
                <HabitItemSkeleton compact />
                <Skeleton
                  className={clsx(s.checkinStatus, s.loading)}
                  width={29}
                  height={29}
                  circle
                />
              </UICard>
            ))
          )}
          {isErrorHabits && (
            <div className={s.habitsError}>
              <UIQueryError
                error={habitsError}
                vocabulary={habitErrorMessageVocabulary}
                onRefetch={refetch}
                variant="column"
              />
            </div>
          )}
          {isSuccessHabits && (
            activeDayHabits.map((habit) => (
              <SingleCheckin
                habitId={habit.id}
                checked={checkIsExistsCheckin(
                  checkins ?? EMPTY_CHECKINS,
                  habit.id,
                  activeDate,
                )}
                date={activeDate}
                disabled={isErrorCheckins || isPendingCheckins}
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
