'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Award {
  id: number;
  player_id: number;
  award_name: string;
  year: number;
  sport_id: string | null;
  school_id: number;
  category: string | null;
  position: string | null;
  award_type: string | null;
  award_tier: string | null;
  created_at: string;
}

interface AwardsHonorsProps {
  playerId: number;
}

const TIER_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'First Team': { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', glow: 'rgba(245,158,11,0.15)' },
  'Second Team': { bg: '#e0e7ff', border: '#6366f1', text: '#3730a3', glow: 'rgba(99,102,241,0.12)' },
  'Third Team': { bg: '#ecfdf5', border: '#10b981', text: '#065f46', glow: 'rgba(16,185,129,0.1)' },
  'Honorable Mention': { bg: '#f3f4f6', border: '#9ca3af', text: '#374151', glow: 'rgba(156,163,175,0.1)' },
  'MVP': { bg: '#fef3c7', border: '#d97706', text: '#92400e', glow: 'rgba(217,119,6,0.2)' },
};

const CATEGORY_ICONS: Record<string, string> = {
  offense: '\u26A1',    // ⚡
  defense: '\u{1F6E1}', // 🛡
  specialist: '\u{1F3AF}', // 🎯
};

function formatSeasonYear(year: number): string {
  return `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`;
}

function getAwardLabel(award: Award): string {
  // Clean up redundant names
  let name = award.award_name;
  // If award_name already contains "First Team" etc, don't repeat tier
  if (award.award_tier && !name.toLowerCase().includes(award.award_tier.toLowerCase())) {
    return name;
  }
  // Strip tier from name if it's redundant with the badge
  if (award.award_tier) {
    name = name
      .replace(/First Team/i, '')
      .replace(/Second Team/i, '')
      .replace(/Third Team/i, '')
      .replace(/Honorable Mention/i, '')
      .replace(/Red Division/i, '')
      .trim();
    // Remove trailing spaces/dashes
    name = name.replace(/[-\s]+$/, '');
  }
  return name || award.award_name;
}

export default function AwardsHonors({ playerId }: AwardsHonorsProps) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('awards')
          .select('id, player_id, award_name, year, sport_id, school_id, category, position, award_type, award_tier, created_at')
          .eq('player_id', playerId)
          .order('year', { ascending: false });

        if (supabaseError) {
          setError(supabaseError.message);
          return;
        }

        setAwards(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch awards');
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, [playerId, supabase]);

  const awardsByYear = (awards ?? []).reduce(
    (acc, award) => {
      if (!acc[award.year]) acc[award.year] = [];
      acc[award.year].push(award);
      return acc;
    },
    {} as Record<number, Award[]>
  );

  const sortedYears = Object.keys(awardsByYear).map(Number).sort((a, b) => b - a);

  if (loading) {
    return (
      <section className="pt-8 mt-8 border-t border-gray-200">
        <h2 className="font-bebas text-[28px] font-bold text-[#0a1628] tracking-wider mb-6">
          Awards & Honors
        </h2>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-lg border border-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-8 mt-8 border-t border-gray-200">
        <h2 className="font-bebas text-[28px] font-bold text-[#0a1628] tracking-wider mb-6">
          Awards & Honors
        </h2>
        <p className="text-red-600 text-sm">Error loading awards: {error}</p>
      </section>
    );
  }

  return (
    <section className="pt-8 mt-8 border-t border-gray-200">
      <h2 className="font-bebas text-[28px] font-bold text-[#0a1628] tracking-wider mb-6">
        Awards & Honors
      </h2>
      {!awards || awards.length === 0 ? (
        <p className="text-gray-500 text-base">No awards recorded yet</p>
      ) : (
        <div className="flex flex-col gap-8">
          {sortedYears.map((year) => (
            <div key={year}>
              {/* Year Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg font-bold text-[#f0a500] font-bebas tracking-wider">
                  {formatSeasonYear(year)}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">
                  {awardsByYear[year].length} award{awardsByYear[year].length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Award Badges */}
              <div className="flex flex-wrap gap-3">
                {(awardsByYear[year] ?? []).map((award) => {
                  const tier = award.award_tier || '';
                  const style = TIER_STYLES[tier] || TIER_STYLES['Honorable Mention'] || { bg: '#f3f4f6', border: '#9ca3af', text: '#374151', glow: 'none' };
                  const categoryIcon = CATEGORY_ICONS[award.category || ''] || '\u{1F3C6}';
                  const label = getAwardLabel(award);

                  return (
                    <div
                      key={award.id}
                      className="relative group"
                      style={{
                        background: style.bg,
                        border: `2px solid ${style.border}`,
                        borderRadius: '12px',
                        padding: '12px 16px',
                        minWidth: '200px',
                        maxWidth: '320px',
                        boxShadow: `0 2px 8px ${style.glow}`,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${style.glow}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${style.glow}`;
                      }}
                    >
                      {/* Top row: icon + award name */}
                      <div className="flex items-start gap-2">
                        <span className="text-xl shrink-0">{categoryIcon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm leading-tight" style={{ color: style.text }}>
                            {label}
                          </p>
                          {/* Position */}
                          {award.position && (
                            <p className="text-xs mt-0.5" style={{ color: style.text, opacity: 0.7 }}>
                              {award.position}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bottom row: tier badge + category */}
                      <div className="flex items-center gap-2 mt-2">
                        {tier && (
                          <span
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              background: style.border,
                              color: 'white',
                            }}
                          >
                            {tier}
                          </span>
                        )}
                        {award.category && (
                          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: style.text, opacity: 0.6 }}>
                            {award.category}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
