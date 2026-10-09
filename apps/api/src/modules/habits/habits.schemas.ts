import { Type } from 'typebox';

export const HabitId = Type.String({ format: 'uuid' });

export const HabitSchema = Type.Object({
  id: HabitId,
  name: Type.String({ minLength: 1, maxLength: 120 }),
  activeDays: Type.Array(
    Type.Integer({ minimum: 1, maximum: 7 }),
    {
      minItems: 1,
      uniqueItems: true,
      description: 'Дни недели по ISO: 1 — понедельник, 7 — воскресенье',
    },
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
  id: HabitId,
});
