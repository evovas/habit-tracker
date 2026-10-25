import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

import { queryClient } from '@/shared/api';

interface TanStackQueryProviderProps {
  children: ReactNode;
}

export const TanStackQueryProvider = ({
  children,
}: TanStackQueryProviderProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
