"use client";

import Link from "next/link";
import { SchoolLogo } from "@/components/ui";

interface TeamHeaderProps {
  team: {
    name: string;
    slug: string;
    league: string;
    city: string;
    state: string;
    currentRecord: { wins: number; losses: number; ties: number };
    championships: number;
    recentChampionships: string[];
    pointsFor: number;
    pointsAgainst: number;
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
}

export default function TeamHeader({
  team,
  school,
  sport,
  sportMeta,
}: TeamHeaderProps) {
  const totalGames = team.currentRecord.wins + team.currentRecord.losses + team.currentRecord.ties;
  const winPct = totalGames > 0 ? ((team.currentRecord.wins / totalGames) * 100).toFixed(1) : "0.0";
  const pointDiff = team.pointsFor - team.pointsAgainst;
  const record = `${team.currentRecord.wins}-${team.currentRecord.losses}${team.currentRecord.ties > 0 ? `-${team.currentRecord.ties}` : ""}`;

  return (
    <section className="relative overflow-hidden" style={{ background: "#0a1628" }}>
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

      {/* Gold accent bar at top */}
      <div className="h-1" style={{ background: "var(--psp-gold)" }} />

      <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium tracking-wide uppercase">
          <Link href={`/${sport}`} className="hover:text-[var(--psp-gold)] transition-colors">
            {sportMeta.name}
          </Link>
          <span className="text-gray-700">/</span>
          <Link href={`/${sport}/teams`} className="hover:text-[var(--psp-gold)] transition-colors">
            Teams
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-400">{team.name}</span>
        </div>

        {/* Main hero content */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Left: Logo + Name */}
          <div className="flex items-center gap-5">
            {/* School logo or sport icon */}
            <div className="relative">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center overflow-hidden border-2"
                style={{
                  borderColor: school.primary_color || "var(--psp-gold)",
                  background: `${school.primary_color || sportMeta.color}15`,
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
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-[#0a1628]"
                  style={{ background: "var(--psp-gold)", color: "#0a1628" }}
                >
                  {team.championships}
                </div>
              )}
            </div>

            <div>
              <h1
                className="text-white leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
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
                className="leading-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
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
                className="leading-none text-white"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
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
          <StatPill label="PA" value={String(team.pointsAgainst)} color="#94a3b8" />
          <StatPill
            label="Diff"
            value={`${pointDiff > 0 ? "+" : ""}${pointDiff}`}
            color={pointDiff > 0 ? "#22c55e" : "#ef4444"}
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
    </section>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold" style={{ color, fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}>
        {value}
      </span>
    </div>
  );
}
