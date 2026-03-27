"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ScoresGame } from "@/lib/data/games";

interface BoxScoresViewProps {
  sport: string;
  sportName: string;
  initialGames: ScoresGame[];
  seasons: { label: string }[];
}

export default function BoxScoresView({
  sport,
  sportName,
  initialGames,
  seasons,
}: BoxScoresViewProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const gamesPerPage = 25;

  // Client-side filtering by season + sort by date descending
  const filteredGames = useMemo(() => {
    let result = initialGames;
    if (selectedSeason) {
      result = result.filter((g) => g.seasons?.label === selectedSeason);
    }
    // Sort by date descending
    return [...result].sort((a, b) => {
      const dateA = a.game_date ? new Date(a.game_date).getTime() : 0;
      const dateB = b.game_date ? new Date(b.game_date).getTime() : 0;
      return dateB - dateA;
    });
  }, [initialGames, selectedSeason]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIdx = (currentPage - 1) * gamesPerPage;
  const paginatedGames = filteredGames.slice(startIdx, startIdx + gamesPerPage);

  // Reset to page 1 when season filter changes
  const handleSeasonChange = (value: string) => {
    setSelectedSeason(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-8 p-6 rounded-lg border border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--psp-navy)" }}>
          Filter Box Scores
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--psp-navy)" }}>
              Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border rounded-lg text-sm"
              style={{ borderColor: "var(--psp-gold)" }}
            >
              <option value="">All Seasons</option>
              {seasons.map((season) => (
                <option key={season.label} value={season.label}>
                  {season.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-700">
          Showing <strong>{paginatedGames.length}</strong> of <strong>{filteredGames.length}</strong> games
        </p>
      </div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-400 text-lg">No box scores found for the selected filters.</p>
        </div>
      )}

      {/* Games List */}
      {filteredGames.length > 0 && (
        <>
          <div className="space-y-4 mb-8">
            {paginatedGames.map((game, idx) => {
              const gameDate = game.game_date
                ? new Date(game.game_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date TBD";

              const homeWon =
                game.home_score !== null &&
                game.away_score !== null &&
                game.home_score > game.away_score;
              const awayWon =
                game.home_score !== null &&
                game.away_score !== null &&
                game.away_score > game.home_score;

              return (
                <div
                  key={game.id ?? `game-${startIdx + idx}`}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Date */}
                    <div className="text-xs text-gray-400 w-20 flex-shrink-0">
                      {gameDate}
                    </div>

                    {/* Home Team */}
                    <div className="flex-1 text-right">
                      {game.home_school ? (
                        <Link
                          href={`/${sport}/schools/${game.home_school.slug}`}
                          className="font-semibold hover:text-blue-600"
                          style={{ color: homeWon ? "var(--psp-gold)" : "var(--psp-navy)" }}
                        >
                          {game.home_school.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-gray-400 italic">
                          Opponent
                        </span>
                      )}
                    </div>

                    {/* Score */}
                    <div className="w-24 text-center">
                      <div className="text-2xl font-bold" style={{ color: "var(--psp-navy)" }}>
                        {game.home_score !== null && game.away_score !== null
                          ? `${game.home_score} \u2013 ${game.away_score}`
                          : "\u2014"}
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 text-left">
                      {game.away_school ? (
                        <Link
                          href={`/${sport}/schools/${game.away_school.slug}`}
                          className="font-semibold hover:text-blue-600"
                          style={{ color: awayWon ? "var(--psp-gold)" : "var(--psp-navy)" }}
                        >
                          {game.away_school.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-gray-400 italic">
                          Opponent
                        </span>
                      )}
                    </div>

                    {/* View Box Score Link */}
                    <div className="w-32 flex-shrink-0">
                      <Link
                        href={`/${sport}/games/${game.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-center"
                        style={{ background: "var(--psp-blue)", color: "#ffffff" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Box Score
                      </Link>
                    </div>
                  </div>

                  {/* Season Label */}
                  {game.seasons && (
                    <div className="text-xs text-gray-400 mt-2">
                      {game.seasons.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{
                  background: currentPage === 1 ? "#e5e7eb" : "var(--psp-navy)",
                  color: currentPage === 1 ? "#999" : "white",
                }}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className="px-3 py-2 rounded-lg text-sm font-semibold"
                      style={{
                        background:
                          pageNum === currentPage ? "var(--psp-gold)" : "#e5e7eb",
                        color:
                          pageNum === currentPage
                            ? "var(--psp-navy)"
                            : "#333",
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{
                  background:
                    currentPage === totalPages ? "#e5e7eb" : "var(--psp-navy)",
                  color: currentPage === totalPages ? "#999" : "white",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
