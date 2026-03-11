import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  type Season,
} from "./common";

/**
 * Pro athlete with school and stats info
 */
export interface ProAthlete {
  id: number;
  person_name: string;
  high_school_id: number | null;
  sport_id: string | null;
  current_level: string; // "college" | "pro" | "coaching" | "staff"
  current_org: string | null;
  current_role: string | null;
  college: string | null;
  college_sport: string | null;
  pro_team: string | null;
  pro_league: string | null; // "NFL" | "NBA" | "MLB" | "WNBA" | "MLS"
  draft_info: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  featured: boolean;
  bio_note: string | null;
  status: string; // "active" | "retired" | "inactive"
  created_at: string;
  updated_at: string;
  schools?: {
    id: number;
    name: string;
    slug: string;
    city?: string;
    state?: string;
  } | null;
}

/**
 * Pro athlete detail page data (includes linked player stats)
 */
export interface ProAthleteDetail extends ProAthlete {
  player?: any; // Linked player record if available
  football_stats?: any[];
  basketball_stats?: any[];
  baseball_stats?: any[];
  awards?: any[];
  game_stats?: any[];
  articles?: any[];
}

/**
 * College placement record
 */
export interface CollegePlacement {
  id: number;
  person_name: string;
  high_school_id: number | null;
  sport_id: string | null;
  college: string | null;
  college_sport: string | null;
  current_level: string;
  status: string;
  schools?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

/**
 * Get all pro athletes with optional filters and pagination
 */
export async function getProAthletes(options: {
  league?: string; // "NFL" | "NBA" | "MLB" | "WNBA"
  sport?: string;
  schoolId?: number;
  status?: string; // "active" | "retired" | "all"
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const {
            league,
            sport,
            schoolId,
            status = "active",
            search,
            page = 1,
            pageSize = 25,
          } = options;

          let query = supabase
            .from("next_level_tracking")
            .select(
              `
              id, person_name, high_school_id, sport_id,
              current_level, current_org, current_role,
              college, college_sport, pro_team, pro_league,
              draft_info, social_twitter, social_instagram,
              featured, bio_note, status, created_at, updated_at,
              schools!next_level_tracking_high_school_id_fkey(id, name, slug, city, state)
            `,
              { count: "exact" }
            )
            .eq("current_level", "pro");

          // Apply filters
          if (league) {
            query = query.eq("pro_league", league.toUpperCase());
          }
          if (sport) {
            query = query.eq("sport_id", sport);
          }
          if (schoolId) {
            query = query.eq("high_school_id", schoolId);
          }
          if (status !== "all") {
            query = query.eq("status", status);
          }
          if (search) {
            query = query.ilike("person_name", `%${search}%`);
          }

          // Apply pagination
          const offset = (page - 1) * pageSize;
          query = query
            .order("pro_league", { ascending: true })
            .order("person_name", { ascending: true })
            .range(offset, offset + pageSize - 1);

          const { data, count, error } = await query;

          if (error) throw error;

          return {
            data: (data ?? []) as unknown as ProAthlete[],
            total: count ?? 0,
            page,
            pageSize,
            hasMore: (count ?? 0) > offset + pageSize,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { data: [], total: 0, page: 1, pageSize: 25, hasMore: false },
    "DATA_PRO_ATHLETES",
    options
  );
}

/**
 * Get single pro athlete by ID (using slug param as ID for now)
 */
export async function getProAthleteBySlug(idOrSlug: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Try to parse as ID first (numeric slug), otherwise query by ID
          const id = parseInt(idOrSlug, 10);
          if (isNaN(id)) {
            return null; // Invalid slug format
          }

          // Fetch pro athlete record
          const { data: proDatum } = await supabase
            .from("next_level_tracking")
            .select(
              `
              id, person_name, high_school_id, sport_id,
              current_level, current_org, current_role,
              college, college_sport, pro_team, pro_league,
              draft_info, social_twitter, social_instagram,
              featured, bio_note, status, created_at, updated_at,
              schools!next_level_tracking_high_school_id_fkey(id, name, slug, city, state, league_id, mascot, colors),
              player_id
            `
            )
            .eq("id", id)
            .single();

          if (!proDatum) return null;

          const athlete = proDatum as any as ProAthleteDetail;

          // If player_id exists, fetch linked player data
          if (proDatum.player_id) {
            const playerId = proDatum.player_id;
            const sport = proDatum.sport_id;

            // Fetch player basic info
            const { data: playerData } = await supabase
              .from("players")
              .select(
                `
                id, name, slug, graduation_year,
                height, weight, positions, bio, photo_url,
                primary_school_id
              `
              )
              .eq("id", playerId)
              .single();

            if (playerData) athlete.player = playerData;

            // Fetch sport-specific player stats
            if (sport === "football") {
              const { data: fbStats } = await supabase
                .from("football_player_seasons")
                .select(
                  `
                  id, season_id, school_id,
                  rush_carries, rush_yards, rush_td,
                  pass_completions, pass_attempts, pass_yards, pass_td, pass_int,
                  rec_catches, rec_yards, rec_td,
                  total_td, games_played,
                  seasons(year_start, year_end, label),
                  schools(name, slug)
                `
                )
                .eq("player_id", playerId)
                .order("seasons(year_start)", { ascending: true });
              if (fbStats) athlete.football_stats = fbStats;
            } else if (sport === "basketball") {
              const { data: bbStats } = await supabase
                .from("basketball_player_seasons")
                .select(
                  `
                  id, season_id, school_id,
                  games_played, points, rebounds, assists, steals, blocks,
                  seasons(year_start, year_end, label),
                  schools(name, slug)
                `
                )
                .eq("player_id", playerId)
                .order("seasons(year_start)", { ascending: true });
              if (bbStats) athlete.basketball_stats = bbStats;
            } else if (sport === "baseball") {
              const { data: baseStats } = await supabase
                .from("baseball_player_seasons")
                .select(
                  `
                  id, season_id, school_id,
                  games_played, stats,
                  seasons(year_start, year_end, label),
                  schools(name, slug)
                `
                )
                .eq("player_id", playerId)
                .order("seasons(year_start)", { ascending: true });
              if (baseStats) athlete.baseball_stats = baseStats;
            }

            // Fetch awards
            const { data: awardData } = await supabase
              .from("awards")
              .select("id, award_type, award_tier, award_year, description")
              .eq("player_id", playerId)
              .order("award_year", { ascending: false });
            if (awardData) athlete.awards = awardData;

            // Fetch game player stats (top performances)
            const { data: gameStats } = await supabase
              .from("game_player_stats")
              .select(
                `
                id, game_id, rush_yards, pass_yards, rec_yards, points,
                games(game_date, home_score, away_score, home_school_id, away_school_id,
                  home_school:schools!games_home_school_id_fkey(name),
                  away_school:schools!games_away_school_id_fkey(name)
                )
              `
              )
              .eq("player_id", playerId)
              .order("games(game_date)", { ascending: false })
              .limit(10);
            if (gameStats) athlete.game_stats = gameStats;

            // Fetch related articles
            const { data: mentions } = await supabase
              .from("article_mentions")
              .select(
                `
                articles(id, slug, title, excerpt, featured_image_url,
                  published_at, sport_id, created_at)
              `
              )
              .eq("player_id", playerId)
              .order("articles(published_at)", { ascending: false })
              .limit(5);
            if (mentions) {
              athlete.articles = mentions
                .map((m: any) => m.articles)
                .filter(Boolean);
            }
          }

          return athlete;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_PRO_ATHLETE_BY_SLUG",
    { idOrSlug }
  );
}

/**
 * Get all pro athletes from a specific school
 */
export async function getProAthletesBySchool(schoolId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("next_level_tracking")
            .select(
              `
              id, person_name, sport_id,
              pro_team, pro_league, draft_info, current_level,
              status, college
            `
            )
            .eq("high_school_id", schoolId)
            .eq("current_level", "pro")
            .eq("status", "active")
            .order("pro_league", { ascending: true })
            .order("person_name", { ascending: true });

          return (data ?? []) as unknown as ProAthlete[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_PRO_ATHLETES_BY_SCHOOL",
    { schoolId }
  );
}

/**
 * Get pro athletes grouped by league
 */
export async function getProAthletesByLeague(league: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("next_level_tracking")
            .select(
              `
              id, person_name, high_school_id, sport_id,
              pro_team, pro_league, draft_info, current_level, status,
              schools!next_level_tracking_high_school_id_fkey(name, slug)
            `
            )
            .eq("pro_league", league.toUpperCase())
            .eq("current_level", "pro")
            .eq("status", "active")
            .order("pro_team", { ascending: true })
            .order("person_name", { ascending: true });

          return (data ?? []) as unknown as ProAthlete[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_PRO_ATHLETES_BY_LEAGUE",
    { league }
  );
}

/**
 * Get featured pro athletes for homepage/sidebar
 */
export async function getFeaturedProAthletes(limit = 6) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("next_level_tracking")
            .select(
              `
              id, person_name, high_school_id, sport_id,
              pro_team, pro_league, draft_info, bio_note,
              schools!next_level_tracking_high_school_id_fkey(name, slug)
            `
            )
            .eq("featured", true)
            .eq("current_level", "pro")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(limit);

