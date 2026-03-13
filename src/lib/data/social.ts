import { createStaticClient } from '@/lib/supabase/static';

export interface SocialPost {
  id: number;
  platform: 'twitter' | 'instagram';
  post_url: string;
  tweet_id: string | null;
  source_handle: string | null;
  player_name: string | null;
  school_name: string | null;
  sport_id: string | null;
  caption: string | null;
  pinned: boolean;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialHandle {
  id: number;
  platform: string;
  handle: string;
  twitter_user_id: string | null;
  player_name: string | null;
  school_name: string | null;
  school_id: number | null;
  sport_id: string | null;
  active: boolean;
  last_fetched_at: string | null;
  last_tweet_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Extract tweet ID from a Twitter/X URL
 * Supports: twitter.com/user/status/123, x.com/user/status/123
 */
export function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Get active social posts for display (pinned first, then by order/date)
 */
export async function getSocialFeedPosts(limit = 10): Promise<SocialPost[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('active', true)
    .order('pinned', { ascending: false })
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching social posts:', error);
    return [];
  }

  return (data || []) as SocialPost[];
}

/**
 * Get all social posts for admin (including inactive)
 */
export async function getAllSocialPosts(): Promise<SocialPost[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .order('pinned', { ascending: false })
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all social posts:', error);
    return [];
  }

  return (data || []) as SocialPost[];
}

/* ────── Handle Management ────── */

/**
 * Get all active social handles (for public display / feed)
 */
export async function getSocialHandles(): Promise<SocialHandle[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('social_handles')
    .select('*')
    .eq('active', true)
    .order('player_name', { ascending: true });

  if (error) {
    console.error('Error fetching social handles:', error);
    return [];
  }

  return (data || []) as SocialHandle[];
}

/**
 * Get all social handles for admin (including inactive)
 */
export async function getAllSocialHandles(): Promise<SocialHandle[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('social_handles')
    .select('*')
    .order('active', { ascending: false })
    .order('player_name', { ascending: true });

  if (error) {
    console.error('Error fetching all social handles:', error);
    return [];
  }

  return (data || []) as SocialHandle[];
}
