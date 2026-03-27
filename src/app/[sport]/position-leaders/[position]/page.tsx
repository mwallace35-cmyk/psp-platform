import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META } from "@/lib/data";
import {
  getFootballPositionLeaders,
  getBasketballPositionLeaders,
  getPositionsForSport,
  getPositionDisplayName,
  type PositionLeader,
} from "@/lib/data/position-leaders";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PositionLeadersView from "./PositionLeadersView";
import type { Metadata } from "next";

export const revalidate = 3600;
type PageParams = { sport: string; position: string };

// export function generateStaticParams() {
//   const params: PageParams[] = [];
// 
//   const football = getPositionsForSport("football");
//   for (const pos of football) {
//     params.push({ sport: "football", position: pos });
//   }
// 
//   const basketball = getPositionsForSport("basketball");
//   for (const pos of basketball) {
//     params.push({ sport: "basketball", position: pos });
//   }
// 
//   return params;
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};

  const p = await params;
  const position = p.position.toUpperCase();
  const meta = SPORT_META[sport];
  const positionName = getPositionDisplayName(sport, position);

  return {
    title: `${positionName} Leaders — ${meta.name} — PhillySportsPack`,
    description: `Top career ${positionName.toLowerCase()} in Philadelphia ${meta.name.toLowerCase()} history.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/position-leaders/${position}`,
    },
  };
}

export default async function PositionLeadersPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const sport = await validateSportParam(params);
  const p = await params;
  const position = p.position.toUpperCase();

  // Validate position
  const validPositions = getPositionsForSport(sport);
  if (!validPositions.includes(position)) {
    notFound();
  }

  const meta = SPORT_META[sport];
  const positionName = getPositionDisplayName(sport, position);

  // Fetch leaders based on sport
  let leaders: PositionLeader[] = [];
  switch (sport) {
    case "football":
      leaders = await getFootballPositionLeaders(position, undefined, undefined, 100);
      break;
    case "basketball":
      leaders = await getBasketballPositionLeaders(position, undefined, undefined, 100);
      break;
    default:
      leaders = [];
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          {
            name: "Position Leaders",
            url: `https://phillysportspack.com/${sport}/position-leaders/${position}`,
          },
        ]}
      />

      <section
        className="py-10 border-b-4 border-[var(--psp-gold)]"
        style={{
          background: '#0a1628',
          color: '#fff',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: positionName },
            ]}
          />
          <h1 className="psp-h1 text-white mb-2">
            {meta.emoji} {positionName} Leaders
          </h1>
          <p className="text-gray-300">
            Top career performers at {positionName.toLowerCase()} across all eras
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">
        {leaders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">🏈</div>
            <p className="text-gray-400">
              No {positionName.toLowerCase()} data found for {meta.name} yet.
            </p>
            <p className="text-sm text-gray-300 mt-2">
              This will be populated as more positional data is added.
            </p>
          </div>
        ) : (
          <PositionLeadersView
            leaders={leaders}
            sport={sport}
            position={position}
            positionName={positionName}
            sportName={meta.name}
            sportColor={meta.color}
          />
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${positionName} Leaders - ${meta.name}`,
            url: `https://phillysportspack.com/${sport}/position-leaders/${position}`,
            numberOfItems: leaders.length,
          }),
        }}
      />
    </>
  );
}
