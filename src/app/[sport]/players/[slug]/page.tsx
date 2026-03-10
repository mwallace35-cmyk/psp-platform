import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats, getBaseballPlayerStats, getPlayerAwards, getPlayerGameLog, getPlayerTeamGames, type Player, type FootballPlayerSeason, type BasketballPlayerSeason, type BaseballPlayerSeason, type Award, type PlayerGameLog, type TeamGame } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo/JsonLd";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { buildOgImageUrl } from "@/lib/og-utils";
import type { Metadata } from "next";

// Dynamic imports for heavy client components (below fold)
const CorrectionForm = dynamic(() => import("@/components/corrections/CorrectionForm"), {
  loading: () => <div className="text-center py-4 text-gray-500 text-sm">Loading form...</div>,
});

const ClientCareerTrajectory = dynamic(() => import("@/components/viz/ClientCareerTrajectory"), {
  loading: () => <div className="w-full bg-white rounded-lg border border-gray-200 p-4 h-[300px] animate-pulse" />,
});

export const revalidate = 86400;

type PageParams = { sport: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const player = await getPlayerBySlug(slug);
  if (!player) return {};

  // Build dynamic description with actual stats
  const school = player.schools?.name || "a Philadelphia school";
  const classYear = player.graduation_year ? ` (Class of ${player.graduation_year})` : "";
  const description = `${player.name} career stats at ${school}${classYear}. Season-by-season breakdown, game log, awards, and honors on PhillySportsPack.com.`;

  const ogImageUrl = buildOgImageUrl({
    title: player.name,
    subtitle: `${SPORT_META[sport].name} — Career Profile`,
    sport: sport,
    type: "player",
  });
  return {
    title: `${player.name} — ${school} ${SPORT_META[sport].name} — PhillySportsPack`,
    description,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/players/${slug}`,
    },
    openGraph: {
      title: `${player.name} — ${school} ${SPORT_META[sport].name} — PhillySportsPack`,
      description,
      url: `https://phillysportspack.com/${sport}/players/${slug}`,
      type: "profile",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${player.name} profile` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${player.name} — ${school} ${SPORT_META[sport].name} — PhillySportsPack`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PlayerCareerPage({ params }: { params: Promise<PageParams> }) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();

  const playerData = await getPlayerBySlug(slug);
  if (!playerData) notFound();

  const player = playerData as unknown as Player;
  const meta = SPORT_META[sport];

  // Fetch stats first (needed to derive season IDs for team games)
  const stats = await (
    sport === "football"
      ? getFootballPlayerStats(player.id) as Promise<FootballPlayerSeason[]>
      : sport === "basketball"
      ? getBasketballPlayerStats(player.id) as Promise<BasketballPlayerSeason[]>
      : sport === "baseball"
      ? getBaseballPlayerStats(player.id) as Promise<BaseballPlayerSeason[]>
      : Promise.resolve([])
  ) as (FootballPlayerSeason | BasketballPlayerSeason | BaseballPlayerSeason)[];

  // Extract season IDs from player stats for team game lookup
  const seasonIds = stats
    .map((s) => (s as { season_id?: number }).season_id)
    .filter((id): id is number => id != null);

  // Parallelize remaining fetches
  const [awards, gameLog, teamGames] = await Promise.all([
    getPlayerAwards(player.id),
    (sport === "football" || sport === "basketball") ? getPlayerGameLog(player.id) : Promise.resolve([]),
    (sport === "football" || sport === "basketball") && player.primary_school_id && seasonIds.length > 0
      ? getPlayerTeamGames(player.primary_school_id, sport, seasonIds)
      : Promise.resolve([]),
  ]) as [Award[], PlayerGameLog[], TeamGame[]];

  // Football career totals
  const footballTotals = sport === "football" && stats.length > 0 ? (() => {
    const fbStats = stats as FootballPlayerSeason[];
    const rushYards = fbStats.reduce((sum, s) => sum + (s.rush_yards || 0), 0);
    const rushTd = fbStats.reduce((sum, s) => sum + (s.rush_td || 0), 0);
    const passYards = fbStats.reduce((sum, s) => sum + (s.pass_yards || 0), 0);
    const passTd = fbStats.reduce((sum, s) => sum + (s.pass_td || 0), 0);
    const recYards = fbStats.reduce((sum, s) => sum + (s.rec_yards || 0), 0);
    const recTd = fbStats.reduce((sum, s) => sum + (s.rec_td || 0), 0);
    const totalTd = fbStats.reduce((sum, s) => sum + (s.total_td || 0), 0);
    const rushCarries = fbStats.reduce((sum, s) => sum + (s.rush_carries || 0), 0);
    const gamesPlayed = fbStats.reduce((sum, s) => sum + (s.games_played || 0), 0);
    return { rushYards, rushTd, passYards, passTd, recYards, recTd, totalTd, rushCarries, gamesPlayed };
  })() : null;

  // Basketball career totals
  const basketballTotals = sport === "basketball" && stats.length > 0 ? {
    points: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.points || 0), 0),
    games: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.games_played || 0), 0),
    rebounds: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.rebounds || 0), 0),
    assists: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.assists || 0), 0),
  } : null;

  // Build merged game log: all team games + individual stats where available
  const boxScoreByGameId = new Map<number, PlayerGameLog>();
  for (const g of gameLog) {
    if (g.games?.id) boxScoreByGameId.set(g.games.id, g);
  }

  interface MergedGameEntry {
    gameId: number;
    gameDate: string | null;
    seasonLabel: string | null;
    homeSchoolId: number | null;
    awaySchoolId: number | null;
    homeScore: number | null;
    awayScore: number | null;
    homeSchool: { id: number; name: string; slug: string } | null;
    awaySchool: { id: number; name: string; slug: string } | null;
    // Individual stats (null = no box score data for this game)
    hasBoxScore: boolean;
    rushYards: number | null;
    passYards: number | null;
    recYards: number | null;
    points: number | null;
    bbPoints: number | null;
  }

  const mergedGames: MergedGameEntry[] = teamGames.map((tg) => {
    const bs = boxScoreByGameId.get(tg.id);
    return {
      gameId: tg.id,
      gameDate: tg.game_date,
      seasonLabel: tg.seasons?.label ?? null,
      homeSchoolId: tg.home_school_id,
      awaySchoolId: tg.away_school_id,
      homeScore: tg.home_score,
      awayScore: tg.away_score,
      homeSchool: tg.home_school,
      awaySchool: tg.away_school,
      hasBoxScore: !!bs,
      rushYards: bs?.rush_yards ?? null,
      passYards: bs?.pass_yards ?? null,
      recYards: bs?.rec_yards ?? null,
      points: bs?.points ?? null,
      bbPoints: bs?.points ?? null,
    };
  });

  // Also add any box score entries not already in team games (edge case: game school_id mismatch)
  const teamGameIds = new Set(teamGames.map((tg) => tg.id));
  for (const g of gameLog) {
    if (g.games && !teamGameIds.has(g.games.id)) {
      mergedGames.push({
        gameId: g.games.id,
        gameDate: g.games.game_date,
        seasonLabel: g.games.seasons?.label ?? null,
        homeSchoolId: g.games.home_school_id,
        awaySchoolId: g.games.away_school_id,
        homeScore: g.games.home_score,
        awayScore: g.games.away_score,
        homeSchool: g.games.home_school,
        awaySchool: g.games.away_school,
        hasBoxScore: true,
        rushYards: g.rush_yards,
        passYards: g.pass_yards,
        recYards: g.rec_yards,
        points: g.points,
        bbPoints: g.points,
      });
    }
  }

  // Sort merged games by date descending
  mergedGames.sort((a, b) => (b.gameDate || "").localeCompare(a.gameDate || ""));

  // Determine which columns to show for football (hide all-zero columns)
  const fbVis = sport === "football" && stats.length > 0 ? {
    pass_yards: (stats as FootballPlayerSeason[]).some(s => s.pass_yards && s.pass_yards > 0),
    pass_td: (stats as FootballPlayerSeason[]).some(s => s.pass_td && s.pass_td > 0),
    rec_yards: (stats as FootballPlayerSeason[]).some(s => s.rec_yards && s.rec_yards > 0),
    rec_td: (stats as FootballPlayerSeason[]).some(s => s.rec_td && s.rec_td > 0),
    rush_carries: (stats as FootballPlayerSeason[]).some(s => s.rush_carries && s.rush_carries > 0),
    games_played: (stats as FootballPlayerSeason[]).some(s => s.games_played && s.games_played > 0),
    interceptions: (stats as FootballPlayerSeason[]).some(s => s.interceptions && s.interceptions > 0),
  } : null;

  // School initials for avatar
  const schoolInitials = player.schools?.name
    ? player.schools.name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Players", url: `https://phillysportspack.com/${sport}/players` },
        { name: player.name, url: `https://phillysportspack.com/${sport}/players/${slug}` },
      ]} />
      <PersonJsonLd
        name={player.name}
        description={`${player.name} is a Philadelphia high school ${meta.name.toLowerCase()} player.`}
        sport={meta.name}
        school={player.schools?.name}
        url={`https://phillysportspack.com/${sport}/players/${slug}`}
        college={player.college}
        proTeam={player.pro_team}
      />

      {/* Player header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Players" },
            { label: player.name }
          ]} />

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--psp-gold)", fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.05em" }}
              aria-hidden="true"
            >
              {schoolInitials}
            </div>
            <div className="flex-1">
              <h1
                className="text-4xl md:text-5xl text-white mb-2 tracking-wider"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {player.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                {player.schools && (
                  <Link href={`/${sport}/schools/${player.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                    {player.schools?.name}
                  </Link>
                )}
                {player.positions && player.positions.length > 0 && (
                  <span className="text-gray-400">{player.positions.join(", ")}</span>
                )}
                {player.graduation_year && (
                  <span className="text-gray-400">Class of {player.graduation_year}</span>
                )}
                {player.is_multi_sport && (
                  <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                    Multi-Sport
                  </span>
                )}
                {player.pro_team && (
                  <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                    Pro Athlete
                  </span>
                )}
                {player.college && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white">
                    College
                  </span>
                )}
              </div>
              <div className="mt-4">
                <ShareButtons
                  url={`/${sport}/players/${slug}`}
                  title={`${player.name} — ${meta.name} Stats | PhillySportsPack`}
                  description={`Check out ${player.name}'s career stats on PhillySportsPack.com`}
                />
              </div>
            </div>
          </div>

          {/* Career stat highlights — football */}
          {footballTotals && (
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
              {[
                { label: "Rush Yards", value: footballTotals.rushYards.toLocaleString() },
                { label: "Rush TDs", value: footballTotals.rushTd },
                ...(footballTotals.passYards > 0 ? [{ label: "Pass Yards", value: footballTotals.passYards.toLocaleString() }] : []),
                ...(footballTotals.recYards > 0 ? [{ label: "Rec Yards", value: footballTotals.recYards.toLocaleString() }] : []),
                { label: "Total TDs", value: footballTotals.totalTd },
              ].slice(0, 4).map((s) => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <dt className="text-xs text-gray-400">{s.label}</dt>
                  <dd className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Career stat highlights — basketball */}
          {basketballTotals && (
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
              {[
                { label: "Career Points", value: basketballTotals.points.toLocaleString() },
                { label: "PPG", value: basketballTotals.games > 0 ? (basketballTotals.points / basketballTotals.games).toFixed(1) : "—" },
                { label: "Games", value: basketballTotals.games },
                { label: "Rebounds", value: basketballTotals.rebounds },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <dt className="text-xs text-gray-400">{s.label}</dt>
                  <dd className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <PSPPromo size="banner" variant={2} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Trajectory Chart */}
            {sport === "football" && stats.length > 1 && (
              <ClientCareerTrajectory
                seasons={(stats as FootballPlayerSeason[]).map((s) => ({
                  year: s.seasons?.label || "Unknown",
                  value: s.rush_yards || 0,
                  isChampionship: false,
                }))}
                stat="Rushing Yards"
                sport={sport}
                height={300}
              />
            )}

            {/* Football Season-by-season stats */}
            {sport === "football" && stats.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Season-by-Season Stats
                </h2>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="data-table" aria-label={`${player.name} season-by-season football statistics`}>
                    <thead>
                      <tr>
                        <th scope="col">Season</th>
                        <th scope="col">School</th>
                        {fbVis?.games_played && <th scope="col" className="text-right">GP</th>}
                        {fbVis?.rush_carries && <th scope="col" className="text-right">Carries</th>}
                        <th scope="col" className="text-right">Rush Yds</th>
                        <th scope="col" className="text-right">Rush TD</th>
                        {fbVis?.pass_yards && <th scope="col" className="text-right">Pass Yds</th>}
                        {fbVis?.pass_td && <th scope="col" className="text-right">Pass TD</th>}
                        {fbVis?.rec_yards && <th scope="col" className="text-right">Rec Yds</th>}
                        {fbVis?.rec_td && <th scope="col" className="text-right">Rec TD</th>}
                        <th scope="col" className="text-right">Total TD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats as FootballPlayerSeason[]).map((s) => (
                        <tr key={s.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</td>
                          <td className="text-xs">
                            <Link href={`/${sport}/schools/${s.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                              {s.schools?.name}
                            </Link>
                          </td>
                          {fbVis?.games_played && <td className="text-right">{s.games_played || "—"}</td>}
                          {fbVis?.rush_carries && <td className="text-right">{s.rush_carries || "—"}</td>}
                          <td className="text-right">{s.rush_yards || "—"}</td>
                          <td className="text-right">{s.rush_td || "—"}</td>
                          {fbVis?.pass_yards && <td className="text-right">{s.pass_yards || "—"}</td>}
                          {fbVis?.pass_td && <td className="text-right">{s.pass_td || "—"}</td>}
                          {fbVis?.rec_yards && <td className="text-right">{s.rec_yards || "—"}</td>}
                          {fbVis?.rec_td && <td className="text-right">{s.rec_td || "—"}</td>}
                          <td className="text-right font-bold">{s.total_td || "—"}</td>
                        </tr>
                      ))}
                      {stats.length > 1 && footballTotals && (
                        <tr className="font-bold" style={{ background: "var(--psp-gray-50)" }}>
                          <td colSpan={2}>Career Totals</td>
                          {fbVis?.games_played && <td className="text-right">{footballTotals.gamesPlayed}</td>}
                          {fbVis?.rush_carries && <td className="text-right">{footballTotals.rushCarries.toLocaleString()}</td>}
                          <td className="text-right">{footballTotals.rushYards.toLocaleString()}</td>
                          <td className="text-right">{footballTotals.rushTd}</td>
                          {fbVis?.pass_yards && <td className="text-right">{footballTotals.passYards.toLocaleString()}</td>}
                          {fbVis?.pass_td && <td className="text-right">{footballTotals.passTd}</td>}
                          {fbVis?.rec_yards && <td className="text-right">{footballTotals.recYards.toLocaleString()}</td>}
                          {fbVis?.rec_td && <td className="text-right">{footballTotals.recTd}</td>}
                          <td className="text-right">{footballTotals.totalTd}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card layout */}
                <div className="md:hidden space-y-3">
                  {(stats as FootballPlayerSeason[]).map((s) => (
                    <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-bold text-sm" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</span>
                        <Link href={`/${sport}/schools/${s.schools?.slug}`} className="text-xs hover:underline" style={{ color: "var(--psp-gold)" }}>
                          {s.schools?.name}
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {fbVis?.games_played && (
                          <div>
                            <div className="text-xs text-gray-500">GP</div>
                            <div className="font-bold text-sm">{s.games_played || "—"}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-gray-500">Rush Yds</div>
                          <div className="font-bold text-sm">{s.rush_yards || "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Rush TD</div>
                          <div className="font-bold text-sm">{s.rush_td || "—"}</div>
                        </div>
                        {fbVis?.rush_carries && (
                          <div>
                            <div className="text-xs text-gray-500">Carries</div>
                            <div className="font-bold text-sm">{s.rush_carries || "—"}</div>
                          </div>
                        )}
                        {fbVis?.pass_yards && (
                          <div>
                            <div className="text-xs text-gray-500">Pass Yds</div>
                            <div className="font-bold text-sm">{s.pass_yards || "—"}</div>
                          </div>
                        )}
                        {fbVis?.pass_td && (
                          <div>
                            <div className="text-xs text-gray-500">Pass TD</div>
                            <div className="font-bold text-sm">{s.pass_td || "—"}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-gray-500">Total TD</div>
                          <div className="font-bold text-sm" style={{ color: "var(--psp-gold)" }}>{s.total_td || "—"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stats.length > 1 && footballTotals && (
                    <div className="bg-gray-50 rounded-lg border-2 border-gray-300 p-4">
                      <div className="font-bold text-sm mb-2" style={{ color: "var(--psp-navy)" }}>Career Totals</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {fbVis?.games_played && (
                          <div><div className="text-xs text-gray-500">GP</div><div className="font-bold text-sm">{footballTotals.gamesPlayed}</div></div>
                        )}
                        <div><div className="text-xs text-gray-500">Rush Yds</div><div className="font-bold text-sm">{footballTotals.rushYards.toLocaleString()}</div></div>
                        <div><div className="text-xs text-gray-500">Rush TD</div><div className="font-bold text-sm">{footballTotals.rushTd}</div></div>
                        {fbVis?.rush_carries && (
                          <div><div className="text-xs text-gray-500">Carries</div><div className="font-bold text-sm">{footballTotals.rushCarries.toLocaleString()}</div></div>
                        )}
                        {fbVis?.pass_yards && (
                          <div><div className="text-xs text-gray-500">Pass Yds</div><div className="font-bold text-sm">{footballTotals.passYards.toLocaleString()}</div></div>
                        )}
                        <div><div className="text-xs text-gray-500">Total TD</div><div className="font-bold text-sm" style={{ color: "var(--psp-gold)" }}>{footballTotals.totalTd}</div></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Basketball chart */}
            {sport === "basketball" && stats.length > 1 && (
              <ClientCareerTrajectory
                seasons={(stats as BasketballPlayerSeason[]).map((s) => ({
                  year: s.seasons?.label || "Unknown",
                  value: s.points || 0,
                  isChampionship: false,
                }))}
                stat="Points"
                sport={sport}
                height={300}
              />
            )}

            {/* Basketball Season-by-season stats */}
            {sport === "basketball" && stats.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Season-by-Season Stats
                </h2>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="data-table" aria-label={`${player.name} season-by-season basketball statistics`}>
                    <thead>
                      <tr>
                        <th scope="col">Season</th>
                        <th scope="col">School</th>
                        <th scope="col" className="text-right">GP</th>
                        <th scope="col" className="text-right">PTS</th>
                        <th scope="col" className="text-right">PPG</th>
                        <th scope="col" className="text-right">REB</th>
                        <th scope="col" className="text-right">AST</th>
                        <th scope="col" className="text-right">STL</th>
                        <th scope="col" className="text-right">BLK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats as BasketballPlayerSeason[]).map((s) => (
                        <tr key={s.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</td>
                          <td className="text-xs">
                            <Link href={`/${sport}/schools/${s.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                              {s.schools?.name}
                            </Link>
                          </td>
                          <td className="text-right">{s.games_played ?? "—"}</td>
                          <td className="text-right">{s.points ?? "—"}</td>
                          <td className="text-right">{s.ppg ?? "—"}</td>
                          <td className="text-right">{s.rebounds ?? "—"}</td>
                          <td className="text-right">{s.assists ?? "—"}</td>
                          <td className="text-right">{s.steals ?? "—"}</td>
                          <td className="text-right">{s.blocks ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile card layout */}
                <div className="md:hidden space-y-3">
                  {(stats as BasketballPlayerSeason[]).map((s) => (
                    <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-bold text-sm" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</span>
                        <Link href={`/${sport}/schools/${s.schools?.slug}`} className="text-xs hover:underline" style={{ color: "var(--psp-gold)" }}>
                          {s.schools?.name}
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><div className="text-xs text-gray-500">GP</div><div className="font-bold text-sm">{s.games_played ?? "—"}</div></div>
                        <div><div className="text-xs text-gray-500">PTS</div><div className="font-bold text-sm">{s.points ?? "—"}</div></div>
                        <div><div className="text-xs text-gray-500">PPG</div><div className="font-bold text-sm">{s.ppg ?? "—"}</div></div>
                        <div><div className="text-xs text-gray-500">REB</div><div className="font-bold text-sm">{s.rebounds ?? "—"}</div></div>
                        <div><div className="text-xs text-gray-500">AST</div><div className="font-bold text-sm">{s.assists ?? "—"}</div></div>
                        <div><div className="text-xs text-gray-500">STL</div><div className="font-bold text-sm">{s.steals ?? "—"}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Football Game Log — shows ALL team games with individual stats where available */}
            {mergedGames.length > 0 && sport === "football" && (() => {
              const boxScoreCount = mergedGames.filter(g => g.hasBoxScore).length;
              let lastSeason: string | null = null;
              return (
                <div>
                  <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                    Game Log ({mergedGames.length} games)
                  </h2>
                  {boxScoreCount < mergedGames.length && (
                    <p className="text-xs text-gray-500 mb-4">
                      Individual stats available for {boxScoreCount} of {mergedGames.length} games
                    </p>
                  )}
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="data-table" aria-label={`${player.name} game-by-game statistics`}>
                      <thead>
                        <tr>
                          <th scope="col">Date</th>
                          <th scope="col">Opponent</th>
                          <th scope="col" className="text-center">Score</th>
                          <th scope="col" className="text-right">Rush Yds</th>
                          <th scope="col" className="text-right">Pass Yds</th>
                          <th scope="col" className="text-right">Rec Yds</th>
                          <th scope="col" className="text-right">PTS</th>
                          <th scope="col" className="text-center"><span className="sr-only">Box Score</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {mergedGames.map((g) => {
                          const isHome = g.homeSchoolId === player.primary_school_id;
                          const opp = isHome ? g.awaySchool : g.homeSchool;
                          const oppLabel = opp ? `${isHome ? "vs" : "at"} ${opp.name}` : "—";
                          const dateStr = g.gameDate ? new Date(g.gameDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "—";
                          const teamScore = isHome ? g.homeScore : g.awayScore;
                          const oppScore = isHome ? g.awayScore : g.homeScore;
                          const won = teamScore != null && oppScore != null ? teamScore > oppScore : null;
                          const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : "—";

                          // Season separator
                          const showSeasonHeader = g.seasonLabel !== lastSeason;
                          lastSeason = g.seasonLabel;

                          return (
                            <React.Fragment key={g.gameId}>
                              {showSeasonHeader && (
                                <tr>
                                  <td colSpan={8} className="py-2 px-2 text-xs font-bold uppercase tracking-wider" style={{ background: "var(--psp-navy)", color: "var(--psp-gold)" }}>
                                    {g.seasonLabel} Season
                                  </td>
                                </tr>
                              )}
                              <tr className={g.hasBoxScore ? "" : "opacity-60"}>
                                <td className="whitespace-nowrap text-xs text-gray-500">{dateStr}</td>
                                <td className="whitespace-nowrap text-xs">
                                  {opp ? (
                                    <Link href={`/${sport}/schools/${opp.slug}`} className="hover:underline" style={{ color: "var(--psp-blue)" }}>
                                      {oppLabel}
                                    </Link>
                                  ) : "—"}
                                </td>
                                <td className="text-center text-xs whitespace-nowrap">
                                  {won != null ? (
                                    <span className={won ? "font-bold text-green-700" : "text-red-600"}>
                                      {won ? "W" : "L"} {scoreStr}
                                    </span>
                                  ) : scoreStr}
                                </td>
                                {g.hasBoxScore ? (
                                  <>
                                    <td className="text-right">{g.rushYards ?? "—"}</td>
                                    <td className="text-right">{g.passYards ?? "—"}</td>
                                    <td className="text-right">{g.recYards ?? "—"}</td>
                                    <td className="text-right font-bold">{g.points ?? "—"}</td>
                                  </>
                                ) : (
                                  <td colSpan={4} className="text-center text-xs text-gray-400 italic">no individual stats</td>
                                )}
                                <td className="text-center">
                                  {g.hasBoxScore ? (
                                    <Link
                                      href={`/${sport}/games/${g.gameId}`}
                                      className="text-xs px-3 py-1 rounded"
                                      style={{ background: "var(--psp-blue)", color: "white" }}
                                      aria-label={`Box score: ${oppLabel}, ${dateStr}`}
                                    >
                                      Box Score
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/${sport}/games/${g.gameId}`}
                                      className="text-xs px-3 py-1 rounded border"
                                      style={{ borderColor: "var(--psp-gray-300)", color: "var(--psp-gray-500)" }}
                                      aria-label={`Game details: ${oppLabel}, ${dateStr}`}
                                    >
                                      Details
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile card layout */}
                  <div className="md:hidden space-y-2">
                    {(() => {
                      let mobileSeason: string | null = null;
                      return mergedGames.map((g) => {
                        const isHome = g.homeSchoolId === player.primary_school_id;
                        const opp = isHome ? g.awaySchool : g.homeSchool;
                        const oppLabel = opp ? `${isHome ? "vs" : "at"} ${opp.name}` : "Unknown";
                        const dateStr = g.gameDate ? new Date(g.gameDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "—";
                        const teamScore = isHome ? g.homeScore : g.awayScore;
                        const oppScore = isHome ? g.awayScore : g.homeScore;
                        const won = teamScore != null && oppScore != null ? teamScore > oppScore : null;
                        const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : "";

                        const showMobileHeader = g.seasonLabel !== mobileSeason;
                        mobileSeason = g.seasonLabel;

                        return (
                          <React.Fragment key={g.gameId}>
                            {showMobileHeader && (
                              <div className="py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider" style={{ background: "var(--psp-navy)", color: "var(--psp-gold)" }}>
                                {g.seasonLabel} Season
                              </div>
                            )}
                            <div className={`bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 ${g.hasBoxScore ? "" : "opacity-60"}`}>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs text-gray-400">{dateStr}</span>
                                  {opp ? (
                                    <Link href={`/${sport}/schools/${opp.slug}`} className="text-sm font-medium truncate hover:underline" style={{ color: "var(--psp-blue)" }}>
                                      {oppLabel}
                                    </Link>
                                  ) : <span className="text-sm">Unknown</span>}
                                </div>
                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                  {won != null && (
                                    <span className={won ? "font-bold text-green-700" : "text-red-600"}>
                                      {won ? "W" : "L"} {scoreStr}
                                    </span>
                                  )}
                                  {g.hasBoxScore && g.rushYards != null && <span>{g.rushYards} rush</span>}
                                  {g.hasBoxScore && g.passYards != null && <span>{g.passYards} pass</span>}
                                  {g.hasBoxScore && g.recYards != null && <span>{g.recYards} rec</span>}
                                  {!g.hasBoxScore && <span className="italic text-gray-400">no stats</span>}
                                </div>
                              </div>
                              {g.hasBoxScore && g.points != null && (
                                <div className="text-lg font-bold" style={{ color: "var(--psp-navy)" }}>{g.points} pts</div>
                              )}
                              <Link
                                href={`/${sport}/games/${g.gameId}`}
                                className="text-xs px-2 py-1 rounded whitespace-nowrap"
                                style={g.hasBoxScore ? { background: "var(--psp-blue)", color: "white" } : { border: "1px solid var(--psp-gray-300)", color: "var(--psp-gray-500)" }}
                                aria-label={`${g.hasBoxScore ? "Box score" : "Game details"}: ${oppLabel}, ${dateStr}`}
                              >
                                {g.hasBoxScore ? "Box" : "Game"}
                              </Link>
                            </div>
                          </React.Fragment>
                        );
                      });
                    })()}
                  </div>
                </div>
              );
            })()}

            {/* Basketball Game Log — shows ALL team games with individual stats where available */}
            {mergedGames.length > 0 && sport === "basketball" && (() => {
              const boxScoreCount = mergedGames.filter(g => g.hasBoxScore).length;
              let lastSeason: string | null = null;
              return (
                <div>
                  <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                    Game Log ({mergedGames.length} games)
                  </h2>
                  {boxScoreCount < mergedGames.length && (
                    <p className="text-xs text-gray-500 mb-4">
                      Individual stats available for {boxScoreCount} of {mergedGames.length} games
                    </p>
                  )}
                  <div className="overflow-x-auto">
                    <table className="data-table" aria-label={`${player.name} game-by-game statistics`}>
                      <thead>
                        <tr>
                          <th scope="col">Date</th>
                          <th scope="col">Opponent</th>
                          <th scope="col" className="text-center">Score</th>
                          <th scope="col" className="text-right">PTS</th>
                          <th scope="col" className="text-center"><span className="sr-only">Box Score</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {mergedGames.map((g) => {
                          const isHome = g.homeSchoolId === player.primary_school_id;
                          const opp = isHome ? g.awaySchool : g.homeSchool;
                          const oppLabel = opp ? `${isHome ? "vs" : "at"} ${opp.name}` : "—";
                          const dateStr = g.gameDate ? new Date(g.gameDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "—";
                          const teamScore = isHome ? g.homeScore : g.awayScore;
                          const oppScore = isHome ? g.awayScore : g.homeScore;
                          const won = teamScore != null && oppScore != null ? teamScore > oppScore : null;
                          const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : "—";

                          const showSeasonHeader = g.seasonLabel !== lastSeason;
                          lastSeason = g.seasonLabel;

                          return (
                            <React.Fragment key={g.gameId}>
                              {showSeasonHeader && (
                                <tr>
                                  <td colSpan={5} className="py-2 px-2 text-xs font-bold uppercase tracking-wider" style={{ background: "var(--psp-navy)", color: "var(--psp-gold)" }}>
                                    {g.seasonLabel} Season
                                  </td>
                                </tr>
                              )}
                              <tr className={g.hasBoxScore ? "" : "opacity-60"}>
                                <td className="whitespace-nowrap text-xs text-gray-500">{dateStr}</td>
                                <td className="whitespace-nowrap text-xs">
                                  {opp ? (
                                    <Link href={`/${sport}/schools/${opp.slug}`} className="hover:underline" style={{ color: "var(--psp-blue)" }}>
                                      {oppLabel}
                                    </Link>
                                  ) : "—"}
                                </td>
                                <td className="text-center text-xs whitespace-nowrap">
                                  {won != null ? (
                                    <span className={won ? "font-bold text-green-700" : "text-red-600"}>
                                      {won ? "W" : "L"} {scoreStr}
                                    </span>
                                  ) : scoreStr}
                                </td>
                                <td className="text-right font-bold">{g.hasBoxScore ? (g.bbPoints ?? "—") : <span className="text-gray-400 font-normal italic text-xs">—</span>}</td>
                                <td className="text-center">
                                  {g.hasBoxScore ? (
                                    <Link
                                      href={`/${sport}/games/${g.gameId}`}
                                      className="text-xs px-3 py-1 rounded"
                                      style={{ background: "var(--psp-blue)", color: "white" }}
                                      aria-label={`Box score: ${oppLabel}, ${dateStr}`}
                                    >
                                      Box Score
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/${sport}/games/${g.gameId}`}
                                      className="text-xs px-3 py-1 rounded border"
                                      style={{ borderColor: "var(--psp-gray-300)", color: "var(--psp-gray-500)" }}
                                      aria-label={`Game details: ${oppLabel}, ${dateStr}`}
                                    >
                                      Details
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Awards */}
            {(awards as Award[]).length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Honors & Awards
                </h2>
                <div className="space-y-2">
                  {(awards as Award[]).map((a) => (
                    <div key={a.id} className="bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 flex items-center gap-3">
                      <span className="text-xl" aria-hidden="true">🏅</span>
                      <div>
                        <span className="font-medium text-sm" style={{ color: "var(--psp-navy)" }}>
                          {a.award_name || a.award_type}
                        </span>
                        {a.seasons?.label && (
                          <span className="text-xs ml-2" style={{ color: "var(--psp-gray-500)" }}>{a.seasons.label}</span>
                        )}
                        {a.category && (
                          <span className="text-xs ml-2" style={{ color: "var(--psp-gray-400)" }}>{a.category}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related: More from this school */}
            {player.schools && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  More from {player.schools?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">Explore other players from this school</p>
                <Link href={`/${sport}/schools/${player.schools?.slug}`} className="inline-block px-6 py-3 rounded-lg font-medium" style={{ background: "var(--psp-navy)", color: "white" }}>
                  View all {player.schools?.name} players →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player info */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Player Info
              </h3>
              <dl className="space-y-3 text-sm">
                {player.primary_school_id && player.schools && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>School</dt>
                    <dd>
                      <Link href={`/${sport}/schools/${player.schools?.slug}`} className="font-medium hover:underline" style={{ color: "var(--psp-navy)" }}>
                        {player.schools?.name}
                      </Link>
                    </dd>
                  </div>
                )}
                {player.positions && player.positions.length > 0 && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Position</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.positions.join(", ")}</dd>
                  </div>
                )}
                {player.graduation_year && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Class</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.graduation_year}</dd>
                  </div>
                )}
                {player.height && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Height</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.height}</dd>
                  </div>
                )}
                {footballTotals && fbVis?.rush_carries && footballTotals.rushCarries > 0 && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Yards/Carry</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {(footballTotals.rushYards / footballTotals.rushCarries).toFixed(1)}
                    </dd>
                  </div>
                )}
                {footballTotals && footballTotals.gamesPlayed > 0 && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Career Games</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{footballTotals.gamesPlayed}</dd>
                  </div>
                )}
              </dl>
            </div>

            <PSPPromo size="sidebar" variant={4} />

            {/* Pro/college info */}
            {(player.college || player.pro_team) && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                  Next Level
                </h3>
                <dl className="space-y-3 text-sm">
                  {player.college && (
                    <div className="flex justify-between">
                      <dt style={{ color: "var(--psp-gray-500)" }}>College</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.college}</dd>
                    </div>
                  )}
                  {player.pro_team && (
                    <div className="flex justify-between">
                      <dt style={{ color: "var(--psp-gray-500)" }}>Pro Team</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-gold)" }}>{player.pro_team}</dd>
                    </div>
                  )}
                  {player.pro_draft_info && (
                    <div className="flex justify-between">
                      <dt style={{ color: "var(--psp-gray-500)" }}>Draft</dt>
                      <dd className="font-medium text-xs" style={{ color: "var(--psp-navy)" }}>{player.pro_draft_info}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            <RelatedArticles entityType="player" entityId={player.id} />

            {/* Career leaderboard context */}
            {sport === "football" && footballTotals && footballTotals.rushYards > 0 && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--psp-gray-400)" }}>
                  Leaderboard
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {player.name} has {footballTotals.rushYards.toLocaleString()} career rushing yards.
                </p>
                <Link
                  href={`/${sport}/records`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: "var(--psp-blue)" }}
                >
                  View career rushing leaders →
                </Link>
              </div>
            )}

            <PSPPromo size="sidebar" variant={3} />
          </div>
        </div>
      </div>

      {/* Correction Form */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <CorrectionForm entityType="player" entityId={player.id} entityName={player.name} />
      </div>
    </>
  );
}
