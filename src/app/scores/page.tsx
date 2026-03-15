import { Metadata } from "next";
import Link from "next/link";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SportIcon from "@/components/ui/SportIcon";
import { createStaticClient } from "@/lib/supabase/static";

export const metadata: Metadata = {
  title: "Scores | PhillySportsPack",
  description: "Live and recent scores from Philadelphia high school sports. Football, basketball, baseball, and more.",
  openGraph: {
    title: "Scores | PhillySportsPack",
    description: "Live and recent scores from Philadelphia high school sports.",
    url: "https://phillysportspack.com/scores",
  },
};

export const revalidate = 1800; // 30 minutes

interface ScoresPageProps {
  searchParams: Promise<{ sport?: string }>;
}

interface ScoreGame {
  id: number;
  sport_id: string;
  game_date: string | null;
  home_score: number | null;
  away_score: number | null;
  home_school: { name: string; slug: string } | null;
  away_school: { name: string; slug: string } | null;
  seasons: { label: string } | null;
}

export default async function ScoresPage({ searchParams }: ScoresPageProps) {
  const params = await searchParams;
  const selectedSport = params.sport || "all";

  // Direct lightweight query — only recent games with scores, limit 50
  let allScores: ScoreGame[] = [];
  try {
    const supabase = createStaticClient();
    let query = supabase
      .from("games")
      .select(
        `id, sport_id, game_date, home_score, away_score,
         home_school:schools!games_home_school_id_fkey(name, slug),
         away_school:schools!games_away_school_id_fkey(name, slug),
         seasons(label)`
      )
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .not("game_date", "is", null)
      .order("game_date", { ascending: false })
      .limit(50);

    if (selectedSport !== "all") {
      query = query.eq("sport_id", selectedSport);
    }

    const { data } = await query;
    allScores = (data as unknown as ScoreGame[]) ?? [];
  } catch {
    // fail gracefully — show empty state
  }

  // Group by date
  const groupedByDate = new Map<string, ScoreGame[]>();
  allScores.forEach((game) => {
    const date = game.game_date || "No Date";
    if (!groupedByDate.has(date)) {
      groupedByDate.set(date, []);
    }
    groupedByDate.get(date)!.push(game);
  });

  const sortedDates = Array.from(groupedByDate.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <main id="main-content" className="flex-1">
      <Breadcrumb items={[{ label: "Scores", href: "/scores" }]} />

      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "2rem 1rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-bebas)", marginBottom: "0.5rem" }}>
          Scores
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#ccc", marginBottom: "1.5rem" }}>
          Recent scores from Philadelphia high school sports
        </p>

        {/* Sport Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/scores"
            className={`pill ${selectedSport === "all" ? "active" : ""}`}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid var(--psp-gold)",
              background: selectedSport === "all" ? "var(--psp-gold)" : "transparent",
              color: selectedSport === "all" ? "var(--psp-navy)" : "var(--psp-gold)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            All Sports
          </Link>
          {VALID_SPORTS.map((sport) => (
            <Link
              key={sport}
              href={`/scores?sport=${sport}`}
              className={`pill ${selectedSport === sport ? "active" : ""}`}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: `1px solid ${SPORT_COLORS_HEX[sport] || "var(--psp-gold)"}`,
                background: selectedSport === sport ? (SPORT_COLORS_HEX[sport] || "var(--psp-gold)") : "transparent",
                color: selectedSport === sport ? "white" : (SPORT_COLORS_HEX[sport] || "var(--psp-gold)"),
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {SPORT_META[sport]?.name || sport}
            </Link>
          ))}
        </div>
      </div>

      {/* Scores List */}
      <div className="container" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem 2rem" }}>
        {sortedDates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#999",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>No scores found.</p>
            <Link
              href="/scores/schedule"
              style={{
                color: "var(--psp-gold)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View upcoming schedule →
            </Link>
          </div>
        ) : (
          sortedDates.map((date) => {
            const games = groupedByDate.get(date) || [];
            const dateObj = new Date(date + "T12:00:00");
            const dateLabel = new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(dateObj);

            return (
              <div key={date} style={{ marginBottom: "2rem" }}>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontFamily: "var(--font-bebas)",
                    color: "var(--psp-gold)",
                    marginBottom: "1rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "2px solid #333",
                  }}
                >
                  {dateLabel}
                </h2>

                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {games.map((game) => {
                    const homeWin = game.home_score !== null && game.away_score !== null && game.home_score > game.away_score;
                    const awayWin = game.away_score !== null && game.home_score !== null && game.away_score > game.home_score;

                    return (
                      <Link
                        key={game.id}
                        href={`/${game.sport_id}/games/${game.id}`}
                        style={{
                          background: "linear-gradient(135deg, #1a1a1a 0%, #222 100%)",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          padding: "1rem",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "1rem",
                          textDecoration: "none",
                          cursor: "pointer",
                          transition: "border-color 0.2s ease",
                        }}
                      >
                        {/* Sport Badge */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            minWidth: "90px",
                          }}
                        >
                          <SportIcon sport={game.sport_id} size="sm" />
                          <span style={{ fontSize: "0.75rem", color: "#999", fontWeight: 600 }}>
                            {SPORT_META[game.sport_id as keyof typeof SPORT_META]?.name || game.sport_id}
                          </span>
                        </div>

                        {/* Game Score */}
                        <div
                          style={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            alignItems: "center",
                            gap: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          {/* Away School */}
                          <span
                            style={{
                              color: awayWin ? "var(--psp-gold)" : "#ccc",
                              fontWeight: awayWin ? 700 : 500,
                              fontSize: "0.9rem",
                            }}
                          >
                            {game.away_school?.name || "TBD"}
                          </span>

                          {/* Score */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontSize: "1.5rem",
                              fontFamily: "var(--font-bebas)",
                              fontWeight: 700,
                            }}
                          >
                            <span style={{ color: awayWin ? "var(--psp-gold)" : "#999" }}>
                              {game.away_score ?? "-"}
                            </span>
                            <span style={{ color: "#666", fontSize: "1rem" }}>–</span>
                            <span style={{ color: homeWin ? "var(--psp-gold)" : "#999" }}>
                              {game.home_score ?? "-"}
                            </span>
                          </div>

                          {/* Home School */}
                          <span
                            style={{
                              color: homeWin ? "var(--psp-gold)" : "#ccc",
                              fontWeight: homeWin ? 700 : 500,
                              fontSize: "0.9rem",
                            }}
                          >
                            {game.home_school?.name || "TBD"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
