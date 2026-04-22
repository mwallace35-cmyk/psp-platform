import { cache } from "react";
import { createClient, withErrorHandling, withRetry } from "./common";

// ============================================================================
// ARCHIVE STORIES — Ted Silary editorial corpus + other bylines
// (Huck, Amauro, Duck, Sparky, Frog, Kevin, Pulse, Booch, Crispy, Nick, Mac)
// Full text hosted by Mike with Ted's written permission (2026-04-20).
// ============================================================================

export interface ArchiveStory {
  id: number;
  year: number;
  sport_id: string;
  category: string;
  column_name: string | null;
  byline: string | null;
  month_tag: string | null;
  title: string;
  slug: string;
  archive_version: string;
  archive_path: string;
  archive_sha256: string;
  original_url: string | null;
  published_at: string | null;
  body_html: string;
  body_text: string;
  word_count: number | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface ArchiveStoryMention {
  id: number;
  story_id: number;
  entity_type: "player" | "school" | "coach" | "game";
  entity_id: number;
  snippet: string;
  body_offset: number | null;
  confidence: number;
  match_source: string;
  raw_mention: string | null;
  mention_date: string | null;
  player_name?: string | null;
  player_slug?: string | null;
  school_name?: string | null;
  school_slug?: string | null;
  coach_name?: string | null;
  coach_slug?: string | null;
}

/**
 * Fetch a single archive story by (year, slug). Returns null if not found.
 */
export const getArchiveStoryBySlug = cache(
  async (year: number, slug: string): Promise<ArchiveStory | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await (supabase as any)
              .from("archive_stories")
              .select("*")
              .eq("year", year)
              .eq("slug", slug)
              .single();
            return (data as unknown as ArchiveStory | null) ?? null;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      "DATA_ARCHIVE_STORY_BY_SLUG",
      { year, slug }
    );
  }
);

/**
 * Fetch mentions for a given story, joined to the mentioned entity's display name.
 * Returns only mentions with confidence ≥ minConfidence (default 70).
 */
export const getStoryMentions = cache(
  async (storyId: number, minConfidence = 70): Promise<ArchiveStoryMention[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await (supabase as any)
              .from("archive_story_mentions")
              .select(
                `id, story_id, entity_type, entity_id, snippet, body_offset,
                 confidence, match_source, raw_mention, mention_date`
              )
              .eq("story_id", storyId)
              .gte("confidence", minConfidence)
              .order("body_offset", { ascending: true });
            const rows = (data as unknown as ArchiveStoryMention[]) ?? [];
            if (rows.length === 0) return [];

            // Resolve display names in bulk per entity_type
            const playerIds = rows.filter(r => r.entity_type === "player").map(r => r.entity_id);
            const schoolIds = rows.filter(r => r.entity_type === "school").map(r => r.entity_id);
            const coachIds  = rows.filter(r => r.entity_type === "coach").map(r => r.entity_id);

            const playerMap = new Map<number, { name: string; slug: string }>();
            if (playerIds.length > 0) {
              const { data: p } = await supabase
                .from("players")
                .select("id, name, slug")
                .in("id", Array.from(new Set(playerIds)));
              for (const row of (p as unknown as { id: number; name: string; slug: string }[] ?? [])) {
                playerMap.set(row.id, { name: row.name, slug: row.slug });
              }
            }
            const schoolMap = new Map<number, { name: string; slug: string }>();
            if (schoolIds.length > 0) {
              const { data: s } = await supabase
                .from("school_names")
                .select("id, name, slug")
                .in("id", Array.from(new Set(schoolIds)));
              for (const row of (s as unknown as { id: number; name: string; slug: string }[] ?? [])) {
                schoolMap.set(row.id, { name: row.name, slug: row.slug });
              }
            }
            const coachMap = new Map<number, { name: string; slug: string }>();
            if (coachIds.length > 0) {
              const { data: c } = await supabase
                .from("coaches")
                .select("id, name, slug")
                .in("id", Array.from(new Set(coachIds)));
              for (const row of (c as unknown as { id: number; name: string; slug: string }[] ?? [])) {
                coachMap.set(row.id, { name: row.name, slug: row.slug });
              }
            }

            return rows.map(r => {
              if (r.entity_type === "player") {
                const p = playerMap.get(r.entity_id);
                return { ...r, player_name: p?.name ?? null, player_slug: p?.slug ?? null };
              }
              if (r.entity_type === "school") {
                const s = schoolMap.get(r.entity_id);
                return { ...r, school_name: s?.name ?? null, school_slug: s?.slug ?? null };
              }
              if (r.entity_type === "coach") {
                const c = coachMap.get(r.entity_id);
                return { ...r, coach_name: c?.name ?? null, coach_slug: c?.slug ?? null };
              }
              return r;
            });
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_STORY_MENTIONS",
      { storyId, minConfidence }
    );
  }
);

