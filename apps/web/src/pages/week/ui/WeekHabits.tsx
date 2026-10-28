import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

import { checkinErrorMessageVocabulary, checkinQueryOptions, checkIsExistsCheckin } from '@/entities/checkin';
import {
  checkIsActiveDay,
  habitErrorMessageVocabulary,
  HabitItem,
  HabitItemSkeleton,
  habitQueryOptions,
} from '@/entities/habit';
import { SingleCheckin } from '@/features/toggle-checkin';
import { offsetDate, WEEK_DAYS } from '@/shared/lib/date';
import { UIQueryError } from '@/shared/ui';

import s from './WeekHabits.module.scss';

interface WeekHabitsProps {
  weekStart: string;
  today: string;
}

export const WeekHabits = ({
  weekStart,
  today,
}: WeekHabitsProps) => {
  const weekEndOfActiveWeek = offsetDate(weekStart, 6);
  const currentWeekDays: ((typeof WEEK_DAYS)[number] & { date: string })[]
    // oxlint-disable-next-line oxc/no-map-spread
    = WEEK_DAYS.map((day) => ({
      ...day,
      date: offsetDate(weekStart, day.num - 1),
    }));

  const daySkeletons = Array.from({ length: 7 }, (_, index) => (
    <Skeleton
      key={index}
      borderRadius={10}
      containerClassName={s.checkinSkeleton}
      height="100%"
    />
  ));

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
    weekStart,
    weekEndOfActiveWeek < today ? weekEndOfActiveWeek : undefined,
  ));
  const queryClient = useQueryClient();
  const prevWeekStart = offsetDate(weekStart, -7);
  const prevWeekEnd = offsetDate(prevWeekStart, 6);
  useEffect(() => {
    const prefetchPreviousWeek = async () => {
      if (!isSuccessCheckins) {
        return;
      }
      try {
        await queryClient.query(
          checkinQueryOptions.list(prevWeekStart, prevWeekEnd),
        );
      } catch {
        // The preloading error is not important: the request will be re-executed when the week changes.
      }
    };
    void prefetchPreviousWeek();
  }, [queryClient, prevWeekStart, prevWeekEnd, isSuccessCheckins]);

  const getQueryError = () => {
    if (isErrorHabits) {
      return {
        error: habitsError,
        vocabulary: habitErrorMessageVocabulary,
      };
    }
    if (isErrorCheckins) {
      return {
        error: checkinsError,
        vocabulary: checkinErrorMessageVocabulary,
      };
    }
    return null;
  };
  const queryError = getQueryError();
  const refetch = () => {
    if (isErrorHabits) {
      void refetchHabits();
    }
    if (isErrorCheckins) {
      void refetchCheckins();
    }
  };

  return (
    <>
      <div className={s.errorWrapper}>
        {queryError && (
          <UIQueryError
            error={queryError.error}
            vocabulary={queryError.vocabulary}
            onRefetch={refetch}
          />
        )}
      </div>
      <div className={s.habitsList}>
        {isPendingHabits && Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={s.habitRow}>
            <HabitItemSkeleton
              className={s.habitItem}
            />
            {daySkeletons}
          </div>
        ))}
        {isSuccessHabits && habits.map((habit) => (
          <div key={habit.id} className={s.habitRow}>
            <HabitItem
              habit={habit}
              className={s.habitItem}
            >
              Week Goal {habit.weekGoal}
            </HabitItem>
            {isPendingCheckins && daySkeletons}
            {(isSuccessCheckins || isErrorCheckins)
              && currentWeekDays.map((day) => {
                const isChecked
                  = isSuccessCheckins
                    ? checkIsExistsCheckin(checkins, habit.id, day.date)
                    : false;
                const isActive
                  = checkIsActiveDay(habit, day.date);
                return (
                  <SingleCheckin
                    key={day.date}
                    checked={isChecked}
                    habitId={habit.id}
                    date={day.date}
                    ariaLabel={`${habit.name}, ${day.longName}`}
                    className={clsx(s.checkin, isChecked && s.checked)}
                    disabled={
                      !isActive
                      || isErrorCheckins
                      || day.date > today
                    }
                  >
                    <span className={s.day}>
                      {day.shortName}
                    </span>
                  </SingleCheckin>
                );
              })}
          </div>
        ))}
      </div>
    </>
  );
};
