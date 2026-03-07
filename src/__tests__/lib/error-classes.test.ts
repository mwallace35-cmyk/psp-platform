import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  DatabaseError,
  AuthenticationError,
  RateLimitError,
  NetworkError,
  NotFoundError,
  AuthorizationError,
  isAppError,
  isValidationError,
  isDatabaseError,
  isAuthenticationError,
  isAuthorizationError,
  isRateLimitError,
  isNetworkError,
  isNotFoundError,
  categorizeError,
} from '@/lib/error-classes';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an app error with required properties', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 400, { field: 'test' });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.context.field).toBe('test');
      expect(error.isOperational).toBe(true);
      expect(error.timestamp).toBeDefined();
    });

    it('should have toJSON method', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 400, { field: 'test' });
      const json = error.toJSON();

      expect(json.message).toBe('Test error');
      expect(json.code).toBe('TEST_ERROR');
      expect(json.statusCode).toBe(400);
      expect(json.context.field).toBe('test');
    });

    it('should maintain prototype chain', () => {
      const error = new AppError('Test', 'TEST', 400);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with field info', () => {
      const error = new ValidationError(
        'Invalid email',
        'email',
        'invalid@',
        'email_format',
        { suggestion: 'Check email format' }
      );

      expect(error.message).toBe('Invalid email');
      expect(error.field).toBe('email');
      expect(error.value).toBe('invalid@');
      expect(error.constraint).toBe('email_format');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
    });

    it('should be an instance of AppError', () => {
      const error = new ValidationError('Test', 'field', '', 'constraint');
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ValidationError).toBe(true);
    });
  });

  describe('DatabaseError', () => {
    it('should create database error with query info', () => {
      const error = new DatabaseError(
        'Query failed',
        'SELECT * FROM users WHERE id = 1',
        'users',
        { transactionId: '123' }
      );

      expect(error.message).toBe('Query failed');
      expect(error.query).toBe('SELECT * FROM users WHERE id = 1');
      expect(error.table).toBe('users');
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error with reason', () => {
      const error = new AuthenticationError(
        'Invalid credentials',
        'wrong_password',
        { userId: 'user123' }
      );

      expect(error.message).toBe('Invalid credentials');
      expect(error.reason).toBe('wrong_password');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with retry info', () => {
      const error = new RateLimitError(
        'Too many requests',
        60000,
        100,
        { endpoint: '/api/users' }
      );

      expect(error.message).toBe('Too many requests');
      expect(error.retryAfter).toBe(60000);
      expect(error.limit).toBe(100);
      expect(error.code).toBe('RATE_LIMIT_ERROR');
      expect(error.statusCode).toBe(429);
    });
  });

  describe('NetworkError', () => {
    it('should create network error with request info', () => {
      const error = new NetworkError(
        'Connection failed',
        'https://api.example.com/users',
        'POST',
        503,
        { timeout: 5000 }
      );

      expect(error.message).toBe('Connection failed');
      expect(error.url).toBe('https://api.example.com/users');
      expect(error.method).toBe('POST');
      expect(error.responseStatus).toBe(503);
      expect(error.code).toBe('NETWORK_ERROR');
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with resource info', () => {
      const error = new NotFoundError(
        'User',
        '12345',
        { source: 'api' }
      );

      expect(error.message).toContain('User not found');
      expect(error.message).toContain('12345');
      expect(error.resource).toBe('User');
      expect(error.identifier).toBe('12345');
      expect(error.code).toBe('NOT_FOUND_ERROR');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('AuthorizationError', () => {
    it('should create authorization error with permission info', () => {
      const error = new AuthorizationError(
        'Insufficient permissions',
        'admin:read',
        { userId: 'user123' }
      );

      expect(error.message).toBe('Insufficient permissions');
      expect(error.requiredPermission).toBe('admin:read');
      expect(error.code).toBe('AUTHORIZATION_ERROR');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('Type Guards', () => {
    it('isAppError should work for all error types', () => {
      const appError = new AppError('test', 'TEST', 400);
      const validationError = new ValidationError('test', 'field', '', 'constraint');
      const databaseError = new DatabaseError('test');
      const regularError = new Error('test');

      expect(isAppError(appError)).toBe(true);
      expect(isAppError(validationError)).toBe(true);
      expect(isAppError(databaseError)).toBe(true);
      expect(isAppError(regularError)).toBe(false);
    });

    it('isValidationError should only match ValidationError', () => {
      const error = new ValidationError('test', 'field', '', 'constraint');
      expect(isValidationError(error)).toBe(true);
      expect(isValidationError(new AppError('test', 'TEST', 400))).toBe(false);
    });

    it('isDatabaseError should only match DatabaseError', () => {
      const error = new DatabaseError('test');
      expect(isDatabaseError(error)).toBe(true);
      expect(isDatabaseError(new AppError('test', 'TEST', 500))).toBe(false);
    });

    it('isAuthenticationError should only match AuthenticationError', () => {
      const error = new AuthenticationError('test', 'reason');
      expect(isAuthenticationError(error)).toBe(true);
      expect(isAuthenticationError(new AppError('test', 'TEST', 401))).toBe(false);
    });

    it('isAuthorizationError should only match AuthorizationError', () => {
      const error = new AuthorizationError('test', 'permission');
      expect(isAuthorizationError(error)).toBe(true);
      expect(isAuthorizationError(new AppError('test', 'TEST', 403))).toBe(false);
    });

    it('isRateLimitError should only match RateLimitError', () => {
      const error = new RateLimitError('test', 60000, 100);
      expect(isRateLimitError(error)).toBe(true);
      expect(isRateLimitError(new AppError('test', 'TEST', 429))).toBe(false);
    });

    it('isNetworkError should only match NetworkError', () => {
      const error = new NetworkError('test', 'https://api.com');
      expect(isNetworkError(error)).toBe(true);
      expect(isNetworkError(new AppError('test', 'TEST', 503))).toBe(false);
    });

    it('isNotFoundError should only match NotFoundError', () => {
      const error = new NotFoundError('User', '123');
      expect(isNotFoundError(error)).toBe(true);
      expect(isNotFoundError(new AppError('test', 'TEST', 404))).toBe(false);
    });
  });

  describe('categorizeError', () => {
    it('should return AppError if already an AppError', () => {
      const appError = new AppError('test', 'TEST', 400);
      const result = categorizeError(appError);
      expect(result).toBe(appError);
    });

    it('should convert TypeError to ValidationError', () => {
      const typeError = new TypeError('Cannot read property');
      const result = categorizeError(typeError);

      expect(result instanceof ValidationError).toBe(true);
      expect(result.code).toBe('VALIDATION_ERROR');
    });

    it('should convert regular Error to AppError', () => {
      const error = new Error('Something went wrong');
      const result = categorizeError(error);

      expect(result instanceof AppError).toBe(true);
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('Something went wrong');
    });

    it('should handle non-Error values', () => {
      const result = categorizeError('Some error string');

      expect(result instanceof AppError).toBe(true);
      expect(result.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('toJSON Serialization', () => {
    it('should serialize all error types properly', () => {
      const errors = [
        new AppError('app error', 'TEST', 400),
        new ValidationError('validation', 'field', 'value', 'constraint'),
        new DatabaseError('db error', 'SELECT *', 'users'),
        new AuthenticationError('auth error', 'reason'),
        new RateLimitError('rate limit', 60000, 100),
        new NetworkError('network', 'https://api.com', 'GET', 500),
        new NotFoundError('Resource', '123'),
        new AuthorizationError('authz error', 'permission'),
      ];

      for (const error of errors) {
        const json = error.toJSON();
        expect(json.message).toBeDefined();
        expect(json.code).toBeDefined();
        expect(json.statusCode).toBeDefined();
        expect(json.timestamp).toBeDefined();
      }
    });
  });
});
