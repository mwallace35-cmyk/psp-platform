'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { SPORT_META, VALID_SPORTS, type SportId } from '@/lib/sports';

export interface GameData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  gameDate: string;
  sportId: SportId;
  gameType?: 'Regular' | 'Playoff' | 'Championship';
}

export interface RecentGamesSectionProps {
  games: GameData[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Today';
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function GameCard({ game }: { game: GameData }) {
  const isHomeWin = game.homeScore > game.awayScore;
  const sportMeta = SPORT_META[game.sportId];
  const gameTypeBadgeColor =
    game.gameType === 'Championship'
      ? 'bg-[var(--psp-gold)]/20 text-[var(--psp-gold)]'
      : game.gameType === 'Playoff'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-gray-100 text-gray-700';

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 bg-white [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-md transition-shadow">
      {/* Header with sport badge and game type */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2">
          <span className="text-lg">{sportMeta.emoji}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
            {sportMeta.name}
          </span>
        </div>
        {game.gameType && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${gameTypeBadgeColor}`}>
            {game.gameType}
          </span>
        )}
      </div>

      {/* Score display */}
      <div className="flex items-center justify-between gap-4">
        {/* Home team */}
        <div className="flex-1">
          <div
            className={`text-sm font-semibold truncate ${
              isHomeWin
                ? 'text-[var(--psp-navy)] [data-theme=dark]:text-white'
                : 'text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]'
            }`}
          >
            {game.homeTeam}
          </div>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="text-right">
            <div
              className={`text-xl sm:text-2xl font-bold ${
                isHomeWin
                  ? 'text-[var(--psp-gold)]'
                  : 'text-[var(--psp-navy)] [data-theme=dark]:text-white'
              }`}
            >
              {game.homeScore}
            </div>
          </div>
          <div className="text-[var(--psp-gray-400)] font-light">-</div>
          <div className="text-right">
            <div
              className={`text-xl sm:text-2xl font-bold ${
                !isHomeWin
                  ? 'text-[var(--psp-gold)]'
                  : 'text-[var(--psp-navy)] [data-theme=dark]:text-white'
              }`}
            >
              {game.awayScore}
            </div>
          </div>
        </div>
      </div>

      {/* Away team */}
      <div className="flex items-center">
        <div
          className={`text-sm font-semibold truncate ${
            !isHomeWin
              ? 'text-[var(--psp-navy)] [data-theme=dark]:text-white'
              : 'text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]'
          }`}
        >
          {game.awayTeam}
        </div>
      </div>

      {/* Footer with date */}
      <div className="pt-2 border-t border-[var(--psp-gray-100)] [data-theme=dark]:border-[var(--psp-navy)] text-xs text-[var(--psp-gray-500)] [data-theme=dark]:text-[var(--psp-gray-400)]">
        {formatDate(game.gameDate)}
      </div>
    </div>
  );
}

export default function RecentGamesSection({ games }: RecentGamesSectionProps) {
  const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all');

  const filteredGames = useMemo(() => {
    if (selectedSport === 'all') {
      return games.slice(0, 6);
    }
    return games.filter((game) => game.sportId === selectedSport).slice(0, 6);
  }, [games, selectedSport]);

  const uniqueSports = useMemo(() => {
    return Array.from(new Set(games.map((g) => g.sportId)));
  }, [games]);

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[var(--psp-navy)] [data-theme=dark]:bg-[var(--psp-navy)]/80">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-bebas tracking-wide mb-4 sm:mb-6">
            Recent Scores
          </h2>

          {/* Sport filter tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                selectedSport === 'all'
                  ? 'bg-[var(--psp-gold)] text-[var(--psp-navy)]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              All Sports
            </button>

            {uniqueSports.map((sport) => {
              const meta = SPORT_META[sport];
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all flex items-center gap-2 ${
                    selectedSport === sport
                      ? 'bg-[var(--psp-gold)] text-[var(--psp-navy)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{meta.emoji}</span>
                  {meta.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Games grid */}
        {filteredGames.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {/* View all link */}
            <div className="text-center">
              <Link
                href="/search?view=recent-scores"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[var(--psp-navy)] font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                View All Scores
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12 text-white/70">
            <p>No games found for the selected sport.</p>
          </div>
        )}
      </div>
    </section>
  );
}
