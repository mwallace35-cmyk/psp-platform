import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { rateLimitLogin, getClientIp, getRateLimitHeaders } from '@/lib/rate-limit';
import { apiSuccess, apiError } from '@/lib/api-response';
import { captureError } from '@/lib/error-tracking';

/**
 * POST /api/auth/login
 *
 * Login endpoint with server-side rate limiting.
 * Protects against brute force attacks by limiting login attempts per IP.
 *
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password"
 * }
 *
 * Response (success):
 * {
 *   "success": true,
 *   "message": "Login successful"
 * }
 *
 * Response (rate limited):
 * {
 *   "success": false,
 *   "error": "Too many login attempts. Please try again later.",
 *   "code": "RATE_LIMIT_EXCEEDED"
 * }
 *
 * Response (invalid credentials):
 * {
 *   "success": false,
 *   "error": "Invalid login credentials",
 *   "code": "INVALID_CREDENTIALS"
 * }
 */
export async function POST(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get('x-request-id') || randomUUID();

  try {
    // Extract client IP
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent');
    const acceptLanguage = request.headers.get('accept-language');

    // Check rate limit for login attempts: 5 per IP per 15 minutes
    const rateLimitResult = await rateLimitLogin(ip, userAgent, acceptLanguage);

    if (!rateLimitResult.success) {
      const response = apiError(
        'Too many login attempts. Please try again later.',
        429,
        'RATE_LIMIT_EXCEEDED'
      );

      // Add rate limit headers
      const headers = getRateLimitHeaders(0, 5, rateLimitResult.resetAt || Date.now() + 15 * 60 * 1000);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set('Retry-After', String(Math.ceil((rateLimitResult.resetAt || 0) / 1000)));
      response.headers.set('x-request-id', requestId);
      return response;
    }

    // Parse request body
    let body: { email?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      const response = apiError('Invalid request body', 400, 'INVALID_REQUEST');
      response.headers.set('x-request-id', requestId);
      return response;
    }

    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      const response = apiError('Email and password are required', 400, 'MISSING_FIELDS');
      response.headers.set('x-request-id', requestId);
      return response;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response = apiError('Invalid email format', 400, 'INVALID_EMAIL');
      response.headers.set('x-request-id', requestId);
      return response;
    }

    // Attempt login via Supabase
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log auth error for debugging (don't expose internal details)
      captureError(
        new Error(`Login failed: ${error.message}`),
        { endpoint: '/api/auth/login', email },
        { requestId, path: '/api/auth/login', method: 'POST', endpoint: '/api/auth/login' }
      );

      const response = apiError('Invalid login credentials', 401, 'INVALID_CREDENTIALS');

      // Add rate limit headers even for failed attempts
      const headers = getRateLimitHeaders(
        rateLimitResult.remaining,
        5,
        rateLimitResult.resetAt || Date.now() + 15 * 60 * 1000
      );
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set('x-request-id', requestId);
      return response;
    }

    // Successful login
    const response = apiSuccess({ message: 'Login successful' });

    // Add rate limit headers
    const headers = getRateLimitHeaders(
      rateLimitResult.remaining,
      5,
      rateLimitResult.resetAt || Date.now() + 15 * 60 * 1000
    );
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    response.headers.set('x-request-id', requestId);
    return response;
  } catch (error) {
    captureError(
      error,
      { endpoint: '/api/auth/login' },
      { requestId, path: '/api/auth/login', method: 'POST', endpoint: '/api/auth/login' }
    );

    const response = apiError('An unexpected error occurred', 500, 'INTERNAL_ERROR');
    response.headers.set('x-request-id', requestId);
    return response;
  }
}
