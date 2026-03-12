import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  Season,
  Game,
  TeamSeason,
} from "./common";

// Helper types for Supabase query results
interface PlayerData {
  id: number;
  name: string;
  slug: string;
  graduation_year?: number;
  height?: string;
  weight?: number;
  positions?: string[];
}

interface FootballSeasonData {
  rush_yards?: number;
  pass_yards?: number;
  rec_yards?: number;
  rush_td?: number;
  pass_td?: number;
  points?: number;
  players: PlayerData;
}

interface BasketballSeasonData {
  points?: number;
  games_played?: number;
  rebounds?: number;
  assists?: number;
  players: PlayerData;
}

interface GameWithSchools {
  id: number;
  home_school_id: number;
  away_school_id: number;
  home_school?: { id: number; name: string; slug: string };
  away_school?: { id: number; name: string; slug: string };
  game_date?: string;
  home_score?: number;
  away_score?: number;
  game_type?: string;
  playoff_round?: string;
  [key: string]: unknown;
}

interface SchoolWithTeamSeasons {
  id: number;
  name: string;
  slug: string;
  leagues?: { name: string };
  [key: string]: unknown;
}

interface TeamSeasonWithCoach {
  schools?: SchoolWithTeamSeasons;
  seasons?: Season;
  coaches?: { name: string };
  sport_id?: string;
  wins?: number;
  losses?: number;
  [key: string]: unknown;
}

// ============================================================================
// TYPES: Roster-based Returning Players
// ============================================================================

export type RosterReturningPlayer = {
  player_id: number;
  player_name: string;
  player_slug: string;
  positions: string | null; // from roster (comma-separated)
  jersey_number: string | null;
  class_year: string | null; // from roster: senior/junior/sophomore/freshman
  projected_class: string | null; // bumped up for next year
  graduation_year: number | null;
  height: string | null;
  weight: number | null;
};

// ============================================================================
// TYPES: Season Preview Data
// ============================================================================

export type ReturningPlayer = {
  player_id: number;
  player_name: string;
  player_slug: string;
  positions: string[] | null;
  graduation_year: number | null;
  height: string | null;
  weight: number | null;
  // Football stats from their last season
  rush_yards: number | null;
  rush_td: number | null;
  pass_yards: number | null;
  pass_td: number | null;
  rec_yards: number | null;
  points: number | null;
  // Basketball stats
  ppg: number | null;
  total_points: number | null;
  // General
  is_senior: boolean; // graduating this year
  total_yards: number; // combined rush+pass+rec for sorting
};

export type MatchupHistory = {
  opponent_id: number;
  opponent_name: string;
  opponent_slug: string;
  total_games: number;
  wins: number;
  losses: number;
  ties: number;
  last_game_date: string | null;
  last_game_score: string | null; // e.g. "W 28-14"
};

export type SeasonRecap = {
  wins: number;
  losses: number;
  ties: number;
  points_for: number | null;
  points_against: number | null;
  notable_wins: Array<{ opponent: string; score: string; date: string }>;
  playoff_result: string | null;
  coach_name: string | null;
  season_label: string;
};

export type LeagueStanding = {
  school_id: number;
  school_name: string;
  school_slug: string;
  wins: number;
  losses: number;
  ties: number;
  win_pct: number;
  is_current_team: boolean;
};

export type ScheduleStrength = {
  opponent_id: number;
  opponent_name: string;
  opponent_slug: string;
  last_season_record: string; // "8-2"
  last_season_wins: number;
  last_season_losses: number;
};

export type NextLevelAlumnus = {
  player_name: string;
  player_slug: string;
  level: string;
  organization: string;
  position: string | null;
};

// ============================================================================
// HELPER: Season Preview Detection
// ============================================================================

/**
 * Determines if a season is a preview (hasn't started yet).
 * A season is a preview if the current date is before September of the start year.
 */
