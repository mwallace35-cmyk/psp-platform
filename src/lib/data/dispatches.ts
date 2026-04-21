import { cache } from "react";
import { createClient, withErrorHandling, withRetry } from "./common";

// ============================================================================
// ARCHIVE DISPATCHES — date-addressable entries extracted from Ted's homepage
// (archive_stories.id = 1941, the 2011-2013 homepage alert feed)
// ============================================================================

export interface ArchiveDispatch {
  id: number;
  story_id: number;
  sequence: number;
  dispatch_date: string | null;   // ISO YYYY-MM-DD
  raw_date_header: string;
  body_offset: number;
  body_length: number;
  body_text: string;
  title: string | null;
  category: string | null;        // commit / memoriam / record / tedbit / scrimmage / coaching / tournament / game_report / other
  word_count: number;
}

export interface DispatchFilter {
  category?: string;
  year?: number;
  month?: number;
  limit?: number;
  offset?: number;
}

/**
 * List dispatches with filters. Ordered by date DESC.
 * Undated dispatches are listed LAST (sequence preserved).
 */
export const listDispatches = cache(
  async (opts: DispatchFilter = {}): Promise<ArchiveDispatch[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let q = (supabase as any)
              .from("archive_dispatches")
              .select("id, story_id, sequence, dispatch_date, raw_date_header, body_offset, body_length, body_text, title, category, word_count")
              .order("dispatch_date", { ascending: false, nullsFirst: false })
              .order("sequence", { ascending: true })
              .limit(opts.limit ?? 50)
              .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 50) - 1);
            if (opts.category) q = q.eq("category", opts.category);
            if (opts.year) {
              q = q.gte("dispatch_date", `${opts.year}-01-01`)
                   .lte("dispatch_date", `${opts.year}-12-31`);
            }
            if (opts.month && opts.year) {
              const mm = String(opts.month).padStart(2, "0");
              const lastDay = new Date(opts.year, opts.month, 0).getDate();
              q = q.gte("dispatch_date", `${opts.year}-${mm}-01`)
                   .lte("dispatch_date", `${opts.year}-${mm}-${lastDay}`);
            }
            const { data } = await q;
            return (data as unknown as ArchiveDispatch[]) ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_LIST_DISPATCHES",
      { ...opts } as Record<string, unknown>
    );
  }
);


/**
 * Distinct dispatch years (with counts) — powers the year-filter sidebar.
 */
export interface DispatchYearCount { year: number; count: number; }
export const getDispatchYears = cache(
  async (): Promise<DispatchYearCount[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("archive_dispatches")
          .select("dispatch_date")
          .not("dispatch_date", "is", null);
        const counts = new Map<number, number>();
        for (const row of (data as unknown as { dispatch_date: string }[] ?? [])) {
          const yr = Number(row.dispatch_date.slice(0, 4));
          if (Number.isFinite(yr)) counts.set(yr, (counts.get(yr) ?? 0) + 1);
        }
        return Array.from(counts.entries())
          .map(([year, count]) => ({ year, count }))
          .sort((a, b) => b.year - a.year);
      },
      [],
      "DATA_DISPATCH_YEARS"
    );
  }
);


/**
 * Category counts for the category pill filter.
 */
export interface DispatchCategoryCount { category: string; count: number; }
export const getDispatchCategories = cache(
  async (): Promise<DispatchCategoryCount[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("archive_dispatches")
          .select("category")
          .not("category", "is", null);
        const counts = new Map<string, number>();
        for (const row of (data as unknown as { category: string }[] ?? [])) {
          counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
        }
        return Array.from(counts.entries())
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);
      },
      [],
      "DATA_DISPATCH_CATEGORIES"
    );
  }
);


/**
 * For a player: fetch dispatches that mention them.
 * Joins through archive_story_mentions.dispatch_id.
 */
export interface PlayerDispatchCard {
  dispatch_id: number;
  dispatch_date: string | null;
  category: string | null;
  title: string | null;
  body_preview: string;   // first ~200 chars
  story_id: number;
  story_slug: string | null;
  story_year: number;
  confidence: number;
}
export const getPlayerDispatches = cache(
  async (playerId: number, limit = 10): Promise<PlayerDispatchCard[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("archive_story_mentions")
          .select(
            `dispatch_id, confidence,
             archive_dispatches!inner(id, dispatch_date, category, title, body_text,
               archive_stories!inner(id, year, slug))`
          )
          .eq("entity_type", "player")
          .eq("entity_id", playerId)
          .not("dispatch_id", "is", null)
          .gte("confidence", 70)
          .order("confidence", { ascending: false })
          .limit(limit * 3);

        const rows = (data as unknown as Array<{
          dispatch_id: number;
          confidence: number;
          archive_dispatches: {
            id: number;
            dispatch_date: string | null;
            category: string | null;
            title: string | null;
            body_text: string;
            archive_stories: { id: number; year: number; slug: string | null } |
                             Array<{ id: number; year: number; slug: string | null }>;
          } | Array<{
            id: number;
            dispatch_date: string | null;
            category: string | null;
            title: string | null;
            body_text: string;
            archive_stories: { id: number; year: number; slug: string | null } |
                             Array<{ id: number; year: number; slug: string | null }>;
          }>;
        }> ?? []);

        // Dedupe by dispatch_id — keep highest-confidence mention per dispatch
        const seen = new Map<number, PlayerDispatchCard>();
        for (const r of rows) {
          const d = Array.isArray(r.archive_dispatches) ? r.archive_dispatches[0] : r.archive_dispatches;
          if (!d) continue;
          const s = Array.isArray(d.archive_stories) ? d.archive_stories[0] : d.archive_stories;
          const existing = seen.get(r.dispatch_id);
          if (existing && existing.confidence >= r.confidence) continue;
          seen.set(r.dispatch_id, {
            dispatch_id: r.dispatch_id,
            dispatch_date: d.dispatch_date,
            category: d.category,
            title: d.title,
            body_preview: (d.body_text ?? "").slice(0, 240).replace(/\s+/g, " ").trim(),
            story_id: s?.id ?? 0,
            story_slug: s?.slug ?? null,
            story_year: s?.year ?? 0,
            confidence: r.confidence,
          });
        }
        return Array.from(seen.values())
          .sort((a, b) => {
            // Dated first, most recent first
            if (a.dispatch_date && !b.dispatch_date) return -1;
            if (!a.dispatch_date && b.dispatch_date) return 1;
            if (a.dispatch_date && b.dispatch_date) return b.dispatch_date.localeCompare(a.dispatch_date);
            return b.confidence - a.confidence;
          })
          .slice(0, limit);
      },
      [],
      "DATA_PLAYER_DISPATCHES",
      { playerId, limit }
    );
  }
);


/**
 * For a player: fetch recruiting commits attached to them (if any).
 */
export interface RecruitingCommit {
  id: number;
  destination_college: string;
  sport: string | null;
  position: string | null;
  class_year: string | null;
  commit_date: string | null;
  season_year: number | null;
  snippet: string;
  confidence: number;
  dispatch_id: number | null;
}
export const getPlayerRecruitingCommits = cache(
  async (playerId: number): Promise<RecruitingCommit[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("recruiting_commits")
          .select("id, destination_college, sport, position, class_year, commit_date, season_year, snippet, confidence, dispatch_id")
          .eq("player_id", playerId)
          .order("commit_date", { ascending: false, nullsFirst: false });
        return (data as unknown as RecruitingCommit[]) ?? [];
      },
      [],
      "DATA_PLAYER_RECRUITING_COMMITS",
      { playerId }
    );
  }
);
