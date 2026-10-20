import { create } from 'zustand/react';

import { checkinsMock } from './checkin.mock.ts';
import type { CheckinEntry } from './checkin.types.ts';

export interface CheckinsState {
  items: CheckinEntry[];
  create: (habitId: string, date: string) => void;
  delete: (habitId: string, date: string) => void;
  deleteByHabitId: (habitId: string) => void;
}

export const useCheckinsMockStore = create<CheckinsState>()((set) => ({
  items: checkinsMock,
  create: (habitId, date) => {
    const newCheckin: CheckinEntry = {
      habitId,
      date,
    };
    set((state) => ({
      items: [...state.items, newCheckin],
    }));
  },
  delete: (habitId, date) => {
    set((state) => ({
      items: state.items.filter((checkin) =>
        checkin.habitId !== habitId || checkin.date !== date,
      ),
    }));
  },
  deleteByHabitId: (habitId) => {
    set((state) => ({
      items: state.items.filter((checkin) =>
        checkin.habitId !== habitId,
      ),
    }));
  },
}));
