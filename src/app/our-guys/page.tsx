import { Breadcrumb } from "@/components/ui";
import HeaderWithScores from "@/components/layout/HeaderWithScores";
import Footer from "@/components/layout/Footer";
import { getTrackedAlumni, getSocialPosts, getFeaturedAlumni, getAlumniCounts } from "@/lib/data";
import OurGuysClient from "./OurGuysClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Guys — Where They Are Now | PhillySportsPack",
  description: "Track Philly high school alumni in the NFL, NBA, MLB, college athletics, and coaching. See where our guys are now.",
};

export default async function OurGuysPage() {
  const [alumni, socialPosts, featured, counts] = await Promise.all([
    getTrackedAlumni({}, 200),
    getSocialPosts(20),
    getFeaturedAlumni(1),
    getAlumniCounts(),
  ]);

  const total = counts.nfl + counts.nba + counts.mlb + counts.college + counts.coaching;

  return (
    <>
      <HeaderWithScores />
      <Breadcrumb items={[{ label: "Our Guys" }]} />

      {/* Page Header Bar — matches sport hub style */}
      <div className="sport-hub-header" style={{ "--sport-color": "#f0a500" } as React.CSSProperties}>
        <div className="shh-inner">
          <span className="shh-emoji">🌟</span>
          <h1 className="shh-title">Our Guys</h1>
          <div className="shh-pills">
            <div className="shh-pill"><strong>{counts.nfl}</strong> NFL</div>
            <div className="shh-pill"><strong>{counts.nba}</strong> NBA</div>
            <div className="shh-pill"><strong>{counts.mlb}</strong> MLB</div>
            <div className="shh-pill"><strong>{total}</strong> total</div>
            <span className="db-tag"><span className="dot" /> Live</span>
          </div>
        </div>
      </div>

      <OurGuysClient
        alumni={alumni}
        socialPosts={socialPosts}
        featuredAlumni={featured[0] || null}
        counts={counts}
      />
      <Footer />
    </>
  );
}
