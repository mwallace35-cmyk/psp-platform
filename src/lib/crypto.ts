/**
 * Cryptographic utilities for secure operations.
 * Provides timing-safe comparison to prevent timing attacks on secrets.
 *
 * NOTE: This module is only for use in server-side code (API routes, server actions).
 * For Edge Runtime (middleware), use the constantTimeCompare in middleware.ts instead.
 */

// Use dynamic import to avoid loading crypto module at edge runtime parse time
let nodeTimingSafeEqual: ((a: Buffer, b: Buffer) => boolean) | null = null;

/**
 * Lazy-load Node.js crypto module for timing-safe comparison.
 * This is only called from server-side API routes, not Edge Runtime middleware.
 */
function getNodeTimingSafeEqual(): ((a: Buffer, b: Buffer) => boolean) | null {
  if (nodeTimingSafeEqual) {
    return nodeTimingSafeEqual;
  }

  try {
    // Only import in Node.js environments
    const crypto = require('crypto');
    if (crypto.timingSafeEqual) {
      nodeTimingSafeEqual = crypto.timingSafeEqual;
      return nodeTimingSafeEqual;
    }
  } catch (error) {
    // crypto module not available (Edge Runtime, browser, etc.)
    return null;
  }

  return null;
}

/**
 * Timing-safe comparison function for secret values.
 * Prevents timing attacks by always taking the same amount of time regardless of where strings differ.
 *
 * This implementation works in both Node.js (server/API routes) and browser contexts.
 * For Node.js, it uses the native crypto.timingSafeEqual when available.
 * Otherwise, it uses a constant-time comparison via TextEncoder.
 *
 * @param a - First string to compare (e.g., provided secret)
 * @param b - Second string to compare (e.g., expected secret)
 * @returns true if strings are equal, false otherwise
 *
 * @example
 * const isValid = timingSafeEqual(providedSecret, process.env.REVALIDATION_SECRET);
 * if (!isValid) {
 *   return apiError("Unauthorized", 401, "INVALID_AUTH");
 * }
 */
export function timingSafeEqual(a: string, b: string): boolean {
  // Prevent timing attacks on empty strings
  if (!a || !b) {
    return false;
  }

  // For Node.js environments, use native crypto.timingSafeEqual if available
  const timingSafeEqualFn = getNodeTimingSafeEqual();
  if (timingSafeEqualFn) {
    try {
      return timingSafeEqualFn(
        Buffer.from(a, 'utf-8'),
        Buffer.from(b, 'utf-8')
      );
    } catch (error) {
      // If lengths don't match, timingSafeEqual throws an error
      // Return false for mismatched length (still constant-time check happened first)
      return false;
    }
  }

  // Fallback for environments without crypto module (Edge Runtime, browser)
  // Performs constant-time comparison using bitwise operations
  // Even if strings have different lengths, comparison takes similar time
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);

  // Ensure both buffers are the same length for comparison
  // If lengths differ, we still iterate through the longer one
  const maxLength = Math.max(aBytes.length, bBytes.length);
  let result = aBytes.length === bBytes.length ? 0 : 1;

  for (let i = 0; i < maxLength; i++) {
    result |= (aBytes[i] || 0) ^ (bBytes[i] || 0);
  }

  return result === 0;
}
