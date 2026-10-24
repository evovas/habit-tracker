import { z } from 'zod';

const zEnv = z
  .object({
    VITE_API_URL: z.string(),
  })
  .transform((raw) => ({
    apiUrl: raw.VITE_API_URL,
  }));

const result = zEnv.safeParse(import.meta.env);

if (!result.success) {
  throw new Error(
    `Invalid environment variables:
    ${z.prettifyError(result.error)}`,
  );
}

export const env = result.data;
