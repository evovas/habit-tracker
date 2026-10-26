import { apiClient } from '@/shared/api';
import { validateData } from '@/shared/model';

import type { Habit, HabitDraft } from '../model/habit.types.ts';
import { zHabit, zHabitList } from '../model/habit.validator.ts';

const HABIT_API_PATH = '/habits';

export const habitApi = {
  getHabitList: async (): Promise<Habit[]> => validateData(
    zHabitList,
    await apiClient.get(HABIT_API_PATH),
  ),
  getHabitById: async (id: Habit['id']): Promise<Habit> => validateData(
    zHabit,
    await apiClient.get(`${HABIT_API_PATH}/${id}`),
  ),
  create: async (data: HabitDraft): Promise<Habit> => validateData(
    zHabit,
    await apiClient.post(HABIT_API_PATH, data),
  ),
  update: async (id: Habit['id'], data: HabitDraft): Promise<Habit> => validateData(
    zHabit,
    await apiClient.patch(`${HABIT_API_PATH}/${id}`, data),
  ),
  delete: (id: Habit['id']): Promise<void> =>
    apiClient.delete(`${HABIT_API_PATH}/${id}`),
};
