import { Metadata } from "next";
import Link from "next/link";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SportIcon from "@/components/ui/SportIcon";
import ScoresFilters from "@/components/scores/ScoresFilters";
import { createStaticClient } from "@/lib/supabase/static";

export const metadata: Metadata = {
  title: "Scores | PhillySportsPack",
  description:
    "Recent scores from Philadelphia high school sports. Filter by season, sport, and school.",
  openGraph: {
    title: "Scores | PhillySportsPack",
    description: "Recent scores from Philadelphia high school sports.",
    url: "https://phillysportspack.com/scores",
  },
};

export const revalidate = 1800; // 30 minutes
export const dynamic = "force-dynamic";
interface ScoresPageProps {
  searchParams: Promise<{ sport?: string; season?: string; school?: string; page?: string }>;
}

interface ScoreGame {
  id: number;
  sport_id: string;
  game_date: string | null;
  home_score: number | null;
  away_score: number | null;
  home_school_id: number;
  away_school_id: number;
  home_school: { name: string; slug: string } | null;
  away_school: { name: string; slug: string } | null;
  seasons: { label: string } | null;
  home_league_id: number | null;
  away_league_id: number | null;
}

const CORE_LEAGUES = [
  "Philadelphia Catholic League",
  "Philadelphia Public League",
  "Inter-Academic League",
];

const LEAGUE_NAMES: Record<number, string> = {
  1: "Catholic League",
  2: "Public League",
  3: "Inter-Ac",
};

const LEAGUE_ORDER = [1, 2, 3]; // CL, PL, IA

/**
 * Group games into weekly rounds for football, monthly rounds for other sports.
 * Football weeks: cluster dates within 3 days of each other (Fri-Sat-Sun = one week).
 * Basketball/other: group by calendar month.
 */
function groupIntoRounds(
  games: ScoreGame[],
  sport: string
): { label: string; dateRange: string; games: ScoreGame[] }[] {
  if (games.length === 0) return [];

  // Sort by date ascending for round detection
  const sorted = [...games].sort((a, b) =>
    (a.game_date || "").localeCompare(b.game_date || "")
  );

  if (sport === "football") {
    // Football: group dates within 4 days of each other into weeks
    const weeks: { dates: string[]; games: ScoreGame[] }[] = [];
    let currentWeek: { dates: string[]; games: ScoreGame[] } | null = null;

    for (const game of sorted) {
      const date = game.game_date || "";
      if (!currentWeek) {
        currentWeek = { dates: [date], games: [game] };
      } else {
        const lastDate = currentWeek.dates[currentWeek.dates.length - 1];
        const dayDiff =
          (new Date(date).getTime() - new Date(lastDate).getTime()) /
          (1000 * 60 * 60 * 24);
        if (dayDiff <= 4) {
          if (!currentWeek.dates.includes(date)) currentWeek.dates.push(date);
          currentWeek.games.push(game);
        } else {
          weeks.push(currentWeek);
          currentWeek = { dates: [date], games: [game] };
        }
      }
    }
    if (currentWeek) weeks.push(currentWeek);

    // Detect playoffs: games after mid-November are typically playoffs
    let regularWeekNum = 0;
    let playoffRoundNum = 0;

    return weeks.map((week) => {
      const firstDate = new Date(week.dates[0] + "T12:00:00");
      const lastDate = new Date(
        week.dates[week.dates.length - 1] + "T12:00:00"
      );
      const month = firstDate.getMonth(); // 0=Jan, 10=Nov, 11=Dec

      // After Nov 10 = playoffs for fall football
      const isPlayoff = month >= 10 && firstDate.getDate() > 10 || month === 11;

      let label: string;
      if (isPlayoff) {
        playoffRoundNum++;
        if (playoffRoundNum === 1) label = "Playoffs — Round 1";
        else if (playoffRoundNum === 2) label = "Playoffs — Quarterfinals";
        else if (playoffRoundNum === 3) label = "Playoffs — Semifinals";
        else if (playoffRoundNum === 4) label = "Playoffs — Championship";
        else label = `Playoffs — Round ${playoffRoundNum}`;
      } else {
        regularWeekNum++;
        label = `Week ${regularWeekNum}`;
      }

      const dateRange = formatDateRange(firstDate, lastDate);
      return { label, dateRange, games: week.games };
    });
  } else {
    // Basketball, baseball, etc.: group by month
    const months = new Map<string, ScoreGame[]>();
    for (const game of sorted) {
      const date = game.game_date || "";
      const d = new Date(date + "T12:00:00");
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(key)) months.set(key, []);
      months.get(key)!.push(game);
    }

    return Array.from(months.entries()).map(([key, games]) => {
      const [year, month] = key.split("-").map(Number);
      const d = new Date(year, month - 1, 1);
      const label = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      return { label, dateRange: "", games };
    });
  }
}

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (start.getTime() === end.getTime()) {
    return start.toLocaleDateString("en-US", { ...opts, weekday: "short" });
  }
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Classify a game into a league bucket based on participating teams.
 * - Both teams same league → that league
 * - One team in a core league, other not → core league team's league
 * - Cross-league → "crossover"
 */
