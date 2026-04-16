import {
  createClient,
  withErrorHandling,
  withRetry,
  Player,
  FootballPlayerSeason,
  BasketballPlayerSeason,
  BaseballPlayerSeason,
  Season,
  Award,
  PlayerSearchResult,
} from "./common";
import { isBasketballSport, getBasketballGender } from "./utils";

// Type guard for season data with proper typing
interface SeasonData {
  year_start: number;
  year_end: number;
  label: string;
}

interface PlayerSeasonRecord {
  seasons: SeasonData | SeasonData[];
  [key: string]: unknown;
}

function sortBySeasonYear<T extends PlayerSeasonRecord>(records: T[]): T[] {
  return records.sort((a, b) => {
    const aSeason = Array.isArray(a.seasons) ? a.seasons[0] : a.seasons;
    const bSeason = Array.isArray(b.seasons) ? b.seasons[0] : b.seasons;
    return (aSeason?.year_start ?? 0) - (bSeason?.year_start ?? 0);
  });
}

/**
 * Get player by slug
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export async function getPlayerBySlug(slug: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("players")
            .select("id, name, slug, primary_school_id, college, pro_team, pro_draft_info, bio, graduation_year, positions, height, weight, hudl_profile_url, twitter_handle, instagram_handle, is_verified, schools:schools!players_primary_school_id_fkey(name, slug)")
            .eq("slug", slug)
            .is("deleted_at", null)
            .single();
          return data;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_PLAYER_BY_SLUG",
    { slug }
  );
}

/**
 * Get football player stats by player ID
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export async function getFootballPlayerStats(playerId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("football_player_seasons")
            .select("id, player_id, school_id, season_id, games_played, rush_carries, rush_yards, rush_td, pass_comp, pass_yards, pass_td, receptions, rec_yards, rec_td, total_td, total_yards, points, interceptions, seasons(year_start, year_end, label), schools!football_player_seasons_school_id_fkey(name, slug)")
            .eq("player_id", playerId)
            .order("created_at", { ascending: true });
          // Sort by season year client-side
          return sortBySeasonYear((data ?? []) as unknown as PlayerSeasonRecord[]) as unknown as FootballPlayerSeason[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_FOOTBALL_PLAYER_STATS",
    { playerId }
  );
}

/**
 * Get basketball player stats by player ID
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export async function getBasketballPlayerStats(playerId: number, gender: "M" | "F" = "M") {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("basketball_player_seasons")
            .select("id, player_id, school_id, season_id, games_played, points, ppg, rebounds, assists, steals, blocks, seasons(year_start, year_end, label), schools(name, slug)")
            .eq("player_id", playerId)
            .eq("gender", gender)
            .order("created_at", { ascending: true });
          return sortBySeasonYear((data ?? []) as unknown as PlayerSeasonRecord[]) as unknown as BasketballPlayerSeason[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_BASKETBALL_PLAYER_STATS",
    { playerId, gender }
  );
}

/**
 * Get baseball player stats by player ID
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export async function getBaseballPlayerStats(playerId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("baseball_player_seasons")
            .select("id, player_id, school_id, season_id, games_played, at_bats, hits, doubles, triples, home_runs, rbi, batting_avg, era, runs, stolen_bases, walks, obp, slg, seasons(year_start, year_end, label), schools(name, slug)")
            .eq("player_id", playerId)
            .order("created_at", { ascending: true });
          return sortBySeasonYear((data ?? []) as unknown as PlayerSeasonRecord[]) as unknown as BaseballPlayerSeason[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_BASEBALL_PLAYER_STATS",
    { playerId }
  );
}

/**
 * Get awards for a player
 */
export async function getPlayerAwards(playerId: number) {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("awards")
        .select("*, seasons(year_start, year_end, label)")
        .eq("player_id", playerId)
        .order("year", { ascending: false })
        .limit(50);
      return data ?? [];
    },
    [],
    "DATA_PLAYER_AWARDS",
    { playerId }
  );
}

/**
 * Get player stats for a specific sport and player
 */
export async function getPlayerStats(playerId: number, sportId: string) {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();

      const PLAYER_STAT_TABLES: Record<string, string> = {
        football: "football_player_seasons",
        basketball: "basketball_player_seasons",
        "girls-basketball": "basketball_player_seasons",
        baseball: "baseball_player_seasons",
      };

      const statTable = PLAYER_STAT_TABLES[sportId];
      if (!statTable) {
        return [];
      }

      // typed client can't infer dynamic table name
      let query = (supabase as any)
        .from(statTable)
        .select("*")
        .eq("player_id", playerId);

      // Filter by gender for basketball tables
      if (isBasketballSport(sportId)) {
        query = query.eq("gender", getBasketballGender(sportId));
      }

      const { data } = await query
        .order("created_at", { ascending: true })
        .limit(100);

      return data ?? [];
    },
    [],
    "DATA_PLAYER_STATS",
    { playerId, sportId }
  );
}

/**
 * Get the most recent jersey number for a player from the rosters table
 */
export async function getPlayerJerseyNumber(playerId: number): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rosters")
    .select("jersey_number")
    .eq("player_id", playerId)
    .not("jersey_number", "is", null)
    .order("season_id", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.jersey_number ?? null;
}

/**
 * Derive school history for a player from game_player_stats + transfers table.
 * Returns schools in chronological order with season ranges.
 */
export interface SchoolHistoryEntry {
  school: { name: string; slug: string; id: number };
  seasons: string[];
  firstSeason: string;
  lastSeason: string;
  isGraduationSchool: boolean;
}

