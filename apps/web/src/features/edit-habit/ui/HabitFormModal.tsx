import { useIsMutating } from '@tanstack/react-query';

import type { Habit } from '@/entities/habit';
import { UIModal } from '@/shared/ui';

import { HABIT_FORM_MUTATION_KEYS } from '../model/habit-form.mutation-keys.ts';
import { HabitForm } from './HabitForm.tsx';
import s from './HabitFormModal.module.scss';

interface HabitFormModalProps {
  habit?: Habit;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}
export const HabitFormModal = ({
  habit,
  open,
  onClose,
  onSave,
}: HabitFormModalProps) => {
  const isPending
    = useIsMutating({ mutationKey: HABIT_FORM_MUTATION_KEYS.SAVE }) > 0;
  return (
    <UIModal
      open={open}
      title={habit?.id ? 'Edit habit' : 'Add a new habit'}
      closable={!isPending}
      description={habit?.id ? undefined : 'Create a routine now—you can edit these details anytime.'}
      className={s.formModal}
      onClose={onClose}
    >
      {({ close }) => (
        <HabitForm
          onClose={close}
          onSave={() => {
            onSave();
            close();
          }}
          habit={habit}
        />
      )}
    </UIModal>
  );
};
