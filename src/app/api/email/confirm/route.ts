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
    "/api/email/confirm",
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

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('email_subscribers')
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq('confirmation_token', token)
      .eq('confirmed', false)
      .select('email')
      .single();

    if (error || !data) {
      if (error) {
        captureError(error, { token: `${token.substring(0, 8)}...`, endpoint: '/api/email/confirm' }, { requestId, path: '/api/email/confirm', method: 'GET', endpoint: '/api/email/confirm' });
      }
      const response = NextResponse.redirect(new URL('/?error=invalid-token', request.url));
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const response = NextResponse.redirect(new URL('/?subscribed=true', request.url));
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (err) {
    captureError(err, { endpoint: '/api/email/confirm' }, { requestId, path: '/api/email/confirm', method: 'GET', endpoint: '/api/email/confirm' });
    const response = NextResponse.redirect(new URL('/?error=confirm-failed', request.url));
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
