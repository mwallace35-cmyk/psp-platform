import Link from "next/link";
import { notFound } from "next/navigation";
import {
  validateSportParam,
  validateSportParamForMetadata,
} from "@/lib/validateSport";
import { SPORT_META } from "@/lib/data";
import {
  getPositionsForSport,
  getPositionDisplayName,
} from "@/lib/data/position-leaders";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Position Leaders — PhillySportsPack`,
    description: `Top career performers at every position across Philadelphia high school ${meta.name.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/position-leaders`,
    },
  };
}

export default async function PositionLeadersIndex({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];
  const positions = getPositionsForSport(sport);

  // Sports without positional data fall back to a 404 — same behavior as
  // hitting an invalid position on the [position] dynamic page.
  if (positions.length === 0) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          {
            name: "Position Leaders",
            url: `https://phillysportspack.com/${sport}/position-leaders`,
          },
        ]}
      />

      <div className="min-h-screen bg-[#0a1628]">
        {/* Hero */}
        <section
          className="border-b-4"
          style={{ background: "var(--psp-navy)", borderColor: meta.color }}
        >
          <div className="max-w-7xl mx-auto px-4 py-10">
            <Breadcrumb
              items={[
                { label: meta.name, href: `/${sport}` },
                { label: "Position Leaders" },
              ]}
            />
            <div className="flex items-center gap-3 mt-4">
              <span className="text-4xl">{meta.emoji}</span>
              <h1 className="psp-h1 text-white">
                {meta.name} Position Leaders
              </h1>
            </div>
            <p className="text-gray-300 mt-2">
              Career leaders by position across Philadelphia high school{" "}
              {meta.name.toLowerCase()}. Pick a position to see the all-time
              top performers.
            </p>
          </div>
        </section>

        {/* Position grid */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {positions.map((pos) => {
              const positionName = getPositionDisplayName(sport, pos);
              return (
                <Link
                  key={pos}
                  href={`/${sport}/position-leaders/${pos}`}
                  className="group flex items-center gap-3 px-4 py-4 rounded-lg border border-gray-700/50 bg-white/[0.03] hover:border-[var(--psp-gold)]/50 hover:bg-[var(--psp-gold)]/5 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] focus-visible:outline-none"
                >
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-bold tracking-wider shrink-0"
                    style={{
                      background: `${meta.color}22`,
                      color: meta.color,
                      border: `1px solid ${meta.color}55`,
                    }}
                  >
                    {pos}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-[var(--psp-gold)] transition-colors block truncate">
                      {positionName}
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      Career Leaders
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-700/40">
            <Link
              href={`/${sport}/leaderboards`}
              className="text-sm font-semibold inline-flex items-center gap-1"
              style={{ color: "var(--psp-gold)" }}
            >
              See full {meta.name.toLowerCase()} leaderboards →
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
