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

interface ScoresPageProps {
  searchParams: Promise<{ sport?: string; season?: string; school?: string }>;
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
}

const CORE_LEAGUES = [
  "Philadelphia Catholic League",
  "Philadelphia Public League",
  "Inter-Academic League",
];

export default async function ScoresPage({ searchParams }: ScoresPageProps) {
  const params = await searchParams;
  const selectedSport = params.sport || "all";
  const selectedSeason = params.season || "all";
  const selectedSchool = params.school || "";

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
      .select("id, name, slug, leagues!inner(name)")
      .in("leagues.name", CORE_LEAGUES)
      .is("deleted_at", null)
      .order("name")
      .limit(200),
  ]);

  const seasons = (seasonsRes.data ?? []).map((s: { label: string }) => s.label);
  const schools = (schoolsRes.data ?? []).map((s: { id: number; name: string; slug: string }) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
  }));

  // Build the scores query with filters
  let allScores: ScoreGame[] = [];
  try {
    let query = supabase
      .from("games")
      .select(
        `id, sport_id, game_date, home_score, away_score, home_school_id, away_school_id,
         home_school:schools!games_home_school_id_fkey(name, slug),
         away_school:schools!games_away_school_id_fkey(name, slug),
         seasons(label)`
      )
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .not("game_date", "is", null)
      .order("game_date", { ascending: false })
      .limit(75);

    if (selectedSport !== "all") {
      query = query.eq("sport_id", selectedSport);
    }

    if (selectedSeason !== "all") {
      // Look up season ID
      const { data: seasonRow } = await supabase
        .from("seasons")
        .select("id")
        .eq("label", selectedSeason)
        .single();
      if (seasonRow) {
        query = query.eq("season_id", seasonRow.id);
      }
    }

    if (selectedSchool) {
      // Look up school ID
      const { data: schoolRow } = await supabase
        .from("schools")
        .select("id")
        .eq("slug", selectedSchool)
        .single();
      if (schoolRow) {
        query = query.or(
          `home_school_id.eq.${schoolRow.id},away_school_id.eq.${schoolRow.id}`
        );
      }
    }

    const { data } = await query;
    allScores = (data as unknown as ScoreGame[]) ?? [];
  } catch {
    // fail gracefully
  }

  // Group by date
  const groupedByDate = new Map<string, ScoreGame[]>();
  allScores.forEach((game) => {
    const date = game.game_date || "No Date";
    if (!groupedByDate.has(date)) groupedByDate.set(date, []);
    groupedByDate.get(date)!.push(game);
  });

  const sortedDates = Array.from(groupedByDate.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Build sport options for filters
  const sportOptions = VALID_SPORTS.map((s) => ({
    id: s,
    name: SPORT_META[s]?.name || s,
    color: SPORT_COLORS_HEX[s] || "#f0a500",
  }));

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
            {allScores.length === 0
              ? "No games found"
              : `${allScores.length} game${allScores.length !== 1 ? "s" : ""} found`}
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
                  {games.map((game) => {
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
                        key={game.id}
                        href={`/${game.sport_id}/games/${game.id}`}
                        style={{
                          background:
                            "linear-gradient(135deg, #1a1a1a 0%, #222 100%)",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          padding: "0.75rem 1rem",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.75rem",
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
                            gap: "0.4rem",
                            minWidth: "80px",
                          }}
                        >
                          <SportIcon sport={game.sport_id} size="sm" />
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "#999",
                              fontWeight: 600,
                            }}
                          >
                            {SPORT_META[
                              game.sport_id as keyof typeof SPORT_META
                            ]?.name || game.sport_id}
                          </span>
                        </div>

                        {/* Game Score */}
                        <div
                          style={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            alignItems: "center",
                            gap: "0.5rem",
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
                              gap: "0.4rem",
                              fontSize: "1.4rem",
                              fontFamily: "var(--font-bebas)",
                              fontWeight: 700,
                            }}
                          >
                            <span
                              style={{
                                color: awayWin ? "var(--psp-gold)" : "#999",
                              }}
                            >
                              {game.away_score ?? "-"}
                            </span>
                            <span style={{ color: "#555", fontSize: "0.9rem" }}>
                              –
                            </span>
                            <span
                              style={{
                                color: homeWin ? "var(--psp-gold)" : "#999",
                              }}
                            >
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
