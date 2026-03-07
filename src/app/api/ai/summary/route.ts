import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { generateArticleSummary } from '@/lib/anthropic';
import { rateLimit } from '@/lib/rate-limit';
import { validateCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/lib/csrf';
import { aiSummarySchema } from '@/lib/validation';
import { captureError } from '@/lib/error-tracking';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  // CSRF validation
  const csrfToken = request.headers.get(CSRF_HEADER_NAME);
  const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!csrfToken || !csrfCookie || !validateCsrfToken(csrfToken, csrfCookie)) {
    const response = apiError("Invalid CSRF token", 403, "CSRF_VALIDATION_FAILED");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success } = await rateLimit(
    ip,
    5,
    60000,
    "/api/ai/summary",
    userAgent,
    acceptLanguage
  );

  if (!success) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Check auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const response = apiError('Unauthorized', 401, "UNAUTHORIZED");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const body = await request.json();

    // Validate request body with Zod
    const parsed = aiSummarySchema.safeParse(body);
    if (!parsed.success) {
      const response = apiError('Invalid request: title and body are required', 400, "INVALID_REQUEST");
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const { title, body: contentBody } = parsed.data;

    const summary = await generateArticleSummary(contentBody, title);
    const response = apiSuccess({ summary });
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error: unknown) {
    // Log the full error internally but return generic message to client
    captureError(error, { endpoint: '/api/ai/summary' }, { requestId, userId: user?.id, path: '/api/ai/summary', method: 'POST', endpoint: '/api/ai/summary' });
    const response = apiError('Failed to generate summary', 500, "SUMMARY_GENERATION_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
