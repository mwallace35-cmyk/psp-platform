import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
} from "./common";
import { isBasketballSport } from "./utils";

// --- Narrow local types (manual; do not re-enable database.types import) ---

type SupabasePageResult<T> = {
  data: T[] | null;
  error: unknown;
};

type QueryBuilder<T> = PromiseLike<SupabasePageResult<T>>;

interface PlayerRow {
  id: number;
  name: string | null;
  slug: string | null;
  primary_school_id: number | null;
  graduation_year: number | null;
  positions: string[] | null;
}

interface SeasonJoin {
  year_start: number | null;
  year_end?: number | null;
  label?: string | null;
}

interface LeagueJoin {
  name: string | null;
}

interface SchoolJoin {
  id: number;
  name: string | null;
  slug: string | null;
  leagues: LeagueJoin | LeagueJoin[] | null;
}

interface SeasonRowBase {
  id: number;
  player_id: number;
  season_id: number | null;
  school_id: number | null;
  games_played: number | null;
  seasons: SeasonJoin | SeasonJoin[] | null;
  schools: SchoolJoin | SchoolJoin[] | null;
}

interface FootballSeasonRow extends SeasonRowBase {
  rush_yards: number | null;
  pass_yards: number | null;
  rec_yards: number | null;
  rush_td: number | null;
  pass_td: number | null;
  rec_td: number | null;
}

interface BasketballSeasonRow extends SeasonRowBase {
  points: number | null;
  assists: number | null;
  rebounds: number | null;
}

/** Normalize a Supabase join that may come back as an array or single object. */
function firstJoin<T>(rel: T | T[] | null | undefined): T | null {
  if (rel == null) return null;
  return Array.isArray(rel) ? (rel[0] ?? null) : rel;
}

interface PlayerAggregate {
  player_id: number;
  player_name: string;
  player_slug: string;
  // Kept wide to preserve exact runtime behavior from the prior `any`-typed code
  // (DB nulls could flow through into the final object). PositionLeader accepts it via mapping.
  school_id: number;
  school_name: string;
  school_slug: string;
  positions: string[];
  graduation_year?: number;
  league?: string;
  seasons?: number[];
  total_stat: number;
  season_count: number;
}

/**
 * Paginate through a Supabase query in 1000-row chunks until exhausted.
 * Works around PostgREST's default 1000-row ceiling and any explicit .limit()
 * that would silently truncate large result sets.
 */
