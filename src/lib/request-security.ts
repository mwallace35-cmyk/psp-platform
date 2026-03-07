/**
 * Request security utilities for API endpoints.
 * Provides origin validation and CSRF-like protections for mutation operations.
 */

import { NextRequest } from "next/server";

/**
 * List of allowed origins for API requests.
 * These are origins that are allowed to make authenticated API calls.
 *
 * By default, only requests from the same origin are allowed.
 * Add additional trusted origins as needed (e.g., mobile apps, partner domains).
 *
 * Note: This is an allowlist approach - requests from unlisted origins are rejected.
 */
function getAllowedOrigins(): string[] {
  const allowedOrigins = [
    // Same-origin requests
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/https?:\/\//, "").split(".")[0] || "",
  ];

  // Add any additional allowed origins from environment
  if (process.env.ALLOWED_API_ORIGINS) {
    allowedOrigins.push(
      ...process.env.ALLOWED_API_ORIGINS.split(",").map((origin) => origin.trim())
    );
  }

  return allowedOrigins.filter(Boolean);
}

/**
 * Validates the origin of an incoming request.
 *
 * Security measure against CSRF-like attacks on API endpoints.
 * Ensures that API requests come from expected sources.
 *
 * For same-origin requests (middleware.ts calls), this provides an additional
 * security layer preventing cross-site script attacks.
 *
 * @param request - Next.js request object
 * @returns true if origin is allowed or not provided (same-origin assumed), false otherwise
 *
 * @example
 * if (!isOriginAllowed(request)) {
 *   return apiError("Origin not allowed", 403, "FORBIDDEN_ORIGIN");
 * }
 */
export function isOriginAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  // If no origin header, assume same-origin request (browser same-origin policy)
  // or tool/server-side request
  if (!origin) {
    return true;
  }

  // For requests with an origin header, validate it's in the allowlist
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    const allowedOrigins = getAllowedOrigins();

    // Check if origin hostname matches any allowed origin
    const isAllowed = allowedOrigins.some((allowed) => {
      // Exact match
      if (hostname === allowed) return true;
      // Wildcard support for subdomains
      if (allowed.startsWith("*.") && hostname.endsWith(allowed.slice(1))) return true;
      return false;
    });

    if (!isAllowed) {
      console.warn(
        `⚠️ API request rejected: origin not allowed. ` +
        `Origin: ${hostname}, Allowed: ${allowedOrigins.join(", ")}`
      );
    }

    return isAllowed;
  } catch (error) {
    console.warn(`⚠️ Failed to parse origin header: ${origin}`);
    return false;
  }
}

/**
 * Get the request origin for logging and security context.
 *
 * @param request - Next.js request object
 * @returns The origin header value, or "same-origin" if not provided
 */
export function getRequestOrigin(request: NextRequest): string {
  return request.headers.get("origin") || "same-origin";
}

/**
 * Get the referer for logging and security context.
 *
 * @param request - Next.js request object
 * @returns The referer header value, or undefined if not provided
 */
export function getRequestReferer(request: NextRequest): string | undefined {
  return request.headers.get("referer") || undefined;
}
