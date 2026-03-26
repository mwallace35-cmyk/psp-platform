import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META } from "@/lib/sports";
import {
  getSchoolBySlug,
  getSchoolTeamSeasons,
  getSchoolChampionships,
  getTrackedAlumni,
  getGamesByTeamSeason,
  getTeamRosterBySeason,
  getArticlesForEntity,
  getTeamStatLeaders,
} from "@/lib/data";
import TeamPageClient from "@/components/teams/TeamPageClient";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamic = "force-dynamic";
type PageProps = {
  params: Promise<{ sport: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sport, slug } = await params;
  const sportMeta = SPORT_META[sport as keyof typeof SPORT_META];
  const school = await getSchoolBySlug(slug);
  if (!school || !sportMeta) return { title: "Team Not Found" };
  return {
    title: `${school.name} ${sportMeta.name} | PhillySportsPack`,
    description: `${school.name} ${sportMeta.name} — season history, rosters, championships, and alumni.`,
    alternates: { canonical: `https://phillysportspack.com/${sport}/teams/${slug}` },
  };
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { sport, slug } = await params;

  // Validate sport
  if (!(sport)) {
    notFound();
  }

  const sportMeta = SPORT_META[sport as keyof typeof SPORT_META];

  // Fetch school data
  const schoolData = await getSchoolBySlug(slug);
  if (!schoolData) {
    notFound();
  }
  const school = {
    ...schoolData,
    leagues: Array.isArray(schoolData.leagues) ? schoolData.leagues[0] : schoolData.leagues,
  };

  // Map sport name to sport_id for database queries
  const sportIdMap: Record<string, string> = {
    football: "football",
    basketball: "basketball",
    baseball: "baseball",
  };
  const sportId = sportIdMap[sport] || sport;

  // Fetch team seasons, championships, and alumni in parallel
  const [teamSeasons, championshipsData, alumni] = await Promise.all([
    getSchoolTeamSeasons(school.id, sportId),
    getSchoolChampionships(school.id, sportId),
    getTrackedAlumni({ sport: sportId, schoolId: school.id }, 6),
  ]);
  // Type cast to match TeamPageClient's local Championship type
  const championships = championshipsData as unknown as any[];

  // Get the most recent team season
  const latestSeason = teamSeasons?.[0] || null;

  // Fetch schedule, roster, articles, and stat leaders for the latest season
  const latestSeasonId = latestSeason?.season_id;
  const [games, roster, articles, statLeaders] = await Promise.all([
    latestSeasonId
      ? getGamesByTeamSeason(school.id, sportId, latestSeasonId)
      : Promise.resolve([]),
    latestSeasonId
      ? getTeamRosterBySeason(school.id, sportId, latestSeasonId)
      : Promise.resolve([]),
    getArticlesForEntity("school", school.id, 6),
    latestSeasonId
      ? getTeamStatLeaders(school.id, latestSeasonId)
      : Promise.resolve(null),
  ]);

  // Get league and coach names, handling potential array returns from Supabase
  const leagueName = Array.isArray(school.leagues)
    ? school.leagues[0]?.name
    : (school.leagues as any)?.name;
  const coachName = Array.isArray(latestSeason?.coaches)
    ? latestSeason?.coaches[0]?.name
    : (latestSeason?.coaches as any)?.name;

  // Prepare team data for client component
  const teamData = {
    id: school.id.toString(),
    name: school.name,
    slug: school.slug,
    city: school.city || "",
    state: school.state || "PA",
    league: leagueName || "Independent",
    founded_year: school.founded_year || 0,
    coach: coachName || "TBA",
    currentRecord: {
      wins: latestSeason?.wins || 0,
      losses: latestSeason?.losses || 0,
      ties: latestSeason?.ties || 0,
    },
    pointsFor: latestSeason?.points_for || 0,
    pointsAgainst: latestSeason?.points_against || 0,
    championships: championships.length,
    recentChampionships: championships
      .slice(0, 3)
      .map((c) => (c.seasons as any)?.label || "")
      .filter(Boolean),
  };

  return (
    <TeamPageClient
      team={teamData}
      school={school}
      teamSeasons={teamSeasons}
      championships={championships}
      alumni={alumni as unknown as any[]}
      sport={sport}
      sportMeta={sportMeta}
      games={games as any[]}
      roster={roster as any[]}
      articles={articles as any[]}
      statLeaders={statLeaders as any}
    />
  );
}
