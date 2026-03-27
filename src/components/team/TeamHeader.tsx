import Link from "next/link";
import { SchoolLogo, Breadcrumb } from "@/components/ui";

interface ChampionshipBadge {
  season: string;
  label: string;
}

interface TeamHeaderProps {
  team: {
    name: string;
    slug: string;
    league: string;
    city: string;
    state: string;
    coach?: string;
    currentRecord: { wins: number; losses: number; ties: number };
    championships: number;
    recentChampionships: string[];
    pointsFor: number;
    pointsAgainst: number;
    leagueRecord?: { wins: number; losses: number };
    leagueFinish?: string;
  };
  school: {
    primary_color?: string;
    secondary_color?: string;
    logo_url?: string;
    founded_year?: number;
    mascot?: string;
  };
  sport: string;
  sportMeta: {
    name: string;
    color: string;
    emoji: string;
  };
  currentSeasonChampionships?: ChampionshipBadge[];
}

export default function TeamHeader({
  team,
  school,
  sport,
  sportMeta,
  currentSeasonChampionships = [],
}: TeamHeaderProps) {
  const totalGames = team.currentRecord.wins + team.currentRecord.losses + team.currentRecord.ties;
  const winPct = totalGames > 0 ? ((team.currentRecord.wins / totalGames) * 100).toFixed(1) : "0.0";
  const pointDiff = team.pointsFor - team.pointsAgainst;
  const record = `${team.currentRecord.wins}-${team.currentRecord.losses}${team.currentRecord.ties > 0 ? `-${team.currentRecord.ties}` : ""}`;

  const hasCurrentChampionship = currentSeasonChampionships.length > 0;

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--psp-navy)" }}>
      {/* Championship Banner — only for current-season champions */}
      {hasCurrentChampionship && (
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(90deg, #c48800 0%, var(--psp-gold) 20%, var(--psp-gold-light) 50%, var(--psp-gold) 80%, #c48800 100%)" }}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 55%, transparent 70%)",
              animation: "championShimmer 3s ease-in-out infinite",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
            <span className="text-lg" aria-hidden="true">&#127942;</span>
            {currentSeasonChampionships.map((champ, i) => (
              <span
                key={i}
                className="font-heading tracking-wide text-sm md:text-base uppercase"
                style={{ color: "var(--psp-navy)", letterSpacing: "0.08em" }}
              >
                {champ.season} {champ.label}
              </span>
            ))}
            <span className="text-lg" aria-hidden="true">&#127942;</span>
          </div>
        </div>
      )}

      {/* Diagonal accent stripes in team colors */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 38px,
            ${school.primary_color || sportMeta.color}12 38px,
            ${school.primary_color || sportMeta.color}12 40px,
            transparent 40px,
            transparent 78px,
            ${school.secondary_color || school.primary_color || sportMeta.color}10 78px,
            ${school.secondary_color || school.primary_color || sportMeta.color}10 80px
          )`,
        }}
      />

      {/* Gold accent bar at top (skip if championship banner is showing) */}
      {!hasCurrentChampionship && (
        <div className="h-1" style={{ background: "var(--psp-gold)" }} />
      )}

      <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-12">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: sportMeta.name, href: `/${sport}` },
            { label: "Teams", href: `/${sport}/teams` },
            { label: team.name },
          ]}
          separator="/"
          className="text-xs text-gray-500 mb-6 font-medium tracking-wide uppercase"
          includeSchema={false}
        />

        {/* Main hero content */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Left: Logo + Name */}
          <div className="flex items-center gap-5">
            {/* School logo or sport icon */}
            <div className="relative">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center overflow-hidden border-2"
                style={{
                  borderColor: hasCurrentChampionship ? "var(--psp-gold)" : (school.primary_color || "var(--psp-gold)"),
                  background: hasCurrentChampionship
                    ? "linear-gradient(135deg, rgba(240,165,0,0.15) 0%, rgba(240,165,0,0.05) 100%)"
                    : `${school.primary_color || sportMeta.color}15`,
                  boxShadow: hasCurrentChampionship ? "0 0 20px rgba(240,165,0,0.25)" : undefined,
                }}
              >
                {school.logo_url ? (
                  <SchoolLogo logoUrl={school.logo_url} name={team.name} size="lg" />
                ) : (
                  <span className="text-4xl md:text-5xl">{sportMeta.emoji}</span>
                )}
              </div>
              {/* Championship count badge */}
              {team.championships > 0 && (
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-[var(--psp-navy)]"
                  style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
                >
                  {team.championships}
                </div>
              )}
            </div>

            <div>
              <h1
                className="text-white leading-[0.9] tracking-tight font-heading"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                {team.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${school.primary_color || sportMeta.color}25`,
                    color: school.primary_color || "var(--psp-gold)",
                    border: `1px solid ${school.primary_color || sportMeta.color}40`,
                  }}
                >
                  {team.league}
                </span>
                <span className="text-sm text-gray-500">
                  {team.city}, {team.state}
                </span>
                {school.founded_year && (
                  <span className="text-sm text-gray-600">
                    Est. {school.founded_year}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Big record display */}
          <div className="flex items-end gap-6 md:gap-8">
            {/* Record */}
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                Record
              </div>
              <div
                className="leading-none font-heading"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  color: "var(--psp-gold)",
                }}
              >
                {record}
              </div>
            </div>

            {/* Win % */}
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                Win %
              </div>
              <div
                className="leading-none text-white font-heading"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                }}
              >
                {winPct}<span className="text-gray-500 text-2xl">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat pills row */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
          <StatPill label="PF" value={String(team.pointsFor)} color="var(--psp-gold)" />
          <StatPill label="PA" value={String(team.pointsAgainst)} color="var(--psp-gray-400)" />
          <StatPill
            label="Diff"
            value={`${pointDiff > 0 ? "+" : ""}${pointDiff}`}
            color={pointDiff > 0 ? "var(--psp-success)" : "var(--psp-danger)"}
          />
          {team.championships > 0 && (
            <StatPill label="Titles" value={String(team.championships)} color="var(--psp-gold)" />
          )}
          {team.recentChampionships.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Recent</span>
              {team.recentChampionships.slice(0, 3).map((yr) => (
                <span key={yr} className="text-xs font-bold text-[var(--psp-gold)]">{yr}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shimmer keyframes for championship banner */}
      {hasCurrentChampionship && (
        <style>{`
          @keyframes championShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      )}
    </section>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold font-heading" style={{ color, fontSize: "1.1rem" }}>
        {value}
      </span>
    </div>
  );
}
