import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserByUsername, getUserTweets } from '@/lib/twitter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BATCH_SIZE = 10; // Process 10 handles per cron run (rotate through all)
const TWEETS_PER_HANDLE = 5;

/**
 * Cron job: Fetch recent tweets from followed handles
 * Runs every 30 minutes via Vercel Cron
 * Processes BATCH_SIZE handles per run, prioritizing least-recently-fetched
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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    // Process handles in parallel (all at once since batch is small)
    const results = await Promise.allSettled(
      handles.map(async (h) => {
        try {
          // Resolve twitter_user_id if needed
          let userId = h.twitter_user_id;
          if (!userId) {
            const user = await getUserByUsername(h.handle);
            if (!user) {
              return { handle: h.handle, tweets: [], userId: null, error: 'User not found' };
            }
            userId = user.id;
            // Save the resolved user ID
            await supabase
              .from('social_handles')
              .update({ twitter_user_id: userId, updated_at: new Date().toISOString() })
              .eq('id', h.id);
          }

          // Fetch tweets
          const sinceId = h.last_tweet_id || undefined;
          const tweets = await getUserTweets(userId, { max: TWEETS_PER_HANDLE, sinceId });

          return { handle: h.handle, handleRecord: h, tweets, userId, error: null };
        } catch (err) {
          return { handle: h.handle, tweets: [], userId: null, error: String(err) };
        }
      })
    );

    // Process results and insert tweets
    for (const result of results) {
      if (result.status === 'rejected') {
        errors.push(String(result.reason));
        continue;
      }

      const { handle, handleRecord, tweets, error } = result.value;

      if (error) {
        errors.push(`${handle}: ${error}`);
      }

      if (tweets.length > 0 && handleRecord) {
        // Batch insert tweets
        const postsToInsert = tweets.map((t: { id: string; text: string; created_at: string }) => ({
          platform: 'twitter' as const,
          post_url: `https://x.com/${handle.replace(/^@/, '')}/status/${t.id}`,
          tweet_id: t.id,
          source_handle: `@${handle.replace(/^@/, '')}`,
          player_name: handleRecord.player_name || null,
          school_name: handleRecord.school_name || null,
          sport_id: handleRecord.sport_id || null,
          caption: null,
          active: true,
          pinned: false,
          display_order: 0,
        }));

        const { error: insertError, count } = await supabase
          .from('social_posts')
          .upsert(postsToInsert, { onConflict: 'tweet_id', ignoreDuplicates: true, count: 'exact' });

        if (!insertError) {
          totalInserted += count || postsToInsert.length;
        }

        totalFetched += tweets.length;

        // Update handle's last_fetched_at and last_tweet_id
        const newestTweetId = tweets
          .map((t: { id: string }) => t.id)
          .sort((a: string, b: string) => b.localeCompare(a))[0];

        await supabase
          .from('social_handles')
          .update({
            last_fetched_at: new Date().toISOString(),
            last_tweet_id: newestTweetId,
          })
          .eq('id', handleRecord.id);
      } else if (handleRecord) {
        // No new tweets, but mark as fetched
        await supabase
          .from('social_handles')
          .update({ last_fetched_at: new Date().toISOString() })
          .eq('id', handleRecord.id);
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
