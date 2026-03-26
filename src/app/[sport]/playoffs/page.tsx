import { Suspense } from "react";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import {
  SPORT_META,
  getAvailablePlayoffSeasons,
  getPlayoffBracketsBySeason,
  type PlayoffBracketWithGames,
  type PlayoffSeason,
} from "@/lib/data";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import type { Metadata } from "next";
import PlayoffsClient from "./PlayoffsClient";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Playoffs — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Playoff brackets and tournament results for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}. View PCL, Public League, PIAA, and District 12 brackets.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/playoffs`,
    },
  };
}

async function PlayoffsLoader({
  sport,
  seasonId,
}: {
  sport: string;
  seasonId: number | null;
}) {
  let brackets: PlayoffBracketWithGames[] = [];
  let seasons: PlayoffSeason[] = [];
  let selectedSeasonId: number | null = seasonId;

  try {
    seasons = await getAvailablePlayoffSeasons(sport);

    // If no season specified (or invalid), default to most recent
    if (!selectedSeasonId || !seasons.some((s) => s.seasonId === selectedSeasonId)) {
      selectedSeasonId = seasons.length > 0 ? seasons[0].seasonId : null;
    }

    if (selectedSeasonId) {
      brackets = (await getPlayoffBracketsBySeason(sport, selectedSeasonId)) ?? [];
    }
  } catch (err) {
    console.error("[PSP] Playoffs data fetch error:", err);
    brackets = [];
  }

  const sportColor = SPORT_COLORS_HEX[sport] || "#3b82f6";
  const selectedSeason = seasons.find((s) => s.seasonId === selectedSeasonId) ?? null;

  if (seasons.length === 0) {
    return (
      <div
        className="rounded-xl px-5 py-[60px] text-center"
        style={{ background: "var(--psp-navy, #0a1628)" }}
      >
        <div className="text-5xl mb-4">&#127942;</div>
        <h2
          className="psp-h2 text-white mb-2"
        >
          Playoff Brackets Coming Soon
        </h2>
        <p
          className="text-sm text-white/75 m-0"
          style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}
        >
          Bracket data will be available once the playoff season begins.
          <br />
          Check back for PCL, Public League, PIAA, and District 12 tournaments.
        </p>
      </div>
    );
  }

  return (
    <PlayoffsClient
      brackets={brackets}
      sportColor={sportColor}
      seasons={seasons}
      selectedSeasonId={selectedSeasonId}
      selectedSeasonLabel={selectedSeason?.label ?? ""}
      sport={sport}
    />
  );
}

export default async function PlayoffsPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<{ season?: string }>;
}) {
  const sport = await validateSportParam(params);
  const { season } = await searchParams;
  const meta = SPORT_META[sport];

  const seasonId = season ? parseInt(season, 10) : null;

  const breadcrumbs = [
    { label: meta.name, href: `/${sport}` },
    { label: "Playoffs" },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-4 pb-10">
      <Breadcrumb items={breadcrumbs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          { name: "Playoffs", url: `https://phillysportspack.com/${sport}/playoffs` },
        ]}
      />

      <h1
        className="psp-h1 mt-4 mb-6"
        style={{ color: "var(--psp-navy, #0a1628)" }}
      >
        {meta.name} Playoffs
      </h1>

      <Suspense
        fallback={
          <div
            className="rounded-xl px-5 py-[60px] text-center text-white/75 text-sm"
            style={{ background: "var(--psp-navy, #0a1628)" }}
          >
            Loading playoff brackets...
          </div>
        }
      >
        <PlayoffsLoader sport={sport} seasonId={isNaN(seasonId as number) ? null : seasonId} />
      </Suspense>
    </main>
  );
}
