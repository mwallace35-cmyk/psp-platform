import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
} from "./common";

/**
 * Position leader with career stats
 */
export interface PositionLeader {
  player_id: number;
  player_name: string;
  player_slug: string;
  school_id: number;
  school_name: string;
  school_slug: string;
  positions: string[];
  graduation_year?: number;
  career_seasons: number;
  career_stat_value: number;
  season_average: number;
  primary_stat: string;
  era?: string;
  league?: string;
}

/**
 * Get football position leaders
 */
export const getFootballPositionLeaders = cache(
  async (
    position: string,
    league?: string,
    era?: string,
    limit: number = 50
  ): Promise<PositionLeader[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Map position codes to stat types
            const positionStatMap: Record<string, { stat: string; orderBy: "desc" }> = {
              QB: { stat: "pass_yards", orderBy: "desc" },
              RB: { stat: "rush_yards", orderBy: "desc" },
              WR: { stat: "rec_yards", orderBy: "desc" },
              TE: { stat: "rec_yards", orderBy: "desc" },
              OL: { stat: "games_played", orderBy: "desc" },
              DL: { stat: "games_played", orderBy: "desc" },
              LB: { stat: "games_played", orderBy: "desc" },
              DB: { stat: "games_played", orderBy: "desc" },
            };

            const statInfo = positionStatMap[position.toUpperCase()] || {
              stat: "rush_yards",
              orderBy: "desc",
            };

            // Get players by position filter
            const { data: players, error: playerError } = await supabase
              .from("players")
              .select("id, name, slug, primary_school_id, graduation_year, positions")
              .contains("positions", [position.toUpperCase()])
              .is("deleted_at", null)
              .limit(500);

            if (playerError || !players) {
              console.error("Position leaders player query error:", playerError);
              return [];
            }

            const playerIds = players.map((p: any) => p.id);
            if (playerIds.length === 0) return [];

            // Get seasons for all position players
            const { data: seasons, error: seasonError } = await supabase
              .from("football_player_seasons")
              .select(
                `id, player_id, season_id, school_id, games_played, rush_yards, pass_yards, rec_yards, rush_td, pass_td, rec_td,
                 seasons(year_start, year_end, label),
                 schools(id, name, slug, leagues(name))`
              )
              .in("player_id", playerIds);

            if (seasonError || !seasons) {
              console.error("Position leaders season query error:", seasonError);
              return [];
            }

            // Group by player and aggregate stats
            const playerStatsMap: Record<number, any> = {};

            for (const season of seasons) {
              const playerId = season.player_id;
              if (!playerStatsMap[playerId]) {
                const player = players.find((p: any) => p.id === playerId);
                playerStatsMap[playerId] = {
                  player_id: playerId,
                  player_name: player?.name || "Unknown",
                  player_slug: player?.slug || "",
                  school_id: season.school_id,
                  school_name: (season.schools as any)?.name || "Unknown",
                  school_slug: (season.schools as any)?.slug || "",
                  positions: player?.positions || [],
                  graduation_year: player?.graduation_year,
                  league: (season.schools as any)?.leagues?.name,
                  seasons: [],
                  total_stat: 0,
                  season_count: 0,
                };
              }

              // Accumulate stats
              const statValue = (season as any)[statInfo.stat] || 0;
              playerStatsMap[playerId].total_stat += statValue;
              playerStatsMap[playerId].season_count += 1;
              playerStatsMap[playerId].seasons.push(
                (season.seasons as any)?.year_start || 0
              );
            }

            // Transform to PositionLeader format
            let leaders: PositionLeader[] = Object.values(playerStatsMap)
              .map((p: any) => ({
                player_id: p.player_id,
                player_name: p.player_name,
                player_slug: p.player_slug,
                school_id: p.school_id,
                school_name: p.school_name,
                school_slug: p.school_slug,
                positions: p.positions,
                graduation_year: p.graduation_year,
                career_seasons: p.season_count,
                career_stat_value: p.total_stat,
                season_average: p.season_count > 0 ? p.total_stat / p.season_count : 0,
                primary_stat: statInfo.stat,
                league: p.league,
              }))
              .filter((l: PositionLeader) => l.career_stat_value > 0);

            // Apply filters
            if (league && league !== "All") {
              leaders = leaders.filter((l) => l.league === league);
            }

            // Sort by career total
            return leaders
              .sort((a, b) => b.career_stat_value - a.career_stat_value)
              .slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_FOOTBALL_POSITION_LEADERS",
      { position, league, era, limit }
    );
  }
);

