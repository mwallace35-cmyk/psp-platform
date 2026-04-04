'use client';

import { useMemo } from 'react';
import type { RankingRow } from '../RankingsClient';

interface VoteEntry {
  agree: number;
  disagree: number;
  total: number;
}

interface ControversyMeterProps {
  voteData: Record<string, VoteEntry>;
  rankings: RankingRow[];
}

interface HeatItem {
  id: string;
  schoolName: string;
  rank: number;
  disagreePct: number;
  total: number;
  heatScore: number;
  previousRank: number | null;
}

function getFireBadge(score: number): string {
  if (score >= 5) return '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25';
  if (score >= 3) return '\uD83D\uDD25\uD83D\uDD25';
  return '\uD83D\uDD25';
}

export default function ControversyMeter({ voteData, rankings }: ControversyMeterProps) {
  const hotItems = useMemo(() => {
    const items: HeatItem[] = [];

    for (const r of rankings) {
      const votes = voteData[r.id];
      if (!votes || votes.total === 0) continue;

      const disagreePct = (votes.disagree / votes.total) * 100;
      const heatScore = (disagreePct / 50) * Math.log(votes.total + 1);

      if (heatScore < 1.5) continue;

      items.push({
        id: r.id,
        schoolName: r.schools?.name || 'Unknown',
        rank: r.rank_position,
        disagreePct,
        total: votes.total,
        heatScore,
        previousRank: r.previous_rank,
      });
    }

    items.sort((a, b) => b.heatScore - a.heatScore);
    return items.slice(0, 3);
  }, [voteData, rankings]);

  if (hotItems.length === 0) return null;

  return (
    <div className="rounded-xl bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-800">
        <h3 className="text-orange-400 font-bold text-sm tracking-wide uppercase">
          MOST DEBATED THIS WEEK
        </h3>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-800">
        {hotItems.map((item) => {
          const rankChange = item.previousRank !== null ? item.previousRank - item.rank : null;
          const movedText = rankChange !== null && rankChange !== 0
            ? `moved ${Math.abs(rankChange)} spot${Math.abs(rankChange) > 1 ? 's' : ''}`
            : null;

          return (
            <div key={item.id} className="px-5 py-3 flex items-center gap-3">
              {/* Fire badge */}
              <span className="text-lg flex-shrink-0" aria-hidden="true">
                {getFireBadge(item.heatScore)}
              </span>

              {/* Team info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold">
                  <span className="text-gray-500 mr-1">#{item.rank}</span>
                  {item.schoolName}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {Math.round(item.disagreePct)}% of fans disagree
                  {movedText && <span className="text-gray-500"> &middot; {movedText}</span>}
                </p>
              </div>

              {/* Heat score pill */}
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 flex-shrink-0">
                {item.heatScore.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
