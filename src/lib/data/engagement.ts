import { createClient } from '@/lib/supabase/server';

export async function getReferralStats(userId: string) {
  const supabase = await createClient();

  const { data: links, error: linksError } = await supabase
    .from('referral_links')
    .select('id, referral_code, created_at, click_count, target_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (linksError) {
    throw new Error(`Failed to fetch referral links: ${linksError.message}`);
  }

  if (!links || links.length === 0) {
    return {
      totalLinks: 0,
      totalClicks: 0,
      links: [],
    };
  }

  return {
    totalLinks: links.length,
    totalClicks: links.reduce((sum, l) => sum + (l.click_count || 0), 0),
    links: links.map(l => ({
      code: l.referral_code,
      url: l.target_url,
      clicks: l.click_count || 0,
      created: l.created_at,
    })),
  };
}

export async function getUserBadges(userId: string) {
  const supabase = await createClient();

  const { data: badges, error } = await supabase
    .from('user_badges')
    .select('badge_type, badge_name, earned_at')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch badges: ${error.message}`);
  }

  return badges || [];
}

export async function getNotificationPreferences(userId: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('notification_prefs')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch notification preferences: ${error.message}`);
  }

  return profile?.notification_prefs || {
    game_alerts: true,
    record_alerts: true,
    potw_results: true,
    weekly_digest: true,
    new_articles: false,
  };
}

export async function getTopReferrers(limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc('get_top_referrers', { limit_count: limit });

  if (error) {
    console.error('Failed to fetch top referrers:', error);
    return [];
  }

  return data || [];
}

export async function trackReferralClick(referralCode: string, eventType = 'click') {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://phillysportspack.com'}/api/referral/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode, eventType }),
    });

    return response.ok;
  } catch (err) {
    console.error('Failed to track referral:', err);
    return false;
  }
}
