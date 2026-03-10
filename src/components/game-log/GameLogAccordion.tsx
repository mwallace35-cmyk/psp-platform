'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Interfaces
export interface MergedGameEntry {
  gameId: number;
  gameDate: string | null;
  seasonLabel: string | null;
  homeSchoolId: number | null;
  awaySchoolId: number | null;
  homeScore: number | null;
  awayScore: number | null;
  homeSchool: { id: number; name: string; slug: string } | null;
  awaySchool: { id: number; name: string; slug: string } | null;
  hasBoxScore: boolean;
  rushYards: number | null;
  passYards: number | null;
  recYards: number | null;
  points: number | null;
  bbPoints: number | null;
}

export interface SeasonAward {
  id: number;
  award_name?: string;
  award_type?: string;
  category?: string;
  seasonLabel?: string;
}

export interface GameLogAccordionProps {
  games: MergedGameEntry[];
  awards: SeasonAward[];
  sport: string;
  playerSchoolId: number | null;
  playerName: string;
}

// Helper function to format award category
function formatCategory(category: string | undefined): string {
  if (!category) return '';
  const mapping: { [key: string]: string } = {
    'first-team': '1st Team',
    'second-team': '2nd Team',
    'third-team': '3rd Team',
    'honorable-mention': 'HM',
  };
  return mapping[category.toLowerCase()] || category;
}

// Helper function to get award badge color
interface AwardBadgeStyle {
  bg: string;
  text: string;
}

function getAwardBadgeStyle(awardType: string, awardName: string): AwardBadgeStyle {
  const type = awardType.toLowerCase();
  const name = awardName.toLowerCase();

  // Prestige hierarchy: highest → lowest
  if (type === 'all-american' || name.includes('all-american'))
    return { bg: '#f0a500', text: '#0a1628' };       // Gold/Navy — highest honor
  if (type === 'all-state' || name.includes('all-state'))
    return { bg: '#dc2626', text: 'white' };          // Red/White
  if (type === 'all-city' || name.includes('all-city'))
    return { bg: '#0a1628', text: '#f0a500' };        // Navy/Gold
  if (type === 'mvp' || name.includes('mvp') || name.includes('player of the year'))
    return { bg: '#f0a500', text: '#0a1628' };        // Gold/Navy — MVP level
  if (type === 'all-catholic' || name.includes('all-catholic'))
    return { bg: '#581c87', text: 'white' };          // Dark Purple
  if (type === 'all-public' || name.includes('all-public'))
    return { bg: '#3b82f6', text: 'white' };          // Blue
  if (type === 'all-inter-ac' || name.includes('all-inter-ac'))
    return { bg: '#059669', text: 'white' };          // Green

  return { bg: '#6b7280', text: 'white' };            // Gray — fallback
}

// Group games by season
function groupGamesBySeason(games: MergedGameEntry[]): { [key: string]: MergedGameEntry[] } {
  const grouped: { [key: string]: MergedGameEntry[] } = {};

  for (const game of games) {
    const season = game.seasonLabel || 'Unknown Season';
    if (!grouped[season]) {
      grouped[season] = [];
    }
    grouped[season].push(game);
  }

  return grouped;
}

// Determine if player's school won
function didPlayerWin(game: MergedGameEntry, playerSchoolId: number | null): boolean | null {
  if (!playerSchoolId || game.homeScore === null || game.awayScore === null) {
    return null;
  }

  if (game.homeSchoolId === playerSchoolId) {
    return game.homeScore > game.awayScore;
  } else if (game.awaySchoolId === playerSchoolId) {
    return game.awayScore > game.homeScore;
  }

  return null;
}

// Calculate season W-L record
function calculateWLRecord(games: MergedGameEntry[], playerSchoolId: number | null): { wins: number; losses: number } {
  let wins = 0;
  let losses = 0;

  for (const game of games) {
    const won = didPlayerWin(game, playerSchoolId);
    if (won === true) wins++;
    else if (won === false) losses++;
  }

  return { wins, losses };
}

// Format date
function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'N/A';
  }
}

// Get opponent info
function getOpponent(game: MergedGameEntry, playerSchoolId: number | null) {
  const isHome = game.homeSchoolId === playerSchoolId;
  const opponent = isHome ? game.awaySchool : game.homeSchool;
  return opponent;
}

// Format stat display for season totals
function formatStatDisplay(value: number | null): string {
  if (value === null || value === 0) return '';
  return value.toLocaleString();
}

