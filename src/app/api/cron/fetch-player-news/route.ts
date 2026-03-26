import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const RSS_BASE = 'https://news.google.com/rss/search';
const MAX_AGE_DAYS = 7;
const FETCH_DELAY_MS = 1000; // 1s between RSS fetches to be polite

interface RSSItem {
  title: string;
  link: string;
  source: string | null;
  pubDate: string | null;
}

/**
 * Parse Google News RSS XML into structured items.
 * Uses regex parsing to avoid needing an XML library.
 */
function parseRSSItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
    const linkMatch = block.match(/<link>(.*?)<\/link>|<link\/>\s*(https?:\/\/[^\s<]+)/);
    const sourceMatch = block.match(/<source[^>]*>(.*?)<\/source>|<source[^>]*><!\[CDATA\[(.*?)\]\]><\/source>/);
    const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);

    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
    const link = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';

    if (!title || !link) continue;

    items.push({
      title,
      link,
      source: sourceMatch ? (sourceMatch[1] || sourceMatch[2] || '').trim() : null,
      pubDate: pubDateMatch ? pubDateMatch[1].trim() : null,
    });
  }

  return items;
}

/**
 * Build a Google News RSS search URL for a player + sport.
 */
function buildRSSUrl(playerName: string, sport: string): string {
  const q = `"${playerName}" ${sport}`;
  return `${RSS_BASE}?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
}

/**
 * Sleep helper for rate limiting.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cron job: Fetch Google News RSS for top 20 pro athletes
 * Runs daily via Vercel Cron
 * Upserts news items into player_news_cache, dedupes by player_id + url
 * Cleans up items older than 7 days
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = !cronSecret || authHeader === `Bearer ${cronSecret}` || isVercelCron;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      || 'https://uxshabfmgjsykurzvkcr.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get top 20 pro athletes
    const { data: athletes, error: athleteError } = await supabase
      .from('next_level_tracking')
      .select('player_id, person_name, sport')
      .eq('current_level', 'pro')
      .in('pro_league', ['NFL', 'NBA', 'MLB'])
      .order('id', { ascending: false })
      .limit(20);

    if (athleteError) throw athleteError;
    if (!athletes || athletes.length === 0) {
      return NextResponse.json({ message: 'No pro athletes found', fetched: 0 });
    }

    let totalInserted = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < athletes.length; i++) {
      const athlete = athletes[i];
      const sportTerm = athlete.sport || 'sports';

      try {
        const rssUrl = buildRSSUrl(athlete.person_name, sportTerm);
        const response = await fetch(rssUrl, {
          headers: {
            'User-Agent': 'PhillySportsPack/1.0 (news aggregator)',
          },
        });

        if (!response.ok) {
          errors.push(`${athlete.person_name}: HTTP ${response.status}`);
          if (i < athletes.length - 1) await sleep(FETCH_DELAY_MS);
          continue;
        }

        const xml = await response.text();
        const items = parseRSSItems(xml);

        // Upsert each news item
        for (const item of items.slice(0, 10)) {
          const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : null;

          const { error: upsertError } = await supabase
            .from('player_news_cache')
            .upsert(
              {
                player_id: athlete.player_id,
                player_name: athlete.person_name,
                title: item.title.slice(0, 500),
                url: item.link.slice(0, 2000),
                source: item.source?.slice(0, 200) || null,
                published_at: publishedAt,
                fetched_at: new Date().toISOString(),
              },
              { onConflict: 'player_id,url' }
            );

          if (upsertError) {
            totalSkipped++;
          } else {
            totalInserted++;
          }
        }
      } catch (err) {
        errors.push(`${athlete.person_name}: ${String(err)}`);
      }

      // Rate limit: wait between fetches (skip after last)
      if (i < athletes.length - 1) {
        await sleep(FETCH_DELAY_MS);
      }
    }

    // Clean up old items (older than 7 days)
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS);
    const { error: deleteError } = await supabase
      .from('player_news_cache')
      .delete()
      .lt('fetched_at', cutoff.toISOString());

    if (deleteError) {
      errors.push(`Cleanup error: ${deleteError.message}`);
    }

    return NextResponse.json({
      message: `Fetched news for ${athletes.length} athletes`,
      athletes_processed: athletes.length,
      items_upserted: totalInserted,
      items_skipped: totalSkipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Cron fetch-player-news error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch player news', detail: String(err) },
      { status: 500 }
    );
  }
}
