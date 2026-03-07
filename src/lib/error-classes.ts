/**
 * Domain-Specific Error Classes for PSP Platform
 * Provides structured error handling with type-safe categorization
 * All errors extend AppError base class with additional context
 */

/**
 * Base error class for all application errors
 * Provides structured error information for logging and tracking
 */
export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly context: Record<string, unknown>;
  readonly isOperational: boolean;
  readonly timestamp: string;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    context: Record<string, unknown> = {},
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Validation error for input validation failures
 * Includes field name, value, and constraint information
 */
export class ValidationError extends AppError {
  readonly field: string;
  readonly value: unknown;
  readonly constraint: string;

  constructor(
    message: string,
    field: string,
    value: unknown,
    constraint: string,
    context: Record<string, unknown> = {}
  ) {
    super(
      message,
      'VALIDATION_ERROR',
      400,
      {
        field,
        value,
        constraint,
        ...context,
      },
      true
    );
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.constraint = constraint;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value,
      constraint: this.constraint,
    };
  }
}

/**
 * Database error for query and operation failures
 * Includes query and table information for debugging
 */
export class DatabaseError extends AppError {
  readonly query?: string;
  readonly table?: string;

  constructor(
    message: string,
    query?: string,
    table?: string,
    context: Record<string, unknown> = {}
  ) {
    super(
      message,
      'DATABASE_ERROR',
      500,
      {
        query,
        table,
        ...context,
      },
      false
    );
    this.name = 'DatabaseError';
    this.query = query;
    this.table = table;

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      query: this.query,
      table: this.table,
    };
  }
}

/**
 * Authentication error for auth failures
 * Includes reason for the failure
 */
export class AuthenticationError extends AppError {
  readonly reason: string;

  constructor(
    message: string,
    reason: string = 'Unknown',
    context: Record<string, unknown> = {}
  ) {
    super(
      message,
      'AUTHENTICATION_ERROR',
      401,
      {
        reason,
        ...context,
      },
      true
    );
    this.name = 'AuthenticationError';
    this.reason = reason;

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      reason: this.reason,
    };
  }
}

/**
 * Rate limit error when requests exceed limits
 * Includes retry-after and limit information
 */
export class RateLimitError extends AppError {
  readonly retryAfter: number;
  readonly limit: number;

  constructor(
    message: string,
    retryAfter: number,
    limit: number,
    context: Record<string, unknown> = {}
  ) {
    super(
      message,
      'RATE_LIMIT_ERROR',
      429,
      {
        retryAfter,
        limit,
        ...context,
      },
      true
    );
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    this.limit = limit;

    Object.setPrototypeOf(this, RateLimitError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter,
      limit: this.limit,
    };
  }
}

/**
 * Network error for fetch and HTTP failures
 * Includes URL, method, and status code
 */
export class NetworkError extends AppError {
  readonly url: string;
  readonly method: string;
  readonly responseStatus?: number;

  constructor(
    message: string,
    url: string,
    method: string = 'GET',
    responseStatus?: number,
    context: Record<string, unknown> = {}
  ) {
    super(
      message,
      'NETWORK_ERROR',
      responseStatus || 503,
      {
        url,
        method,
        responseStatus,
        ...context,
      },
      true
    );
    this.name = 'NetworkError';
    this.url = url;
    this.method = method;
    this.responseStatus = responseStatus;

    Object.setPrototypeOf(this, NetworkError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      url: this.url,
      method: this.method,
      responseStatus: this.responseStatus,
    };
  }
}

/**
 * Not found error when resource doesn't exist
 * Includes resource type and identifier
 */
export class NotFoundError extends AppError {
  readonly resource: string;
  readonly identifier: string;

  constructor(
    resource: string,
    identifier: string,
    context: Record<string, unknown> = {}
  ) {
    super(
      `${resource} not found: ${identifier}`,
      'NOT_FOUND_ERROR',
      404,
      {
        resource,
        identifier,
        ...context,
      },
      true
    );
    this.name = 'NotFoundError';
    this.resource = resource;
    this.identifier = identifier;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource,
      identifier: this.identifier,
    };
  }
}

/**
 * Authorization error for insufficient permissions
 */
export class AuthorizationError extends AppError {
  readonly requiredPermission: string;

  constructor(
    message: string,
    requiredPermission: string,
    context: Record<string, unknown> = {}
  ) {
    super(
      message,
      'AUTHORIZATION_ERROR',
      403,
      {
        requiredPermission,
        ...context,
      },
      true
    );
    this.name = 'AuthorizationError';
    this.requiredPermission = requiredPermission;

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      requiredPermission: this.requiredPermission,
    };
  }
}

/**
 * Type guard to check if an error is an AppError
 * Useful for error handling in try-catch blocks
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check for specific error types
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Categorize unknown errors into AppError types
 * Useful for converting caught errors into proper error classes
 */
export function categorizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof TypeError) {
    return new ValidationError(
      error.message,
      'unknown',
      undefined,
      'type_error',
      { originalStack: error.stack }
    );
  }

  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  return new AppError(message, 'UNKNOWN_ERROR', 500, {
    originalError: String(error),
    stack,
  });
}
