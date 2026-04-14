import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  School,
  type Season,
} from "./common";
import { getCurrentSeasonLabel } from "@/lib/sports";
import { isBasketballSport, getBasketballGender } from "./utils";

// ─── Local row shapes for Supabase query results ─────────────────────────────

type NamedRef = { name?: string | null; slug?: string | null } | null | undefined;

interface TeamSeasonRow {
  id?: number;
  sport_id: string;
  wins?: number | null;
  losses?: number | null;
  ties?: number | null;
  playoff_result?: string | null;
  sports?: { name?: string | null } | null;
  seasons?: { label?: string | null; year_start?: number | null } | null;
}

interface ChampRow {
  id?: number;
  level?: string | null;
  sport_id: string;
  school_id?: number;
  score?: string | null;
  seasons?: { year_start?: number | null; label?: string | null } | null;
  sports?: { name?: string | null } | null;
  leagues?: { name?: string | null } | null;
}

interface PlayerIdRow {
  player_id: number;
  sport_id?: string;
}

interface ArticleMentionRow {
  articles: unknown;
}

interface CoachingStintRow {
  id: number;
  sport_id: string;
  start_year: number;
  end_year: number | null;
  role: string | null;
  record_wins: number | null;
  record_losses: number | null;
  record_ties: number | null;
  championships: number | null;
  coaches?: { id?: number | null; name?: string | null; slug?: string | null } | null;
  sports?: { name?: string | null } | null;
}

interface AwardRow {
  id: number;
  award_name: string | null;
  sport_id: string | null;
  tier: string | null;
  player_name: string | null;
  players?: { name?: string | null; slug?: string | null } | null;
  seasons?: { label?: string | null; year_start?: number | null } | null;
}

interface GameRow {
  id: number;
  sport_id: string;
  game_date: string | null;
  home_school_id: number;
  away_school_id: number;
  home_score: number | null;
  away_score: number | null;
  home_school?: NamedRef;
  away_school?: NamedRef;
  seasons?: { label?: string | null } | null;
}

interface SchoolListRow {
  id: number;
  slug: string;
  name: string;
  city?: string | null;
  state?: string | null;
  league_id?: number | null;
  leagues?: { id?: number; name?: string | null; short_name?: string | null } | null;
}

interface SchoolIdRef {
  school_id: number;
}

interface UpcomingGameRow {
  id: number;
  sport_id: string;
  game_date: string;
  home_school_id: number;
  away_school_id: number;
  home_school?: NamedRef;
  away_school?: NamedRef;
}

interface NextGameInfo {
  game_date: string;
  opponent_name: string;
  opponent_slug: string;
  is_home: boolean;
}

interface RosterRow {
  player_id: number;
  games_played?: number | null;
  total_yards?: number | null;
  points?: number | null;
  hits?: number | null;
  player?: {
    id?: number;
    slug?: string | null;
    name?: string | null;
    positions?: string[] | null;
    graduation_year?: number | null;
    height?: string | null;
    weight?: number | null;
  } | null;
}

interface StatLeaderRow {
  player_id: number;
  games_played: number | null;
  player?: { name?: string | null; slug?: string | null } | null;
  [column: string]: unknown;
}

interface BoxStatRow {
  game_id: number;
  rush_yards?: number | null;
  rush_td?: number | null;
  pass_yards?: number | null;
  pass_td?: number | null;
  rec_yards?: number | null;
  rec_td?: number | null;
  total_td?: number | null;
  points?: number | null;
  rebounds?: number | null;
  assists?: number | null;
  steals?: number | null;
  player?: { name?: string | null; slug?: string | null } | null;
}

interface RecordRow {
  id: number;
  category: string;
  subcategory: string | null;
  scope: string | null;
  record_value: string | null;
  record_number: number | null;
  holder_name: string | null;
  year_set: number | null;
  description: string | null;
  sport_id: string | null;
  players?: { name?: string | null; slug?: string | null } | null;
  sports?: { name?: string | null } | null;
  seasons?: { label?: string | null } | null;
}

// Minimal Supabase query-builder shape used where generated table types are
// absent (database.types.ts remains disabled — see src/lib/supabase/static.ts).
// This intentionally models only the subset of the PostgREST builder used in
// this file and returns `Promise<{ data: unknown }>` at await time so callers
// must narrow `data` themselves.
interface DynamicQueryBuilder
  extends PromiseLike<{ data: unknown; error: unknown }> {
  select: (cols: string) => DynamicQueryBuilder;
  eq: (col: string, val: unknown) => DynamicQueryBuilder;
  in: (col: string, vals: unknown[]) => DynamicQueryBuilder;
  not: (col: string, op: string, val: unknown) => DynamicQueryBuilder;
  order: (col: string, opts?: { ascending?: boolean }) => DynamicQueryBuilder;
  limit: (n: number) => DynamicQueryBuilder;
}
type DynamicSupabaseClient = {
  from: (table: string) => DynamicQueryBuilder;
};

