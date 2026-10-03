import { Type } from 'typebox';

export const HabitSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String({ minLength: 1, maxLength: 120 }),
  activeDays: Type.Array(
    Type.Integer({ minimum: 1, maximum: 7 }),
    { minItems: 1, uniqueItems: true },
  ),
  weekGoal: Type.Integer({ minimum: 1, maximum: 7 }),
  createdAt: Type.String({ format: 'date-time' }),
});

export const HabitResponseSchema = Type.Omit(HabitSchema, ['createdAt']);

export const CreateHabitBodySchema = Type.Pick(
  HabitSchema,
  ['name', 'activeDays', 'weekGoal'],
  { additionalProperties: false },
);

export const UpdateHabitBodySchema = Type.Partial(
  CreateHabitBodySchema,
  { minProperties: 1, additionalProperties: false },
);

export const IdParamsSchema = Type.Object({
  id: HabitSchema.properties.id,
});
