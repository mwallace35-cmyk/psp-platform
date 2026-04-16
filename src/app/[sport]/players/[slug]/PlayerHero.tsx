import Link from "next/link";
import { Breadcrumb, SocialProfileBar } from "@/components/ui";
import ShareButtons from "@/components/social/ShareButtons";
import LegacyBadge from "@/components/legacy/LegacyBadge";
import PlayerSchoolHistory from "@/components/players/PlayerSchoolHistory";
import { buildPlayerCaption } from "@/lib/ig-caption";
import type { Player, Award } from "@/lib/data";
import type { getPlayerSchoolHistory } from "@/lib/data";

type HeroStat = { label: string; value: string; sub?: string };
type FootballTotals = {
  rushYards: number;
  rushTd: number;
  passYards: number;
  passTd: number;
  recYards: number;
  recTd: number;
  totalTd: number;
  rushCarries: number;
  gamesPlayed: number;
};
type BasketballTotals = {
  points: number;
  games: number;
  rebounds: number;
  assists: number;
};

type PlayerHeroProps = {
  player: Player;
  sport: string;
  slug: string;
  meta: { name: string; color: string };
  jerseyNumber: string | null;
  schoolInitials: string;
  schoolHistory: Awaited<ReturnType<typeof getPlayerSchoolHistory>>;
  legacyProfile: { slug: string } | null;
  awards: Award[];
  footballTotals: FootballTotals | null;
  basketballTotals: BasketballTotals | null;
  heroStats: HeroStat[];
  recruitingProfile: {
    url_hudl?: string | null;
    url_on3?: string | null;
    url_247?: string | null;
    url_rivals?: string | null;
    social_twitter?: string | null;
    social_instagram?: string | null;
    url_maxpreps?: string | null;
    highlights_url?: string | null;
  } | null;
  isBasketball: boolean;
};

