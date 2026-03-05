import Link from "next/link";
import { getAllCoaches, getCoachCount, SPORT_META } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import CoachesGrid from "./CoachesGrid";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Coaches Directory — PhillySportsPack",
  description:
    "Browse every coach in the PhillySportsPack database — career records, championships, school history, and more.",
};

export default async function CoachesPage() {
  const [coaches, coachCount] = await Promise.all([
    getAllCoaches(500),
    getCoachCount(),
  ]);

  // Flatten coaches to rows with aggregated stint data
  const coachRows = (coaches as any[]).map((c: any) => {
    const stints = c.coaching_stints ?? [];
    const totalWins = stints.reduce((s: number, st: any) => s + (st.record_wins || 0), 0);
    const totalLosses = stints.reduce((s: number, st: any) => s + (st.record_losses || 0), 0);
    const totalTies = stints.reduce((s: number, st: any) => s + (st.record_ties || 0), 0);
    const totalChamps = stints.reduce((s: number, st: any) => s + (st.championships || 0), 0);

    // Current stint = most recent stint without end_year (or latest overall)
    const currentStint = stints.find((st: any) => !st.end_year) || stints[0];
    const currentSchool = currentStint?.schools;
    const currentSport = currentStint?.sport_id || stints[0]?.sport_id;
    const currentSportName = currentStint?.sports?.name || "";
    const isActive = !currentStint?.end_year && currentStint;

    // All unique sports this coach has coached
    const sportIds = [...new Set(stints.map((st: any) => st.sport_id).filter(Boolean))] as string[];

    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      bio: c.bio,
      photoUrl: c.photo_url,
      isActive: c.is_active !== false,
      currentSchoolName: currentSchool?.name || "",
      currentSchoolSlug: currentSchool?.slug || "",
      currentSport: currentSport || "",
      currentSportName,
      sportIds,
      totalWins,
      totalLosses,
      totalTies,
      totalChamps,
      stintsCount: stints.length,
      isActivelyCoaching: !!isActive,
    };
  });

  // Sidebar: top coaches by championships
  const topByChamps = [...coachRows]
    .sort((a, b) => b.totalChamps - a.totalChamps)
    .filter((c) => c.totalChamps > 0)
    .slice(0, 8);

  // Count coaches by sport
  const sportCounts: Record<string, number> = {};
  for (const c of coachRows) {
    for (const sid of c.sportIds) {
      sportCounts[sid] = (sportCounts[sid] || 0) + 1;
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Coaches" }]} />

      {/* Hero */}
      <div
        className="sport-hdr"
        style={{ borderBottomColor: "var(--psp-gold)" }}
      >
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }}>📋</span>
          <h1>Coaches Directory</h1>
          <div className="stat-pills">
            <div className="pill">
              <strong>{coachCount}</strong> coaches
            </div>
            <div className="pill">
              <strong>
                {coachRows.reduce((s, c) => s + c.totalChamps, 0)}
              </strong>{" "}
              combined titles
            </div>
            <span className="db-tag">
              <span className="dot" /> Live
            </span>
          </div>
        </div>
      </div>

      <div className="espn-container">
        <main>
          <CoachesGrid coaches={coachRows} />
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="widget">
            <div className="w-head">Most Titles</div>
            <div className="w-body">
              {topByChamps.map((coach, idx) => (
                <Link
                  key={coach.id}
                  href={`/${coach.currentSport || "football"}/coaches/${coach.slug}`}
                  className="w-link"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <span
                      style={{
                        display: "inline-block",
                        width: 18,
                        fontWeight: 700,
                        fontSize: 11,
                        color:
                          idx < 3 ? "var(--psp-gold)" : "var(--g400)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    {coach.name}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--psp-gold)",
                      fontSize: 12,
                    }}
                  >
                    {coach.totalChamps}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">By Sport</div>
            <div className="w-body">
              {Object.entries(SPORT_META).map(([id, meta]) => {
                const count = sportCounts[id] || 0;
                if (count === 0) return null;
                return (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      fontSize: 13,
                    }}
                  >
                    <span>
                      {(meta as any).emoji} {(meta as any).name}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--g400)",
                        fontWeight: 600,
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href="/schools" className="w-link">
                → All Schools
              </Link>
              <Link href="/football" className="w-link">
                → Football Hub
              </Link>
              <Link href="/basketball" className="w-link">
                → Basketball Hub
              </Link>
              <Link href="/search" className="w-link">
                → Player Search
              </Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={2} />
        </aside>
      </div>
    </>
  );
}
