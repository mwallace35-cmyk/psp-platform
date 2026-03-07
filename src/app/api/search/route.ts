import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { searchAll } from "@/lib/data";
import { searchSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";

export async function GET(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success, remaining, resetAt } = await rateLimit(
    ip,
    30,
    60000,
    "/api/search",
    userAgent,
    acceptLanguage
  );

  if (!success) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  }

  const raw = {
    q: request.nextUrl.searchParams.get("q") || "",
    type: request.nextUrl.searchParams.get("type") || undefined,
  };

  const parsed = searchSchema.safeParse(raw);
  if (!parsed.success) {
    const response = apiError("Invalid search parameters", 400, "INVALID_PARAMS");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const searchResult = await searchAll(parsed.data.q, 1, 20);
    let results = searchResult.data;
    if (parsed.data.type) {
      results = results.filter((r) => r.entity_type === parsed.data.type);
    }
    const response = apiSuccess({ results, total: searchResult.total, hasMore: searchResult.hasMore });
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/search", query: parsed.data.q, type: parsed.data.type }, { requestId, path: '/api/search', method: 'GET', endpoint: '/api/search' });
    const response = apiError("Search failed", 500, "SEARCH_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
