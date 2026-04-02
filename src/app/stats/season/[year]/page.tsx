import { redirect } from "next/navigation";

/** /stats/season/[year] → /football/leaderboards */
export default async function StatsSeasonRedirect({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  redirect(`/football/leaderboards?season=${year}`);
}
