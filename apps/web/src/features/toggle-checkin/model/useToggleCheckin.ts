import type { DefaultError } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import type { CheckinEntry } from '@/entities/checkin';
import { CHECKIN_QUERY_KEYS, checkinApi, checkinErrorMessageVocabulary } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';
import { ApiError, getUserErrorMessage } from '@/shared/api';

interface ToggleCheckinVariables {
  state: boolean;
}

interface UseToggleCheckinResult {
  toggle: (
    variables: ToggleCheckinVariables,
    options?: {
      onSuccess?: () => void;
      onError?: (error: DefaultError) => void;
    },
  ) => void;
}

const SCOPE_PREFIX = 'checkin-toggle';

export const useToggleCheckin = (habitId: Habit['id'], date: string): UseToggleCheckinResult => {
  const queryClient = useQueryClient();
  const getApplicableCaches = () => {
    const caches = queryClient.getQueriesData<CheckinEntry[]>({
      queryKey: CHECKIN_QUERY_KEYS.lists(),
    });
    return caches.filter((cache) => {
      const keys = cache[0];
      const range = keys[2];
      if (typeof range === 'object'
        && range !== null
        && 'from' in range
        && typeof range.from === 'string'
      ) {
        if ('to' in range && typeof range.to === 'string') {
          return range.from <= date && date <= range.to;
        }
        return range.from <= date;
      }
      return false;
    });
  };
  const applyCheckinCaches = (
    state: boolean,
  ) => {
    getApplicableCaches().forEach((cache) => {
      const data = cache[1];
      if (!data) {
        return;
      }
      if (state) {
        if (data.every((item) =>
          item.habitId !== habitId || item.date !== date,
        )) {
          queryClient.setQueryData(
            cache[0],
            [...data, { habitId, date }],
          );
        }
      } else {
        queryClient.setQueryData(
          cache[0],
          data.filter((item) =>
            item.habitId !== habitId || item.date !== date,
          ),
        );
      }
    });
  };
  const {
    mutate: toggleCheckin,
  } = useMutation({
    scope: { id: `${SCOPE_PREFIX}-${habitId}-${date}` },
    meta: {
      handlesApiErrors: true,
    },
    mutationFn: async ({ state }: ToggleCheckinVariables) => {
      // oxlint-disable-next-line unicorn/prefer-ternary
      if (state) {
        await checkinApi.create(habitId, date);
      } else {
        await checkinApi.delete(habitId, date);
      }
    },
    onMutate: async ({ state }) => {
      await queryClient.cancelQueries({ queryKey: CHECKIN_QUERY_KEYS.lists() });
      applyCheckinCaches(state);
    },
    onError: (err, { state }) => {
      if (err instanceof ApiError) {
        if (err.code === 'CHECKIN_NOT_FOUND'
          || err.code === 'CHECKIN_ALREADY_EXISTS') {
          return;
        }
        toast.error(getUserErrorMessage(checkinErrorMessageVocabulary, err));
      }
      applyCheckinCaches(!state);
    },
    onSettled: () => {
      const allPending = queryClient.getMutationCache().findAll({ status: 'pending' });
      const queue = allPending.filter(
        (mutation) => mutation.options.scope?.id.startsWith(SCOPE_PREFIX),
      );
      if (queue.length === 1) {
        void queryClient.invalidateQueries({
          queryKey: CHECKIN_QUERY_KEYS.lists(),
        });
      }
    },
  });

  const toggle: UseToggleCheckinResult['toggle'] = (variables, options) => {
    toggleCheckin(variables, options);
  };

  return { toggle };
};
