export const habitErrorMessages = {
  HABIT_NOT_FOUND: 'This habit no longer exists. It may have been deleted.',
  HABIT_GOAL_EXCEEDS_DAYS: 'Your weekly goal can’t be greater than the number of active days.',
  HABIT_NAME_EMPTY: 'Enter a habit name.',
  HABIT_DAYS_EMPTY: 'Select at least one active day.',
  HABIT_DAYS_NOT_UNIQUE: 'Each active day can only be selected once.',
};

export const habitErrorMessageVocabulary: Partial<Record<string, string>>
  = habitErrorMessages;
