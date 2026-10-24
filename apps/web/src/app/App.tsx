import '@/shared/ui/styles/variables.css';
import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isAxiosError } from 'axios';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ZodError } from 'zod';

import { routes } from './routes.ts';

const router = createBrowserRouter(routes);

const MAX_RETRIES = 2;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: (failureCount, error) => {
        if (error instanceof ZodError) {
          return false;
        }
        if (isAxiosError(error)
          && error.response
          && error.response.status < 500) {
          return false;
        }
        return failureCount < MAX_RETRIES;
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
