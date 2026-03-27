import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META } from "@/lib/data";
import { getGamesBySportWithBoxScores } from "@/lib/data/games";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import BoxScoresView from "./BoxScoresView";

export const revalidate = 3600; // 1 hour
type PageParams = { sport: string };

// export function generateStaticParams() {
//   return [
//     { sport: "football" },
//     { sport: "basketball" },
//     { sport: "baseball" },
//     { sport: "track-field" },
//     { sport: "lacrosse" },
//     { sport: "wrestling" },
//     { sport: "soccer" },
//   ];
// }

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];

  return {
    title: `${meta.name} Box Scores — PhillySportsPack`,
    description: `Browse ${meta.name.toLowerCase()} box scores with detailed player statistics for Philadelphia area high schools.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/box-scores`,
    },
  };
}

export default async function BoxScoresPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];

  // Fetch ALL games with box scores (up to 500) — client does filtering/pagination
  const games = await getGamesBySportWithBoxScores(sport, undefined, 500);

  // Extract distinct seasons for the filter dropdown
  const seasonSet = new Map<string, { label: string }>();
  for (const g of games) {
    if (g.seasons?.label && !seasonSet.has(g.seasons.label)) {
      seasonSet.set(g.seasons.label, { label: g.seasons.label });
    }
  }
  // Sort seasons descending (e.g. "2024-25" > "2023-24")
  const seasons = Array.from(seasonSet.values()).sort((a, b) =>
    b.label.localeCompare(a.label)
  );

  if (!games || games.length === 0) {
    return (
      <>
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://phillysportspack.com" },
            { name: meta.name, url: `https://phillysportspack.com/${sport}` },
            { name: "Box Scores", url: `https://phillysportspack.com/${sport}/box-scores` },
          ]}
        />

        <section className="py-10 border-b-4 border-[var(--psp-gold)]" style={{ background: '#0a1628', color: '#fff' }}>
          <div className="max-w-7xl mx-auto px-4">
            <Breadcrumb
              items={[
                { label: meta.name, href: `/${sport}` },
                { label: "Box Scores" },
              ]}
            />
            <h1 className="psp-h1 text-white mb-2">
              {meta.emoji} {meta.name} Box Scores
            </h1>
          </div>
        </section>

        <main id="main-content" className="max-w-7xl mx-auto px-4 py-16 flex-1">
          <div className="text-center bg-gray-50 rounded-lg p-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-400 text-lg">No box scores available for {meta.name} yet.</p>
            <p className="text-gray-400 mt-2">Box scores are being compiled from historical game data.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          { name: "Box Scores", url: `https://phillysportspack.com/${sport}/box-scores` },
        ]}
      />

      <section className="py-10 border-b-4 border-[var(--psp-gold)]" style={{ background: '#0a1628', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Box Scores" },
            ]}
          />
          <div className="mt-6 flex items-baseline gap-4">
            <h1 className="psp-h1 text-white">
              {meta.emoji} {meta.name} Box Scores
            </h1>
            <span
              className="px-4 py-2 rounded-full text-white font-semibold"
              style={{ background: meta.color }}
            >
              {games.length}+ Games
            </span>
          </div>
          <p className="text-gray-300 mt-3">
            Detailed box scores with individual player statistics from Philadelphia area high school games.
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <BoxScoresView
          sport={sport}
          sportName={meta.name}
          initialGames={games}
          seasons={seasons}
        />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${meta.name} Box Scores`,
            description: `Detailed box scores for ${meta.name.toLowerCase()} games`,
            url: `https://phillysportspack.com/${sport}/box-scores`,
            creator: {
              "@type": "Organization",
              name: "PhillySportsPack",
            },
          }),
        }}
      />
    </>
  );
}