export async function getPlayerSchoolHistory(
  playerId: number,
  primarySchoolId: number | undefined
): Promise<SchoolHistoryEntry[]> {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();

      // Step 1: Get distinct school_id + season_id pairs from game_player_stats
      // Use a simple query without nested joins to avoid PostgREST issues
      const { data: statsData } = await supabase
        .from("game_player_stats")
        .select("school_id, game_id")
        .eq("player_id", playerId);

      if (!statsData || statsData.length === 0) return [];

      // Get unique school IDs
      const schoolIds = [...new Set(statsData.map((r) => r.school_id).filter(Boolean))] as number[];

      // If only one school, no transfer display needed
      if (schoolIds.length <= 1) return [];

      // Step 2: Get game season info for these games
      const gameIds = [...new Set(statsData.map((r) => r.game_id).filter(Boolean))] as number[];
      const { data: gamesData } = await supabase
        .from("games")
        .select("id, season_id, seasons(label, year_start)")
        .in("id", gameIds);

      if (!gamesData) return [];

      // Build game_id → season lookup
      const gameSeasonMap = new Map<number, { label: string; year_start: number }>();
      for (const g of gamesData) {
        const season = Array.isArray(g.seasons) ? g.seasons[0] : g.seasons;
        if (season?.label) gameSeasonMap.set(g.id, season as { label: string; year_start: number });
      }

      // Group by school_id, collect seasons
      const schoolMap = new Map<number, { seasons: Set<string>; minYear: number; maxYear: number }>();
      for (const row of statsData) {
        const schoolId = row.school_id;
        if (!schoolId) continue;
        const season = gameSeasonMap.get(row.game_id as number);
        if (!season) continue;

        if (!schoolMap.has(schoolId)) {
          schoolMap.set(schoolId, { seasons: new Set(), minYear: Infinity, maxYear: -Infinity });
        }
        const entry = schoolMap.get(schoolId)!;
        entry.seasons.add(season.label);
        entry.minYear = Math.min(entry.minYear, season.year_start);
        entry.maxYear = Math.max(entry.maxYear, season.year_start);
      }

      // Also check transfers table for any explicit records
      // typed client can't infer transfers table columns
      const { data: transfers } = await (supabase as any)
        .from("transfers")
        .select("from_school_id, to_school_id, transfer_year")
        .eq("player_id", playerId);

      if (transfers) {
        for (const t of transfers as any[]) {
          for (const sid of [t.from_school_id, t.to_school_id]) {
            if (sid && !schoolMap.has(sid)) {
              schoolMap.set(sid, { seasons: new Set(), minYear: t.transfer_year, maxYear: t.transfer_year });
            }
          }
        }
      }

      // Still only one school after transfers check
      if (schoolMap.size <= 1) return [];

      // Step 3: Fetch school details
      const allSchoolIds = Array.from(schoolMap.keys());
      const { data: schools } = await supabase
        .from("schools")
        .select("id, name, slug")
        .in("id", allSchoolIds);

      if (!schools) return [];

      // Build result sorted by earliest season
      const result: SchoolHistoryEntry[] = schools
        .map((s) => {
          const entry = schoolMap.get(s.id)!;
          const sortedSeasons = Array.from(entry.seasons).sort();
          return {
            school: { name: s.name, slug: s.slug, id: s.id },
            seasons: sortedSeasons,
            firstSeason: sortedSeasons[0] || "",
            lastSeason: sortedSeasons[sortedSeasons.length - 1] || "",
            isGraduationSchool: s.id === primarySchoolId,
            _minYear: entry.minYear,
          };
        })
        .sort((a, b) => (a as any)._minYear - (b as any)._minYear)
        .map(({ _minYear, ...rest }) => rest);

      return result;
    },
    [],
    "DATA_PLAYER_SCHOOL_HISTORY",
    { playerId }
  );
}

/**
 * Get cross-sport player entries (same player in different sports)
 */
export async function getCrossSportPlayers(playerName: string, schoolId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Find all players with same name and school in different sports
          const { data } = await supabase
            .from("players")
            .select(
              `
              id,
              name,
              slug,
              primary_school_id,
              schools:schools!players_primary_school_id_fkey(name, slug),
              football_player_seasons!left(id),
              basketball_player_seasons!left(id),
              baseball_player_seasons!left(id)
              `
            )
            .eq("name", playerName)
            .eq("primary_school_id", schoolId)
            .is("deleted_at", null)
            .limit(20);

          if (!data) return [];

          // Transform data to include sports played
          interface PlayerWithSports {
            id: number;
            name: string;
            slug: string;
            primary_school_id: number;
            schools: unknown;
            football_player_seasons: unknown[];
            basketball_player_seasons: unknown[];
            baseball_player_seasons: unknown[];
          }

          return data.map((p) => {
            const player = p as PlayerWithSports;
            return {
              id: player.id,
              name: player.name,
              slug: player.slug,
              school_id: player.primary_school_id,
              school: player.schools,
              sports: [
                Array.isArray(player.football_player_seasons) && player.football_player_seasons.length > 0 ? "football" : null,
                Array.isArray(player.basketball_player_seasons) && player.basketball_player_seasons.length > 0 ? "basketball" : null,
                Array.isArray(player.baseball_player_seasons) && player.baseball_player_seasons.length > 0 ? "baseball" : null,
              ].filter(Boolean) as string[],
            };
          });
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_CROSS_SPORT_PLAYERS",
    { playerName, schoolId }
  );
}
