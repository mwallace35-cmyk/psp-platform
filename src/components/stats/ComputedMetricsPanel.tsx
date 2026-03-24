'use client';

import React from 'react';
import {
  calculateYardsPerCarry,
  calculateYardsPerAttempt,
  calculatePasserEfficiency,
  calculateYardsPerReception,
  calculateCompletionPercentage,
  calculatePointsPerGame,
  calculateReboundsPerGame,
  calculateAssistsPerGame,
  formatRateStat,
  formatPercentage,
} from '@/lib/stats/computed-metrics';
import {
  getStatReliability,
  getConfidenceScore,
  getConfidenceIndicator,
  getSmallSampleWarning,
  assessReliability,
} from '@/lib/stats/confidence';
import type { SportId } from '@/lib/sports';
import StatTooltip from '@/components/ui/StatTooltip';

interface FootballStats {
  rush_yards?: number | null;
  rushing_attempts?: number | null;
  pass_yards?: number | null;
  passing_attempts?: number | null;
  completions?: number | null;
  rec_yards?: number | null;
  receptions?: number | null;
  pass_td?: number | null;
  interceptions?: number | null;
  games_played?: number | null;
}

interface BasketballStats {
  points?: number | null;
  rebounds?: number | null;
  assists?: number | null;
  games_played?: number | null;
}

interface ComputedMetricsPanelProps {
  stats: FootballStats | BasketballStats;
  sport: SportId;
  playerName?: string;
}

/**
 * Displays computed/derived statistics with confidence indicators
 *
 * Shows:
 * - Calculated metrics (YPC, PPG, completion %, etc.)
 * - Era-adjusted context (where applicable)
 * - Confidence badges based on sample size
 * - "Insufficient data" messages when appropriate
 */
