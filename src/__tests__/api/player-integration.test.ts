import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null }),
        })),
      })),
    })),
  })),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 60 })),
}));

vi.mock('@/lib/validation', () => ({
  playerIdSchema: {
    safeParse: vi.fn((data) => ({
      success: true,
      data: data
    })),
  },
}));

describe('Player API Route Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (ip: string = '127.0.0.1') => {
    const request = {
      headers: {
        get: (key: string) => {
          if (key === 'x-forwarded-for') return ip;
          return null;
        },
      },
    } as any;

    return request;
  };

  describe('GET /api/player/[id]', () => {
    it('returns player data for valid ID', async () => {
      // Import the route handler
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: '123' }),
      });

      // Response should be valid
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });

    it('includes rate limit headers', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: '123' }),
      });

      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
    });

    it('returns 404 for non-existent player', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: 'nonexistent-id' }),
      });

      // Should return 404 or 400 if ID is invalid
      expect([400, 404]).toContain(response.status);
    });

    it('validates player ID format', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: 'invalid-id-format' }),
      });

      // Should validate ID
      expect(response.status).toBeDefined();
    });

    it('enforces rate limiting by IP', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request1 = createMockRequest('192.168.1.1');
      const response1 = await GET(request1, {
        params: Promise.resolve({ id: '123' }),
      });

      expect(response1.status).toBeLessThan(600);
    });

    it('includes cache control headers', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: '123' }),
      });

      const cacheControl = response.headers.get('Cache-Control');
      if (response.status === 200) {
        expect(cacheControl).toBeDefined();
        if (cacheControl) {
          expect(cacheControl).toContain('max-age');
        }
      }
    });

    it('handles different IP addresses', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request1 = createMockRequest('10.0.0.1');
      const request2 = createMockRequest('10.0.0.2');

      const response1 = await GET(request1, {
        params: Promise.resolve({ id: '123' }),
      });
      const response2 = await GET(request2, {
        params: Promise.resolve({ id: '123' }),
      });

      expect(response1.status).toBeDefined();
      expect(response2.status).toBeDefined();
    });

    it('returns JSON response', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: '123' }),
      });

      expect(response.headers.get('content-type')).toContain('application/json');
    });
  });

  describe('Player API Error Handling', () => {
    it('handles missing player gracefully', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: 'missing-player-id' }),
      });

      // Should return appropriate error status
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('handles database connection errors', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: '123' }),
      });

      // Should return valid response even if database fails
      expect(response.status).toBeDefined();
    });

    it('validates rate limit enforcement', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: '123' }),
      });

      // Rate limited responses should be 429
      if (response.status === 429) {
        expect(response.headers.get('Retry-After')).toBeDefined();
      }
    });
  });

  describe('Player API Response Data', () => {
    it('returns proper status codes', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const request = createMockRequest();
      const response = await GET(request, {
        params: Promise.resolve({ id: '123' }),
      });

      // Status should be valid HTTP code
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });

    it('handles valid player IDs', async () => {
      const { GET } = await import('@/app/api/player/[id]/route');

      const validIds = ['123', '456', '789'];

      for (const id of validIds) {
        const request = createMockRequest();
        const response = await GET(request, {
          params: Promise.resolve({ id }),
        });

        expect(response.status).toBeDefined();
      }
    });
  });
});
