import type { SubmitEvent } from 'react';
import { useState } from 'react';
import type { ZodError, ZodSafeParseResult } from 'zod';
import { z } from 'zod';

import type { Habit } from '@/entities/habit';
import {
  UIButton,
  UIModal,
  UITextInput,
  UIVariantSelector,
  UIWeekDaySelector,
} from '@/shared/ui';

import { zHabitForm } from '../model/habit-form.schema.ts';
import type { HabitFormInput, HabitFormOutput } from '../model/habit-form.types.ts';
import { useSaveHabit } from '../model/useSaveHabit.ts';
import s from './HabitForm.module.scss';

interface HabitFormProps {
  habit?: Habit;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

type Frequency = 'all' | 'specific';
interface FrequencyOption {
  label: string;
  value: Frequency;
}

const FULL_WEEK_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
const DEFAULT_ERROR_STATE: Record<keyof HabitFormInput, string[]> = {
  name: [],
  activeDays: [],
  weekGoal: [],
};
const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    label: 'Every day',
    value: 'all',
  },
  {
    label: 'Specific weekdays',
    value: 'specific',
  },
];

export const HabitForm = ({
  habit,
  open,
  onClose,
  onSave,
}: HabitFormProps) => {
  const isEditing = Boolean(habit);
  const [name, setName] = useState<HabitFormInput['name']>(habit?.name ?? '');
  const [weekGoal, setWeekGoal] = useState<HabitFormInput['weekGoal']>(
    habit?.weekGoal ? String(habit.weekGoal) : '1',
  );

  const getFrequency = (): Frequency => {
    if (!habit) {
      return 'all';
    }
    return habit.activeDays.length === 7 ? 'all' : 'specific';
  };
  const [frequency, setFrequency]
    = useState<Frequency>(() => getFrequency());
  const [activeDays, setActiveDays]
    = useState<HabitFormInput['activeDays']>(habit?.activeDays ?? [...FULL_WEEK_DAYS]);
  const handleSetFrequency = (value: Frequency) => {
    setFrequency(value);
    if (value === 'all') {
      setActiveDays([...FULL_WEEK_DAYS]);
    }
  };

  const validateForm = (): ZodSafeParseResult<HabitFormOutput> => {
    const data = {
      name,
      weekGoal,
      activeDays,
    };
    return zHabitForm.safeParse(data);
  };

  const flattenError = (error: ZodError | undefined) => {
    if (error) {
      return z.flattenError(error).fieldErrors;
    }
    return {};
  };

  const { save, isPending } = useSaveHabit();
  const [isOnceSubmitted, setIsOnceSubmitted] = useState(false);
  const errors = {
    ...DEFAULT_ERROR_STATE,
    ...(isOnceSubmitted ? flattenError(validateForm().error) : {}),
  };
  const handleSubmit = (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsOnceSubmitted(true);
    const result = validateForm();
    if (!result.success) {
      return;
    }
    const successData = result.data;
    save(
      {
        id: habit?.id,
        draft: successData,
      },
      {
        onSuccess: () => {
          onSave();
        },
      },
    );
  };

  return (
    <UIModal
      open={open}
      title={isEditing ? 'Edit habit' : 'Add a new habit'}
      closable={!isPending}
      description={isEditing ? undefined : 'Create a routine now—you can edit these details anytime.'}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={s.formWrapper}>
          <UITextInput
            icon="text"
            label="Name"
            required
            maxLength={120}
            value={name}
            errors={errors.name}
            onChange={setName}
          />
          <UITextInput
            type="number"
            icon="number"
            label="Weekly goal"
            required
            maxLength={1}
            value={weekGoal}
            errors={errors.weekGoal}
            onChange={setWeekGoal}
          />
          <UIVariantSelector
            label="Frequency"
            options={FREQUENCY_OPTIONS}
            value={frequency}
            onChange={handleSetFrequency}
          />
          <UIWeekDaySelector
            label="Active days"
            name="activeDays"
            disabled={frequency === 'all'}
            value={activeDays}
            errors={errors.activeDays}
            onChange={setActiveDays}
          />
          <div className={s.buttonsWrapper}>
            <UIButton text="Cancel" variant="secondary" disabled={isPending} onClick={onClose} />
            <UIButton text="Save habit" type="submit" disabled={isPending} />
          </div>
        </div>
      </form>
    </UIModal>
  );
};
