import type { AxiosResponse } from 'axios';
import { create } from 'axios';

import { env } from '../config/env.ts';
import { parseError } from './error-handler.ts';

export const apiClient = create({
  baseURL: env.apiUrl,
});

const onResponseSuccess = (response: AxiosResponse) => response;
const onResponseFail = (error: unknown) => {
  throw parseError(error);
};

apiClient.interceptors.response.use(onResponseSuccess, onResponseFail);
