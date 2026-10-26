export const CheckinsErrorCode = {
  NOT_FOUND: 'CHECKIN_NOT_FOUND',
  ALREADY_EXISTS: 'CHECKIN_ALREADY_EXISTS',
  FUTURE_DATE: 'CHECKIN_FUTURE_DATE',
  INACTIVE_DAY: 'CHECKIN_INACTIVE_DAY',
  INVALID_DATE_RANGE: 'CHECKIN_INVALID_DATE_RANGE',
} as const;

type CheckinsErrorCodeValue
  = (typeof CheckinsErrorCode)[keyof typeof CheckinsErrorCode];

declare module '../../shared/errors.ts' {
  interface ErrorCodeRegistry extends Record<CheckinsErrorCodeValue, true> {}
}
