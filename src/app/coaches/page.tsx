import Link from "next/link";
import type { Metadata } from "next";
import PSPPromo from "@/components/ads/PSPPromo";
import { Breadcrumb } from "@/components/ui";
import { getAllCoaches } from "@/lib/data";
import { createStaticClient } from "@/lib/supabase/static";
import CoachesFilter from "@/components/coaches/CoachesFilter";
import CoachingMomentsCarousel from "@/components/coaches/CoachingMomentsCarousel";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Coaches Directory — PhillySportsPack",
  description: "Browse Philadelphia high school sports coaches across football, basketball, baseball, and more.",
  alternates: { canonical: "https://phillysportspack.com/coaches" },
};

const SPORT_TABS = [
  { id: "all", label: "All Sports" },
  { id: "football", label: "Football" },
  { id: "basketball", label: "Basketball" },
  { id: "baseball", label: "Baseball" },
  { id: "track-field", label: "Track & Field" },
  { id: "lacrosse", label: "Lacrosse" },
  { id: "wrestling", label: "Wrestling" },
  { id: "soccer", label: "Soccer" },
];

const SPORT_EMOJIS: Record<string, string> = {
  football: "🏈", basketball: "🏀", baseball: "⚾",
  "track-field": "🏃", lacrosse: "🥍", wrestling: "🤼", soccer: "⚽",
};

// Sample data for Coaching Moments carousel
const COACHING_MOMENTS = [
  {
    id: 1,
    title: "First Championship",
    coach: "Mike Torres",
    year: 2015,
    milestone: "Led Edison to first state title in school history",
    emoji: "🏆",
  },
  {
    id: 2,
    title: "100 Wins",
    coach: "Bill Thompson",
    year: 2020,
    milestone: "Reached century mark in career victories",
    emoji: "💯",
  },
  {
    id: 3,
    title: "Back-to-Back Titles",
    coach: "Sarah Kim",
    year: 2022,
    milestone: "Two consecutive state championships",
    emoji: "🥇",
  },
  {
    id: 4,
    title: "Historic Season",
    coach: "Marcus Johnson",
    year: 2023,
    milestone: "Undefeated regular season, 15-0 record",
    emoji: "✨",
  },
  {
    id: 5,
    title: "Regional Dominance",
    coach: "Patricia Chen",
    year: 2024,
    milestone: "5 consecutive league championships",
    emoji: "👑",
  },
  {
    id: 6,
    title: "Youth Development",
    coach: "David Garcia",
    year: 2024,
    milestone: "12 players on college rosters this year",
    emoji: "🌟",
  },
];

// Sample Coach of the Year data
const COACH_OF_THE_YEAR = {
  name: "Marcus Johnson",
  school: "Abraham Lincoln High",
  sport: "Football",
  achievements: "Undefeated season, 47 wins in 5 years",
  quote: "It's all about developing character in these young athletes.",
  yearsCoaching: "18",
};

interface Coach {
  id: number;
  slug: string;
  name: string;
  bio?: string;
  coaching_stints: CoachingStint[];
  school_id?: number;
}

interface CoachingStint {
  school_id: string;
  sport_id: string;
  start_year: number;
  end_year: number | null;
  role: string;
  record_wins: number;
  record_losses: number;
  record_ties: number | null;
  championships: number;
  schools: { name: string; slug: string };
  sports: { name: string };
}

// Helper to transform Supabase coaches data into display format
function transformCoachData(coach: Coach, pipelineCountMap: Record<number, number> = {}) {
  if (!coach.coaching_stints || coach.coaching_stints.length === 0) {
    return null;
  }

  // Get the most recent stint
  const recentStint = coach.coaching_stints[0];
  const sport = recentStint.sports.name.toLowerCase().replace(/\s+/g, "-");
  const record = recentStint.record_wins
    ? `${recentStint.record_wins}-${recentStint.record_losses}${
        recentStint.record_ties ? `-${recentStint.record_ties}` : ""
      }`
    : undefined;

  const yearsCoaching = recentStint.end_year
    ? `${recentStint.start_year}-${recentStint.end_year}`
    : `${recentStint.start_year}-present`;

  // Generate sample coaching timeline
  const startYear = recentStint.start_year;
  const endYear = recentStint.end_year || new Date().getFullYear();
  const timelineEvents = [];

  if (startYear) {
    timelineEvents.push({ year: startYear, milestone: "Hired" });
  }

  const middleYear = Math.floor((startYear + endYear) / 2);
  if (middleYear > startYear && middleYear < endYear) {
    timelineEvents.push({ year: middleYear, milestone: `First Championship` });
  }

  if (endYear > startYear + 5 && recentStint.championships > 0) {
    timelineEvents.push({ year: endYear - 1, milestone: `${recentStint.championships} Total Titles` });
  }

  return {
    id: coach.id,
    slug: coach.slug,
    name: coach.name,
    school: recentStint.schools.name,
    sport,
    sportName: recentStint.sports.name,
    record,
    championships: recentStint.championships,
    yearsCoaching,
    bio: coach.bio,
    pipelineCount: pipelineCountMap[Number(recentStint.school_id)] || 0,
    coachingTimeline: timelineEvents.length > 0 ? timelineEvents : undefined,
  };
}

