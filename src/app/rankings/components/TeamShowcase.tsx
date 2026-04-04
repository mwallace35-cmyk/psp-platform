'use client';

import Link from 'next/link';
import type { RankingRow } from '../RankingsClient';

interface ShowcaseData {
  ppg: number;
  margin: number;
  win_pct: number;
  key_player?: {
    name: string;
    slug: string;
    stats_line: string;
  };
}

interface TeamShowcaseProps {
  ranking: RankingRow;
  showcaseData: ShowcaseData | null;
  activeSport: string;
  sportColor: string;
}

export default function TeamShowcase({ ranking, showcaseData, activeSport, sportColor }: TeamShowcaseProps) {
  const schoolName = ranking.schools?.name || 'Unknown';
  const mascot = ranking.schools?.mascot || '';
  const slug = ranking.schools?.slug;

  return (
    <div
      className="rounded-xl p-6 mb-6 border"
      style={{
        background: `linear-gradient(135deg, rgba(240,165,0,0.06) 0%, rgba(240,165,0,0) 100%)`,
        borderColor: 'rgba(240,165,0,0.25)',
      }}
    >
      {/* Crown + Team Name */}
      <div className="text-center mb-4">
        <span className="text-3xl" role="img" aria-label="Crown">&#128081;</span>
        <h2 className="psp-h2 text-navy mt-1">
          {slug ? (
            <Link href={`/${activeSport}/schools/${slug}`} className="hover:text-blue-600 transition">
              {schoolName}
            </Link>
          ) : (
            schoolName
          )}
        </h2>
        {mascot && <p className="text-gray-400 text-sm">{mascot}</p>}
      </div>

      {/* Record */}
      {ranking.record_display && (
        <p className="text-center text-sm font-bold text-navy mb-3">{ranking.record_display}</p>
      )}

      {/* Blurb */}
      {ranking.blurb && (
        <p className="text-center text-sm text-gray-500 mb-5 max-w-xl mx-auto">{ranking.blurb}</p>
      )}

      {/* Stat Boxes */}
      {showcaseData && (
        <div className="grid grid-cols-3 gap-3 mb-5 max-w-md mx-auto">
          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
            <p className="text-lg font-bold text-navy">{showcaseData.ppg.toFixed(1)}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">PPG</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
            <p className="text-lg font-bold text-navy">
              {showcaseData.margin > 0 ? '+' : ''}{showcaseData.margin.toFixed(1)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Margin</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
            <p className="text-lg font-bold text-navy">{(showcaseData.win_pct * 100).toFixed(0)}%</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Win %</p>
          </div>
        </div>
      )}

      {/* Key Player */}
      {showcaseData?.key_player && (
        <div className="bg-white rounded-lg p-3 border border-gray-100 max-w-md mx-auto text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Key Player</p>
          <Link
            href={`/${activeSport}/players/${showcaseData.key_player.slug}`}
            className="font-bold text-sm text-blue-600 hover:underline"
          >
            {showcaseData.key_player.name}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">{showcaseData.key_player.stats_line}</p>
        </div>
      )}
    </div>
  );
}