/**
 * School hub data with ALL relations (league, colors, contact info, etc.)
 */
export interface SchoolHubData extends School {
  address?: string;
  phone?: string;
  principal?: string;
  athletic_director?: string;
  enrollment?: number;
  piaa_class?: string;
  school_type?: string;
  colors?: Record<string, string> | null;
}

/**
 * Sport stats for a school
 */
export interface SchoolSportStats {
  sport_id: string;
  sport_name: string;
  sport_emoji: string;
  wins: number;
  losses: number;
  ties: number;
  championship_count: number;
  season_count: number;
  player_count: number;
}

/**
 * Next level athlete
 */
export interface NextLevelAthlete {
  id: number;
  person_name: string;
  current_level: string; // "college" | "professional"
  college?: string;
  pro_team?: string;
  pro_league?: string;
  draft_info?: string;
  status?: string;
  sport_id?: string;
}

/**
 * Championship with related data
 */
export interface SchoolChampionshipData {
  id: number;
  level: string;
  year: number;
  sport_id: string;
  sport_name: string;
  season_label: string;
  league_name?: string;
  score?: string;
}

/**
 * Recent season summary
 */
export interface RecentSeasonData {
  id: number;
  sport_id: string;
  sport_name: string;
  season_label: string;
  wins: number;
  losses: number;
  ties?: number;
  playoff_result?: string;
}

/**
 * Get school hub data with all relations
 */
export const getSchoolHubData = cache(async (slug: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("schools")
            .select(
              `
              id, slug, name, short_name, city, state, league_id, mascot,
              closed_year, founded_year, website_url, address, phone,
              principal, athletic_director, enrollment, piaa_class,
              school_type, colors, logo_url,
              leagues(name, short_name)
            `
            )
            .eq("slug", slug)
            .is("deleted_at", null)
            .single();
          // Handle leagues array which might be single object or array
          const schoolData = data as (SchoolHubData & { leagues?: unknown }) | null;
          if (schoolData && Array.isArray(schoolData.leagues) && schoolData.leagues.length > 0) {
            schoolData.leagues = schoolData.leagues[0];
          }
          return schoolData as SchoolHubData;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_SCHOOL_HUB_DATA",
    { slug }
  );
});

/**
 * Get all sports stats for a school
 * Returns one entry per sport the school competes in
 * OPTIMIZED: Runs all queries in parallel using Promise.all()
 */
