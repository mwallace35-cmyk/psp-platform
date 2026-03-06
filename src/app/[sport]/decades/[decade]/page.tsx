import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META } from "@/lib/sports";
import { createClient } from "@/lib/supabase/server";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: revalidate daily

const VALID_DECADES = ["2000s", "2010s", "2020s"] as const;
type Decade = (typeof VALID_DECADES)[number];

function isValidDecade(decade: string): decade is Decade {
  return VALID_DECADES.includes(decade as Decade);
}

function decadeToYearRange(decade: Decade): [number, number] {
  const ranges: Record<Decade, [number, number]> = {
    "2000s": [2000, 2009],
    "2010s": [2010, 2019],
    "2020s": [2020, 2029],
  };
  return ranges[decade];
}

type PageParams = { sport: string; decade: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, decade } = await params;
  if (!isValidSport(sport) || !isValidDecade(decade)) return {};

  const meta = SPORT_META[sport];
  return {
    title: `${decade} Leaders — ${meta.name} — PhillySportsPack`,
    description: `Top players from the ${decade} in Philadelphia high school ${meta.name.toLowerCase()}.`,
  };
}

export async function generateStaticParams() {
  const sports = ["football", "basketball", "baseball"];
  const decades = ["2000s", "2010s", "2020s"];

  return sports.flatMap((sport) =>
    decades.map((decade) => ({
      sport,
      decade,
    }))
  );
}

interface FootballLeader {
  player_id: number;
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  total_rush_yards: number;
  total_pass_yards: number;
  total_rec_yards: number;
  total_td: number;
}

interface BasketballLeader {
  player_id: number;
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  total_points: number;
  seasons_played: number;
}

async function getFootballDecadeLeaders(startYear: number, endYear: number) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("football_player_seasons")
      .select(
        `
        player_id,
        players:players (name, slug),
        schools:schools (name, slug),
        rush_yards,
        pass_yards,
        rec_yards,
        total_td,
        seasons:seasons (year_start)
      `
      )
      .gte("seasons.year_start", startYear)
      .lte("seasons.year_start", endYear);

    if (error) {
      console.error("[decades] Football query error:", error);
      return [];
    }

    if (!data) return [];

    // Aggregate by player
    const playerMap = new Map<number, FootballLeader>();

    for (const row of data) {
      const playerId = row.player_id;
      const player = row.players as any;
      const school = row.schools as any;

      if (!playerId || !player || !school) continue;

      const key = playerId;
      const existing = playerMap.get(key);

      const rushYards = (row.rush_yards as number) || 0;
      const passYards = (row.pass_yards as number) || 0;
      const recYards = (row.rec_yards as number) || 0;
      const totalTd = (row.total_td as number) || 0;

      if (existing) {
        existing.total_rush_yards += rushYards;
        existing.total_pass_yards += passYards;
        existing.total_rec_yards += recYards;
        existing.total_td += totalTd;
      } else {
        playerMap.set(key, {
          player_id: playerId,
          player_name: player.name || "Unknown",
          player_slug: player.slug || "",
          school_name: school.name || "Unknown",
          school_slug: school.slug || "",
          total_rush_yards: rushYards,
          total_pass_yards: passYards,
          total_rec_yards: recYards,
          total_td: totalTd,
        });
      }
    }

    // Sort by total yards (rush + pass + rec) descending, limit to 25
    return Array.from(playerMap.values())
      .sort((a, b) => {
        const aTotal = a.total_rush_yards + a.total_pass_yards + a.total_rec_yards;
        const bTotal = b.total_rush_yards + b.total_pass_yards + b.total_rec_yards;
        return bTotal - aTotal;
      })
      .slice(0, 25);
  } catch (err) {
    console.error("[decades] Football error:", err);
    return [];
  }
}

async function getBasketballDecadeLeaders(startYear: number, endYear: number) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("basketball_player_seasons")
      .select(
        `
        player_id,
        players:players (name, slug),
        schools:schools (name, slug),
        points,
        seasons:seasons (year_start)
      `
      )
      .gte("seasons.year_start", startYear)
      .lte("seasons.year_start", endYear);

    if (error) {
      console.error("[decades] Basketball query error:", error);
      return [];
    }

    if (!data) return [];

    // Aggregate by player
    const playerMap = new Map<number, BasketballLeader>();

    for (const row of data) {
      const playerId = row.player_id;
      const player = row.players as any;
      const school = row.schools as any;

      if (!playerId || !player || !school) continue;

      const key = playerId;
      const points = (row.points as number) || 0;

      if (playerMap.has(key)) {
        const existing = playerMap.get(key)!;
        existing.total_points += points;
        existing.seasons_played += 1;
      } else {
        playerMap.set(key, {
          player_id: playerId,
          player_name: player.name || "Unknown",
          player_slug: player.slug || "",
          school_name: school.name || "Unknown",
          school_slug: school.slug || "",
          total_points: points,
          seasons_played: 1,
        });
      }
    }

    // Sort by total points descending, limit to 25
    return Array.from(playerMap.values())
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, 25);
  } catch (err) {
    console.error("[decades] Basketball error:", err);
    return [];
  }
}

