import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { captureError } from '@/lib/error-tracking';
import { generateWeeklyDigestData, renderWeeklyDigestHTML } from '@/lib/email-templates/weekly-digest';

const FROM_EMAIL = 'PhillySportsPack <noreply@phillysportspack.com>';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || randomUUID();

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 503, headers: { "x-request-id": requestId } }
    );
  }

  // Verify request is authorized (from cron job or admin)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { "x-request-id": requestId } }
    );
  }

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success } = await rateLimit(
    ip,
    1,
    3600000, // 1 per hour
    "/api/email/weekly-digest",
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

    // Get all email subscribers with weekly digest enabled
    const { data: subscribers, error: fetchError } = await supabase
      .from('email_subscribers')
      .select('id, email')
      .eq('active', true);

    if (fetchError) {
      captureError(fetchError,
        { endpoint: '/api/email/weekly-digest' },
        { requestId, path: '/api/email/weekly-digest', method: 'POST', endpoint: '/api/email/weekly-digest' }
      );
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500, headers: { "x-request-id": requestId } }
      );
    }

    const users = subscribers || [];
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const userEmail = user.email;
      if (!userEmail) continue;

      try {
        // Generate personalized digest - use email as identifier since we may not have user_id
        const digestData = await generateWeeklyDigestData(userEmail);

        // Generate unsubscribe token
        const unsubscribeToken = randomUUID();

        // Render HTML
        const html = renderWeeklyDigestHTML(digestData, unsubscribeToken);

        // Send email - import Resend here to avoid build-time instantiation
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error: sendError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: userEmail,
          subject: 'PSP Weekly: Your Roundup of Philly HS Sports',
          html,
        });

        if (!sendError) {
          sent++;

          // Log send
          await supabase.from('email_logs').insert({
            email: userEmail,
            template: 'weekly_digest',
            sent_at: new Date().toISOString(),
          });
        } else {
          failed++;
          captureError(sendError,
            { email: userEmail },
            { requestId, path: '/api/email/weekly-digest', method: 'POST', endpoint: '/api/email/weekly-digest' }
          );
        }
      } catch (err) {
        failed++;
        captureError(err,
          { email: userEmail },
          { requestId, path: '/api/email/weekly-digest', method: 'POST', endpoint: '/api/email/weekly-digest' }
        );
      }
    }

    return NextResponse.json(
      { success: true, sent, failed, total: users.length },
      { headers: { "x-request-id": requestId } }
    );
  } catch (err) {
    captureError(err, { endpoint: '/api/email/weekly-digest' },
      { requestId, path: '/api/email/weekly-digest', method: 'POST', endpoint: '/api/email/weekly-digest' }
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}
