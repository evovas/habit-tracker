import { create } from 'zustand/react';

import { habitsMock } from './habit.mock.ts';
import type { Habit } from './habit.types.ts';

export interface HabitsState {
  items: Habit[];
  create: (data: Omit<Habit, 'id'>) => Habit;
  update: (id: Habit['id'], data: Partial<Omit<Habit, 'id'>>) => Habit;
  delete: (id: Habit['id']) => void;
}

export const useHabitsMockStore = create<HabitsState>()((set, get) => ({
  items: habitsMock,
  create: (data) => {
    const habit = { ...data, id: crypto.randomUUID() };
    set(
      (state) =>
        ({ items: [...state.items, habit] }),
    );
    return habit;
  },
  update: (id, data) => {
    set(
      (state) => ({
        items: state
          .items
          .map((habit) => habit.id === id ? { ...habit, ...data } : habit),
      }),
    );
    const updatedHabit = get().items.find((habit) => habit.id === id);
    if (!updatedHabit) {
      throw new Error('Habit not found');
    }
    return updatedHabit;
  },
  delete: (id) => {
    set((state) => ({
      items: state
        .items
        .filter((habit) => habit.id !== id),
    }));
  },
}));
