"use client";

import { useState } from "react";
import Link from "next/link";
import BoxScoreIndicator from "@/components/schedule/BoxScoreIndicator";
import type { GameWithBoxScore } from "@/lib/data/school-hub";

interface TeamGameLogProps {
  games: GameWithBoxScore[];
  schoolId: number;
  sport: string;
}

export default function TeamGameLog({ games, schoolId, sport }: TeamGameLogProps) {
  const [expandedGameId, setExpandedGameId] = useState<number | null>(null);

  if (!games || games.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
      <div className="divide-y divide-gray-100">
        {games.map((game) => {
          const isHome = game.home_school_id === schoolId;
          const schoolScore = isHome ? game.home_score : game.away_score;
          const oppScore = isHome ? game.away_score : game.home_score;
          const oppName = isHome ? game.away_school_name : game.home_school_name;
          const oppSlug = isHome ? game.away_school_slug : game.home_school_slug;

          const won = schoolScore !== null && oppScore !== null && schoolScore > oppScore;
          const lost = schoolScore !== null && oppScore !== null && schoolScore < oppScore;
          const resultLabel = won ? "W" : lost ? "L" : schoolScore !== null ? "T" : "";
          const resultBg = won
            ? "bg-green-100 text-green-700"
            : lost
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500";

          const dateStr = game.game_date
            ? new Date(game.game_date + "T12:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "";

          const hasStats = game.player_stats && game.player_stats.length > 0;
          const isExpanded = expandedGameId === game.game_id;

          return (
            <div key={game.game_id}>
              {/* Game row */}
              <button
                onClick={() => setExpandedGameId(isExpanded ? null : game.game_id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                aria-expanded={isExpanded}
              >
                {/* W/L badge */}
                {resultLabel && (
                  <span
                    className={`text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${resultBg}`}
                  >
                    {resultLabel}
                  </span>
                )}

                {/* Opponent */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">
                      {isHome ? "vs" : "@"}
                    </span>
                    {oppSlug ? (
                      <Link
                        href={`/${sport}/schools/${oppSlug}`}
                        className="text-sm font-medium hover:underline truncate"
                        style={{ color: "var(--psp-blue)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {oppName}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium truncate">{oppName}</span>
                    )}
                  </div>
                  {dateStr && <div className="text-xs text-gray-300">{dateStr}</div>}
                </div>

                {/* Score */}
                <span
                  className="text-sm font-bold tabular-nums flex-shrink-0"
                  style={{ color: "var(--psp-navy)" }}
                >
                  {schoolScore !== null && oppScore !== null
                    ? `${schoolScore}\u2013${oppScore}`
                    : "TBD"}
                </span>

                {/* Box score indicator */}
                {hasStats && (
                  <span className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <BoxScoreIndicator gameId={game.game_id} sport={sport} compact />
                  </span>
                )}

                {/* Expand indicator */}
                {hasStats && (
                  <svg
                    className={`w-4 h-4 text-gray-300 transition-transform flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {/* Expanded box score */}
              {isExpanded && hasStats && (
                <div className="px-4 pb-4 bg-gray-50">
                  <div className="overflow-x-auto">
                    <table className="data-table text-xs">
                      <thead>
                        <tr>
                          <th>Player</th>
                          {sport === "football" ? (
                            <>
                              <th className="text-center">Rush</th>
                              <th className="text-center">Pass</th>
                              <th className="text-center">Rec</th>
                              <th className="text-center">TD</th>
                            </>
                          ) : (
                            <>
                              <th className="text-center">Pts</th>
                              <th className="text-center">Reb</th>
                              <th className="text-center">Ast</th>
                              <th className="text-center">Stl</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {game.player_stats.map((stat, idx) => (
                          <tr key={`${stat.player_slug || idx}`}>
                            <td>
                              {stat.player_slug ? (
                                <Link
                                  href={`/${sport}/players/${stat.player_slug}`}
                                  className="font-medium hover:underline"
                                  style={{ color: "var(--psp-blue)" }}
                                >
                                  {stat.player_name}
                                </Link>
                              ) : (
                                <span className="font-medium">{stat.player_name}</span>
                              )}
                            </td>
                            {sport === "football" ? (
                              <>
                                <td className="text-center tabular-nums">
                                  {stat.rush_yards ?? "--"}
                                </td>
                                <td className="text-center tabular-nums">
                                  {stat.pass_yards ?? "--"}
                                </td>
                                <td className="text-center tabular-nums">
                                  {stat.rec_yards ?? "--"}
                                </td>
                                <td className="text-center tabular-nums">
                                  {stat.total_td ?? "--"}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="text-center tabular-nums">
                                  {stat.bb_points ?? stat.points ?? "--"}
                                </td>
                                <td className="text-center tabular-nums">
                                  {stat.rebounds ?? "--"}
                                </td>
                                <td className="text-center tabular-nums">
                                  {stat.assists ?? "--"}
                                </td>
                                <td className="text-center tabular-nums">
                                  {stat.steals ?? "--"}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
