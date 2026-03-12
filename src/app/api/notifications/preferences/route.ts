import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { captureError } from '@/lib/error-tracking';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success } = await rateLimit(
    ip,
    30,
    60000,
    "/api/notifications/preferences",
    userAgent,
    acceptLanguage
  );
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limited' },
      { status: 429, headers: { "x-request-id": requestId } }
    );
  }

  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { "x-request-id": requestId } }
      );
    }

    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('notification_prefs')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      captureError(fetchError,
        { userId: user.id },
        { requestId, path: '/api/notifications/preferences', method: 'GET', endpoint: '/api/notifications/preferences' }
      );
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500, headers: { "x-request-id": requestId } }
      );
    }

    const prefs = profile?.notification_prefs || {
      game_alerts: true,
      record_alerts: true,
      potw_results: true,
      weekly_digest: true,
      new_articles: false,
    };

    return NextResponse.json(prefs, { headers: { "x-request-id": requestId } });
  } catch (err) {
    captureError(err, { endpoint: '/api/notifications/preferences' },
      { requestId, path: '/api/notifications/preferences', method: 'GET', endpoint: '/api/notifications/preferences' }
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success } = await rateLimit(
    ip,
    10,
    60000,
    "/api/notifications/preferences",
    userAgent,
    acceptLanguage
  );
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limited' },
      { status: 429, headers: { "x-request-id": requestId } }
    );
  }

  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { "x-request-id": requestId } }
      );
    }

    const body = await request.json();
    const { notification_prefs } = body;

    if (!notification_prefs || typeof notification_prefs !== 'object') {
      return NextResponse.json(
        { error: 'Invalid notification_prefs' },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ notification_prefs })
      .eq('id', user.id);

    if (updateError) {
      captureError(updateError,
        { userId: user.id },
        { requestId, path: '/api/notifications/preferences', method: 'POST', endpoint: '/api/notifications/preferences' }
      );
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500, headers: { "x-request-id": requestId } }
      );
    }

    return NextResponse.json(
      { success: true, notification_prefs },
      { headers: { "x-request-id": requestId } }
    );
  } catch (err) {
    captureError(err, { endpoint: '/api/notifications/preferences' },
      { requestId, path: '/api/notifications/preferences', method: 'POST', endpoint: '/api/notifications/preferences' }
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}
