import { notFound } from "next/navigation";
import { isValidSport, SPORT_META } from "@/lib/sports";
import {
  getSchoolBySlug,
  getSchoolTeamSeasons,
  getSchoolChampionships,
  getTrackedAlumni,
} from "@/lib/data";
import TeamPageClient from "@/components/teams/TeamPageClient";

export const revalidate = 3600; // ISR: revalidate every hour

type PageProps = {
  params: Promise<{ sport: string; slug: string }>;
};

export default async function TeamDetailPage({ params }: PageProps) {
  const { sport, slug } = await params;

  // Validate sport
  if (!isValidSport(sport)) {
    notFound();
  }

  const sportMeta = SPORT_META[sport as keyof typeof SPORT_META];

  // Fetch school data
  const school = await getSchoolBySlug(slug);
  if (!school) {
    notFound();
  }

  // Map sport name to sport_id for database queries
  const sportIdMap: Record<string, string> = {
    football: "football",
    basketball: "basketball",
    baseball: "baseball",
  };
  const sportId = sportIdMap[sport] || sport;

  // Fetch team seasons, championships, and alumni in parallel
  const [teamSeasons, championships, alumni] = await Promise.all([
    getSchoolTeamSeasons(school.id, sportId),
    getSchoolChampionships(school.id, sportId),
    getTrackedAlumni({ sport: sportId }, 6),
  ]);

  // Get the most recent team season
  const latestSeason = teamSeasons?.[0] || null;

  // Prepare team data for client component
  const teamData = {
    id: school.id.toString(),
    name: school.name,
    slug: school.slug,
    city: school.city || "",
    state: school.state || "PA",
    league: school.leagues?.name || "Independent",
    founded_year: school.founded_year || 0,
    coach: latestSeason?.coaches?.name || "TBA",
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
      alumni={alumni}
      sport={sport}
      sportMeta={sportMeta}
    />
  );
}
