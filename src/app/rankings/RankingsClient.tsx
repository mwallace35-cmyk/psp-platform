'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Trophy,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

// Sub-components
import ShakeupHero from './components/ShakeupHero';
import TeamShowcase from './components/TeamShowcase';
import RankingRowComponent from './components/RankingRow';
import TeamResume from './components/TeamResume';
import ControversyMeter from './components/ControversyMeter';
import WeekComparison from './components/WeekComparison';
import SnubPoll from './components/SnubPoll';
import CrossTierSpotlight from './components/CrossTierSpotlight';

// ============================================================================
// EXPORTED INTERFACE — other components import this
// ============================================================================
export interface RankingRow {
  id: string;
  sport_id: string;
  school_id?: number;
  season_id?: number | null;
  week_label: string;
  ranking_type: string | null;
  ranking_category: string | null;
  rank_position: number;
  previous_rank: number | null;
  record_display: string | null;
  blurb: string | null;
  published_at: string;
  schools?: {
    name: string;
    slug: string;
    colors: Record<string, string> | null;
    mascot: string | null;
  } | null;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const RANKING_CATEGORIES: { key: string; label: string; icon: string; limit: number }[] = [
  { key: 'city', label: 'City Top 12', icon: '\uD83C\uDFD9\uFE0F', limit: 12 },
  { key: 'public', label: 'Public League Top 10', icon: '\uD83C\uDFEB', limit: 10 },
  { key: 'pcl', label: 'Catholic League Top 5', icon: '\u26EA', limit: 5 },
];

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
  baseball: '#dc2626',
};

// ============================================================================
// SHOWCASE DATA TYPE
// ============================================================================
interface ShowcaseDataEntry {
  ppg: number;
  margin: number;
  win_pct: number;
  key_player?: {
    name: string;
    slug: string;
    stats_line: string;
  };
}

interface SpotlightGame {
  homeTeam: { name: string; slug: string; rank: number; category: string; record: string };
  awayTeam: { name: string; slug: string; rank: number; category: string; record: string };
  gameDate: string;
  venue?: string;
  historicalContext?: string;
}

