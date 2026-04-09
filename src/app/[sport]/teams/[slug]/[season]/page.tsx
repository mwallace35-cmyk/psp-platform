import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";
import SortablePreviewRoster from "@/components/team/SortablePreviewRoster";
import {
  SPORT_META,
  getSchoolBySlug,
  getTeamSeason,
  getGamesByTeamSeason,
  getTeamRosterBySeason,
  getAvailableTeamSeasons,
  getGamesWithBoxScores,
  isPreviewSeason,
  getReturningRoster,
  getReturningRosterFromRosters,
  getLastSeasonRecap,
  getLeagueOutlook,
  getScheduleStrength,
  getMatchupHistory,
  getNextLevelAlumni,
  createClient,
  type TeamSeason,
  type Game,
  type RosterPlayer,
  type Season,
  type ReturningPlayer,
  type RosterReturningPlayer,
  type SeasonRecap,
  type LeagueStanding,
  type ScheduleStrength,
  type MatchupHistory,
  type NextLevelAlumnus,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import SeasonSelector from "@/components/scores/SeasonSelector";
import { captureError } from "@/lib/error-tracking";
import TeamSeasonTabs from "@/components/team/TeamSeasonTabs";
import ScheduleTable from "./ScheduleTable";
import RosterStatsTable from "./RosterStatsTable";
import PreviewSidebar from "./PreviewSidebar";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: hourly (for preview pages that may have upcoming seasons)
type PageParams = { sport: string; slug: string; season: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport: sportRaw, slug, season } = await params;
  const sport = await validateSportParamForMetadata({ sport: sportRaw });
  if (!sport) return {};
  // Validate sport param
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  return {
    title: `${school.name} ${SPORT_META[sport].name} — ${season} — PhillySportsPack`,
    description: `${school.name} ${SPORT_META[sport].name.toLowerCase()} for the ${season} season. Schedule, results, roster, and statistics.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/teams/${slug}/${season}`,
    },
  };
}

