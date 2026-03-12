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
    "/api/referral/stats",
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

    // Get all referral links for user
    const { data: referralLinks, error: fetchError } = await supabase
      .from('referral_links')
      .select('id, referral_code, created_at, click_count, target_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      captureError(fetchError,
        { userId: user.id },
        { requestId, path: '/api/referral/stats', method: 'GET', endpoint: '/api/referral/stats' }
      );
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500, headers: { "x-request-id": requestId } }
      );
    }

    // Get referral event counts
    const linkIds = referralLinks?.map(l => l.id) || [];
    let eventCounts: Record<string, Record<string, number>> = {};

    if (linkIds.length > 0) {
      const { data: events, error: eventsError } = await supabase
        .from('referral_events')
        .select('referral_link_id, event_type')
        .in('referral_link_id', linkIds);

      if (eventsError) {
        captureError(eventsError,
          { userId: user.id },
          { requestId, path: '/api/referral/stats', method: 'GET', endpoint: '/api/referral/stats' }
        );
      } else if (events) {
        eventCounts = {};
        for (const event of events) {
          const linkId = String(event.referral_link_id);
          if (!eventCounts[linkId]) {
            eventCounts[linkId] = {};
          }
          eventCounts[linkId][event.event_type] = (eventCounts[linkId][event.event_type] || 0) + 1;
        }
      }
    }

    // Calculate badge eligibility
    const totalClicks = referralLinks?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0;
    const signupCount = Object.values(eventCounts).reduce(
      (sum, counts) => sum + (counts['signup'] || 0),
      0
    );

    const badges = [];
    if (totalClicks >= 10) {
      badges.push({
        type: 'top_scout',
        name: 'Top Scout',
        description: '10+ referral clicks',
        unlocked: true,
      });
    }
    if (signupCount >= 5) {
      badges.push({
        type: 'connector',
        name: 'Connector',
        description: '5+ successful referral signups',
        unlocked: true,
      });
    }

    const stats = {
      totalClicks,
      totalSignups: signupCount,
      referralCount: referralLinks?.length || 0,
      badges,
      referralLinks: referralLinks?.map(link => ({
        code: link.referral_code,
        targetUrl: link.target_url,
        clicks: link.click_count || 0,
        events: eventCounts[String(link.id)] || {},
        createdAt: link.created_at,
      })) || [],
    };

    return NextResponse.json(stats, { headers: { "x-request-id": requestId } });
  } catch (err) {
    captureError(err, { endpoint: '/api/referral/stats' },
      { requestId, path: '/api/referral/stats', method: 'GET', endpoint: '/api/referral/stats' }
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}