export const getSchoolAllSportsStats = cache(async (schoolId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Run all queries in parallel (batched queries)
          const [
            { data: teamSeasonData },
            { data: champData },
            { data: fbPlayers },
            { data: bbPlayers },
            { data: baseballPlayers },
          ] = await Promise.all([
            // 1. Team seasons with sport info
            supabase
              .from("team_seasons")
              .select("id, sport_id, wins, losses, ties, sports(id, name)")
              .eq("school_id", schoolId),
            // 2. Championships grouped by sport
            supabase
              .from("championships")
              .select("sport_id")
              .eq("school_id", schoolId),
            // 3. Football player seasons (select only player_id for efficiency)
            supabase
              .from("football_player_seasons")
              .select("player_id")
              .eq("school_id", schoolId),
            // 4. Basketball player seasons
            supabase
              .from("basketball_player_seasons")
              .select("player_id")
              .eq("school_id", schoolId),
            // 5. Baseball player seasons
            supabase
              .from("baseball_player_seasons")
              .select("player_id")
              .eq("school_id", schoolId),
          ]);

          if (!teamSeasonData || teamSeasonData.length === 0) {
            return [];
          }

          // Aggregate team_season stats by sport
          const sportMap = new Map<string, { wins: number; losses: number; ties: number }>();
          const sportNameMap = new Map<string, string>();

          (teamSeasonData as TeamSeasonRow[]).forEach((ts) => {
            const sportId = ts.sport_id;
            if (!sportMap.has(sportId)) {
              sportMap.set(sportId, { wins: 0, losses: 0, ties: 0 });
              // Store sport name for later use
              if (ts.sports?.name) {
                sportNameMap.set(sportId, ts.sports.name);
              }
            }
            const stats = sportMap.get(sportId)!;
            stats.wins += ts.wins ?? 0;
            stats.losses += ts.losses ?? 0;
            stats.ties += ts.ties ?? 0;
          });

          // Count championships by sport
          const champCountBySport = new Map<string, number>();
          (champData as { sport_id: string }[] | null)?.forEach((c) => {
            champCountBySport.set(c.sport_id, (champCountBySport.get(c.sport_id) ?? 0) + 1);
          });

          // Count unique players by sport
          const playerCountBySport = new Map<string, Set<number>>();

          // Major sports (football, basketball, baseball)
          (
            [
              { sport: "football", data: fbPlayers as PlayerIdRow[] | null },
              { sport: "basketball", data: bbPlayers as PlayerIdRow[] | null },
              { sport: "baseball", data: baseballPlayers as PlayerIdRow[] | null },
            ] as const
          ).forEach(({ sport, data: players }) => {
            const uniqueIds = new Set<number>();
            (players ?? []).forEach((p) => uniqueIds.add(p.player_id));
            playerCountBySport.set(sport, uniqueIds);
          });

          // Sport emoji mapping
          const SPORT_EMOJI: Record<string, string> = {
            football: "🏈",
            basketball: "🏀",
            baseball: "⚾",
            "track-field": "🏃",
            lacrosse: "🥍",
            wrestling: "🤼",
            soccer: "⚽",
          };

          // Sport order for sorting
          const SPORT_ORDER: Record<string, number> = {
            football: 0,
            basketball: 1,
            baseball: 2,
            soccer: 3,
            lacrosse: 4,
            "track-field": 5,
            "cross-country": 6,
            wrestling: 7,
          };

          // Get unique sports from team_seasons and build result
          const typedTeamSeasons = teamSeasonData as TeamSeasonRow[];
          const uniqueSports = Array.from(
            new Map(typedTeamSeasons.map((ts) => [ts.sport_id, ts])).values()
          );

          const result: SchoolSportStats[] = uniqueSports.map((ts) => {
            const sportId = ts.sport_id;
            const stats = sportMap.get(sportId)!;
            const champCount = champCountBySport.get(sportId) ?? 0;
            const seasonCount = typedTeamSeasons.filter((tsd) => tsd.sport_id === sportId).length;
            const playerCount = playerCountBySport.get(sportId)?.size ?? 0;

            return {
              sport_id: sportId,
              sport_name: sportNameMap.get(sportId) ?? ts.sports?.name ?? sportId,
              sport_emoji: SPORT_EMOJI[sportId] ?? "⚽",
              wins: stats.wins,
              losses: stats.losses,
              ties: stats.ties,
              championship_count: champCount,
              season_count: seasonCount,
              player_count: playerCount,
            };
          });

          // Sort by sport order, then by season count
          return result.sort((a, b) => {
            const orderA = SPORT_ORDER[a.sport_id] ?? 99;
            const orderB = SPORT_ORDER[b.sport_id] ?? 99;
            if (orderA !== orderB) return orderA - orderB;
            return b.season_count - a.season_count;
          });
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_ALL_SPORTS_STATS",
    { schoolId }
  );
});


/**
 * Get next level athletes from a school
 */
export const getSchoolNextLevel = cache(async (schoolId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("next_level_tracking")
            .select("id, person_name, current_level, college, pro_team, pro_league, draft_info, status, sport_id")
            .eq("high_school_id", schoolId)
            .order("pro_league", { ascending: false, nullsFirst: true })
            .order("college", { ascending: true, nullsFirst: true });

          return (data ?? []) as NextLevelAthlete[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_NEXT_LEVEL",
    { schoolId }
  );
});

/**
 * Get all championships for a school across all sports
 */
export const getSchoolAllChampionships = cache(async (schoolId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("championships")
            .select(
              `
              id, level, sport_id,
              seasons(year_start, label),
              sports(name),
              leagues(name)
            `
            )
            .eq("school_id", schoolId)
            .order("created_at", { ascending: false })
            .limit(500);

          if (!data) return [];

          // Sort by year descending
          const sorted = (data as ChampRow[]).sort((a, b) => {
            const aYear = a.seasons?.year_start ?? 0;
            const bYear = b.seasons?.year_start ?? 0;
            return bYear - aYear;
          });

          return sorted.map((c) => ({
            id: c.id ?? 0,
            level: c.level ?? "",
            year: c.seasons?.year_start ?? 0,
            sport_id: c.sport_id,
            sport_name: c.sports?.name ?? "Unknown",
            season_label: c.seasons?.label ?? "Unknown",
            league_name: c.leagues?.name ?? undefined,
            score: c.score ?? undefined,
          })) as SchoolChampionshipData[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_ALL_CHAMPIONSHIPS",
    { schoolId }
  );
});

/**
 * Get recent team seasons across all sports
 */
