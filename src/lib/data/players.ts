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
            .select("id, name, slug, primary_school_id, college, pro_team, pro_draft_info, bio, graduation_year, positions, height, weight, schools:schools!players_primary_school_id_fkey(name, slug)")
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
            .select("id, player_id, school_id, season_id, rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards, points_scored, seasons(year_start, year_end, label), schools!football_player_seasons_school_id_fkey(name, slug)")
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
export async function getBasketballPlayerStats(playerId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("basketball_player_seasons")
            .select("id, player_id, school_id, season_id, games_played, points_scored, rebounds, assists, steals, blocks, seasons(year_start, year_end, label), schools(name, slug)")
            .eq("player_id", playerId)
            .order("created_at", { ascending: true });
          return sortBySeasonYear((data ?? []) as unknown as PlayerSeasonRecord[]) as unknown as BasketballPlayerSeason[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_BASKETBALL_PLAYER_STATS",
    { playerId }
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
            .select("id, player_id, school_id, season_id, games_played, at_bats, hits, doubles, triples, home_runs, runs_batted_in, seasons(year_start, year_end, label), schools(name, slug)")
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
        .order("created_at", { ascending: false })
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
        baseball: "baseball_player_seasons",
      };

      const statTable = PLAYER_STAT_TABLES[sportId];
      if (!statTable) {
        return [];
      }

      const { data } = await supabase
        .from(statTable)
        .select("*")
        .eq("player_id", playerId)
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