function classifyGameLeague(game: ScoreGame): number | "crossover" | "other" {
  const home = game.home_league_id;
  const away = game.away_league_id;

  if (home && away && home === away && LEAGUE_ORDER.includes(home)) return home;
  if (home && away && home !== away && LEAGUE_ORDER.includes(home) && LEAGUE_ORDER.includes(away))
    return "crossover";
  if (home && LEAGUE_ORDER.includes(home)) return home;
  if (away && LEAGUE_ORDER.includes(away)) return away;
  return "other";
}

function groupByLeague(
  games: ScoreGame[]
): { leagueKey: string; leagueLabel: string; games: ScoreGame[] }[] {
  const buckets = new Map<string, ScoreGame[]>();

  for (const game of games) {
    const league = classifyGameLeague(game);
    const key = String(league);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(game);
  }

  // Sort: CL, PL, IA, Crossover, Other
  const order = ["1", "2", "3", "crossover", "other"];
  const labels: Record<string, string> = {
    "1": "Catholic League",
    "2": "Public League",
    "3": "Inter-Ac",
    crossover: "Crossover",
    other: "Non-League",
  };

  return order
    .filter((k) => buckets.has(k))
    .map((k) => ({
      leagueKey: k,
      leagueLabel: labels[k] || k,
      games: buckets.get(k)!.sort((a, b) => {
        // Sort by date, then by home team name
        const dateComp = (a.game_date || "").localeCompare(b.game_date || "");
        if (dateComp !== 0) return dateComp;
        return (a.home_school?.name || "").localeCompare(b.home_school?.name || "");
      }),
    }));
}

