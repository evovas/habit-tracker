import { apiClient } from '@/shared/api';
import { validateData } from '@/shared/model';

import { zCheckinEntries, zCheckinEntry } from '../model/checkin.validator.ts';

const HABIT_API_PATH = '/habits';
const CHECKIN_API_PATH = '/checkins';

export const checkinApi = {
  getCheckinList: async (from: string, to?: string) =>
    validateData(
      zCheckinEntries,
      await apiClient.get(CHECKIN_API_PATH, { params: { from, to } }),
    ),
  create: async (habitId: string, date: string) => validateData(
    zCheckinEntry,
    await apiClient.post(`${HABIT_API_PATH}/${habitId}${CHECKIN_API_PATH}`, { date }),
  ),
  delete: async (habitId: string, date: string): Promise<void> => {
    await apiClient.delete(`${HABIT_API_PATH}/${habitId}${CHECKIN_API_PATH}/${date}`);
  },
};
