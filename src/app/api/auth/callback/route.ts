import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { captureError } from "@/lib/error-tracking";

const ALLOWED_REDIRECT_PREFIXES = ["/admin", "/profile", "/"];

function sanitizeRedirectPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return "/admin";
  }
  const isAllowed = ALLOWED_REDIRECT_PREFIXES.some(prefix =>
    path === prefix || path.startsWith(prefix + "/")
  );
  return isAllowed ? path : "/admin";
}

export async function GET(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirectPath(searchParams.get("next") ?? "/admin");

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
