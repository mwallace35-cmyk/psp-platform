import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  type Player,
  type School,
  type FootballPlayerSeason,
  type BasketballPlayerSeason,
  type BaseballPlayerSeason,
} from "./common";

/**
 * Pro athlete with school and career info
 */
export interface ProPlayer extends Player {
  school_name?: string;
  school_slug?: string;
  pro_league?: string; // NFL, NBA, MLB, WNBA, MLS, etc.
}

/**
 * Pro player pipeline stats
 */
export interface ProPipelineSchool {
  school_id: number;
  school_name: string;
  school_slug: string;
  total_pro_athletes: number;
  football_count: number;
  basketball_count: number;
  baseball_count: number;
}

/**
 * Get all pro players with optional filtering
 * OPTIMIZED: Explicit column selection, cached with React.cache
 */
export const getProPlayers = cache(
  async (sportFilter?: string, limit: number = 500) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            let query = supabase
              .from("players")
              .select(
                "id, name, slug, primary_school_id, college, pro_team, pro_draft_info, positions, graduation_year, schools!players_primary_school_id_fkey(name, slug)"
              )
              .is("deleted_at", null)
              .not("pro_team", "is", null);

            // Filter by sport if provided
            if (sportFilter && sportFilter !== "all") {
              const sportMap: Record<string, string[]> = {
                football: ["Football", "QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB"],
                basketball: ["Basketball", "G", "F", "C"],
                baseball: ["Baseball", "P", "C", "IF", "OF"],
              };
              const positions = sportMap[sportFilter] || [];
              if (positions.length > 0) {
                query = query.overlaps("positions", positions);
              }
            }

            const { data } = await query
              .order("name")
              .limit(limit);

            return (data ?? []) as unknown as ProPlayer[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_PRO_PLAYERS",
      { sportFilter, limit }
    );
  }
);

/**
 * Get pro players by school slug
 */
export const getProPlayersBySchool = cache(
  async (schoolSlug: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // First get school ID
            const { data: school } = await supabase
              .from("schools")
              .select("id")
              .eq("slug", schoolSlug)
              .is("deleted_at", null)
              .single();

            if (!school) return [];

            // Then get pro players from that school
            const { data } = await supabase
              .from("players")
              .select(
                "id, name, slug, primary_school_id, college, pro_team, pro_draft_info, positions, graduation_year"
              )
              .eq("primary_school_id", school.id)
              .is("deleted_at", null)
              .not("pro_team", "is", null)
              .order("name");

            return (data ?? []) as ProPlayer[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_PRO_PLAYERS_BY_SCHOOL",
      { schoolSlug }
    );
  }
);

/**
 * Get top schools producing pro athletes
 */
export const getProPipeline = cache(
  async (limit: number = 10) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data } = await supabase
              .from("players")
              .select(
                `
                primary_school_id,
                positions,
                schools!players_primary_school_id_fkey(name, slug)
                `
              )
              .is("deleted_at", null)
              .not("pro_team", "is", null);

            if (!data) return [];

            // Group by school and count positions
            const schoolStats: Record<number, ProPipelineSchool> = {};

            (data as any[]).forEach((row) => {
              if (!row.primary_school_id || !row.schools) return;

              const school = row.schools as any;
              const schoolId = row.primary_school_id;

              if (!schoolStats[schoolId]) {
                schoolStats[schoolId] = {
                  school_id: schoolId,
                  school_name: school.name,
                  school_slug: school.slug,
                  total_pro_athletes: 0,
                  football_count: 0,
                  basketball_count: 0,
                  baseball_count: 0,
                };
              }

              schoolStats[schoolId].total_pro_athletes += 1;

              const positions = row.positions ?? [];
              if (
                positions.includes("Football") ||
                positions.includes("QB") ||
                positions.includes("RB") ||
                positions.includes("WR") ||
                positions.includes("TE") ||
                positions.includes("OL") ||
                positions.includes("DL") ||
                positions.includes("LB") ||
                positions.includes("DB")
              ) {
                schoolStats[schoolId].football_count += 1;
              }
              if (
                positions.includes("Basketball") ||
                positions.includes("G") ||
                positions.includes("F") ||
                positions.includes("C")
              ) {
                schoolStats[schoolId].basketball_count += 1;
              }
              if (
                positions.includes("Baseball") ||
                positions.includes("P") ||
                positions.includes("C") ||
                positions.includes("IF") ||
                positions.includes("OF")
              ) {
                schoolStats[schoolId].baseball_count += 1;
              }
            });

            return Object.values(schoolStats)
              .sort((a, b) => b.total_pro_athletes - a.total_pro_athletes)
              .slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_PRO_PIPELINE",
      { limit }
    );
  }
);