export const getSchoolRecentSeasons = cache(async (schoolId: number, limit = 20) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select(
              `
              id, sport_id, wins, losses, ties, playoff_result,
              seasons(label, year_start),
              sports(name)
            `
            )
            .eq("school_id", schoolId)
            .limit(limit);

          if (!data) return [];

          const SEASON_SPORT_ORDER: Record<string, number> = {
            football: 0, basketball: 1, baseball: 2, soccer: 3,
            lacrosse: 4, "track-field": 5, "cross-country": 6, wrestling: 7,
          };
          return (data as TeamSeasonRow[])
            .sort((a, b) => {
              const yearDiff = (b.seasons?.year_start ?? 0) - (a.seasons?.year_start ?? 0);
              if (yearDiff !== 0) return yearDiff;
              return (SEASON_SPORT_ORDER[a.sport_id] ?? 99) - (SEASON_SPORT_ORDER[b.sport_id] ?? 99);
            })
            .map((ts) => ({
              id: ts.id ?? 0,
              sport_id: ts.sport_id,
              sport_name: ts.sports?.name ?? "Unknown",
              season_label: ts.seasons?.label ?? "Unknown",
              wins: ts.wins ?? 0,
              losses: ts.losses ?? 0,
              ties: ts.ties ?? 0,
              playoff_result: ts.playoff_result ?? undefined,
            })) as RecentSeasonData[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_RECENT_SEASONS",
    { schoolId, limit }
  );
});

/**
 * Get articles mentioning this school
 */
export const getSchoolArticles = cache(async (schoolId: number, limit = 10) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("article_mentions")
            .select("articles(id, slug, title, excerpt, sport_id, published_at, featured_image_url)", { count: "exact" })
            .eq("entity_type", "school")
            .eq("entity_id", schoolId)
            .eq("articles.status", "published")
            .is("articles.deleted_at", null)
            .order("articles(published_at)", { ascending: false })
            .limit(limit);

          if (!data?.length) return [];

          // Extract articles from mentions and filter nulls
          return (data as ArticleMentionRow[])
            .map((m) => m.articles)
            .filter(Boolean)
            .slice(0, limit);
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_ARTICLES",
    { schoolId, limit }
  );
});

/**
 * Coach at a school
 */
export interface SchoolCoach {
  id: number;
  name: string;
  slug: string;
  sport_id: string;
  sport_name: string;
  start_year: number;
  end_year: number | null;
  role: string;
  record_wins: number;
  record_losses: number;
  record_ties: number;
  championships: number;
}

/**
 * Award for a school player
 */
export interface SchoolAward {
  id: number;
  player_name: string;
  player_slug: string | null;
  award_name: string;
  sport_id: string;
  year: number;
  season_label: string;
  tier: string | null;
}

/**
 * Recent game result
 */
export interface SchoolGame {
  id: number;
  sport_id: string;
  game_date: string | null;
  season_label: string;
  home_school_id: number;
  home_school_name: string;
  home_school_slug: string;
  away_school_id: number;
  away_school_name: string;
  away_school_slug: string;
  home_score: number | null;
  away_score: number | null;
}

/**
 * Get coaches who coached at this school
 */
export const getSchoolCoaches = cache(async (schoolId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("coaching_stints")
            .select(
              `
              id, sport_id, start_year, end_year, role,
              record_wins, record_losses, record_ties, championships,
              coaches(id, name, slug),
              sports(name)
            `
            )
            .eq("school_id", schoolId)
            .order("start_year", { ascending: false })
            .limit(50);

          if (!data) return [];

          return (data as CoachingStintRow[]).map((stint) => ({
            id: stint.coaches?.id ?? stint.id,
            name: stint.coaches?.name ?? "Unknown",
            slug: stint.coaches?.slug ?? "",
            sport_id: stint.sport_id,
            sport_name: stint.sports?.name ?? stint.sport_id,
            start_year: stint.start_year,
            end_year: stint.end_year,
            role: stint.role ?? "Head Coach",
            record_wins: stint.record_wins ?? 0,
            record_losses: stint.record_losses ?? 0,
            record_ties: stint.record_ties ?? 0,
            championships: stint.championships ?? 0,
          })) as SchoolCoach[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_COACHES",
    { schoolId }
  );
});

/**
 * Get awards for players at this school (All-City, POY, etc.)
 */
export const getSchoolAwards = cache(async (schoolId: number, limit = 30) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("awards")
            .select(
              `
              id, award_name, sport_id, tier, player_name,
              players(name, slug),
              seasons(label, year_start)
            `
            )
            .eq("school_id", schoolId)
            .order("created_at", { ascending: false })
            .limit(limit);

          if (!data) return [];

          return (data as AwardRow[])
            .sort((a, b) => (b.seasons?.year_start ?? 0) - (a.seasons?.year_start ?? 0))
            .map((a) => ({
              id: a.id,
              player_name: a.players?.name ?? a.player_name ?? "Unknown",
              player_slug: a.players?.slug ?? null,
              award_name: a.award_name ?? "Award",
              sport_id: a.sport_id ?? "football",
              year: a.seasons?.year_start ?? 0,
              season_label: a.seasons?.label ?? "Unknown",
              tier: a.tier,
            })) as SchoolAward[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_AWARDS",
    { schoolId, limit }
  );
});

/**
 * Get recent games for a school (across all sports)
 */
