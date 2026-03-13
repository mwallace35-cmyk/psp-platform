import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserByUsername, getUserTweets } from '@/lib/twitter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BATCH_SIZE = 10;
const TWEETS_PER_HANDLE = 5;

/**
 * Cron job: Fetch recent tweets from followed handles
 * Runs every 30 minutes via Vercel Cron
 * Processes BATCH_SIZE handles per run, prioritizing least-recently-fetched
 * Uses anon key + SECURITY DEFINER RPCs (no service role key needed)
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = !cronSecret || authHeader === `Bearer ${cronSecret}` || isVercelCron;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.TWITTER_BEARER_TOKEN) {
    return NextResponse.json({
      error: 'TWITTER_BEARER_TOKEN not configured',
      message: 'Add your Twitter API Bearer token to env vars',
    }, { status: 500 });
  }

  try {
    // Use anon key — writes go through SECURITY DEFINER RPC functions
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active handles, prioritize least-recently-fetched (nulls first)
    const { data: handles, error: handleError } = await supabase
      .from('social_handles')
      .select('*')
      .eq('active', true)
      .order('last_fetched_at', { ascending: true, nullsFirst: true })
      .limit(BATCH_SIZE);

    if (handleError) throw handleError;
    if (!handles || handles.length === 0) {
      return NextResponse.json({ message: 'No active handles to fetch', fetched: 0 });
    }

    let totalFetched = 0;
    let totalInserted = 0;
    const errors: string[] = [];

    // Process handles in parallel
    const results = await Promise.allSettled(
      handles.map(async (h) => {
        try {
          let userId = h.twitter_user_id;
          if (!userId) {
            const user = await getUserByUsername(h.handle);
            if (!user) {
              return { handle: h.handle, handleRecord: h, tweets: [], userId: null, error: 'User not found on Twitter' };
            }
            userId = user.id;
          }

          const sinceId = h.last_tweet_id || undefined;
          const tweets = await getUserTweets(userId, { max: TWEETS_PER_HANDLE, sinceId });

          return { handle: h.handle, handleRecord: h, tweets, userId, error: null };
        } catch (err) {
          return { handle: h.handle, handleRecord: h, tweets: [], userId: null, error: String(err) };
        }
      })
    );

    // Process results — insert tweets via RPC, update handles via RPC
    for (const result of results) {
      if (result.status === 'rejected') {
        errors.push(String(result.reason));
        continue;
      }

      const { handle, handleRecord, tweets, userId, error } = result.value;

      if (error) {
        errors.push(`${handle}: ${error}`);
      }

      // Insert each tweet via SECURITY DEFINER RPC
      if (tweets.length > 0) {
        for (const t of tweets) {
          const { error: rpcErr } = await supabase.rpc('upsert_social_post', {
            p_platform: 'twitter',
            p_post_url: `https://x.com/${handle.replace(/^@/, '')}/status/${t.id}`,
            p_tweet_id: t.id,
            p_source_handle: `@${handle.replace(/^@/, '')}`,
            p_player_name: handleRecord?.player_name || null,
            p_school_name: handleRecord?.school_name || null,
            p_sport_id: handleRecord?.sport_id || null,
          });
          if (!rpcErr) totalInserted++;
        }
        totalFetched += tweets.length;
      }

      // Update handle metadata via SECURITY DEFINER RPC
      if (handleRecord) {
        const newestTweetId = tweets.length > 0
          ? tweets.map((t: { id: string }) => t.id).sort((a: string, b: string) => b.localeCompare(a))[0]
          : null;

        await supabase.rpc('update_social_handle_fetch', {
          p_handle_id: handleRecord.id,
          p_twitter_user_id: userId || null,
          p_last_tweet_id: newestTweetId,
        });
      }
    }

    return NextResponse.json({
      message: `Batch complete: ${totalFetched} tweets fetched, ${totalInserted} inserted`,
      batch_size: handles.length,
      fetched: totalFetched,
      inserted: totalInserted,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Cron fetch-tweets error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch tweets', detail: String(err) },
      { status: 500 }
    );
  }
}
