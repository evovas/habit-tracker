import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { DateRangeQuerySchema } from '../../shared/schemas.ts';
import {
  CheckinListResponseSchema,
  CheckinParamsSchema,
  CheckinSingleEntrySchema,
  CheckinStatisticsSchema,
  CreateCheckinBodySchema,
  HabitIdParamsSchema,
  TodayQuerySchema,
} from './checkins.schemas.ts';
import type { CheckinsService } from './checkins.service.ts';

interface CheckinsRoutesOptions {
  checkinsService: CheckinsService;
}

export const habitCheckinsRoutes:
FastifyPluginAsyncTypebox<CheckinsRoutesOptions>
  = async (
    fastify,
    { checkinsService },
  ) => {
    fastify.post(
      '/',
      {
        schema: {
          body: CreateCheckinBodySchema,
          params: HabitIdParamsSchema,
          response: {
            201: CheckinSingleEntrySchema,
          },
        },
      },
      async (request, reply) => {
        const checkinEntry = await checkinsService.createCheckin(
          request.params.habitId,
          request.body.date,
        );
        void reply.code(201).send(checkinEntry);
      },
    );

    fastify.delete(
      '/:date',
      {
        schema: {
          params: CheckinParamsSchema,
        },
      },
      async (request, reply) => {
        await checkinsService.deleteCheckin(
          request.params.habitId,
          request.params.date,
        );
        void reply.code(204).send();
      },
    );
  };

export const checkinsRoutes:
FastifyPluginAsyncTypebox<CheckinsRoutesOptions>
  = async (
    fastify,
    { checkinsService },
  ) => {
    fastify.get(
      '/',
      {
        schema: {
          querystring: DateRangeQuerySchema,
          response: {
            200: CheckinListResponseSchema,
          },
        },
      },
      async (request) =>
        checkinsService.getCheckinsByDateRange({
          from: request.query.from,
          to: request.query.to,
        }),
    );

    fastify.get(
      '/statistics',
      {
        schema: {
          querystring: TodayQuerySchema,
          response: {
            200: CheckinStatisticsSchema,
          },
        },
      },
      async (request) =>
        checkinsService.getStatistics(request.query.today),
    );
  };
