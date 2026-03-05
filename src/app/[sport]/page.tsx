import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { isValidSport, SPORT_META, getSportOverview, getRecentChampions, getSchoolsBySport, getFeaturedArticles, getDataFreshness, getTeamsWithRecords, getRecentGamesBySport, getFootballLeaders, getBasketballLeaders } from "@/lib/data";
import SportHubDashboard from "@/components/sport-hub/SportHubDashboard";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: regenerate sport hub pages hourly

type PageParams = { sport: string };

const SPORT_COLORS_HEX: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} — PhillySportsPack`,
    description: `Philadelphia high school ${meta.name.toLowerCase()} stats, schools, leaderboards, records, and championships.`,
  };
}

export async function generateStaticParams() {
  return [
    { sport: "football" },
    { sport: "basketball" },
    { sport: "baseball" },
    { sport: "track-field" },
    { sport: "lacrosse" },
    { sport: "wrestling" },
    { sport: "soccer" },
  ];
}

export default async function SportHubPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const sportColorHex = SPORT_COLORS_HEX[sport] || "#16a34a";

  // Fetch leaders based on sport
  const leadersPromise = sport === "football"
    ? getFootballLeaders("rushing", 10)
    : sport === "basketball"
    ? getBasketballLeaders("scoring", 10)
    : Promise.resolve([]);

  const [overview, champions, schools, featured, freshness, standings, recentGames, leaders] = await Promise.all([
    getSportOverview(sport),
    getRecentChampions(sport, 20),
    getSchoolsBySport(sport, 50),
    getFeaturedArticles(sport, 5),
    getDataFreshness(sport),
    getTeamsWithRecords(sport),
    getRecentGamesBySport(sport, 20),
    leadersPromise,
  ]);

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb items={[{label: meta.name}]} />

      {/* Sport Header Bar */}
      <div className="sport-hub-header" style={{ "--sport-color": sportColorHex } as React.CSSProperties}>
        <div className="shh-inner">
          <span className="shh-emoji">{meta.emoji}</span>
          <h1 className="shh-title">{meta.name}</h1>
          <div className="shh-pills">
            <div className="shh-pill"><strong>{overview.players.toLocaleString()}</strong> players</div>
            <div className="shh-pill"><strong>{overview.schools.toLocaleString()}</strong> schools</div>
            <div className="shh-pill"><strong>{overview.championships.toLocaleString()}</strong> titles</div>
            <span className="db-tag"><span className="dot" /> Live</span>
          </div>
        </div>
      </div>

      {/* ESPN Dashboard — Single Scroll, No Tabs */}
      <SportHubDashboard
        sport={sport}
        sportColor={sportColorHex}
        meta={meta}
        overview={overview}
        champions={champions}
        schools={schools}
        featured={featured}
        freshness={freshness}
        standings={standings}
        recentGames={recentGames}
        leaders={leaders}
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Philadelphia High School ${meta.name}`,
            description: `Comprehensive ${meta.name.toLowerCase()} database for Philadelphia area high schools.`,
            url: `https://phillysportspack.com/${sport}`,
            isPartOf: { "@type": "WebSite", name: "PhillySportsPack", url: "https://phillysportspack.com" },
          }),
        }}
      />
    </>
  );
}
