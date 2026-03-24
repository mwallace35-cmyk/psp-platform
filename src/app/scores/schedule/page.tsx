import { Metadata } from "next";
import Link from "next/link";
import { getUpcomingGames } from "@/lib/data/games";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SportIcon from "@/components/ui/SportIcon";

export const metadata: Metadata = {
  title: "Schedule | PhillySportsPack",
  description: "Upcoming games and schedule for Philadelphia high school sports. Football, basketball, baseball, and more.",
  alternates: { canonical: "https://phillysportspack.com/scores/schedule" },
  openGraph: {
    title: "Schedule | PhillySportsPack",
    description: "Upcoming games and schedule for Philadelphia high school sports.",
    url: "https://phillysportspack.com/scores/schedule",
  },
};

export const revalidate = 1800; // 30 minutes
export const dynamic = "force-dynamic";
interface SchedulePageProps {
  searchParams: Promise<{ sport?: string }>;
}

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const params = await searchParams;
  const selectedSport = params.sport || "all";

  // Fetch upcoming games
  const allGames = selectedSport === "all"
    ? await getUpcomingGames(undefined, 100)
    : await getUpcomingGames(selectedSport, 100);

  // Group by week
  const groupedByWeek = new Map<string, typeof allGames>();
  allGames.forEach((game) => {
    if (!game.game_date) return;

    const gameDate = new Date(game.game_date);
    const weekStart = new Date(gameDate);
    weekStart.setDate(gameDate.getDate() - gameDate.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!groupedByWeek.has(weekKey)) {
      groupedByWeek.set(weekKey, []);
    }
    groupedByWeek.get(weekKey)!.push(game);
  });

  const sortedWeeks = Array.from(groupedByWeek.keys()).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <main id="main-content" className="flex-1">
      <Breadcrumb
        items={[
          { label: "Scores", href: "/scores" },
          { label: "Schedule", href: "/scores/schedule" },
        ]}
      />

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
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "var(--font-bebas)",
            marginBottom: "0.5rem",
          }}
        >
          Schedule
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#ccc", marginBottom: "1.5rem" }}>
          Upcoming games from Philadelphia high school sports
        </p>

        {/* Sport Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/scores/schedule"
            className={`pill ${selectedSport === "all" ? "active" : ""}`}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid var(--psp-gold)",
              background:
                selectedSport === "all"
                  ? "var(--psp-gold)"
                  : "transparent",
              color:
                selectedSport === "all"
                  ? "var(--psp-navy)"
                  : "var(--psp-gold)",
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
              href={`/scores/schedule?sport=${sport}`}
              className={`pill ${selectedSport === sport ? "active" : ""}`}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: `1px solid ${
                  SPORT_COLORS_HEX[sport] || "var(--psp-gold)"
                }`,
                background:
                  selectedSport === sport
                    ? SPORT_COLORS_HEX[sport] || "var(--psp-gold)"
                    : "transparent",
                color:
                  selectedSport === sport
                    ? "white"
                    : SPORT_COLORS_HEX[sport] || "var(--psp-gold)",
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

      {/* Schedule List */}
      <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
        {sortedWeeks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#999",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              No upcoming games found.
            </p>
            <Link
              href="/scores"
              style={{
                color: "var(--psp-gold)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← View recent scores
            </Link>
          </div>
        ) : (
          sortedWeeks.map((weekKey) => {
            const games = groupedByWeek.get(weekKey) || [];
            const weekStart = new Date(weekKey);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const weekLabel = `Week of ${new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
            }).format(weekStart)} - ${new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
            }).format(weekEnd)}`;

            // Sort games by date within the week
            const sortedGames = [...games].sort(
              (a, b) =>
                new Date(a.game_date || "").getTime() -
                new Date(b.game_date || "").getTime()
            );

            return (
              <div key={weekKey} style={{ marginBottom: "2rem" }}>
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
                  {weekLabel}
                </h2>

                <div style={{ display: "grid", gap: "1rem" }}>
                  {sortedGames.map((game, idx) => {
                    const gameDate = new Date(game.game_date || "");
                    const dayLabel = new Intl.DateTimeFormat("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }).format(gameDate);

                    const timeLabel = game.game_date
                      ? gameDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "TBA";

                    return (
                      <div
                        key={game.id}
                        className="animate-fade-in-up"
                        style={{
                          animationDelay: `${idx * 30}ms`,
                          background:
                            "linear-gradient(135deg, #1a1a1a 0%, #222 100%)",
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
                        {/* Sport & Date */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                            minWidth: "120px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <SportIcon sport={game.sport_id} size="sm" />
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#999",
                                fontWeight: 600,
                                textTransform: "uppercase",
                              }}
                            >
                              {SPORT_META[game.sport_id as keyof typeof SPORT_META]?.name || game.sport_id}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                            <div>{dayLabel}</div>
                            <div style={{ color: "#999", fontSize: "0.8rem" }}>
                              {timeLabel}
                            </div>
                          </div>
                        </div>

                        {/* Game Matchup */}
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
                            href={
                              game.away_school
                                ? `/${game.sport_id}/schools/${game.away_school.slug}`
                                : "#"
                            }
                            style={{
                              textDecoration: "none",
                              color: "#ccc",
                              fontSize: "0.95rem",
                              fontWeight: 500,
                            }}
                          >
                            {game.away_school?.name || "TBD"}
                          </Link>

                          {/* VS Badge */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "50px",
                              height: "30px",
                              background: "rgba(240, 165, 0, 0.1)",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "var(--psp-gold)",
                            }}
                          >
                            vs
                          </div>

                          {/* Home School */}
                          <Link
                            href={
                              game.home_school
                                ? `/${game.sport_id}/schools/${game.home_school.slug}`
                                : "#"
                            }
                            style={{
                              textDecoration: "none",
                              color: "#ccc",
                              fontSize: "0.95rem",
                              fontWeight: 500,
                            }}
                          >
                            {game.home_school?.name || "TBD"}
                          </Link>
                        </div>
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
