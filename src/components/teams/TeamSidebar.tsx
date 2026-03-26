'use client';

import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";
import type { TeamDetail } from "./team-utils";

interface TeamSidebarProps {
  team: TeamDetail;
  winPct: string;
  sport: string;
}

export default function TeamSidebar({ team, winPct, sport }: TeamSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Team Info Card */}
      <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
        <h3
          className="font-bold text-sm uppercase tracking-wider mb-4"
          style={{ color: "var(--psp-gray-400)" }}
        >
          Team Info
        </h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt style={{ color: "var(--psp-gray-500)" }}>League</dt>
            <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
              {team.league}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt style={{ color: "var(--psp-gray-500)" }}>Location</dt>
            <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
              {team.city}, {team.state}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt style={{ color: "var(--psp-gray-500)" }}>Head Coach</dt>
            <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
              {team.coach}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt style={{ color: "var(--psp-gray-500)" }}>Founded</dt>
            <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
              {team.founded_year}
            </dd>
          </div>
        </dl>
      </div>

      {/* Season Record Card */}
      <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
        <h3
          className="font-bold text-sm uppercase tracking-wider mb-4"
          style={{ color: "var(--psp-gray-400)" }}
        >
          Season Record
        </h3>
        <div className="text-center">
          <div
            className="psp-h1 mb-2"
            style={{ color: "var(--psp-navy)" }}
          >
            {team.currentRecord.wins}-{team.currentRecord.losses}
          </div>
          <div className="text-sm text-gray-400">{winPct}% Win Rate</div>
        </div>
      </div>

      {/* Championships Card */}
      {team.championships > 0 && (
        <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
          <h3
            className="font-bold text-sm uppercase tracking-wider mb-4"
            style={{ color: "var(--psp-gray-400)" }}
          >
            Championships
          </h3>
          <div className="text-center mb-4">
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--psp-gold)" }}
            >
              &#127942; {team.championships}
            </div>
          </div>
          {team.recentChampionships.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-2">
                Recent Titles
              </h4>
              <div className="flex flex-wrap gap-2">
                {team.recentChampionships.map((year: string) => (
                  <span
                    key={year}
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "var(--psp-gold)",
                      color: "var(--psp-navy)",
                    }}
                  >
                    {year}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Promotional Content */}
      <PSPPromo size="sidebar" />

      {/* Related Teams */}
      <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
        <h3
          className="font-bold text-sm uppercase tracking-wider mb-4"
          style={{ color: "var(--psp-gray-400)" }}
        >
          League Teams
        </h3>
        <div className="space-y-2">
          <Link
            href={`/${sport}/teams?league=${encodeURIComponent(team.league)}`}
            className="block text-sm py-2 px-3 rounded hover:bg-gray-50 transition-colors"
            style={{ color: "var(--psp-navy)" }}
          >
            View all {team.league} teams &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
