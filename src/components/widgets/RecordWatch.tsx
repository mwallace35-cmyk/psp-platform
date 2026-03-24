"use client";

import Link from "next/link";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";

interface RecordWatchEntry {
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  stat_name: string;
  current_value: number;
  record_value: number;
  record_holder: string;
  record_year: number | null;
  games_played: number;
  estimated_games_remaining: number;
  pace_projection: number;
  on_pace: boolean;
  needs_per_game: number | null;
}

interface RecordWatchProps {
  sport: string;
  data: RecordWatchEntry[];
}

export default function RecordWatch({ sport, data }: RecordWatchProps) {
  const sportColor = SPORT_COLORS_HEX[sport] || "#3b82f6";

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0f1d35 0%, #0a1628 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div>
          <h3
            className="psp-h3 text-white"
          >
            Record Watch
          </h3>
          <p className="text-xs text-gray-400">
            Players approaching all-time season records
          </p>
        </div>
        <Link
          href={`/${sport}/records`}
          className="text-xs font-bold hover:text-[var(--psp-gold)] transition"
          style={{ color: sportColor }}
        >
          All Records
        </Link>
      </div>

      {/* Entries */}
      <div className="divide-y divide-white/5">
        {data.map((entry, idx) => {
          const pctOfRecord =
            entry.record_value > 0
              ? Math.round((entry.current_value / entry.record_value) * 100)
              : 0;
          const projPct =
            entry.record_value > 0
              ? Math.round((entry.pace_projection / entry.record_value) * 100)
              : 0;

          return (
            <div key={`${entry.stat_name}-${idx}`} className="px-4 py-3">
              {/* Player + Stat */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <Link
                    href={`/${sport}/players/${entry.player_slug}`}
                    className="font-semibold text-sm text-white hover:text-[var(--psp-gold)] transition truncate block"
                  >
                    {entry.player_name}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Link
                      href={`/${sport}/schools/${entry.school_slug}`}
                      className="text-xs text-gray-400 hover:text-gray-300 transition"
                    >
                      {entry.school_name}
                    </Link>
                    <span className="text-gray-700">|</span>
                    <span className="text-xs text-gray-300 font-medium">
                      {entry.stat_name}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {entry.on_pace ? (
                  <span
                    className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: "rgba(240, 165, 0, 0.15)",
                      color: "#f0a500",
                      border: "1px solid rgba(240, 165, 0, 0.3)",
                    }}
                  >
                    On Pace
                  </span>
                ) : entry.needs_per_game !== null ? (
                  <span
                    className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.12)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                    }}
                  >
                    Needs {entry.needs_per_game}/gm
                  </span>
                ) : null}
              </div>

              {/* Progress Bar */}
              <div className="mb-1.5">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden relative">
                  {/* Current value */}
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(pctOfRecord, 100)}%`,
                      backgroundColor: entry.on_pace ? "#f0a500" : sportColor,
                    }}
                  />
                  {/* Projected end (faint overlay) */}
                  {projPct > pctOfRecord && (
                    <div
                      className="absolute top-0 h-full rounded-full"
                      style={{
                        left: `${Math.min(pctOfRecord, 100)}%`,
                        width: `${Math.min(projPct - pctOfRecord, 100 - pctOfRecord)}%`,
                        backgroundColor: entry.on_pace ? "#f0a500" : sportColor,
                        opacity: 0.25,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300">
                    Current:{" "}
                    <span className="text-white font-semibold tabular-nums">
                      {entry.current_value.toLocaleString()}
                    </span>
                  </span>
                  <span className="text-gray-300">
                    Pace:{" "}
                    <span
                      className="font-semibold tabular-nums"
                      style={{
                        color: entry.on_pace ? "#f0a500" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {entry.pace_projection.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="text-gray-400">
                  Record:{" "}
                  <span className="text-gray-300 font-semibold tabular-nums">
                    {entry.record_value.toLocaleString()}
                  </span>
                  {entry.record_holder && (
                    <span className="text-gray-600 ml-1">
                      ({entry.record_holder}
                      {entry.record_year ? `, ${entry.record_year}` : ""})
                    </span>
                  )}
                </div>
              </div>

              {/* Games Info */}
              <div className="text-xs text-gray-600 mt-1">
                {entry.games_played} games played
                {entry.estimated_games_remaining > 0 &&
                  ` / ~${entry.estimated_games_remaining} remaining`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