export default function PlayerHero({
  player,
  sport,
  slug,
  meta,
  jerseyNumber,
  schoolInitials,
  schoolHistory,
  legacyProfile,
  awards,
  footballTotals,
  basketballTotals,
  heroStats,
  recruitingProfile,
  isBasketball,
}: PlayerHeroProps) {
  return (
    <section className="relative" style={{ background: "var(--psp-navy)" }}>
      {/* Sport-colored accent bar at very top */}
      <div className="h-1" style={{ background: meta.color }} />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-12">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: meta.name, href: `/${sport}` },
          { label: "Players" },
          { label: player.name }
        ]} />

        <div className="flex items-start gap-5 mt-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: jerseyNumber ? meta.color : `${meta.color}25`,
              color: jerseyNumber ? 'white' : 'var(--psp-gold)',
              border: `2px solid ${meta.color}40`
            }}
            aria-hidden="true"
          >
            <span className="font-display text-3xl md:text-4xl font-bold leading-none">
              {jerseyNumber || schoolInitials}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Player name */}
            <h1
              className="psp-h1-lg text-white leading-none"
            >
              {player.name}
            </h1>

            {/* Meta row: school, position, class, jersey, badges */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
              <PlayerSchoolHistory
                schoolHistory={schoolHistory}
                sport={sport}
                fallbackSchool={player.schools}
              />
              {player.positions && player.positions.length > 0 && (
                <span
                  className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md"
                  style={{ background: `${meta.color}30`, color: meta.color, border: `1px solid ${meta.color}50` }}
                >
                  {player.positions.join(" / ")}
                </span>
              )}
              {player.graduation_year && (
                <span className="text-sm text-gray-300">Class of {player.graduation_year}</span>
              )}
              {player.height && (
                <span className="text-sm text-gray-300">· {player.height}</span>
              )}
              {sport === "football" && footballTotals && footballTotals.gamesPlayed > 0 && (
                <span className="text-sm text-gray-300">· {footballTotals.gamesPlayed} GP</span>
              )}
              {player.is_multi_sport && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-md" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                  Multi-Sport
                </span>
              )}
              {player.pro_team && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-md" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                  Pro Athlete
                </span>
              )}
              {player.college && !player.pro_team && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-blue-600 text-white">
                  College
                </span>
              )}
              {legacyProfile && (
                <LegacyBadge href={`/legacy/${legacyProfile.slug}`} />
              )}
              {awards.length > 0 && (
                <a
                  href="#awards"
                  className="px-2 py-0.5 text-xs font-bold rounded-md hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--psp-navy)] transition"
                  style={{ background: "rgba(240,165,0,0.2)", color: "var(--psp-gold)", border: "1px solid rgba(240,165,0,0.3)" }}
                  aria-label={`Jump to ${awards.length} award${awards.length !== 1 ? "s" : ""} section`}
                >
                  {awards.length} Award{awards.length !== 1 ? "s" : ""}
                </a>
              )}
            </div>

            {/* Actions row */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {(() => {
                const headlineStat = (() => {
                  if (sport === "football" && footballTotals) {
                    if (footballTotals.rushYards >= footballTotals.passYards && footballTotals.rushYards >= footballTotals.recYards && footballTotals.rushYards > 0) {
                      return `${footballTotals.rushYards.toLocaleString()} Career Rush Yds`;
                    }
                    if (footballTotals.passYards >= footballTotals.recYards && footballTotals.passYards > 0) {
                      return `${footballTotals.passYards.toLocaleString()} Career Pass Yds`;
                    }
                    if (footballTotals.recYards > 0) {
                      return `${footballTotals.recYards.toLocaleString()} Career Rec Yds`;
                    }
                    if (footballTotals.totalTd > 0) {
                      return `${footballTotals.totalTd} Career TDs`;
                    }
                  }
                  if (isBasketball && basketballTotals && basketballTotals.points > 0) {
                    return `${basketballTotals.points.toLocaleString()} Career Points`;
                  }
                  return "";
                })();
                const schoolName = player.schools?.name ?? "";
                const igQs = new URLSearchParams({
                  name: player.name,
                  ...(schoolName ? { school: schoolName } : {}),
                  sport,
                  ...(headlineStat ? { stat: headlineStat } : {}),
                }).toString();
                const igImageUrl = `/api/og/ig-story/player?${igQs}`;
                const igCaption = buildPlayerCaption({
                  name: player.name,
                  school: schoolName || undefined,
                  sport,
                  headline: headlineStat || undefined,
                  url: `https://phillysportspack.com/${sport}/players/${slug}`,
                });
                return (
                  <ShareButtons
                    url={`/${sport}/players/${slug}`}
                    title={`${player.name} -- ${meta.name} Stats | PhillySportsPack`}
                    description={`Check out ${player.name}'s career stats on PhillySportsPack.com`}
                    igImageUrl={igImageUrl}
                    igCaption={igCaption}
                  />
                );
              })()}
              <span className="hidden sm:block w-px h-5 bg-[var(--psp-rule-strong)]" />
              <Link
                href={`/compare?players=${slug}&sport=${sport}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[var(--psp-blue)] text-[var(--psp-blue)] hover:bg-[var(--psp-blue)] hover:text-white transition-colors"
                title="Compare with another player"
              >
                Compare
              </Link>
            </div>

            {/* Social Profile Bar */}
            <div className="mt-4">
              <SocialProfileBar
                hudlUrl={player.hudl_profile_url || recruitingProfile?.url_hudl}
                on3Url={recruitingProfile?.url_on3}
                two47Url={recruitingProfile?.url_247}
                rivalsUrl={recruitingProfile?.url_rivals}
                twitterHandle={player.twitter_handle || recruitingProfile?.social_twitter}
                instagramHandle={player.instagram_handle || recruitingProfile?.social_instagram}
                maxPrepsUrl={recruitingProfile?.url_maxpreps}
                highlightsUrl={recruitingProfile?.highlights_url}
                isVerified={player.is_verified}
              />
            </div>
          </div>
        </div>

        {/* ---- Hero Stat Highlight Cards ---- */}
        {heroStats.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-8">
            {heroStats.map((hs) => (
              <div
                key={hs.label}
                className="rounded-xl px-6 py-4 min-w-[120px] flex-1 max-w-[200px]"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="psp-h1 text-white leading-none"
                >
                  {hs.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: meta.color }}>
                  {hs.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