export function isPreviewSeason(seasonLabel: string): boolean {
  try {
    // Parse season label like "2025-26" or "2024-25"
    const parts = seasonLabel.split("-");
    if (parts.length !== 2) return false;

    const startYear = parseInt(parts[0], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed, so September = 8

    // If we're in a year before the season starts, it's a preview
    if (currentYear < startYear) {
      return true;
    }

    // If we're in the start year but before September, it's a preview
    if (currentYear === startYear && currentMonth < 8) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// DATA FETCHER: Returning Roster
// ============================================================================

/**
 * Get returning players from the previous season.
 * For football: sorted by total_yards DESC (rushing + passing + receiving).
 * For basketball: sorted by points DESC.
 */
export const getReturningRoster = cache(
  async (
    schoolId: number,
    sportId: string,
    previousSeasonId: number,
    currentGradYear: number
  ): Promise<ReturningPlayer[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            if (sportId === "football") {
              const { data } = await supabase
                .from("football_player_seasons")
                .select(
                  `id, player_id, rush_yards, rush_td, pass_yards, pass_td,
                   rec_yards, points,
                   players(id, name, slug, positions, graduation_year, height, weight)`
                )
                .eq("school_id", schoolId)
                .eq("season_id", previousSeasonId)
                .is("deleted_at", null);

            if (!data) return [];

            const result = ((data as unknown as FootballSeasonData[])
              .filter((row) => row.players) // Only include rows with valid player data
              .map((row) => {
                const rushYards = row.rush_yards ?? 0;
                const passYards = row.pass_yards ?? 0;
                const recYards = row.rec_yards ?? 0;
                const totalYards = rushYards + passYards + recYards;
                const gradYear = row.players.graduation_year ?? currentGradYear;

                return {
                  player_id: row.players.id,
                  player_name: row.players.name,
                  player_slug: row.players.slug,
                  positions: row.players.positions,
                  graduation_year: row.players.graduation_year,
                  height: row.players.height,
                  weight: row.players.weight,
                  rush_yards: row.rush_yards,
                  rush_td: row.rush_td,
                  pass_yards: row.pass_yards,
                  pass_td: row.pass_td,
                  rec_yards: row.rec_yards,
                  points: row.points,
                  ppg: null,
                  total_points: null,
                  is_senior: gradYear <= currentGradYear,
                  total_yards: totalYards,
                };
              })) as unknown as ReturningPlayer[];

            // Sort by total_yards descending
            result.sort((a, b) => b.total_yards - a.total_yards);
            return result;
          } else if (sportId === "basketball") {
            const { data } = await supabase
              .from("basketball_player_seasons")
              .select(
                `id, player_id, points, ppg,
                 players(id, name, slug, positions, graduation_year, height, weight)`
              )
              .eq("school_id", schoolId)
              .eq("season_id", previousSeasonId)
              .is("deleted_at", null);

            if (!data) return [];

            const result = ((data as unknown as FootballSeasonData[])
              .filter((row) => row.players) // Only include rows with valid player data
              .map((row) => {
                const gradYear = row.players.graduation_year ?? currentGradYear;

                return {
                  player_id: row.players.id,
                  player_name: row.players.name,
                  player_slug: row.players.slug,
                  positions: row.players.positions,
                  graduation_year: row.players.graduation_year,
                  height: row.players.height,
                  weight: row.players.weight,
                  rush_yards: null,
                  rush_td: null,
                  pass_yards: null,
                  pass_td: null,
                  rec_yards: null,
                  points: row.points,
                  ppg: (row.points ?? 0),
                  total_points: row.points,
                  is_senior: gradYear <= currentGradYear,
                  total_yards: 0,
                };
              })) as unknown as ReturningPlayer[];

            // Sort by points descending
            result.sort((a, b) => (b.total_points ?? 0) - (a.total_points ?? 0));
            return result;
          }

          return [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RETURNING_ROSTER",
    { schoolId, sportId, previousSeasonId, currentGradYear }
  );
}
);

// ============================================================================
// DATA FETCHER: Matchup History
// ============================================================================

/**
 * Get head-to-head history between a school and list of opponents.
 * Returns aggregated win/loss/tie stats and most recent game info.
 */
export const getMatchupHistory = cache(
  async (
    schoolId: number,
    opponentIds: number[],
    sportId: string
  ): Promise<MatchupHistory[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Fetch all games between schoolId and any of the opponents
            const { data: games } = await supabase
              .from("games")
              .select(
                `id, game_date, home_school_id, away_school_id, home_score, away_score,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug)`
              )
              .eq("sport_id", sportId)
              .not("home_score", "is", null)
              .not("away_score", "is", null)
              .is("deleted_at", null)
              .limit(500);

          if (!games) return [];

          // Filter to only games involving schoolId and any opponent
          const relevantGames = games.filter((game: any) => {
            const isHome = game.home_school_id === schoolId;
            const isAway = game.away_school_id === schoolId;

            if (!isHome && !isAway) return false;

            const opponentId = isHome ? game.away_school_id : game.home_school_id;
            return opponentIds.includes(opponentId);
          });

          // Aggregate by opponent
          const matchups: Map<number, MatchupHistory> = new Map();

          for (const game of relevantGames) {
            const isHome = game.home_school_id === schoolId;
            const opponentId = isHome ? game.away_school_id : game.home_school_id;
            let opponentData: any = isHome ? game.away_school : game.home_school;

            // Handle case where opponent is an array (Supabase quirk)
            if (Array.isArray(opponentData)) {
              opponentData = opponentData[0];
            }

            const opponent = opponentData as { id: number; name: string; slug: string };
            if (!opponent) continue;

            const schoolScore = isHome ? game.home_score : game.away_score;
            const opponentScore = isHome ? game.away_score : game.home_score;

            let matchup = matchups.get(opponentId);
            if (!matchup) {
              matchup = {
                opponent_id: opponentId,
                opponent_name: opponent.name,
                opponent_slug: opponent.slug,
                total_games: 0,
                wins: 0,
                losses: 0,
                ties: 0,
                last_game_date: null,
                last_game_score: null,
              };
              matchups.set(opponentId, matchup);
            }

            matchup.total_games += 1;

            if (schoolScore > opponentScore) {
              matchup.wins += 1;
            } else if (schoolScore < opponentScore) {
              matchup.losses += 1;
            } else {
              matchup.ties += 1;
            }

            // Track most recent game
            if (!matchup.last_game_date || new Date(game.game_date) > new Date(matchup.last_game_date)) {
              matchup.last_game_date = game.game_date;
              const result = schoolScore > opponentScore ? "W" : schoolScore < opponentScore ? "L" : "T";
              matchup.last_game_score = `${result} ${schoolScore}-${opponentScore}`;
            }
          }

          return Array.from(matchups.values());
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_MATCHUP_HISTORY",
    { schoolId, opponentIds, sportId }
  );
}
);

// ============================================================================
// DATA FETCHER: Last Season Recap
// ============================================================================

/**
 * Get the most recent completed season's record and notable information.
 */
export const getLastSeasonRecap = cache(
  async (
    schoolId: number,
    sportId: string
  ): Promise<SeasonRecap | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get the most recent team season
            const { data: teamSeasons } = await supabase
              .from("team_seasons")
              .select("*, seasons(label, year_start), coaches(name)")
              .eq("school_id", schoolId)
              .eq("sport_id", sportId)
              .is("deleted_at", null)
              .order("seasons.year_start", { ascending: false })
              .limit(1);

          if (!teamSeasons || teamSeasons.length === 0) return null;

          const teamSeason = teamSeasons[0];
          const seasonId = teamSeason.season_id;
          const seasonLabel = (teamSeason.seasons as any)?.label ?? "Unknown";
          const coachName = (teamSeason.coaches as any)?.name ?? null;

          // Get all games for this season
          const { data: games } = await supabase
            .from("games")
            .select(
              `id, game_date, home_school_id, away_school_id, home_score, away_score,
               game_type, playoff_round,
               home_school:schools!games_home_school_id_fkey(name, slug),
               away_school:schools!games_away_school_id_fkey(name, slug)`
            )
            .eq("season_id", seasonId)
            .eq("sport_id", sportId)
            .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
            .is("deleted_at", null)
            .limit(500);

          // Find notable wins (games they won against winning teams)
          const notableWins: Array<{ opponent: string; score: string; date: string }> = [];

          if (games) {
            // First, determine which teams finished with winning records
            const teamRecords: Map<number, { wins: number; losses: number }> = new Map();

            for (const game of games) {
              const homeId = game.home_school_id;
              const awayId = game.away_school_id;

              if (!teamRecords.has(homeId)) {
                teamRecords.set(homeId, { wins: 0, losses: 0 });
              }
              if (!teamRecords.has(awayId)) {
                teamRecords.set(awayId, { wins: 0, losses: 0 });
              }

              if (game.home_score !== null && game.away_score !== null) {
                if (game.home_score > game.away_score) {
                  const homeRec = teamRecords.get(homeId)!;
                  homeRec.wins += 1;
                  const awayRec = teamRecords.get(awayId)!;
                  awayRec.losses += 1;
                } else if (game.away_score > game.home_score) {
                  const awayRec = teamRecords.get(awayId)!;
                  awayRec.wins += 1;
                  const homeRec = teamRecords.get(homeId)!;
                  homeRec.losses += 1;
                }
              }
            }

            // Find wins against winning teams
            for (const game of games) {
              const isHome = game.home_school_id === schoolId;
              const opponentId = isHome ? game.away_school_id : game.home_school_id;
              let opponentData: any = isHome ? game.away_school : game.home_school;

              // Handle case where opponent is an array (Supabase quirk)
              if (Array.isArray(opponentData)) {
                opponentData = opponentData[0];
              }

              const opponent = opponentData as { name: string; slug: string };
              const schoolScore = isHome ? game.home_score : game.away_score;
              const opponentScore = isHome ? game.away_score : game.home_score;

              if (schoolScore === null || opponentScore === null || !opponent) continue;

              // Check if they won
              if (schoolScore > opponentScore) {
                // Check if opponent had a winning record
                const opponentRec = teamRecords.get(opponentId);
                if (opponentRec && opponentRec.wins > opponentRec.losses) {
                  notableWins.push({
                    opponent: opponent.name,
                    score: `${schoolScore}-${opponentScore}`,
                    date: game.game_date ?? "",
                  });
                }
              }
            }
          }

          // Determine playoff result
          let playoffResult: string | null = null;
          if (games) {
            const playoffGames = games.filter((g: any) => g.game_type === "playoff" && g.playoff_round);
            if (playoffGames.length > 0) {
              const lastPlayoff = playoffGames[playoffGames.length - 1];
              const isHome = lastPlayoff.home_school_id === schoolId;
              const schoolScore = isHome ? lastPlayoff.home_score : lastPlayoff.away_score;
              const opponentScore = isHome ? lastPlayoff.away_score : lastPlayoff.home_score;

              if (schoolScore !== null && opponentScore !== null) {
                const result = schoolScore > opponentScore ? "W" : "L";
                playoffResult = `${lastPlayoff.playoff_round} - ${result} ${schoolScore}-${opponentScore}`;
              }
            }
          }

          return {
            wins: teamSeason.wins ?? 0,
            losses: teamSeason.losses ?? 0,
            ties: teamSeason.ties ?? 0,
            points_for: teamSeason.points_for,
            points_against: teamSeason.points_against,
            notable_wins: notableWins.slice(0, 5), // Limit to 5
            playoff_result: playoffResult,
            coach_name: coachName,
            season_label: seasonLabel,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_LAST_SEASON_RECAP",
    { schoolId, sportId }
  );
}
);

// ============================================================================
// DATA FETCHER: League Outlook
// ============================================================================

/**
 * Get all teams in the same league for the most recent season.
 * Returned sorted by win percentage (best to worst).
 */
export const getLeagueOutlook = cache(
  async (
    schoolId: number,
    sportId: string,
    leagueId: number | null
  ): Promise<LeagueStanding[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get the current school's league
            let targetLeagueId = leagueId;

            if (!targetLeagueId) {
              const { data: schoolData } = await supabase
                .from("schools")
                .select("league_id")
                .eq("id", schoolId)
                .is("deleted_at", null)
                .single();

            targetLeagueId = (schoolData as any)?.league_id;
          }

          if (!targetLeagueId) {
            return [];
          }

          // Get the most recent season year
          const { data: recentSeason } = await supabase
            .from("seasons")
            .select("id, year_start")
            .order("year_start", { ascending: false })
            .limit(1)
            .single();

          if (!recentSeason) return [];

          // Get all team_seasons for this league, sport, and season
          const { data: teamSeasons } = await supabase
            .from("team_seasons")
            .select("school_id, wins, losses, ties, schools(id, name, slug)")
            .eq("sport_id", sportId)
            .eq("season_id", recentSeason.id)
            .eq("schools.league_id", targetLeagueId)
            .is("deleted_at", null)
            .limit(500);

          if (!teamSeasons) return [];

          const standings: LeagueStanding[] = teamSeasons
            .filter((ts: any) => ts.schools) // Only include rows with valid school data
            .map((ts: any) => {
              const totalGames = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);
              const winPct = totalGames > 0 ? (ts.wins ?? 0) / totalGames : 0;

              return {
                school_id: ts.schools.id,
                school_name: ts.schools.name,
                school_slug: ts.schools.slug,
                wins: ts.wins ?? 0,
                losses: ts.losses ?? 0,
                ties: ts.ties ?? 0,
                win_pct: winPct,
                is_current_team: ts.schools.id === schoolId,
              };
            });

          // Sort by win percentage descending
          standings.sort((a, b) => b.win_pct - a.win_pct);
          return standings;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_LEAGUE_OUTLOOK",
    { schoolId, sportId, leagueId }
  );
}
);

