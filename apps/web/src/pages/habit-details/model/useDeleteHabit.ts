import type { DefaultError } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { CHECKIN_QUERY_KEYS } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';
import { HABIT_QUERY_KEYS, habitApi, habitErrorMessageVocabulary, habitQueryOptions } from '@/entities/habit';
import { ApiError, getUserErrorMessage } from '@/shared/api';

interface DeleteHabitVariables {
  id: Habit['id'];
}

interface UseDeleteHabitResult {
  deleteHabit: (
    variables: DeleteHabitVariables,
    options?: {
      onSuccess?: () => void;
      onError?: (error: DefaultError) => void;
      onSettled?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export const useDeleteHabit = (): UseDeleteHabitResult => {
  const queryClient = useQueryClient();
  const handleSuccess = (id: string) => {
    queryClient.setQueryData(
      habitQueryOptions.list().queryKey,
      (oldData) => {
        if (oldData) {
          return oldData.filter((item) => item.id !== id);
        }
        return oldData;
      },
    );
    void queryClient.invalidateQueries({ queryKey: CHECKIN_QUERY_KEYS.root });
  };

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: async ({ id }: DeleteHabitVariables): Promise<void> => {
      try {
        await habitApi.delete(id);
      } catch (error) {
        if (error instanceof ApiError && error.code === 'HABIT_NOT_FOUND') {
          return;
        }
        throw error;
      }
    },
    meta: {
      handlesApiErrors: true,
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: HABIT_QUERY_KEYS.root });
    },
    onSuccess: (_, { id }) => {
      handleSuccess(id);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(getUserErrorMessage(habitErrorMessageVocabulary, error));
      }
    },
  });

  const deleteHabit: UseDeleteHabitResult['deleteHabit'] = (variables, options) => {
    mutate(variables, options);
  };

  return {
    deleteHabit,
    isPending,
  };
};
