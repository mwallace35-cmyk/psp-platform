import { randomUUID, timingSafeEqual } from 'crypto';
import type { NextResponse } from 'next/server';

export const CSRF_COOKIE_NAME = 'psp_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generates a random CSRF token using crypto.randomUUID()
 */
export function generateCsrfToken(): string {
  return randomUUID();
}

/**
 * Validates a CSRF token using double-submit cookie pattern
 * Token in request header must match token in cookie
 */
export function validateCsrfToken(
  token: string,
  sessionToken: string
): boolean {
  if (!token || !sessionToken) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(sessionToken);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Sets CSRF token as httpOnly cookie on response
 * Secure flag enforced in production
 */
export function setCsrfTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}
