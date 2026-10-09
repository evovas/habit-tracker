import { fastifyCors } from '@fastify/cors';
import Fastify from 'fastify';

import type { Config } from './config/env.ts';
import { createDb } from './db/client.ts';
import { InMemoryCheckinsRepository } from './modules/checkins/checkins.repository.ts';
import { checkinsRoutes, habitCheckinsRoutes } from './modules/checkins/checkins.routes.ts';
import { CheckinsService } from './modules/checkins/checkins.service.ts';
import { InMemoryHabitsRepository } from './modules/habits/habits.repository.ts';
import { habitsRoutes } from './modules/habits/habits.routes.ts';
import { HabitsService } from './modules/habits/habits.service.ts';
import { healthRoutes } from './modules/health/health.routes.ts';
import { errorHandlerPlugin } from './plugins/error-handler.ts';
import { swaggerPlugin } from './plugins/swagger.ts';

const loggerConfigByEnv = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
} as const;

export const buildApp = (config: Config) => {
  const fastify = Fastify({
    logger: loggerConfigByEnv[config.NODE_ENV],
  });
  fastify.register(errorHandlerPlugin);

  fastify.register(fastifyCors, {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  const { pool } = createDb(config.DATABASE_URL);
  pool.on('error', (err) => {
    fastify.log.error({ err }, 'Unexpected PostgreSQL pool error');
  });
  fastify.addHook('onReady', async () => {
    await pool.query('SELECT 1');
    fastify.log.info('Connected to PostgreSQL');
  });
  fastify.addHook('onClose', async () => {
    await pool.end();
    fastify.log.info('Server closed');
  });

  fastify.register(swaggerPlugin);

  const habitsRepository = new InMemoryHabitsRepository();
  const checkinsRepository = new InMemoryCheckinsRepository();
  const habitsService = new HabitsService(habitsRepository, checkinsRepository);
  const checkinsService
    = new CheckinsService(checkinsRepository, habitsRepository);
  fastify.register(healthRoutes);
  fastify.register(habitsRoutes, { prefix: '/habits', habitsService });
  fastify.register(habitCheckinsRoutes, { prefix: '/habits/:habitId/checkins', checkinsService });
  fastify.register(checkinsRoutes, { prefix: '/checkins', checkinsService });

  return fastify;
};
