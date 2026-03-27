import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  School,
  Game,
} from "./common";

/**
 * Rivalry record between two schools
 */
export interface RivalryRecord {
  school1_id: number;
  school2_id: number;
  school1: School;
  school2: School;
  school1_wins: number;
  school2_wins: number;
  ties: number;
  total_games: number;
  latest_game_date?: string;
  latest_game_score?: string;
}

/**
 * Individual game in a rivalry
 */
export interface RivalryGame {
  game_id: number;
  game_date?: string;
  home_school: School;
  away_school: School;
  home_score?: number;
  away_score?: number;
  season_label?: string;
  winner_id?: number;
}

/**
 * Helper to unwrap Supabase join results (may be array or object)
 */
function unwrapSchool(raw: unknown): School | null {
  if (!raw) return null;
  const school = Array.isArray(raw) ? raw[0] : raw;
  if (!school || typeof school !== "object") return null;
  const s = school as Record<string, unknown>;
  if (!s.id || !s.name) return null;
  return school as School;
}

/**
 * Get top rivalries for a sport (school pairs with most games)
 * Uses a database function to efficiently compute across all games
 */
export const getTopRivalries = cache(
  async (sportSlug: string, limit = 10): Promise<RivalryRecord[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data, error } = await (supabase as any).rpc("get_top_rivalries", {
              p_sport_id: sportSlug,
              p_limit: limit,
            });

            if (error) {
              console.error("Top rivalries RPC error:", error);
              return [];
            }

            return ((data ?? []) as any[]).map((row: any) => ({
              school1_id: row.school1_id,
              school2_id: row.school2_id,
              school1: {
                id: row.school1_id,
                name: row.school1_name || "",
                slug: row.school1_slug || String(row.school1_id),
              },
              school2: {
                id: row.school2_id,
                name: row.school2_name || "",
                slug: row.school2_slug || String(row.school2_id),
              },
              school1_wins: Number(row.school1_wins) || 0,
              school2_wins: Number(row.school2_wins) || 0,
              ties: Number(row.ties) || 0,
              total_games: Number(row.total_games) || 0,
              latest_game_date: row.latest_game_date || undefined,
              latest_game_score: row.latest_game_score || undefined,
            }));
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_TOP_RIVALRIES",
      { sportSlug, limit }
    );
  }
);

/**
 * Get detailed rivalry record between two schools
 */
export const getRivalryDetail = cache(
  async (
    school1Id: number,
    school2Id: number,
    sportSlug: string
  ): Promise<RivalryRecord | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data: games, error } = await supabase
              .from("games")
              .select(
                `id, sport_id, home_school_id, away_school_id, home_score, away_score, game_date,
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, state),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, state),
                 seasons(label)`
              )
              .eq("sport_id", sportSlug)
              .or(
                `and(home_school_id.eq.${school1Id},away_school_id.eq.${school2Id}),and(home_school_id.eq.${school2Id},away_school_id.eq.${school1Id})`
              )
              .order("game_date", { ascending: false })
              .limit(200);

            if (error || !games || games.length === 0) {
              return null;
            }

            let school1: School | null = null;
            let school2: School | null = null;
            let school1_wins = 0;
            let school2_wins = 0;
            let ties = 0;
            let latestDate: string | undefined;
            let latestScore: string | undefined;

            for (const game of games) {
              // Get schools — unwrap Supabase joins
              const homeSchool = unwrapSchool(game.home_school);
              const awaySchool = unwrapSchool(game.away_school);
              if (game.home_school_id === school1Id) {
                if (homeSchool) school1 = homeSchool;
                if (awaySchool) school2 = awaySchool;
              } else {
                if (awaySchool) school1 = awaySchool;
                if (homeSchool) school2 = homeSchool;
              }

              // Score tracking (school1 is normalized to first param)
              if (game.home_score != null && game.away_score != null) {
                const school1IsHome = game.home_school_id === school1Id;
                if (school1IsHome) {
                  if (game.home_score > game.away_score) {
                    school1_wins++;
                  } else if (game.home_score < game.away_score) {
                    school2_wins++;
                  } else {
                    ties++;
                  }
                } else {
                  if (game.away_score > game.home_score) {
                    school1_wins++;
                  } else if (game.away_score < game.home_score) {
                    school2_wins++;
                  } else {
                    ties++;
                  }
                }

                // Latest game
                if (!latestDate) {
                  latestDate = game.game_date ?? undefined;
                  latestScore = `${game.home_score}-${game.away_score}`;
                }
              }
            }

            return {
              school1_id: school1Id,
              school2_id: school2Id,
              school1: school1 || { id: school1Id, name: "", slug: "" },
              school2: school2 || { id: school2Id, name: "", slug: "" },
              school1_wins,
              school2_wins,
              ties,
              total_games: games.length,
              latest_game_date: latestDate,
              latest_game_score: latestScore,
            };
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      "DATA_RIVALRY_DETAIL",
      { school1Id, school2Id, sportSlug }
    );
  }
);

/**
 * Get recent rivalry games between two schools
 */
export const getRivalryGames = cache(
  async (
    school1Id: number,
    school2Id: number,
    sportSlug: string,
    limit = 10
  ): Promise<RivalryGame[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data: games, error } = await supabase
              .from("games")
              .select(
                `id, sport_id, home_school_id, away_school_id, home_score, away_score, game_date,
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, state),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, state),
                 seasons(label)`
              )
              .eq("sport_id", sportSlug)
              .or(
                `and(home_school_id.eq.${school1Id},away_school_id.eq.${school2Id}),and(home_school_id.eq.${school2Id},away_school_id.eq.${school1Id})`
              )
              .order("game_date", { ascending: false })
              .limit(Math.min(limit, 100));

            if (error) {
              console.error("Rivalry games query error:", error);
              return [];
            }

            return ((games ?? []) as unknown as Game[]).map((game) => ({
              game_id: game.id,
              game_date: game.game_date,
              home_school: unwrapSchool(game.home_school) || { id: game.home_school_id || 0, name: "", slug: "" },
              away_school: unwrapSchool(game.away_school) || { id: game.away_school_id || 0, name: "", slug: "" },
              home_score: game.home_score ?? undefined,
              away_score: game.away_score ?? undefined,
              season_label: (game.seasons as any)?.label,
              winner_id:
                game.home_score != null && game.away_score != null
                  ? game.home_score > game.away_score
                    ? game.home_school_id ?? undefined
                    : game.away_score > game.home_score
                      ? game.away_school_id ?? undefined
                      : undefined
                  : undefined,
            }));
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_RIVALRY_GAMES",
      { school1Id, school2Id, sportSlug, limit }
    );
  }
);
