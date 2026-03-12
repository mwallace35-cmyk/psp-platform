import { Metadata } from "next";
import Link from "next/link";
import { getRecentScores, getGamesWithBoxScores } from "@/lib/data/games";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SportIcon from "@/components/ui/SportIcon";

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

export default async function ScoresPage({
  searchParams,
}: ScoresPageProps) {
  const params = await searchParams;
  const selectedSport = params.sport || "all";

  // Fetch recent scores
  const allScores = selectedSport === "all"
    ? await getRecentScores(undefined, 100)
    : await getRecentScores(selectedSport, 100);

  // Get games with box scores
  const gameIds = allScores.map((g) => g.id);
  const gamesWithBoxScores = await getGamesWithBoxScores(gameIds);

  // Group by date
  const groupedByDate = new Map<string, typeof allScores>();
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
          Recent & live scores from Philadelphia high school sports
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
      <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
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
            const dateObj = new Date(date);
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

                <div style={{ display: "grid", gap: "1rem" }}>
                  {games.map((game) => {
                    const homeWin = game.home_score !== null && game.away_score !== null && game.home_score > game.away_score;
                    const awayWin = game.away_score !== null && game.home_score !== null && game.away_score > game.home_score;
                    const hasBoxScore = gamesWithBoxScores.has(game.id);
                    const sportMeta = SPORT_META[game.sport_id as keyof typeof SPORT_META];

                    return (
                      <div
                        key={game.id}
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
                        }}
                      >
                        {/* Sport Badge */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            minWidth: "100px",
                          }}
                        >
                          <SportIcon sport={game.sport_id} size="sm" />
                          <span style={{ fontSize: "0.8rem", color: "#999", fontWeight: 600 }}>
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
                            gap: "1rem",
                            textAlign: "center",
                          }}
                        >
                          {/* Away School */}
                          <Link
                            href={game.away_school ? `/football/schools/${game.away_school.slug}` : "#"}
                            style={{
                              textDecoration: "none",
                              color: awayWin ? "var(--psp-gold)" : "#ccc",
                              fontWeight: awayWin ? 700 : 500,
                              fontSize: "0.95rem",
                            }}
                          >
                            {game.away_school?.name || "TBD"}
                          </Link>

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
                            <span style={{ color: "#666", fontSize: "1rem" }}>vs</span>
                            <span style={{ color: homeWin ? "var(--psp-gold)" : "#999" }}>
                              {game.home_score ?? "-"}
                            </span>
                          </div>

                          {/* Home School */}
                          <Link
                            href={game.home_school ? `/football/schools/${game.home_school.slug}` : "#"}
                            style={{
                              textDecoration: "none",
                              color: homeWin ? "var(--psp-gold)" : "#ccc",
                              fontWeight: homeWin ? 700 : 500,
                              fontSize: "0.95rem",
                            }}
                          >
                            {game.home_school?.name || "TBD"}
                          </Link>
                        </div>

                        {/* Box Score Link */}
                        {hasBoxScore && (
                          <Link
                            href={`/${game.sport_id}/games/${game.id}`}
                            style={{
                              padding: "0.5rem 1rem",
                              background: "var(--psp-blue)",
                              color: "white",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Box Score
                          </Link>
                        )}
                      </div>
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
