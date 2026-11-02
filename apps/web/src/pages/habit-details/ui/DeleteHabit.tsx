import { useState } from 'react';

import type { Habit } from '@/entities/habit';
import { UIButton, UIConfirmationModal } from '@/shared/ui';

import { useDeleteHabit } from '../model/useDeleteHabit.ts';

interface DeleteHabitProps {
  habit: Habit | undefined;
  iconOnly?: boolean;
  disabled?: boolean;
  className?: string;
  onDelete: () => void;
}

export const DeleteHabit = ({
  habit,
  iconOnly,
  disabled,
  className,
  onDelete,
}: DeleteHabitProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { deleteHabit, isPending } = useDeleteHabit();

  const handleConfirm = (id: Habit['id']) => {
    deleteHabit(
      { id },
      {
        onSuccess: () => {
          onDelete();
        },
        onSettled: () => {
          setIsDeleteOpen(false);
        },
      },
    );
  };

  return (
    <>
      <UIButton
        icon="delete"
        text="Delete"
        variant="warning"
        iconOnly={iconOnly}
        disabled={Boolean(disabled) || !habit}
        className={className}
        onClick={() => {
          setIsDeleteOpen(true);
        }}
      />

      {habit && (
        <UIConfirmationModal
          open={isDeleteOpen}
          title="Delete habit?"
          description={`This removes ${habit.name} and its completion history.`}
          confirmButtonText="Delete"
          variant="warning"
          pending={isPending}
          onCancel={() => {
            setIsDeleteOpen(false);
          }}
          onConfirm={() => {
            handleConfirm(habit.id);
          }}
        />
      )}
    </>
  );
};
