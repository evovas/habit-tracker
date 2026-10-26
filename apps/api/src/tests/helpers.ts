import type { Habit } from '../modules/habits/habits.types.ts';

export const getMockHabit = (redefine: Partial<Habit>): Habit => ({
  id: crypto.randomUUID(),
  name: 'Mock Habit',
  activeDays: [1, 2, 3],
  weekGoal: 2,
  createdAt: new Date().toISOString(),
  ...redefine,
});