export interface StoryCardSummary {
  id: number;
  year: number;
  sport_id: string | null;
  slug: string;
  title: string;
  column_name: string | null;
  byline: string | null;
  published_at: string | null;
  word_count: number | null;
  category: string;
  series_name?: string | null;
}

/**
 * List archive stories for browse pages. Supports filtering by year, sport,
 * byline, and category. Sorted newest first.
 */
export const listArchiveStories = cache(
  async (
    opts: {
      year?: number;
      sport?: string;
      byline?: string;
      category?: string;
      series?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<StoryCardSummary[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let q = (supabase as any)
              .from("archive_stories")
              .select(
                "id, year, sport_id, slug, title, column_name, byline, published_at, word_count, category, series_name"
              )
              .order("year", { ascending: false })
              .order("published_at", { ascending: false, nullsFirst: false })
              .order("id", { ascending: true })
              .limit(opts.limit ?? 60)
              .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 60) - 1);
            if (opts.year) q = q.eq("year", opts.year);
            if (opts.sport) q = q.eq("sport_id", opts.sport);
            if (opts.byline) q = q.eq("byline", opts.byline);
            if (opts.category) q = q.eq("category", opts.category);
            if (opts.series) q = q.eq("series_name", opts.series);
            const { data } = await q;
            return (data as unknown as StoryCardSummary[]) ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_LIST_ARCHIVE_STORIES",
      { ...opts } as Record<string, unknown>
    );
  }
);

/**
 * Distinct series names with counts — powers the /stories Series filter pill.
 */
export interface SeriesCount { series: string; count: number; }
export const getArchiveSeries = cache(
  async (): Promise<SeriesCount[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("archive_stories")
          .select("series_name")
          .not("series_name", "is", null);
        const counts = new Map<string, number>();
        for (const row of (data as unknown as { series_name: string }[] ?? [])) {
          if (row.series_name) counts.set(row.series_name, (counts.get(row.series_name) ?? 0) + 1);
        }
        return Array.from(counts.entries())
          .map(([series, count]) => ({ series, count }))
          .sort((a, b) => b.count - a.count);
      },
      [],
      "DATA_ARCHIVE_SERIES"
    );
  }
);

/**
 * Browse index: distinct bylines + story counts for sidebar / filter UI.
 */
export interface BylineCount { byline: string; count: number; }
export const getArchiveBylines = cache(
  async (sport?: string): Promise<BylineCount[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let q = (supabase as any)
          .from("archive_stories")
          .select("byline")
          .not("byline", "is", null);
        if (sport) q = q.eq("sport_id", sport);
        const { data } = await q;
        const counts = new Map<string, number>();
        for (const row of (data as unknown as { byline: string | null }[] ?? [])) {
          if (row.byline) counts.set(row.byline, (counts.get(row.byline) ?? 0) + 1);
        }
        return Array.from(counts.entries())
          .map(([byline, count]) => ({ byline, count }))
          .sort((a, b) => b.count - a.count);
      },
      [],
      "DATA_ARCHIVE_BYLINES",
      { sport }
    );
  }
);

/**
 * For a player: fetch stories that mention them (as a list of cards).
 * Sorted by mention confidence, then year desc.
 */
export interface PlayerMentionCard {
  story_id: number;
  year: number;
  slug: string;
  title: string;
  column_name: string | null;
  byline: string | null;
  published_at: string | null;
  snippet: string;
  confidence: number;
  mention_date: string | null;
}
/**
 * For a school: fetch stories that mention them (as a list of cards).
 * Sorted by year desc, then confidence desc.
 */
