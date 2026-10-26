import type { Static } from 'typebox';

import type {
  DateRangeOptionalQuerySchema,
  DateRangeQuerySchema,
  IsoDateSchema,
} from './schemas.ts';

export type IsoDate = Static<typeof IsoDateSchema>;
export type DateRange = Static<typeof DateRangeQuerySchema>;
export type DateRangeOptional = Static<typeof DateRangeOptionalQuerySchema>;
export interface DateRangeStrict {
  from: IsoDate;
  to: IsoDate;
}
