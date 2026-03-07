import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/anthropic', () => ({
  generateGameRecap: vi.fn(),
  generateArticleSummary: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(),
}));

vi.mock('@/lib/csrf', () => ({
  validateCsrfToken: vi.fn(),
  CSRF_COOKIE_NAME: 'csrf-cookie',
  CSRF_HEADER_NAME: 'x-csrf-token',
}));

import { POST as recapRoute } from '@/app/api/ai/recap/route';
import { POST as summaryRoute } from '@/app/api/ai/summary/route';

const createMockRequest = (options: any = {}) => {
  const headers = new Map();
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]: any) => {
      headers.set(key, value);
    });
  }

  const cookies = new Map();
  if (options.cookies) {
    Object.entries(options.cookies).forEach(([key, value]: any) => {
      cookies.set(key, { value });
    });
  }

  return {
    method: 'POST',
    headers: {
      get: (key: string) => headers.get(key),
    },
    cookies: {
      get: (key: string) => cookies.get(key),
    },
    json: vi.fn().mockResolvedValue(options.body || {}),
  } as any;
};

describe('AI Recap Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 403 when CSRF token is missing', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    (validateCsrfToken as any).mockReturnValue(false);

    const request = createMockRequest({
      headers: { 'x-csrf-token': '' },
      cookies: { 'csrf-cookie': 'cookie-value' },
    });

    const response = await recapRoute(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error.message).toContain('Invalid CSRF token');
  });

  it('returns 403 when CSRF cookie is missing', async () => {
    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token-value' },
    });

    const response = await recapRoute(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error.message).toContain('Invalid CSRF token');
  });

  it('returns 429 when rate limit exceeded', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: false });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token', 'x-forwarded-for': '127.0.0.1' },
      cookies: { 'csrf-cookie': 'cookie' },
    });

    const response = await recapRoute(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error.message).toBe('Too many requests');
  });

  it('returns 401 when user not authenticated', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');
    const { createClient } = await import('@/lib/supabase/server');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { gameIds: ['1'] },
    });

    const response = await recapRoute(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error.message).toBe('Unauthorized');
  });

  it('returns 400 when validation fails', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');
    const { createClient } = await import('@/lib/supabase/server');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user123' } } }),
      },
    });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { gameIds: 'not-an-array' },
    });

    const response = await recapRoute(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toContain('Invalid request');
  });

  it('returns 404 when no games found', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');
    const { createClient } = await import('@/lib/supabase/server');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockReturnValue({ success: true });
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user123' } } }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      })),
    });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { gameIds: ['999'] },
    });

    const response = await recapRoute(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error.message).toBe('No games found');
  });

  it('applies rate limiting per IP', async () => {
    const { rateLimit } = await import('@/lib/rate-limit');
    const { validateCsrfToken } = await import('@/lib/csrf');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: false });

    const request = createMockRequest({
      headers: {
        'x-csrf-token': 'token',
        'x-forwarded-for': '192.168.1.1',
        'user-agent': 'Test Agent',
        'accept-language': 'en-US'
      },
      cookies: { 'csrf-cookie': 'cookie' },
    });

    await recapRoute(request);

    expect(rateLimit).toHaveBeenCalledWith(
      '192.168.1.1',
      5,
      60000,
      '/api/ai/recap',
      'Test Agent',
      'en-US'
    );
  });

  it('includes Retry-After header on rate limit', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockReturnValue({ success: false });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
    });

    const response = await recapRoute(request);

    expect(response.headers.get('Retry-After')).toBe('60');
  });
});

describe('AI Summary Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 403 when CSRF token is missing', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    (validateCsrfToken as any).mockReturnValue(false);

    const request = createMockRequest({
      headers: { 'x-csrf-token': '' },
      cookies: { 'csrf-cookie': 'cookie-value' },
    });

    const response = await summaryRoute(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error.message).toContain('Invalid CSRF token');
  });

  it('returns 429 when rate limit exceeded', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: false });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
    });

    const response = await summaryRoute(request);
    const data = await response.json();

    expect(response.status).toBe(429);
  });

  it('returns 401 when user not authenticated', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');
    const { createClient } = await import('@/lib/supabase/server');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { title: 'Test', body: 'Test body' },
    });

    const response = await summaryRoute(request);
    const data = await response.json();

    expect(response.status).toBe(401);
  });

  it('returns 400 when validation fails', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');
    const { createClient } = await import('@/lib/supabase/server');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user123' } } }),
      },
    });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { title: '' },
    });

    const response = await summaryRoute(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toContain('Invalid request');
  });
});
