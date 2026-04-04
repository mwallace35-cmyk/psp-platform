'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { RankingRow as RankingRowType } from '../RankingsClient';
import TrendChart from './TrendChart';
import VoteButtons from './VoteButtons';

interface VoteData {
  agree: number;
  disagree: number;
  total: number;
}

interface RankingRowProps {
  ranking: RankingRowType;
  isTop3: boolean;
  sportColor: string;
  activeSport: string;
  voteData?: VoteData;
  trendHistory: number[];
  onExpandResume: (schoolId: number) => void;
  isExpanded: boolean;
}

export default function RankingRow({
  ranking,
  isTop3,
  sportColor,
  activeSport,
  voteData,
  trendHistory,
  onExpandResume,
  isExpanded,
}: RankingRowProps) {
  const [blurbExpanded, setBlurbExpanded] = useState(false);

  const rank = ranking.rank_position;
  const rankChange = ranking.previous_rank !== null
    ? ranking.previous_rank - rank
    : null;
  const primaryColor = ranking.schools?.colors?.primary;
  const schoolName = ranking.schools?.name || 'Unknown';
  const mascot = ranking.schools?.mascot || '';
  const slug = ranking.schools?.slug;
  const schoolId = ranking.schools ? parseInt(ranking.id) : 0;

  // Controversy badge: disagree > 50%
  const isControversial = voteData && voteData.total > 0 && (voteData.disagree / (voteData.agree + voteData.disagree)) > 0.5;

  // Rank badge styling
  let badgeClasses = 'w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 ';
  if (rank === 1) badgeClasses += 'bg-yellow-400 text-[var(--psp-navy)]';
  else if (rank === 2) badgeClasses += 'bg-gray-300 text-[var(--psp-navy)]';
  else if (rank === 3) badgeClasses += 'bg-amber-600 text-white';
  else badgeClasses += 'bg-gray-100 text-gray-600';

  const showBlurb = ranking.blurb && (isTop3 || blurbExpanded);

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 border-t border-gray-100 first:border-t-0 hover:bg-gray-50 transition group animate-fade-in-up"
      style={{ animationDelay: `${(rank - 1) * 30}ms` }}
    >
      {/* Rank Badge */}
      <div className={badgeClasses}>
        {rank}
      </div>

      {/* School color bar */}
      {primaryColor && (
        <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
      )}

      {/* School info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {slug ? (
            <Link
              href={`/${activeSport}/schools/${slug}`}
              className="font-bold text-navy hover:text-blue-600 transition text-sm"
            >
              {schoolName}
            </Link>
          ) : (
            <span className="font-bold text-navy text-sm">{schoolName}</span>
          )}
          {mascot && <span className="text-gray-300 text-xs">{mascot}</span>}
          {isControversial && (
            <span className="text-xs" title="Controversial ranking" role="img" aria-label="Controversial">&#128293;</span>
          )}
          {/* Rank Change Indicator */}
          {rankChange !== null && rankChange > 0 && (
            <span className="inline-flex items-center gap-0.5 text-green-600 text-xs font-bold">
              <TrendingUp size={12} aria-hidden="true" /> +{rankChange}
            </span>
          )}
          {rankChange !== null && rankChange < 0 && (
            <span className="inline-flex items-center gap-0.5 text-red-500 text-xs font-bold">
              <TrendingDown size={12} aria-hidden="true" /> {rankChange}
            </span>
          )}
          {rankChange !== null && rankChange === 0 && (
            <span className="inline-flex items-center gap-0.5 text-gray-300 text-xs">
              <Minus size={12} aria-hidden="true" /> EVEN
            </span>
          )}
          {rankChange === null && (
            <span className="inline-flex items-center gap-1 text-blue-500 text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 rounded-full">
              <Sparkles size={10} aria-hidden="true" /> NEW
            </span>
          )}
        </div>

        {ranking.record_display && (
          <p className="text-xs text-gray-400 font-medium">{ranking.record_display}</p>
        )}

        {/* Blurb */}
        {ranking.blurb && (
          <div className="mt-1">
            {isTop3 ? (
              <p className="text-xs text-gray-400">{ranking.blurb}</p>
            ) : (
              <>
                <p className={`text-xs text-gray-400 ${blurbExpanded ? '' : 'line-clamp-2'}`}>
                  {ranking.blurb}
                </p>
                <button
                  onClick={() => setBlurbExpanded(!blurbExpanded)}
                  className="text-[10px] text-blue-500 hover:underline mt-0.5"
                >
                  {blurbExpanded ? 'Less' : 'More'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Trend Chart */}
      <TrendChart history={trendHistory} sportColor={sportColor} />

      {/* Vote Buttons */}
      <VoteButtons rankingId={ranking.id} initialVotes={voteData} />

      {/* View Resume */}
      <button
        onClick={() => onExpandResume(schoolId)}
        className="p-1.5 rounded-md text-gray-300 hover:text-navy hover:bg-gray-100 transition flex-shrink-0"
        aria-label={isExpanded ? 'Collapse resume' : 'View resume'}
        title={isExpanded ? 'Collapse resume' : 'View resume'}
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </div>
  );
}