export interface SchoolMentionCard {
  story_id: number;
  year: number;
  slug: string;
  title: string;
  column_name: string | null;
  byline: string | null;
  published_at: string | null;
  snippet: string;
  confidence: number;
  mention_date: string | null;
}
export const getSchoolMentionStories = cache(
  async (schoolId: number, limit = 12): Promise<SchoolMentionCard[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("archive_story_mentions")
          .select(
            `story_id, snippet, confidence, mention_date,
             archive_stories!inner(id, year, slug, title, column_name, byline, published_at)`
          )
          .eq("entity_type", "school")
          .eq("entity_id", schoolId)
          .gte("confidence", 70)
          .order("mention_date", { ascending: false, nullsFirst: false })
          .order("confidence", { ascending: false })
          .limit(limit * 3); // over-fetch because we need to dedupe stories
        const rows = (data as unknown as {
          story_id: number;
          snippet: string;
          confidence: number;
          mention_date: string | null;
          archive_stories: {
            id: number; year: number; slug: string; title: string;
            column_name: string | null; byline: string | null; published_at: string | null;
          } | Array<{
            id: number; year: number; slug: string; title: string;
            column_name: string | null; byline: string | null; published_at: string | null;
          }>;
        }[] ?? []);
        // Dedupe by story_id — keep the highest-confidence mention per story
        const seen = new Map<number, SchoolMentionCard>();
        for (const r of rows) {
          if (seen.has(r.story_id)) continue;
          const s = Array.isArray(r.archive_stories) ? r.archive_stories[0] : r.archive_stories;
          seen.set(r.story_id, {
            story_id: r.story_id,
            year: s?.year ?? 0,
            slug: s?.slug ?? "",
            title: s?.title ?? "",
            column_name: s?.column_name ?? null,
            byline: s?.byline ?? null,
            published_at: s?.published_at ?? null,
            snippet: r.snippet,
            confidence: r.confidence,
            mention_date: r.mention_date,
          });
        }
        return Array.from(seen.values())
          .sort((a, b) => (b.year - a.year) || (b.confidence - a.confidence))
          .slice(0, limit);
      },
      [],
      "DATA_SCHOOL_MENTION_STORIES",
      { schoolId, limit }
    );
  }
);

/**
 * For a specific game: find archive stories that most likely cover it.
 * Heuristic:
 *   1. Fetch stories mentioning home school, and stories mentioning away school.
 *   2. Intersect on story_id (both schools must appear in the same story).
 *   3. Score each candidate by:
 *      - date proximity to the game (|mention_date - game_date| ≤ 14 days is strong)
 *      - year match with story's year
 *      - sum of confidences on both sides
 *   4. Return top N with story metadata.
 *
 * Returns empty array if either side has no mentions, or no intersection.
 */
export interface GameStoryMatch {
  story_id: number;
  year: number;
  slug: string;
  title: string;
  column_name: string | null;
  byline: string | null;
  published_at: string | null;
  snippet: string;
  score: number;
  days_off: number | null;
  home_confidence: number;
  away_confidence: number;
}
export const getGameStories = cache(
  async (
    homeSchoolId: number,
    awaySchoolId: number,
    gameDate: string | null,
    seasonYear: number,
    limit = 3
  ): Promise<GameStoryMatch[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;

        type Row = {
          story_id: number;
          mention_date: string | null;
          confidence: number;
          snippet: string;
        };

        const [homeRes, awayRes] = await Promise.all([
          client
            .from("archive_story_mentions")
            .select("story_id, mention_date, confidence, snippet")
            .eq("entity_type", "school")
            .eq("entity_id", homeSchoolId)
            .gte("confidence", 60),
          client
            .from("archive_story_mentions")
            .select("story_id, mention_date, confidence, snippet")
            .eq("entity_type", "school")
            .eq("entity_id", awaySchoolId)
            .gte("confidence", 60),
        ]);

        const homeRows = (homeRes.data as Row[] | null) ?? [];
        const awayRows = (awayRes.data as Row[] | null) ?? [];
        if (homeRows.length === 0 || awayRows.length === 0) return [];

        // Best confidence + mention_date per (story_id, side)
        const bestBySide = (rows: Row[]): Map<number, Row> => {
          const m = new Map<number, Row>();
          for (const r of rows) {
            const existing = m.get(r.story_id);
            if (!existing || r.confidence > existing.confidence) m.set(r.story_id, r);
          }
          return m;
        };
        const homeMap = bestBySide(homeRows);
        const awayMap = bestBySide(awayRows);

        // Intersect
        const candidates: Array<{
          story_id: number;
          home: Row;
          away: Row;
        }> = [];
        for (const [story_id, home] of homeMap) {
          const away = awayMap.get(story_id);
          if (away) candidates.push({ story_id, home, away });
        }
        if (candidates.length === 0) return [];

        // Fetch story metadata in bulk
        const storyIds = candidates.map((c) => c.story_id);
        const { data: storyData } = await client
          .from("archive_stories")
          .select("id, year, slug, title, column_name, byline, published_at")
          .in("id", storyIds);
        const stories = new Map<number, {
          id: number; year: number; slug: string; title: string;
          column_name: string | null; byline: string | null; published_at: string | null;
        }>();
        for (const s of (storyData as unknown as {
          id: number; year: number; slug: string; title: string;
          column_name: string | null; byline: string | null; published_at: string | null;
        }[] ?? [])) {
          stories.set(s.id, s);
        }

        const gameEpoch = gameDate ? new Date(gameDate + "T12:00:00").getTime() : null;
        const DAY_MS = 86_400_000;

        // Score each candidate
        const scored: GameStoryMatch[] = candidates
          .map((c) => {
            const s = stories.get(c.story_id);
            if (!s) return null;

            // Year filter — story must be from same year as the game (strict)
            if (s.year !== seasonYear) return null;

            // Distance to the game date (use mention_date first, else story.published_at)
            let daysOff: number | null = null;
            if (gameEpoch !== null) {
              const mentionDate = c.home.mention_date ?? c.away.mention_date;
              const refDate = mentionDate ?? s.published_at;
              if (refDate) {
                const ref = new Date(refDate + "T12:00:00").getTime();
                daysOff = Math.abs(ref - gameEpoch) / DAY_MS;
              }
            }

            // Scoring:
            //   +100 if within 2 days
            //   +60  if within 7 days
            //   +25  if within 21 days
            //   +(home_conf + away_conf)/2   base confidence signal
            let score = (c.home.confidence + c.away.confidence) / 2;
            if (daysOff !== null) {
              if (daysOff <= 2) score += 100;
              else if (daysOff <= 7) score += 60;
              else if (daysOff <= 21) score += 25;
              else if (daysOff <= 60) score += 5;
            }

            // Pick the snippet from the side with the higher confidence
            const snippet = c.home.confidence >= c.away.confidence ? c.home.snippet : c.away.snippet;

            return {
              story_id: c.story_id,
              year: s.year,
              slug: s.slug,
              title: s.title,
              column_name: s.column_name,
              byline: s.byline,
              published_at: s.published_at,
              snippet,
              score,
              days_off: daysOff,
              home_confidence: c.home.confidence,
              away_confidence: c.away.confidence,
            } as GameStoryMatch;
          })
          .filter((x): x is GameStoryMatch => x !== null)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);

        return scored;
      },
      [],
      "DATA_GAME_STORIES",
      { homeSchoolId, awaySchoolId, gameDate, seasonYear, limit }
    );
  }
);

