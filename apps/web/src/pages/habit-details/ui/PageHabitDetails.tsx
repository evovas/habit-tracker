import { useMediaQuery } from '@reactuses/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';

import { habitErrorMessageVocabulary, HabitItem, HabitItemSkeleton, habitQueryOptions } from '@/entities/habit';
import { HabitFormModal } from '@/features/edit-habit';
import type { AppError } from '@/shared/api';
import { ApiError } from '@/shared/api';
import { Route } from '@/shared/config';
import { UIButton, UIQueryError } from '@/shared/ui';
import { TABLET_WIDTH } from '@/shared/ui/styles';

import type { habitDetailsLoader } from '../model/habit-details.loader.ts';
import { DeleteHabit } from './DeleteHabit.tsx';
import s from './PageHabitDetails.module.scss';

export const PageHabitDetails = () => {
  const { habitId } = useLoaderData<typeof habitDetailsLoader>();
  const {
    data: habit,
    isPending: isPendingHabit,
    isError: isErrorHabit,
    error: habitError,
    isSuccess: isSuccessHabit,
    refetch: refetchHabit,
  } = useQuery(habitQueryOptions.item(habitId));

  const isWide = useMediaQuery(`(min-width: ${TABLET_WIDTH}px)`);

  const navigate = useNavigate();
  const navigateToHabitList = () => {
    void navigate(Route.HABITS, { replace: true });
  };

  const getErrorOptions = (error: AppError) => {
    if (error instanceof ApiError && error.code === 'HABIT_NOT_FOUND') {
      return {
        actionRetryButton: 'Navigate to Habit list',
        onRetryAction: navigateToHabitList,
      };
    }
    return {
      actionRetryButton: 'Retry',
      onRetryAction: () => {
        void refetchHabit();
      },
    };
  };

  const errorOptions
    = habitError ? getErrorOptions(habitError) : null;

  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div className={s.pageHabit}>
      <header className={s.header}>
        {isPendingHabit && <HabitItemSkeleton />}
        {isSuccessHabit && <HabitItem habit={habit} />}
        {isErrorHabit && errorOptions && (
          <div className={s.errorWrapper}>
            <UIQueryError
              error={habitError}
              vocabulary={habitErrorMessageVocabulary}
              actionRetryButton={errorOptions.actionRetryButton}
              onRetryAction={errorOptions.onRetryAction}
              variant="column"
            />
          </div>
        )}
        {!isErrorHabit && (
          <div className={s.controlButtons}>
            <DeleteHabit
              habit={habit}
              iconOnly={!isWide}
              disabled={!isSuccessHabit}
              className={s.button}
              onDelete={navigateToHabitList}
            />
            <UIButton
              icon="edit"
              text="Edit habit"
              variant="secondary"
              iconOnly={!isWide}
              disabled={!isSuccessHabit}
              className={s.button}
              onClick={() => {
                setIsEditOpen(true);
              }}
            />
          </div>
        )}
      </header>

      <HabitFormModal
        habit={habit}
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
        }}
        onSave={() => {
          setIsEditOpen(false);
        }}
      />
    </div>
  );
};
