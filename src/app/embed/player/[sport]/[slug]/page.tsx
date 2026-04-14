import { notFound } from "next/navigation";
import Link from "next/link";
import { createStaticClient } from "@/lib/supabase/static";
import { SPORT_EMOJI } from "@/lib/sports";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string; slug: string };

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#3b82f6",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};


export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { sport, slug } = await params;
  return {
    title: `Player Card — PhillySportsPack`,
    robots: { index: false, follow: false },
    other: { "X-Frame-Options": "ALLOWALL" },
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/players/${slug}`,
    },
  };
}

interface StatDisplay {
  label: string;
  value: string;
}

async function getPlayerCardData(sport: string, slug: string) {
  const supabase = createStaticClient();

  const { data: player } = await supabase
    .from("players")
    .select(
      "id, name, slug, graduation_year, positions, schools:schools!players_primary_school_id_fkey(name, slug)"
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (!player) return null;

  const p = player as any;
  const school = Array.isArray(p.schools) ? p.schools[0] : p.schools;
  const stats: StatDisplay[] = [];

  if (sport === "football") {
    const { data } = await supabase
      .from("football_player_seasons")
      .select("rush_yards, rush_td, pass_yards, pass_td, rec_yards, rec_td, total_td, total_yards")
      .eq("player_id", p.id);

    if (data && data.length > 0) {
      const totals = data.reduce(
        (acc: any, row: any) => ({
          rushYards: acc.rushYards + (row.rush_yards || 0),
          rushTd: acc.rushTd + (row.rush_td || 0),
          passYards: acc.passYards + (row.pass_yards || 0),
          recYards: acc.recYards + (row.rec_yards || 0),
          totalTd: acc.totalTd + (row.total_td || 0),
        }),
        { rushYards: 0, rushTd: 0, passYards: 0, recYards: 0, totalTd: 0 }
      );

      if (totals.rushYards > 0)
        stats.push({ label: "Rush Yds", value: totals.rushYards.toLocaleString() });
      if (totals.passYards > 0)
        stats.push({ label: "Pass Yds", value: totals.passYards.toLocaleString() });
      if (totals.recYards > 0)
        stats.push({ label: "Rec Yds", value: totals.recYards.toLocaleString() });
      if (totals.totalTd > 0)
        stats.push({ label: "Total TD", value: String(totals.totalTd) });
    }
  } else if (sport === "basketball" || sport === "girls-basketball") {
    const { data } = await supabase
      .from("basketball_player_seasons")
      .select("points, ppg, rebounds, assists, games_played")
      .eq("player_id", p.id);

    if (data && data.length > 0) {
      const totals = data.reduce(
        (acc: any, row: any) => ({
          points: acc.points + (row.points || 0),
          rebounds: acc.rebounds + (row.rebounds || 0),
          assists: acc.assists + (row.assists || 0),
          games: acc.games + (row.games_played || 0),
        }),
        { points: 0, rebounds: 0, assists: 0, games: 0 }
      );

      if (totals.points > 0)
        stats.push({ label: "Points", value: totals.points.toLocaleString() });
      if (totals.games > 0)
        stats.push({
          label: "PPG",
          value: (totals.points / totals.games).toFixed(1),
        });
      if (totals.rebounds > 0)
        stats.push({ label: "Rebounds", value: totals.rebounds.toLocaleString() });
      if (totals.assists > 0)
        stats.push({ label: "Assists", value: totals.assists.toLocaleString() });
    }
  } else if (sport === "baseball") {
    const { data } = await supabase
      .from("baseball_player_seasons")
      .select("batting_avg, home_runs, rbi, era")
      .eq("player_id", p.id);

    if (data && data.length > 0) {
      const best = data.reduce((best: any, row: any) => {
        if (row.batting_avg && (!best.avg || row.batting_avg > best.avg))
          best.avg = row.batting_avg;
        best.hr = (best.hr || 0) + (row.home_runs || 0);
        best.rbi = (best.rbi || 0) + (row.rbi || 0);
        if (row.era && (!best.era || row.era < best.era)) best.era = row.era;
        return best;
      }, {});

      if (best.avg) stats.push({ label: "AVG", value: Number(best.avg).toFixed(3) });
      if (best.hr > 0) stats.push({ label: "HR", value: String(best.hr) });
      if (best.rbi > 0) stats.push({ label: "RBI", value: String(best.rbi) });
      if (best.era) stats.push({ label: "ERA", value: Number(best.era).toFixed(2) });
    }
  }

  // Awards count
  const { count: awardsCount } = await supabase
    .from("awards")
    .select("id", { count: "exact", head: true })
    .eq("player_id", p.id);

  return {
    name: p.name,
    slug: p.slug,
    school: school?.name || "Unknown",
    schoolSlug: school?.slug || "",
    gradYear: p.graduation_year,
    positions: p.positions || [],
    stats,
    awards: awardsCount || 0,
  };
}

export default async function EmbedPlayerCard({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { sport, slug } = await params;
  const player = await getPlayerCardData(sport, slug);
  if (!player) notFound();

  const sportColor = SPORT_COLORS[sport] || "#3b82f6";
  const emoji = SPORT_EMOJI[sport] || "";
  const profileUrl = `https://phillysportspack.com/${sport}/players/${slug}`;

  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "'DM Sans', -apple-system, sans-serif",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: 400,
            borderRadius: 16,
            overflow: "hidden",
            background: "#0a1628",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 20px 16px",
              background: `linear-gradient(135deg, ${sportColor}20 0%, #0a1628 100%)`,
              borderBottom: `3px solid ${sportColor}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {/* Initials avatar */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: sportColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {player.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}
                >
                  {player.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: 6,
                  }}
                >
                  {player.school}
                  {player.gradYear && ` \u00B7 Class of ${player.gradYear}`}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: `${sportColor}30`,
                      color: sportColor,
                    }}
                  >
                    {emoji}{" "}
                    {sport.charAt(0).toUpperCase() + sport.slice(1).replace("-", " ")}
                  </span>
                  {player.positions.slice(0, 2).map((pos: string) => (
                    <span
                      key={pos}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 99,
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {player.stats.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(player.stats.length, 4)}, 1fr)`,
                gap: 1,
                padding: "1px 0",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              {player.stats.slice(0, 4).map((stat: StatDisplay) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    padding: "14px 8px",
                    background: "#0a1628",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#f0a500",
                      lineHeight: 1,
                      marginBottom: 4,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Awards bar */}
          {player.awards > 0 && (
            <div
              style={{
                padding: "10px 20px",
                background: "rgba(240,165,0,0.08)",
                borderTop: "1px solid rgba(240,165,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>&#x1F3C6;</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#f0a500",
                }}
              >
                {player.awards} Award{player.awards !== 1 ? "s" : ""} &amp; Honor
                {player.awards !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              padding: "10px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href={profileUrl}
              target="_blank"
              rel="noopener"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: sportColor,
                textDecoration: "none",
              }}
            >
              View Full Profile &#x2192;
            </Link>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.02em",
              }}
            >
              PhillySportsPack.com
            </span>
          </div>
        </div>
      </body>
    </html>
  );
}