/**
 * Get a single pro player's detail with full stats
 */
export const getProPlayerDetail = cache(
  async (playerSlug: string, sportId?: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data: player } = await supabase
              .from("players")
              .select(
                "id, name, slug, primary_school_id, college, pro_team, pro_draft_info, positions, height, weight, graduation_year, schools!players_primary_school_id_fkey(name, slug)"
              )
              .eq("slug", playerSlug)
              .is("deleted_at", null)
              .single();

            if (!player || (!player.pro_team && !player.pro_draft_info)) {
              return null;
            }

            // Fetch stats based on sport or from all available
            const { data: footballStats } = await supabase
              .from("football_player_seasons")
              .select("*, seasons(year_start, year_end, label), schools(name, slug)")
              .eq("player_id", player.id)
              .order("created_at", { ascending: true });

            const { data: basketballStats } = await supabase
              .from("basketball_player_seasons")
              .select("*, seasons(year_start, year_end, label), schools(name, slug)")
              .eq("player_id", player.id)
              .order("created_at", { ascending: true });

            const { data: baseballStats } = await supabase
              .from("baseball_player_seasons")
              .select("*, seasons(year_start, year_end, label), schools(name, slug)")
              .eq("player_id", player.id)
              .order("created_at", { ascending: true });

            return {
              ...player,
              football_stats: footballStats ?? [],
              basketball_stats: basketballStats ?? [],
              baseball_stats: baseballStats ?? [],
            };
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      "DATA_PRO_PLAYER_DETAIL",
      { playerSlug, sportId }
    );
  }
);

/**
 * Get pro league breakdown for display
 */
export function parseProLeague(proTeam?: string, proLeague?: string): string {
  if (proLeague) return proLeague;
  if (!proTeam) return "";

  // Infer league from team names
  const nflTeams =
    /(Bengals|Browns|Ravens|Steelers|Texans|Colts|Jaguars|Titans|Broncos|Chiefs|Raiders|Chargers|Cowboys|Eagles|Giants|Washington|Vikings|Lions|Packers|Bears|Patriots|Jets|Dolphins|Bills|49ers|Rams|Saints|Panthers|Falcons|Buccaneers|Seahawks|Cardinals)/i;
  const nbaTeams =
    /(Lakers|Celtics|Warriors|Mavericks|Heat|Nets|76ers|Knicks|Pacers|Cavaliers|Pistons|Raptors|Bulls|Bucks|Hawks|Grizzlies|Jazz|Nuggets|Timberwolves|Suns|Kings|Spurs|Clippers|Trail Blazers|Pelicans|Rockets)/i;
  const mlbTeams =
    /(Red Sox|Yankees|Rays|Blue Jays|Orioles|Indians|White Sox|Twins|Royals|Tigers|Astros|Athletics|Angels|Rangers|Mariners|Cubs|Cardinals|Brewers|Pirates|Reds|Braves|Nationals|Mets|Phillies|Marlins|Dodgers|Rockies|Padres|Giants|Diamondbacks)/i;

  if (nflTeams.test(proTeam)) return "NFL";
  if (nbaTeams.test(proTeam)) return "NBA";
  if (mlbTeams.test(proTeam)) return "MLB";

  return "Professional";
}
