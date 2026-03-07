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

/**
 * Get player by slug
 */
export async function getPlayerBySlug(slug: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("players")
            .select("*, schools:schools!players_primary_school_id_fkey(name, slug)")
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
 */
export async function getFootballPlayerStats(playerId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("football_player_seasons")
            .select("*, seasons(year_start, year_end, label), schools!football_player_seasons_school_id_fkey(name, slug)")
            .eq("player_id", playerId)
            .order("created_at", { ascending: true });
          // Sort by season year client-side
          return (data ?? []).sort((a: FootballPlayerSeason, b: FootballPlayerSeason) =>
            ((a.seasons as Season | null)?.year_start ?? 0) - ((b.seasons as Season | null)?.year_start ?? 0)
          );
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
 */
export async function getBasketballPlayerStats(playerId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("basketball_player_seasons")
            .select("*, seasons(year_start, year_end, label), schools(name, slug)")
            .eq("player_id", playerId)
            .order("created_at", { ascending: true });
          return (data ?? []).sort((a: BasketballPlayerSeason, b: BasketballPlayerSeason) =>
            ((a.seasons as Season | null)?.year_start ?? 0) - ((b.seasons as Season | null)?.year_start ?? 0)
          );
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
 */
export async function getBaseballPlayerStats(playerId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("baseball_player_seasons")
            .select("*, seasons(year_start, year_end, label), schools(name, slug)")
            .eq("player_id", playerId)
            .order("created_at", { ascending: true });
          return (data ?? []).sort((a: BaseballPlayerSeason, b: BaseballPlayerSeason) =>
            ((a.seasons as Season | null)?.year_start ?? 0) - ((b.seasons as Season | null)?.year_start ?? 0)
          );
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
        .order("created_at", { ascending: false });
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
        .order("created_at", { ascending: true });

      return data ?? [];
    },
    [],
    "DATA_PLAYER_STATS",
    { playerId, sportId }
  );
}
