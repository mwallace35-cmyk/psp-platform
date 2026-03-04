import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { isValidSport, SPORT_META, getSportOverview, getRecentChampions, getSchoolsBySport, getFeaturedArticles, getDataFreshness } from "@/lib/data";
import SportLayoutSwitcher from "@/components/sport-layouts/SportLayoutSwitcher";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string };

const SPORT_COLORS: Record<string, string> = {
  football: "var(--fb)",
  basketball: "var(--bb)",
  baseball: "var(--base)",
  "track-field": "var(--track)",
  lacrosse: "var(--lac)",
  wrestling: "var(--wrest)",
  soccer: "var(--soccer)",
};

// Raw hex colors for client components (CSS vars don't work in JS)
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
  const sportColor = SPORT_COLORS[sport] || "var(--fb)";
  const sportColorHex = SPORT_COLORS_HEX[sport] || "#16a34a";

  const [overview, champions, schools, featured, freshness] = await Promise.all([
    getSportOverview(sport),
    getRecentChampions(sport, 10),
    getSchoolsBySport(sport, 30),
    getFeaturedArticles(sport, 3),
    getDataFreshness(sport),
  ]);

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb items={[{label: meta.name}]} />

      {/* Sport Header */}
      <div className="sport-hdr" style={{ borderBottomColor: sportColor }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }}>{meta.emoji}</span>
          <h1>{meta.name}</h1>
          <div className="stat-pills">
            <div className="pill"><strong>{overview.players.toLocaleString()}</strong> players</div>
            <div className="pill"><strong>{overview.schools.toLocaleString()}</strong> schools</div>
            <div className="pill"><strong>{overview.championships.toLocaleString()}</strong> titles</div>
            <span className="db-tag"><span className="dot" /> Supabase</span>
          </div>
        </div>
      </div>

      {/* Layout Switcher (Client Component) */}
      <SportLayoutSwitcher
        sport={sport}
        sportColor={sportColorHex}
        meta={meta}
        overview={overview}
        champions={champions}
        schools={schools}
        featured={featured}
        freshness={freshness}
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
