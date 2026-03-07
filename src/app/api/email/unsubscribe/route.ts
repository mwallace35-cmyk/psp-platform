import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { captureError } from '@/lib/error-tracking';

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
    "/api/email/unsubscribe",
    userAgent,
    acceptLanguage
  );
  if (!success) {
    const response = NextResponse.redirect(new URL('/?error=rate-limited', request.url));
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    const response = NextResponse.redirect(new URL('/?error=invalid-token', request.url));
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Validate token format: should be a UUID or alphanumeric string
  // Reject tokens with SQL injection attempts or malformed characters
  const tokenFormatRegex = /^[a-f0-9\-]+$/i;
  if (!tokenFormatRegex.test(token)) {
    const response = NextResponse.redirect(new URL('/?error=invalid-token', request.url));
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('email_subscribers')
      .delete()
      .eq('unsubscribe_token', token);

    if (error) throw error;

    const response = NextResponse.redirect(new URL('/?unsubscribed=true', request.url));
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (err) {
    captureError(err, { token: `${token.substring(0, 8)}...`, endpoint: '/api/email/unsubscribe' }, { requestId, path: '/api/email/unsubscribe', method: 'GET', endpoint: '/api/email/unsubscribe' });
    const response = NextResponse.redirect(new URL('/?error=unsubscribe-failed', request.url));
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