// ============================================================================
// DATA FETCHER: Schedule Strength
// ============================================================================

/**
 * Get strength of schedule info for upcoming opponents.
 * Returns each opponent's last season record.
 */
export const getScheduleStrength = cache(
  async (
    opponentIds: number[],
    sportId: string
  ): Promise<ScheduleStrength[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get the most recent season
            const { data: recentSeason } = await supabase
              .from("seasons")
              .select("id, year_start")
              .order("year_start", { ascending: false })
              .limit(1)
              .single();

            if (!recentSeason) return [];

            // Get team_seasons for all opponents in the most recent season
            const { data: teamSeasons } = await supabase
              .from("team_seasons")
              .select("school_id, wins, losses, ties, schools(id, name, slug)")
              .eq("sport_id", sportId)
              .eq("season_id", recentSeason.id)
              .in("school_id", opponentIds)
              .is("deleted_at", null)
              .limit(500);

          if (!teamSeasons) return [];

          const strengths: ScheduleStrength[] = teamSeasons
            .filter((ts: any) => ts.schools) // Only include rows with valid school data
            .map((ts: any) => {
              const wins = ts.wins ?? 0;
              const losses = ts.losses ?? 0;
              const totalGames = wins + losses + (ts.ties ?? 0);
              const record = `${wins}-${losses}`;

              return {
                opponent_id: ts.schools.id,
                opponent_name: ts.schools.name,
                opponent_slug: ts.schools.slug,
                last_season_record: record,
                last_season_wins: wins,
                last_season_losses: losses,
              };
            });

          // Sort by wins descending (strongest opponents first)
          strengths.sort((a, b) => b.last_season_wins - a.last_season_wins);
          return strengths;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHEDULE_STRENGTH",
    { opponentIds, sportId }
  );
}
);

