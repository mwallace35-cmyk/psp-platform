import { Breadcrumb } from "@/components/ui";
import { getRecruits, getRecentCommitments } from "@/lib/data";
import RecruitingClient from "./RecruitingClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Philly Recruiting Central | PhillySportsPack",
  description: "Track Philadelphia area high school recruiting — star ratings, commitments, offers, and links to 247Sports, Rivals, On3, MaxPreps, and Hudl.",
};

export default async function RecruitingPage() {
  const [recruits, commitments] = await Promise.all([
    getRecruits({}, 200),
    getRecentCommitments(10),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Recruiting" }]} />
      <RecruitingClient recruits={recruits} commitments={commitments} />
    </>
  );
}
