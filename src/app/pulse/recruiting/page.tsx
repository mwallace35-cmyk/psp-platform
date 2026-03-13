import PulseNav from "@/components/pulse/PulseNav";
import { Breadcrumb } from "@/components/ui";
import { getRecruits, getRecentCommitments } from "@/lib/data";
import RecruitingClient from "./RecruitingClient";
import { captureError } from "@/lib/error-tracking";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recruiting | The Pulse | PhillySportsPack",
  description: "Track Philadelphia area high school recruiting — star ratings, commitments, offers, and links to 247Sports, Rivals, On3, MaxPreps, and Hudl.",
  alternates: {
    canonical: "https://phillysportspack.com/pulse/recruiting",
  },
};

export default async function PulseRecruitingPage() {
  let recruits: any[] = [];
  let commitments: any[] = [];

  try {
    const results = await Promise.allSettled([
      getRecruits({}, 200),
      getRecentCommitments(10),
    ]);

    if (results[0].status === "fulfilled") recruits = results[0].value;
    if (results[1].status === "fulfilled") commitments = results[1].value;

    if (results[0].status === "rejected") captureError(results[0].reason, { page: "pulse/recruiting", fetch: "getRecruits" });
    if (results[1].status === "rejected") captureError(results[1].reason, { page: "pulse/recruiting", fetch: "getRecentCommitments" });
  } catch (error) {
    captureError(error, { page: "pulse/recruiting", context: "data_fetching" });
  }

  return (
    <main id="main-content">
      <PulseNav />
      <Breadcrumb items={[{ label: "The Pulse", href: "/pulse" }, { label: "Recruiting" }]} />
      <RecruitingClient recruits={recruits} commitments={commitments} />
    </main>
  );
}
