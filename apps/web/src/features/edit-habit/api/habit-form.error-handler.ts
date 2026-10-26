import { habitErrorMessageVocabulary } from '@/entities/habit';
import type { ApiError, ApiErrorDetail } from '@/shared/api';
import { getUserErrorMessage } from '@/shared/api';

import type { FormErrorState } from '../model/habit-form.types.ts';

type FormErrorKey = keyof FormErrorState;
type FormFieldKey = Exclude<FormErrorKey, 'body'>;

const FORM_FIELDS = [
  'name',
  'activeDays',
  'weekGoal',
] as const satisfies readonly FormFieldKey[];

const FIELD_BY_CODE: Partial<Record<string, FormErrorKey>> = {
  HABIT_GOAL_EXCEEDS_DAYS: 'weekGoal',
  HABIT_NAME_EMPTY: 'name',
  HABIT_DAYS_EMPTY: 'activeDays',
  HABIT_DAYS_NOT_UNIQUE: 'activeDays',
};

const VALIDATION_MESSAGES: Record<FormErrorKey, string> = {
  name: 'Check the habit name.',
  weekGoal: 'Enter a whole number from 1 to 7.',
  activeDays: 'Check the selected active days.',
  body: 'Some of the entered data is invalid.\nPlease check the fields and try again.',
};

const isFormField = (value: string | undefined): value is FormFieldKey =>
  FORM_FIELDS.some((field) => field === value);

const getErrorKey = (path: string): FormErrorKey => {
  const [location, field] = path.split('/');
  if (location === 'body' && isFormField(field)) {
    return field;
  }
  return 'body';
};

export const parseValidationDetails = (
  details: readonly ApiErrorDetail[],
): Partial<FormErrorState> => {
  const keys = new Set(details.map((detail) => getErrorKey(detail.path)));
  const result: Partial<FormErrorState> = {};
  for (const key of keys) {
    result[key] = [VALIDATION_MESSAGES[key]];
  }
  return result;
};

export const parseHabitFormError
  = (error: ApiError): Partial<FormErrorState> => {
    if (error.code === 'VALIDATION_ERROR') {
      const result = parseValidationDetails(error.details ?? []);
      return Object.keys(result).length > 0
        ? result
        : { body: [VALIDATION_MESSAGES.body] };
    }
    const field = FIELD_BY_CODE[error.code];
    return { [field ?? 'body']: [getUserErrorMessage(habitErrorMessageVocabulary, error)] };
  };
