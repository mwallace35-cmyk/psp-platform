import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  validateSportParam,
  validateSportParamForMetadata,
} from "@/lib/validateSport";
import { SPORT_META } from "@/lib/data";
import {
  getCityLeagueSeasons,
  getCityLeagueGamesBySeason,
} from "@/lib/data/games";
import { Breadcrumb } from "@/components/ui";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";

export const revalidate = 3600; // 1h ISR

type PageParams = { sport: string };
type SearchParams = { season?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Head-to-Head Games — PhillySportsPack`,
    description: `Browse ${meta.name.toLowerCase()} games where both teams' per-game stats are archived. Box scores, dates, and player stats for every city-league matchup.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/games`,
    },
  };
}


function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "Date TBD";
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}


export default async function CityLeagueGamesPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) {
  const sport = await validateSportParam(params);
  if (sport !== "football") {
    // Other sports will get their own two-sided view later; for now redirect
    // visitors to box-scores which works for any sport.
    notFound();
  }

  const meta = SPORT_META[sport];
  const { season: requestedSeason } = await searchParams;

  const seasons = await getCityLeagueSeasons(sport);
  if (seasons.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--psp-navy)] text-white">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Games" }]} />
          <h1 className="font-heading text-4xl text-[var(--psp-gold)] mb-4">
            Head-to-Head Games
          </h1>
          <p className="text-gray-300">No archived head-to-head games yet.</p>
        </div>
      </main>
    );
  }

  const currentSeason =
    requestedSeason && seasons.some((s) => s.label === requestedSeason)
      ? requestedSeason
      : seasons[0].label;

  const games = await getCityLeagueGamesBySeason(sport, currentSeason);
  const totalCount = seasons.reduce((sum, s) => sum + s.game_count, 0);

  // Group by date — undated at the bottom
  const dateBuckets = new Map<string, typeof games>();
  const undated: typeof games = [];
  for (const g of games) {
    if (g.game_date) {
      const bucket = dateBuckets.get(g.game_date);
      if (bucket) bucket.push(g);
      else dateBuckets.set(g.game_date, [g]);
    } else {
      undated.push(g);
    }
  }
  const sortedDates = Array.from(dateBuckets.keys()).sort();

  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <Breadcrumb
          items={[{ label: meta.name, href: `/${sport}` }, { label: "Games" }]}
        />

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="font-heading text-3xl md:text-5xl text-[var(--psp-gold)] leading-tight">
            Head-to-Head Games
          </h1>
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            {totalCount.toLocaleString()} {meta.name.toLowerCase()} games with
            full box scores for both teams — sourced from Ted Silary&apos;s
            archive.
          </p>
        </div>

        {/* Year selector — pill tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-700/50">
          {seasons.map((s) => {
            const active = s.label === currentSeason;
            return (
              <Link
                key={s.label}
                href={`/${sport}/games?season=${encodeURIComponent(s.label)}`}
                scroll={false}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                    : "bg-[var(--psp-navy-mid)] text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {s.label}
                <span className="ml-1.5 opacity-70 text-xs">{s.game_count}</span>
              </Link>
            );
          })}
        </div>

        {/* Games list */}
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <section key={date}>
              <h2 className="font-heading text-xl text-white/90 mb-3">
                {formatDateShort(date)}
                <span className="text-gray-500 text-sm font-normal ml-2">
                  · {dateBuckets.get(date)!.length} game
                  {dateBuckets.get(date)!.length === 1 ? "" : "s"}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dateBuckets.get(date)!.map((g) => (
                  <GameCard key={g.id} g={g} sport={sport} />
                ))}
              </div>
            </section>
          ))}

          {undated.length > 0 && (
            <section>
              <h2 className="font-heading text-xl text-white/90 mb-3">
                Date not yet archived
                <span className="text-gray-500 text-sm font-normal ml-2">
                  · {undated.length} game{undated.length === 1 ? "" : "s"}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {undated.map((g) => (
                  <GameCard key={g.id} g={g} sport={sport} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}


function GameCard({
  g,
  sport,
}: {
  g: {
    id: number;
    home_school: { name?: string | null; slug?: string | null } | null;
    away_school: { name?: string | null; slug?: string | null } | null;
    home_score: number | null;
    away_score: number | null;
  };
  sport: string;
}) {
  const home = g.home_school?.name
    ? getSchoolDisplayName({ name: g.home_school.name })
    : "Home";
  const away = g.away_school?.name
    ? getSchoolDisplayName({ name: g.away_school.name })
    : "Away";
  const hs = g.home_score ?? 0;
  const as = g.away_score ?? 0;
  const homeWon = hs > as;
  const awayWon = as > hs;

  return (
    <Link
      href={`/${sport}/games/${g.id}`}
      className="block bg-[var(--psp-navy-mid)] border border-gray-700/50 rounded-lg p-4 hover:border-[var(--psp-gold)] hover:bg-[var(--psp-navy-mid)]/70 transition-all"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className={`flex items-center justify-between text-sm md:text-base py-0.5 ${
              awayWon ? "text-white font-semibold" : "text-gray-400"
            }`}
          >
            <span className="truncate pr-2">{away}</span>
            <span className="font-heading font-bold tabular-nums">{as}</span>
          </div>
          <div
            className={`flex items-center justify-between text-sm md:text-base py-0.5 ${
              homeWon ? "text-white font-semibold" : "text-gray-400"
            }`}
          >
            <span className="truncate pr-2">{home}</span>
            <span className="font-heading font-bold tabular-nums">{hs}</span>
          </div>
        </div>
        <div className="text-[var(--psp-gold)] text-xs font-semibold uppercase tracking-wider">
          Box Score →
        </div>
      </div>
    </Link>
  );
}
