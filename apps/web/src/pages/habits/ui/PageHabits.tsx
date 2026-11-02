import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';

import { habitErrorMessageVocabulary, HabitItem, HabitItemSkeleton, habitQueryOptions } from '@/entities/habit';
import { HabitFormModal } from '@/features/edit-habit';
import { routeUrl } from '@/shared/config';
import { UIButton, UICard, UIQueryError } from '@/shared/ui';

import s from './PageHabits.module.scss';

export const PageHabits = () => {
  const {
    data: habits,
    isPending: isPendingHabits,
    isError: isErrorHabits,
    error: habitsError,
    isSuccess: isSuccessHabits,
    refetch: refetchHabits,
  } = useQuery(habitQueryOptions.list());

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className={s.pageHabits}>
      <header className={s.header}>
        <div className={s.headerText}>
          <h2 className={s.headerTitle}>A list of things that lead you toward your goal</h2>
          <p className={s.headerDescription}>Add another one. Or change a different one.</p>
        </div>
        <UIButton
          icon="add"
          text="Add habit"
          onClick={() => {
            setIsFormOpen(true);
          }}
        />
      </header>

      <div className={s.habitList}>
        {isPendingHabits && Array.from({ length: 3 }, (_, index) => (
          <UICard key={index}>
            <HabitItemSkeleton />
          </UICard>
        ))}
        {isSuccessHabits && habits.length > 0 && habits.map((habit) => (
          <Link key={habit.id} to={routeUrl.habitDetails(habit.id)}>
            <UICard as="span" containerClassName={s.habitItem}>
              <HabitItem habit={habit} />
            </UICard>
          </Link>
        ))}
        {isSuccessHabits && habits.length === 0 && (
          <span className={s.habitsEmpty}>
            You don’t have any habits yet.<br />
            Add one by clicking the button above.
          </span>
        )}
        {isErrorHabits && (
          <div className={s.habitsError}>
            <UIQueryError
              variant="column"
              error={habitsError}
              vocabulary={habitErrorMessageVocabulary}
              onRetryAction={() => {
                void refetchHabits();
              }}
            />
          </div>
        )}
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
