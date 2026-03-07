import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { sendConfirmationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { validateCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/lib/csrf';
import { sendConfirmationEmailSchema } from '@/lib/validation';
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
    "/api/email/send-confirmation",
    userAgent,
    acceptLanguage
  );
  if (!success) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const body = await request.json();

    // Validate request body with Zod
    const parsed = sendConfirmationEmailSchema.safeParse(body);
    if (!parsed.success) {
      const response = apiError('Invalid email or token format', 400, 'INVALID_INPUT');
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const { email, token } = parsed.data;

    if (!process.env.RESEND_API_KEY) {
      // Silently succeed in dev without Resend configured
      const response = apiSuccess({ dev: true });
      response.headers.set("x-request-id", requestId);
      return response;
    }

    await sendConfirmationEmail(email, token);
    const response = apiSuccess({});
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error: any) {
    // Log the full error internally but return generic message to client
    captureError(error, { endpoint: '/api/email/send-confirmation' }, { requestId, path: '/api/email/send-confirmation', method: 'POST', endpoint: '/api/email/send-confirmation' });
    const response = apiError('Failed to send confirmation email', 500, 'EMAIL_SEND_ERROR');
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
