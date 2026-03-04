import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new Resend(key);
}

const FROM_EMAIL = 'PhillySportsPack <noreply@phillysportspack.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phillysportspack.com';

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${SITE_URL}/api/email/confirm?token=${token}`;

  const { data, error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Confirm your PhillySportsPack newsletter subscription',
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0a1628; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #f0a500; font-size: 28px; margin: 0; font-family: 'Barlow Condensed', Impact, sans-serif; letter-spacing: 2px;">
            PHILLYSPORTSPACK
          </h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0a1628; font-size: 20px; margin-top: 0;">Confirm your subscription</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thanks for signing up for the PhillySportsPack newsletter! Click the button below to confirm your email and start receiving weekly updates on Philly high school sports.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background: #f0a500; color: #0a1628; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Confirm Subscription
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">
            If you didn't sign up for this newsletter, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  if (error) throw error;
  return data;
}

export async function sendWeeklyDigest(
  email: string,
  unsubscribeToken: string,
  articles: Array<{ title: string; slug: string; excerpt: string; sport_id: string }>,
  potwWinner: { player_name: string; school_name: string; vote_count: number } | null
) {
  const unsubscribeUrl = `${SITE_URL}/api/email/unsubscribe?token=${unsubscribeToken}`;

  const articleHtml = articles
    .map(
      (a) => `
      <div style="margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;">
        <a href="${SITE_URL}/articles/${a.slug}" style="color: #0a1628; font-weight: 600; text-decoration: none; font-size: 16px;">
          ${a.title}
        </a>
        <p style="color: #6b7280; font-size: 14px; margin: 6px 0 0;">${a.excerpt || ''}</p>
      </div>
    `
    )
    .join('');

  const potwHtml = potwWinner
    ? `
      <div style="background: #fef3c7; border: 2px solid #f0a500; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <h3 style="color: #0a1628; margin: 0 0 8px;">Player of the Week</h3>
        <p style="font-size: 20px; font-weight: bold; color: #0a1628; margin: 0;">${potwWinner.player_name}</p>
        <p style="color: #4b5563; margin: 4px 0 0;">${potwWinner.school_name} — ${potwWinner.vote_count} votes</p>
      </div>
    `
    : '';

  const { data, error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `PSP Weekly: ${articles.length > 0 ? articles[0].title : 'This Week in Philly HS Sports'}`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0a1628; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #f0a500; font-size: 28px; margin: 0; letter-spacing: 2px;">PSP WEEKLY</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Your Week in Philly High School Sports</p>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          ${potwHtml}
          <h2 style="color: #0a1628; font-size: 18px; margin-top: 24px;">Latest Articles</h2>
          ${articleHtml || '<p style="color: #9ca3af;">No new articles this week.</p>'}
          <div style="text-align: center; margin-top: 24px;">
            <a href="${SITE_URL}" style="color: #f0a500; font-weight: bold; text-decoration: none;">Visit PhillySportsPack.com →</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 11px; text-align: center;">
            <a href="${unsubscribeUrl}" style="color: #9ca3af;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  });

  if (error) throw error;
  return data;
}

export async function sendPotwAnnouncement(
  email: string,
  unsubscribeToken: string,
  winner: { player_name: string; school_name: string; sport_name: string; vote_count: number }
) {
  const unsubscribeUrl = `${SITE_URL}/api/email/unsubscribe?token=${unsubscribeToken}`;

  const { data, error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `PSP Player of the Week: ${winner.player_name}`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0a1628; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #f0a500; font-size: 28px; margin: 0; letter-spacing: 2px;">PLAYER OF THE WEEK</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
          <div style="font-size: 48px; margin: 20px 0;">🏆</div>
          <h2 style="color: #0a1628; font-size: 28px; margin: 0;">${winner.player_name}</h2>
          <p style="color: #4b5563; font-size: 16px; margin: 8px 0;">${winner.school_name} — ${winner.sport_name}</p>
          <p style="color: #f0a500; font-weight: bold; font-size: 18px;">${winner.vote_count} votes</p>
          <div style="margin-top: 24px;">
            <a href="${SITE_URL}/potw" style="background: #f0a500; color: #0a1628; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              See Full Results
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 11px;">
            <a href="${unsubscribeUrl}" style="color: #9ca3af;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  });

  if (error) throw error;
  return data;
}
