import { apiSuccess, apiError } from '@/lib/api-response';
import { describe, it, expect } from 'vitest';

describe('api-response helpers', () => {
  describe('apiSuccess', () => {
    it('returns correct success response shape', async () => {
      const testData = { id: 1, name: 'Test' };
      const response = apiSuccess(testData);

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(testData);
      expect(body.error).toBeUndefined();
    });

    it('respects custom status code', async () => {
      const response = apiSuccess({ message: 'Created' }, 201);
      expect(response.status).toBe(201);

      const body = await response.json();
      expect(body.success).toBe(true);
    });

    it('handles arrays as data', async () => {
      const testArray = [{ id: 1 }, { id: 2 }];
      const response = apiSuccess(testArray);

      const body = await response.json();
      expect(body.data).toEqual(testArray);
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('handles null/undefined data', async () => {
      const response = apiSuccess(null);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeNull();
    });
  });

  describe('apiError', () => {
    it('returns correct error response shape', async () => {
      const response = apiError('Something went wrong');

      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.message).toBe('Something went wrong');
      expect(body.error.code).toBe('ERR_400');
      expect(body.data).toBeUndefined();
    });

    it('respects custom status code', async () => {
      const response = apiError('Not found', 404);
      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body.error.code).toBe('ERR_404');
    });

    it('uses provided error code', async () => {
      const response = apiError('Access denied', 403, 'FORBIDDEN');

      const body = await response.json();
      expect(body.error.code).toBe('FORBIDDEN');
    });

    it('generates error code from status when not provided', async () => {
      const response = apiError('Server error', 500);

      const body = await response.json();
      expect(body.error.code).toBe('ERR_500');
    });

    it('handles custom status codes', async () => {
      const testCases = [
        { status: 401, expectedCode: 'ERR_401' },
        { status: 422, expectedCode: 'ERR_422' },
        { status: 503, expectedCode: 'ERR_503' },
      ];

      for (const testCase of testCases) {
        const response = apiError('Error', testCase.status);
        const body = await response.json();
        expect(body.error.code).toBe(testCase.expectedCode);
      }
    });
  });
});
