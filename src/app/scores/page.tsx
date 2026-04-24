import { Metadata } from "next";
import Link from "next/link";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ScoresFilters from "@/components/scores/ScoresFilters";
import { createStaticClient } from "@/lib/supabase/static";
import { ScoreGame, groupIntoRounds, RoundView, DefaultScoresView } from "./ScoresTable";
import { ScoresPagination } from "./ScoresPagination";

const SCORES_PAGE_SIZE = 100;
const SCORES_BASE_URL = "https://phillysportspack.com";

function buildScoresUrl(page: number, sport: string, season: string, school: string): string {
  const p = new URLSearchParams();
  if (sport !== "all") p.set("sport", sport);
  if (season !== "all") p.set("season", season);
  if (school) p.set("school", school);
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return `${SCORES_BASE_URL}/scores${qs ? `?${qs}` : ""}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; season?: string; school?: string; page?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const selectedSport = params.sport || "all";
  const selectedSeason = params.season || "all";
  const selectedSchool = params.school || "";

  // Only compute pagination for non-round-view (standard pagination)
  const useRoundView = selectedSeason !== "all" && selectedSport !== "all";
  let totalPages = 1;

  if (!useRoundView) {
    const supabase = createStaticClient();
    let countQuery = supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .not("game_date", "is", null)
      .not("home_school_id", "is", null)
      .not("away_school_id", "is", null);
    if (selectedSport !== "all") countQuery = countQuery.eq("sport_id", selectedSport);
    const { count } = await countQuery;
    totalPages = Math.ceil((count || 0) / SCORES_PAGE_SIZE);
  }

  const canonical = buildScoresUrl(currentPage, selectedSport, selectedSeason, selectedSchool);
  const prev = currentPage > 1 ? buildScoresUrl(currentPage - 1, selectedSport, selectedSeason, selectedSchool) : undefined;
  const next = currentPage < totalPages ? buildScoresUrl(currentPage + 1, selectedSport, selectedSeason, selectedSchool) : undefined;

  const pageLabel = currentPage > 1 ? ` - Page ${currentPage}` : "";
  const title = `Scores${pageLabel} | PhillySportsPack`;
  const description = "Recent scores and results from Philadelphia high school sports. Filter by season, sport, and school across football, basketball, baseball, and more.";

  return {
    title,
    description,
    alternates: {
      canonical,
      types: {
        ...(prev ? { prev } : {}),
        ...(next ? { next } : {}),
      },
    },
    openGraph: {
      title,
      description: "Recent scores from Philadelphia high school sports.",
      url: canonical,
    },
    other: {
      ...(prev ? { "link-prev": prev } : {}),
      ...(next ? { "link-next": next } : {}),
    },
  };
}

export const revalidate = 1800; // 30 minutes
interface ScoresPageProps {
  searchParams: Promise<{ sport?: string; season?: string; school?: string; page?: string }>;
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
      // schools_all so filtering scores by closed school works.
      const { data } = await supabase
        .from("schools_all")
        .select("id")
        .eq("slug", selectedSchool)
        .single();
      schoolId = data?.id ?? null;
    }

    // Step 1: Fetch game IDs and scores only (no FK joins — fast)
    let query = supabase
      .from("games")
      .select(
        "id, sport_id, game_date, home_score, away_score, home_school_id, away_school_id, season_id, game_type",
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
    const schoolMap = new Map<number, { name: string; slug: string; league_id: number | null; city?: string | null }>();
    if (rawGames.length > 0) {
      const schoolIds = new Set<number>();
      for (const g of rawGames) {
        if (g.home_school_id) schoolIds.add(g.home_school_id);
        if (g.away_school_id) schoolIds.add(g.away_school_id);
      }
      // Use RPC function to bypass RLS and include soft-deleted schools
      const { data: schoolData } = await supabase
        .rpc("get_school_names", { school_ids: Array.from(schoolIds) });
      for (const s of (schoolData ?? []) as any[]) {
        schoolMap.set(s.id, { name: s.name, slug: s.slug, league_id: s.league_id, city: s.city ?? null });
      }
    }

    allScores = rawGames.map((g) => {
      const home = schoolMap.get(g.home_school_id);
      const away = schoolMap.get(g.away_school_id);
      return {
        ...g,
        home_school: home ? { name: home.name, slug: home.slug, city: home.city, league_id: home.league_id } : null,
        away_school: away ? { name: away.name, slug: away.slug, city: away.city, league_id: away.league_id } : null,
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
          className="bg-gradient-to-br from-[var(--psp-navy)] to-[#1a3a52] py-10 px-4 text-center"
        >
          <div className="max-w-7xl mx-auto">
            <h1
              className="psp-h1 text-white mb-2"
            >
              {SPORT_META[selectedSport as keyof typeof SPORT_META]?.emoji}{" "}
              {selectedSeason}{" "}
              {SPORT_META[selectedSport as keyof typeof SPORT_META]?.name || selectedSport}{" "}
              Scores
            </h1>
            <p className="text-base text-[#ccc] mb-6">
              {totalCount} game{totalCount !== 1 ? "s" : ""} — Organized by{" "}
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
        </div>

        {/* Round-grouped scores */}
        <div
          className="max-w-[960px] mx-auto px-4 pt-6 pb-8"
        >
          <RoundView rounds={rounds} selectedSport={selectedSport} />

          <div className="text-center mt-8">
            <Link
              href="/scores/schedule"
              className="font-semibold text-[0.9rem] no-underline"
              style={{ color: "var(--psp-gold)" }}
            >
              View Upcoming Schedule →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // === DEFAULT VIEW (no sport+season combo, flat list grouped by date) ===
  return (
    <main id="main-content" className="flex-1">
      <Breadcrumb items={[{ label: "Scores", href: "/scores" }]} />

      {/* Hero Section */}
      <div
        className="bg-gradient-to-br from-[var(--psp-navy)] to-[#1a3a52] py-10 px-4 text-center"
      >
        <div className="max-w-7xl mx-auto">
          <h1
            className="psp-h1 text-white mb-2"
          >
            Scores
          </h1>
          <p className="text-base text-[#ccc] mb-6">
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
      </div>

      {/* Scores List */}
      <div
        className="max-w-[900px] mx-auto px-4 pt-6 pb-8"
      >
        {/* Results count */}
        <div
          className="flex justify-between items-center mb-6"
        >
          <p className="text-[#999] text-[0.85rem]">
            {totalCount === 0
              ? "No games found"
              : totalCount <= PAGE_SIZE
              ? `${totalCount} game${totalCount !== 1 ? "s" : ""} found`
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, totalCount)} of ${totalCount} games`}
          </p>
          <Link
            href="/scores/schedule"
            className="font-semibold text-[0.85rem] no-underline"
            style={{ color: "var(--psp-gold)" }}
          >
            Upcoming Schedule →
          </Link>
        </div>

        <DefaultScoresView allScores={allScores} selectedSport={selectedSport} />

        <ScoresPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          selectedSport={selectedSport}
          selectedSeason={selectedSeason}
          selectedSchool={selectedSchool}
        />
      </div>
    </main>
  );
}
