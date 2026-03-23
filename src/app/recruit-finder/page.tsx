import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/data/common";
import RecruitFinderClient, { type RecruitRow } from "@/components/recruiting/RecruitFinderClient";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recruit Finder | Philadelphia High School Sports",
  description:
    "Search and filter top Philadelphia high school football, basketball, and baseball recruits by class year, position, league, and stats.",
  openGraph: {
    title: "Recruit Finder | PhillySportsPack.com",
    description: "Find top Philadelphia high school recruits across football, basketball, and baseball.",
  },
};

// ============================================================================
// Data Fetching
// ============================================================================

async function getRecruitFinderData(): Promise<RecruitRow[]> {
  const supabase = await createClient();

  // Get current season id
  const { data: currentSeason } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_current", true)
    .single();

  const seasonId = currentSeason?.id;
  if (!seasonId) return [];

  // Fetch all three sports in parallel
  const [fbRes, bkRes, bbRes, awardsRes] = await Promise.all([
    // Football
    (supabase as any)
      .from("football_player_seasons")
      .select(
        "player_id, rush_yards, pass_yards, rec_yards, total_td, total_yards, players!inner(id, name, slug, graduation_year, positions, primary_school_id, deleted_at, schools:schools!players_primary_school_id_fkey(name, slug, league_id, leagues(name, short_name)))"
      )
      .eq("season_id", seasonId)
      .is("players.deleted_at", null),

    // Basketball
    (supabase as any)
      .from("basketball_player_seasons")
      .select(
        "player_id, ppg, rpg, apg, points, players!inner(id, name, slug, graduation_year, positions, primary_school_id, deleted_at, schools:schools!players_primary_school_id_fkey(name, slug, league_id, leagues(name, short_name)))"
      )
      .eq("season_id", seasonId)
      .is("players.deleted_at", null),

    // Baseball
    (supabase as any)
      .from("baseball_player_seasons")
      .select(
        "player_id, batting_avg, home_runs, rbi, era, position_type, players!inner(id, name, slug, graduation_year, positions, primary_school_id, deleted_at, schools:schools!players_primary_school_id_fkey(name, slug, league_id, leagues(name, short_name)))"
      )
      .eq("season_id", seasonId)
      .is("players.deleted_at", null),

    // Awards count per player
    supabase
      .from("awards")
      .select("player_id"),
  ]);

  // Build awards count map
  const awardsMap = new Map<number, number>();
  if (awardsRes.data) {
    for (const a of awardsRes.data as { player_id: number }[]) {
      awardsMap.set(a.player_id, (awardsMap.get(a.player_id) ?? 0) + 1);
    }
  }

  const rows: RecruitRow[] = [];

  // Process football
  if (fbRes.data) {
    for (const row of fbRes.data as any[]) {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      if (!player) continue;
      const school = Array.isArray(player.schools) ? player.schools[0] : player.schools;
      const league = school?.leagues ? (Array.isArray(school.leagues) ? school.leagues[0] : school.leagues) : null;
      rows.push({
        playerId: player.id,
        playerName: player.name,
        playerSlug: player.slug,
        schoolName: school?.name ?? "Unknown",
        schoolSlug: school?.slug ?? "",
        sport: "football",
        position: player.positions?.[0] ?? null,
        classYear: player.graduation_year ?? null,
        leagueId: school?.league_id ?? null,
        leagueName: league?.short_name ?? league?.name ?? null,
        awardsCount: awardsMap.get(player.id) ?? 0,
        rushYards: row.rush_yards,
        passYards: row.pass_yards,
        recYards: row.rec_yards,
        totalTd: row.total_td,
        totalYards: row.total_yards,
      });
    }
  }

  // Process basketball
  if (bkRes.data) {
    for (const row of bkRes.data as any[]) {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      if (!player) continue;
      const school = Array.isArray(player.schools) ? player.schools[0] : player.schools;
      const league = school?.leagues ? (Array.isArray(school.leagues) ? school.leagues[0] : school.leagues) : null;
      rows.push({
        playerId: player.id,
        playerName: player.name,
        playerSlug: player.slug,
        schoolName: school?.name ?? "Unknown",
        schoolSlug: school?.slug ?? "",
        sport: "basketball",
        position: player.positions?.[0] ?? null,
        classYear: player.graduation_year ?? null,
        leagueId: school?.league_id ?? null,
        leagueName: league?.short_name ?? league?.name ?? null,
        awardsCount: awardsMap.get(player.id) ?? 0,
        ppg: row.ppg ? parseFloat(row.ppg) : null,
        rpg: row.rpg ? parseFloat(row.rpg) : null,
        apg: row.apg ? parseFloat(row.apg) : null,
        points: row.points,
      });
    }
  }

  // Process baseball
  if (bbRes.data) {
    for (const row of bbRes.data as any[]) {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      if (!player) continue;
      const school = Array.isArray(player.schools) ? player.schools[0] : player.schools;
      const league = school?.leagues ? (Array.isArray(school.leagues) ? school.leagues[0] : school.leagues) : null;
      rows.push({
        playerId: player.id,
        playerName: player.name,
        playerSlug: player.slug,
        schoolName: school?.name ?? "Unknown",
        schoolSlug: school?.slug ?? "",
        sport: "baseball",
        position: row.position_type ?? player.positions?.[0] ?? null,
        classYear: player.graduation_year ?? null,
        leagueId: school?.league_id ?? null,
        leagueName: league?.short_name ?? league?.name ?? null,
        awardsCount: awardsMap.get(player.id) ?? 0,
        battingAvg: row.batting_avg ? parseFloat(row.batting_avg) : null,
        homeRuns: row.home_runs,
        rbi: row.rbi,
        era: row.era ? parseFloat(row.era) : null,
      });
    }
  }

  return rows;
}

// ============================================================================
// Page
// ============================================================================

export default async function RecruitFinderPage() {
  const data = await getRecruitFinderData();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--psp-navy, #0a1628)",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ marginBottom: "1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}
        >
          <Link href="/" style={{ color: "var(--psp-gold)", textDecoration: "none" }}>
            Home
          </Link>
          {" > "}
          <span>Recruit Finder</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', 'DM Sans', system-ui, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#fff",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
              lineHeight: 1,
            }}
          >
            RECRUIT FINDER
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", maxWidth: "600px", margin: 0 }}>
            Search top Philadelphia high school athletes by sport, position, class year, and stats.
            Filter and sort to find the recruits you&apos;re looking for.
          </p>
        </div>

        <RecruitFinderClient initialData={data} />
      </div>
    </div>
  );
}
