import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import type { AppError } from './error-handler.ts';
import {
  ApiError,
  getUserErrorMessage,
  ResponseValidationError,
} from './error-handler.ts';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AppError;
    queryMeta: {
      errorMessages?: Partial<Record<string, string>>;
    };
    mutationMeta: {
      handlesApiErrors?: boolean;
      errorMessages?: Partial<Record<string, string>>;
    };
  }
}

const globalErrorHandler = (
  error: AppError,
  vocabulary: Partial<Record<string, string>>,
) => {
  toast.error(
    getUserErrorMessage(vocabulary, error),
    { id: error instanceof ApiError ? error.code : error.name },
  );
};

const MAX_RETRIES = 2;
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: (failureCount, error) => {
        if (error instanceof ResponseValidationError) {
          return false;
        }
        if (error instanceof ApiError && error.status < 500) {
          return false;
        }
        return failureCount < MAX_RETRIES;
      },
    },
  },
  mutationCache: new MutationCache({
    onError:
      (error, _variables, _context, mutation) => {
        if (mutation.meta?.handlesApiErrors && error instanceof ApiError) {
          return;
        }
        const vocabulary = mutation.meta?.errorMessages ?? {};
        globalErrorHandler(error, vocabulary);
      },
  }),
  queryCache: new QueryCache({
    onError:
      (error, query) => {
        if (query.state.data === undefined) {
          return;
        }
        const vocabulary = query.meta?.errorMessages ?? {};
        globalErrorHandler(error, vocabulary);
      },
  }),
});
