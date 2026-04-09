'use client';

import React, { useState, useMemo } from 'react';
import { FootballGameTable, BasketballGameTable, type MergedGameEntry, formatDate, didPlayerWin, getOpponent } from './GameLogTables';

// Re-export MergedGameEntry for use in parent components
export type { MergedGameEntry };

export interface SeasonAward {
  id: number;
  award_name?: string;
  award_type?: string;
  category?: string;
  seasonLabel?: string;
}

export interface SeasonTotals {
  seasonLabel: string;
  passYards?: number | null;
  passTd?: number | null;
  rushYards?: number | null;
  rushTd?: number | null;
  recYards?: number | null;
  recTd?: number | null;
  points?: number | null;
}

export interface GameLogAccordionProps {
  games: MergedGameEntry[];
  awards: SeasonAward[];
  sport: string;
  playerSchoolId: number | null;
  playerName: string;
  playerPositions?: string[];
  /** Season-level stat totals (authoritative); used for collapsed-header summaries
   *  when the per-game log is incomplete for that season. Keyed by season label. */
  seasonTotals?: SeasonTotals[];
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

// Format stat display for season totals
function formatStatDisplay(value: number | null): string {
  if (value === null || value === 0) return '';
  return value.toLocaleString();
}

// Position-aware season summary for the collapsed header.
// Primary stats lead (prominent). Secondary stats render smaller via the
// `{ primary, secondary }` return shape.
// Prefers the authoritative season-level totals when available, falling back
// to a sum of the game log for that season.
function calculateFootballSeasonStats(
  seasonGames: MergedGameEntry[],
  playerPositions: string[],
  seasonTotal?: SeasonTotals,
): { primary: string; secondary: string } {
  let rushYards: number, rushTd: number;
  let passYards: number, passTd: number;
  let recYards: number, recTd: number;

  if (seasonTotal) {
    passYards = seasonTotal.passYards ?? 0;
    passTd = seasonTotal.passTd ?? 0;
    rushYards = seasonTotal.rushYards ?? 0;
    rushTd = seasonTotal.rushTd ?? 0;
    recYards = seasonTotal.recYards ?? 0;
    recTd = seasonTotal.recTd ?? 0;
  } else {
    rushYards = 0; rushTd = 0;
    passYards = 0; passTd = 0;
    recYards = 0; recTd = 0;
    for (const game of seasonGames) {
      if (!game.hasBoxScore) continue;
      rushYards += game.rushYards ?? 0;
      rushTd += game.rushTd ?? 0;
      passYards += game.passYards ?? 0;
      passTd += game.passTd ?? 0;
      recYards += game.recYards ?? 0;
      recTd += game.recTd ?? 0;
    }
  }

  const pri = (s: string) => s;
  const sec = (s: string) => s;

  // Only include a stat line if there's a meaningful positive yardage or TD.
  // Negative rushing yards alone (e.g. QB sacks) don't warrant a display line.
  const passStr = passYards > 0
    ? `${passYards.toLocaleString()} pass yds${passTd > 0 ? ` · ${passTd} TD` : ''}`
    : '';
  const rushStr = rushYards > 0 || rushTd > 0
    ? `${rushYards.toLocaleString()} rush yds${rushTd > 0 ? ` · ${rushTd} TD` : ''}`
    : '';
  const recStr = recYards > 0 || recTd > 0
    ? `${recYards.toLocaleString()} rec yds${recTd > 0 ? ` · ${recTd} TD` : ''}`
    : '';

  const posUpper = (playerPositions || []).map(p => p.toUpperCase());
  const isQB = posUpper.includes('QB');
  const isRB = posUpper.includes('RB');
  const isWR = posUpper.includes('WR') || posUpper.includes('TE');

  let primary = '';
  let secondaryParts: string[] = [];

  if (isQB && passStr) {
    primary = passStr;
    if (rushStr) secondaryParts.push(rushStr);
  } else if (isRB && rushStr) {
    primary = rushStr;
    if (recStr) secondaryParts.push(recStr);
  } else if (isWR && recStr) {
    primary = recStr;
    if (rushStr) secondaryParts.push(rushStr);
  } else {
    // Fallback: whichever yardage is biggest wins primary
    const buckets = [
      { str: passStr, val: passYards },
      { str: rushStr, val: rushYards },
      { str: recStr, val: recYards },
    ].sort((a, b) => b.val - a.val).filter(b => b.str);
    if (buckets.length > 0) {
      primary = buckets[0].str;
      secondaryParts = buckets.slice(1, 3).map(b => b.str);
    }
  }

  if (!primary) return { primary: 'No individual stats', secondary: '' };
  return { primary: pri(primary), secondary: sec(secondaryParts.join(' · ')) };
}

// Basketball season totals (only PTS + PPG available in game_player_stats)
function calculateBasketballSeasonStats(seasonGames: MergedGameEntry[]): { primary: string; secondary: string } {
  let totalPoints = 0;
  let boxScoreCount = 0;

  for (const game of seasonGames) {
    if (game.hasBoxScore && game.bbPoints !== null) {
      totalPoints += game.bbPoints;
      boxScoreCount++;
    }
  }

  if (boxScoreCount === 0) return { primary: 'No individual stats', secondary: '' };

  const ppg = (totalPoints / boxScoreCount).toFixed(1);
  return { primary: `${totalPoints.toLocaleString()} pts`, secondary: `${ppg} ppg · ${boxScoreCount} GP` };
}

export default function GameLogAccordion({
  games,
  awards,
  sport,
  playerSchoolId,
  playerName,
  playerPositions = [],
  seasonTotals = [],
}: GameLogAccordionProps) {
  const seasonTotalMap = useMemo(() => {
    const m = new Map<string, SeasonTotals>();
    for (const st of seasonTotals) m.set(st.seasonLabel, st);
    return m;
  }, [seasonTotals]);
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
      <div className="py-8 px-4 text-center text-gray-400">
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
          <p className="text-sm text-gray-400 mt-1">
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
              ? calculateFootballSeasonStats(seasonGames, playerPositions, seasonTotalMap.get(season))
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 transition-transform duration-200"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  >
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

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
                  className="ml-4 font-normal flex-shrink-0 whitespace-nowrap text-right leading-tight"
                >
                  <div className="text-sm" style={{ color: 'var(--psp-gold)' }}>
                    {seasonStatDisplay.primary}
                  </div>
                  {seasonStatDisplay.secondary && (
                    <div className="text-[11px] mt-0.5 opacity-70" style={{ color: 'var(--psp-gold)' }}>
                      {seasonStatDisplay.secondary}
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 py-4" style={{ background: 'var(--psp-navy-mid)' }}>
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

