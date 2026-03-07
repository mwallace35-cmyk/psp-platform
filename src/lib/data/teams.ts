import {
  createClient,
  withErrorHandling,
  withRetry,
  Championship,
  Season,
  SchoolRecord,
  Game,
  RosterPlayer,
  TeamSeasonWithRelations,
} from "./common";

/**
 * Get recently crowned champions for a sport
 */
export async function getRecentChampions(sportId: string, limit = 5) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("championships")
            .select("*, schools!championships_school_id_fkey(name, slug), seasons(year_start, year_end, label), leagues(name)")
            .eq("sport_id", sportId)
            .not("season_id", "is", null)
            .order("created_at", { ascending: false })
            .limit(limit);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RECENT_CHAMPIONS",
    { sportId, limit }
  );
}

/**
 * Get all championships for a sport
 */
export async function getChampionshipsBySport(sportId: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data, error } = await supabase
            .from("championships")
            .select(
              `*, schools!championships_school_id_fkey(name, slug), seasons(year_start, year_end, label), leagues(name),
               opponent:schools!championships_opponent_id_fkey(name)`
            )
            .eq("sport_id", sportId)
            .order("created_at", { ascending: false });
          if (error) {
            console.error("Championships query error:", error);
            return [];
          }
          // Sort by season year_start client-side (more reliable than ordering by join)
          return (data ?? []).sort((a, b) => {
            const aYear = (a.seasons as Season | null)?.year_start ?? 0;
            const bYear = (b.seasons as Season | null)?.year_start ?? 0;
            return bYear - aYear;
          });
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_CHAMPIONSHIPS_BY_SPORT",
    { sportId }
  );
}

/**
 * Get records for a sport
 */
export async function getRecordsBySport(sportId: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("records")
            .select("*, players(name, slug), schools(name, slug), seasons(label)")
            .eq("sport_id", sportId)
            .order("category")
            .order("record_number", { ascending: false });
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RECORDS_BY_SPORT",
    { sportId }
  );
}

/**
 * Get team season by school, sport, and season label
 */
export async function getTeamSeason(schoolId: number, sportId: string, seasonLabel: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select("*, seasons(year_start, year_end, label), schools(name, slug), coaches(id, name, slug)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .match({ "seasons.label": seasonLabel })
            .single();
          return data;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_TEAM_SEASON",
    { schoolId, sportId, seasonLabel }
  );
}

/**
 * Get games for a team in a season
 */
export async function getGamesByTeamSeason(schoolId: number, sportId: string, seasonId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("games")
            .select("*, seasons(label, year_start), home_school:schools!games_home_school_id_fkey(name, slug), away_school:schools!games_away_school_id_fkey(name, slug)")
            .eq("season_id", seasonId)
            .eq("sport_id", sportId)
            .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
            .order("game_date");
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_GAMES_BY_TEAM_SEASON",
    { schoolId, sportId, seasonId }
  );
}

/**
 * Get roster for a team in a season
 */
export async function getTeamRosterBySeason(schoolId: number, sportId: string, seasonId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("rosters")
            .select("*, players(id, name, slug)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .eq("season_id", seasonId)
            .order("jersey_number");
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_TEAM_ROSTER_BY_SEASON",
    { schoolId, sportId, seasonId }
  );
}

/**
 * Get available team seasons for a school and sport (for dropdown selectors)
 */
export async function getAvailableTeamSeasons(schoolId: number, sportId: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select("id, season_id, seasons(year_start, year_end, label)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .order("seasons.year_start", { ascending: false });
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_AVAILABLE_TEAM_SEASONS",
    { schoolId, sportId }
  );
}

/**
 * Get recent games for a sport (for the hub score banner).
 * Joins home_school and away_school names — filters out games
 * where BOTH school names are missing (orphaned rows).
 * Returns most recent games first, limited to `limit`.
 */
export async function getRecentGamesBySport(sportId: string, limit = 20) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("games")
            .select(
              "id, home_score, away_score, game_date, game_type, playoff_round, " +
              "home_school:schools!games_home_school_id_fkey(id, name, slug), " +
              "away_school:schools!games_away_school_id_fkey(id, name, slug), " +
              "seasons(label)"
            )
            .eq("sport_id", sportId)
            .not("home_score", "is", null)
            .not("away_score", "is", null)
            .order("game_date", { ascending: false })
            .limit(limit);

          // Filter out games where both schools are missing
          const filtered = (data ?? []).filter(
            (g: any) => g.home_school?.name || g.away_school?.name
          );
          return filtered;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RECENT_GAMES_BY_SPORT",
    { sportId, limit }
  );
}
