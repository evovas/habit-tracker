import { create } from 'zustand/react';

import { habitsMock } from './habit.mock.ts';
import type { Habit } from './habit.types.ts';

export interface HabitsState {
  items: Habit[];
  create: (data: Omit<Habit, 'id'>) => void;
  update: (id: Habit['id'], data: Partial<Omit<Habit, 'id'>>) => void;
  delete: (id: Habit['id']) => void;
}

export const useHabitsMockStore = create<HabitsState>()((set) => ({
  items: habitsMock,
  create: (data) => {
    const habit = { ...data, id: crypto.randomUUID() };
    set(
      (state) =>
        ({ items: [...state.items, habit] }),
    );
  },
  update: (id, data) => {
    set(
      (state) => ({
        items: state
          .items
          .map((habit) => habit.id === id ? { ...habit, ...data } : habit),
      }));
  },
  delete: (id) => {
    set((state) => ({
      items: state
        .items
        .filter((habit) => habit.id !== id),
    }));
  },
}));
