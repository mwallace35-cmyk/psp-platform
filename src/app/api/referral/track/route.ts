import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { captureError } from '@/lib/error-tracking';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success } = await rateLimit(
    ip,
    100,
    60000,
    "/api/referral/track",
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

    const body = await request.json();
    const { referralCode, eventType = 'click' } = body;

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid referralCode' },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    // Get referral link
    const { data: referralLink, error: fetchError } = await supabase
      .from('referral_links')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (fetchError || !referralLink) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404, headers: { "x-request-id": requestId } }
      );
    }

    // Generate visitor fingerprint from IP + user agent hash
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${ip}${userAgent}`)
      .digest('hex');

    // Create referral event
    const { error: insertError } = await supabase
      .from('referral_events')
      .insert({
        referral_link_id: referralLink.id,
        event_type: eventType,
        visitor_fingerprint: fingerprint,
      });

    if (insertError) {
      captureError(insertError,
        { referralCode, eventType },
        { requestId, path: '/api/referral/track', method: 'POST', endpoint: '/api/referral/track' }
      );
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500, headers: { "x-request-id": requestId } }
      );
    }

    // Increment click count
    const { error: updateError } = await supabase
      .from('referral_links')
      .update({ click_count: referralLink.id + 1 })
      .eq('id', referralLink.id);

    if (updateError) {
      captureError(updateError,
        { referralCode },
        { requestId, path: '/api/referral/track', method: 'POST', endpoint: '/api/referral/track' }
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: { "x-request-id": requestId } }
    );
  } catch (err) {
    captureError(err, { endpoint: '/api/referral/track' },
      { requestId, path: '/api/referral/track', method: 'POST', endpoint: '/api/referral/track' }
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}
