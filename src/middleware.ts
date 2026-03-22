import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Use Web Crypto API for edge runtime compatibility
function generateRequestId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * In-memory rate limiting store for edge runtime.
 * Tracks requests per IP + endpoint combination using sliding window.
 * Each entry: { requests: Array<timestamp>, resetAt: number }
 *
 * LIMITATION: This is per-instance only. Across Vercel instances,
 * each may have independent limits. For multi-instance, use Redis.
 */
interface RateLimitEntry {
  requests: number[];
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Cleanup expired entries every 5 minutes
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Check rate limit using sliding window counter
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  // Initialize or reset expired window
  if (!entry || now > entry.resetAt) {
    entry = { requests: [now], resetAt: now + windowMs };
    rateLimitStore.set(key, entry);
    return { allowed: true, remaining: maxRequests - 1, resetAt: entry.resetAt };
  }

  // Remove requests outside current window
  const windowStart = now - windowMs;
  entry.requests = entry.requests.filter(t => t > windowStart);

  // Check if limit exceeded
  if (entry.requests.length >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Add current request
  entry.requests.push(now);
  const remaining = maxRequests - entry.requests.length;

  return { allowed: true, remaining, resetAt: entry.resetAt };
}

const BYPASS_COOKIE = "psp_preview";
const BYPASS_KEY = process.env.SITE_PASSWORD || process.env.PSP_PREVIEW_KEY || "";
const ALLOWED_IPS = (process.env.PSP_ALLOWED_IPS || "")
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);

const PASSTHROUGH_PREFIXES = [
  "/coming-soon",
  "/admin",
  "/login",
  "/api",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap",
  "/manifest",
  "/banners",
  "/textures",
  "/scores",
  "/pulse",
  "/pipeline",
  "/challenge",
  "/pickem",
  "/potw",
  "/community",
  "/leaderboards",
  "/compare",
  "/stats",
  "/awards",
  "/glossary",
  "/about",
  "/support",
  "/data-sources",
  "/coaches",
  "/recruit",
  "/recruiting",
  "/next-level",
  "/history",
  "/standings",
  "/players",
  "/schools",
  "/football",
  "/basketball",
  "/baseball",
  "/track-field",
  "/lacrosse",
  "/wrestling",
  "/soccer",
  "/articles",
  "/feed",
  "/advertise",
  "/profile",
  "/signup",
  "/search",
  "/my-schools",
];

