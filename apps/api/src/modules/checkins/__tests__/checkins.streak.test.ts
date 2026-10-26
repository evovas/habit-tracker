import { describe, expect, test } from 'vitest';

import { offsetDate } from '../../../shared/dates.ts';
import { TestWeek } from '../../../tests/constants.ts';
import { getMockHabit } from '../../../tests/helpers.ts';
import { getWeekActiveDates } from '../checkins.streaks.ts';

const DEFAULT_TODAY = TestWeek.WEDNESDAY;

describe('checkins.streaks.ts', () => {
  describe('getWeekActiveDates returns only past dates on reversed order', () => {
    const mockHabit = getMockHabit({
      // MONDAY, WEDNESDAY, FRIDAY
      activeDays: [1, 3, 5],
    });
    test.for([
      [
        { habit: mockHabit, weekCount: 0, today: DEFAULT_TODAY },
        [TestWeek.MONDAY],
      ],
      [
        { habit: mockHabit, weekCount: 1, today: DEFAULT_TODAY },
        [TestWeek.FRIDAY, TestWeek.WEDNESDAY, TestWeek.MONDAY]
          .map((date) => offsetDate(date, -7)),
      ],
    ] as const)('getWeekActiveDates(%o) → %o', ([{ habit, weekCount, today }, expected]) => {
      expect(getWeekActiveDates(habit, weekCount, today)).toEqual(expected);
    });
  });
});