export default async function DecadeLeadersPage({ params }: { params: Promise<PageParams> }) {
  const { sport, decade } = await params;

  if (!isValidSport(sport) || !isValidDecade(decade)) {
    notFound();
  }

  const meta = SPORT_META[sport];
  const [startYear, endYear] = decadeToYearRange(decade);

  let leaders: any[] = [];

  if (sport === "football") {
    leaders = await getFootballDecadeLeaders(startYear, endYear);
  } else if (sport === "basketball") {
    leaders = await getBasketballDecadeLeaders(startYear, endYear);
  } else {
    notFound();
  }

  const decadeLabel = `${startYear}-${endYear}`;

  // Stat columns based on sport
  const statColumns =
    sport === "football"
      ? [
          { key: "total_rush_yards", label: "Rush Yds" },
          { key: "total_pass_yards", label: "Pass Yds" },
          { key: "total_rec_yards", label: "Rec Yds" },
          { key: "total_td", label: "TDs" },
        ]
      : [
          { key: "total_points", label: "Points" },
          { key: "seasons_played", label: "Seasons" },
        ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ━━ HEADER ━━ */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)`,
          color: "white",
          padding: "40px 20px",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Decades" },
              { label: decade },
            ]}
          />

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>
              {decadeLabel} Leaders
            </div>
            <h1
              style={{
                fontSize: 48,
                fontWeight: 700,
                fontFamily: "Bebas Neue, sans-serif",
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              {meta.emoji} {decade} All-Decade Leaders
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)" }}>
              Top performers from {decadeLabel} in Philadelphia high school {meta.name.toLowerCase()}
            </p>
          </div>

          {/* Decade tabs */}
          <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["2000s", "2010s", "2020s"].map((d) => (
              <Link
                key={d}
                href={`/${sport}/decades/${d}`}
                style={{
                  padding: "10px 18px",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  background: d === decade ? "var(--psp-gold)" : "rgba(255,255,255,0.15)",
                  color: d === decade ? "var(--psp-navy)" : "white",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ CONTENT ━━ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px" }}>
        {leaders.length > 0 ? (
          <>
            <div style={{ overflowX: "auto", marginBottom: 30 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                }}
              >
                <thead>
                  <tr style={{ background: "var(--psp-navy)", color: "white" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 13 }}>
                      #
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 13 }}>
                      Player
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 13 }}>
                      School
                    </th>
                    {statColumns.map((col) => (
                      <th
                        key={col.key}
                        style={{
                          padding: "12px 16px",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaders.map((leader, idx) => {
                    const isTop3 = idx < 3;
                    return (
                      <tr
                        key={leader.player_id}
                        style={{
                          borderTop: "1px solid #f3f4f6",
                          background: isTop3 ? "rgba(240, 165, 0, 0.04)" : "white",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: 700,
                            color: "var(--psp-gold)",
                            fontSize: 14,
                          }}
                        >
                          {isTop3 && ["🥇", "🥈", "🥉"][idx]}
                          {idx + 1}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <Link
                            href={`/${sport}/players/${leader.player_slug}`}
                            style={{
                              color: "var(--psp-navy)",
                              fontWeight: 600,
                              fontSize: 14,
                              textDecoration: "none",
                            }}
                          >
                            {leader.player_name}
                          </Link>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <Link
                            href={`/${sport}/schools/${leader.school_slug}`}
                            style={{
                              color: "var(--psp-gray-600)",
                              fontSize: 14,
                              textDecoration: "none",
                            }}
                          >
                            {leader.school_name}
                          </Link>
                        </td>
                        {statColumns.map((col) => (
                          <td
                            key={col.key}
                            style={{
                              padding: "12px 16px",
                              textAlign: "right",
                              fontWeight: 700,
                              fontSize: 14,
                              color: "var(--psp-navy)",
                            }}
                          >
                            {(leader[col.key] as number)?.toLocaleString() || "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <PSPPromo size="banner" variant={3} />
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📊</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--psp-navy)", marginBottom: 12 }}>
              No data available
            </h2>
            <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 24 }}>
              We're still compiling {meta.name.toLowerCase()} statistics for the {decade}. Check back soon!
            </p>
            <Link
              href={`/${sport}`}
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: "var(--psp-navy)",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Back to {meta.name}
            </Link>
          </div>
        )}
      </div>

      {/* ━━ SCHEMA ━━ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${decade} ${meta.name} Leaders`,
            url: `https://phillysportspack.com/${sport}/decades/${decade}`,
            numberOfItems: leaders.length,
            itemListElement: leaders.slice(0, 10).map((leader, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: leader.player_name,
              url: `https://phillysportspack.com/${sport}/players/${leader.player_slug}`,
            })),
          }),
        }}
      />
    </div>
  );
}
