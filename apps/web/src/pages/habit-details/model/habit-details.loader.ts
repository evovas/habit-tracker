import type { LoaderFunctionArgs } from 'react-router';
import { replace } from 'react-router';
import { z } from 'zod';

import { Route } from '@/shared/config';

export const habitDetailsLoader = ({ params }: LoaderFunctionArgs) => {
  const result = z.uuid().safeParse(params.habitId);
  if (!result.success) {
    return replace(Route.HABITS);
  }

  return { habitId: result.data };
};
