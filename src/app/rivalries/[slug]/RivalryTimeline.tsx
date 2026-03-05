'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Game {
  id: any;
  game_date: any;
  home_score: any;
  away_score: any;
  game_type?: any;
  playoff_round?: any;
  venue?: any;
  seasons?: any;
  home_school?: any;
  away_school?: any;
}

interface RivalryTimelineProps {
  games: Game[];
  schoolAId: number;
  schoolBId: number;
  sportId: string;
}

const DECADES = [
  { label: 'All Time', value: null },
  { label: '2020s', value: 2020 },
  { label: '2010s', value: 2010 },
  { label: '2000s', value: 2000 },
  { label: '1990s', value: 1990 },
];

export default function RivalryTimeline({
  games,
  schoolAId,
  schoolBId,
  sportId,
}: RivalryTimelineProps) {
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);

  // Filter games by decade
  const filteredGames = useMemo(() => {
    if (selectedDecade === null) return games;
    return games.filter((g: Game) => {
      const year = g.game_date ? parseInt(g.game_date.split('-')[0]) : 0;
      return year >= selectedDecade && year < selectedDecade + 10;
    });
  }, [games, selectedDecade]);

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No games found for this rivalry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Decade filter */}
      <div className="flex flex-wrap gap-2">
        {DECADES.map((decade) => (
          <button
            key={decade.label}
            onClick={() => setSelectedDecade(decade.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedDecade === decade.value
                ? 'bg-gold text-navy'
                : 'bg-navy-mid text-white border border-navy-mid hover:border-gold'
            }`}
          >
            {decade.label}
          </button>
        ))}
      </div>

      {/* Game list */}
      <div className="space-y-3">
        {filteredGames.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No games found in the {DECADES.find(d => d.value === selectedDecade)?.label} era.</p>
          </div>
        ) : (
          filteredGames.map((game: Game) => {
            const gameYear = game.game_date ? parseInt(game.game_date.split('-')[0]) : null;
            const gameMonth = game.game_date ? parseInt(game.game_date.split('-')[1]) : null;
            const gameDay = game.game_date ? parseInt(game.game_date.split('-')[2]) : null;

            // Determine winner
            const homeWon = (game.home_score ?? 0) > (game.away_score ?? 0);
            const awayWon = (game.away_score ?? 0) > (game.home_score ?? 0);
            const tied = game.home_score === game.away_score;

            // Format date
            const dateStr = gameYear && gameMonth && gameDay
              ? new Date(gameYear, gameMonth - 1, gameDay).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Date TBD';

            return (
              <div
                key={game.id}
                className="bg-navy-mid rounded-lg p-4 border border-navy-mid hover:border-gold transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Date & Season */}
                  <div className="flex-shrink-0 sm:w-24">
                    <div className="text-xs text-gray-400 mb-1">{dateStr}</div>
                    {game.seasons?.label && (
                      <div className="text-xs text-gray-500">{game.seasons.label}</div>
                    )}
                  </div>

                  {/* Score & Schools */}
                  <div className="flex-1 flex items-center gap-3 sm:gap-4">
                    {/* Home school */}
                    <div className="flex-1">
                      <Link
                        href={`/schools/${game.home_school?.slug}`}
                        className="text-sm font-semibold hover:text-gold transition-colors duration-200 line-clamp-1"
                      >
                        <span className={homeWon ? 'text-white' : 'text-gray-500'}>
                          {game.home_school?.short_name || game.home_school?.name}
                        </span>
                      </Link>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2 text-center min-w-fit">
                      <div
                        className={`px-3 py-1 rounded font-bold text-sm ${
                          homeWon
                            ? 'bg-gold text-navy'
                            : tied
                              ? 'bg-navy-mid text-white'
                              : 'bg-navy-mid text-gray-400'
                        }`}
                      >
                        {game.home_score}
                      </div>
                      <div className="text-gray-500 text-xs">-</div>
                      <div
                        className={`px-3 py-1 rounded font-bold text-sm ${
                          awayWon
                            ? 'bg-gold text-navy'
                            : tied
                              ? 'bg-navy-mid text-white'
                              : 'bg-navy-mid text-gray-400'
                        }`}
                      >
                        {game.away_score}
                      </div>
                    </div>

                    {/* Away school */}
                    <div className="flex-1 text-right">
                      <Link
                        href={`/schools/${game.away_school?.slug}`}
                        className="text-sm font-semibold hover:text-gold transition-colors duration-200 line-clamp-1"
                      >
                        <span className={awayWon ? 'text-white' : 'text-gray-500'}>
                          {game.away_school?.short_name || game.away_school?.name}
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Game type badges */}
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:justify-end">
                    {game.game_type === 'playoff' && (
                      <Badge variant="info" className="text-xs">
                        {game.playoff_round || 'Playoff'}
                      </Badge>
                    )}
                    {game.game_type === 'championship' && (
                      <Badge
                        variant="warning"
                        className="text-xs"
                      >
                        Championship
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Venue */}
                {game.venue && (
                  <div className="mt-2 pt-2 border-t border-navy text-xs text-gray-500">
                    {game.venue}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-400 text-center">
        Showing {filteredGames.length} of {games.length} games
      </div>
    </div>
  );
}
