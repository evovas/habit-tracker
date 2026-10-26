import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const swagger: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Habit Tracker API',
        description: 'REST API трекера привычек',
        version: '1.0.0',
      },
      tags: [
        { name: 'habits', description: 'Привычки' },
        { name: 'checkins', description: 'Отметки выполнения и статистика' },
        { name: 'system', description: 'Служебные эндпоинты' },
      ],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
};

export const swaggerPlugin = fp(swagger, { name: 'swagger' });
