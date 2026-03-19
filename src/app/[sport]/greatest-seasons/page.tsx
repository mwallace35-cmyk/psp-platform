import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META } from "@/lib/data";
import {
  getGreatestFootballSeasons,
  getGreatestBasketballSeasons,
  getGreatestBaseballSeasons,
  getGreatestSeasonCategories,
  type GreatestSeason,
} from "@/lib/data/greatest-seasons";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import GreatestSeasonsView from "./GreatestSeasonsView";
import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour ISR

type PageParams = { sport: string };

export function generateStaticParams() {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];

  return {
    title: `Greatest Seasons — ${meta.name} — PhillySportsPack`,
    description: `Greatest individual seasons in Philadelphia ${meta.name.toLowerCase()} history, ranked by dominance score.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/greatest-seasons`,
    },
  };
}

export default async function GreatestSeasonsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];

  // Fetch greatest seasons based on sport
  let seasons: GreatestSeason[] = [];
  switch (sport) {
    case "football":
      seasons = await getGreatestFootballSeasons(undefined, 100);
      break;
    case "basketball":
      seasons = await getGreatestBasketballSeasons(undefined, 100);
      break;
    case "baseball":
      seasons = await getGreatestBaseballSeasons(undefined, 100);
      break;
    default:
      seasons = [];
  }

  const categories = getGreatestSeasonCategories(sport);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          {
            name: "Greatest Seasons",
            url: `https://phillysportspack.com/${sport}/greatest-seasons`,
          },
        ]}
      />

      <section
        className="py-10"
        style={{
          background: "var(--psp-navy)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Greatest Seasons" },
            ]}
          />
          <h1 className="text-4xl md:text-5xl text-white mb-2 font-bebas">
            {meta.emoji} Greatest Seasons
          </h1>
          <p className="text-gray-300">
            Ranked by dominance score across {categories.length - 1} statistical categories
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">
        {seasons.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-500">
              No greatest seasons data found for {meta.name} yet.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This will be populated as more statistical data is added.
            </p>
          </div>
        ) : (
          <GreatestSeasonsView
            seasons={seasons}
            sport={sport}
            sportName={meta.name}
            sportColor={meta.color}
            categories={categories}
          />
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Greatest ${meta.name} Seasons`,
            url: `https://phillysportspack.com/${sport}/greatest-seasons`,
            numberOfItems: seasons.length,
          }),
        }}
      />
    </>
  );
}
