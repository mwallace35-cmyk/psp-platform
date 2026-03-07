import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { captureError } from "@/lib/error-tracking";

const ALLOWED_REDIRECT_PREFIXES = ["/admin", "/profile", "/"];

/**
 * Sanitize redirect path to prevent open redirect attacks.
 *
 * Security checks:
 * - Must start with "/" (absolute path only, no protocol-relative URLs like "//evil.com")
 * - No double slashes at the start (prevents protocol-relative URLs)
 * - No backslashes (prevents Windows path escape)
 * - Must match allowed prefixes
 * - Defaults to "/" not "/admin" to be more restrictive
 *
 * @param path - The redirect path from the user
 * @returns A safe redirect path
 */
function sanitizeRedirectPath(path: string): string {
  if (!path) {
    return "/";
  }

  // SECURITY: Reject protocol-relative URLs (//evil.com), paths without leading slash, and backslashes
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return "/";
  }

  // SECURITY: Only allow specific safe prefixes
  const isAllowed = ALLOWED_REDIRECT_PREFIXES.some(prefix =>
    path === prefix || path.startsWith(prefix + "/")
  );

  // SECURITY: Default to "/" not "/admin" - more restrictive fail-safe
  return isAllowed ? path : "/";
}

export async function GET(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // SECURITY: Default to "/" not "/admin" for safer fail-open behavior
  const next = sanitizeRedirectPath(searchParams.get("next") ?? "/");

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const response = NextResponse.redirect(`${origin}${next}`);
        response.headers.set("x-request-id", requestId);
        return response;
      }
      // Log auth error for debugging
      captureError(new Error(`Auth exchange failed: ${error?.message}`), { endpoint: '/api/auth/callback' }, { requestId, path: '/api/auth/callback', method: 'GET', endpoint: '/api/auth/callback' });
    } catch (err) {
      captureError(err, { endpoint: '/api/auth/callback' }, { requestId, path: '/api/auth/callback', method: 'GET', endpoint: '/api/auth/callback' });
    }
  }

  const response = NextResponse.redirect(`${origin}/login?error=auth_failed`);
  response.headers.set("x-request-id", requestId);
  return response;
}
