import { Type } from 'typebox';

import { IsoDateSchema } from '../../shared/schemas.ts';
import { HabitId } from '../habits/habits.schemas.ts';

export const CheckinSingleEntrySchema = Type.Object({
  habitId: HabitId,
  date: IsoDateSchema,
});

export const CheckinListResponseSchema = Type.Array(CheckinSingleEntrySchema);

export const CheckinStatisticsSchema = Type.Array(Type.Object({
  habitId: HabitId,
  dayStreak: Type.Integer({
    minimum: 0,
    description: 'Количество дней выполнения привычки подряд',
  }),
  weekStreak: Type.Integer({
    minimum: 0,
    description: 'Количество недель достижения недельной цели привычки подряд',
  }),
}));

export const HabitIdParamsSchema = Type.Object({
  habitId: HabitId,
});

export const DateParamsSchema = Type.Object({
  date: IsoDateSchema,
});

export const CheckinParamsSchema = Type.Object({
  ...HabitIdParamsSchema.properties,
  ...DateParamsSchema.properties,
});

export const CreateCheckinBodySchema = Type.Object({
  date: IsoDateSchema,
}, { additionalProperties: false });

export const TodayQuerySchema = Type.Object({
  today: IsoDateSchema,
});