// ============================================================================
// DATA FETCHER: Next Level Alumni
// ============================================================================

/**
 * Get alumni who went on to play at college/pro levels.
 * Returns top 10, ordered by level (pro first, then college).
 */
export const getNextLevelAlumni = cache(
  async (schoolId: number): Promise<NextLevelAlumnus[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data } = await supabase
              .from("next_level_tracking")
              .select("*, players(id, name, slug)")
              .eq("school_id", schoolId)
              .in("level", ["professional", "college"])
              .order("level", { ascending: false }) // professional first
              .order("created_at", { ascending: false })
              .limit(10);

          if (!data) return [];

          interface NextLevelRecord {
            players?: PlayerData;
            level?: string;
            organization?: string;
            position?: string;
          }
          const alumni: NextLevelAlumnus[] = (data as NextLevelRecord[])
            .filter((row) => row.players) // Only include rows with valid player data
            .map((row) => {
              // Determine level display name
              const levelDisplay = row.level === "professional" ? "Professional" : "College";

              return {
                player_name: row.players!.name,
                player_slug: row.players!.slug,
                level: levelDisplay,
                organization: row.organization ?? "",
                position: row.position ?? null,
              };
            });

          return alumni;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_NEXT_LEVEL_ALUMNI",
    { schoolId }
  );
}
);

