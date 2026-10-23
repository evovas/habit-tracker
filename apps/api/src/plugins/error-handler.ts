import type { FastifyError, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { AppError, type ErrorCode } from '../shared/errors.ts';

interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: { path: string; message: string }[];
}

const errorHandler: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler<FastifyError>((error, request, reply) => {
    // Validation Errors
    if (error.validation) {
      request.log.info({ err: error }, 'Request validation failed');

      const body: ErrorResponse = {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.validation.map((issue) => ({
          path: `${error.validationContext}${issue.instancePath}`,
          message: issue.message ?? 'Invalid value',
        })),
      };
      return reply.code(400).send(body);
    }

    // Expected application errors
    if (error instanceof AppError) {
      request.log.info({ err: error }, 'Application error');

      const body: ErrorResponse = {
        code: error.code,
        message: error.message,
      };
      return reply.code(error.statusCode).send(body);
    }

    // Other Fastify client errors
    const statusCode = error.statusCode ?? 500;
    if (statusCode < 500) {
      request.log.info({ err: error }, 'Client error');

      const body: ErrorResponse = {
        code: 'BAD_REQUEST',
        message: error.message,
      };
      return reply.code(statusCode).send(body);
    }

    // Unexpected error (bugs)
    request.log.error({ err: error }, 'Unhandled error');

    const unhandledErrorBody: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error',
    };
    return reply.code(500).send(unhandledErrorBody);
  });

  fastify.setNotFoundHandler((request, reply) => {
    const body: ErrorResponse = {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${request.method} ${request.url} not found`,
    };
    return reply.code(404).send(body);
  });
};

export const errorHandlerPlugin = fp(errorHandler, { name: 'error-handler' });
