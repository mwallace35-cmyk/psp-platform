import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";
import { timingSafeEqual } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";
import { isOriginAllowed, getRequestOrigin } from "@/lib/request-security";

/**
 * POST /api/revalidate
 *
 * Revalidates cached pages or tags using Next.js ISR (Incremental Static Regeneration).
 * Requires Bearer token authentication with REVALIDATION_SECRET.
 *
 * Request body:
 * - path?: string - Path to revalidate (e.g., "/", "/blog/post-1")
 * - tag?: string - Cache tag to revalidate (e.g., "blog-posts")
 * - type?: string - Type of revalidation: "page" or "layout" (default: "page")
 *
 * Headers:
 * - Authorization: Bearer <REVALIDATION_SECRET> (required)
 *
 * Response:
 * - 200: Revalidation successful
 * - 401: Unauthorized (invalid or missing token)
 * - 400: Bad request (missing path/tag)
 * - 429: Rate limit exceeded
 * - 500: Internal server error
 */
export async function POST(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();
  const origin = getRequestOrigin(request);

  // Origin validation - reject requests from untrusted origins
  if (!isOriginAllowed(request)) {
    const response = apiError("Origin not allowed", 403, "FORBIDDEN_ORIGIN");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Rate limiting for revalidate endpoint
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const { success: rateLimitSuccess, remaining, resetAt } = await rateLimit(
    ip,
    10, // 10 requests
    60000, // per minute
    "/api/revalidate",
    request.headers.get("user-agent"),
    request.headers.get("accept-language")
  );

  if (!rateLimitSuccess) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  }

  // Validate authorization header using timing-safe comparison
  const authHeader = request.headers.get("authorization") || "";
  const secret = process.env.REVALIDATION_SECRET || "";
  const expectedAuth = `Bearer ${secret}`;

  if (!secret || !timingSafeEqual(authHeader, expectedAuth)) {
    const response = apiError("Unauthorized", 401, "INVALID_AUTH");
    response.headers.set("x-request-id", requestId);
    response.headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining)));
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  }

  try {
    const body = await request.json();
    const { path, tag, type = "page" } = body;

    // Apply rate limit headers to successful response
    const rateLimitHeaders = {
      "X-RateLimit-Remaining": String(Math.max(0, remaining)),
      ...(resetAt && { "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)) }),
    };

    if (tag) {
      revalidateTag(tag, "default");
      const response = apiSuccess({ revalidated: true, tag });
      response.headers.set("x-request-id", requestId);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        if (value) response.headers.set(key, value);
      });
      return response;
    }

    if (path) {
      revalidatePath(path, type);
      const response = apiSuccess({ revalidated: true, path });
      response.headers.set("x-request-id", requestId);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        if (value) response.headers.set(key, value);
      });
      return response;
    }

    const response = apiError("Provide path or tag", 400, "MISSING_PARAMS");
    response.headers.set("x-request-id", requestId);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      if (value) response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/revalidate" }, { requestId, path: '/api/revalidate', method: 'POST', endpoint: '/api/revalidate' });
    const response = apiError("Failed to process revalidation request", 500, "REVALIDATION_ERROR");
    response.headers.set("x-request-id", requestId);
    response.headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining)));
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  }
}
