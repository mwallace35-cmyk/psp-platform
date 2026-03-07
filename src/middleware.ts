import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Use Web Crypto API for edge runtime compatibility
function generateRequestId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const BYPASS_COOKIE = "psp_preview";
const BYPASS_KEY = process.env.PSP_PREVIEW_KEY || "";

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

  // Generate or retrieve request correlation ID
  const requestId = request.headers.get("x-request-id") || generateRequestId();

  // Set bypass cookie via ?preview=<secret> - using constant-time comparison
  const previewParam = searchParams.get("preview") || "";
  if (BYPASS_KEY && constantTimeCompare(previewParam, BYPASS_KEY)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
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

  // Allow passthrough routes
  const isPassthrough = PASSTHROUGH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix + ".")
  );

  if (!isPassthrough) {
    const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "1";
    if (!hasBypass) {
      const url = request.nextUrl.clone();
      url.pathname = "/coming-soon";
      url.search = "";
      const response = NextResponse.redirect(url);
      response.headers.set("x-request-id", requestId);
      return response;
    }
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
  // Note: style-src uses 'nonce-${nonce}' for inline styles and Google Fonts
  // To fully eliminate 'unsafe-inline', ensure all inline styles use the nonce attribute
  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com; frame-ancestors 'none';`;
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
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
