import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { captureError } from '@/lib/error-tracking';

function generateReferralCode(): string {
  // Generate 8-char alphanumeric code
  return Math.random().toString(36).substring(2, 10).toUpperCase();
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
    "/api/referral/create",
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
    const { targetUrl } = body;

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid targetUrl' },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    // Generate unique referral code
    let code = generateReferralCode();
    let retries = 0;
    while (retries < 5) {
      const { data: existing } = await supabase
        .from('referral_links')
        .select('id')
        .eq('referral_code', code)
        .single();

      if (!existing) {
        break;
      }
      code = generateReferralCode();
      retries++;
    }

    if (retries >= 5) {
      return NextResponse.json(
        { error: 'Failed to generate unique code' },
        { status: 500, headers: { "x-request-id": requestId } }
      );
    }

    // Create referral link
    const { data: referralLink, error: insertError } = await supabase
      .from('referral_links')
      .insert({
        user_id: user.id,
        referral_code: code,
        target_url: targetUrl,
      })
      .select('*')
      .single();

    if (insertError || !referralLink) {
      captureError(insertError || new Error('Failed to create referral link'),
        { userId: user.id, targetUrl },
        { requestId, path: '/api/referral/create', method: 'POST', endpoint: '/api/referral/create' }
      );
      return NextResponse.json(
        { error: 'Failed to create referral link' },
        { status: 500, headers: { "x-request-id": requestId } }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phillysportspack.com';
    const referralUrl = `${siteUrl}${targetUrl}?ref=${code}`;

    return NextResponse.json(
      {
        success: true,
        referralCode: code,
        referralUrl,
        linkId: referralLink.id,
      },
      { headers: { "x-request-id": requestId } }
    );
  } catch (err) {
    captureError(err, { endpoint: '/api/referral/create' },
      { requestId, path: '/api/referral/create', method: 'POST', endpoint: '/api/referral/create' }
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}