// Calculate season stat totals (football)
function calculateFootballSeasonStats(seasonGames: MergedGameEntry[]) {
  let rushYards = 0;
  let passYards = 0;
  let recYards = 0;
  let points = 0;
  let boxScoreCount = 0;

  for (const game of seasonGames) {
    if (game.hasBoxScore) {
      boxScoreCount++;
      if (game.rushYards) rushYards += game.rushYards;
      if (game.passYards) passYards += game.passYards;
      if (game.recYards) recYards += game.recYards;
      if (game.points) points += game.points;
    }
  }

  const stats: string[] = [];
  if (rushYards > 0) stats.push(`${rushYards.toLocaleString()} rush`);
  if (passYards > 0) stats.push(`${passYards.toLocaleString()} pass`);
  if (recYards > 0) stats.push(`${recYards.toLocaleString()} rec`);
  if (points > 0) stats.push(`${points} pts`);

  if (stats.length === 0) return 'No individual stats';
  return stats.join(' · ');
}

// Calculate season stat totals (basketball)
function calculateBasketballSeasonStats(seasonGames: MergedGameEntry[]) {
  let totalPoints = 0;
  let boxScoreCount = 0;

  for (const game of seasonGames) {
    if (game.hasBoxScore && game.bbPoints !== null) {
      totalPoints += game.bbPoints;
      boxScoreCount++;
    }
  }

  if (boxScoreCount === 0) return 'No individual stats';

  const ppg = (totalPoints / boxScoreCount).toFixed(1);
  return `${totalPoints} pts · ${ppg} ppg`;
}

