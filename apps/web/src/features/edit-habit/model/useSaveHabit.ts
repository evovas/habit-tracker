import type { Habit, HabitDraft } from '@/entities/habit';
import { useHabitsMockStore } from '@/entities/habit';

interface SaveHabitVariables {
  id?: Habit['id'];
  draft: HabitDraft;
}

interface UseSaveHabitResult {
  save: (
    variables: SaveHabitVariables,
    options?: { onSuccess?: (habit: Habit) => void },
  ) => void;
  isPending: boolean;
  error: Error | null;
}

export const useSaveHabit = (): UseSaveHabitResult => {
  const createHabit = useHabitsMockStore((state) => state.create);
  const updateHabit = useHabitsMockStore((state) => state.update);

  const save: UseSaveHabitResult['save'] = (variables, options) => {
    const { draft, id } = variables;
    const result = id ? updateHabit(id, draft) : createHabit(draft);
    options?.onSuccess?.(result);
  };

  return {
    save,
    isPending: false,
    error: null,
  };
};
