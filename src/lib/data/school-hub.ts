import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  School,
  type Season,
} from "./common";

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
              school_type, colors,
              leagues(name, short_name)
            `
            )
            .eq("slug", slug)
            .is("deleted_at", null)
            .single();
          // Handle leagues array which might be single object or array
          const schoolData = data as any;
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
 */
export const getSchoolAllSportsStats = cache(async (schoolId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Get all team_seasons grouped by sport
          const { data: teamSeasonData } = await supabase
            .from("team_seasons")
            .select(
              `
              id, sport_id, wins, losses, ties,
              sports(id, name)
            `
            )
            .eq("school_id", schoolId);

          if (!teamSeasonData || teamSeasonData.length === 0) {
            return [];
          }

          // Group by sport_id and aggregate stats
          const sportMap = new Map<string, { wins: number; losses: number; ties: number; seasons: Set<string> }>();

          teamSeasonData.forEach((ts: any) => {
            const sportId = ts.sport_id;
            if (!sportMap.has(sportId)) {
              sportMap.set(sportId, { wins: 0, losses: 0, ties: 0, seasons: new Set() });
            }
            const stats = sportMap.get(sportId)!;
            stats.wins += ts.wins ?? 0;
            stats.losses += ts.losses ?? 0;
            stats.ties += (ts.ties ?? 0);
            // We'll count seasons by counting team_season records
          });

          // Get championships by sport
          const { data: champData } = await supabase
            .from("championships")
            .select("sport_id")
            .eq("school_id", schoolId);

          const champCountBySport = new Map<string, number>();
          champData?.forEach((c: any) => {
            champCountBySport.set(c.sport_id, (champCountBySport.get(c.sport_id) ?? 0) + 1);
          });

          // Get player counts by sport using distinct player_id
          const [
            { data: fbPlayers },
            { data: bbPlayers },
            { data: baseballPlayers },
            { data: miscPlayers },
          ] = await Promise.all([
            supabase.from("football_player_seasons").select("player_id").eq("school_id", schoolId),
            supabase.from("basketball_player_seasons").select("player_id").eq("school_id", schoolId),
            supabase.from("baseball_player_seasons").select("player_id").eq("school_id", schoolId),
            supabase.from("player_seasons_misc").select("player_id, sport_id").eq("school_id", schoolId),
          ]);

          const playerCountBySport = new Map<string, Set<number>>();
          [
            { sport: "football", data: fbPlayers },
            { sport: "basketball", data: bbPlayers },
            { sport: "baseball", data: baseballPlayers },
          ].forEach(({ sport, data: players }) => {
            const uniqueIds = new Set<number>();
            (players ?? []).forEach((p: any) => uniqueIds.add(p.player_id));
            playerCountBySport.set(sport, uniqueIds);
          });

          // Minor sports from player_seasons_misc — group by sport_id
          (miscPlayers ?? []).forEach((p: any) => {
            if (!playerCountBySport.has(p.sport_id)) {
              playerCountBySport.set(p.sport_id, new Set());
            }
            playerCountBySport.get(p.sport_id)!.add(p.player_id);
          });

          // Map out the results with SPORT_META info
          const SPORT_EMOJI: Record<string, string> = {
            football: "🏈",
            basketball: "🏀",
            baseball: "⚾",
            "track-field": "🏃",
            lacrosse: "🥍",
            wrestling: "🤼",
            soccer: "⚽",
          };

          // Get unique sports from team_seasons
          const uniqueSports = Array.from(
            new Map(teamSeasonData.map((ts: any) => [ts.sport_id, ts])).values()
          );

          const result: SchoolSportStats[] = uniqueSports.map((ts: any) => {
            const sportId = ts.sport_id;
            const stats = sportMap.get(sportId)!;
            const champCount = champCountBySport.get(sportId) ?? 0;
            const seasonCount = teamSeasonData.filter((tsd: any) => tsd.sport_id === sportId).length;
            const playerCount = playerCountBySport.get(sportId)?.size ?? 0;

            return {
              sport_id: sportId,
              sport_name: ts.sports?.name ?? sportId,
              sport_emoji: SPORT_EMOJI[sportId] ?? "⚽",
              wins: stats.wins,
              losses: stats.losses,
              ties: stats.ties,
              championship_count: champCount,
              season_count: seasonCount,
              player_count: playerCount,
            };
          });

          // Sort: football first, basketball second, baseball third, then by season count desc
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
            .order("created_at", { ascending: false });

          if (!data) return [];

          // Sort by year descending
          const sorted = (data as any[]).sort((a, b) => {
            const aYear = a.seasons?.year_start ?? 0;
            const bYear = b.seasons?.year_start ?? 0;
            return bYear - aYear;
          });

          return sorted.map((c: any) => ({
            id: c.id,
            level: c.level,
            year: c.seasons?.year_start ?? 0,
            sport_id: c.sport_id,
            sport_name: c.sports?.name ?? "Unknown",
            season_label: c.seasons?.label ?? "Unknown",
            league_name: c.leagues?.name,
            score: c.score,
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
          return (data as any[])
            .sort((a, b) => {
              const yearDiff = (b.seasons?.year_start ?? 0) - (a.seasons?.year_start ?? 0);
              if (yearDiff !== 0) return yearDiff;
              return (SEASON_SPORT_ORDER[a.sport_id] ?? 99) - (SEASON_SPORT_ORDER[b.sport_id] ?? 99);
            })
            .map((ts) => ({
              id: ts.id,
              sport_id: ts.sport_id,
              sport_name: ts.sports?.name ?? "Unknown",
              season_label: ts.seasons?.label ?? "Unknown",
              wins: ts.wins ?? 0,
              losses: ts.losses ?? 0,
              ties: ts.ties ?? 0,
              playoff_result: ts.playoff_result,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (data as any[])
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
