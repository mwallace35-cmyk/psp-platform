import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getFootballLeaders, getBasketballLeaders } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

type PageParams = { sport: string };

const STAT_CATEGORIES: Record<string, { slug: string; label: string; icon: string; statKey: string; valueKey: string; valueLabel: string }[]> = {
  football: [
    { slug: "rushing", label: "Rushing", icon: "🏃", statKey: "rushing", valueKey: "rush_yards", valueLabel: "Yds" },
    { slug: "passing", label: "Passing", icon: "🎯", statKey: "passing", valueKey: "pass_yards", valueLabel: "Yds" },
    { slug: "receiving", label: "Receiving", icon: "🙌", statKey: "receiving", valueKey: "rec_yards", valueLabel: "Yds" },
    { slug: "scoring", label: "Scoring", icon: "🏆", statKey: "scoring", valueKey: "total_td", valueLabel: "TDs" },
  ],
  basketball: [
    { slug: "scoring", label: "Scoring", icon: "🏀", statKey: "scoring", valueKey: "points", valueLabel: "Pts" },
    { slug: "ppg", label: "Points Per Game", icon: "📊", statKey: "ppg", valueKey: "ppg", valueLabel: "PPG" },
    { slug: "rebounds", label: "Rebounds", icon: "💪", statKey: "rebounds", valueKey: "rebounds", valueLabel: "Reb" },
    { slug: "assists", label: "Assists", icon: "🤝", statKey: "assists", valueKey: "assists", valueLabel: "Ast" },
  ],
  baseball: [
    { slug: "batting", label: "Batting", icon: "⚾", statKey: "batting", valueKey: "hits", valueLabel: "H" },
    { slug: "home-runs", label: "Home Runs", icon: "💣", statKey: "home-runs", valueKey: "home_runs", valueLabel: "HR" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Leaderboards — PhillySportsPack`,
    description: `Current season statistical leaders for Philadelphia high school ${meta.name.toLowerCase()}. Toggle to career mode for all-time records.`,
    alternates: { canonical: `https://phillysportspack.com/${sport}/leaderboards` },
  };
}

export default async function LeaderboardsIndex({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];
  const categories = STAT_CATEGORIES[sport] || [];

  // Fetch top 5 for each category in parallel
  const leaderData: Record<string, { name: string; school: string; slug: string; value: number | string }[]> = {};

  if (categories.length > 0) {
    const fetches = categories.map(async (cat) => {
      try {
        let leaders: any[] = [];
        if (sport === "football") {
          leaders = await getFootballLeaders(cat.statKey, 5);
        } else if (sport === "basketball") {
          leaders = await getBasketballLeaders(cat.statKey, 5);
        }
        leaderData[cat.slug] = leaders.slice(0, 5).map((r: any) => ({
          name: r.players?.name || r.player_name || "Unknown",
          school: r.schools?.name || r.players?.schools?.name || "",
          slug: r.players?.slug || "",
          value: r[cat.valueKey] ?? 0,
        }));
      } catch {
        leaderData[cat.slug] = [];
      }
    });
    await Promise.allSettled(fetches);
  }

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: meta.name, url: `/${sport}` },
        { name: "Leaderboards", url: `/${sport}/leaderboards` },
      ]} />

      <div className="min-h-screen bg-[#0a1628]">
        {/* Hero */}
        <div className="bg-[var(--psp-navy)] border-b-4" style={{ borderColor: meta.color }}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <Breadcrumb items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Leaderboards" },
            ]} />
            <div className="flex items-center gap-3 mt-4">
              <span className="text-4xl">{meta.emoji}</span>
              <h1 className="psp-h1 text-white">
                {meta.name} Leaderboards
              </h1>
            </div>
            <p className="text-gray-300 mt-2">
              Current season statistical leaders for Philadelphia high school {meta.name.toLowerCase()}.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* ===== SECTION 1: Current Season Leaders ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full" style={{ background: meta.color }} />
              <h2 className="psp-h2 text-white">
                Season Leaders
              </h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--psp-gold)]/15 text-[var(--psp-gold)] border border-[var(--psp-gold)]/30">
                Current Season
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => {
                const leaders = leaderData[cat.slug] || [];
                return (
                  <div key={cat.slug} className="bg-[rgba(255,255,255,0.03)] rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600 transition-colors duration-200 animate-fade-in-up focus-within:ring-2 focus-within:ring-[var(--psp-gold)] focus-within:ring-offset-2 focus-within:ring-offset-[#0a1628]">
                    {/* Category Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, #1a2744 100%)` }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <h3 className="psp-h4 text-white">
                          {cat.label}
                        </h3>
                      </div>
                      <Link
                        href={`/${sport}/leaderboards/${cat.slug}`}
                        className="text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                        style={{ color: 'var(--psp-gold)', border: '1px solid var(--psp-gold)' }}
                      >
                        Full Leaderboard →
                      </Link>
                    </div>

                    {/* Top 5 List */}
                    {leaders.length > 0 ? (
                      <div>
                        {leaders.map((player, idx) => (
                          <div
                            key={`${player.slug}-${idx}`}
                            className={`flex items-center px-5 py-2.5 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'} ${idx < leaders.length - 1 ? 'border-b border-gray-700/30' : ''}`}
                          >
                            {/* Rank */}
                            <span className={`w-7 text-sm font-bold ${idx === 0 ? 'text-[var(--psp-gold)]' : 'text-gray-300'}`}>
                              {idx + 1}
                            </span>

                            {/* Player + School */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/${sport}/players/${player.slug}`}
                                className="text-sm font-semibold text-gray-100 hover:text-[var(--psp-gold)] transition-colors truncate block"
                              >
                                {player.name}
                              </Link>
                              <span className="text-xs text-gray-300 truncate block">{player.school}</span>
                            </div>

                            {/* Stat Value */}
                            <div className="text-right ml-3">
                              <span className={`text-sm font-bold ${idx === 0 ? 'text-[var(--psp-gold)]' : 'text-gray-100'}`}>
                                {typeof player.value === 'number' ? player.value.toLocaleString() : player.value}
                              </span>
                              <span className="text-xs text-gray-300 ml-1">{cat.valueLabel}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 py-8 text-center text-gray-300 text-sm">
                        Data coming soon
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== SECTION 2: All-Time Records ===== */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full bg-gray-500" />
              <h2 className="psp-h2 text-white">
                All-Time Records
              </h2>
            </div>

            <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-gray-700/50 p-6">
              <p className="text-gray-300 text-sm mb-5">
                Career statistical leaders and all-time records across Philadelphia high school {meta.name.toLowerCase()}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${sport}/leaderboards/${cat.slug}?mode=career`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-700/50 bg-white/[0.03] hover:border-[var(--psp-gold)]/50 hover:bg-[var(--psp-gold)]/5 transition-colors group focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] focus-visible:outline-none"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-[var(--psp-gold)] transition-colors block">
                        {cat.label}
                      </span>
                      <span className="text-xs text-gray-300 uppercase tracking-wider">Career Leaders</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-700/40 text-center">
                <Link
                  href={`/${sport}/records`}
                  className="text-sm font-semibold transition-colors inline-flex items-center gap-1"
                  style={{ color: 'var(--psp-gold)' }}
                >
                  View All-Time Records Page →
                </Link>
              </div>
            </div>
          </div>

          {/* Class Year Links */}
          <div className="bg-[rgba(255,255,255,0.03)] rounded-xl border border-gray-700/50 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Browse by Class Year</h2>
            <div className="flex flex-wrap gap-2">
              {[2025, 2026, 2027, 2028].map(year => (
                <Link
                  key={year}
                  href={`/class/${year}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white/[0.06] text-gray-200 hover:bg-[var(--psp-gold)] hover:text-[var(--psp-navy)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] focus-visible:outline-none"
                >
                  Class of {year}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
