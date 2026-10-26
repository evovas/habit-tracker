import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import type { ZodError } from 'zod';
import { z } from 'zod';

const zDetail = z.object({
  message: z.string(),
  path: z.string(),
});

const zApiError = z.object({
  message: z.string(),
  code: z.string(),
  details: z.optional(z.array(zDetail)),
});

export type ApiErrorDetail = z.infer<typeof zDetail>;

export class AppError extends Error {
  constructor(
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'AppError';
  }
}

export class ApiError extends AppError {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly serverMessage: string,
    public readonly cause: AxiosError,
    public readonly details: z.infer<typeof zDetail>[] | undefined,
  ) {
    super(serverMessage, { cause });
    this.name = 'ApiError';
  }
}

export class ResponseValidationError extends AppError {
  constructor(
    public readonly cause: ZodError,
  ) {
    super('Response validation failed', { cause });
    this.name = 'ResponseValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(
    public readonly cause: AxiosError,
  ) {
    super('Network request failed', { cause });
    this.name = 'NetworkError';
  }
}

export class UnexpectedError extends AppError {
  constructor(
    public readonly cause: unknown,
  ) {
    super('Unexpected error occurred', { cause });
    this.name = 'UnexpectedError';
  }
}

const defaultErrorMessages = {
  NOT_FOUND: 'We couldn’t find what you were looking for. It may have been deleted.',
  VALIDATION_ERROR: 'Some of the entered data is invalid. Please check the fields and try again.',
  CONFLICT: 'This change conflicts with the current data. Refresh the page and try again.',
  UNPROCESSABLE: 'This action can’t be completed right now. Please check your input and try again.',
  BAD_REQUEST: 'Something went wrong with the request. Please try again.',
  ROUTE_NOT_FOUND: 'Something went wrong on our side. Please try again later.',
  RESPONSE_VALIDATION_ERROR: 'Something went wrong on our side. Please try again later.',
  INTERNAL_ERROR: 'Something went wrong on our side. Please try again later.',
  NETWORK: 'Can’t reach the server. Check your internet connection and try again.',
  UNKNOWN: 'Something went wrong. Please try again.',
};

const messageByCode: Partial<Record<string, string>> = defaultErrorMessages;

export const getUserErrorMessage = (
  vocabulary: Partial<Record<string, string>>,
  error: AppError,
): string => {
  if (error instanceof ApiError) {
    const code = error.code;
    return vocabulary[code]
      ?? messageByCode[code]
      ?? defaultErrorMessages.UNKNOWN;
  }
  if (error instanceof ResponseValidationError) {
    return defaultErrorMessages.RESPONSE_VALIDATION_ERROR;
  }
  if (error instanceof NetworkError) {
    return defaultErrorMessages.NETWORK;
  }
  if (error instanceof UnexpectedError) {
    return defaultErrorMessages.UNKNOWN;
  }
  return defaultErrorMessages.UNKNOWN;
};

export const parseError = (
  error: unknown,
): AppError => {
  if (isAxiosError(error)) {
    if (!error.response) {
      return new NetworkError(error);
    }
    const body = zApiError.safeParse(error.response.data);
    if (body.success) {
      return new ApiError(
        error.response.status,
        body.data.code,
        body.data.message,
        error,
        body.data.details,
      );
    }
  }

  return new UnexpectedError(error);
};
