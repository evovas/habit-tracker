export interface ErrorCodeRegistry {
  NOT_FOUND: true;
  VALIDATION_ERROR: true;
  CONFLICT: true;
  UNPROCESSABLE: true;
  BAD_REQUEST: true;
  ROUTE_NOT_FOUND: true;
  INTERNAL_ERROR: true;
}

export type ErrorCode = keyof ErrorCodeRegistry;

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: ErrorCode,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code: ErrorCode = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Request Validation Error', code: ErrorCode = 'VALIDATION_ERROR') {
    super(message, 400, code);
  }
}

export class UnprocessableError extends AppError {
  constructor(message = 'Unprocessable Content Error', code: ErrorCode = 'UNPROCESSABLE') {
    super(message, 422, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', code: ErrorCode = 'CONFLICT') {
    super(message, 409, code);
  }
}
