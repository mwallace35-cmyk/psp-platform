'use client';

import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import type { RankingRow } from '../RankingsClient';

interface ShakeupHeroProps {
  currentWeek: RankingRow[];
  previousWeek: RankingRow[];
  sportColor: string;
}

interface ShakeupItem {
  name: string;
  label: string;
}

export default function ShakeupHero({ currentWeek, previousWeek, sportColor }: ShakeupHeroProps) {
  if (!previousWeek.length) return null;

  const prevMap = new Map<string, number>();
  previousWeek.forEach(r => {
    const name = r.schools?.name || 'Unknown';
    prevMap.set(name, r.rank_position);
  });

  // Compute biggest riser and biggest drop
  let biggestRiser: ShakeupItem | null = null;
  let riserDelta = 0;
  let biggestDrop: ShakeupItem | null = null;
  let dropDelta = 0;
  let newEntry: ShakeupItem | null = null;

  const sortedCurrent = [...currentWeek].sort((a, b) => {
    const nameA = a.schools?.name || 'Unknown';
    const nameB = b.schools?.name || 'Unknown';
    return nameA.localeCompare(nameB);
  });

  for (const r of sortedCurrent) {
    const name = r.schools?.name || 'Unknown';
    const prevRank = prevMap.get(name);

    if (prevRank === undefined) {
      // New entry: pick first alphabetically
      if (!newEntry) {
        newEntry = { name, label: `Debuts at #${r.rank_position}` };
      }
      continue;
    }

    const change = prevRank - r.rank_position;

    if (change > 0 && (change > riserDelta || (change === riserDelta && (!biggestRiser || name < biggestRiser.name)))) {
      riserDelta = change;
      biggestRiser = { name, label: `#${prevRank} → #${r.rank_position} (+${change})` };
    }

    if (change < 0) {
      const absDrop = Math.abs(change);
      if (absDrop > dropDelta || (absDrop === dropDelta && (!biggestDrop || name < biggestDrop.name))) {
        dropDelta = absDrop;
        biggestDrop = { name, label: `#${prevRank} → #${r.rank_position} (${change})` };
      }
    }
  }

  return (
    <div className="bg-gradient-to-r from-gold/5 to-gold/0 border border-gold/20 rounded-xl p-5 mb-6">
      <h3 className="psp-h4 text-navy mb-4">This Week&apos;s Shakeup</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Biggest Riser */}
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-green-600" />
            <span className="text-xs font-bold uppercase text-green-600 tracking-wide">Biggest Riser</span>
          </div>
          {biggestRiser ? (
            <>
              <p className="font-bold text-navy text-sm">{biggestRiser.name}</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">{biggestRiser.label}</p>
            </>
          ) : (
            <p className="text-xs text-gray-400">No changes</p>
          )}
        </div>

        {/* Biggest Drop */}
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-red-500" />
            <span className="text-xs font-bold uppercase text-red-500 tracking-wide">Biggest Drop</span>
          </div>
          {biggestDrop ? (
            <>
              <p className="font-bold text-navy text-sm">{biggestDrop.name}</p>
              <p className="text-xs text-red-500 font-medium mt-0.5">{biggestDrop.label}</p>
            </>
          ) : (
            <p className="text-xs text-gray-400">No changes</p>
          )}
        </div>

        {/* New Entry */}
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Star size={18} className="text-[var(--psp-gold)]" />
            <span className="text-xs font-bold uppercase text-[var(--psp-gold-text)] tracking-wide">New Entry</span>
          </div>
          {newEntry ? (
            <>
              <p className="font-bold text-navy text-sm">{newEntry.name}</p>
              <p className="text-xs text-[var(--psp-gold-text)] font-medium mt-0.5">{newEntry.label}</p>
            </>
          ) : (
            <p className="text-xs text-gray-400">No changes</p>
          )}
        </div>
      </div>
    </div>
  );
}
