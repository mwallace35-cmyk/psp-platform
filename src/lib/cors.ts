/**
 * CORS (Cross-Origin Resource Sharing) utilities for API routes
 *
 * Provides helper functions to set proper CORS headers on API responses.
 * Use this to allow cross-origin requests from trusted origins.
 */

import { NextResponse, type NextRequest } from "next/server";

/**
 * List of allowed origins for CORS.
 * In production, these should be environment variables.
 * Allows requests from:
 * - Local development (localhost, 127.0.0.1)
 * - PhillySportsPack domain and subdomains
 */
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://phillysportspack.com",
  "https://www.phillysportspack.com",
  "https://*.phillysportspack.com",
  // Add environment-based origins if available
  ...(process.env.ALLOWED_CORS_ORIGINS
    ? process.env.ALLOWED_CORS_ORIGINS.split(",").map(origin => origin.trim())
    : []),
];

/**
 * Allowed HTTP methods for CORS preflight
 */
const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"];

/**
 * Allowed headers in CORS requests
 */
const ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Accept-Language",
];

/**
 * Check if an origin is allowed
 * @param origin - The origin to check (from Origin header)
 * @returns true if origin is allowed, false otherwise
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  // Check exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  // Check wildcard matches (e.g., https://*.phillysportspack.com)
  for (const allowedOrigin of ALLOWED_ORIGINS) {
    if (allowedOrigin.includes("*")) {
      const pattern = allowedOrigin
        .replace(".", "\\.")
        .replace("*", ".*");
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(origin)) return true;
    }
  }

  return false;
}

/**
 * Add CORS headers to a response
 * @param response - Next.js NextResponse to modify
 * @param origin - The requesting origin (from Origin header)
 * @returns The modified response with CORS headers
 */
export function addCorsHeaders(
  response: NextResponse,
  origin: string | null
): NextResponse {
  // Only set CORS headers if origin is allowed
  if (origin && isOriginAllowed(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
    response.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
    response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // These headers are always set (for security)
  response.headers.set("Vary", "Origin");

  return response;
}

/**
 * Handle CORS preflight requests (OPTIONS method)
 * @param request - The incoming request
 * @returns NextResponse with appropriate CORS headers
 */
export function handleCorsPreFlight(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, origin);
}

/**
 * Middleware helper to handle CORS for API routes
 * Call this in your API route handler to add CORS support
 *
 * @example
 * export async function GET(request: NextRequest) {
 *   // Handle preflight
 *   if (request.method === "OPTIONS") {
 *     return handleCorsPreFlight(request);
 *   }
 *
 *   // ... your GET logic ...
 *
 *   // Add CORS headers to response
 *   const response = NextResponse.json({ data: "..." });
 *   return addCorsHeaders(response, request.headers.get("origin"));
 * }
 */

/**
 * CORS error response helper
 * Returns a 403 Forbidden response when origin is not allowed
 */
export function corsErrorResponse(): NextResponse {
  return new NextResponse("CORS origin not allowed", {
    status: 403,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
