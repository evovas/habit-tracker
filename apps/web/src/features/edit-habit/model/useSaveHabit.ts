import type { DefaultError } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Habit, HabitDraft } from '@/entities/habit';
import { habitApi, habitQueryOptions } from '@/entities/habit';

import { HABIT_FORM_MUTATION_KEYS } from './habit-form.mutation-keys.ts';

interface SaveHabitVariables {
  id?: Habit['id'];
  draft: HabitDraft;
}

interface UseSaveHabitResult {
  save: (
    variables: SaveHabitVariables,
    options?: {
      onSuccess?: (habit: Habit) => void;
      onError?: (error: DefaultError) => void;
    },
  ) => void;
  isPending: boolean;
  error: DefaultError | null;
}

export const useSaveHabit = (): UseSaveHabitResult => {
  const queryClient = useQueryClient();
  const {
    mutate: saveHabit,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ id, draft }: SaveHabitVariables) => {
      if (id) {
        return habitApi.update(id, draft);
      }
      return habitApi.create(draft);
    },
    mutationKey: HABIT_FORM_MUTATION_KEYS.SAVE,
    meta: {
      handlesApiErrors: true,
    },
    onSuccess: (data, variables) => {
      if (variables.id) {
        queryClient.setQueryData(
          habitQueryOptions.list().queryKey,
          (oldData) => {
            if (oldData) {
              const result = [...oldData];
              const index = result.findIndex((item) =>
                item.id === variables.id,
              );
              if (index !== -1) {
                result[index] = data;
              }
              return result;
            }
            return oldData;
          },
        );
      } else {
        queryClient.setQueryData(
          habitQueryOptions.list().queryKey,
          (oldData) => {
            if (oldData) {
              return [...oldData, data];
            }
            return oldData;
          },
        );
      }
    },
  });

  const save: UseSaveHabitResult['save'] = (variables, options) => {
    saveHabit(variables, options);
  };

  return {
    save,
    isPending,
    error,
  };
};
