import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/data/common";
import RecruitFinderClient, { type RecruitRow } from "@/components/recruiting/RecruitFinderClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recruit Finder | Philadelphia High School Sports",
  description:
    "Search and filter top Philadelphia high school football, basketball, and baseball recruits by class year, position, league, and stats.",
  alternates: { canonical: "https://phillysportspack.com/recruit-finder" },
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
      className="min-h-screen py-8 px-4"
      style={{ background: "var(--psp-navy, #0a1628)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 text-[0.85rem] text-white/75"
        >
          <Link href="/" className="no-underline" style={{ color: "var(--psp-gold)" }}>
            Home
          </Link>
          {" > "}
          <span>Recruit Finder</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="psp-h1 text-white mb-2"
          >
            RECRUIT FINDER
          </h1>
          <p className="text-white/80 text-base max-w-[600px] m-0">
            Search top Philadelphia high school athletes by sport, position, class year, and stats.
            Filter and sort to find the recruits you&apos;re looking for.
          </p>
        </div>

        <RecruitFinderClient initialData={data} />
      </div>
    </div>
  );
}
