import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { mediaQuerySchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  // Rate limit: 30 per minute
  const { success: rateLimitOk, remaining, resetAt } = await rateLimit(
    ip,
    30,
    60000,
    "/api/media",
    userAgent,
    acceptLanguage
  );

  if (!rateLimitOk) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  }

  // Parse query params
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = mediaQuerySchema.safeParse(params);

  if (!parsed.success) {
    const response = apiError(
      `Invalid parameters: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
      400,
      "INVALID_PARAMS"
    );
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const { game_id, school_id, player_id, sport, media_type, status, page, per_page } =
    parsed.data;

  try {
    const supabase = await createClient();

    // Build query
    let query = supabase
      .from("media")
      .select(
        "id, storage_path, file_name, file_size, mime_type, media_type, width, height, duration_seconds, thumbnail_path, status, game_id, school_id, season_id, sport, player_id, category, caption, tags, uploaded_by, is_featured, sort_order, created_at, updated_at",
        { count: "exact" }
      );

    // Apply filters
    if (game_id !== undefined) query = query.eq("game_id", game_id);
    if (school_id !== undefined) query = query.eq("school_id", school_id);
    if (player_id !== undefined) query = query.eq("player_id", player_id);
    if (sport) query = query.eq("sport", sport);
    if (media_type) query = query.eq("media_type", media_type);

    // Default to approved unless explicitly requesting other statuses
    if (status) {
      query = query.eq("status", status);
    } else {
      query = query.eq("status", "approved");
    }

    // Pagination
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    query = query
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      captureError(error, { endpoint: "/api/media" }, { requestId, path: "/api/media", method: "GET", endpoint: "/api/media" });
      const response = apiError("Failed to fetch media", 500, "QUERY_ERROR");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / per_page);

    const response = apiSuccess({
      media: data ?? [],
      pagination: {
        page,
        per_page,
        total,
        total_pages: totalPages,
        has_more: page < totalPages,
      },
    });
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/media" }, { requestId, path: "/api/media", method: "GET", endpoint: "/api/media" });
    const response = apiError("Media query failed", 500, "MEDIA_QUERY_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
