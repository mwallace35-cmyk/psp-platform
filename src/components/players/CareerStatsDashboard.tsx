'use client';

import React from 'react';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'flat' | null;
  subtitle?: string;
}

interface Props {
  sport: string;
  stats: Record<string, unknown>[];
}

function formatNum(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

function getTrend(seasons: Record<string, unknown>[], key: string): 'up' | 'down' | 'flat' | null {
  if (seasons.length < 2) return null;
  const sorted = [...seasons].sort((a, b) => {
    const aYear = (a.seasons as any)?.year_start ?? 0;
    const bYear = (b.seasons as any)?.year_start ?? 0;
    return aYear - bYear;
  });
  const last = Number(sorted[sorted.length - 1]?.[key] ?? 0);
  const prev = Number(sorted[sorted.length - 2]?.[key] ?? 0);
  if (last > prev * 1.05) return 'up';
  if (last < prev * 0.95) return 'down';
  return 'flat';
}

function buildFootballCards(stats: Record<string, unknown>[]): StatCard[] {
  type FBTotals = { gp: number; rushYds: number; rushTd: number; passYds: number; passTd: number; recYds: number; recTd: number; totalTd: number };
  const totals = stats.reduce<FBTotals>(
    (acc, s) => ({
      gp: acc.gp + (Number(s.games_played) || 0),
      rushYds: acc.rushYds + (Number(s.rush_yards) || 0),
      rushTd: acc.rushTd + (Number(s.rush_td) || 0),
      passYds: acc.passYds + (Number(s.pass_yards) || 0),
      passTd: acc.passTd + (Number(s.pass_td) || 0),
      recYds: acc.recYds + (Number(s.rec_yards) || 0),
      recTd: acc.recTd + (Number(s.rec_td) || 0),
      totalTd: acc.totalTd + (Number(s.total_td) || 0),
    }),
    { gp: 0, rushYds: 0, rushTd: 0, passYds: 0, passTd: 0, recYds: 0, recTd: 0, totalTd: 0 }
  );

  const cards: StatCard[] = [];
  if (totals.rushYds > 0) {
    cards.push({ label: 'Rush Yards', value: formatNum(totals.rushYds), icon: '\uD83C\uDFC3', trend: getTrend(stats, 'rush_yards') });
    cards.push({ label: 'Rush TDs', value: totals.rushTd, icon: '\uD83C\uDFC8', trend: getTrend(stats, 'rush_td') });
  }
  if (totals.passYds > 0) {
    cards.push({ label: 'Pass Yards', value: formatNum(totals.passYds), icon: '\uD83C\uDFAF', trend: getTrend(stats, 'pass_yards') });
    cards.push({ label: 'Pass TDs', value: totals.passTd, icon: '\u2B50', trend: getTrend(stats, 'pass_td') });
  }
  if (totals.recYds > 0) {
    cards.push({ label: 'Rec Yards', value: formatNum(totals.recYds), icon: '\uD83D\uDC4B', trend: getTrend(stats, 'rec_yards') });
    cards.push({ label: 'Rec TDs', value: totals.recTd, icon: '\uD83D\uDD25', trend: getTrend(stats, 'rec_td') });
  }
  cards.push({ label: 'Total TDs', value: totals.totalTd, icon: '\uD83D\uDCA5' });
  cards.push({ label: 'Games', value: totals.gp, icon: '\uD83D\uDCC5', subtitle: `${stats.length} season${stats.length > 1 ? 's' : ''}` });

  return cards;
}

function buildBasketballCards(stats: Record<string, unknown>[]): StatCard[] {
  type BBTotals = { gp: number; pts: number; reb: number; ast: number; stl: number; blk: number };
  const totals = stats.reduce<BBTotals>(
    (acc, s) => ({
      gp: acc.gp + (Number(s.games_played) || 0),
      pts: acc.pts + (Number(s.points) || 0),
      reb: acc.reb + (Number(s.rebounds) || 0),
      ast: acc.ast + (Number(s.assists) || 0),
      stl: acc.stl + (Number(s.steals) || 0),
      blk: acc.blk + (Number(s.blocks) || 0),
    }),
    { gp: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 }
  );

  const ppg = totals.gp > 0 ? (totals.pts / totals.gp).toFixed(1) : '0.0';
  const rpg = totals.gp > 0 ? (totals.reb / totals.gp).toFixed(1) : '0.0';
  const apg = totals.gp > 0 ? (totals.ast / totals.gp).toFixed(1) : '0.0';

  return [
    { label: 'Career Points', value: formatNum(totals.pts), icon: '\uD83C\uDFC0', trend: getTrend(stats, 'points') },
    { label: 'PPG', value: ppg, icon: '\uD83D\uDCCA' },
    { label: 'Rebounds', value: formatNum(totals.reb), icon: '\uD83D\uDCAA', subtitle: `${rpg} RPG` },
    { label: 'Assists', value: formatNum(totals.ast), icon: '\u26A1', subtitle: `${apg} APG` },
    { label: 'Steals', value: totals.stl, icon: '\uD83D\uDC4C' },
    { label: 'Blocks', value: totals.blk, icon: '\uD83D\uDEAB' },
    { label: 'Games', value: totals.gp, icon: '\uD83D\uDCC5', subtitle: `${stats.length} season${stats.length > 1 ? 's' : ''}` },
  ];
}

function buildBaseballCards(stats: Record<string, unknown>[]): StatCard[] {
  const latest = stats[0] || {};
  return [
    { label: 'Batting Avg', value: latest.batting_avg ? String(latest.batting_avg) : '.000', icon: '\u26BE' },
    { label: 'Home Runs', value: Number(latest.home_runs) || 0, icon: '\uD83D\uDCA3' },
    { label: 'ERA', value: latest.era ? String(latest.era) : '-', icon: '\uD83E\uDD47' },
    { label: 'Seasons', value: stats.length, icon: '\uD83D\uDCC5' },
  ];
}

const TREND_ICONS: Record<string, { symbol: string; color: string }> = {
  up: { symbol: '\u25B2', color: '#10b981' },
  down: { symbol: '\u25BC', color: '#ef4444' },
  flat: { symbol: '\u25B6', color: '#6b7280' },
};

export default function CareerStatsDashboard({ sport, stats }: Props) {
  if (!stats || stats.length === 0) return null;

  const cards = sport === 'football'
    ? buildFootballCards(stats)
    : sport === 'basketball'
    ? buildBasketballCards(stats)
    : buildBaseballCards(stats);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const trend = card.trend ? TREND_ICONS[card.trend] : null;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{card.icon}</span>
              {trend && (
                <span className="text-xs font-bold" style={{ color: trend.color }}>
                  {trend.symbol}
                </span>
              )}
            </div>
            <p className="psp-h2 text-[var(--psp-navy,#0a1628)]">
              {card.value}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{card.label}</p>
            {card.subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{card.subtitle}</p>}
          </div>
        );
      })}
    </div>
  );
}
