import Fastify from 'fastify';

import { InMemoryCheckinsRepository } from './modules/checkins/checkins.repository.ts';
import { checkinsRoutes, habitCheckinsRoutes } from './modules/checkins/checkins.routes.ts';
import { CheckinsService } from './modules/checkins/checkins.service.ts';
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
  const checkinsRepository = new InMemoryCheckinsRepository();
  const habitsService = new HabitsService(habitsRepository, checkinsRepository);
  const checkinsService
    = new CheckinsService(checkinsRepository, habitsRepository);
  fastify.register(habitsRoutes, { prefix: '/habits', habitsService });
  fastify.register(habitCheckinsRoutes, { prefix: '/habits/:habitId/checkins', checkinsService });
  fastify.register(checkinsRoutes, { prefix: '/checkins', checkinsService });
  fastify.addHook('onClose', async () => {
    fastify.log.info('Server closed');
  });
  return fastify;
};
