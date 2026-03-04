import { Breadcrumb } from "@/components/ui";
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

  return (
    <>
      <Breadcrumb items={[{ label: "Our Guys" }]} />
      <OurGuysClient
        alumni={alumni}
        socialPosts={socialPosts}
        featuredAlumni={featured[0] || null}
        counts={counts}
      />
    </>
  );
}
