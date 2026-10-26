import { describe, expect, test } from 'vitest';

import { TestWeek } from '../../tests/constants.ts';
import { getISOStartOfWeek, getISOWeekDay, offsetDate } from '../dates.ts';

describe('dates.ts', () => {
  describe('getISOStartOfWeek', () => {
    test.for([
      [TestWeek.MONDAY],
      [TestWeek.TUESDAY],
      [TestWeek.WEDNESDAY],
      [TestWeek.THURSDAY],
      [TestWeek.FRIDAY],
      [TestWeek.SATURDAY],
      [TestWeek.SUNDAY],
    ] as const)('getISOStartOfWeek(%s) → %s', ([date]) => {
      expect(getISOStartOfWeek(date)).toBe(TestWeek.MONDAY);
    });
  });

  describe('getISOWeekDay', () => {
    test.for([
      [TestWeek.MONDAY, 1],
      [TestWeek.TUESDAY, 2],
      [TestWeek.WEDNESDAY, 3],
      [TestWeek.THURSDAY, 4],
      [TestWeek.FRIDAY, 5],
      [TestWeek.SATURDAY, 6],
      [TestWeek.SUNDAY, 7],
    ] as const)('getISOWeekDay(%s) → %i', ([date, expected]) => {
      expect(getISOWeekDay(date)).toBe(expected);
    });
  });

  describe('offsetDate', () => {
    test('Negative number', () => {
      expect(offsetDate(TestWeek.WEDNESDAY, -1))
        .toBe(TestWeek.TUESDAY);
    });
    test('Zero', () => {
      expect(offsetDate(TestWeek.WEDNESDAY, 0))
        .toBe(TestWeek.WEDNESDAY);
    });
    test('Positive number', () => {
      expect(offsetDate(TestWeek.WEDNESDAY, 1))
        .toBe(TestWeek.THURSDAY);
    });
  });
});