export default function GameLogAccordion({
  games,
  awards,
  sport,
  playerSchoolId,
  playerName,
}: GameLogAccordionProps) {
  const groupedGames = useMemo(() => groupGamesBySeason(games), [games]);
  const seasonOrder = useMemo(() => Object.keys(groupedGames), [groupedGames]);
  const [expandedSeason, setExpandedSeason] = useState<string | null>(
    seasonOrder.length > 0 ? seasonOrder[0] : null
  );

  const totalBoxScoreGames = useMemo(() => {
    return games.filter((g) => g.hasBoxScore).length;
  }, [games]);

  // Create a map of season → awards
  const seasonAwardsMap = useMemo(() => {
    const map: { [season: string]: SeasonAward[] } = {};
    for (const award of awards) {
      const season = award.seasonLabel || 'Unknown';
      if (!map[season]) map[season] = [];
      map[season].push(award);
    }
    return map;
  }, [awards]);

  if (games.length === 0) {
    return (
      <div className="py-8 px-4 text-center text-gray-500">
        No game log available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Header */}
      <div>
        <h2 className="font-bebas text-2xl tracking-wider" style={{ color: 'var(--psp-navy)' }}>
          Game Log ({games.length} games)
        </h2>
        {totalBoxScoreGames < games.length && (
          <p className="text-sm text-gray-600 mt-1">
            Individual stats available for {totalBoxScoreGames} of {games.length} games
          </p>
        )}
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {seasonOrder.map((season) => {
          const seasonGames = groupedGames[season];
          const isExpanded = expandedSeason === season;
          const { wins, losses } = calculateWLRecord(seasonGames, playerSchoolId);
          const seasonAwards = seasonAwardsMap[season] || [];
          const seasonStatDisplay =
            sport === 'football'
              ? calculateFootballSeasonStats(seasonGames)
              : calculateBasketballSeasonStats(seasonGames);

          return (
            <div key={season} className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Season Header Button */}
              <button
                onClick={() => setExpandedSeason(isExpanded ? null : season)}
                aria-expanded={isExpanded}
                className="w-full text-left px-4 py-4 flex items-center justify-between font-bebas tracking-wider transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: 'var(--psp-navy)',
                  color: 'var(--psp-gold)',
                  borderLeft: '4px solid var(--psp-gold)',
                }}
              >
                {/* Chevron + Season Label + W-L + Awards + Stats */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Chevron */}
                  <span
                    className="flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: 'var(--psp-gold)',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▸
                  </span>

                  {/* Season Label + W-L */}
                  <div className="flex-shrink-0">
                    <span className="text-lg">{season}</span>
                    <span className="ml-3 text-sm opacity-90">
                      {wins}-{losses}
                    </span>
                  </div>

                  {/* Awards Pills */}
                  <div className="flex gap-2 flex-wrap flex-shrink-0">
                    {seasonAwards.map((award) => {
                      const style = getAwardBadgeStyle(award.award_type || '', award.award_name || '');
                      const displayName = award.award_name || award.award_type || 'Award';
                      const categoryLabel = award.category ? formatCategory(award.category) : '';
                      const badgeText = categoryLabel ? `${displayName} ${categoryLabel}` : displayName;

                      return (
                        <span
                          key={award.id}
                          className="text-xs px-2 py-1 rounded whitespace-nowrap"
                          style={{
                            backgroundColor: style.bg,
                            color: style.text,
                          }}
                        >
                          {badgeText}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Season Stats (right side) */}
                <div
                  className="ml-4 text-sm font-normal flex-shrink-0 whitespace-nowrap"
                  style={{ color: 'var(--psp-gold)' }}
                >
                  {seasonStatDisplay}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 py-4 bg-white">
                  {sport === 'football' ? (
                    <FootballGameTable
                      games={seasonGames}
                      playerSchoolId={playerSchoolId}
                      sport={sport}
                    />
                  ) : (
                    <BasketballGameTable
                      games={seasonGames}
                      playerSchoolId={playerSchoolId}
                      sport={sport}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Football Game Table
function FootballGameTable({
  games,
  playerSchoolId,
  sport,
}: {
  games: MergedGameEntry[];
  playerSchoolId: number | null;
  sport: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Date
            </th>
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Opponent
            </th>
            <th className="text-center px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Score
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Rush Yds
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Pass Yds
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Rec Yds
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              PTS
            </th>
            <th className="text-center px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const opponent = getOpponent(game, playerSchoolId);
            const won = didPlayerWin(game, playerSchoolId);
            const scoreColor = won === true ? 'var(--psp-blue)' : won === false ? '#dc2626' : 'var(--psp-gray-500)';

            const isHome = game.homeSchoolId === playerSchoolId;
            const prefix = isHome ? 'vs' : 'at';
            const teamScore = isHome ? game.homeScore : game.awayScore;
            const oppScore = isHome ? game.awayScore : game.homeScore;
            const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : '—';

            return (
              <tr
                key={game.gameId}
                className={`border-b border-gray-200 hover:bg-gray-50 ${!game.hasBoxScore ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-3 text-xs text-gray-500">{formatDate(game.gameDate)}</td>
                <td className="px-3 py-3 text-xs">
                  {opponent ? (
                    <Link
                      href={`/${sport}/schools/${opponent.slug}`}
                      className="hover:underline"
                      style={{ color: 'var(--psp-blue)' }}
                    >
                      {prefix} {opponent.name}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </td>
                <td className="text-center px-3 py-3 text-xs whitespace-nowrap">
                  {won !== null ? (
                    <span className={won ? 'font-bold text-green-700' : 'text-red-600'}>
                      {won ? 'W' : 'L'} {scoreStr}
                    </span>
                  ) : scoreStr}
                </td>
                {game.hasBoxScore ? (
                  <>
                    <td className="text-right px-3 py-3">{game.rushYards ?? '—'}</td>
                    <td className="text-right px-3 py-3">{game.passYards ?? '—'}</td>
                    <td className="text-right px-3 py-3">{game.recYards ?? '—'}</td>
                    <td className="text-right px-3 py-3 font-bold">{game.points ?? '—'}</td>
                  </>
                ) : (
                  <td colSpan={4} className="text-center text-xs text-gray-400 italic px-3 py-3">no individual stats</td>
                )}
                <td className="text-center px-3 py-3">
                  {game.hasBoxScore ? (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded"
                      style={{ background: 'var(--psp-blue)', color: 'white' }}
                    >
                      Box Score
                    </Link>
                  ) : (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded border"
                      style={{ borderColor: 'var(--psp-gray-300)', color: 'var(--psp-gray-500)' }}
                    >
                      Details
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Basketball Game Table
function BasketballGameTable({
  games,
  playerSchoolId,
  sport,
}: {
  games: MergedGameEntry[];
  playerSchoolId: number | null;
  sport: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Date
            </th>
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Opponent
            </th>
            <th className="text-center px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Score
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              PTS
            </th>
            <th className="text-center px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const opponent = getOpponent(game, playerSchoolId);
            const won = didPlayerWin(game, playerSchoolId);
            const isHome = game.homeSchoolId === playerSchoolId;
            const prefix = isHome ? 'vs' : 'at';
            const teamScore = isHome ? game.homeScore : game.awayScore;
            const oppScore = isHome ? game.awayScore : game.homeScore;
            const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : '—';

            return (
              <tr
                key={game.gameId}
                className={`border-b border-gray-200 hover:bg-gray-50 ${!game.hasBoxScore ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-3 text-xs text-gray-500">{formatDate(game.gameDate)}</td>
                <td className="px-3 py-3 text-xs">
                  {opponent ? (
                    <Link
                      href={`/${sport}/schools/${opponent.slug}`}
                      className="hover:underline"
                      style={{ color: 'var(--psp-blue)' }}
                    >
                      {prefix} {opponent.name}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </td>
                <td className="text-center px-3 py-3 text-xs whitespace-nowrap">
                  {won !== null ? (
                    <span className={won ? 'font-bold text-green-700' : 'text-red-600'}>
                      {won ? 'W' : 'L'} {scoreStr}
                    </span>
                  ) : scoreStr}
                </td>
                <td className="text-right px-3 py-3 font-bold">
                  {game.hasBoxScore ? (game.bbPoints ?? '—') : <span className="text-gray-400 font-normal italic text-xs">—</span>}
                </td>
                <td className="text-center px-3 py-3">
                  {game.hasBoxScore ? (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded"
                      style={{ background: 'var(--psp-blue)', color: 'white' }}
                    >
                      Box Score
                    </Link>
                  ) : (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded border"
                      style={{ borderColor: 'var(--psp-gray-300)', color: 'var(--psp-gray-500)' }}
                    >
                      Details
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