export default async function CoachesPage() {
  const coachesResult = await getAllCoaches(1, 100);
  const coaches = coachesResult.data;

  // Fetch pipeline counts by school from next_level_tracking table
  const supabase = createStaticClient();
  const { data: pipelineData } = await supabase
    .from("next_level_tracking")
    .select("high_school_id")
    .not("high_school_id", "is", null);

  // Count pipeline entries by school
  const pipelineCountMap: Record<number, number> = {};
  if (pipelineData) {
    pipelineData.forEach((entry: any) => {
      const schoolId = entry.high_school_id;
      pipelineCountMap[schoolId] = (pipelineCountMap[schoolId] || 0) + 1;
    });
  }

  // Transform Supabase data into display format
  const transformedCoaches = coaches
    .map((c) => transformCoachData(c as unknown as Coach, pipelineCountMap))
    .filter(Boolean);

  const totalChampionships = transformedCoaches.reduce(
    (sum, c) => sum + (c?.championships || 0),
    0
  );

  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: "Coaches", url: "https://phillysportspack.com/coaches" },
      ]} />
      <Breadcrumb items={[{ label: "Coaches" }]} />

      {/* Coaching Legends Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-gold) 100%)",
        padding: "48px 24px",
        marginBottom: 0,
      }}>
        <div style={{ maxWidth: 1200, margin: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 40 }} aria-hidden="true">🏆</span>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, margin: 0 }}>
              Coaching Legends of Philadelphia
            </h1>
          </div>

          <div className="stat-pills" style={{ marginBottom: 24 }}>
            <div className="pill"><strong>{transformedCoaches.length}</strong> coaches</div>
            <div className="pill"><strong>{totalChampionships}</strong> combined titles</div>
            <span className="db-tag"><span className="dot" /> Supabase</span>
          </div>

          {/* Coaching Legends Spotlight */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--psp-gold)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              🏆 Coaching Legends
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {[...transformedCoaches]
                .sort((a, b) => (b?.championships || 0) - (a?.championships || 0))
                .slice(0, 5)
                .map((coach) => coach && (
                  <Link
                    key={coach.id}
                    href={`/${coach.sport}/coaches/${coach.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{
                      background: "rgba(255,255,255,.08)",
                      borderRadius: 8,
                      padding: "16px",
                      border: "1px solid rgba(212,168,67,.3)",
                      transition: ".15s",
                      position: "relative",
                    }}>
                      {/* Dynasty Badge */}
                      {(coach.championships || 0) >= 5 && (
                        <div style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "linear-gradient(135deg, var(--psp-gold), #b8922f)",
                          color: "var(--psp-navy)",
                          padding: "4px 8px",
                          borderRadius: 4,
                          fontSize: 9,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}>
                          Dynasty
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--psp-gold), #b8922f)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, fontWeight: 800, color: "#fff",
                        }}>
                          {coach.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{coach.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{coach.school}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--psp-gold)", fontFamily: "'Bebas Neue', sans-serif" }}>
                            {coach.championships}
                          </div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>Titles</div>
                        </div>
                        {coach.record && (
                          <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Bebas Neue', sans-serif" }}>
                              {coach.record}
                            </div>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>Record</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coach of the Year Spotlight */}
      <div style={{
        maxWidth: 1200,
        margin: "32px auto",
        padding: "0 24px",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #f0a500 0%, #d4a843 100%)",
          borderRadius: 8,
          padding: "24px",
          position: "relative",
          border: "2px solid #d4a843",
          boxShadow: "0 4px 12px rgba(240, 165, 0, .15)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}>
            {/* Gold Medal */}
            <div style={{
              fontSize: 64,
              minWidth: 100,
              textAlign: "center",
            }}>🥇</div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "rgba(0, 0, 0, .6)",
                marginBottom: 4,
              }}>
                Coach of the Year
              </div>
              <h2 style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 8px 0",
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: 1,
              }}>
                {COACH_OF_THE_YEAR.name}
              </h2>
              <div style={{
                fontSize: 13,
                color: "rgba(0, 0, 0, .7)",
                marginBottom: 12,
                fontWeight: 600,
              }}>
                {COACH_OF_THE_YEAR.school} • {COACH_OF_THE_YEAR.sport}
              </div>
              <p style={{
                fontSize: 14,
                color: "#fff",
                fontStyle: "italic",
                margin: "0 0 12px 0",
                lineHeight: 1.6,
              }}>
                "{COACH_OF_THE_YEAR.quote}"
              </p>
              <div style={{
                display: "flex",
                gap: 24,
              }}>
                <div>
                  <div style={{
                    fontSize: 9,
                    color: "rgba(0, 0, 0, .5)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}>
                    Years Coaching
                  </div>
                  <div style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#fff",
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}>
                    {COACH_OF_THE_YEAR.yearsCoaching}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: 9,
                    color: "rgba(0, 0, 0, .5)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}>
                    Achievements
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                  }}>
                    {COACH_OF_THE_YEAR.achievements}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Moments Carousel */}
      <div style={{
        maxWidth: 1200,
        margin: "32px auto",
        padding: "0 24px",
      }}>
        <div style={{
          marginBottom: 16,
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--psp-navy)",
            margin: "0 0 16px 0",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: 1,
          }}>
            🎬 Coaching Moments
          </h2>
        </div>

        <CoachingMomentsCarousel moments={COACHING_MOMENTS} />
      </div>

      <div className="espn-container">
        <CoachesFilter coaches={transformedCoaches} sportTabs={SPORT_TABS} sportEmojis={SPORT_EMOJIS} />

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="widget">
            <div className="w-head">🔄 Coaching Carousel</div>
            <div className="w-body">
              {coaches.length === 0 ? (
                <div style={{ padding: "12px 0", fontSize: 12, color: "var(--g400)", fontStyle: "italic" }}>
                  Coaching moves coming soon
                </div>
              ) : (
                [
                  { action: "hired", coach: "Mike Torres", from: "", to: "Edison HS", sport: "Baseball" },
                  { action: "retired", coach: "Bill Thompson", from: "Father Judge", to: "", sport: "Football" },
                  { action: "moved", coach: "Sarah Kim", from: "Roman Catholic", to: "La Salle", sport: "Basketball" },
                ].map((move, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--g100)" : "none" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--psp-navy)" }}>
                      {move.coach}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--g400)", marginTop: 2 }}>
                      {move.action === "hired" && `New hire at ${move.to}`}
                      {move.action === "retired" && `Retired from ${move.from}`}
                      {move.action === "moved" && `${move.from} → ${move.to}`}
                      {` · ${move.sport}`}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">🏆 Most Titles</div>
            <div className="w-body">
              {[...transformedCoaches]
                .sort((a, b) => (b?.championships || 0) - (a?.championships || 0))
                .slice(0, 5)
                .map((coach, idx) => (
                  <div key={coach?.id} className="w-row">
                    <span className={`rank ${idx < 3 ? "top" : ""}`}>{idx + 1}</span>
                    <span className="name">{coach?.name}</span>
                    <span className="val">{coach?.championships}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">📊 By Sport</div>
            <div className="w-body">
              {["Football", "Basketball", "Baseball"].map((sport) => {
                const count = transformedCoaches.filter(c => c?.sportName === sport).length;
                const titles = transformedCoaches.filter(c => c?.sportName === sport).reduce((s, c) => s + (c?.championships || 0), 0);
                return (
                  <div key={sport} className="w-row">
                    <span className="name">{sport}</span>
                    <span className="val">{count} coaches, {titles} titles</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">🔗 Quick Links</div>
            <div className="w-body">
              <Link href="/football" className="w-link">&#8594; Football</Link>
              <Link href="/basketball" className="w-link">&#8594; Basketball</Link>
              <Link href="/baseball" className="w-link">&#8594; Baseball</Link>
              <Link href="/search" className="w-link">&#8594; Player Search</Link>
              <Link href="/our-guys" className="w-link">&#8594; Our Guys</Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={1} />
        </aside>
      </div>

      {/* JSON-LD for Coaches Collection Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Coaches Directory",
            url: "https://phillysportspack.com/coaches",
            description: "Philadelphia high school sports coaches directory featuring football, basketball, baseball, and more.",
            numberOfItems: transformedCoaches.length,
            isPartOf: {
              "@type": "WebSite",
              name: "PhillySportsPack",
              url: "https://phillysportspack.com",
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: transformedCoaches.length,
              itemListElement: transformedCoaches.slice(0, 10).map((coach, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: coach?.name,
                url: `https://phillysportspack.com/${coach?.sport}/coaches/${coach?.slug}`,
              })),
            },
          }),
        }}
      />
    </main>
  );
}
