import Fastify from 'fastify';

import { InMemoryHabitsRepository } from './modules/habits/habits.repository.ts';
import { habitsRoutes } from './modules/habits/habits.routes.ts';
import { HabitsService } from './modules/habits/habits.service.ts';
import { healthRoutes } from './modules/health/health.routes.ts';
import { errorHandlerPlugin } from './plugins/error-handler.ts';

const devLoggerConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  },
};

const isProduction = process.env.NODE_ENV === 'production';

export const buildApp = () => {
  const fastify = Fastify({
    logger: isProduction ? true : devLoggerConfig,
  });
  fastify.register(errorHandlerPlugin);
  fastify.register(healthRoutes);

  const habitsRepository = new InMemoryHabitsRepository();
  const habitsService = new HabitsService(habitsRepository);
  fastify.register(habitsRoutes, { prefix: '/habits', habitsService });
  fastify.addHook('onClose', async () => {
    fastify.log.info('Server closed');
  });
  return fastify;
};
