import type { Static } from 'typebox';

import type { CheckinSingleEntrySchema, CheckinStatisticsSchema } from './checkins.schemas.ts';

export type CheckinSingleEntry = Static<typeof CheckinSingleEntrySchema>;

export type CheckinStatistics = Static<typeof CheckinStatisticsSchema>;
