import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchTweetsFromHandles } from '@/lib/twitter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60s max for free tier cron

/**
 * Cron job: Fetch recent tweets from all followed handles
 * Runs every 30 minutes via Vercel Cron
 * Also callable manually for testing
 */
export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Allow if: cron secret matches, or no secret configured (dev), or Vercel cron header present
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = !cronSecret || authHeader === `Bearer ${cronSecret}` || isVercelCron;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check for Twitter bearer token
  if (!process.env.TWITTER_BEARER_TOKEN) {
    return NextResponse.json({
      error: 'TWITTER_BEARER_TOKEN not configured',
      message: 'Add your Twitter API Bearer token to env vars',
    }, { status: 500 });
  }

  try {
    // Use service role for writes (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch all active handles
    const { data: handles, error: handleError } = await supabase
      .from('social_handles')
      .select('*')
      .eq('active', true);

    if (handleError) throw handleError;
    if (!handles || handles.length === 0) {
      return NextResponse.json({ message: 'No active handles to fetch', fetched: 0 });
    }

    // 2. Build sinceIds map (only fetch tweets newer than last fetch)
    const sinceIds: Record<string, string> = {};
    for (const h of handles) {
      if (h.last_tweet_id) {
        sinceIds[h.handle] = h.last_tweet_id;
      }
    }

    // 3. Fetch tweets from Twitter API
    const { tweets, userIdUpdates } = await fetchTweetsFromHandles(
      handles.map(h => ({
        handle: h.handle,
        twitter_user_id: h.twitter_user_id,
        player_name: h.player_name,
      })),
      sinceIds
    );

    // 4. Update twitter_user_ids for any new lookups
    for (const [handle, userId] of Object.entries(userIdUpdates)) {
      await supabase
        .from('social_handles')
        .update({ twitter_user_id: userId, updated_at: new Date().toISOString() })
        .eq('handle', handle);
    }

    // 5. Insert new tweets into social_posts (skip duplicates)
    let inserted = 0;
    for (const tweet of tweets) {
      // Find the handle record for metadata
      const handleRecord = handles.find(
        h => h.handle.replace(/^@/, '').toLowerCase() === tweet.author_handle.replace(/^@/, '').toLowerCase()
      );

      const { error: insertError } = await supabase
        .from('social_posts')
        .upsert(
          {
            platform: 'twitter',
            post_url: tweet.post_url,
            tweet_id: tweet.tweet_id,
            source_handle: `@${tweet.author_handle.replace(/^@/, '')}`,
            player_name: handleRecord?.player_name || null,
            school_name: handleRecord?.school_name || null,
            sport_id: handleRecord?.sport_id || null,
            caption: null,
            active: true,
            pinned: false,
            display_order: 0,
          },
          {
            onConflict: 'tweet_id',
            ignoreDuplicates: true,
          }
        );

      if (!insertError) inserted++;
    }

    // 6. Update last_fetched_at and last_tweet_id for each handle
    for (const h of handles) {
      const handleTweets = tweets
        .filter(t => t.author_handle.replace(/^@/, '').toLowerCase() === h.handle.replace(/^@/, '').toLowerCase())
        .sort((a, b) => b.tweet_id.localeCompare(a.tweet_id)); // highest ID = newest

      const updates: Record<string, unknown> = {
        last_fetched_at: new Date().toISOString(),
      };

      if (handleTweets.length > 0) {
        updates.last_tweet_id = handleTweets[0].tweet_id;
      }

      await supabase
        .from('social_handles')
        .update(updates)
        .eq('id', h.id);
    }

    return NextResponse.json({
      message: `Fetched ${tweets.length} tweets, inserted ${inserted} new`,
      handles: handles.length,
      fetched: tweets.length,
      inserted,
    });
  } catch (err) {
    console.error('Cron fetch-tweets error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch tweets', detail: String(err) },
      { status: 500 }
    );
  }
}
