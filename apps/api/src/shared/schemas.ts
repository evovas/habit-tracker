import { Type } from 'typebox';

export const IsoDateSchema = Type.String({ format: 'date' });

export const DateRangeOptionalQuerySchema = Type.Object({
  from: Type.Optional(IsoDateSchema),
  to: Type.Optional(IsoDateSchema),
});

export const DateRangeQuerySchema = Type.Object({
  from: IsoDateSchema,
  to: Type.Optional(IsoDateSchema),
});
