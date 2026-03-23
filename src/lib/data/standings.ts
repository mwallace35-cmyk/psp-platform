import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  School,
  TeamSeasonWithRelations,
} from "./common";

/**
 * Standing entry (school + win-loss record for a season)
 */
export interface Standing {
  rank: number;
  school: School;
  wins: number;
  losses: number;
  ties: number;
  win_pct: number;
  league_wins?: number;
  league_losses?: number;
  league_finish?: string;
  points_for?: number;
  points_against?: number;
  league_name?: string;
  is_champion?: boolean;
}

/**
 * Standings for a league in a season
 */
export interface LeagueStandings {
  league_id: number;
  league_name: string;
  season_label: string;
  standings: Standing[];
}

/**
 * Get league standings for a sport in a season
 */
export const getLeagueStandings = cache(
  async (
    sportSlug: string,
    seasonLabel?: string,
    leagueId?: number
  ): Promise<LeagueStandings[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Build query
            let query = supabase.from("team_seasons").select(
              `id, school_id, wins, losses, ties, league_wins, league_losses, league_finish, points_for, points_against,
               schools(id, name, slug, short_name, city, state, league_id, leagues(id, name)),
               seasons(label, year_start, year_end)`
            );

            query = query.eq("sport_id", sportSlug);

            if (seasonLabel) {
              // Get the season ID for this label to filter directly on the FK
              const seasonClient = await createClient();
              const { data: seasonData } = await seasonClient
                .from("seasons")
                .select("id")
                .eq("label", seasonLabel)
                .single();
              if (seasonData?.id) {
                query = query.eq("season_id", seasonData.id);
              }
            }

            if (leagueId) {
              query = query.filter("schools.league_id", "eq", leagueId);
            }

            const { data, error } = await query.limit(500);

            if (error) {
              console.error("Standings query error:", error);
              return [];
            }

            // Group by league and season
            interface StandingsTeamRecord {
              id: number;
              school_id: number;
              league_id: number;
              wins: number;
              losses: number;
              ties: number;
              points_for?: number;
              points_against?: number;
              schools?: School | School[];
              seasons?: { label?: string; year_start?: number; year_end?: number } | { label?: string; year_start?: number; year_end?: number }[];
              leagues?: { id?: number; name?: string } | { id?: number; name?: string }[];
              [key: string]: unknown;
            }

            const standingsMap: Record<
              string,
              {
                league_id: number;
                league_name: string;
                season_label: string;
                teams: StandingsTeamRecord[];
              }
            > = {};

            for (const ts of data ?? []) {
              const school = ts.schools as any;
              const leagueName = school?.leagues?.name || "Other";
              const schoolLeagueId = school?.league_id || 0;
              const season = (ts.seasons as any) || {};
              const seasonLabel = season.label || "Unknown";
              const key = `${schoolLeagueId}:${seasonLabel}`;

              if (!standingsMap[key]) {
                standingsMap[key] = {
                  league_id: schoolLeagueId,
                  league_name: leagueName,
                  season_label: seasonLabel,
                  teams: [],
                };
              }

              standingsMap[key].teams.push(ts as unknown as StandingsTeamRecord);
            }

            // Convert to standings
            const result: LeagueStandings[] = Object.values(standingsMap).map(
              ({ league_id, league_name, season_label, teams }) => {
                // Sort by wins descending, then by ties, then by win percentage
                const standings: Standing[] = teams
                  .sort((a, b) => {
                    if ((b.wins ?? 0) !== (a.wins ?? 0)) {
                      return (b.wins ?? 0) - (a.wins ?? 0);
                    }
                    if ((b.ties ?? 0) !== (a.ties ?? 0)) {
                      return (b.ties ?? 0) - (a.ties ?? 0);
                    }
                    const aWinPct =
                      ((a.wins ?? 0) +
                        (a.ties ?? 0) * 0.5) /
                      ((a.wins ?? 0) + (a.losses ?? 0) + (a.ties ?? 0)) || 0;
                    const bWinPct =
                      ((b.wins ?? 0) +
                        (b.ties ?? 0) * 0.5) /
                      ((b.wins ?? 0) + (b.losses ?? 0) + (b.ties ?? 0)) || 0;
                    return bWinPct - aWinPct;
                  })
                  .map((ts, idx) => {
                    const wins = ts.wins ?? 0;
                    const losses = ts.losses ?? 0;
                    const ties = ts.ties ?? 0;
                    const totalGames = wins + losses + ties;
                    const winPct =
                      totalGames > 0
                        ? (wins + ties * 0.5) / totalGames
                        : 0;

                    return {
                      rank: idx + 1,
                      school: (ts.schools as unknown as School) || {
                        id: ts.school_id,
                        name: "",
                        slug: "",
                      },
                      wins,
                      losses,
                      ties,
                      win_pct: winPct,
                      league_wins: (ts as any).league_wins ?? undefined,
                      league_losses: (ts as any).league_losses ?? undefined,
                      league_finish: (ts as any).league_finish ?? undefined,
                      points_for: ts.points_for ?? undefined,
                      points_against: ts.points_against ?? undefined,
                      league_name,
                      is_champion: idx === 0,
                    };
                  });

                return {
                  league_id,
                  league_name,
                  season_label,
                  standings,
                };
              }
            );

            // Sort by season year descending (most recent first)
            return result.sort((a, b) => {
              const aYear = parseInt(a.season_label.split("-")[0]);
              const bYear = parseInt(b.season_label.split("-")[0]);
              return bYear - aYear;
            });
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_LEAGUE_STANDINGS",
      { sportSlug, seasonLabel, leagueId }
    );
  }
);

/**
 * Get available seasons with standings data for a sport
 */
export const getAvailableStandingsSeasons = cache(
  async (sportSlug: string): Promise<string[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            // Query distinct season_ids from team_seasons, then get labels
            const { data, error } = await supabase
              .from("seasons")
              .select("label, year_start")
              .in("id",
                // Subquery: get all season_ids that have team_seasons for this sport
                (await supabase
                  .from("team_seasons")
                  .select("season_id")
                  .eq("sport_id", sportSlug)
                  .limit(5000)
                ).data?.map((ts: { season_id: number }) => ts.season_id) ?? []
              )
              .order("year_start", { ascending: false });

            if (error) {
              console.error("Available seasons query error:", error);
              return [];
            }

            return (data ?? []).map((s: { label: string }) => s.label);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_AVAILABLE_STANDINGS_SEASONS",
      { sportSlug }
    );
  }
);