export default function ComputedMetricsPanel({
  stats,
  sport,
  playerName,
}: ComputedMetricsPanelProps) {
  const gamesPlayed = (stats as any).games_played || 0;
  const reliability = getStatReliability(gamesPlayed, sport);
  const confidenceIndicator = getConfidenceIndicator(gamesPlayed, sport);
  const warning = getSmallSampleWarning(gamesPlayed, sport);
  const assessment = assessReliability(gamesPlayed, sport);

  // Football metrics
  const footballMetrics: Array<{
    label: string;
    tooltip: string;
    value: number | null;
    unit: string;
  }> = [];

  if (sport === 'football') {
    const fb = stats as FootballStats;

    // Yards per carry (rushing)
    if (
      fb.rush_yards !== null &&
      fb.rushing_attempts !== null &&
      fb.rushing_attempts! > 0
    ) {
      const ypc = calculateYardsPerCarry(fb.rush_yards, fb.rushing_attempts!);
      if (ypc !== null) {
        footballMetrics.push({
          label: 'Yards Per Carry',
          tooltip: 'Average rushing yards per carry',
          value: ypc,
          unit: 'YPC',
        });
      }
    }

    // Yards per attempt (passing)
    if (
      fb.pass_yards !== null &&
      fb.passing_attempts !== null &&
      fb.passing_attempts! > 0
    ) {
      const ypa = calculateYardsPerAttempt(fb.pass_yards, fb.passing_attempts!);
      if (ypa !== null) {
        footballMetrics.push({
          label: 'Yards Per Attempt',
          tooltip: 'Average passing yards per pass attempt',
          value: ypa,
          unit: 'YPA',
        });
      }
    }

    // Completion percentage
    if (
      fb.completions !== null &&
      fb.passing_attempts !== null &&
      fb.passing_attempts! > 0
    ) {
      const cmp = calculateCompletionPercentage(fb.completions, fb.passing_attempts!);
      if (cmp !== null) {
        footballMetrics.push({
          label: 'Completion %',
          tooltip: 'Percentage of passes completed',
          value: cmp,
          unit: '%',
        });
      }
    }

    // Passer efficiency (if we have all components)
    if (
      fb.pass_yards !== null &&
      fb.pass_td !== null &&
      fb.completions !== null &&
      fb.interceptions !== null &&
      fb.passing_attempts !== null &&
      fb.passing_attempts! > 0
    ) {
      const pe = calculatePasserEfficiency(
        fb.pass_yards,
        fb.pass_td,
        fb.completions,
        fb.interceptions,
        fb.passing_attempts!
      );
      if (pe !== null) {
        footballMetrics.push({
          label: 'Passer Efficiency',
          tooltip: 'NCAA passer efficiency rating',
          value: pe,
          unit: 'Rating',
        });
      }
    }

    // Yards per reception
    if (
      fb.rec_yards !== null &&
      fb.receptions !== null &&
      fb.receptions! > 0
    ) {
      const ypr = calculateYardsPerReception(fb.rec_yards, fb.receptions!!);
      if (ypr !== null) {
        footballMetrics.push({
          label: 'Yards Per Reception',
          tooltip: 'Average receiving yards per reception',
          value: ypr,
          unit: 'YPR',
        });
      }
    }
  }

  // Basketball metrics
  const basketballMetrics: Array<{
    label: string;
    tooltip: string;
    value: number | null;
    unit: string;
  }> = [];

  if (sport === 'basketball') {
    const bb = stats as BasketballStats;

    // Points per game
    if (bb.points !== null && bb.games_played !== null && bb.games_played! > 0) {
      const ppg = calculatePointsPerGame(bb.points, bb.games_played!);
      if (ppg !== null) {
        basketballMetrics.push({
          label: 'Points Per Game',
          tooltip: 'Average points scored per game',
          value: ppg,
          unit: 'PPG',
        });
      }
    }

    // Rebounds per game
    if (
      bb.rebounds !== null &&
      bb.games_played !== null &&
      bb.games_played! > 0
    ) {
      const rpg = calculateReboundsPerGame(bb.rebounds, bb.games_played!);
      if (rpg !== null) {
        basketballMetrics.push({
          label: 'Rebounds Per Game',
          tooltip: 'Average rebounds per game',
          value: rpg,
          unit: 'RPG',
        });
      }
    }

    // Assists per game
    if (
      bb.assists !== null &&
      bb.games_played !== null &&
      bb.games_played! > 0
    ) {
      const apg = calculateAssistsPerGame(bb.assists, bb.games_played!);
      if (apg !== null) {
        basketballMetrics.push({
          label: 'Assists Per Game',
          tooltip: 'Average assists per game',
          value: apg,
          unit: 'APG',
        });
      }
    }
  }

  const metrics = sport === 'football' ? footballMetrics : basketballMetrics;

  // If no metrics computed, show "Insufficient Data"
  if (metrics.length === 0) {
    return (
      <div
        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
        role="region"
        aria-label="Computed metrics"
      >
        <h3 className="text-lg font-bold text-[var(--psp-navy)] mb-4">
          Computed Metrics
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">
            Insufficient data to compute derived metrics
          </p>
          {warning && (
            <p className="text-yellow-700 text-xs mt-2 flex items-center justify-center gap-1">
              <span>⚠️</span>
              {warning}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Performance assessment helper
  const getPerformanceLevel = (value: number, metric: string): string => {
    // These are rough thresholds for high school football/basketball
    if (metric === 'YPC') {
      if (value >= 7) return 'Elite';
      if (value >= 5.5) return 'Above Average';
      if (value >= 4) return 'Average';
      return 'Below Average';
    }
    if (metric === 'PPG') {
      if (value >= 20) return 'Elite';
      if (value >= 15) return 'Above Average';
      if (value >= 10) return 'Average';
      return 'Below Average';
    }
    if (metric === 'YPA') {
      if (value >= 8) return 'Elite';
      if (value >= 6.5) return 'Above Average';
      if (value >= 5) return 'Average';
      return 'Below Average';
    }
    if (metric === '%') {
      if (value >= 65) return 'Elite';
      if (value >= 55) return 'Above Average';
      if (value >= 45) return 'Average';
      return 'Below Average';
    }
    return 'Data Insufficient';
  };

  return (
    <div
      className="bg-gradient-to-br from-[#0a1628]/5 to-[#3b82f6]/5 rounded-lg p-6 border border-[var(--psp-navy)]/10"
      role="region"
      aria-label="Computed metrics"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[var(--psp-navy)]">
            Computed Metrics
          </h3>
          <span
            className="text-lg"
            title={`Confidence: ${reliability} (${gamesPlayed} games)`}
          >
            {confidenceIndicator}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            Based on {gamesPlayed} game{gamesPlayed !== 1 ? 's' : ''}
          </p>
          <p className="text-xs font-medium text-[var(--psp-navy)]">
            {assessment.level === 'high' && '✅ Reliable'}
            {assessment.level === 'medium' && '🟢 Medium Confidence'}
            {assessment.level === 'low' && '🟡 Low Confidence'}
            {assessment.level === 'insufficient' && '🔴 Preliminary'}
          </p>
        </div>
      </div>

      {/* Small sample warning */}
      {warning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6 flex gap-2">
          <span className="text-yellow-700 text-sm flex-1">
            <strong>⚠️ Note:</strong> {warning}
          </span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-md p-4 border border-gray-200 hover:border-[var(--psp-gold)]/50 hover:shadow-md transition-all"
          >
            {/* Metric Label with Tooltip */}
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                <StatTooltip abbr={metric.unit} definition={metric.tooltip} />
                {' '}
                <span className="ml-1">{metric.label}</span>
              </label>
            </div>

            {/* Value */}
            <div className="mb-3">
              <p className="text-3xl font-bold text-[var(--psp-navy)]">
                {metric.unit === '%'
                  ? formatPercentage(metric.value)
                  : formatRateStat(metric.value)}
              </p>
            </div>

            {/* Performance Level */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {getPerformanceLevel(metric.value || 0, metric.unit)}
                </p>
              </div>
              {reliability !== 'insufficient' && (
                <div
                  className={`w-2 h-2 rounded-full ${
                    reliability === 'high'
                      ? 'bg-green-500'
                      : reliability === 'medium'
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                  }`}
                  title={`${reliability} confidence`}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assessment note */}
      {reliability !== 'high' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            <strong>Assessment:</strong> {assessment.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
