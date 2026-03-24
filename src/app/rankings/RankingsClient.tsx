'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Sparkles, Trophy, Calendar } from 'lucide-react';

export interface RankingRow {
  id: string;
  sport_id: string;
  week_label: string;
  ranking_type: string | null;
  ranking_category: string | null;
  rank_position: number;
  previous_rank: number | null;
  record_display: string | null;
  blurb: string | null;
  published_at: string;
  schools?: { name: string; slug: string; colors: Record<string, string> | null; mascot: string | null } | null;
}

const RANKING_CATEGORIES: { key: string; label: string; icon: string; limit: number }[] = [
  { key: 'city', label: 'City Top 12', icon: '🏙️', limit: 12 },
  { key: 'public', label: 'Public League Top 10', icon: '🏫', limit: 10 },
  { key: 'pcl', label: 'Catholic League Top 5', icon: '⛪', limit: 5 },
];

interface Props {
  rankings: RankingRow[];
  activeSport: string;
  sportMeta: { name: string; emoji: string } | null;
}

const RANKING_TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  offseason: { label: 'Way Too Early', icon: <Sparkles size={16} />, color: '#7c3aed' },
  preseason: { label: 'Preseason', icon: <Calendar size={16} />, color: '#f0a500' },
  in_season: { label: 'In Season', icon: <TrendingUp size={16} />, color: '#16a34a' },
  playoff: { label: 'Playoffs', icon: <Trophy size={16} />, color: '#ea580c' },
  final: { label: 'Final', icon: <Trophy size={16} />, color: '#3b82f6' },
};

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#ea580c',
};

