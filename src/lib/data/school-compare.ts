import {
  createClient,
  withErrorHandling,
  withRetry,
  type School,
  type Player,
} from "./common";

/**
 * School comparison metrics
 */
export interface SchoolComparisonMetrics {
  school_id: number;
  school_name: string;
  school_slug: string;
  school_colors?: { primary?: string; secondary?: string };
  all_time_wins: number;
  all_time_losses: number;
  all_time_ties: number;
  win_percentage: number;
  total_championships: number;
  championship_by_level: Record<string, number>;
  pro_athletes: number;
  college_placements: number;
  all_city_selections: number;
  league_titles: number;
  current_season_wins?: number;
  current_season_losses?: number;
  current_season_ties?: number;
  current_roster_size: number;
  top_players: Array<{
    id: number;
    name: string;
    slug: string;
    position?: string;
  }>;
}

/**
 * Get comparison metrics for multiple schools
 */
export async function getSchoolComparisonData(
  slugs: string[],
  sport?: string
): Promise<SchoolComparisonMetrics[]> {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Get school IDs from slugs
          const { data: schools, error: schoolError } = await supabase
            .from("schools")
            .select("id, name, slug, colors")
            .in("slug", slugs)
            .is("deleted_at", null);

          if (schoolError || !schools || schools.length === 0) {
            return [];
          }

          // Build comparison data for each school
          const results: SchoolComparisonMetrics[] = [];

          for (const school of schools as any[]) {
            const schoolId = school.id;

            // Fetch all metrics in parallel
            const [
              teamSeasons,
              championships,
              proAthletes,
              collegeAthletes,
              awards,
              currentPlayers,
            ] = await Promise.all([
              // Team seasons (for all-time record) — no deleted_at column on this table
              supabase
                .from("team_seasons")
                .select("wins, losses, ties")
                .eq("school_id", schoolId),
              // Championships — no deleted_at column on this table
              supabase
                .from("championships")
                .select("level, sport_id")
                .eq("school_id", schoolId),
              // Pro athletes
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("high_school_id", schoolId)
                .eq("current_level", "pro"),
              // College placements
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("high_school_id", schoolId)
                .eq("current_level", "college"),
              // Awards (All-City selections)
              supabase
                .from("awards")
                .select("id", { count: "exact", head: true })
                .eq("school_id", schoolId)
                .like("award_name", "%All-City%"),
              // Current players (count from players table)
              supabase
                .from("players")
                .select("id", { count: "exact", head: true })
                .eq("primary_school_id", schoolId)
                .is("deleted_at", null),
            ]);

            // Calculate all-time record
            let totalWins = 0,
              totalLosses = 0,
              totalTies = 0;
            for (const ts of (teamSeasons.data ?? []) as any[]) {
              totalWins += ts.wins || 0;
              totalLosses += ts.losses || 0;
              totalTies += ts.ties || 0;
            }

            const totalGames = totalWins + totalLosses + totalTies;
            const winPercentage =
              totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

            // Group championships by level
            const champsByLevel: Record<string, number> = {};
            let totalChamps = 0;
            for (const c of (championships.data ?? []) as any[]) {
              const level = c.level || "Other";
              champsByLevel[level] = (champsByLevel[level] || 0) + 1;
              totalChamps++;
            }

            // Get top players for this school (by career stats)
            const { data: topPlayers } = await supabase
              .from("players")
              .select("id, name, slug, positions")
              .eq("primary_school_id", schoolId)
              .is("deleted_at", null)
              .limit(3);

            results.push({
              school_id: schoolId,
              school_name: school.name,
              school_slug: school.slug,
              school_colors: school.colors,
              all_time_wins: totalWins,
              all_time_losses: totalLosses,
              all_time_ties: totalTies,
              win_percentage: parseFloat(winPercentage.toFixed(1)),
              total_championships: totalChamps,
              championship_by_level: champsByLevel,
              pro_athletes: proAthletes.count ?? 0,
              college_placements: collegeAthletes.count ?? 0,
              all_city_selections: awards.count ?? 0,
              league_titles: 0, // TODO: Calculate from championships table
              current_roster_size: currentPlayers.count ?? 0,
              top_players: (topPlayers ?? []).map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                position: p.positions?.[0],
              })),
            });
          }

          return results;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_COMPARISON",
    { slugs, sport }
  );
}

/**
 * Get schools for comparison selector
 */
export async function searchSchoolsForComparison(
  query: string,
  limit = 10
) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data: schools } = await supabase
            .from("schools")
            .select("id, name, slug, city, state")
            .ilike("name", `%${query}%`)
            .is("deleted_at", null)
            .limit(limit);

          return (schools ?? []).map((s: any) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            city: s.city,
            state: s.state,
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SEARCH_SCHOOLS_FOR_COMPARISON",
    { query, limit }
  );
}
