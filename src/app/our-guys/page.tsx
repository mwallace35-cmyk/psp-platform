import { Breadcrumb } from "@/components/ui";
import { getTrackedAlumni, getSocialPosts, getFeaturedAlumni, getAlumniCounts } from "@/lib/data";
import OurGuysClient from "./OurGuysClient";
import { captureError } from "@/lib/error-tracking";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Guys — Where They Are Now | PhillySportsPack",
  description: "Track Philly high school alumni in the NFL, NBA, MLB, college athletics, and coaching. See where our guys are now.",
  alternates: {
    canonical: "https://phillysportspack.com/our-guys",
  },
};

export default async function OurGuysPage() {
  // Use allSettled to prevent one failure from crashing the page
  let alumni = [];
  let socialPosts = [];
  let featured = [];
  let counts = { nfl: 0, nba: 0, mlb: 0, college: 0, coaching: 0, total: 0 };

  try {
    const results = await Promise.allSettled([
      getTrackedAlumni({}, 200),
      getSocialPosts(20),
      getFeaturedAlumni(1),
      getAlumniCounts(),
    ]);

    if (results[0].status === "fulfilled") alumni = results[0].value;
    if (results[1].status === "fulfilled") socialPosts = results[1].value;
    if (results[2].status === "fulfilled") featured = results[2].value;
    if (results[3].status === "fulfilled") counts = results[3].value;

    if (results[0].status === "rejected") captureError(results[0].reason, { page: "our-guys", fetch: "getTrackedAlumni" });
    if (results[1].status === "rejected") captureError(results[1].reason, { page: "our-guys", fetch: "getSocialPosts" });
    if (results[2].status === "rejected") captureError(results[2].reason, { page: "our-guys", fetch: "getFeaturedAlumni" });
    if (results[3].status === "rejected") captureError(results[3].reason, { page: "our-guys", fetch: "getAlumniCounts" });
  } catch (error) {
    captureError(error, { page: "our-guys", context: "data_fetching" });
  }

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