export default async function TeamSeasonPage({ params }: { params: Promise<PageParams> }) {
  const { sport: sportRaw, slug, season } = await params;
  const sport = await validateSportParam({ sport: sportRaw });
  // Sport param validated by validateSportParam

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = SPORT_META[sport];

  // Get team season data
  const teamSeasonData = await getTeamSeason(school.id, sport, season);

  // Determine if this is a preview season
  // A season is NOT a preview if we have team season data (wins/losses) or game results with scores
  const hasGameResults = await (async () => {
    const { data } = await (await import("@/lib/supabase/static")).createStaticClient()
      .from("games")
      .select("id")
      .eq("sport_id", sport)
      .eq("season_id", teamSeasonData?.season_id ?? 0)
      .or(`home_school_id.eq.${school.id},away_school_id.eq.${school.id}`)
      .not("home_score", "is", null)
      .limit(1);
    return (data?.length ?? 0) > 0;
  })();
  const isPreview = !teamSeasonData && !hasGameResults && isPreviewSeason(season);

  // Get basic data that works for both regular and preview modes
  let games: Game[] = [];
  let roster: RosterPlayer[] = [];
  let availableSeasons: Season[] = [];
  let gamesWithBoxScores = new Set<number>();
  let seasonId: number | null = null;

  try {
    // First, get available seasons and the season ID for this season label
    let availableSeasonsResult: Season[] = [];
    try {
      const results = await getAvailableTeamSeasons(school.id, sport);
      availableSeasonsResult = (results as any[]).map((s) => ('seasons' in s && s.seasons ? s.seasons : s));
    } catch (e) {
      captureError(e, { sport, slug, season, fetch: "getAvailableTeamSeasons" });
    }
    availableSeasons = availableSeasonsResult;

    // Get the season ID by looking it up in the database
    if (isPreview || teamSeasonData) {
      try {
        const supabase = await createClient();
        const { data: seasonData } = await supabase
          .from("seasons")
          .select("id")
          .eq("label", season)
          .single();
        seasonId = (seasonData as any)?.id ?? null;
      } catch (e) {
        captureError(e, { sport, slug, season, fetch: "season_lookup" });
      }
    }

    // Get games - use team_season season_id if available, otherwise use the season ID we just looked up
    const gameSeasonId = teamSeasonData?.season_id ?? seasonId;
    if (gameSeasonId) {
      try {
        const gamesData = await getGamesByTeamSeason(school.id, sport, gameSeasonId);
        games = gamesData as unknown as Game[];
      } catch (e) {
        captureError(e, { sport, slug, season, fetch: "getGamesByTeamSeason" });
      }
    }

    // Only get roster if we have a team_season record (not for preview with schedule only)
    if (teamSeasonData) {
      try {
        const rosterData = await getTeamRosterBySeason(school.id, sport, teamSeasonData.season_id);
        roster = rosterData as unknown as RosterPlayer[];
      } catch (e) {
        captureError(e, { sport, slug, season, fetch: "getTeamRosterBySeason" });
      }
    }

    // Check which games have box score data
    if (games.length > 0) {
      try {
        const gameIds = games.map((g) => g.id);
        gamesWithBoxScores = await getGamesWithBoxScores(gameIds);
      } catch (e) {
        captureError(e, { sport, slug, season, fetch: "getGamesWithBoxScores" });
      }
    }
  } catch (error) {
    captureError(error, { sport, slug, season, context: "data_fetching" });
  }

  // If no team_season AND no games, then show 404
  if (!teamSeasonData && games.length === 0) {
    notFound();
  }

  const teamSeason: TeamSeason | null = (teamSeasonData as unknown as TeamSeason) ?? null;

  // Calculate record and percentages (only if we have team_season data)
  const wins = teamSeason?.wins || 0;
  const losses = teamSeason?.losses || 0;
  const ties = teamSeason?.ties || 0;
  const total = wins + losses + ties;
  const winPct = total > 0 ? (wins / total) : 0;
  const winPctDisplay = winPct === 1 ? "1.000" : `.${(winPct * 1000).toFixed(0).padStart(3, "0")}`;

  // Helper to get game type badge styling
  const getGameTypeBadge = (game: Game & Record<string, any>) => {
    const gameType = game.game_type;
    if (gameType === "scrimmage") {
      return { bg: "#6b7280", label: "Scrimmage" };
    } else if (gameType === "league") {
      return { bg: "#10b981", label: "League" };
    } else if (gameType === "playoff") {
      return { bg: "#f0a500", label: "Playoff" };
    } else {
      return { bg: "#3b82f6", label: "Non-League" };
    }
  };

  // For preview mode: extract unique opponent IDs from schedule
  let opponentIds: number[] = [];
  if (isPreview && games.length > 0) {
    opponentIds = games
      .map((g) => (g.home_school_id === school.id ? g.away_school_id : g.home_school_id))
      .filter((id): id is number => id !== null);
    opponentIds = [...new Set(opponentIds)];
  }

  // Parse season for calculations
  const seasonParts = season.split("-");
  const currentGradYear = parseInt(seasonParts[0], 10);
  const prevStartYear = currentGradYear - 1;
  const prevSeason = `${prevStartYear}-${String(prevStartYear + 1).slice(2)}`;

  // For preview mode: fetch preview-specific data
  let returningPlayers: ReturningPlayer[] = [];
  let lastSeasonRecap: SeasonRecap | null = null;
  let leagueStandings: LeagueStanding[] = [];
  let scheduleStrength: ScheduleStrength[] = [];
  let matchupHistories: MatchupHistory[] = [];
  let nextLevelAlumni: NextLevelAlumnus[] = [];
  let rosterReturning: RosterReturningPlayer[] = [];
  let previousSeasonId: number | null = null;

  if (isPreview) {
    try {
      const previewResults = await Promise.allSettled([
        (async () => {
          // Get previous season ID
          const supabase = await createClient();
          const { data: prevSeasonData } = await supabase
            .from("seasons")
            .select("id")
            .eq("label", prevSeason)
            .single();
          previousSeasonId = (prevSeasonData as any)?.id ?? null;

          // Get returning roster if we have previous season
          if (previousSeasonId) {
            return getReturningRoster(school.id, sport, previousSeasonId, currentGradYear);
          }
          return [];
        })(),
        getLastSeasonRecap(school.id, sport),
        getLeagueOutlook(school.id, sport, school.league_id ?? null),
        opponentIds.length > 0 ? getScheduleStrength(opponentIds, sport) : Promise.resolve([]),
        opponentIds.length > 0 ? getMatchupHistory(school.id, opponentIds, sport) : Promise.resolve([]),
        getNextLevelAlumni(school.id),
      ]);

      if (previewResults[0].status === "fulfilled") returningPlayers = previewResults[0].value as ReturningPlayer[];
      if (previewResults[1].status === "fulfilled") lastSeasonRecap = previewResults[1].value as SeasonRecap | null;
      if (previewResults[2].status === "fulfilled") leagueStandings = previewResults[2].value as LeagueStanding[];
      if (previewResults[3].status === "fulfilled") scheduleStrength = previewResults[3].value as ScheduleStrength[];
      if (previewResults[4].status === "fulfilled") matchupHistories = previewResults[4].value as MatchupHistory[];
      if (previewResults[5].status === "fulfilled") nextLevelAlumni = previewResults[5].value as NextLevelAlumnus[];

      if (previewResults[0].status === "rejected") captureError(previewResults[0].reason, { sport, slug, season, fetch: "getReturningRoster" });
      if (previewResults[1].status === "rejected") captureError(previewResults[1].reason, { sport, slug, season, fetch: "getLastSeasonRecap" });
      if (previewResults[2].status === "rejected") captureError(previewResults[2].reason, { sport, slug, season, fetch: "getLeagueOutlook" });
      if (previewResults[3].status === "rejected") captureError(previewResults[3].reason, { sport, slug, season, fetch: "getScheduleStrength" });
      if (previewResults[4].status === "rejected") captureError(previewResults[4].reason, { sport, slug, season, fetch: "getMatchupHistory" });
      if (previewResults[5].status === "rejected") captureError(previewResults[5].reason, { sport, slug, season, fetch: "getNextLevelAlumni" });

      // Fetch roster-based returning players separately (needs previousSeasonId)
      if (previousSeasonId) {
        try {
          rosterReturning = await getReturningRosterFromRosters(school.id, sport, previousSeasonId);
        } catch (e) {
          captureError(e, { sport, slug, season, fetch: "getReturningRosterFromRosters" });
        }
      }
    } catch (error) {
      captureError(error, { sport, slug, season, context: "preview_data_fetching" });
    }
  }

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Teams", url: `https://phillysportspack.com/${sport}/teams` },
        { name: school.name, url: `https://phillysportspack.com/${sport}/teams/${school.slug}` },
        { name: season, url: `https://phillysportspack.com/${sport}/teams/${school.slug}/${season}` },
      ]} />
      {/* Team Season Hero Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Teams", href: `/${sport}/teams` },
              { label: school.name, href: `/${sport}/teams/${school.slug}` },
              { label: season },
            ]}
          />

          <div className="flex items-start gap-6 mt-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1
                  className="psp-h1 text-white"
                >
                  {school.name}
                </h1>
                {isPreview && !teamSeason && (
                  <span
                    className="inline-block px-3 py-1 text-xs font-bold rounded-full"
                    style={{
                      background: `linear-gradient(135deg, var(--psp-gold) 0%, #d4860f 100%)`,
                      color: "var(--psp-navy)",
                      border: "2px solid var(--psp-gold)",
                    }}
                  >
                    SEASON PREVIEW
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-xl text-gray-300">{season}</h2>
                {availableSeasons.length > 1 && (
                  <SeasonSelector
                    seasons={availableSeasons.map((s: Season) => ({ label: s.label, year_start: parseInt(s.label.split("-")[0], 10) }))}
                    currentSeason={season}
                    sport={sport}
                    schoolSlug={school.slug}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-gray-300">{school.city}, {school.state}</span>
              </div>
            </div>
          </div>

          {/* Season Stat Bar or Countdown */}
          {teamSeason && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="psp-h2 text-white">
                  {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
                </div>
                <div className="text-xs text-gray-300">Season Record</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="psp-h2 text-white">
                  {winPctDisplay}
                </div>
                <div className="text-xs text-gray-300">Win %</div>
              </div>
              {teamSeason.points_for !== null && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="psp-h2 text-white">
                    {teamSeason.points_for}
                  </div>
                  <div className="text-xs text-gray-300">Points For</div>
                </div>
              )}
              {teamSeason.points_against !== null && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="psp-h2 text-white">
                    {teamSeason.points_against}
                  </div>
                  <div className="text-xs text-gray-300">Points Against</div>
                </div>
              )}
            </div>
          )}

          {/* Preview Mode: Countdown */}
          {isPreview && !teamSeason && games.length > 0 && (
            <div className="mt-8 max-w-3xl">
              <div className="rounded-xl p-6" style={{ background: "rgba(240, 165, 0, 0.1)", border: "2px solid rgba(240, 165, 0, 0.3)" }}>
                <div className="text-sm text-gray-300 mb-2">🏟️ Season Kicks Off</div>
                <div className="psp-h1 text-white">
                  {games[0]?.game_date
                    ? new Date(games[0].game_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "Coming Soon"}
                </div>
              </div>
            </div>
          )}

          {/* Coach Info */}
          {teamSeason?.coaches && (
            <div className="mt-6 text-sm">
              <span className="text-gray-300">Coach: </span>
              <span className="text-white">
                <Link href={`/${sport}/coaches/${teamSeason.coaches.slug}`} className="hover:text-blue-400">
                  {teamSeason.coaches.name}
                </Link>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <TeamSeasonTabs
        sportColor={meta.color}
        tabs={[
          { id: "overview", label: "Overview" },
          ...(!isPreview && roster.length > 0 ? [{ id: "roster", label: "Roster" }] : []),
          ...(isPreview && rosterReturning.length > 0 ? [{ id: "roster", label: "Roster" }] : []),
          { id: "schedule", label: "Schedule" },
          ...(!isPreview && roster.length > 0 ? [{ id: "stats", label: "Stats" }] : []),
          ...(availableSeasons.length > 1 ? [{ id: "history", label: "History" }] : []),
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Section */}
        <section id="overview" className="scroll-mt-16" />

        {/* Season Navigation Bar / History */}
        {availableSeasons.length > 1 && (
          <div id="history" className="mb-8 flex overflow-x-auto gap-2 pb-4 -mx-4 px-4 scroll-mt-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {availableSeasons.map((s: Season) => (
              <Link
                key={s.label}
                href={`/${sport}/teams/${school.slug}/${s.label}`}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  s.label === season
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                style={s.label === season ? { background: `${meta.color}40`, color: "white" } : {}}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}

        {/* Games Section */}
        <ScheduleTable
          games={games}
          school={school}
          sport={sport}
          season={season}
          isPreview={isPreview}
          gamesWithBoxScores={gamesWithBoxScores}
        />

        {/* Players to Watch Section (Preview Mode) */}
        {isPreview && returningPlayers.length > 0 && (
          <section className="mb-8">
            <h2 className="psp-h2 text-white mb-6">
              Players to Watch 👀
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {returningPlayers.slice(0, 10).map((player: ReturningPlayer) => (
                <Link key={player.player_id} href={`/${sport}/players/${player.player_slug}`}>
                  <div
                    className="rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <div className="font-bold mb-1" style={{ color: "#fff", fontSize: "1.05rem" }}>{player.player_name}</div>
                    <div className="text-xs mb-3" style={{ color: "var(--psp-gold)" }}>
                      {player.positions && player.positions.length > 0 ? player.positions.join(", ") : "Position TBD"}
                    </div>
                    {sport === "football" && (
                      <div className="text-sm space-y-1" style={{ color: "#e5e7eb" }}>
                        {player.rush_yards ? <div>📊 {player.rush_yards} rush yds</div> : null}
                        {player.rec_yards ? <div>📊 {player.rec_yards} rec yds</div> : null}
                        {player.pass_yards ? <div>📊 {player.pass_yards} pass yds</div> : null}
                        {player.points && player.points > 0 ? <div>🎯 {player.points} pts</div> : null}
                      </div>
                    )}
                    {(sport === "basketball" || sport === "girls-basketball") && (
                      <div className="text-sm space-y-1" style={{ color: "#e5e7eb" }}>
                        {player.ppg ? <div>🏀 {player.ppg.toFixed(1)} PPG</div> : null}
                        {player.total_points ? <div>📊 {player.total_points} total pts</div> : null}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Departed Seniors Section (Preview Mode - Collapsible) */}
        {isPreview && returningPlayers.filter((p) => p.is_senior).length > 0 && (
          <details className="mb-8">
            <summary
              className="psp-h3 text-gray-300 mb-4 cursor-pointer hover:text-gray-300"
            >
              Departed Seniors ({returningPlayers.filter((p) => p.is_senior).length})
            </summary>
            <div className="space-y-2 ml-4">
              {returningPlayers
                .filter((p) => p.is_senior)
                .map((player: ReturningPlayer) => (
                  <Link
                    key={player.player_id}
                    href={`/${sport}/players/${player.player_slug}`}
                    className="block text-sm text-gray-300 hover:text-gray-300"
                  >
                    {player.player_name}
                  </Link>
                ))}
            </div>
          </details>
        )}

        {/* Returning Roster (Preview Mode) */}
        {isPreview && rosterReturning.length > 0 && (
          <section id="roster" className="mb-8 scroll-mt-16">
            <h2 className="psp-h2 text-white mb-2">
              {season} Roster {isPreview && roster.length === 0 ? "(Projected)" : ""}
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              {isPreview && roster.length === 0 ? `Based on ${prevSeason} roster — seniors graduated` : `${rosterReturning.length} players`}
            </p>
            <SortablePreviewRoster players={rosterReturning as any} sport={sport} />
            <div className="mt-4 text-xs text-gray-400">
              {rosterReturning.length} returning players
            </div>
          </section>
        )}

        {/* Last Season Recap Section (Preview Mode) */}
        {isPreview && lastSeasonRecap && (
          <section className="mb-8">
            <h2 className="psp-h2 text-white mb-6">
              {lastSeasonRecap.season_label} Recap
            </h2>
            <div className="rounded-lg p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xs text-gray-300 mb-1">Record</div>
                  <div className="psp-h2 text-white">
                    {lastSeasonRecap.wins}-{lastSeasonRecap.losses}
                    {lastSeasonRecap.ties > 0 ? `-${lastSeasonRecap.ties}` : ""}
                  </div>
                </div>
                {lastSeasonRecap.points_for !== null && (
                  <div>
                    <div className="text-xs text-gray-300 mb-1">Points For</div>
                    <div className="psp-h2 text-white">
                      {lastSeasonRecap.points_for}
                    </div>
                  </div>
                )}
                {lastSeasonRecap.points_against !== null && (
                  <div>
                    <div className="text-xs text-gray-300 mb-1">Points Against</div>
                    <div className="psp-h2 text-white">
                      {lastSeasonRecap.points_against}
                    </div>
                  </div>
                )}
              </div>

              {lastSeasonRecap.coach_name && (
                <div className="text-sm text-gray-300 mb-4">
                  <span className="text-gray-300">Coach: </span>
                  {lastSeasonRecap.coach_name}
                </div>
              )}

              {lastSeasonRecap.notable_wins.length > 0 && (
                <div>
                  <div className="text-sm font-bold text-gray-300 mb-2">Notable Wins</div>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {lastSeasonRecap.notable_wins.map((win, idx) => (
                      <li key={idx}>
                        {win.opponent} {win.score}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lastSeasonRecap.playoff_result && (
                <div className="text-sm text-gray-300 mt-4">
                  <span className="text-gray-300">Playoff: </span>
                  {lastSeasonRecap.playoff_result}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Historical Matchups Section (Preview Mode) */}
        {isPreview && matchupHistories.length > 0 && (
          <section className="mb-8">
            <h2 className="psp-h2 text-white mb-6">
              Head-to-Head History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-200" aria-label="Head-to-head history">
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Opponent</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">All-Time</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">Last Meeting</th>
                  </tr>
                </thead>
                <tbody>
                  {matchupHistories.map((matchup: MatchupHistory, idx: number) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td className="py-3 px-4">
                        <Link href={`/${sport}/teams/${matchup.opponent_slug}`} className="text-blue-400 hover:underline">
                          {matchup.opponent_name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300">
                        {matchup.wins}-{matchup.losses}
                        {matchup.ties > 0 ? `-${matchup.ties}` : ""}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300">
                        {matchup.last_game_score ? matchup.last_game_score : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Roster & Stats Section */}
        {!isPreview && (
          <RosterStatsTable roster={roster} school={school} sport={sport} season={season} />
        )}

        {/* Sidebar for Preview Mode */}
        {isPreview && (
          <PreviewSidebar
            sport={sport}
            scheduleStrength={scheduleStrength}
            leagueStandings={leagueStandings}
            nextLevelAlumni={nextLevelAlumni}
          />
        )}

        {/* PSP Promo */}
        <PSPPromo size="banner" />
      </div>
    </>
  );
}
