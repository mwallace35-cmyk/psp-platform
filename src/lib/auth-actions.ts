'use server';

import { createClient } from '@/lib/supabase/server';
import { rateLimitLogin, getClientIp, getRateLimitHeaders } from '@/lib/rate-limit';
import { headers } from 'next/headers';

/**
 * Server action for login with rate limiting.
 * Protects against brute force attacks by limiting login attempts per IP.
 *
 * @param email - User email
 * @param password - User password
 * @returns { success: boolean; error?: string; resetAt?: number }
 */
export async function loginWithRateLimit(
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  remaining?: number;
  resetAt?: number;
}> {
  try {
    // Extract client IP from headers
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip') ||
      headersList.get('cf-connecting-ip') ||
      'unknown';

    const userAgent = headersList.get('user-agent');
    const acceptLanguage = headersList.get('accept-language');

    // Check rate limit for login attempts
    const rateLimitResult = await rateLimitLogin(ip, userAgent, acceptLanguage);

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: 'Too many login attempts. Please try again later.',
        remaining: 0,
        resetAt: rateLimitResult.resetAt,
      };
    }

    // Attempt login via Supabase
    const supabase = await createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.resetAt,
      };
    }

    return {
      success: true,
      remaining: rateLimitResult.remaining,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return {
      success: false,
      error: message,
    };
  }
}
