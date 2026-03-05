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

      {/* Page Header Bar — matches sport hub style */}
      <div className="sport-hub-header" style={{ "--sport-color": "#3b82f6" } as React.CSSProperties}>
        <div className="shh-inner">
          <span className="shh-emoji">⭐</span>
          <h1 className="shh-title">Recruiting Central</h1>
          <div className="shh-pills">
            <div className="shh-pill"><strong>{recruits.length}</strong> recruits</div>
            <div className="shh-pill"><strong>{commitments.length}</strong> committed</div>
            <span className="db-tag"><span className="dot" /> Live</span>
          </div>
        </div>
      </div>

      <RecruitingClient recruits={recruits} commitments={commitments} />
    </>
  );
}
