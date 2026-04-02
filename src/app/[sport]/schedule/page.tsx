import { createStaticClient } from "@/lib/supabase/static";
import { SPORT_META } from "@/lib/data";
import { getCurrentSeasonLabel } from "@/lib/sports";
import {
  validateSportParam,
  validateSportParamForMetadata,
} from "@/lib/validateSport";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getScheduleGames,
  getScheduleSeasons,
  getLeagueSchoolMap,
  buildTeamList,
  type ScheduleGame,
  type ScheduleSeason,
  type ScheduleTeam,
  type LeagueSchoolEntry,
} from "@/lib/data/schedule";
import { Suspense } from "react";

// Sport-specific views
import FootballScheduleView from "./views/FootballScheduleView";
// Future: import BasketballScheduleView, etc.

export const revalidate = 3600;

type PageParams = { sport: string };
type SearchParams = { season?: string; view?: string };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  const sp = await searchParams;
  const seasonLabel = sp.season || getCurrentSeasonLabel();
  return {
    title: `${seasonLabel} ${meta.name} Schedule & Results - PhillySportsPack`,
    description: `Complete ${seasonLabel} Philadelphia high school ${meta.name.toLowerCase()} schedule & results. Filter by league, division, team, or week.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/schedule`,
    },
  };
}

// ============================================================================
// Resolve season: try exact match, then fallback to most recent
// ============================================================================
async function resolveSeasonId(
  seasonLabel: string
): Promise<{ id: number; label: string } | null> {
  const supabase = createStaticClient();

  const { data: exact } = await supabase
    .from("seasons")
    .select("id, label")
    .eq("label", seasonLabel)
    .single();

  if (exact) return exact;

  // Fallback: most recent season
  const { data: latest } = await supabase
    .from("seasons")
    .select("id, label")
    .order("label", { ascending: false })
    .limit(1)
    .single();

  return latest;
}

// ============================================================================
// Page component
// ============================================================================
export default async function SchedulePage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];
  const sp = await searchParams;

  // Resolve which season to show
  const requestedSeason = sp.season || getCurrentSeasonLabel();
  const season = await resolveSeasonId(requestedSeason);
  if (!season) notFound();

  // Parallel data fetches
  const [games, seasons, leagueMap] = await Promise.all([
    getScheduleGames(sport, season.label),
    getScheduleSeasons(sport),
    getLeagueSchoolMap(season.id),
  ]);

  // Build team list from games + league data
  const teams = buildTeamList(games, leagueMap);

  // Determine the most recent season with data (for off-season handling)
  const lastSeasonWithData = seasons.length > 0 ? seasons[0].label : null;

  // If current season has no games, auto-redirect suggestion
  const isOffSeason =
    games.length === 0 &&
    lastSeasonWithData &&
    lastSeasonWithData !== season.label;

  // Season stats
  const totalGames = games.length;
  const coreTeams = teams.filter((t) => t.gameCount >= 5).length;
  const leagueGames = games.filter(
    (g) =>
      !g.game_type ||
      g.game_type === "league" ||
      g.game_type === "regular"
  ).length;
  const playoffGames = games.filter(
    (g) => g.game_type === "playoff" || g.game_type === "championship"
  ).length;

  // Serialize for client components (Map → array)
  const leagueMapSerialized = [...leagueMap.entries()].map(([k, v]) => ({
    schoolId: k,
    ...v,
  }));

  // Check if Game Day mode is requested
  const isGameDay = sp.view === "gameday";

  // Determine sport-specific view
  const viewProps = {
    games: JSON.parse(JSON.stringify(games)) as ScheduleGame[],
    teams: JSON.parse(JSON.stringify(teams)) as ScheduleTeam[],
    seasons: JSON.parse(JSON.stringify(seasons)) as ScheduleSeason[],
    leagueMap: leagueMapSerialized,
    sport,
    seasonLabel: season.label,
    lastSeasonWithData,
    isGameDay,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[var(--psp-navy)] border-b-4 border-[var(--psp-gold)] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-3" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[var(--psp-gold)] transition">
              Home
            </a>
            <span className="mx-1.5">&rsaquo;</span>
            <a
              href={`/${sport}`}
              className="hover:text-[var(--psp-gold)] transition"
            >
              {meta.name}
            </a>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-gray-300">Schedule</span>
          </nav>

          {/* Title + Season selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{meta.emoji}</span>
              <h1 className="psp-h1 text-white">
                {season.label} {meta.name} Schedule & Results
              </h1>
            </div>

            {/* Season selector */}
            {seasons.length > 1 && (
              <Suspense fallback={null}>
                <SeasonSelectorWrapper
                  seasons={seasons}
                  currentSeason={season.label}
                  gameCount={totalGames}
                />
              </Suspense>
            )}
          </div>

          <p className="text-gray-300 text-base">
            Full schedule for Philadelphia area high school{" "}
            {meta.name.toLowerCase()}
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm">
            <div>
              <span className="text-[var(--psp-gold)] font-bold text-xl">
                {totalGames}
              </span>{" "}
              <span className="text-gray-300">Games</span>
            </div>
            <div>
              <span className="text-[var(--psp-gold)] font-bold text-xl">
                {coreTeams}
              </span>{" "}
              <span className="text-gray-300">Teams</span>
            </div>
            <div>
              <span className="text-[var(--psp-gold)] font-bold text-xl">
                {leagueGames}
              </span>{" "}
              <span className="text-gray-300">League</span>
            </div>
            {playoffGames > 0 && (
              <div>
                <span className="text-[var(--psp-gold)] font-bold text-xl">
                  {playoffGames}
                </span>{" "}
                <span className="text-gray-300">Playoff</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sport-specific view */}
      {sport === "football" ? (
        <FootballScheduleView {...viewProps} />
      ) : (
        // Fallback: use the old ScheduleView for non-football sports until Phase 3-5
        <FallbackScheduleView {...viewProps} />
      )}
    </div>
  );
}

// ============================================================================
// Season selector wrapper (client component boundary)
// ============================================================================
import { ScheduleSeasonSelector } from "@/components/schedule";

function SeasonSelectorWrapper({
  seasons,
  currentSeason,
  gameCount,
}: {
  seasons: ScheduleSeason[];
  currentSeason: string;
  gameCount: number;
}) {
  return (
    <ScheduleSeasonSelector
      seasons={seasons}
      currentSeason={currentSeason}
      gameCount={gameCount}
    />
  );
}

// ============================================================================
// Temporary fallback for non-football sports
// ============================================================================
import ScheduleView from "../schedule/ScheduleView";

function FallbackScheduleView({
  games,
  teams,
  sport,
  seasonLabel,
}: {
  games: ScheduleGame[];
  teams: ScheduleTeam[];
  sport: string;
  seasonLabel: string;
  [key: string]: unknown;
}) {
  // Adapt to old ScheduleView interface
  return (
    <ScheduleView
      games={games}
      teams={teams}
      sport={sport}
      seasonLabel={seasonLabel}
    />
  );
}
