import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { getGamesBySportAndSeason, getSeasonsBySport, SPORT_META, isValidSport } from "@/lib/data";
import type { SportId } from "@/lib/sports";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport } = await params;
  const meta = SPORT_META[sport as SportId];
  if (!meta) return { title: "Scores — PhillySportsPack" };
  return {
    title: `${meta.name} Scores — PhillySportsPack`,
    description: `Browse ${meta.name.toLowerCase()} scores, box scores, and game results for Philadelphia high school sports.`,
  };
}

export const revalidate = 300;

const SPORT_ABBREV: Record<string, string> = {
  football: "FB",
  basketball: "BB",
  baseball: "BSB",
  lacrosse: "LAX",
  soccer: "SOC",
  "track-field": "TF",
  wrestling: "WR",
};

export default async function SportScoresPage({
  params,
  searchParams,
}: {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ season?: string }>;
}) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport as SportId];
  const sp = await searchParams;
  const activeSeason = sp.season || null;

  const [games, seasons] = await Promise.all([
    getGamesBySportAndSeason(sport, activeSeason),
    getSeasonsBySport(sport),
  ]);

  // Group games by date
  const gamesByDate = new Map<string, any[]>();
  for (const game of games) {
    const dateKey = game.game_date
      ? new Date(game.game_date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Date Unknown";
    if (!gamesByDate.has(dateKey)) gamesByDate.set(dateKey, []);
    gamesByDate.get(dateKey)!.push(game);
  }

  // Count game types
  const playoffGames = games.filter(
    (g: any) => g.game_type && g.game_type !== "regular"
  ).length;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-4 w-full">
        <Breadcrumb
          items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Scores" },
          ]}
        />
      </div>

      {/* Sport-branded Page Header */}
      <section
        style={{
          background: `linear-gradient(135deg, #0a1628 0%, ${meta.color}22 100%)`,
          borderBottom: `3px solid ${meta.color}`,
          padding: "40px 20px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 48 }}>{meta.emoji}</span>
            <div>
              <h1
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 36,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {meta.name} Scores
              </h1>
              <p style={{ opacity: 0.8, fontSize: 14 }}>
                {games.length.toLocaleString()} game results
                {activeSeason ? ` from ${activeSeason}` : " across all seasons"}
                {playoffGames > 0
                  ? ` · ${playoffGames} playoff game${playoffGames > 1 ? "s" : ""}`
                  : ""}
              </p>
            </div>
          </div>

          {/* Quick stat pills */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {seasons.length} Season{seasons.length !== 1 ? "s" : ""} of Data
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {games.length.toLocaleString()} Game{games.length !== 1 ? "s" : ""}
            </span>
            {playoffGames > 0 && (
              <span
                style={{
                  background: `${meta.color}33`,
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  color: meta.color,
                }}
              >
                🏆 {playoffGames} Playoff Game{playoffGames > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Season Filter Tabs */}
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
            gap: 2,
            overflowX: "auto",
          }}
        >
          <Link
            href={`/${sport}/scores`}
            style={{
              padding: "12px 16px",
              fontSize: 13,
              fontWeight: !activeSeason ? 800 : 500,
              color: !activeSeason ? meta.color : "var(--g400)",
              borderBottom: !activeSeason
                ? `3px solid ${meta.color}`
                : "3px solid transparent",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            All Seasons
          </Link>
          {seasons.map((s: any) => (
            <Link
              key={s.id}
              href={`/${sport}/scores?season=${encodeURIComponent(s.label)}`}
              style={{
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: activeSeason === s.label ? 800 : 500,
                color:
                  activeSeason === s.label ? meta.color : "var(--g400)",
                borderBottom:
                  activeSeason === s.label
                    ? `3px solid ${meta.color}`
                    : "3px solid transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Scores Content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 20px",
          flex: 1,
        }}
      >
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
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  {meta.emoji}
                </div>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  No scores found
                </h2>
                <p style={{ fontSize: 14 }}>
                  {activeSeason
                    ? `No ${meta.name.toLowerCase()} games with final scores for ${activeSeason}.`
                    : `No ${meta.name.toLowerCase()} games with final scores yet.`}
                </p>
                {activeSeason && (
                  <Link
                    href={`/${sport}/scores`}
                    style={{
                      display: "inline-block",
                      marginTop: 16,
                      color: meta.color,
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    View all seasons →
                  </Link>
                )}
              </div>
            ) : (
              Array.from(gamesByDate.entries()).map(
                ([dateLabel, dateGames]) => (
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
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          marginLeft: 12,
                          color: "var(--g400)",
                          opacity: 0.7,
                        }}
                      >
                        {dateGames.length} game
                        {dateGames.length > 1 ? "s" : ""}
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {dateGames.map((game: any) => (
                        <ScoreCard
                          key={game.id}
                          game={game}
                          sport={sport}
                          sportColor={meta.color}
                        />
                      ))}
                    </div>
                  </div>
                )
              )
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sport-specific quick links */}
            <div className="sidebar-widget">
              <h3
                className="sw-head"
                style={{ borderLeftColor: meta.color }}
              >
                {meta.emoji} {meta.name}
              </h3>
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <Link
                  href={`/${sport}`}
                  style={{ fontSize: 13, color: "var(--psp-blue)" }}
                >
                  {meta.emoji} {meta.name} Hub
                </Link>
                <Link
                  href={`/${sport}/teams`}
                  style={{ fontSize: 13, color: "var(--psp-blue)" }}
                >
                  🏫 Teams
                </Link>
                {meta.statCategories.length > 0 && (
                  <Link
                    href={`/${sport}/leaderboards/${meta.statCategories[0] === "scoring" ? "points" : meta.statCategories[0] === "rushing" ? "rushing_yards" : meta.statCategories[0]}`}
                    style={{ fontSize: 13, color: "var(--psp-blue)" }}
                  >
                    📊 Leaderboards
                  </Link>
                )}
                <Link
                  href={`/${sport}/championships`}
                  style={{ fontSize: 13, color: "var(--psp-blue)" }}
                >
                  🏆 Championships
                </Link>
                <Link
                  href={`/${sport}/records`}
                  style={{ fontSize: 13, color: "var(--psp-blue)" }}
                >
                  📈 Records
                </Link>
              </div>
            </div>

            <PSPPromo size="sidebar" variant={1} />

            {/* Seasons directory */}
            {seasons.length > 0 && (
              <div className="sidebar-widget">
                <h3 className="sw-head">📅 Seasons</h3>
                <div
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {seasons.map((s: any) => (
                    <Link
                      key={s.id}
                      href={`/${sport}/scores?season=${encodeURIComponent(s.label)}`}
                      style={{
                        fontSize: 13,
                        color:
                          activeSeason === s.label
                            ? meta.color
                            : "var(--psp-blue)",
                        fontWeight:
                          activeSeason === s.label ? 700 : 400,
                        textDecoration: "none",
                      }}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <PSPPromo size="sidebar" variant={3} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Individual Score Card ── */
function ScoreCard({
  game,
  sport,
  sportColor,
}: {
  game: any;
  sport: string;
  sportColor: string;
}) {
  const home = game.home_school;
  const away = game.away_school;
  const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
  const awayWin = (game.away_score ?? 0) > (game.home_score ?? 0);
  const sportAbbr = SPORT_ABBREV[game.sport_id] || game.sport_id;
  const gameType =
    game.game_type && game.game_type !== "regular"
      ? game.game_type.charAt(0).toUpperCase() + game.game_type.slice(1)
      : null;
  const playoffRound = game.playoff_round;

  return (
    <Link
      href={`/${sport}/games/${game.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          borderLeft: gameType ? `3px solid ${sportColor}` : undefined,
          padding: "16px 20px",
          transition: "border-color 0.15s, box-shadow 0.15s",
          cursor: "pointer",
        }}
        className="hover-card"
      >
        {/* Card header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: sportColor,
                background: `${sportColor}15`,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              {sportAbbr}
            </span>
            {(gameType || playoffRound) && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#fff",
                  background: sportColor,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {playoffRound || gameType}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {game.seasons?.label && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--g400)",
                  fontWeight: 500,
                }}
              >
                {game.seasons.label}
              </span>
            )}
            <span
              style={{
                fontSize: 10,
                color: "var(--g400)",
                fontWeight: 600,
              }}
            >
              Final
            </span>
          </div>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 4,
                height: 24,
                borderRadius: 2,
                background: awayWin ? sportColor : "transparent",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: awayWin ? 800 : 500,
                color: awayWin ? "var(--text)" : "var(--g400)",
              }}
            >
              {away?.name || "Away"}
            </span>
            {away?.city && (
              <span style={{ fontSize: 11, color: "var(--g400)", opacity: 0.6 }}>
                {away.city}
              </span>
            )}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 4,
                height: 24,
                borderRadius: 2,
                background: homeWin ? sportColor : "transparent",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: homeWin ? 800 : 500,
                color: homeWin ? "var(--text)" : "var(--g400)",
              }}
            >
              {home?.name || "Home"}
            </span>
            {home?.city && (
              <span style={{ fontSize: 11, color: "var(--g400)", opacity: 0.6 }}>
                {home.city}
              </span>
            )}
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
              color: sportColor,
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
