import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META } from "@/lib/data";
import { getBoxScoreSeasons, getBoxScoreGamesBySeason } from "@/lib/data/games";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import BoxScoresView from "./BoxScoresView";

export const revalidate = 3600; // 1 hour
type PageParams = { sport: string };

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

export default async function BoxScoresPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<{ season?: string }>;
}) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];
  const resolvedSearchParams = await searchParams;

  // 1. Fetch all available seasons with box score data
  const seasons = await getBoxScoreSeasons(sport);

  // 2. Determine which season to show
  const requestedSeason = resolvedSearchParams.season;
  const currentSeason =
    requestedSeason && seasons.some((s) => s.label === requestedSeason)
      ? requestedSeason
      : seasons.length > 0
        ? seasons[0].label // default to most recent season
        : null;

  // 3. Fetch games for the selected season
  const games = currentSeason
    ? await getBoxScoreGamesBySeason(sport, currentSeason)
    : [];

  // Total game count across all seasons
  const totalGames = seasons.reduce((sum, s) => sum + s.game_count, 0);

  if (seasons.length === 0) {
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
              {totalGames.toLocaleString()} Games
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
          currentSeason={currentSeason ?? ""}
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