async function fetchAllPaginated<T>(
  buildQuery: (from: number, to: number) => QueryBuilder<T>
): Promise<{ data: T[] | null; error: unknown }> {
  const PAGE = 1000;
  const all: T[] = [];
  let from = 0;
  // Hard safety cap so a runaway query can't fetch forever.
  const MAX_ROWS = 50000;

  while (from < MAX_ROWS) {
    const to = from + PAGE - 1;
    const { data, error } = await buildQuery(from, to);
    if (error) return { data: null, error };
    if (!data || data.length === 0) break;
    all.push(...(data as T[]));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return { data: all, error: null };
}

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

            // Get ALL players by position filter (paginated — there can be 900+ QBs)
            const { data: players, error: playerError } = await fetchAllPaginated<PlayerRow>(
              (from, to) =>
                supabase
                  .from("players")
                  .select("id, name, slug, primary_school_id, graduation_year, positions")
                  .contains("positions", [position.toUpperCase()])
                  .is("deleted_at", null)
                  .order("id", { ascending: true })
                  .range(from, to) as unknown as QueryBuilder<PlayerRow>
            );

            if (playerError || !players) {
              console.error("Position leaders player query error:", playerError);
              return [];
            }

            const playerIds = players.map((p) => p.id);
            if (playerIds.length === 0) return [];

            // Get ALL seasons for position players (paginated — 900 players * several seasons
            // easily exceeds PostgREST's 1000-row default ceiling).
            // Batch playerIds in chunks of 500 to keep the .in() URL under Supabase limits.
            const PLAYER_ID_CHUNK = 500;
            const seasons: FootballSeasonRow[] = [];
            for (let i = 0; i < playerIds.length; i += PLAYER_ID_CHUNK) {
              const chunk = playerIds.slice(i, i + PLAYER_ID_CHUNK);
              const { data: chunkSeasons, error: seasonError } = await fetchAllPaginated<FootballSeasonRow>(
                (from, to) =>
                  supabase
                    .from("football_player_seasons")
                    .select(
                      `id, player_id, season_id, school_id, games_played, rush_yards, pass_yards, rec_yards, rush_td, pass_td, rec_td,
                       seasons(year_start, year_end, label),
                       schools(id, name, slug, leagues(name))`
                    )
                    .in("player_id", chunk)
                    .order("id", { ascending: true })
                    .range(from, to) as unknown as QueryBuilder<FootballSeasonRow>
              );
              if (seasonError) {
                console.error("Position leaders season query error:", seasonError);
                return [];
              }
              if (chunkSeasons) seasons.push(...chunkSeasons);
            }

            // Group by player and aggregate stats
            const playerStatsMap: Record<number, PlayerAggregate> = {};

            for (const season of seasons) {
              const playerId = season.player_id;
              const schoolJoin = firstJoin<SchoolJoin>(season.schools);
              const leagueJoin = firstJoin<LeagueJoin>(schoolJoin?.leagues ?? null);
              const seasonJoin = firstJoin<SeasonJoin>(season.seasons);
              if (!playerStatsMap[playerId]) {
                const player = players.find((p) => p.id === playerId);
                playerStatsMap[playerId] = {
                  player_id: playerId,
                  player_name: player?.name || "Unknown",
                  player_slug: player?.slug || "",
                  school_id: season.school_id as number,
                  school_name: schoolJoin?.name || "Unknown",
                  school_slug: schoolJoin?.slug || "",
                  positions: player?.positions || [],
                  graduation_year: player?.graduation_year as number | undefined,
                  league: leagueJoin?.name ?? undefined,
                  seasons: [],
                  total_stat: 0,
                  season_count: 0,
                };
              }

              // Accumulate stats — read dynamic stat column via unknown cast + type guard.
              const statKey = statInfo.stat as keyof FootballSeasonRow;
              const rawValue: unknown = season[statKey];
              const statValue = typeof rawValue === "number" ? rawValue : 0;
              playerStatsMap[playerId].total_stat += statValue;
              playerStatsMap[playerId].season_count += 1;
              playerStatsMap[playerId].seasons!.push(
                seasonJoin?.year_start ?? 0
              );
            }

            // Transform to PositionLeader format
            let leaders: PositionLeader[] = Object.values(playerStatsMap)
              .map((p): PositionLeader => ({
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

            // Get ALL players by position (paginated)
            const { data: players, error: playerError } = await fetchAllPaginated<PlayerRow>(
              (from, to) =>
                supabase
                  .from("players")
                  .select("id, name, slug, primary_school_id, graduation_year, positions")
                  .contains("positions", [position.toUpperCase()])
                  .is("deleted_at", null)
                  .order("id", { ascending: true })
                  .range(from, to) as unknown as QueryBuilder<PlayerRow>
            );

            if (playerError || !players) {
              console.error("Position leaders player query error:", playerError);
              return [];
            }

            const playerIds = players.map((p) => p.id);
            if (playerIds.length === 0) return [];

            // Get ALL basketball seasons (paginated, chunked by player id)
            const PLAYER_ID_CHUNK = 500;
            const seasons: BasketballSeasonRow[] = [];
            for (let i = 0; i < playerIds.length; i += PLAYER_ID_CHUNK) {
              const chunk = playerIds.slice(i, i + PLAYER_ID_CHUNK);
              const { data: chunkSeasons, error: seasonError } = await fetchAllPaginated<BasketballSeasonRow>(
                (from, to) =>
                  supabase
                    .from("basketball_player_seasons")
                    .select(
                      `id, player_id, season_id, school_id, games_played, points, assists, rebounds,
                       seasons(year_start, year_end, label),
                       schools(id, name, slug, leagues(name))`
                    )
                    .in("player_id", chunk)
                    .order("id", { ascending: true })
                    .range(from, to) as unknown as QueryBuilder<BasketballSeasonRow>
              );
              if (seasonError) {
                console.error("Position leaders season query error:", seasonError);
                return [];
              }
              if (chunkSeasons) seasons.push(...chunkSeasons);
            }

            // Aggregate
            const playerStatsMap: Record<number, PlayerAggregate> = {};

            for (const season of seasons) {
              const playerId = season.player_id;
              const schoolJoin = firstJoin<SchoolJoin>(season.schools);
              const leagueJoin = firstJoin<LeagueJoin>(schoolJoin?.leagues ?? null);
              if (!playerStatsMap[playerId]) {
                const player = players.find((p) => p.id === playerId);
                playerStatsMap[playerId] = {
                  player_id: playerId,
                  player_name: player?.name || "Unknown",
                  player_slug: player?.slug || "",
                  school_id: season.school_id as number,
                  school_name: schoolJoin?.name || "Unknown",
                  school_slug: schoolJoin?.slug || "",
                  positions: player?.positions || [],
                  graduation_year: player?.graduation_year as number | undefined,
                  league: leagueJoin?.name ?? undefined,
                  total_stat: 0,
                  season_count: 0,
                };
              }

              const statKey = primaryStat as keyof BasketballSeasonRow;
              const rawValue: unknown = season[statKey];
              const statValue = typeof rawValue === "number" ? rawValue : 0;
              playerStatsMap[playerId].total_stat += statValue;
              playerStatsMap[playerId].season_count += 1;
            }

            let leaders: PositionLeader[] = Object.values(playerStatsMap)
              .map((p): PositionLeader => ({
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
    "girls-basketball": ["PG", "SG", "SF", "PF", "C"],
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
    "girls-basketball": {
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