/**
 * Get basketball position leaders
 */
export const getBasketballPositionLeaders = cache(
  async (
    position: string,
    league?: string,
    era?: string,
    limit: number = 50
  ): Promise<PositionLeader[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Basketball position stat map
            const positionStatMap: Record<string, string> = {
              PG: "assists",
              SG: "points",
              SF: "points",
              PF: "rebounds",
              C: "rebounds",
            };

            const primaryStat = positionStatMap[position.toUpperCase()] || "points";

            // Get players by position
            const { data: players, error: playerError } = await supabase
              .from("players")
              .select("id, name, slug, primary_school_id, graduation_year, positions")
              .contains("positions", [position.toUpperCase()])
              .is("deleted_at", null)
              .limit(500);

            if (playerError || !players) {
              console.error("Position leaders player query error:", playerError);
              return [];
            }

            const playerIds = players.map((p: any) => p.id);
            if (playerIds.length === 0) return [];

            // Get basketball seasons
            const { data: seasons, error: seasonError } = await supabase
              .from("basketball_player_seasons")
              .select(
                `id, player_id, season_id, school_id, games_played, points, assists, rebounds,
                 seasons(year_start, year_end, label),
                 schools(id, name, slug, leagues(name))`
              )
              .in("player_id", playerIds);

            if (seasonError || !seasons) {
              console.error("Position leaders season query error:", seasonError);
              return [];
            }

            // Aggregate
            const playerStatsMap: Record<number, any> = {};

            for (const season of seasons) {
              const playerId = season.player_id;
              if (!playerStatsMap[playerId]) {
                const player = players.find((p: any) => p.id === playerId);
                playerStatsMap[playerId] = {
                  player_id: playerId,
                  player_name: player?.name || "Unknown",
                  player_slug: player?.slug || "",
                  school_id: season.school_id,
                  school_name: (season.schools as any)?.name || "Unknown",
                  school_slug: (season.schools as any)?.slug || "",
                  positions: player?.positions || [],
                  graduation_year: player?.graduation_year,
                  league: (season.schools as any)?.leagues?.name,
                  total_stat: 0,
                  season_count: 0,
                };
              }

              const statValue = (season as any)[primaryStat] || 0;
              playerStatsMap[playerId].total_stat += statValue;
              playerStatsMap[playerId].season_count += 1;
            }

            let leaders: PositionLeader[] = Object.values(playerStatsMap)
              .map((p: any) => ({
                player_id: p.player_id,
                player_name: p.player_name,
                player_slug: p.player_slug,
                school_id: p.school_id,
                school_name: p.school_name,
                school_slug: p.school_slug,
                positions: p.positions,
                graduation_year: p.graduation_year,
                career_seasons: p.season_count,
                career_stat_value: p.total_stat,
                season_average: p.season_count > 0 ? p.total_stat / p.season_count : 0,
                primary_stat: primaryStat,
                league: p.league,
              }))
              .filter((l: PositionLeader) => l.career_stat_value > 0);

            if (league && league !== "All") {
              leaders = leaders.filter((l) => l.league === league);
            }

            return leaders
              .sort((a, b) => b.career_stat_value - a.career_stat_value)
              .slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_BASKETBALL_POSITION_LEADERS",
      { position, league, era, limit }
    );
  }
);

/**
 * Get valid positions for a sport
 */
export function getPositionsForSport(sport: string): string[] {
  const positionMap: Record<string, string[]> = {
    football: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB"],
    basketball: ["PG", "SG", "SF", "PF", "C"],
    baseball: ["P", "C", "IF", "OF"],
  };
  return positionMap[sport] || [];
}

/**
 * Get position display name
 */
export function getPositionDisplayName(sport: string, position: string): string {
  const displayNames: Record<string, Record<string, string>> = {
    football: {
      QB: "Quarterbacks",
      RB: "Running Backs",
      WR: "Wide Receivers",
      TE: "Tight Ends",
      OL: "Offensive Linemen",
      DL: "Defensive Linemen",
      LB: "Linebackers",
      DB: "Defensive Backs",
    },
    basketball: {
      PG: "Point Guards",
      SG: "Shooting Guards",
      SF: "Small Forwards",
      PF: "Power Forwards",
      C: "Centers",
    },
    baseball: {
      P: "Pitchers",
      C: "Catchers",
      IF: "Infielders",
      OF: "Outfielders",
    },
  };
  return displayNames[sport]?.[position] || position;
}