// ============================================================================
// DATA FETCHER: Roster-based Returning Players
// ============================================================================

const CLASS_BUMP: Record<string, string> = {
  freshman: "Sophomore",
  sophomore: "Junior",
  junior: "Senior",
};

/**
 * Get returning players by taking the previous season's roster
 * and filtering out seniors (who graduated).
 * Returns players sorted by projected class (Senior first) then name.
 */
export const getReturningRosterFromRosters = cache(
  async (
    schoolId: number,
    sportSlug: string,
    previousSeasonId: number
  ): Promise<RosterReturningPlayer[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data } = await supabase
              .from("rosters")
              .select(
                `id, player_id, position, jersey_number, class_year,
                 players!inner(id, name, slug, graduation_year, height, weight)`
              )
              .eq("school_id", schoolId)
              .eq("season_id", previousSeasonId)
              .not("class_year", "eq", "senior")
              .limit(500); // exclude graduated seniors

          if (!data) return [];

          const returning: RosterReturningPlayer[] = data
            .filter((row: any) => row.players)
            .map((row: any) => {
              const classYear = (row.class_year ?? "").toLowerCase();
              const projectedClass = CLASS_BUMP[classYear] ?? null;

              return {
                player_id: row.players.id,
                player_name: row.players.name,
                player_slug: row.players.slug,
                positions: row.position,
                jersey_number: row.jersey_number,
                class_year: row.class_year,
                projected_class: projectedClass,
                graduation_year: row.players.graduation_year,
                height: row.players.height,
                weight: row.players.weight,
              };
            });

          // Sort: projected Senior first, then Junior, Sophomore, then alphabetical
          const classOrder: Record<string, number> = { Senior: 1, Junior: 2, Sophomore: 3 };
          returning.sort((a, b) => {
            const aOrder = classOrder[a.projected_class ?? ""] ?? 4;
            const bOrder = classOrder[b.projected_class ?? ""] ?? 4;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.player_name.localeCompare(b.player_name);
          });

          return returning;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RETURNING_ROSTER_FROM_ROSTERS",
    { schoolId, sportSlug, previousSeasonId }
  );
}
);
