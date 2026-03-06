import Link from "next/link";
import type { Metadata } from "next";
import HeaderWithScores from "@/components/layout/HeaderWithScores";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { createClient } from "@/lib/supabase/server";
import { SPORT_META } from "@/lib/data";
export const metadata: Metadata = {
  title: "Scores — PhillySportsPack",
  description:
    "Browse box scores and game results for Philadelphia high school football, basketball, baseball, and more.",
};

export const revalidate = 300; // 5 min

const SPORTS = [
  { id: "all", label: "All Sports" },
  { id: "football", label: "Football", emoji: "🏈" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "baseball", label: "Baseball", emoji: "⚾" },
  { id: "lacrosse", label: "Lacrosse", emoji: "🥍" },
  { id: "soccer", label: "Soccer", emoji: "⚽" },
];

async function getScores(sport?: string | null) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("games")
      .select(
        "id, sport_id, home_school_id, away_school_id, home_score, away_score, game_date, game_type, venue, season_id, seasons(label), home_school:schools!games_home_school_id_fkey(id, name, short_name, slug, city, mascot), away_school:schools!games_away_school_id_fkey(id, name, short_name, slug, city, mascot)"
      )
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .order("game_date", { ascending: false, nullsFirst: false })
      .limit(100);

    if (sport && sport !== "all") {
      query = query.eq("sport_id", sport);
    }

    const { data, error } = await query;
    if (error) console.error("[getScores] Supabase error:", error.message);

    // If FK joins failed (school objects null but IDs exist), fetch school names separately
    const games = data ?? [];
    const missingSchoolIds = new Set<number>();
    for (const g of games) {
      if (!g.home_school && g.home_school_id) missingSchoolIds.add(g.home_school_id);
      if (!g.away_school && g.away_school_id) missingSchoolIds.add(g.away_school_id);
    }

    if (missingSchoolIds.size > 0) {
      const { data: schools } = await supabase
        .from("schools")
        .select("id, name, short_name, slug")
        .in("id", Array.from(missingSchoolIds));
      const schoolMap = new Map((schools ?? []).map(s => [s.id, s]));
      for (const g of games) {
        if (!g.home_school && g.home_school_id) (g as any).home_school = schoolMap.get(g.home_school_id) || null;
        if (!g.away_school && g.away_school_id) (g as any).away_school = schoolMap.get(g.away_school_id) || null;
      }
    }

    return games;
  } catch (err) {
    console.error("[getScores] Unexpected error:", err);
    return [];
  }
}

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const params = await searchParams;
  const activeSport = params.sport || "all";
  const games = await getScores(activeSport);

  // Group games by date — put dated games first, then undated by season
  const gamesByDate = new Map<string, any[]>();
  for (const game of games) {
    let dateKey: string;
    if (game.game_date) {
      // Parse as local date (game_date is YYYY-MM-DD format)
      const [year, month, day] = game.game_date.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      dateKey = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else {
      // Group undated games by season label
      const s = game.seasons as any;
      const seasonLabel = Array.isArray(s) ? s[0]?.label : s?.label;
      dateKey = seasonLabel ? `${seasonLabel} Season` : "Other Games";
    }
    if (!gamesByDate.has(dateKey)) gamesByDate.set(dateKey, []);
    gamesByDate.get(dateKey)!.push(game);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderWithScores />

      <div className="max-w-7xl mx-auto px-4 py-4 w-full">
        <Breadcrumb items={[{ label: "Scores" }]} />
      </div>

      {/* Page Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0f2040 100%)",
          padding: "40px 20px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 36,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            📊 Scores & Box Scores
          </h1>
          <p style={{ opacity: 0.8, fontSize: 14 }}>
            {games.length.toLocaleString()} game results across Philadelphia
            high school sports. Click any game for the full box score.
          </p>
        </div>
      </section>

      {/* Sport Filter Tabs */}
      <div
        style={{
          background: "var(--card-bg)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 90,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: 4,
            overflowX: "auto",
          }}
        >
          {SPORTS.map((s) => (
            <Link
              key={s.id}
              href={`/scores${s.id !== "all" ? `?sport=${s.id}` : ""}`}
              style={{
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: activeSport === s.id ? 800 : 500,
                color:
                  activeSport === s.id ? "var(--psp-gold)" : "var(--g400)",
                borderBottom:
                  activeSport === s.id
                    ? "3px solid var(--psp-gold)"
                    : "3px solid transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {s.emoji ? `${s.emoji} ` : ""}
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Scores Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content — grouped by date */}
          <div className="lg:col-span-2 space-y-8">
            {games.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "var(--g400)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  No scores found
                </h2>
                <p style={{ fontSize: 14 }}>
                  {activeSport !== "all"
                    ? `No ${activeSport} games with final scores yet.`
                    : "No games with final scores yet."}
                </p>
              </div>
            ) : (
              Array.from(gamesByDate.entries()).map(([dateLabel, dateGames]) => (
                <div key={dateLabel}>
                  <h2
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "var(--g400)",
                      marginBottom: 12,
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: 8,
                    }}
                  >
                    {dateLabel}
                  </h2>
                  <div className="space-y-3">
                    {dateGames.map((game: any) => (
                      <ScoreCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PSPPromo size="sidebar" variant={1} />

            <div className="sidebar-widget">
              <h3 className="sw-head">Quick Links</h3>
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/football/championships" style={{ fontSize: 13, color: "var(--psp-blue)" }}>🏆 Football Championships</Link>
                <Link href="/basketball/championships" style={{ fontSize: 13, color: "var(--psp-blue)" }}>🏆 Basketball Championships</Link>
                <Link href="/football/leaderboards/rushing_yards" style={{ fontSize: 13, color: "var(--psp-blue)" }}>📊 Football Leaderboards</Link>
                <Link href="/basketball/leaderboards/points" style={{ fontSize: 13, color: "var(--psp-blue)" }}>📊 Basketball Leaderboards</Link>
                <Link href="/rivalries" style={{ fontSize: 13, color: "var(--psp-blue)" }}>🔥 Rivalries</Link>
              </div>
            </div>

            <PSPPromo size="sidebar" variant={3} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Individual Score Card ── */
const SPORT_ABBREV: Record<string, string> = {
  football: "FB",
  basketball: "BB",
  baseball: "BSB",
  lacrosse: "LAX",
  soccer: "SOC",
  "track-field": "TF",
  wrestling: "WR",
};

function ScoreCard({ game }: { game: any }) {
  const home = game.home_school;
  const away = game.away_school;
  const homeName = home?.short_name || home?.name || "Team A";
  const awayName = away?.short_name || away?.name || "Team B";
  const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
  const awayWin = (game.away_score ?? 0) > (game.home_score ?? 0);
  const sportAbbr = SPORT_ABBREV[game.sport_id] || game.sport_id;
  const gameType =
    game.game_type && game.game_type !== "regular"
      ? game.game_type.charAt(0).toUpperCase() + game.game_type.slice(1)
      : null;

  return (
    <Link
      href={`/${game.sport_id}/games/${game.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "16px 20px",
          transition: "border-color 0.15s, box-shadow 0.15s",
          cursor: "pointer",
        }}
        className="hover-card"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "var(--psp-gold)",
                background: "rgba(240,165,0,0.1)",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              {sportAbbr}
            </span>
            {gameType && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#fff",
                  background: "var(--psp-gold)",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {gameType}
              </span>
            )}
          </div>
          <span style={{ fontSize: 10, color: "var(--g400)", fontWeight: 600 }}>
            Final
          </span>
        </div>

        {/* Away Team */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 4,
                height: 24,
                borderRadius: 2,
                background: awayWin ? "var(--psp-gold)" : "transparent",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: awayWin ? 800 : 500,
                color: awayWin ? "var(--text)" : "var(--g400)",
              }}
            >
              {awayName}
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: "'Barlow Condensed', sans-serif",
              color: awayWin ? "var(--text)" : "var(--g400)",
            }}
          >
            {game.away_score}
          </span>
        </div>

        {/* Home Team */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 4,
                height: 24,
                borderRadius: 2,
                background: homeWin ? "var(--psp-gold)" : "transparent",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: homeWin ? 800 : 500,
                color: homeWin ? "var(--text)" : "var(--g400)",
              }}
            >
              {homeName}
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: "'Barlow Condensed', sans-serif",
              color: homeWin ? "var(--text)" : "var(--g400)",
            }}
          >
            {game.home_score}
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 12,
            paddingTop: 8,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {game.venue && (
            <span style={{ fontSize: 11, color: "var(--g400)" }}>
              📍 {game.venue}
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--psp-blue)",
              marginLeft: "auto",
            }}
          >
            Box Score →
          </span>
        </div>
      </div>
    </Link>
  );
}
