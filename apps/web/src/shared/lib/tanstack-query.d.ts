import type { AxiosError } from 'axios';
import type { ZodError } from 'zod';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError | ZodError;
  }
}
