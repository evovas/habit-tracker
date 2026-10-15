import type { Habit } from './habit.types.ts';

export const habitsMock: Habit[] = [
  {
    id: '74996e20-95b6-43e2-9b5c-5cc32b323598',
    name: 'Habit 1',
    activeDays: [1, 3, 5],
    weekGoal: 3,
  },
  {
    id: 'bbaabe4e-bf1d-4e5b-ac5b-4f920e5ff191',
    name: 'Habit 2',
    activeDays: [5, 6, 7],
    weekGoal: 2,
  },
  {
    id: '13e07a48-e56c-48dd-85a1-7e153314fe33',
    name: 'Habit 3',
    activeDays: [1, 2, 3],
    weekGoal: 1,
  },
];
