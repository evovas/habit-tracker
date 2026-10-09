import type { FastifyPluginAsync } from 'fastify';
import { Type } from 'typebox';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['system'],
        summary: 'Проверить работу сервера',
        response: {
          200: Type.Object({
            status: Type.Literal('ok'),
          }),
        },
      },
    },
    () => (
      { status: 'ok' }
    ));
};
