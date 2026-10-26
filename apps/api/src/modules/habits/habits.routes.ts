import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';

import { CreateHabitBodySchema, HabitResponseSchema, IdParamsSchema, UpdateHabitBodySchema } from './habits.schemas.ts';
import type { HabitsService } from './habits.service.ts';

interface HabitsRoutesOptions {
  habitsService: HabitsService;
}

export const habitsRoutes: FastifyPluginAsyncTypebox<HabitsRoutesOptions>
  = async (
    fastify,
    { habitsService },
  ) => {
    fastify.get(
      '/',
      {
        schema: {
          tags: ['habits'],
          summary: 'Получить список всех привычек',
          response: { 200: Type.Array(HabitResponseSchema) },
        },
      },
      async () => habitsService.getHabitsList(),
    );

    fastify.get(
      '/:id',
      {
        schema: {
          tags: ['habits'],
          summary: 'Получить привычку по id',
          params: IdParamsSchema,
          response: { 200: HabitResponseSchema },
        },
      },
      async (request) =>
        habitsService.getHabitById(request.params.id),
    );

    fastify.post(
      '/',
      {
        schema: {
          tags: ['habits'],
          summary: 'Создать привычку',
          body: CreateHabitBodySchema,
          response: { 201: HabitResponseSchema },
        },
      },
      async (request, reply) => {
        const habit = await habitsService.createHabit(request.body);
        void reply.code(201);
        return habit;
      },
    );

    fastify.patch(
      '/:id',
      {
        schema: {
          tags: ['habits'],
          summary: 'Изменить привычку',
          params: IdParamsSchema,
          body: UpdateHabitBodySchema,
          response: { 200: HabitResponseSchema },
        },
      },
      async (request) =>
        habitsService.updateHabit(request.params.id, request.body),
    );

    fastify.delete(
      '/:id',
      {
        schema: {
          tags: ['habits'],
          summary: 'Удалить привычку',
          params: IdParamsSchema,
          response: { 204: Type.Null({ description: 'Удалено' }) },
        },
      },
      async (request, reply) => {
        await habitsService.deleteHabit(request.params.id);
        void reply.code(204).send(null);
      },
    );
  };
