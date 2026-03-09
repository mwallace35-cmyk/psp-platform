/**
 * API Middleware Utilities
 *
 * Provides common middleware functions for API routes:
 * - Rate limiting (per IP, per user)
 * - CORS handling
 * - Request validation and sanitization
 * - Response formatting
 * - Error handling
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix?: string; // Cache key prefix
}

/**
 * Standard rate limit configs
 */
export const RATE_LIMITS = {
  PUBLIC_API: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    keyPrefix: "rl:public",
  } as RateLimitConfig,
  SEARCH: {
    windowMs: 60000,
    maxRequests: 60,
    keyPrefix: "rl:search",
  } as RateLimitConfig,
  LEADERBOARDS: {
    windowMs: 60000,
    maxRequests: 120,
    keyPrefix: "rl:leaderboards",
  } as RateLimitConfig,
  STRICT: {
    windowMs: 60000,
    maxRequests: 30,
    keyPrefix: "rl:strict",
  } as RateLimitConfig,
} as const;

/**
 * In-memory rate limit store (for local dev/testing)
 * In production, should use Redis or similar
 */
class RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.store.entries()) {
        if (value.resetAt < now) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  check(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetAt < now) {
      // New or expired entry
      const resetAt = now + config.windowMs;
      this.store.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt,
      };
    }

    // Existing entry
    if (entry.count < config.maxRequests) {
      entry.count++;
      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

/**
 * Get client IP from request
 * Handles X-Forwarded-For, X-Real-IP, and direct connection
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return (request as unknown as { ip?: string }).ip || "unknown";
}

/**
 * Apply rate limiting to a request
 * Returns response with rate limit headers if limit exceeded
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.PUBLIC_API
): { allowed: boolean; response?: NextResponse; headers: Record<string, string> } {
  const ip = getClientIp(request);
  const key = `${config.keyPrefix}:${ip}`;
  const result = rateLimiter.check(key, config);

  const headers = {
    "X-RateLimit-Limit": String(config.maxRequests),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (!result.allowed) {
    const response = new NextResponse(
      JSON.stringify({
        success: false,
        error: "Rate limit exceeded",
      }),
      {
        status: 429,
        headers: {
          ...headers,
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          "Content-Type": "application/json",
        },
      }
    );

    return {
      allowed: false,
      response,
      headers,
    };
  }

  return {
    allowed: true,
    headers,
  };
}

/**
 * Standard API error response
 */
export function apiErrorResponse(
  message: string,
  status: number = 500,
  code?: string
): NextResponse {
  return new NextResponse(
    JSON.stringify({
      success: false,
      error: message,
      ...(code && { code }),
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

/**
 * Standard API success response with data
 */
export function apiSuccessResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
  pagination?: Record<string, unknown>
): NextResponse {
  return new NextResponse(
    JSON.stringify({
      success: true,
      data,
      ...(pagination && { pagination }),
      ...(meta && { meta }),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * Add CORS headers to response
 * Configurable by environment
 */
export function addCorsHeaders(
  response: NextResponse,
  origin?: string
): NextResponse {
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "*").split(",");
  const isAllowed = allowedOrigins.includes("*") || allowedOrigins.includes(origin || "");

  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
  }

  return response;
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreFlight(request: NextRequest): NextResponse | null {
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    return addCorsHeaders(response, request.headers.get("origin") || undefined);
  }
  return null;
}

/**
 * Validate required query parameters
 */
export function validateQueryParams(
  request: NextRequest,
  required: string[],
  optional?: string[]
): { valid: boolean; errors: string[] } {
  const { searchParams } = new URL(request.url);
  const errors: string[] = [];

  required.forEach((param) => {
    if (!searchParams.has(param)) {
      errors.push(`Missing required parameter: ${param}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Wrap an API handler with common middleware
 */
export function withApiMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    rateLimit?: RateLimitConfig;
    requireAuth?: boolean;
    corsEnabled?: boolean;
  }
) {
  return async (request: NextRequest) => {
    // Handle CORS preflight
    const preflightResponse = handleCorsPreFlight(request);
    if (preflightResponse) {
      return preflightResponse;
    }

    // Apply rate limiting if configured
    if (options?.rateLimit) {
      const { allowed, response: rateLimitResponse, headers } = checkRateLimit(
        request,
        options.rateLimit
      );

      if (!allowed && rateLimitResponse) {
        return addCorsHeaders(
          rateLimitResponse,
          request.headers.get("origin") || undefined
        );
      }

      // Add rate limit headers to successful response
      const response = await handler(request);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return addCorsHeaders(response, request.headers.get("origin") || undefined);
    }

    // Call handler
    const response = await handler(request);

    // Add CORS headers if enabled
    if (options?.corsEnabled !== false) {
      return addCorsHeaders(response, request.headers.get("origin") || undefined);
    }

    return response;
  };
}