export const getSchoolRecentGames = cache(async (schoolId: number, limit = 15) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("games")
            .select(
              `
              id, sport_id, game_date, home_score, away_score,
              home_school_id, away_school_id,
              home_school:school_names!home_school_id(id, name, slug),
              away_school:school_names!away_school_id(id, name, slug),
              seasons(label)
            `
            )
            .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
            .not("home_score", "is", null)
            .not("away_score", "is", null)
            .order("game_date", { ascending: false })
            .limit(limit);

          if (!data) return [];

          return (data as GameRow[])
            .filter((g) => {
              // Filter out games where opponent name is missing
              const hasHome = g.home_school?.name;
              const hasAway = g.away_school?.name;
              return hasHome && hasAway;
            })
            .map((g) => ({
              id: g.id,
              sport_id: g.sport_id,
              game_date: g.game_date,
              season_label: g.seasons?.label ?? "",
              home_school_id: g.home_school_id,
              home_school_name: g.home_school?.name ?? "Unknown",
              home_school_slug: g.home_school?.slug ?? "",
              away_school_id: g.away_school_id,
              away_school_name: g.away_school?.name ?? "Unknown",
              away_school_slug: g.away_school?.slug ?? "",
              home_score: g.home_score,
              away_score: g.away_score,
            })) as SchoolGame[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_RECENT_GAMES",
    { schoolId, limit }
  );
});

/**
 * Get schools grouped by league with championship counts
 * Used for school directory and school discovery
 */
