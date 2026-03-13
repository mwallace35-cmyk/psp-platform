import PulseNav from "@/components/pulse/PulseNav";
import { getNextLevelPipeline, getPipelineStats } from "@/lib/data";
import NextLevelClient from "./NextLevelClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Next Level — Philly Pipeline Tracker | The Pulse | PhillySportsPack",
  description:
    "Track the full Philadelphia high school sports pipeline: college signees, NFL Draft prospects, and pro athletes in the NFL, NBA, MLB, and beyond.",
  alternates: {
    canonical: "https://phillysportspack.com/pulse/next-level",
  },
  openGraph: {
    title: "Next Level — Philly Pipeline Tracker | The Pulse | PhillySportsPack",
    description:
      "Track the full Philadelphia high school sports pipeline: college signees, draft prospects, and pro athletes.",
    url: "https://phillysportspack.com/pulse/next-level",
    type: "website",
  },
};

export default async function PulseNextLevelPage() {
  const [allAthletes, stats] = await Promise.all([
    getNextLevelPipeline({ pageSize: 1000 }),
    getPipelineStats(),
  ]);

  const athletes = allAthletes.map((a: any) => ({
    id: a.id,
    person_name: a.person_name,
    high_school_id: a.high_school_id,
    sport_id: a.sport_id,
    current_level: a.current_level,
    current_org: a.current_org,
    pro_team: a.pro_team,
    pro_league: a.pro_league,
    draft_info: a.draft_info,
    college: a.college,
    bio_note: a.bio_note,
    status: a.status,
    schools: a.schools
      ? Array.isArray(a.schools)
        ? a.schools[0] || null
        : a.schools
      : null,
  }));

  return (
    <main id="main-content">
      <PulseNav />
      <NextLevelClient athletes={athletes} stats={stats} />
    </main>
  );
}
