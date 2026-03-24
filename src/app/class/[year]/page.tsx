import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/data/common";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

// ============================================================================
// Types
// ============================================================================

interface ClassPlayer {
  id: number;
  name: string;
  slug: string;
  schoolName: string;
  schoolSlug: string;
  position: string | null;
  awardsCount: number;
  // Sport-specific
  rushYards?: number | null;
  passYards?: number | null;
  totalTd?: number | null;
  totalYards?: number | null;
  ppg?: number | null;
  rpg?: number | null;
  apg?: number | null;
  points?: number | null;
  battingAvg?: number | null;
  homeRuns?: number | null;
  rbi?: number | null;
  era?: number | null;
}

interface SportSection {
  sport: string;
  sportSlug: string;
  color: string;
  primaryStatLabel: string;
  players: ClassPlayer[];
}

const VALID_YEARS = [2025, 2026, 2027, 2028, 2029];

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Class of ${year} | Philadelphia High School Sports`,
    description: `Top performers from the Class of ${year} across football, basketball, and baseball in Philadelphia high school sports.`,
    alternates: { canonical: `https://phillysportspack.com/class/${year}` },
  };
}

export async function generateStaticParams() {
  return VALID_YEARS.map((y) => ({ year: String(y) }));
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getClassYearData(gradYear: number): Promise<SportSection[]> {
  const supabase = await createClient();

  // Get current season
  const { data: currentSeason } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_current", true)
    .single();

  const seasonId = currentSeason?.id;
  if (!seasonId) return [];

  // Fetch awards counts for all players in this class
  const { data: classPlayers } = await supabase
    .from("players")
    .select("id")
    .eq("graduation_year", gradYear)
    .is("deleted_at", null);

  const playerIds = (classPlayers ?? []).map((p: any) => p.id);
  const awardsMap = new Map<number, number>();

  if (playerIds.length > 0) {
    const { data: awards } = await supabase
      .from("awards")
      .select("player_id")
      .in("player_id", playerIds);

    if (awards) {
      for (const a of awards as { player_id: number }[]) {
        awardsMap.set(a.player_id, (awardsMap.get(a.player_id) ?? 0) + 1);
      }
    }
  }

  // Fetch top 10 per sport
  const [fbRes, bkRes, bbRes] = await Promise.all([
    // Football: order by total_yards (or pass_yards as fallback)
    (supabase as any)
      .from("football_player_seasons")
      .select(
        "player_id, rush_yards, pass_yards, total_td, total_yards, players!inner(id, name, slug, graduation_year, positions, deleted_at, schools:schools!players_primary_school_id_fkey(name, slug))"
      )
      .eq("season_id", seasonId)
      .eq("players.graduation_year", gradYear)
      .is("players.deleted_at", null)
      .order("total_yards", { ascending: false, nullsFirst: false })
      .limit(10),

    // Basketball: order by ppg
    (supabase as any)
      .from("basketball_player_seasons")
      .select(
        "player_id, ppg, rpg, apg, points, players!inner(id, name, slug, graduation_year, positions, deleted_at, schools:schools!players_primary_school_id_fkey(name, slug))"
      )
      .eq("season_id", seasonId)
      .eq("players.graduation_year", gradYear)
      .is("players.deleted_at", null)
      .order("ppg", { ascending: false, nullsFirst: false })
      .limit(10),

    // Baseball: order by batting_avg
    (supabase as any)
      .from("baseball_player_seasons")
      .select(
        "player_id, batting_avg, home_runs, rbi, era, position_type, players!inner(id, name, slug, graduation_year, positions, deleted_at, schools:schools!players_primary_school_id_fkey(name, slug))"
      )
      .eq("season_id", seasonId)
      .eq("players.graduation_year", gradYear)
      .is("players.deleted_at", null)
      .order("batting_avg", { ascending: false, nullsFirst: false })
      .limit(10),
  ]);

  const sections: SportSection[] = [];

  // Process football
  const fbPlayers = processPlayers(fbRes.data, "football", awardsMap);
  if (fbPlayers.length > 0) {
    sections.push({
      sport: "Football",
      sportSlug: "football",
      color: "var(--fb, #16a34a)",
      primaryStatLabel: "Total Yards",
      players: fbPlayers,
    });
  }

  // Process basketball
  const bkPlayers = processPlayers(bkRes.data, "basketball", awardsMap);
  if (bkPlayers.length > 0) {
    sections.push({
      sport: "Basketball",
      sportSlug: "basketball",
      color: "#3b82f6",
      primaryStatLabel: "PPG",
      players: bkPlayers,
    });
  }

  // Process baseball
  const bbPlayers = processPlayers(bbRes.data, "baseball", awardsMap);
  if (bbPlayers.length > 0) {
    sections.push({
      sport: "Baseball",
      sportSlug: "baseball",
      color: "var(--bb, #ea580c)",
      primaryStatLabel: "Batting Avg",
      players: bbPlayers,
    });
  }

  return sections;
}

function processPlayers(
  data: any[] | null,
  sport: string,
  awardsMap: Map<number, number>
): ClassPlayer[] {
  if (!data) return [];
  return data.map((row: any) => {
    const player = Array.isArray(row.players) ? row.players[0] : row.players;
    if (!player) return null;
    const school = Array.isArray(player.schools) ? player.schools[0] : player.schools;
    return {
      id: player.id,
      name: player.name,
      slug: player.slug,
      schoolName: school?.name ?? "Unknown",
      schoolSlug: school?.slug ?? "",
      position: sport === "baseball" ? (row.position_type ?? player.positions?.[0] ?? null) : (player.positions?.[0] ?? null),
      awardsCount: awardsMap.get(player.id) ?? 0,
      rushYards: row.rush_yards,
      passYards: row.pass_yards,
      totalTd: row.total_td,
      totalYards: row.total_yards,
      ppg: row.ppg ? parseFloat(row.ppg) : null,
      rpg: row.rpg ? parseFloat(row.rpg) : null,
      apg: row.apg ? parseFloat(row.apg) : null,
      points: row.points,
      battingAvg: row.batting_avg ? parseFloat(row.batting_avg) : null,
      homeRuns: row.home_runs,
      rbi: row.rbi,
      era: row.era ? parseFloat(row.era) : null,
    } as ClassPlayer;
  }).filter(Boolean) as ClassPlayer[];
}

// ============================================================================
// Page
// ============================================================================

export default async function ClassYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (isNaN(year) || !VALID_YEARS.includes(year)) {
    notFound();
  }

  const sections = await getClassYearData(year);

  return (
    <div style={{ minHeight: "100vh", background: "var(--psp-navy, #0a1628)", padding: "2rem 1rem" }}>
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
          <Link href="/recruit-finder" style={{ color: "var(--psp-gold)", textDecoration: "none" }}>
            Recruit Finder
          </Link>
          {" > "}
          <span>Class of {year}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            className="psp-h1-lg text-white"
            style={{
              marginBottom: "0.5rem",
            }}
          >
            CLASS OF {year}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", maxWidth: "600px", margin: 0 }}>
            Top performers from the graduating class of {year} across all sports.
            Stats from the current season.
          </p>
        </div>

        {/* Class Year Navigation */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {VALID_YEARS.map((y) => (
            <Link
              key={y}
              href={`/class/${y}`}
              style={{
                padding: "0.45rem 1.25rem",
                borderRadius: "999px",
                border: y === year ? "2px solid var(--psp-gold)" : "2px solid rgba(255,255,255,0.15)",
                background: y === year ? "var(--psp-gold)" : "transparent",
                color: y === year ? "var(--psp-navy)" : "rgba(255,255,255,0.7)",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              {y}
            </Link>
          ))}
        </div>

        {/* Sport Sections */}
        {sections.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem" }}>
              No current season data available for the Class of {year}.
            </p>
            <Link
              href="/recruit-finder"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                background: "var(--psp-gold)",
                color: "var(--psp-navy)",
                borderRadius: "8px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Try Recruit Finder
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {sections.map((section) => (
              <section key={section.sportSlug}>
                {/* Sport Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div
                    style={{
                      width: "4px",
                      height: "28px",
                      borderRadius: "2px",
                      background: section.color,
                    }}
                  />
                  <h2
                    className="psp-h2 text-white"
                  >
                    {section.sport}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Top 10 by {section.primaryStatLabel}
                  </span>
                </div>

                {/* Player Cards Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {section.players.map((player, idx) => (
                    <Link
                      key={player.id}
                      href={`/${section.sportSlug}/players/${player.slug}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          overflow: "hidden",
                          transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                        className="hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <div style={{ height: "3px", background: section.color }} />
                        <div style={{ padding: "1rem 1.25rem" }}>
                          {/* Rank + Name */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
                            <span
                              className="font-bebas"
                              style={{
                                color: section.color,
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                minWidth: "1.5rem",
                              }}
                            >
                              {idx + 1}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: "0.95rem",
                                  color: "#fff",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {player.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.78rem",
                                  color: "rgba(255,255,255,0.5)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {player.schoolName}
                              </div>
                            </div>
                            {player.position && (
                              <span
                                style={{
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "4px",
                                  background: `${section.color}22`,
                                  color: section.color,
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                }}
                              >
                                {player.position}
                              </span>
                            )}
                          </div>

                          {/* Stats Row */}
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                            {section.sportSlug === "football" && (
                              <>
                                <StatChip label="Total Yds" value={player.totalYards} color={section.color} />
                                <StatChip label="Pass Yds" value={player.passYards} color={section.color} />
                                <StatChip label="Rush Yds" value={player.rushYards} color={section.color} />
                                <StatChip label="TDs" value={player.totalTd} color={section.color} />
                              </>
                            )}
                            {section.sportSlug === "basketball" && (
                              <>
                                <StatChip label="PPG" value={player.ppg} decimal color={section.color} />
                                <StatChip label="RPG" value={player.rpg} decimal color={section.color} />
                                <StatChip label="APG" value={player.apg} decimal color={section.color} />
                              </>
                            )}
                            {section.sportSlug === "baseball" && (
                              <>
                                <StatChip label="AVG" value={player.battingAvg} decimal3 color={section.color} />
                                <StatChip label="HR" value={player.homeRuns} color={section.color} />
                                <StatChip label="RBI" value={player.rbi} color={section.color} />
                              </>
                            )}
                            {player.awardsCount > 0 && (
                              <span
                                style={{
                                  background: "var(--psp-gold)",
                                  color: "var(--psp-navy)",
                                  borderRadius: "999px",
                                  padding: "0.15rem 0.55rem",
                                  fontSize: "0.72rem",
                                  fontWeight: 800,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.2rem",
                                }}
                              >
                                {player.awardsCount} Award{player.awardsCount > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: "3rem",
            padding: "1.5rem",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              className="font-bebas"
              style={{
                color: "var(--psp-gold)",
                fontSize: "1.25rem",
                margin: 0,
              }}
            >
              LOOKING FOR SPECIFIC RECRUITS?
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
              Use the Recruit Finder to search by position, league, and minimum stat thresholds.
            </p>
          </div>
          <Link
            href="/recruit-finder"
            style={{
              padding: "0.5rem 1.25rem",
              background: "var(--psp-gold)",
              color: "var(--psp-navy)",
              borderRadius: "8px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Recruit Finder
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Stat Chip Component
// ============================================================================

function StatChip({
  label,
  value,
  color,
  decimal,
  decimal3,
}: {
  label: string;
  value: number | null | undefined;
  color: string;
  decimal?: boolean;
  decimal3?: boolean;
}) {
  if (value == null) return null;
  const display = decimal3
    ? Number(value).toFixed(3)
    : decimal
    ? Number(value).toFixed(1)
    : Number(value).toLocaleString();

  return (
    <span
      style={{
        padding: "0.15rem 0.5rem",
        borderRadius: "6px",
        background: "rgba(255,255,255,0.06)",
        fontSize: "0.72rem",
        color: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{label}</span>
      <span style={{ fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{display}</span>
    </span>
  );
}
