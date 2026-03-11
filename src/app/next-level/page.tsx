import { getProAthletes, getProAthleteStats } from '@/lib/data';
import NextLevelClient from './NextLevelClient';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Next Level — Philly Pro Athletes — PhillySportsPack',
  description:
    'Track Philadelphia high school alumni who made it to the NFL, NBA, MLB, and WNBA. Career stats, school info, and professional profiles.',
  alternates: {
    canonical: 'https://phillysportspack.com/next-level',
  },
  openGraph: {
    title: 'Next Level — Philly Pro Athletes — PhillySportsPack',
    description:
      'Track Philadelphia high school alumni who made it to the NFL, NBA, MLB, and WNBA.',
    url: 'https://phillysportspack.com/next-level',
    type: 'website',
  },
};

export default async function NextLevelPage() {
  const [athleteResult, stats] = await Promise.all([
    getProAthletes({ status: 'all', pageSize: 500 }),
    getProAthleteStats(),
  ]);

  // Map to the shape expected by the client component
  const athletes = athleteResult.data.map((a: any) => ({
    id: a.id,
    person_name: a.person_name,
    high_school_id: a.high_school_id,
    sport_id: a.sport_id,
    pro_team: a.pro_team,
    pro_league: a.pro_league,
    draft_info: a.draft_info,
    college: a.college,
    status: a.status,
    schools: a.schools
      ? Array.isArray(a.schools)
        ? a.schools[0] || null
        : a.schools
      : null,
  }));

  return <NextLevelClient athletes={athletes} stats={stats} />;
}
