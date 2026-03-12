"use client";

import Link from "next/link";

interface TeamHeaderProps {
  team: {
    name: string;
    league: string;
    city: string;
    state: string;
    currentRecord: { wins: number; losses: number; ties: number };
    championships: number;
    pointsFor: number;
    pointsAgainst: number;
  };
  school: {
    primary_color?: string;
    secondary_color?: string;
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
  const winPct = ((team.currentRecord.wins / (team.currentRecord.wins + team.currentRecord.losses)) * 100).toFixed(1);
  const pointDiff = team.pointsFor - team.pointsAgainst;

  const heroGradient = school.primary_color
    ? `linear-gradient(135deg, ${school.primary_color} 0%, ${school.secondary_color || school.primary_color} 100%)`
    : `linear-gradient(135deg, var(--psp-navy) 0%, ${sportMeta.color}33 100%)`;

  return (
    <section
      className="py-12 md:py-16"
      style={{ background: heroGradient }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href={`/${sport}`} className="hover:text-white transition-colors">
            {sportMeta.name}
          </Link>
          <span>/</span>
          <Link href={`/${sport}/teams`} className="hover:text-white transition-colors">
            Teams
          </Link>
          <span>/</span>
          <span className="text-white">{team.name}</span>
        </div>

        <div className="flex items-start gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{ background: `${sportMeta.color}20` }}
          >
            {sportMeta.emoji}
          </div>
          <div>
            <h1
              className="text-4xl md:text-5xl text-white mb-2 tracking-wider"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              {team.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <span style={{ color: "var(--psp-gold)" }}>{team.league}</span>
              <span className="text-gray-400">
                {team.city}, {team.state}
              </span>
            </div>
          </div>
        </div>

        {/* Stat bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
          <div className="rounded-xl p-4 bg-white/5">
            <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
              {team.currentRecord.wins}-{team.currentRecord.losses}
            </div>
            <div className="text-xs text-gray-400">Current Record</div>
          </div>
          <div className="rounded-xl p-4 bg-white/5">
            <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
              {winPct}%
            </div>
            <div className="text-xs text-gray-400">Win %</div>
          </div>
          <div className="rounded-xl p-4 bg-white/5">
            <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
              {team.championships}
            </div>
            <div className="text-xs text-gray-400">Championships</div>
          </div>
          <div className="rounded-xl p-4 bg-white/5">
            <div className="text-2xl font-bold" style={{ color: pointDiff > 0 ? "#22c55e" : "#ef4444", fontFamily: "Bebas Neue, sans-serif" }}>
              {pointDiff > 0 ? "+" : ""}{pointDiff}
            </div>
            <div className="text-xs text-gray-400">Point Diff</div>
          </div>
        </div>
      </div>
    </section>
  );
}
