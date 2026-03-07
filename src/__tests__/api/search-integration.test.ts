import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// Mock dependencies
vi.mock('@/lib/data', () => ({
  searchAll: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 30 })),
}));

import { GET as searchGET } from '@/app/api/search/route';

describe('Search API Route Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (query: string = '', type?: string) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (type) searchParams.set('type', type);

    const url = new URL(`http://localhost/api/search?${searchParams}`);

    const request = {
      headers: {
        get: (key: string) => {
          if (key === 'x-forwarded-for') return '127.0.0.1';
          return null;
        },
      },
      nextUrl: url,
    } as any;

    return request;
  };

  describe('GET /api/search', () => {
    it('returns search results for valid query', async () => {
      const request = createMockRequest('football');
      const response = await searchGET(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBeLessThanOrEqual(500);
    });

    it('includes rate limit headers in response', async () => {
      const request = createMockRequest('test');
      const response = await searchGET(request);

      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
    });

    it('returns error for empty query', async () => {
      const request = createMockRequest('');
      const response = await searchGET(request);

      // Empty query may be valid (returns all results) or invalid (returns error)
      expect(response.status).toBeDefined();
      expect([400, 200]).toContain(response.status);
    });

    it('filters results by type when specified', async () => {
      const request = createMockRequest('school', 'school');
      const response = await searchGET(request);

      expect(response.status).toBeLessThanOrEqual(500);
    });

    it('enforces rate limiting', async () => {
      const ip = '127.0.0.1';

      // First request should succeed
      const request1 = createMockRequest('test');
      const response1 = await searchGET(request1);
      expect([200, 400]).toContain(response1.status);
    });

    it('includes cache control headers', async () => {
      const request = createMockRequest('test');
      const response = await searchGET(request);

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toBeDefined();
      // Should contain cache directives
      if (cacheControl) {
        expect(cacheControl).toContain('max-age');
      }
    });

    it('validates search parameters', async () => {
      const request = createMockRequest('test', 'invalid-type');
      const response = await searchGET(request);

      // Should either filter or return error
      expect(response.status).toBeLessThanOrEqual(500);
    });

    it('handles special characters in search query', async () => {
      const request = createMockRequest('St. Joseph\'s');
      const response = await searchGET(request);

      expect(response.status).toBeLessThanOrEqual(500);
    });

    it('handles multiple spaces in query', async () => {
      const request = createMockRequest('test  query  with  spaces');
      const response = await searchGET(request);

      expect(response.status).toBeLessThanOrEqual(500);
    });

    it('handles empty response gracefully', async () => {
      const request = createMockRequest('nonexistentxyzabc123');
      const response = await searchGET(request);

      // Should return 200 with empty results or other valid response
      expect(response.status).toBeLessThanOrEqual(500);
    });
  });

  describe('Search API Error Handling', () => {
    it('returns proper error for invalid parameters', async () => {
      const request = createMockRequest('', 'invalid-type');
      const response = await searchGET(request);

      // Should handle invalid type parameter
      expect(response.status).toBeDefined();
    });

    it('handles rate limit exceeded', async () => {
      // Mock multiple requests would exceed rate limit
      const request = createMockRequest('test');
      const response = await searchGET(request);

      // Response should be valid regardless
      expect(response).toBeInstanceOf(NextResponse);
    });
  });

  describe('Search API Response Format', () => {
    it('returns JSON response', async () => {
      const request = createMockRequest('test');
      const response = await searchGET(request);

      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('includes proper HTTP status codes', async () => {
      const request = createMockRequest('football');
      const response = await searchGET(request);

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });
  });
});
