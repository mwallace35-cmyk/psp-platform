import { createHash } from 'crypto';
import { getRedisClient, isRedisAvailable } from './redis';

/**
 * In-memory rate limiting store.
 *
 * LIMITATION: This implementation is in-memory only and does NOT work across
 * distributed systems or serverless functions. Each request may be served by
 * a different instance, bypassing the rate limit.
 *
 * FOR PRODUCTION: Use Redis via the adapter pattern below.
 */
const rateMap = new Map<string, { count: number; resetAt: number }>();

// Cleanup expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateMap) {
      if (now > entry.resetAt) {
        rateMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Result of a rate limit check operation
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt?: number;
}

/**
 * Interface for implementing distributed rate limiting with external adapters.
 * Implement this interface to support Redis, Memcached, or other persistent stores.
 */
export interface RateLimitAdapter {
  /**
   * Check rate limit for a key using sliding window algorithm.
   * @param key - Unique identifier (e.g., "ip:endpoint:fingerprint")
   * @param maxRequests - Maximum requests allowed in the window
   * @param windowMs - Time window in milliseconds
   * @returns Result with success status, remaining requests, and reset time
   */
  check(key: string, maxRequests: number, windowMs: number): Promise<RateLimitResult>;
}

/**
 * In-memory adapter for rate limiting using fixed window counters.
 * Suitable for single-instance deployments.
 */
export class InMemoryAdapter implements RateLimitAdapter {
  async check(key: string, maxRequests: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = rateMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateMap.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: maxRequests - 1, resetAt: now + windowMs };
    }

    entry.count++;
    if (entry.count > maxRequests) {
      return { success: false, remaining: 0, resetAt: entry.resetAt };
    }

    return { success: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
  }
}

/**
 * Redis adapter for rate limiting using sliding window with ZSET.
 * Suitable for distributed deployments.
 *
 * Uses Redis Sorted Sets (ZSET) to track requests with timestamps as scores.
 * This provides a true sliding window implementation.
 */
export class RedisAdapter implements RateLimitAdapter {
  private keyPrefix = 'ratelimit:';

  async check(key: string, maxRequests: number, windowMs: number): Promise<RateLimitResult> {
    try {
      const client = await getRedisClient();
      if (!client) {
        // Fall back to in-memory if Redis is not available
        return new InMemoryAdapter().check(key, maxRequests, windowMs);
      }

      const redisKey = `${this.keyPrefix}${key}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Remove old entries outside the window
      await client.zremrangebyscore(redisKey, '-inf', windowStart);

      // Count requests in current window
      const count = await client.zcard(redisKey);

      if (count >= maxRequests) {
        // Get the oldest entry to calculate reset time
        const oldest = await client.zrange(redisKey, 0, 0, 'WITHSCORES');
        const resetAt = oldest.length >= 2 ? parseInt(oldest[1]) + windowMs : now + windowMs;

        return {
          success: false,
          remaining: 0,
          resetAt,
        };
      }

      // Add current request with current timestamp as score
      await client.zadd(redisKey, now, `${now}-${Math.random()}`);

      // Set TTL to window duration to auto-cleanup
      await client.pexpire(redisKey, windowMs);

      const remaining = Math.max(0, maxRequests - count - 1);
      const resetAt = windowStart + windowMs;

      return {
        success: true,
        remaining,
        resetAt,
      };
    } catch (error) {
      console.error('[RateLimitAdapter] Redis error:', error);
      // Fall back to in-memory on any error
      return new InMemoryAdapter().check(key, maxRequests, windowMs);
    }
  }
}

// Global adapter instance - automatically selects based on Redis availability
let rateLimitAdapter: RateLimitAdapter | null = null;

/**
 * Initialize the rate limit adapter.
 * Auto-selects Redis or in-memory based on configuration.
 */
async function initializeAdapter(): Promise<RateLimitAdapter> {
  if (rateLimitAdapter) {
    return rateLimitAdapter;
  }

  try {
    const redisAvailable = await isRedisAvailable();
    if (redisAvailable) {
      rateLimitAdapter = new RedisAdapter();
      console.log('[RateLimiter] Using Redis adapter');
    } else {
      rateLimitAdapter = new InMemoryAdapter();
      console.log('[RateLimiter] Using in-memory adapter');
    }
  } catch (error) {
    console.error('[RateLimiter] Failed to initialize adapter:', error);
    rateLimitAdapter = new InMemoryAdapter();
  }

  return rateLimitAdapter;
}

/**
 * Set the rate limit adapter for distributed rate limiting
 * @param adapter - Custom rate limit adapter (e.g., Redis)
 */
export function setRateLimitAdapter(adapter: RateLimitAdapter) {
  rateLimitAdapter = adapter;
}

/**
 * Get the current rate limit adapter
 */
export async function getRateLimitAdapter(): Promise<RateLimitAdapter> {
  if (!rateLimitAdapter) {
    return initializeAdapter();
  }
  return rateLimitAdapter;
}

/**
 * Generate a fingerprint hash from request characteristics
 * Combines IP, User-Agent, and Accept-Language for better abuse detection
 *
 * @param ip - Client IP address
 * @param userAgent - HTTP User-Agent header
 * @param acceptLanguage - HTTP Accept-Language header
 * @returns SHA256 hash of combined characteristics
 */
export function generateRequestFingerprint(
  ip: string,
  userAgent?: string | null,
  acceptLanguage?: string | null
): string {
  const characteristics = [ip, userAgent || 'unknown', acceptLanguage || 'unknown'].join('|');
  return createHash('sha256').update(characteristics).digest('hex').substring(0, 12);
}

/**
 * Check rate limit for a request with fingerprinting and optional admin bypass
 *
 * @param ip - Client IP address
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @param endpoint - Optional endpoint identifier for per-endpoint limits
 * @param userAgent - Optional User-Agent header for fingerprinting
 * @param acceptLanguage - Optional Accept-Language header for fingerprinting
 * @param isAdmin - Optional flag to bypass rate limits for authenticated admins
 * @returns Object with success status, remaining requests, and reset timestamp
 */
export async function rateLimit(
  ip: string,
  maxRequests = 30,
  windowMs = 60000,
  endpoint?: string,
  userAgent?: string | null,
  acceptLanguage?: string | null,
  isAdmin = false
): Promise<{ success: boolean; remaining: number; resetAt?: number }> {
  // Admins bypass rate limiting
  if (isAdmin) {
    return { success: true, remaining: maxRequests };
  }

  const fingerprint = generateRequestFingerprint(ip, userAgent, acceptLanguage);
  const key = endpoint ? `${ip}:${fingerprint}:${endpoint}` : `${ip}:${fingerprint}`;

  const adapter = await getRateLimitAdapter();
  return adapter.check(key, maxRequests, windowMs);
}

/**
 * Generate standard rate limit headers for API responses.
 * These headers inform clients about their current rate limit status.
 *
 * @param remaining - Number of requests remaining in the current window
 * @param limit - Total request limit for the window
 * @param resetAt - Unix timestamp (in milliseconds) when the rate limit resets
 * @returns Object with standard rate limit headers
 */
export function getRateLimitHeaders(remaining: number, limit: number, resetAt: number) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
  };
}