/**
 * Constant-time comparison for the preview parameter.
 * Uses a simple XOR approach that works in Edge Runtime without importing 'crypto'.
 *
 * @param a - Provided value
 * @param b - Expected value
 * @returns true if equal, false otherwise
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip middleware entirely for static assets and public directory files
  if (/\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|css|js|map)$/i.test(pathname) || pathname.startsWith('/banners') || pathname.startsWith('/textures')) {
    return NextResponse.next();
  }

  // Generate or retrieve request correlation ID
  const requestId = request.headers.get("x-request-id") || generateRequestId();

  // Set bypass cookie via ?preview=<secret> - using constant-time comparison
  const previewParam = searchParams.get("preview") || "";
  if (BYPASS_KEY && constantTimeCompare(previewParam, BYPASS_KEY)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    // SECURITY: Use sameSite:'strict' in production to prevent CSRF attacks on preview bypass
    response.cookies.set(BYPASS_COOKIE, "1", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' as const,
    });
    // Pass request ID through
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Coming-soon gate — redirect public visitors, allow IP-allowlisted & cookie-bypassed users
  const isPassthrough = PASSTHROUGH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isPassthrough) {
    // Check IP allowlist (Vercel sets x-forwarded-for)
    const forwarded = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
    const ipAllowed = ALLOWED_IPS.length > 0 && ALLOWED_IPS.includes(clientIp);

    // Check preview cookie (set via ?preview=<key>)
    const hasBypassCookie = request.cookies.get(BYPASS_COOKIE)?.value === "1";

    if (!ipAllowed && !hasBypassCookie) {
      const comingSoonUrl = request.nextUrl.clone();
      comingSoonUrl.pathname = "/coming-soon";
      comingSoonUrl.search = "";
      const response = NextResponse.redirect(comingSoonUrl);
      response.headers.set("x-request-id", requestId);
      return response;
    }
  }

  // Public API rate limiting — apply BEFORE admin auth check
  // These limits are per IP + endpoint, sliding window
  if (pathname.startsWith("/api/v1/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const rateLimitKey = `${ip}:/api/v1`;
    const { allowed, remaining, resetAt } = checkRateLimit(rateLimitKey, 60, 60 * 1000); // 60/min

    if (!allowed) {
      const response = new NextResponse("Too many requests", { status: 429 });
      response.headers.set("Retry-After", "60");
      response.headers.set("X-RateLimit-Limit", "60");
      response.headers.set("X-RateLimit-Remaining", "0");
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Create response to add rate limit headers
    const nextResponse = NextResponse.next();
    nextResponse.headers.set("X-RateLimit-Limit", "60");
    nextResponse.headers.set("X-RateLimit-Remaining", String(remaining));
    nextResponse.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    nextResponse.headers.set("x-request-id", requestId);
    return nextResponse;
  }

  if (pathname.startsWith("/api/ai/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const rateLimitKey = `${ip}:/api/ai`;
    const { allowed, remaining, resetAt } = checkRateLimit(rateLimitKey, 5, 60 * 1000); // 5/min

    if (!allowed) {
      const response = new NextResponse("Too many requests", { status: 429 });
      response.headers.set("Retry-After", "60");
      response.headers.set("X-RateLimit-Limit", "5");
      response.headers.set("X-RateLimit-Remaining", "0");
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Create response to add rate limit headers
    const nextResponse = NextResponse.next();
    nextResponse.headers.set("X-RateLimit-Limit", "5");
    nextResponse.headers.set("X-RateLimit-Remaining", String(remaining));
    nextResponse.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    nextResponse.headers.set("x-request-id", requestId);
    return nextResponse;
  }

  if (pathname.startsWith("/api/email/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const rateLimitKey = `${ip}:/api/email`;
    const { allowed, remaining, resetAt } = checkRateLimit(rateLimitKey, 10, 60 * 1000); // 10/min

    if (!allowed) {
      const response = new NextResponse("Too many requests", { status: 429 });
      response.headers.set("Retry-After", "60");
      response.headers.set("X-RateLimit-Limit", "10");
      response.headers.set("X-RateLimit-Remaining", "0");
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Create response to add rate limit headers
    const nextResponse = NextResponse.next();
    nextResponse.headers.set("X-RateLimit-Limit", "10");
    nextResponse.headers.set("X-RateLimit-Remaining", String(remaining));
    nextResponse.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    nextResponse.headers.set("x-request-id", requestId);
    return nextResponse;
  }

  // Admin auth gate
  if (pathname.startsWith("/admin") || pathname === "/login") {
    const sessionResponse = await updateSession(request);
    sessionResponse.headers.set("x-request-id", requestId);
    return sessionResponse;
  }

  // Add security headers
  const response = NextResponse.next();

  // Request body size check (1MB limit)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 1_000_000) {
    return new NextResponse("Request too large", { status: 413 });
  }

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Clickjacking protection
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // XSS protection for older browsers
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy (disable unused APIs)
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  // HSTS - enforce HTTPS
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // Cross-Origin policies for security isolation
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Cross-Origin Embedder Policy - requires corp headers on cross-origin resources
  // Only enable if all cross-origin resources have proper CORP headers
  // response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");

  // Generate CSP nonce for inline scripts and styles
  const nonce = generateRequestId();
  // SECURITY: Removed 'unsafe-inline' from script-src. Scripts MUST use the nonce.
  // style-src retains 'unsafe-inline' because Next.js injects inline styles during rendering
  // TODO: Consider using CSS-in-JS or scoped styles to eliminate 'unsafe-inline' from style-src
  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com; frame-ancestors 'none';`;
  response.headers.set("Content-Security-Policy", csp);

  // Pass nonce to layout via custom header
  response.headers.set("x-csp-nonce", nonce);

  // Pass request ID for correlation across API calls
  response.headers.set("x-request-id", requestId);

  // Encourage proper CDN caching for compressed responses
  response.headers.set("Vary", "Accept-Encoding");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|banners|textures|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