export const getPlayerMentionStories = cache(
  async (playerId: number, limit = 12): Promise<PlayerMentionCard[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("archive_story_mentions")
          .select(
            `story_id, snippet, confidence, mention_date,
             archive_stories!inner(id, year, slug, title, column_name, byline, published_at)`
          )
          .eq("entity_type", "player")
          .eq("entity_id", playerId)
          .gte("confidence", 70)
          .order("confidence", { ascending: false })
          .order("mention_date", { ascending: false, nullsFirst: false })
          .limit(limit * 5); // over-fetch; recurring columns (On the Trail) produce many mentions per story
        const rows = (data as unknown as {
          story_id: number;
          snippet: string;
          confidence: number;
          mention_date: string | null;
          archive_stories: {
            id: number; year: number; slug: string; title: string;
            column_name: string | null; byline: string | null; published_at: string | null;
          } | Array<{
            id: number; year: number; slug: string; title: string;
            column_name: string | null; byline: string | null; published_at: string | null;
          }>;
        }[] ?? []);
        // Dedupe by story_id — keep the highest-confidence mention per story
        const seen = new Map<number, PlayerMentionCard>();
        for (const r of rows) {
          const s = Array.isArray(r.archive_stories) ? r.archive_stories[0] : r.archive_stories;
          const existing = seen.get(r.story_id);
          if (existing && existing.confidence >= r.confidence) continue;
          seen.set(r.story_id, {
            story_id: r.story_id,
            year: s?.year ?? 0,
            slug: s?.slug ?? "",
            title: s?.title ?? "",
            column_name: s?.column_name ?? null,
            byline: s?.byline ?? null,
            published_at: s?.published_at ?? null,
            snippet: r.snippet,
            confidence: r.confidence,
            mention_date: r.mention_date,
          });
        }
        return Array.from(seen.values())
          .sort((a, b) => {
            // Prefer newer year, then higher confidence
            if (b.year !== a.year) return b.year - a.year;
            return b.confidence - a.confidence;
          })
          .slice(0, limit);
      },
      [],
      "DATA_PLAYER_MENTION_STORIES",
      { playerId, limit }
    );
  }
);