          return (data ?? []) as unknown as ProAthlete[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_FEATURED_PRO_ATHLETES",
    { limit }
  );
}

/**
 * Get college placements with optional filters
 */
export async function getCollegePlacements(options: {
  school?: string;
  sport?: string;
  college?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { school, sport, college, page = 1, pageSize = 25 } = options;

          let query = supabase
            .from("next_level_tracking")
            .select(
              `
              id, person_name, high_school_id, sport_id,
              college, college_sport, current_level, status,
              schools!next_level_tracking_high_school_id_fkey(id, name, slug)
            `,
              { count: "exact" }
            )
            .eq("current_level", "college")
            .eq("status", "active");

          if (sport) {
            query = query.eq("sport_id", sport);
          }
          if (college) {
            query = query.ilike("college", `%${college}%`);
          }
          if (school) {
            query = query.ilike("schools.name", `%${school}%`);
          }

          const offset = (page - 1) * pageSize;
          query = query
            .order("college", { ascending: true })
            .order("person_name", { ascending: true })
            .range(offset, offset + pageSize - 1);

          const { data, count, error } = await query;

          if (error) throw error;

          return {
            data: (data ?? []) as unknown as CollegePlacement[],
            total: count ?? 0,
            page,
            pageSize,
            hasMore: (count ?? 0) > offset + pageSize,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { data: [], total: 0, page: 1, pageSize: 25, hasMore: false },
    "DATA_COLLEGE_PLACEMENTS",
    options
  );
}

/**
 * Get pro athlete stats summary
 */
export async function getProAthleteStats() {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const [nflRes, nbaRes, mlbRes, wnbaRes, totalRes] =
            await Promise.all([
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("pro_league", "NFL")
                .eq("current_level", "pro"),
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("pro_league", "NBA")
                .eq("current_level", "pro"),
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("pro_league", "MLB")
                .eq("current_level", "pro"),
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("pro_league", "WNBA")
                .eq("current_level", "pro"),
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("current_level", "pro"),
            ]);

          return {
            nfl: nflRes.count ?? 0,
            nba: nbaRes.count ?? 0,
            mlb: mlbRes.count ?? 0,
            wnba: wnbaRes.count ?? 0,
            total: totalRes.count ?? 0,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { nfl: 0, nba: 0, mlb: 0, wnba: 0, total: 0 },
    "DATA_PRO_ATHLETE_STATS",
    {}
  );
}
