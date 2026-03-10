import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
} from "./common";

// ─── GOTW (Game of the Week) ────────────────────────────────────

export interface GotwNominee {
  id: string;
  game_id: string | null;
  home_school_name: string;
  away_school_name: string;
  home_school_id: number | null;
  away_school_id: number | null;
  sport_id: string;
  week_label: string;
  game_date: string | null;
  venue: string | null;
  description: string | null;
  vote_count: number;
  is_winner: boolean;
  created_at: string;
}

export const getGotwNominees = cache(async (weekLabel?: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("gotw_nominees")
            .select("*")
            .order("vote_count", { ascending: false });
          if (weekLabel) {
            query = query.eq("week_label", weekLabel);
          } else {
            // Get current week (most recent)
            const { data: latest } = await supabase
              .from("gotw_nominees")
              .select("week_label")
              .order("created_at", { ascending: false })
              .limit(1)
              .single();
            if (latest) {
              query = query.eq("week_label", latest.week_label);
            }
          }
          const { data } = await query;
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_GOTW_NOMINEES",
    { weekLabel }
  );
});

export const getGotwWinners = cache(async (limit = 10) => {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("gotw_nominees")
        .select("*")
        .eq("is_winner", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      return data ?? [];
    },
    [],
    "DATA_GOTW_WINNERS",
    { limit }
  );
});

// ─── Forum / Trashtalk ──────────────────────────────────────────

export interface ForumPost {
  id: string;
  author_id: string | null;
  author_name: string;
  author_school_flair: string | null;
  title: string;
  body: string;
  category: string;
  sport_id: string | null;
  school_id: number | null;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  like_count: number;
  view_count: number;
  last_reply_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  post_id: string;
  parent_reply_id: string | null;
  author_id: string | null;
  author_name: string;
  author_school_flair: string | null;
  body: string;
  like_count: number;
  created_at: string;
}

export const getForumPosts = cache(async (category?: string, sportId?: string, limit = 25) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("forum_posts")
            .select("*")
            .is("deleted_at", null)
            .order("is_pinned", { ascending: false })
            .order("last_reply_at", { ascending: false, nullsFirst: false })
            .order("created_at", { ascending: false })
            .limit(limit);
          if (category) query = query.eq("category", category);
          if (sportId) query = query.eq("sport_id", sportId);
          const { data } = await query;
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_FORUM_POSTS",
    { category, sportId, limit }
  );
});

export const getForumPost = cache(async (postId: string) => {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("forum_posts")
        .select("*")
        .eq("id", postId)
        .is("deleted_at", null)
        .single();
      return data;
    },
    null,
    "DATA_FORUM_POST",
    { postId }
  );
});

export const getForumReplies = cache(async (postId: string) => {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("forum_replies")
        .select("*")
        .eq("post_id", postId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
    [],
    "DATA_FORUM_REPLIES",
    { postId }
  );
});

export const getForumStats = cache(async () => {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const [posts, replies, trashtalk] = await Promise.all([
        supabase.from("forum_posts").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("forum_replies").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("forum_posts").select("id", { count: "exact", head: true }).eq("category", "trashtalk").is("deleted_at", null),
      ]);
      return {
        totalPosts: posts.count ?? 0,
        totalReplies: replies.count ?? 0,
        trashtalkPosts: trashtalk.count ?? 0,
      };
    },
    { totalPosts: 0, totalReplies: 0, trashtalkPosts: 0 },
    "DATA_FORUM_STATS",
    {}
  );
});

// ─── Power Rankings ─────────────────────────────────────────────

export interface PowerRanking {
  id: string;
  sport_id: string;
  week_label: string;
  school_id: number;
  rank_position: number;
  previous_rank: number | null;
  record_display: string | null;
  blurb: string | null;
  published_at: string;
  schools?: { name: string; slug: string; colors: Record<string, string> | null } | null;
}

export const getPowerRankings = cache(async (sportId: string, weekLabel?: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("power_rankings")
            .select("*, schools(name, slug, colors)")
            .eq("sport_id", sportId)
            .order("rank_position", { ascending: true });

          if (weekLabel) {
            query = query.eq("week_label", weekLabel);
          } else {
            // Get most recent week
            const { data: latest } = await supabase
              .from("power_rankings")
              .select("week_label")
              .eq("sport_id", sportId)
              .order("published_at", { ascending: false })
              .limit(1)
              .single();
            if (latest) {
              query = query.eq("week_label", latest.week_label);
            }
          }
          const { data } = await query;
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_POWER_RANKINGS",
    { sportId, weekLabel }
  );
});

// ─── Transfers ──────────────────────────────────────────────────

export interface Transfer {
  id: string;
  player_id: number | null;
  from_school_id: number | null;
  to_school_id: number | null;
  transfer_year: number | null;
  sport_id: string | null;
  reason: string | null;
  verified: boolean;
  source_url: string | null;
  players?: { name: string; slug: string; graduation_year: number | null; positions: string[] | null } | null;
  from_school?: { name: string; slug: string } | null;
  to_school?: { name: string; slug: string } | null;
}

export const getRecentTransfers = cache(async (limit = 20) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("transfers")
            .select("*, players(name, slug, graduation_year, positions), from_school:schools!transfers_from_school_id_fkey(name, slug), to_school:schools!transfers_to_school_id_fkey(name, slug)")
            .order("transfer_year", { ascending: false })
            .limit(limit);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RECENT_TRANSFERS",
    { limit }
  );
});

// ─── Pulse Hub Stats ────────────────────────────────────────────

export const getPulseStats = cache(async () => {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const [alumni, events, articles, transfers, forumPosts] = await Promise.all([
        supabase.from("next_level_tracking").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }).gte("date", new Date().toISOString()),
        supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("transfers").select("id", { count: "exact", head: true }),
        supabase.from("forum_posts").select("id", { count: "exact", head: true }).is("deleted_at", null),
      ]);
      return {
        alumniTracked: alumni.count ?? 0,
        upcomingEvents: events.count ?? 0,
        articles: articles.count ?? 0,
        transfers: transfers.count ?? 0,
        forumPosts: forumPosts.count ?? 0,
      };
    },
    { alumniTracked: 0, upcomingEvents: 0, articles: 0, transfers: 0, forumPosts: 0 },
    "DATA_PULSE_STATS",
    {}
  );
});
