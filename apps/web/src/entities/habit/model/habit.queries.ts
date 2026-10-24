import { queryOptions } from '@tanstack/react-query';

import { habitApi } from '../api/habit.api.ts';
import type { Habit } from './habit.types.ts';

const HABIT_QUERY_KEYS = {
  root: ['habit'] as const,
  list: () => [...HABIT_QUERY_KEYS.root, 'list'] as const,
  item: (id: Habit['id']) => [...HABIT_QUERY_KEYS.root, 'item', id] as const,
};

export const habitQueryOptions = {
  list: () => queryOptions({
    queryKey: HABIT_QUERY_KEYS.list(),
    queryFn: habitApi.getHabitList,
  }),
  item: (id: Habit['id']) => queryOptions({
    queryKey: HABIT_QUERY_KEYS.item(id),
    queryFn: () => habitApi.getHabitById(id),
  }),
};
