import { Breadcrumb } from "@/components/ui";
import { getRecruits, getRecentCommitments } from "@/lib/data";
import RecruitingClient from "./RecruitingClient";
import { captureError } from "@/lib/error-tracking";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Philly Recruiting Central | PhillySportsPack",
  description: "Track Philadelphia area high school recruiting — star ratings, commitments, offers, and links to 247Sports, Rivals, On3, MaxPreps, and Hudl.",
  alternates: {
    canonical: "https://phillysportspack.com/recruiting",
  },
};

export default async function RecruitingPage() {
  // Use allSettled to prevent one failure from crashing the page
  let recruits = [];
  let commitments = [];

  try {
    const results = await Promise.allSettled([
      getRecruits({}, 200),
      getRecentCommitments(10),
    ]);

    if (results[0].status === "fulfilled") recruits = results[0].value;
    if (results[1].status === "fulfilled") commitments = results[1].value;

    if (results[0].status === "rejected") captureError(results[0].reason, { page: "recruiting", fetch: "getRecruits" });
    if (results[1].status === "rejected") captureError(results[1].reason, { page: "recruiting", fetch: "getRecentCommitments" });
  } catch (error) {
    captureError(error, { page: "recruiting", context: "data_fetching" });
  }

  return (
    <main id="main-content">
      <Breadcrumb items={[{ label: "Recruiting" }]} />
      <RecruitingClient recruits={recruits} commitments={commitments} />
    </main>
  );
}
