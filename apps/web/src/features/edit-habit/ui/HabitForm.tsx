import type { SubmitEvent } from 'react';
import { useState } from 'react';
import type { ZodError, ZodSafeParseResult } from 'zod';
import { z } from 'zod';

import type { Habit } from '@/entities/habit';
import { ApiError } from '@/shared/api';
import {
  UIButton,
  UITextInput,
  UIVariantSelector,
  UIWeekDaySelector,
} from '@/shared/ui';

import { parseHabitFormError } from '../api/habit-form.error-handler.ts';
import { zHabitForm } from '../model/habit-form.schema.ts';
import type { FormErrorState, HabitFormInput, HabitFormOutput } from '../model/habit-form.types.ts';
import { useSaveHabit } from '../model/useSaveHabit.ts';
import s from './HabitForm.module.scss';

interface HabitFormProps {
  habit?: Habit;
  onClose: () => void;
  onSave: () => void;
}

type Frequency = 'all' | 'specific';
interface FrequencyOption {
  label: string;
  value: Frequency;
}

const FULL_WEEK_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
const DEFAULT_ERROR_STATE: FormErrorState = {
  name: [],
  activeDays: [],
  weekGoal: [],
  body: [],
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
  onClose,
  onSave,
}: HabitFormProps) => {
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
  const clientErrors = {
    ...DEFAULT_ERROR_STATE,
    ...(isOnceSubmitted ? flattenError(validateForm().error) : {}),
  };
  const [serverErrors, setServerErrors] = useState<Partial<FormErrorState>>({});
  const errors = {
    ...clientErrors,
    ...serverErrors,
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
        onError: (error) => {
          if (error instanceof ApiError) {
            setServerErrors(parseHabitFormError(error));
          }
        },
      },
    );
  };

  const handleFormChange = <T,>(value: T, setter: (v: T) => void) => {
    setServerErrors({});
    setter(value);
  };

  return (
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
          onChange={(v) => {
            handleFormChange(v, setName);
          }}
        />
        <UITextInput
          type="number"
          icon="number"
          label="Weekly goal"
          required
          maxLength={1}
          value={weekGoal}
          errors={errors.weekGoal}
          onChange={(v) => {
            handleFormChange(v, setWeekGoal);
          }}
        />
        <UIVariantSelector
          label="Frequency"
          options={FREQUENCY_OPTIONS}
          value={frequency}
          onChange={(v) => {
            handleFormChange(v, handleSetFrequency);
          }}
        />
        <UIWeekDaySelector
          label="Active days"
          name="activeDays"
          disabled={frequency === 'all'}
          value={activeDays}
          errors={errors.activeDays}
          onChange={(v) => {
            handleFormChange(v, setActiveDays);
          }}
        />
        {errors.body.length > 0 && (
          <div role="alert" className={s.errorTextWrapper}>
            {errors.body.map((error) => <p key={error} className={s.errorText}>{error}</p>)}
          </div>
        )}
        <div className={s.buttonsWrapper}>
          <UIButton text="Cancel" variant="secondary" disabled={isPending} onClick={onClose} />
          <UIButton text="Save habit" type="submit" disabled={isPending} />
        </div>
      </div>
    </form>
  );
};
