import { cache } from "react";
import { createClient, withErrorHandling, withRetry } from "./common";

/**
 * Breakout player alert
 */
export interface BreakoutAlert {
  player_id: number;
  player_name: string;
  player_slug: string;
  school_id: number;
  school_name: string;
  school_slug: string;
  sport_id: string;
  current_season: string;
  previous_season: string;
  current_stat: number;
  previous_stat: number;
  pct_increase: number;
  avg_per_game: number;
  projected_total: number;
  position?: string;
  stat_label: string;
}

/**
 * Get breakout players for a sport (current season vs previous season)
 * Calculates year-over-year stat jumps
 * OPTIMIZED: Uses PostgREST queries instead of dropped execute_raw_sql RPC
 */
export const getBreakoutPlayers = cache(
  async (sportSlug: string, limit = 10): Promise<BreakoutAlert[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Determine stat type and table based on sport
            let statColumn = "";
            let tableName = "";
            let statLabel = "";

            if (sportSlug === "football") {
              statColumn = "rush_yards";
              tableName = "football_player_seasons";
              statLabel = "Rushing Yards";
            } else if (sportSlug === "basketball") {
              statColumn = "points";
              tableName = "basketball_player_seasons";
              statLabel = "Points";
            } else if (sportSlug === "baseball") {
              statColumn = "hits";
              tableName = "baseball_player_seasons";
              statLabel = "Hits";
            } else {
              return [];
            }

            // Fetch all seasons for the sport with relations
            const { data: rawSeasons, error } = await supabase
              .from(tableName)
              .select(
                `id, player_id, school_id, season_id,
                 ${statColumn}, games_played,
                 players(id, name, slug),
                 schools(id, name, slug),
                 seasons(id, label)`
              )
              .not(`${statColumn}`, "is", null);

            if (error) {
              console.error("Breakouts query error:", error);
              return [];
            }

            if (!rawSeasons || !Array.isArray(rawSeasons)) return [];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const allSeasons = rawSeasons as any[];

            // Build map of player+school → season data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const playerSchoolSeasons = new Map<string, Record<number, any>>();

            for (const season of allSeasons) {
              const key = `${season.player_id}-${season.school_id}`;
              if (!playerSchoolSeasons.has(key)) {
                playerSchoolSeasons.set(key, {});
              }
              playerSchoolSeasons.get(key)![season.season_id] = season;
            }

            // Calculate breakouts
            const breakouts: BreakoutAlert[] = [];

            for (const [key, seasons] of playerSchoolSeasons) {
              const seasonIds = Object.keys(seasons)
                .map(Number)
                .sort((a, b) => a - b);

              // Check each consecutive pair
              for (let i = 0; i < seasonIds.length - 1; i++) {
                const prevSeasonId = seasonIds[i];
                const currSeasonId = seasonIds[i + 1];

                const prev = seasons[prevSeasonId];
                const curr = seasons[currSeasonId];

                // Must be consecutive seasons
                if (curr.season_id !== prev.season_id + 1) continue;

                const prevStat = (prev[statColumn as keyof typeof prev] as number) || 0;
                const currStat = (curr[statColumn as keyof typeof curr] as number) || 0;
                const gamesPlayed = curr.games_played || 0;

                // Filter criteria
                if (gamesPlayed < 5) continue;
                if (prevStat <= 0) continue;
                if (currStat <= prevStat) continue;

                const pctIncrease = ((currStat - prevStat) / prevStat) * 100;

                // Only include if >= 100% increase
                if (pctIncrease < 100) continue;

                const avgPerGame = gamesPlayed > 0 ? currStat / gamesPlayed : 0;
                const projectedTotal =
                  gamesPlayed > 0 ? (currStat / gamesPlayed) * 11 : 0;

                const playerData = curr.players as any;
                const schoolData = curr.schools as any;
                const seasonData = curr.seasons as any;

                breakouts.push({
                  player_id: curr.player_id,
                  player_name: playerData?.name || "Unknown",
                  player_slug: playerData?.slug || "",
                  school_id: curr.school_id,
                  school_name: schoolData?.name || "Unknown",
                  school_slug: schoolData?.slug || "",
                  sport_id: sportSlug,
                  current_season: seasonData?.label || "",
                  previous_season: (seasons[prevSeasonId].seasons as any)?.label || "",
                  current_stat: currStat,
                  previous_stat: prevStat,
                  pct_increase: Math.round(pctIncrease),
                  avg_per_game: Math.round(avgPerGame * 10) / 10,
                  projected_total: Math.round(projectedTotal),
                  stat_label: statLabel,
                });
              }
            }

            // Sort by pct_increase DESC, then current_stat DESC
            return breakouts
              .sort((a, b) => {
                if (b.pct_increase !== a.pct_increase) {
                  return b.pct_increase - a.pct_increase;
                }
                return b.current_stat - a.current_stat;
              })
              .slice(0, Math.min(limit, 50));
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_BREAKOUT_PLAYERS",
      { sportSlug, limit }
    );
  }
);

/**
 * Get top breakout players for a specific school
 */
export const getSchoolBreakouts = cache(
  async (sportSlug: string, schoolId: number, limit = 5): Promise<BreakoutAlert[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const breakouts = await getBreakoutPlayers(sportSlug, 100);
            return breakouts.filter((b) => b.school_id === schoolId).slice(0, limit);
          },
          { maxRetries: 1, baseDelay: 300 }
        );
      },
      [],
      "DATA_SCHOOL_BREAKOUTS",
      { sportSlug, schoolId, limit }
    );
  }
);
