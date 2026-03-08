import Link from "next/link";
import type { Metadata } from "next";
import PSPPromo from "@/components/ads/PSPPromo";
import { Breadcrumb } from "@/components/ui";
import { getAllCoaches } from "@/lib/data";
import CoachesFilter from "@/components/coaches/CoachesFilter";
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

interface Coach {
  id: number;
  slug: string;
  name: string;
  bio?: string;
  coaching_stints: CoachingStint[];
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
function transformCoachData(coach: Coach) {
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
  };
}

export default async function CoachesPage() {
  const coachesResult = await getAllCoaches(1, 100);
  const coaches = coachesResult.data;

  // Transform Supabase data into display format
  const transformedCoaches = coaches
    .map((c) => transformCoachData(c as Coach))
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

      {/* Hero */}
      <div className="sport-hdr" style={{ borderBottomColor: "var(--psp-gold)" }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }} aria-hidden="true">📋</span>
          <h1>Coaches Directory</h1>
          <div className="stat-pills">
            <div className="pill"><strong>{transformedCoaches.length}</strong> coaches</div>
            <div className="pill"><strong>{totalChampionships}</strong> combined titles</div>
            <span className="db-tag"><span className="dot" /> Supabase</span>
          </div>
        </div>
      </div>

      <div className="espn-container">
        <CoachesFilter coaches={transformedCoaches} sportTabs={SPORT_TABS} sportEmojis={SPORT_EMOJIS} />

        {/* Sidebar */}
        <aside className="sidebar">
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
