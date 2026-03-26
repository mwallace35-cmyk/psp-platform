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
              `id, school_id, division, wins, losses, ties, league_wins, league_losses, league_finish, points_for, points_against,
               schools(id, name, slug, short_name, city, state, league_id, logo_url, leagues(id, name)),
               seasons(label, year_start, year_end)`
            );

            query = query.eq("sport_id", sportSlug);

            // Always filter by season — never return all seasons
            if (seasonLabel) {
              const seasonClient = await createClient();
              const { data: seasonData } = await seasonClient
                .from("seasons")
                .select("id")
                .eq("label", seasonLabel)
                .single();
              if (seasonData?.id) {
                query = query.eq("season_id", seasonData.id);
              } else {
                // Fallback: use current season
                const { data: currentSeason } = await seasonClient
                  .from("seasons")
                  .select("id")
                  .eq("is_current", true)
                  .single();
                if (currentSeason?.id) {
                  query = query.eq("season_id", currentSeason.id);
                }
              }
            } else {
              // No season specified — use current season
              const seasonClient = await createClient();
              const { data: currentSeason } = await seasonClient
                .from("seasons")
                .select("id")
                .eq("is_current", true)
                .single();
              if (currentSeason?.id) {
                query = query.eq("season_id", currentSeason.id);
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
              const rawDivision = (ts as any).division || null;
              const season = (ts.seasons as any) || {};
              const seasonLabel = season.label || "Unknown";

              // Basketball PCL is a single league (no Red/Blue divisions)
              const isBballPCL = sportSlug === "basketball" && schoolLeagueId === 1;
              const division = isBballPCL ? null : rawDivision;

              // Group by division within league if division exists
              const divisionSuffix = division ? `:${division}` : '';
              const key = `${schoolLeagueId}${divisionSuffix}:${seasonLabel}`;
              // For basketball PPL, use "Conference" for named divisions (American, National, etc.)
              // and "Division" for letter divisions (A, B, C...)
              const divSuffix = (sportSlug === "basketball" && division && division.length > 1)
                ? "Conference"
                : "Division";
              const displayName = division ? `${leagueName} — ${division} ${divSuffix}` : leagueName;

              if (!standingsMap[key]) {
                standingsMap[key] = {
                  league_id: schoolLeagueId,
                  league_name: displayName,
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

            // First get distinct season_ids that have team_seasons for this sport
            const { data: tsData } = await supabase
              .from("team_seasons")
              .select("season_id")
              .eq("sport_id", sportSlug);

            if (!tsData || tsData.length === 0) return [];

            // Get unique season IDs
            const seasonIds = [...new Set(tsData.map(r => r.season_id))];

            // Now fetch all those seasons' labels
            const { data: seasons } = await supabase
              .from("seasons")
              .select("label, year_start")
              .in("id", seasonIds)
              .order("year_start", { ascending: false });

            if (!seasons || seasons.length === 0) return [];

            return seasons.map(s => s.label);
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
