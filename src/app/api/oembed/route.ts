import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/sanitize";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";

/**
 * oEmbed proxy endpoint
 * Fetches embed HTML from Twitter/Instagram oEmbed APIs (free, no auth needed)
 * Usage: GET /api/oembed?url=https://twitter.com/user/status/123
 */

const OEMBED_ENDPOINTS: Record<string, string> = {
  twitter: "https://publish.twitter.com/oembed",
  instagram: "https://graph.facebook.com/v18.0/instagram_oembed",
};

function detectPlatform(url: string): string | null {
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("instagram.com")) return "instagram";
  return null;
}

export async function GET(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success } = await rateLimit(
    ip,
    10,
    60000,
    "/api/oembed",
    userAgent,
    acceptLanguage
  );

  if (!success) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    const response = apiError("Missing url parameter", 400, "MISSING_URL");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const platform = detectPlatform(url);
  if (!platform) {
    const response = apiError("Unsupported platform. Only Twitter/X and Instagram URLs are supported.", 400, "UNSUPPORTED_PLATFORM");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const endpoint = OEMBED_ENDPOINTS[platform];

  try {
    const oembedUrl = `${endpoint}?url=${encodeURIComponent(url)}&omit_script=true&maxwidth=400`;
    const res = await fetch(oembedUrl, {
      headers: { "User-Agent": "PhillySportsPack/1.0" },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      const response = apiError(`oEmbed API returned ${res.status}`, res.status, "OEMBED_API_ERROR");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const data = await res.json();

    const response = apiSuccess({
      html: data.html ? sanitizeHtml(data.html) : null,
      title: data.title || null,
      author_name: data.author_name || null,
      author_url: data.author_url || null,
      thumbnail_url: data.thumbnail_url || null,
      platform,
    });
    response.headers.set("Cache-Control", "public, max-age=3600");
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/oembed", url }, { requestId, path: '/api/oembed', method: 'GET', endpoint: '/api/oembed' });
    const response = apiError("Failed to fetch embed data", 500, "OEMBED_FETCH_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