export default function RankingsClient({ rankings, activeSport, sportMeta }: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Group by week
  const byWeek = useMemo(() => {
    const groups: Record<string, RankingRow[]> = {};
    rankings.forEach(r => {
      if (!groups[r.week_label]) groups[r.week_label] = [];
      groups[r.week_label].push(r);
    });
    // Sort each group by rank_position
    Object.values(groups).forEach(g => g.sort((a, b) => a.rank_position - b.rank_position));
    return groups;
  }, [rankings]);

  // Ordered weeks (most recent first based on published_at)
  const weeks = useMemo(() => {
    const weekDates: Record<string, string> = {};
    rankings.forEach(r => {
      if (!weekDates[r.week_label] || r.published_at > weekDates[r.week_label]) {
        weekDates[r.week_label] = r.published_at;
      }
    });
    return Object.keys(weekDates).sort((a, b) => weekDates[b].localeCompare(weekDates[a]));
  }, [rankings]);

  const [selectedWeek, setSelectedWeek] = useState(weeks[0] || '');
  const currentRankings = byWeek[selectedWeek] || [];
  const selectedWeekIndex = weeks.indexOf(selectedWeek);

  // Get ranking type for current week
  const rankingType = currentRankings[0]?.ranking_type || 'in_season';
  const typeInfo = RANKING_TYPE_LABELS[rankingType] || RANKING_TYPE_LABELS.in_season;
  const sportColor = SPORT_COLORS[activeSport] || '#3b82f6';

  // Group current rankings by category (city, public, catholic)
  const byCategory = useMemo(() => {
    const groups: Record<string, RankingRow[]> = {};
    currentRankings.forEach(r => {
      const cat = r.ranking_category || 'city';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    Object.values(groups).forEach(g => g.sort((a, b) => a.rank_position - b.rank_position));
    return groups;
  }, [currentRankings]);

  // Determine which categories have data
  const activeCategories = RANKING_CATEGORIES.filter(c => byCategory[c.key]?.length > 0);
  // If no categories have data but we have rankings, treat all as 'city'
  const hasMultipleCategories = activeCategories.length > 1;

  // Build rank history for sparklines (last 5 weeks for each team in current view)
  const rankHistory = useMemo(() => {
    const history: Record<string, number[]> = {};
    const recentWeeks = weeks.slice(0, 5).reverse();
    currentRankings.forEach(r => {
      const schoolName = r.schools?.name || 'Unknown';
      const cat = r.ranking_category || 'city';
      const key = `${cat}:${schoolName}`;
      history[key] = recentWeeks.map(w => {
        const weekData = byWeek[w];
        const entry = weekData?.find(wr =>
          wr.schools?.name === schoolName && (wr.ranking_category || 'city') === cat
        );
        return entry?.rank_position || 0;
      });
    });
    return history;
  }, [currentRankings, weeks, byWeek]);

  // Navigate weeks
  const goToPreviousWeek = () => {
    if (selectedWeekIndex < weeks.length - 1) setSelectedWeek(weeks[selectedWeekIndex + 1]);
  };
  const goToNextWeek = () => {
    if (selectedWeekIndex > 0) setSelectedWeek(weeks[selectedWeekIndex - 1]);
  };

  // Scroll timeline
  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  if (currentRankings.length === 0 && weeks.length === 0) {
    const comingSoonMessages: Record<string, { title: string; subtitle: string }> = {
      football: {
        title: 'Way Too Early Preseason Rankings Coming Soon',
        subtitle: 'Our football rankings will drop this summer as we preview the 2026 season. Who\'s the team to beat?',
      },
      baseball: {
        title: 'Preseason Rankings Coming Soon',
        subtitle: 'Baseball season is around the corner. Check back for our preseason power rankings as teams gear up for 2026.',
      },
    };
    const msg = comingSoonMessages[activeSport] || {
      title: `${sportMeta?.name} Rankings Coming Soon`,
      subtitle: `Power rankings will be published during the season. Check back when ${sportMeta?.name?.toLowerCase()} season kicks off!`,
    };
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-4xl mb-3">{sportMeta?.emoji || '📊'}</p>
        <p className="text-gray-700 text-xl font-medium mb-2">{msg.title}</p>
        <p className="text-gray-500">{msg.subtitle}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Seasonal Context Banner */}
      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg" style={{ backgroundColor: `${typeInfo.color}12`, border: `1px solid ${typeInfo.color}30` }}>
        <span style={{ color: typeInfo.color }}>{typeInfo.icon}</span>
        <span className="font-bold text-sm" style={{ color: typeInfo.color }}>{typeInfo.label} Rankings</span>
        <span className="text-gray-400 text-xs">|</span>
        <span className="text-gray-600 text-sm">{sportMeta?.emoji} {sportMeta?.name}</span>
        {currentRankings[0]?.published_at && (
          <>
            <span className="text-gray-400 text-xs">|</span>
            <span className="text-gray-500 text-xs">
              Published {new Date(currentRankings[0].published_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
          </>
        )}
      </div>

      {/* Week Timeline Slider */}
      {weeks.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTimeline('left')}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              ref={timelineRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {weeks.map((week, idx) => {
                const isSelected = week === selectedWeek;
                const weekType = byWeek[week]?.[0]?.ranking_type || 'in_season';
                const wTypeInfo = RANKING_TYPE_LABELS[weekType] || RANKING_TYPE_LABELS.in_season;
                return (
                  <button
                    key={week}
                    onClick={() => setSelectedWeek(week)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'text-white shadow-md scale-105'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:shadow-sm'
                    }`}
                    style={isSelected ? { backgroundColor: sportColor } : {}}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-bold">{week}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                        {wTypeInfo.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => scrollTimeline('right')}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Week Navigation (prev/next) */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          disabled={selectedWeekIndex >= weeks.length - 1}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <h2 className="psp-h2 text-navy">
          {sportMeta?.emoji} {selectedWeek}
        </h2>
        <button
          onClick={goToNextWeek}
          disabled={selectedWeekIndex <= 0}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Rankings List — by Category */}
      {(hasMultipleCategories ? activeCategories : [{ key: 'city', label: 'City Top 10', icon: '🏙️', limit: 10 }]).map(category => {
        const catRankings = hasMultipleCategories ? (byCategory[category.key] || []) : currentRankings;
        if (catRankings.length === 0) return null;

        return (
          <div key={category.key} className="mb-8">
            {/* Category Header */}
            {hasMultipleCategories && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{category.icon}</span>
                <h3 className="text-lg font-bebas tracking-wide text-navy">{category.label}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: sportColor }}>
                  {catRankings.length}
                </span>
              </div>
            )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {catRankings.map((r, idx) => {
          const rankChange = r.previous_rank !== null ? r.previous_rank - r.rank_position : null;
          const primaryColor = r.schools?.colors?.primary;
          const schoolName = r.schools?.name || 'Unknown';
          const cat = r.ranking_category || 'city';
          const history = rankHistory[`${cat}:${schoolName}`] || [];

          return (
            <div
              key={r.id}
              className={`flex items-center gap-4 px-5 py-4 ${idx > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50 transition group`}
            >
              {/* Rank Badge */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 ${
                r.rank_position === 1 ? 'bg-yellow-400 text-navy' :
                r.rank_position <= 3 ? 'bg-gold/20 text-navy' : 'bg-gray-100 text-gray-600'
              }`}>
                {r.rank_position}
              </div>

              {/* School color bar */}
              {primaryColor && (
                <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
              )}

              {/* School info */}
              <div className="flex-1 min-w-0">
                {r.schools ? (
                  <Link href={`/${activeSport}/schools/${r.schools.slug}`} className="font-bold text-navy hover:text-blue-600 transition">
                    {r.schools.name}
                    {r.schools.mascot && <span className="text-gray-400 font-normal text-sm ml-1">{r.schools.mascot}</span>}
                  </Link>
                ) : (
                  <span className="font-bold text-navy">Unknown School</span>
                )}
                {r.record_display && (
                  <p className="text-sm text-gray-500 font-medium">{r.record_display}</p>
                )}
                {r.blurb && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 group-hover:line-clamp-none transition-all">{r.blurb}</p>
                )}
              </div>

              {/* Mini Sparkline (rank history) */}
              {history.length > 1 && history.some(h => h > 0) && (
                <div className="hidden md:flex items-end gap-[2px] h-8 flex-shrink-0" title="Rank trend (last 5 weeks)">
                  {history.map((rank, i) => {
                    if (rank === 0) return <div key={i} className="w-1.5 bg-gray-100 rounded-sm" style={{ height: 2 }} />;
                    // Invert: rank 1 = tallest bar, rank 10 = shortest
                    const maxRank = 12;
                    const barHeight = Math.max(4, ((maxRank - rank) / maxRank) * 28);
                    const isLatest = i === history.length - 1;
                    return (
                      <div
                        key={i}
                        className="w-1.5 rounded-sm transition-all"
                        style={{
                          height: barHeight,
                          backgroundColor: isLatest ? sportColor : `${sportColor}50`,
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Rank Change Indicator */}
              <div className="flex-shrink-0 w-16 text-right">
                {rankChange !== null && rankChange > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-green-600 text-sm font-bold">
                    <TrendingUp size={14} /> {rankChange}
                  </span>
                )}
                {rankChange !== null && rankChange < 0 && (
                  <span className="inline-flex items-center gap-0.5 text-red-500 text-sm font-bold">
                    <TrendingDown size={14} /> {Math.abs(rankChange)}
                  </span>
                )}
                {rankChange !== null && rankChange === 0 && (
                  <span className="inline-flex items-center gap-0.5 text-gray-400 text-sm">
                    <Minus size={14} />
                  </span>
                )}
                {rankChange === null && (
                  <span className="inline-flex items-center gap-1 text-blue-500 text-xs font-bold px-2 py-0.5 bg-blue-50 rounded-full">
                    <Sparkles size={12} /> NEW
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><TrendingUp size={12} className="text-green-600" /> Moved up</span>
        <span className="flex items-center gap-1"><TrendingDown size={12} className="text-red-500" /> Moved down</span>
        <span className="flex items-center gap-1"><Minus size={12} className="text-gray-400" /> No change</span>
        <span className="flex items-center gap-1"><Sparkles size={12} className="text-blue-500" /> New entry</span>
        {weeks.length > 1 && (
          <span className="flex items-center gap-1 ml-auto">
            <div className="flex items-end gap-[1px] h-3">
              <div className="w-1 h-1 rounded-sm" style={{ backgroundColor: `${sportColor}50` }} />
              <div className="w-1 h-2 rounded-sm" style={{ backgroundColor: `${sportColor}50` }} />
              <div className="w-1 h-3 rounded-sm" style={{ backgroundColor: sportColor }} />
            </div>
            Rank trend
          </span>
        )}
      </div>
    </div>
  );
}