export default async function ScoresPage({ searchParams }: ScoresPageProps) {
  const params = await searchParams;
  const selectedSport = params.sport || "all";
  const selectedSeason = params.season || "all";
  const selectedSchool = params.school || "";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const hasSeasonFilter = selectedSeason !== "all";
  const hasSportFilter = selectedSport !== "all";

  // When both sport + season are selected, we load ALL games for that combo
  // and group them by week/round. Otherwise, paginate as before.
  const useRoundView = hasSeasonFilter && hasSportFilter;
  const PAGE_SIZE = useRoundView ? 1000 : 100;

  const supabase = createStaticClient();

  // Fetch seasons list + core league schools in parallel
  const [seasonsRes, schoolsRes] = await Promise.all([
    supabase
      .from("seasons")
      .select("label, year_start")
      .order("year_start", { ascending: false })
      .limit(30),
    supabase
      .from("schools")
      .select("id, name, slug")
      .in("league_id", [1, 2, 3])
      .is("deleted_at", null)
      .order("name")
      .limit(200),
  ]);

  const seasons = (seasonsRes.data ?? []).map((s: { label: string }) => s.label);
  const schools = (schoolsRes.data ?? []).map(
    (s: { id: number; name: string; slug: string }) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
    })
  );

  // Build the scores query with filters
  let allScores: ScoreGame[] = [];
  let totalCount = 0;
  try {
    // Resolve season/school filters first
    let seasonId: number | null = null;
    let schoolId: number | null = null;

    if (selectedSeason !== "all") {
      const { data } = await supabase
        .from("seasons")
        .select("id")
        .eq("label", selectedSeason)
        .single();
      seasonId = data?.id ?? null;
    }
    if (selectedSchool) {
      const { data } = await supabase
        .from("schools")
        .select("id")
        .eq("slug", selectedSchool)
        .single();
      schoolId = data?.id ?? null;
    }

    // Step 1: Fetch game IDs and scores only (no FK joins — fast)
    let query = supabase
      .from("games")
      .select(
        "id, sport_id, game_date, home_score, away_score, home_school_id, away_school_id, season_id",
        useRoundView ? undefined : { count: "exact" }
      )
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .not("game_date", "is", null)
      .not("home_school_id", "is", null)
      .not("away_school_id", "is", null)
      .order("game_date", { ascending: false });

    if (!useRoundView) {
      query = query.range(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE - 1
      );
    } else {
      query = query.limit(PAGE_SIZE);
    }

    if (selectedSport !== "all") {
      query = query.eq("sport_id", selectedSport);
    }
    if (seasonId) {
      query = query.eq("season_id", seasonId);
    }
    if (schoolId) {
      query = query.or(
        `home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`
      );
    }

    const { data, count } = await query;
    const rawGames = (data as unknown as any[]) ?? [];

    // Step 2: Batch-fetch school info (name, slug, league_id) for all unique school IDs
    const schoolMap = new Map<number, { name: string; slug: string; league_id: number | null }>();
    if (rawGames.length > 0) {
      const schoolIds = new Set<number>();
      for (const g of rawGames) {
        if (g.home_school_id) schoolIds.add(g.home_school_id);
        if (g.away_school_id) schoolIds.add(g.away_school_id);
      }
      // Use RPC function to bypass RLS and include soft-deleted schools
      const { data: schoolData } = await supabase
        .rpc("get_school_names", { school_ids: Array.from(schoolIds) });
      for (const s of schoolData ?? []) {
        schoolMap.set(s.id, { name: s.name, slug: s.slug, league_id: s.league_id });
      }
    }

    allScores = rawGames.map((g) => {
      const home = schoolMap.get(g.home_school_id);
      const away = schoolMap.get(g.away_school_id);
      return {
        ...g,
        home_school: home ? { name: home.name, slug: home.slug } : null,
        away_school: away ? { name: away.name, slug: away.slug } : null,
        seasons: null, // not needed — we already know the season from filters
        home_league_id: home?.league_id ?? null,
        away_league_id: away?.league_id ?? null,
      };
    });
    totalCount = count ?? allScores.length;
  } catch {
    // fail gracefully
  }

  // Build sport options for filters
  const sportOptions = VALID_SPORTS.map((s) => ({
    id: s,
    name: SPORT_META[s]?.name || s,
    color: SPORT_COLORS_HEX[s] || "#f0a500",
  }));

  // === ROUND VIEW (sport + season selected) ===
  if (useRoundView) {
    const rounds = groupIntoRounds(allScores, selectedSport);

    return (
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "Scores", href: "/scores" }]} />

        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
            padding: "2rem 1rem 1.5rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontFamily: "var(--font-bebas)",
              marginBottom: "0.5rem",
              color: "white",
            }}
          >
            {SPORT_META[selectedSport as keyof typeof SPORT_META]?.emoji}{" "}
            {selectedSeason}{" "}
            {SPORT_META[selectedSport as keyof typeof SPORT_META]?.name || selectedSport}{" "}
            Scores
          </h1>
          <p style={{ fontSize: "1rem", color: "#ccc", marginBottom: "1.5rem" }}>
            {totalCount} game{totalCount !== 1 ? "s" : ""} � Organized by{" "}
            {selectedSport === "football" ? "week" : "month"}
          </p>

          <ScoresFilters
            seasons={seasons}
            schools={schools}
            sports={sportOptions}
            currentSeason={selectedSeason}
            currentSport={selectedSport}
            currentSchool={selectedSchool}
          />
        </div>

        {/* Round-grouped scores */}
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "1.5rem 1rem 2rem",
          }}
        >
          {rounds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#999" }}>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                No scores found for {selectedSeason} {SPORT_META[selectedSport as keyof typeof SPORT_META]?.name}.
              </p>
              <Link
                href="/scores"
                style={{ color: "var(--psp-gold)", textDecoration: "none", fontWeight: 600 }}
              >
                Clear all filters →
              </Link>
            </div>
          ) : (
            rounds.map((round, roundIdx) => {
              const leagueGroups = groupByLeague(round.games);

              return (
                <div
                  key={roundIdx}
                  style={{
                    marginBottom: "2.5rem",
                  }}
                >
                  {/* Round header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                      paddingBottom: "0.5rem",
                      borderBottom: "2px solid var(--psp-gold)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "1.6rem",
                        fontFamily: "var(--font-bebas)",
                        color: "var(--psp-gold)",
                        margin: 0,
                      }}
                    >
                      {round.label}
                    </h2>
                    {round.dateRange && (
                      <span style={{ color: "#999", fontSize: "0.85rem" }}>
                        {round.dateRange}
                      </span>
                    )}
                    <span style={{ color: "#666", fontSize: "0.8rem", marginLeft: "auto" }}>
                      {round.games.length} game{round.games.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* League sub-groups */}
                  {leagueGroups.map((lg) => (
                    <div key={lg.leagueKey} style={{ marginBottom: "1.25rem" }}>
                      <h3
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#999",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: "0.5rem",
                          paddingLeft: "0.25rem",
                        }}
                      >
                        {lg.leagueLabel}
                      </h3>

                      <div style={{ display: "grid", gap: "0.35rem" }}>
                        {lg.games.map((game) => (
                          <GameCard key={game.id} game={game} sport={selectedSport} showDate={selectedSport !== "football"} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link
              href="/scores/schedule"
              style={{
                color: "var(--psp-gold)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              View Upcoming Schedule →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // === DEFAULT VIEW (no sport+season combo, flat list grouped by date) ===
  const groupedByDate = new Map<string, ScoreGame[]>();
  allScores.forEach((game) => {
    const date = game.game_date || "No Date";
    if (!groupedByDate.has(date)) groupedByDate.set(date, []);
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
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "2rem 1rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "var(--font-bebas)",
            marginBottom: "0.5rem",
            color: "white",
          }}
        >
          Scores
        </h1>
        <p style={{ fontSize: "1rem", color: "#ccc", marginBottom: "1.5rem" }}>
          Find games by sport, season, and team
        </p>

        <ScoresFilters
          seasons={seasons}
          schools={schools}
          sports={sportOptions}
          currentSeason={selectedSeason}
          currentSport={selectedSport}
          currentSchool={selectedSchool}
        />
      </div>

      {/* Scores List */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
        }}
      >
        {/* Results count */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ color: "#999", fontSize: "0.85rem" }}>
            {totalCount === 0
              ? "No games found"
              : totalCount <= PAGE_SIZE
              ? `${totalCount} game${totalCount !== 1 ? "s" : ""} found`
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, totalCount)} of ${totalCount} games`}
          </p>
          <Link
            href="/scores/schedule"
            style={{
              color: "var(--psp-gold)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Upcoming Schedule →
          </Link>
        </div>

        {sortedDates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#999" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              No scores found for these filters.
            </p>
            <Link
              href="/scores"
              style={{
                color: "var(--psp-gold)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Clear all filters →
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
                    marginBottom: "0.75rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "2px solid #333",
                  }}
                >
                  {dateLabel}
                </h2>

                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} sport={game.sport_id} showDate={false} showSport={selectedSport === "all"} />
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalCount > PAGE_SIZE &&
          (() => {
            const totalPages = Math.ceil(totalCount / PAGE_SIZE);
            const baseParams = new URLSearchParams();
            if (selectedSport !== "all") baseParams.set("sport", selectedSport);
            if (selectedSeason !== "all") baseParams.set("season", selectedSeason);
            if (selectedSchool) baseParams.set("school", selectedSchool);

            function pageUrl(page: number) {
              const p = new URLSearchParams(baseParams);
              if (page > 1) p.set("page", String(page));
              const qs = p.toString();
              return `/scores${qs ? `?${qs}` : ""}`;
            }

            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "2rem",
                  paddingBottom: "1rem",
                }}
              >
                {currentPage > 1 && (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    style={{
                      color: "var(--psp-gold)",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      padding: "0.5rem 1rem",
                      border: "1px solid #444",
                      borderRadius: "6px",
                    }}
                  >
                    ← Previous
                  </Link>
                )}
                <span style={{ color: "#999", fontSize: "0.85rem" }}>
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    style={{
                      color: "var(--psp-gold)",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      padding: "0.5rem 1rem",
                      border: "1px solid #444",
                      borderRadius: "6px",
                    }}
                  >
                    Next →
                  </Link>
                )}
              </div>
            );
          })()}
      </div>
    </main>
  );
}

// ==================================================================
// GAME CARD COMPONENT
// ==================================================================

function GameCard({
  game,
  sport,
  showDate = false,
  showSport = false,
}: {
  game: ScoreGame;
  sport: string;
  showDate?: boolean;
  showSport?: boolean;
}) {
  const homeWin =
    game.home_score !== null &&
    game.away_score !== null &&
    game.home_score > game.away_score;
  const awayWin =
    game.away_score !== null &&
    game.home_score !== null &&
    game.away_score > game.home_score;

  return (
    <Link
      href={`/${sport}/games/${game.id}`}
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #222 100%)",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "0.6rem 0.75rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Left: date or sport badge */}
      {showSport ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            minWidth: "75px",
          }}
        >
          <SportIcon sport={game.sport_id} size="sm" />
          <span style={{ fontSize: "0.7rem", color: "#999", fontWeight: 600 }}>
            {SPORT_META[game.sport_id as keyof typeof SPORT_META]?.name || game.sport_id}
          </span>
        </div>
      ) : showDate && game.game_date ? (
        <span
          style={{
            fontSize: "0.7rem",
            color: "#888",
            minWidth: "70px",
            fontWeight: 500,
          }}
        >
          {formatDate(game.game_date)}
        </span>
      ) : null}

      {/* Game Score */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "0.4rem",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: awayWin ? "var(--psp-gold)" : "#ccc",
            fontWeight: awayWin ? 700 : 500,
            fontSize: "0.85rem",
            textAlign: "right",
          }}
        >
          {game.away_school?.name || "TBD"}
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "1.3rem",
            fontFamily: "var(--font-bebas)",
            fontWeight: 700,
          }}
        >
          <span style={{ color: awayWin ? "var(--psp-gold)" : "#999" }}>
            {game.away_score ?? "-"}
          </span>
          <span style={{ color: "#555", fontSize: "0.85rem" }}>–</span>
          <span style={{ color: homeWin ? "var(--psp-gold)" : "#999" }}>
            {game.home_score ?? "-"}
          </span>
        </div>

        <span
          style={{
            color: homeWin ? "var(--psp-gold)" : "#ccc",
            fontWeight: homeWin ? 700 : 500,
            fontSize: "0.85rem",
            textAlign: "left",
          }}
        >
          {game.home_school?.name || "TBD"}
        </span>
      </div>
    </Link>
  );
}
