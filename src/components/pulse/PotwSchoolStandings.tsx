import React from 'react';
import { SPORT_META } from '@/lib/sports';
import type { SportId } from '@/lib/sports';

interface SchoolStanding {
  school_name: string;
  total_votes: number;
  nominee_count: number;
  avg_votes: number;
  sport_ids: string[];
}

interface PotwSchoolStandingsProps {
  nominees: {
    school_name: string;
    vote_count: number;
    sport_id: string;
  }[];
}

const SPORT_BADGE_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#dc2626',
  soccer: '#059669',
  lacrosse: '#0891b2',
  'track-field': '#7c3aed',
  wrestling: '#ca8a04',
};

export default function PotwSchoolStandings({ nominees }: PotwSchoolStandingsProps) {
  if (!nominees || nominees.length === 0) return null;

  // Aggregate by school
  const schoolMap = new Map<string, { total_votes: number; nominee_count: number; sport_ids: Set<string> }>();

  for (const n of nominees) {
    const existing = schoolMap.get(n.school_name);
    if (existing) {
      existing.total_votes += n.vote_count || 0;
      existing.nominee_count += 1;
      if (n.sport_id) existing.sport_ids.add(n.sport_id);
    } else {
      const sportIds = new Set<string>();
      if (n.sport_id) sportIds.add(n.sport_id);
      schoolMap.set(n.school_name, {
        total_votes: n.vote_count || 0,
        nominee_count: 1,
        sport_ids: sportIds,
      });
    }
  }

  const standings: SchoolStanding[] = Array.from(schoolMap.entries())
    .map(([school_name, data]) => ({
      school_name,
      total_votes: data.total_votes,
      nominee_count: data.nominee_count,
      avg_votes: data.nominee_count > 0 ? Math.round(data.total_votes / data.nominee_count) : 0,
      sport_ids: Array.from(data.sport_ids),
    }))
    .sort((a, b) => b.total_votes - a.total_votes);

  if (standings.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-lg font-bebas text-navy mb-1 tracking-wider">School Fan Loyalty</h3>
      <p className="text-xs text-gray-400 mb-4">Which school&apos;s fans vote the most?</p>

      <div className="space-y-2">
        {standings.map((school, idx) => {
          const isFirst = idx === 0 && school.total_votes > 0;

          return (
            <div
              key={school.school_name}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                isFirst
                  ? 'bg-gold/10 border border-gold/30'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* Rank */}
              <span
                className={`text-sm font-bold w-6 text-center ${
                  isFirst ? 'text-gold' : 'text-gray-300'
                }`}
              >
                {idx + 1}
              </span>

              {/* School name + sport badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold truncate ${isFirst ? 'text-navy' : 'text-gray-800'}`}>
                    {school.school_name}
                  </span>
                  {isFirst && (
                    <span className="text-xs bg-gold text-navy font-bold px-1.5 py-0.5 rounded-full">
                      #1
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {school.sport_ids.map((sid) => {
                    const sportMeta = SPORT_META[sid as SportId];
                    const color = SPORT_BADGE_COLORS[sid] || '#6b7280';
                    return (
                      <span
                        key={sid}
                        className="text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                        }}
                        title={sportMeta?.name || sid}
                      >
                        {sportMeta?.emoji || ''} {sportMeta?.name || sid}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right shrink-0">
                <div className={`text-sm font-bold tabular-nums ${isFirst ? 'text-navy' : 'text-gray-700'}`}>
                  {school.total_votes.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  {school.nominee_count} nominee{school.nominee_count !== 1 ? 's' : ''} &middot; {school.avg_votes} avg
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
