import { queryOptions } from '@tanstack/react-query';

import { checkinApi } from '../api/checkin.api.ts';
import { checkinErrorMessageVocabulary } from './checkin.errors.ts';

export const CHECKIN_QUERY_KEYS = {
  root: ['checkin'] as const,
  lists: () => [...CHECKIN_QUERY_KEYS.root, 'list'] as const,
  list: (from: string, to?: string) => [
    ...CHECKIN_QUERY_KEYS.lists(),
    { from, to },
  ] as const,
};

const meta = {
  errorMessages: checkinErrorMessageVocabulary,
};

export const checkinQueryOptions = {
  list: (from: string, to?: string) => queryOptions({
    queryKey: CHECKIN_QUERY_KEYS.list(from, to),
    queryFn: () => checkinApi.getCheckinList(from, to),
    meta,
  }),
};
