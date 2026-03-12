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
 * Get top rivalries for a sport (school pairs with most games)
 */
export const getTopRivalries = cache(
  async (sportSlug: string, limit = 10): Promise<RivalryRecord[]> => {
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
              .not("home_school_id", "is", null)
              .not("away_school_id", "is", null)
              .limit(5000);

            if (error) {
              console.error("Top rivalries query error:", error);
              return [];
            }

            // Group games by school pair (normalized)
            const pairMap: Record<
              string,
              {
                pair: [number, number];
                games: Game[];
              }
            > = {};

            for (const game of games ?? []) {
              if (!game.home_school_id || !game.away_school_id) continue;

              // Normalize pair (smaller ID first)
              const [id1, id2] =
                game.home_school_id < game.away_school_id
                  ? [game.home_school_id, game.away_school_id]
                  : [game.away_school_id, game.home_school_id];
              const key = `${id1}:${id2}`;

              if (!pairMap[key]) {
                pairMap[key] = {
                  pair: [id1, id2],
                  games: [],
                };
              }
              pairMap[key].games.push(game as unknown as Game);
            }

            // Convert to rivalry records
            const rivalries: RivalryRecord[] = Object.values(pairMap)
              .map(({ pair, games: gameList }) => {
                let school1 = null;
                let school2 = null;
                let school1_wins = 0;
                let school2_wins = 0;
                let ties = 0;
                let latestDate: string | undefined;
                let latestScore: string | undefined;

                for (const game of gameList) {
                  // Extract schools
                  if (!school1 && game.home_school_id === pair[0]) {
                    school1 = game.home_school as unknown as School;
                  }
                  if (!school2 && game.away_school_id === pair[1]) {
                    school2 = game.away_school as unknown as School;
                  }
                  if (!school1 && game.away_school_id === pair[0]) {
                    school1 = game.away_school as unknown as School;
                  }
                  if (!school2 && game.home_school_id === pair[1]) {
                    school2 = game.home_school as unknown as School;
                  }

                  // Score tracking
                  const homeIsSchool1 = game.home_school_id === pair[0];
                  if (
                    game.home_score != null &&
                    game.away_score != null
                  ) {
                    if (homeIsSchool1) {
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
                    if (!latestDate || (game.game_date ?? "") > latestDate) {
                      latestDate = game.game_date ?? undefined;
                      latestScore = `${game.home_score}-${game.away_score}`;
                    }
                  }
                }

                return {
                  school1_id: pair[0],
                  school2_id: pair[1],
                  school1: school1 || { id: pair[0], name: "", slug: "" },
                  school2: school2 || { id: pair[1], name: "", slug: "" },
                  school1_wins,
                  school2_wins,
                  ties,
                  total_games: gameList.length,
                  latest_game_date: latestDate,
                  latest_game_score: latestScore,
                };
              })
              .filter((r) => r.total_games >= 2); // Only rivalries with 2+ games

            // Sort by total games descending
            return rivalries
              .sort((a, b) => b.total_games - a.total_games)
              .slice(0, limit);
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
              // Get schools
              if (game.home_school_id === school1Id) {
                school1 = game.home_school as unknown as School;
                school2 = game.away_school as unknown as School;
              } else {
                school1 = game.away_school as unknown as School;
                school2 = game.home_school as unknown as School;
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
              home_school: game.home_school as unknown as School,
              away_school: game.away_school as unknown as School,
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
