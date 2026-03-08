import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/coming-soon-signup
 * Stores an email signup for the coming-soon page.
 * Rate-limited to 5 attempts per IP per 10 minutes.
 */
export async function POST(request: NextRequest) {
  const requestId =
    request.headers.get("x-request-id") || crypto.randomUUID();

  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { success: withinLimit } = await rateLimit(
    ip,
    5,
    600_000, // 10 minutes
    "/api/coming-soon-signup"
  );

  if (!withinLimit) {
    const response = apiError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "600");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Parse body
  let body: { name?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body", 400, "INVALID_BODY");
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim().slice(0, 200) || null;

  if (!email || !EMAIL_REGEX.test(email)) {
    return apiError("Please enter a valid email address.", 400, "INVALID_EMAIL");
  }

  if (email.length > 320) {
    return apiError("Email too long.", 400, "EMAIL_TOO_LONG");
  }

  // Insert into Supabase using service role (bypasses RLS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("[coming-soon-signup] Missing Supabase config");
    return apiError("Service unavailable", 503, "CONFIG_ERROR");
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { error } = await supabase.from("coming_soon_signups").upsert(
    { email, name, signed_up_at: new Date().toISOString() },
    { onConflict: "email" }
  );

  if (error) {
    console.error("[coming-soon-signup] Supabase error:", error.message);
    return apiError("Failed to save. Please try again.", 500, "DB_ERROR");
  }

  const response = apiSuccess({ message: "Signed up successfully!" });
  response.headers.set("x-request-id", requestId);
  return response;
}
