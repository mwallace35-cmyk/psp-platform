/**
 * Twitter API v2 integration
 * Fetches recent tweets from followed accounts
 * Requires TWITTER_BEARER_TOKEN env var
 */

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
}

interface TwitterUserResponse {
  data?: TwitterUser;
  errors?: { detail: string }[];
}

interface TwitterTimelineResponse {
  data?: TwitterTweet[];
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
  };
  errors?: { detail: string }[];
}

const TWITTER_API_BASE = 'https://api.twitter.com/2';

function getBearer(): string {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) throw new Error('TWITTER_BEARER_TOKEN not configured');
  return token;
}

async function twitterFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${TWITTER_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${getBearer()}`,
    },
    next: { revalidate: 0 }, // No cache for API calls
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Twitter API ${res.status}: ${body}`);
  }

  return res.json();
}

/**
 * Look up a Twitter user by username (handle without @)
 */
export async function getUserByUsername(username: string): Promise<TwitterUser | null> {
  try {
    const clean = username.replace(/^@/, '');
    const data = await twitterFetch<TwitterUserResponse>(
      `/users/by/username/${clean}?user.fields=profile_image_url`
    );
    return data.data || null;
  } catch (err) {
    console.error(`Failed to look up @${username}:`, err);
    return null;
  }
}

/**
 * Fetch recent tweets from a user by their Twitter user ID
 * Returns up to `max` tweets, optionally only those newer than `sinceId`
 */
export async function getUserTweets(
  userId: string,
  options: { max?: number; sinceId?: string } = {}
): Promise<TwitterTweet[]> {
  const { max = 5, sinceId } = options;

  let path = `/users/${userId}/tweets?max_results=${Math.min(max, 100)}&tweet.fields=created_at`;

  // Only fetch tweets newer than what we already have
  if (sinceId) {
    path += `&since_id=${sinceId}`;
  }

  // Exclude replies and retweets — just original tweets
  path += '&exclude=replies,retweets';

  try {
    const data = await twitterFetch<TwitterTimelineResponse>(path);
    return data.data || [];
  } catch (err) {
    console.error(`Failed to fetch tweets for user ${userId}:`, err);
    return [];
  }
}

/**
 * Batch fetch tweets from multiple handles
 * Returns flat array of tweets with handle info attached
 */
export interface FetchedTweet {
  tweet_id: string;
  text: string;
  created_at: string;
  author_handle: string;
  author_name: string;
  post_url: string;
}

export async function fetchTweetsFromHandles(
  handles: { handle: string; twitter_user_id: string | null; player_name: string | null }[],
  sinceIds: Record<string, string> // handle -> last_tweet_id
): Promise<{ tweets: FetchedTweet[]; userIdUpdates: Record<string, string> }> {
  const tweets: FetchedTweet[] = [];
  const userIdUpdates: Record<string, string> = {};

  for (const h of handles) {
    let userId = h.twitter_user_id;

    // If we don't have the Twitter user ID yet, look it up
    if (!userId) {
      const user = await getUserByUsername(h.handle);
      if (!user) continue;
      userId = user.id;
      userIdUpdates[h.handle] = userId;
    }

    // Fetch recent tweets
    const sinceId = sinceIds[h.handle] || undefined;
    const userTweets = await getUserTweets(userId, { max: 5, sinceId });

    for (const t of userTweets) {
      tweets.push({
        tweet_id: t.id,
        text: t.text,
        created_at: t.created_at,
        author_handle: h.handle,
        author_name: h.player_name || h.handle,
        post_url: `https://x.com/${h.handle.replace(/^@/, '')}/status/${t.id}`,
      });
    }
  }

  return { tweets, userIdUpdates };
}
