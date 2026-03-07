import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/lib/email', () => ({
  sendConfirmationEmail: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(),
}));

vi.mock('@/lib/csrf', () => ({
  validateCsrfToken: vi.fn(),
  CSRF_COOKIE_NAME: 'csrf-cookie',
  CSRF_HEADER_NAME: 'x-csrf-token',
}));

import { POST } from '@/app/api/email/send-confirmation/route';

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

describe('Email Send Confirmation Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.RESEND_API_KEY;
  });

  it('returns 403 when CSRF token is missing', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    (validateCsrfToken as any).mockReturnValue(false);

    const request = createMockRequest({
      headers: { 'x-csrf-token': '' },
      cookies: { 'csrf-cookie': 'cookie-value' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error.message).toContain('Invalid CSRF token');
  });

  it('returns 403 when CSRF cookie is missing', async () => {
    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token-value' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
  });

  it('returns 429 when rate limit exceeded', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: false });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token', 'x-forwarded-for': '127.0.0.1' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error.message).toBe('Too many requests');
  });

  it('returns 400 when email is invalid', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'not-an-email', token: 'token-123' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toContain('Invalid email or token format');
  });

  it('returns 400 when token is missing', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockReturnValue({ success: true });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: '' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('returns success when RESEND_API_KEY is not set (dev mode)', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.dev).toBe(true);
  });

  it('calls sendConfirmationEmail when RESEND_API_KEY is set', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');
    const { sendConfirmationEmail } = await import('@/lib/email');

    process.env.RESEND_API_KEY = 'test-key';

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });
    (sendConfirmationEmail as any).mockResolvedValue({ success: true });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(sendConfirmationEmail).toHaveBeenCalledWith('test@example.com', 'token-123');
  });

  it('returns 500 on sendConfirmationEmail error', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');
    const { sendConfirmationEmail } = await import('@/lib/email');

    process.env.RESEND_API_KEY = 'test-key';

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });
    (sendConfirmationEmail as any).mockRejectedValue(new Error('Email service down'));

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.message).toContain('Failed to send confirmation email');
  });

  it('applies rate limiting per IP', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: false });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token', 'x-forwarded-for': '192.168.1.1' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    await POST(request);

    expect(rateLimit).toHaveBeenCalled();
    const call = (rateLimit as any).mock.calls[0];
    expect(call[0]).toBe('192.168.1.1');
    expect(call[1]).toBe(5);
    expect(call[2]).toBe(60000);
  });

  it('includes Retry-After header on rate limit', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: false });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    const response = await POST(request);

    expect(response.headers.get('Retry-After')).toBe('60');
  });

  it('validates email format', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });

    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user @example.com',
      '',
    ];

    for (const email of invalidEmails) {
      const request = createMockRequest({
        headers: { 'x-csrf-token': 'token' },
        cookies: { 'csrf-cookie': 'cookie' },
        body: { email, token: 'token-123' },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    }
  });

  it('accepts valid email formats', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: true });

    const validEmails = [
      'user@example.com',
      'user+tag@example.com',
      'user.name@example.com',
    ];

    for (const email of validEmails) {
      const request = createMockRequest({
        headers: { 'x-csrf-token': 'token' },
        cookies: { 'csrf-cookie': 'cookie' },
        body: { email, token: 'token-123' },
      });

      const response = await POST(request);
      // Should pass validation (either 200 or 500 depending on email service)
      expect([200, 500]).toContain(response.status);
    }
  });

  it('uses x-real-ip header as fallback for IP', async () => {
    const { validateCsrfToken } = await import('@/lib/csrf');
    const { rateLimit } = await import('@/lib/rate-limit');

    (validateCsrfToken as any).mockReturnValue(true);
    (rateLimit as any).mockResolvedValue({ success: false });

    const request = createMockRequest({
      headers: { 'x-csrf-token': 'token', 'x-real-ip': '10.0.0.1' },
      cookies: { 'csrf-cookie': 'cookie' },
      body: { email: 'test@example.com', token: 'token-123' },
    });

    await POST(request);

    expect(rateLimit).toHaveBeenCalled();
    const call2 = (rateLimit as any).mock.calls[0];
    expect(call2[0]).toBe('10.0.0.1');
    expect(call2[1]).toBe(5);
    expect(call2[2]).toBe(60000);
  });
});
