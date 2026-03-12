import { createStaticClient } from "@/lib/supabase/static";
import { withErrorHandling, withRetry } from "./common";

export interface TrendingStat {
  title: string;
  value: string;
  description: string;
  category: "record" | "database" | "milestone" | "historic";
  emoji: string;
}

/**
 * Get trending stats for homepage display
 * Returns interesting database facts and notable records
 */
export async function getTrendingStats(): Promise<TrendingStat[]> {
  return withErrorHandling(
    async () => {
      const supabase = createStaticClient();

      // Fetch in parallel
      const [gamesResult, playersResult, schoolsResult, topPlayerResult, oldestRecordResult, proAthletesResult] =
        await Promise.all([
          // Total games
          supabase.from("games").select("id", { count: "exact", head: true }),
          // Total players
          supabase.from("players").select("id", { count: "exact", head: true }),
          // Total schools
          supabase
            .from("schools")
            .select("id", { count: "exact", head: true })
            .is("deleted_at", null),
          // Top player by passing yards (football)
          supabase
            .from("football_player_seasons")
            .select(
              `
              pass_yards,
              players(name, slug),
              schools(name, slug),
              seasons(label)
            `
            )
            .order("pass_yards", { ascending: false })
            .limit(1),
          // Oldest record
          supabase
            .from("records")
            .select("year_set, record_value, holders_name, schools(name)")
            .order("year_set", { ascending: true })
            .limit(1),
          // Pro athletes count
          supabase
            .from("next_level_tracking")
            .select("player_id", { count: "exact", head: true })
            .not("pro_team", "is", null),
        ]);

      const stats: TrendingStat[] = [];

      // Stat 1: Total games
      const gameCount = gamesResult.count ?? 51057;
      stats.push({
        title: "Games in Database",
        value: gameCount.toLocaleString(),
        description: "Complete game records spanning 25+ years of Philadelphia high school sports",
        category: "database",
        emoji: "🎮",
      });

      // Stat 2: Total players
      const playerCount = playersResult.count ?? 52399;
      stats.push({
        title: "Players Tracked",
        value: playerCount.toLocaleString(),
        description: "Athletes across football, basketball, baseball, and more",
        category: "database",
        emoji: "👥",
      });

      // Stat 3: Schools represented
      const schoolCount = schoolsResult.count ?? 1237;
      stats.push({
        title: "Schools Represented",
        value: schoolCount.toLocaleString(),
        description: "Coverage of Philadelphia area high schools across all leagues",
        category: "database",
        emoji: "🏫",
      });

      // Stat 4: Top passing yards (if available)
      if (topPlayerResult.data && topPlayerResult.data.length > 0) {
        const topPlayer = topPlayerResult.data[0];
        const playerName = (topPlayer.players as any)?.name || "Unknown";
        const schoolName = (topPlayer.schools as any)?.name || "Unknown";
        const seasonLabel = (topPlayer.seasons as any)?.label || "";
        const passYards = topPlayer.pass_yards?.toLocaleString() || "0";

        stats.push({
          title: "Career Passing Leader",
          value: `${passYards} yards`,
          description: `${playerName} (${schoolName}${seasonLabel ? `, ${seasonLabel}` : ""})`,
          category: "record",
          emoji: "🏈",
        });
      } else {
        // Fallback stat
        stats.push({
          title: "Career Passing Leader",
          value: "12,165 yards",
          description: "Semaj Beals (Roman Catholic, 4 seasons)",
          category: "record",
          emoji: "🏈",
        });
      }

      // Stat 5: Oldest record
      if (oldestRecordResult.data && oldestRecordResult.data.length > 0) {
        const oldestRecord = oldestRecordResult.data[0];
        const year = oldestRecord.year_set || 1937;
        const value = oldestRecord.record_value || "Unknown";
        const school = (oldestRecord.schools as any)?.name || "Unknown";

        stats.push({
          title: "Oldest Record",
          value: `Since ${year}`,
          description: `${value} - ${school}`,
          category: "historic",
          emoji: "📚",
        });
      } else {
        stats.push({
          title: "Historical Coverage",
          value: "Since 1903",
          description: "Championship records dating back to early 1900s",
          category: "historic",
          emoji: "📚",
        });
      }

      // Stat 6: Pro athletes
      const proCount = proAthletesResult.count ?? 72;
      stats.push({
        title: "Pro Athletes",
        value: proCount.toString(),
        description: "Players who went on to play professionally (NFL, NBA, MLB)",
        category: "milestone",
        emoji: "⭐",
      });

      return stats;
    },
    [],
    "getTrendingStats"
  );
}

/**
 * Get a single random trending stat for rotating displays
 */
export async function getRandomTrendingStat(): Promise<TrendingStat | null> {
  const stats = await getTrendingStats();
  if (stats.length === 0) return null;
  return stats[Math.floor(Math.random() * stats.length)];
}
