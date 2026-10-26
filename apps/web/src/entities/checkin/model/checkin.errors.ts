const checkinErrorMessages = {
  CHECKIN_INACTIVE_DAY: 'This habit isn’t scheduled for that day.',
  CHECKIN_FUTURE_DATE: 'You can’t check in for a future date.',
  CHECKIN_INVALID_DATE_RANGE: 'The selected date range is invalid. Please choose another period.',
};

export const checkinErrorMessageVocabulary: Partial<Record<string, string>>
  = checkinErrorMessages;
