import { create } from 'axios';

import { env } from '../config/env.ts';

export const apiClient = create({
  baseURL: env.apiUrl,
});
