'use client';

import Link from "next/link";
import type { TeamSeason, Championship, Era } from "./team-utils";
import { ERAS, formatChampionshipLabel } from "./team-utils";

/** Compute background + left-border styles for a season row */
function getSeasonRowStyle(isChampYear: boolean, isEven: boolean) {
  return {
    background: isChampYear
      ? "rgba(240,165,0,0.08)"
      : isEven ? "var(--psp-navy)" : "#0d1a2e",
    borderLeft: isChampYear ? "3px solid var(--psp-gold)" : "3px solid transparent",
  } as const;
}

/** Compute color for a win-pct value */
function getPctColor(pct: number) {
  return pct >= 70 ? "var(--psp-gold)" : pct >= 50 ? "var(--psp-success)" : "var(--psp-danger)";
}

interface TeamSeasonHistoryProps {
  teamSeasons: TeamSeason[];
  champMap: Map<number, Championship[]>;
  availableEras: Era[];
  selectedEra: string;
  setSelectedEra: (era: string) => void;
  sport: string;
  teamSlug: string;
}

export default function TeamSeasonHistory({
  teamSeasons,
  champMap,
  availableEras,
  selectedEra,
  setSelectedEra,
  sport,
  teamSlug,
}: TeamSeasonHistoryProps) {
  const currentEra = ERAS.find((e) => e.key === selectedEra) || ERAS[0];

  if (!teamSeasons || teamSeasons.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "var(--psp-navy)" }}>
      {/* Header bar -- ESPN style */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "2px solid var(--psp-gold)" }}>
        <h2 className="text-white font-bold text-sm uppercase tracking-wider font-heading" style={{ fontSize: "1.1rem" }}>
          Season History
        </h2>
        {availableEras.length > 1 && (
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="text-xs font-semibold rounded px-2 py-1 border-0 cursor-pointer focus:outline-none"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--psp-gold)", fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            {availableEras.map((era) => (
              <option key={era.key} value={era.key} style={{ color: "var(--psp-navy)", background: "#fff" }}>
                {era.label} ({era.range})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_40px_40px_40px_55px_auto] gap-0 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500" style={{ background: "var(--psp-navy-mid)" }}>
        <span>Season</span>
        <span className="text-center">W</span>
        <span className="text-center">L</span>
        <span className="text-center">T</span>
        <span className="text-right">Win%</span>
        <span className="text-right pr-1">Titles</span>
      </div>

      {/* Season rows */}
      <div>
        {teamSeasons
          .filter((ts) => {
            const year = ts.seasons?.year_start;
            return ts.seasons?.label && year != null && year >= currentEra.minYear && year <= currentEra.maxYear;
          })
          .sort((a, b) => (b.seasons?.year_start || 0) - (a.seasons?.year_start || 0))
          .map((ts, idx) => {
            const label = ts.seasons!.label;
            const w = ts.wins ?? 0;
            const l = ts.losses ?? 0;
            const t = ts.ties ?? 0;
            const total = w + l;
            const pct = total > 0 ? Math.round((w / total) * 100) : 0;
            const seasonChamps = champMap.get(ts.season_id) || [];
            const isChampYear = seasonChamps.length > 0;
            const isEven = idx % 2 === 0;

            return (
              <Link
                key={ts.id}
                href={`/${sport}/teams/${teamSlug}/${label}`}
                className="block transition-colors hover:brightness-125"
                style={getSeasonRowStyle(isChampYear, isEven)}
              >
                <div className="grid grid-cols-[1fr_40px_40px_40px_55px_auto] gap-0 items-center px-4 py-2.5">
                  {/* Season label */}
                  <span className="font-bold text-white text-sm font-heading" style={{ fontSize: "1rem", letterSpacing: "0.03em" }}>
                    {label}
                  </span>
                  {/* W */}
                  <span className="text-center text-sm font-semibold tabular-nums" style={{ color: w > l ? "var(--psp-success)" : "var(--psp-gray-400)" }}>
                    {w}
                  </span>
                  {/* L */}
                  <span className="text-center text-sm font-semibold tabular-nums" style={{ color: l > w ? "var(--psp-danger)" : "var(--psp-gray-400)" }}>
                    {l}
                  </span>
                  {/* T */}
                  <span className="text-center text-sm tabular-nums text-gray-600">
                    {t || "\u2014"}
                  </span>
                  {/* Win% bar */}
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-8 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--psp-gray-800)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: getPctColor(pct),
                        }}
                      />
                    </div>
                    <span className="text-xs tabular-nums font-medium w-7 text-right" style={{ color: pct >= 70 ? "var(--psp-gold)" : pct >= 50 ? "var(--psp-success)" : "var(--psp-gray-400)" }}>
                      {pct}
                    </span>
                  </div>
                  {/* Championship */}
                  <div className="flex justify-end">
                    {isChampYear ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded text-right truncate max-w-[120px]" style={{ background: "rgba(240,165,0,0.2)", color: "var(--psp-gold)" }}>
                        {seasonChamps.map(c => formatChampionshipLabel(c).replace(" Champion", "")).join(", ")}
                      </span>
                    ) : (
                      <span className="text-gray-700 text-xs">{"\u2014"}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--psp-navy-mid)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href={`/${sport}/schools/${teamSlug}`} className="text-xs font-semibold hover:underline" style={{ color: "var(--psp-gold)" }}>
          Full Program Profile
        </Link>
        <span className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">
          {teamSeasons.filter((ts) => ts.seasons?.label).length} Seasons
        </span>
      </div>
    </div>
  );
}