export const getSchoolsByLeague = cache(async () => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("schools")
            .select(
              `
              id, slug, name, city, state, league_id,
              leagues(id, name, short_name)
            `
            )
            .is("deleted_at", null)
            .order("name");

          if (!data) return [];

          // Fetch championship counts
          const { data: champData } = await supabase
            .from("championships")
            .select("school_id");

          const champCountMap = new Map<number, number>();
          ((champData || []) as SchoolIdRef[]).forEach((c) => {
            champCountMap.set(c.school_id, (champCountMap.get(c.school_id) ?? 0) + 1);
          });

          return (data as SchoolListRow[]).map((school) => ({
            ...school,
            champ_count: champCountMap.get(school.id) ?? 0,
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOLS_BY_LEAGUE"
  );
});

// ─── Function 1: Current Seasons ─────────────────────────────────────────────

export interface CurrentSeasonInfo {
  sport_id: string;
  sport_name: string;
  wins: number;
  losses: number;
  ties: number;
  playoff_result: string | null;
  season_label: string;
  next_game?: {
    game_date: string;
    opponent_name: string;
    opponent_slug: string;
    is_home: boolean;
  };
}

/**
 * Get current season records for a school across all sports
 */
export const getSchoolCurrentSeasons = cache(async (schoolId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const currentLabel = getCurrentSeasonLabel();

          // Get team seasons for the current label
          const { data: teamSeasons } = await supabase
            .from("team_seasons")
            .select(
              `
              id, sport_id, wins, losses, ties, playoff_result,
              seasons(label),
              sports(name)
            `
            )
            .eq("school_id", schoolId)
            .eq("seasons.label", currentLabel);

          if (!teamSeasons || teamSeasons.length === 0) return [];

          // Filter in JS to only rows where the joined season label matches
          const current = (teamSeasons as TeamSeasonRow[]).filter(
            (ts) => ts.seasons?.label === currentLabel
          );
          if (current.length === 0) return [];

          // Get upcoming games (no score yet, date >= today) for this school
          const today = new Date().toISOString().split("T")[0];
          const { data: upcomingGames } = await supabase
            .from("games")
            .select(
              `
              id, sport_id, game_date,
              home_school_id, away_school_id,
              home_school:school_names!home_school_id(name, slug),
              away_school:school_names!away_school_id(name, slug)
            `
            )
            .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
            .is("home_score", null)
            .gte("game_date", today)
            .order("game_date", { ascending: true })
            .limit(10);

          // Build a map: sport_id -> earliest upcoming game
          const nextGameBySport = new Map<string, NextGameInfo>();
          ((upcomingGames ?? []) as UpcomingGameRow[]).forEach((g) => {
            if (!nextGameBySport.has(g.sport_id)) {
              const isHome = g.home_school_id === schoolId;
              const opponent = isHome ? g.away_school : g.home_school;
              nextGameBySport.set(g.sport_id, {
                game_date: g.game_date,
                opponent_name: opponent?.name ?? "Unknown",
                opponent_slug: opponent?.slug ?? "",
                is_home: isHome,
              });
            }
          });

          return current.map((ts) => ({
            sport_id: ts.sport_id,
            sport_name: ts.sports?.name ?? ts.sport_id,
            wins: ts.wins ?? 0,
            losses: ts.losses ?? 0,
            ties: ts.ties ?? 0,
            playoff_result: ts.playoff_result ?? null,
            season_label: ts.seasons?.label ?? currentLabel,
            next_game: nextGameBySport.get(ts.sport_id),
          })) as CurrentSeasonInfo[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_CURRENT_SEASONS",
    { schoolId }
  );
});

// ─── Function 2: Roster ───────────────────────────────────────────────────────

export interface SchoolRosterPlayer {
  player_id: number;
  player_slug: string | null;
  player_name: string;
  positions: string[];
  graduation_year: number | null;
  height: string | null;
  weight: number | null;
  games_played: number | null;
  primary_stat_value: number | null;
  primary_stat_label: string;
}

/**
 * Get roster for a school/sport/season with primary stat
 */
export const getSchoolRoster = cache(
  async (schoolId: number, sportId: string, seasonLabel: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Look up season_id from label
            const { data: seasonRow } = await supabase
              .from("seasons")
              .select("id")
              .eq("label", seasonLabel)
              .single();

            if (!seasonRow) return [];
            const seasonId = seasonRow.id;

            let rows: RosterRow[] = [];

            if (sportId === "football") {
              const { data } = await (supabase as unknown as DynamicSupabaseClient)
                .from("football_player_seasons")
                .select(
                  `
                  player_id, games_played, total_yards,
                  player:players!inner(id, slug, name, positions, graduation_year, height, weight)
                `
                )
                .eq("school_id", schoolId)
                .eq("season_id", seasonId);
              rows = (data as RosterRow[] | null) ?? [];
              return rows
                .sort((a, b) => {
                  const posA = a.player?.positions?.[0] ?? "Z";
                  const posB = b.player?.positions?.[0] ?? "Z";
                  if (posA !== posB) return posA.localeCompare(posB);
                  return (a.player?.name ?? "").localeCompare(b.player?.name ?? "");
                })
                .map((r) => ({
                  player_id: r.player_id,
                  player_slug: r.player?.slug ?? null,
                  player_name: r.player?.name ?? "Unknown",
                  positions: r.player?.positions ?? [],
                  graduation_year: r.player?.graduation_year ?? null,
                  height: r.player?.height ?? null,
                  weight: r.player?.weight ?? null,
                  games_played: r.games_played ?? null,
                  primary_stat_value: r.total_yards ?? null,
                  primary_stat_label: "Total Yards",
                })) as SchoolRosterPlayer[];
            } else if (isBasketballSport(sportId)) {
              const { data } = await (supabase as unknown as DynamicSupabaseClient)
                .from("basketball_player_seasons")
                .select(
                  `
                  player_id, games_played, points,
                  player:players!inner(id, slug, name, positions, graduation_year, height, weight)
                `
                )
                .eq("school_id", schoolId)
                .eq("season_id", seasonId)
                .eq("gender", getBasketballGender(sportId));
              rows = (data as RosterRow[] | null) ?? [];
              return rows
                .sort((a, b) => {
                  const posA = a.player?.positions?.[0] ?? "Z";
                  const posB = b.player?.positions?.[0] ?? "Z";
                  if (posA !== posB) return posA.localeCompare(posB);
                  return (a.player?.name ?? "").localeCompare(b.player?.name ?? "");
                })
                .map((r) => ({
                  player_id: r.player_id,
                  player_slug: r.player?.slug ?? null,
                  player_name: r.player?.name ?? "Unknown",
                  positions: r.player?.positions ?? [],
                  graduation_year: r.player?.graduation_year ?? null,
                  height: r.player?.height ?? null,
                  weight: r.player?.weight ?? null,
                  games_played: r.games_played ?? null,
                  primary_stat_value: r.points ?? null,
                  primary_stat_label: "Points",
                })) as SchoolRosterPlayer[];
            } else if (sportId === "baseball") {
              const { data } = await (supabase as unknown as DynamicSupabaseClient)
                .from("baseball_player_seasons")
                .select(
                  `
                  player_id, games_played, hits,
                  player:players!inner(id, slug, name, positions, graduation_year, height, weight)
                `
                )
                .eq("school_id", schoolId)
                .eq("season_id", seasonId);
              rows = (data as RosterRow[] | null) ?? [];
              return rows
                .sort((a, b) => {
                  const posA = a.player?.positions?.[0] ?? "Z";
                  const posB = b.player?.positions?.[0] ?? "Z";
                  if (posA !== posB) return posA.localeCompare(posB);
                  return (a.player?.name ?? "").localeCompare(b.player?.name ?? "");
                })
                .map((r) => ({
                  player_id: r.player_id,
                  player_slug: r.player?.slug ?? null,
                  player_name: r.player?.name ?? "Unknown",
                  positions: r.player?.positions ?? [],
                  graduation_year: r.player?.graduation_year ?? null,
                  height: r.player?.height ?? null,
                  weight: r.player?.weight ?? null,
                  games_played: r.games_played ?? null,
                  primary_stat_value: r.hits ?? null,
                  primary_stat_label: "Hits",
                })) as SchoolRosterPlayer[];
            }

            return [] as SchoolRosterPlayer[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_SCHOOL_ROSTER",
      { schoolId, sportId, seasonLabel }
    );
  }
);

// ─── Function 3: Stat Leaders ─────────────────────────────────────────────────

export interface StatLeaderEntry {
  player_name: string;
  player_slug: string | null;
  value: number;
  games_played: number | null;
}

export interface StatLeaderCategory {
  category: string;
  leaders: StatLeaderEntry[];
}

/**
 * Get top stat leaders per category for a school/sport/season
 */
export const getSchoolStatLeaders = cache(
  async (schoolId: number, sportId: string, seasonLabel: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Look up season_id
            const { data: seasonRow } = await supabase
              .from("seasons")
              .select("id")
              .eq("label", seasonLabel)
              .single();

            if (!seasonRow) return [];
            const seasonId = seasonRow.id;

            type StatDef = { column: string; label: string };

            const statsBySport: Record<string, StatDef[]> = {
              football: [
                { column: "rush_yards", label: "Rush Yards" },
                { column: "pass_yards", label: "Pass Yards" },
                { column: "rec_yards", label: "Rec Yards" },
                { column: "total_td", label: "Total TDs" },
                { column: "tackles", label: "Tackles" },
              ],
              basketball: [
                { column: "points", label: "Points" },
                { column: "rebounds", label: "Rebounds" },
                { column: "assists", label: "Assists" },
                { column: "steals", label: "Steals" },
              ],
              "girls-basketball": [
                { column: "points", label: "Points" },
                { column: "rebounds", label: "Rebounds" },
                { column: "assists", label: "Assists" },
                { column: "steals", label: "Steals" },
              ],
              baseball: [
                { column: "hits", label: "Hits" },
                { column: "home_runs", label: "Home Runs" },
                { column: "rbi", label: "RBI" },
                { column: "batting_avg", label: "Batting Avg" },
              ],
            };

            const tableBySport: Record<string, string> = {
              football: "football_player_seasons",
              basketball: "basketball_player_seasons",
              "girls-basketball": "basketball_player_seasons",
              baseball: "baseball_player_seasons",
            };

            const statDefs = statsBySport[sportId];
            const tableName = tableBySport[sportId];
            if (!statDefs || !tableName) return [];

            const results = await Promise.allSettled(
              statDefs.map(async ({ column, label }) => {
                let statQuery = (supabase as unknown as DynamicSupabaseClient)
                  .from(tableName)
                  .select(
                    `player_id, games_played, ${column}, player:players!inner(name, slug)`
                  )
                  .eq("school_id", schoolId)
                  .eq("season_id", seasonId)
                  .not(column, "is", null);
                if (isBasketballSport(sportId)) {
                  statQuery = statQuery.eq("gender", getBasketballGender(sportId));
                }
                const { data } = await statQuery
                  .order(column, { ascending: false })
                  .limit(5);

                const rows = (data as StatLeaderRow[] | null) ?? [];
                if (rows.length === 0) return null;

                return {
                  category: label,
                  leaders: rows.map((r) => ({
                    player_name: r.player?.name ?? "Unknown",
                    player_slug: r.player?.slug ?? null,
                    value: (r[column] as number | null | undefined) ?? 0,
                    games_played: r.games_played ?? null,
                  })),
                } as StatLeaderCategory;
              })
            );

            return results
              .filter(
                (r): r is PromiseFulfilledResult<StatLeaderCategory> =>
                  r.status === "fulfilled" && r.value !== null
              )
              .map((r) => r.value) as StatLeaderCategory[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_SCHOOL_STAT_LEADERS",
      { schoolId, sportId, seasonLabel }
    );
  }
);

// ─── Function 4: Games With Box Scores ───────────────────────────────────────

export interface BoxScorePlayerStat {
  player_name: string;
  player_slug: string | null;
  rush_yards?: number | null;
  rush_td?: number | null;
  pass_yards?: number | null;
  pass_td?: number | null;
  rec_yards?: number | null;
  rec_td?: number | null;
  total_td?: number | null;
  points?: number | null;
  bb_points?: number | null;
  rebounds?: number | null;
  assists?: number | null;
  steals?: number | null;
}

export interface GameWithBoxScore {
  game_id: number;
  game_date: string | null;
  sport_id: string;
  home_school_id: number;
  away_school_id: number;
  home_school_name: string;
  away_school_name: string;
  home_school_slug: string;
  away_school_slug: string;
  home_score: number | null;
  away_score: number | null;
  season_label: string;
  player_stats: BoxScorePlayerStat[];
}

/**
 * Get games with attached box score stats for a school/sport/season
 */
export const getSchoolGamesWithStats = cache(
  async (schoolId: number, sportId: string, seasonLabel: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Look up season_id
            const { data: seasonRow } = await supabase
              .from("seasons")
              .select("id")
              .eq("label", seasonLabel)
              .single();

            if (!seasonRow) return [];
            const seasonId = seasonRow.id;

            // Get games for this school/sport/season using school_names view
            const { data: gamesData } = await supabase
              .from("games")
              .select(
                `
                id, game_date, sport_id, home_school_id, away_school_id,
                home_score, away_score,
                home_school:school_names!home_school_id(name, slug),
                away_school:school_names!away_school_id(name, slug),
                seasons(label)
              `
              )
              .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
              .eq("sport_id", sportId)
              .eq("season_id", seasonId)
              .order("game_date", { ascending: true });

            if (!gamesData || gamesData.length === 0) return [];

            const gameIds = (gamesData as GameRow[]).map((g) => g.id);

            // Fetch box score stats
            const statsTable =
              sportId === "football"
                ? "football_game_stats"
                : isBasketballSport(sportId)
                  ? "basketball_game_stats"
                  : null;

            const statsByGame = new Map<number, BoxScorePlayerStat[]>();

            if (statsTable) {
              const { data: statsData } = await (supabase as unknown as DynamicSupabaseClient)
                .from(statsTable)
                .select(
                  sportId === "football"
                    ? `game_id, rush_yards, rush_td, pass_yards, pass_td, rec_yards, rec_td, total_td, player:players!inner(name, slug)`
                    : `game_id, points, rebounds, assists, steals, player:players!inner(name, slug)`
                )
                .in("game_id", gameIds);

              ((statsData ?? []) as BoxStatRow[]).forEach((s) => {
                const entry: BoxScorePlayerStat = {
                  player_name: s.player?.name ?? "Unknown",
                  player_slug: s.player?.slug ?? null,
                  ...(sportId === "football"
                    ? {
                        rush_yards: s.rush_yards ?? null,
                        rush_td: s.rush_td ?? null,
                        pass_yards: s.pass_yards ?? null,
                        pass_td: s.pass_td ?? null,
                        rec_yards: s.rec_yards ?? null,
                        rec_td: s.rec_td ?? null,
                        total_td: s.total_td ?? null,
                      }
                    : {
                        bb_points: s.points ?? null,
                        rebounds: s.rebounds ?? null,
                        assists: s.assists ?? null,
                        steals: s.steals ?? null,
                      }),
                };
                if (!statsByGame.has(s.game_id)) {
                  statsByGame.set(s.game_id, []);
                }
                statsByGame.get(s.game_id)!.push(entry);
              });
            }

            return (gamesData as GameRow[]).map((g) => ({
              game_id: g.id,
              game_date: g.game_date ?? null,
              sport_id: g.sport_id,
              home_school_id: g.home_school_id,
              away_school_id: g.away_school_id,
              home_school_name: g.home_school?.name ?? "Unknown",
              away_school_name: g.away_school?.name ?? "Unknown",
              home_school_slug: g.home_school?.slug ?? "",
              away_school_slug: g.away_school?.slug ?? "",
              home_score: g.home_score ?? null,
              away_score: g.away_score ?? null,
              season_label: g.seasons?.label ?? seasonLabel,
              player_stats: statsByGame.get(g.id) ?? [],
            })) as GameWithBoxScore[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_SCHOOL_GAMES_WITH_STATS",
      { schoolId, sportId, seasonLabel }
    );
  }
);

// ─── Function 5: School Records ───────────────────────────────────────────────

export interface SchoolRecord {
  id: number;
  category: string;
  subcategory: string | null;
  scope: string | null;
  record_value: string | null;
  record_number: number | null;
  holder_name: string | null;
  year_set: number | null;
  description: string | null;
  player_name: string | null;
  player_slug: string | null;
  sport_name: string | null;
  season_label: string | null;
}

/**
 * Get all records for a school, joined with player/sport/season details
 */
export const getSchoolRecords = cache(async (schoolId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("records")
            .select(
              `
              id, category, subcategory, scope, record_value,
              record_number, holder_name, year_set, description,
              sport_id,
              players(name, slug),
              sports(name),
              seasons(label)
            `
            )
            .eq("school_id", schoolId)
            .order("sport_id", { ascending: true })
            .order("category", { ascending: true })
            .order("record_number", { ascending: false });

          if (!data) return [];

          return (data as RecordRow[]).map((r) => ({
            id: r.id,
            category: r.category,
            subcategory: r.subcategory ?? null,
            scope: r.scope ?? null,
            record_value: r.record_value ?? null,
            record_number: r.record_number ?? null,
            holder_name: r.holder_name ?? null,
            year_set: r.year_set ?? null,
            description: r.description ?? null,
            player_name: r.players?.name ?? null,
            player_slug: r.players?.slug ?? null,
            sport_name: r.sports?.name ?? null,
            season_label: r.seasons?.label ?? null,
          })) as SchoolRecord[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_RECORDS",
    { schoolId }
  );
});
