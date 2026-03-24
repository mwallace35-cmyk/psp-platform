import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META } from "@/lib/data";
import {
  getDynastyTrackerData,
  getDynastyLeaders,
} from "@/lib/data/dynasty-tracker";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import DynastyTimeline from "./DynastyTimeline";
import type { Metadata } from "next";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];

  return {
    title: `Dynasties & History — ${meta.name} — PhillySportsPack`,
    description: `120 years of championship dominance in Philadelphia ${meta.name.toLowerCase()} history. Explore dynasty rankings by decade.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/dynasties`,
    },
  };
}

export default async function DynastiesPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];

  const [decadeData, leaders] = await Promise.all([
    getDynastyTrackerData(sport),
    getDynastyLeaders(sport, 10),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          {
            name: "Dynasties",
            url: `https://phillysportspack.com/${sport}/dynasties`,
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
              { label: "Dynasties & History" },
            ]}
          />
          <h1 className="psp-h1 text-white mb-2">
            {meta.emoji} 120 Years of Dominance
          </h1>
          <p className="text-gray-300">
            Championship history and dynasty rankings across decades
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">
        {decadeData.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-gray-500">
              No championship data found for {meta.name} yet.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Championship records will be populated as historical data is added.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <DynastyTimeline decadeData={decadeData} sport={sport} sportColor={meta.color} />
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="psp-h3 mb-4" style={{ color: meta.color }}>
                    All-Time Leaders
                  </h2>
                  <ol className="space-y-3">
                    {leaders.map((leader, idx) => (
                      <li key={leader.school_id} className="flex items-start gap-3">
                        <span
                          className="font-bebas text-lg font-bold flex-shrink-0 w-6"
                          style={{ color: meta.color }}
                        >
                          {idx + 1}.
                        </span>
                        <div className="flex-1">
                          <a
                            href={`/${sport}/schools/${leader.school_slug}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 hover:underline block"
                          >
                            {leader.school_name}
                          </a>
                          <p className="text-sm text-gray-600">
                            {leader.total_championships} titles
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="psp-h4 text-[var(--psp-navy)] mb-3">About</h3>
                  <p className="text-sm text-gray-600">
                    This visualization shows championship dominance organized by decade. Explore
                    how different programs have dominated across different eras of {meta.name.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${meta.name} Dynasties`,
            url: `https://phillysportspack.com/${sport}/dynasties`,
            numberOfItems: decadeData.length,
          }),
        }}
      />
    </>
  );
}