// ============================================================================
// PROPS
// ============================================================================
interface Props {
  rankings: RankingRow[];
  activeSport: string;
  sportMeta: { name: string; emoji: string } | null;
  showcaseData: Record<string, ShowcaseDataEntry | null>;
  spotlightGames: SpotlightGame[];
  snubPollId: string | null;
  voteCounts: Record<string, { agree: number; disagree: number; total: number }>;
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function RankingsClient({
  rankings,
  activeSport,
  sportMeta,
  showcaseData,
  spotlightGames,
  snubPollId,
  voteCounts,
}: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [selectedCategory, setSelectedCategory] = useState<string>('city');
  const [viewMode, setViewMode] = useState<'rankings' | 'changes'>('rankings');
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  // --- Derived data ---
  const sportColor = SPORT_COLORS[activeSport] || '#3b82f6';

  // Group by week
  const byWeek = useMemo(() => {
    const groups: Record<string, RankingRow[]> = {};
    rankings.forEach(r => {
      if (!groups[r.week_label]) groups[r.week_label] = [];
      groups[r.week_label].push(r);
    });
    Object.values(groups).forEach(g => g.sort((a, b) => a.rank_position - b.rank_position));
    return groups;
  }, [rankings]);

  // Ordered weeks (most recent first)
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

  // Previous week rankings
  const previousWeekLabel = selectedWeekIndex < weeks.length - 1 ? weeks[selectedWeekIndex + 1] : null;
  const previousWeekRankings = previousWeekLabel ? (byWeek[previousWeekLabel] || []) : [];

  // Ranking type for current week
  const rankingType = currentRankings[0]?.ranking_type || 'in_season';
  const typeInfo = RANKING_TYPE_LABELS[rankingType] || RANKING_TYPE_LABELS.in_season;

  // Group current rankings by category
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

  // Previous week by category (for ShakeupHero and WeekComparison)
  const prevByCategory = useMemo(() => {
    const groups: Record<string, RankingRow[]> = {};
    previousWeekRankings.forEach(r => {
      const cat = r.ranking_category || 'city';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    return groups;
  }, [previousWeekRankings]);

  // Determine which categories have data
  const activeCategories = RANKING_CATEGORIES.filter(c => byCategory[c.key]?.length > 0);

  // Auto-select first available category if current has no data
  const effectiveCategory = byCategory[selectedCategory]?.length > 0
    ? selectedCategory
    : activeCategories[0]?.key || 'city';

  const categoryRankings = byCategory[effectiveCategory] || [];
  const prevCategoryRankings = prevByCategory[effectiveCategory] || [];

  // Build rank history for trend charts (all weeks, not just last 5)
  const rankHistory = useMemo(() => {
    const history: Record<string, number[]> = {};
    const allWeeksReversed = [...weeks].reverse(); // oldest to newest
    currentRankings.forEach(r => {
      const schoolName = r.schools?.name || 'Unknown';
      const cat = r.ranking_category || 'city';
      const key = `${cat}:${schoolName}`;
      history[key] = allWeeksReversed.map(w => {
        const weekData = byWeek[w];
        const entry = weekData?.find(wr =>
          wr.schools?.name === schoolName && (wr.ranking_category || 'city') === cat
        );
        return entry?.rank_position || 0;
      });
    });
    return history;
  }, [currentRankings, weeks, byWeek]);

  // Get season_id from first ranking (for TeamResume)
  const seasonId = currentRankings[0]?.season_id || 76;

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

  // Toggle team resume expand
  const handleExpandResume = (schoolId: number) => {
    setExpandedTeamId(prev => (prev === schoolId ? null : schoolId));
  };

  // --- Empty state ---
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
        <p className="text-4xl mb-3">{sportMeta?.emoji || '\uD83D\uDCCA'}</p>
        <p className="text-gray-700 text-xl font-medium mb-2">{msg.title}</p>
        <p className="text-gray-400">{msg.subtitle}</p>
      </div>
    );
  }

  // --- Top-ranked team for showcase ---
  const topRanked = categoryRankings.length > 0 ? categoryRankings[0] : null;
  const showcaseEntry = topRanked ? showcaseData[effectiveCategory] || null : null;

  return (
    <div>
      {/* 1. Seasonal Context Banner */}
      <div
        className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg"
        style={{
          backgroundColor: `${typeInfo.color}12`,
          border: `1px solid ${typeInfo.color}30`,
        }}
      >
        <span style={{ color: typeInfo.color }}>{typeInfo.icon}</span>
        <span className="font-bold text-sm" style={{ color: typeInfo.color }}>
          {typeInfo.label} Rankings
        </span>
        <span className="text-gray-300 text-xs">|</span>
        <span className="text-gray-600 text-sm">
          {sportMeta?.emoji} {sportMeta?.name}
        </span>
        {currentRankings[0]?.published_at && (
          <>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-gray-400 text-xs">
              Published{' '}
              {new Date(currentRankings[0].published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </>
        )}
      </div>

      {/* 2. ShakeupHero */}
      <ShakeupHero
        currentWeek={categoryRankings}
        previousWeek={prevCategoryRankings}
        sportColor={sportColor}
      />

      {/* 3. Category Tabs */}
      {activeCategories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeCategories.map(cat => {
            const isActive = cat.key === effectiveCategory;
            const count = byCategory[cat.key]?.length || 0;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-navy shadow-md border border-gray-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-navy text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Week Timeline Slider */}
      {weeks.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTimeline('left')}
              className="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition flex-shrink-0"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              ref={timelineRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {weeks.map((week) => {
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
                    style={
                      isSelected
                        ? { backgroundColor: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }
                        : {}
                    }
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-bold">{week}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-300'}`}>
                        {wTypeInfo.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => scrollTimeline('right')}
              className="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition flex-shrink-0"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 5. Week Navigation (prev/next) */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          disabled={selectedWeekIndex >= weeks.length - 1}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex items-center gap-3">
          <h2 className="psp-h2 text-navy">
            {sportMeta?.emoji} {selectedWeek}
          </h2>
        </div>
        <button
          onClick={goToNextWeek}
          disabled={selectedWeekIndex <= 0}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* 6. View Mode Toggle */}
      {previousWeekRankings.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setViewMode('rankings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === 'rankings'
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Full Rankings
          </button>
          <button
            onClick={() => setViewMode('changes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === 'changes'
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            What Changed
          </button>
        </div>
      )}

      {/* 7. Conditional View */}
      {viewMode === 'rankings' ? (
        <>
          {/* 7a. TeamShowcase for #1 */}
          {topRanked && (
            <TeamShowcase
              ranking={topRanked}
              showcaseData={showcaseEntry}
              activeSport={activeSport}
              sportColor={sportColor}
            />
          )}

          {/* 7b. Ranking Rows 2-N */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            {categoryRankings.map((r) => {
              const schoolName = r.schools?.name || 'Unknown';
              const cat = r.ranking_category || 'city';
              const trendHistory = rankHistory[`${cat}:${schoolName}`] || [];
              const schoolId = r.school_id || 0;

              // Skip #1 since it's in the showcase
              if (r.rank_position === 1 && topRanked) {
                return null;
              }

              return (
                <React.Fragment key={r.id}>
                  <RankingRowComponent
                    ranking={r}
                    isTop3={r.rank_position <= 3}
                    sportColor={sportColor}
                    activeSport={activeSport}
                    voteData={voteCounts[r.id]}
                    trendHistory={trendHistory}
                    onExpandResume={handleExpandResume}
                    isExpanded={expandedTeamId === schoolId}
                  />
                  {/* Expanded Team Resume */}
                  <TeamResume
                    schoolId={schoolId}
                    sport={activeSport}
                    seasonId={seasonId}
                    isExpanded={expandedTeamId === schoolId}
                    sportColor={sportColor}
                  />
                </React.Fragment>
              );
            })}
          </div>

          {/* 7c. ControversyMeter */}
          <div className="mb-6">
            <ControversyMeter voteData={voteCounts} rankings={categoryRankings} />
          </div>
        </>
      ) : (
        /* 7 (changes): WeekComparison */
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <WeekComparison
            currentWeek={categoryRankings}
            previousWeek={prevCategoryRankings}
          />
        </div>
      )}

      {/* 8. SnubPoll */}
      {snubPollId && (
        <div className="mb-6">
          <SnubPoll pollId={snubPollId} />
        </div>
      )}

      {/* 9. CrossTierSpotlight */}
      {spotlightGames.length > 0 && (
        <div className="mb-6">
          <CrossTierSpotlight spotlightGames={spotlightGames} />
        </div>
      )}

      {/* 10. How We Rank Methodology */}
      <div className="mb-6">
        <button
          onClick={() => setMethodologyOpen(!methodologyOpen)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left"
        >
          <Info size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm font-bold text-navy flex-1">How We Rank</span>
          {methodologyOpen ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </button>
        {methodologyOpen && (
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg px-5 py-4 -mt-1 space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Rankings are compiled weekly by Mike Wallace and reflect an assessment of
              team strength based on overall record, strength of schedule, head-to-head results,
              and recent performance. We maintain three separate polls:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>
                <strong>City Top 12</strong> &mdash; All Philadelphia-area teams regardless of league
              </li>
              <li>
                <strong>Public League Top 10</strong> &mdash; Philadelphia Public League schools only
              </li>
              <li>
                <strong>Catholic League Top 5</strong> &mdash; Philadelphia Catholic League schools only
              </li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed">
              Teams are evaluated each week. A big win can vault you up; a bad loss can drop you.
              Head-to-head matchups between ranked teams carry extra weight. Injuries, suspensions,
              and strength of remaining schedule are factored in for borderline teams.
            </p>
          </div>
        )}
      </div>

      {/* 11. Editorial Attribution */}
      <div className="text-center mb-6">
        <p className="text-xs text-gray-400">
          Ranked by <span className="font-bold text-gray-500">Mike Wallace</span> &middot;{' '}
          <Link href="https://twitter.com/PhillySportsPak" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            @PhillySportsPak
          </Link>
        </p>
      </div>

      {/* 12. Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-300">
        <span className="flex items-center gap-1">
          <TrendingUp size={12} className="text-green-600" aria-hidden="true" /> Moved up
        </span>
        <span className="flex items-center gap-1">
          <TrendingDown size={12} className="text-red-500" aria-hidden="true" /> Moved down
        </span>
        <span className="flex items-center gap-1">
          <Minus size={12} className="text-gray-300" aria-hidden="true" /> No change
        </span>
        <span className="flex items-center gap-1">
          <Sparkles size={12} className="text-blue-500" aria-hidden="true" /> New entry
        </span>
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
