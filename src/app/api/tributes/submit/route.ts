import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getUnifiedLegendBySlug } from "@/lib/mdx/legendAdapter";

/**
 * POST /api/tributes/submit
 *
 * Public endpoint for submitting a user tribute to a legend's page.
 * No account required — submitter provides name + optional affiliation
 * + body. All submissions land in `status = 'pending'` and are reviewed
 * in /admin/tributes before going live.
 *
 * Rate limited to 5 submissions per IP per 10 minutes. A simple profanity
 * filter short-circuits obvious abuse; anything that passes rate limit
 * and profanity still needs admin approval, so the floor is moderation.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BodySchema = z.object({
  legend_slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "invalid slug"),
  name: z.string().min(1).max(200),
  affiliation: z.string().max(300).optional().nullable(),
  body: z.string().min(2).max(8000),
  email_optional: z.string().max(320).optional().nullable(),
});

// Minimal profanity/abuse guard. We're not trying to be comprehensive —
// admin queue is the real gate. This just filters obvious drive-by garbage.
const BLOCKLIST = [
  "http://",
  "https://",
  "<script",
  "javascript:",
  "onerror=",
];

function containsObviousAbuse(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKLIST.some((term) => lower.includes(term));
}

function hashIp(ip: string): string {
  const salt = process.env.TRIBUTES_IP_SALT ?? "psp-legend-tributes-v1";
  return crypto.createHash("sha256").update(salt + ":" + ip).digest("hex");
}

export async function POST(request: NextRequest) {
  const requestId =
    request.headers.get("x-request-id") || crypto.randomUUID();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // 1) Rate limit by IP (5 / 10 min)
  const { success: withinLimit } = await rateLimit(
    ip,
    5,
    600_000,
    "/api/tributes/submit",
  );
  if (!withinLimit) {
    const response = apiError(
      "Too many submissions. Please try again later.",
      429,
      "RATE_LIMIT_EXCEEDED",
    );
    response.headers.set("Retry-After", "600");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // 2) Parse + validate body
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return apiError("Invalid request body", 400, "INVALID_BODY");
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return apiError(
      parsed.error.issues[0]?.message ?? "Invalid submission",
      400,
      "VALIDATION_FAILED",
    );
  }
  const { legend_slug, name, affiliation, body, email_optional } = parsed.data;

  if (email_optional && !EMAIL_REGEX.test(email_optional)) {
    return apiError("Invalid email address", 400, "INVALID_EMAIL");
  }

  // 3) Verify the legend slug actually exists — prevents spam against
  //    made-up slugs.
  const legend = getUnifiedLegendBySlug(legend_slug);
  if (!legend) {
    return apiError("Unknown legend", 404, "LEGEND_NOT_FOUND");
  }

  // 4) Profanity / XSS short-circuit
  if (containsObviousAbuse(body) || containsObviousAbuse(name)) {
    return apiError(
      "Submission contains disallowed content.",
      400,
      "CONTENT_REJECTED",
    );
  }

  // 5) Insert as pending using anon key — the legend_tributes_insert_pending
  //    RLS policy permits unauthenticated inserts as long as
  //    status='pending' AND source='user', which we enforce below.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    if (process.env.NODE_ENV === "development") {
      console.error("[tributes/submit] Missing Supabase config");
    }
    return apiError("Service unavailable", 503, "CONFIG_ERROR");
  }
  const supabase = createClient(supabaseUrl, anonKey);

  const { error } = await supabase.from("legend_tributes").insert({
    legend_slug,
    name: name.trim(),
    affiliation: affiliation?.trim() || null,
    body: body.trim(),
    email_optional: email_optional?.trim().toLowerCase() || null,
    source: "user",
    status: "pending",
    ip_hash: hashIp(ip),
  });

  if (error) {
    console.error("[tributes/submit] Supabase error:", error.message);
    return apiError("Failed to submit. Please try again.", 500, "DB_ERROR");
  }

  const response = apiSuccess({
    message:
      "Thanks for your tribute. It will appear on the page once it's reviewed.",
  });
  response.headers.set("x-request-id", requestId);
  return response;
}
