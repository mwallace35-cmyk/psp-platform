'use client';

import React from 'react';
import Link from 'next/link';
import { getSchoolDisplayName } from '@/lib/utils/schoolDisplayName';

interface School {
  name: string;
  slug?: string;
  city?: string | null;
  league_id?: number | null;
}

interface Game {
  id: number;
  game_date?: string | null;
  home_school?: School | null;
  away_school?: School | null;
  home_score?: number | null;
  away_score?: number | null;
  league?: string;
}

interface WeeklyMatchupsProps {
  games: Game[];
  sport: string;
  sportColor: string;
}

const WeeklyMatchups: React.FC<WeeklyMatchupsProps> = ({ games, sport, sportColor }) => {
  const leagueColors: Record<string, string> = {
    'Catholic': '#7c3aed',
    'Public': '#16a34a',
    'Inter-Ac': '#06b6d4',
    'SOL': '#f59e0b',
    'Central': '#ea580c',
    'Del Val': '#dc2626',
  };

  const getLeagueColor = (league?: string): string => {
    if (!league) return sportColor;
    return leagueColors[league] || sportColor;
  };

  const hasScore = (game: Game): boolean => {
    return (
      game.home_score !== null &&
      game.home_score !== undefined &&
      game.away_score !== null &&
      game.away_score !== undefined
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <h2
        className="psp-h2"
        style={{
          marginBottom: '20px',
        }}
      >
        This Week in Philly {sport}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          '@media (max-width: 640px)': {
            gridTemplateColumns: '1fr',
          },
        } as React.CSSProperties & { '@media (max-width: 640px)': Record<string, string> }}
      >
        {games.map((game, index) => {
          const leagueColor = getLeagueColor(game.league);
          const homeTeam = game.home_school ? getSchoolDisplayName(game.home_school) : 'Home Team';
          const awayTeam = game.away_school ? getSchoolDisplayName(game.away_school) : 'Away Team';
          const scored = hasScore(game);

          return (
            <Link
              key={game.id}
              href={`/${sport}/games/${game.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid var(--g100, #e5e7eb)',
                borderRadius: '6px',
                padding: '12px 14px',
                position: 'relative',
                borderLeft: `4px solid ${leagueColor}`,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              {/* Game of the Week Badge */}
              {index === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '12px',
                    backgroundColor: '#D4A843',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase',
                  }}
                >
                  Game of the Week
                </div>
              )}

              {/* League Tag */}
              {game.league && (
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: leagueColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    marginBottom: '8px',
                  }}
                >
                  {game.league}
                </div>
              )}

              {/* Away Team */}
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    marginBottom: '4px',
                  }}
                >
                  {awayTeam}
                </div>
                {scored && (
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1A2744',
                    }}
                  >
                    {game.away_score}
                  </div>
                )}
              </div>

              {/* Home Team */}
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    marginBottom: '4px',
                  }}
                >
                  {homeTeam}
                </div>
                {scored && (
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1A2744',
                    }}
                  >
                    {game.home_score}
                  </div>
                )}
              </div>

              {/* Game Date */}
              {game.game_date && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #f3f4f6',
                  }}
                >
                  {new Date(game.game_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              )}
            </div>
            </Link>
          );
        })}
      </div>

      {games.length === 0 && (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid var(--g100, #e5e7eb)',
            borderRadius: '6px',
            padding: '32px',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          <p style={{ fontSize: '14px', margin: '0' }}>
            No matchups scheduled this week in {sport}.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyMatchups;
