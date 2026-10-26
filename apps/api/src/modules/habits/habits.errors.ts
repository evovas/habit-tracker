export const HabitsErrorCode = {
  NOT_FOUND: 'HABIT_NOT_FOUND',
  DAYS_NOT_UNIQUE: 'HABIT_DAYS_NOT_UNIQUE',
  DAYS_EMPTY: 'HABIT_DAYS_EMPTY',
  GOAL_EXCEEDS_DAYS: 'HABIT_GOAL_EXCEEDS_DAYS',
  NAME_EMPTY: 'HABIT_NAME_EMPTY',
} as const;

type HabitsErrorCodeValue
  = (typeof HabitsErrorCode)[keyof typeof HabitsErrorCode];

declare module '../../shared/errors.ts' {
  interface ErrorCodeRegistry extends Record<HabitsErrorCodeValue, true> {}
}
