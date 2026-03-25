'use client';

import React, { useState, useMemo } from 'react';

interface SeasonRecord {
  year: number;
  wins: number;
  losses: number;
  championships?: string[];
  coach?: string;
}

interface DynastyTimelineProps {
  schoolName: string;
  seasons: SeasonRecord[];
  sport: string;
}

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#dc2626',
  track: '#7c3aed',
  lacrosse: '#0891b2',
  wrestling: '#ca8a04',
  soccer: '#059669',
};

const GOLD_DIAMOND = (
  <svg viewBox="0 0 24 24" width="12" height="12">
    <path
      d="M12 2L20 12L12 22L4 12L12 2Z"
      fill="#f0a500"
      stroke="#ffffff"
      strokeWidth="1"
    />
  </svg>
);

function DynastyTimeline({ schoolName, seasons, sport }: DynastyTimelineProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const sportColor = SPORT_COLORS[sport.toLowerCase()] || '#f0a500';

  // Compute win percentage for color gradient
  const getWinPercentage = (wins: number, losses: number): number => {
    const total = wins + losses;
    return total > 0 ? wins / total : 0;
  };

  // Color scale from red (0%) to green (100%)
  const getSegmentColor = (winPct: number): string => {
    if (winPct <= 0.3) return '#ef4444'; // red-500
    if (winPct <= 0.5) return '#f97316'; // orange-500
    if (winPct <= 0.7) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  // Group seasons by coaching era (simple: consecutive same coach = era)
  const eras = useMemo(() => {
    const eraGroups: Array<{
      coach?: string;
      startYear: number;
      endYear: number;
      seasons: SeasonRecord[];
    }> = [];

    let currentEra = {
      coach: seasons[0]?.coach,
      startYear: seasons[0]?.year || 0,
      seasons: [seasons[0]],
    };

    for (let i = 1; i < seasons.length; i++) {
      const season = seasons[i];
      if (season.coach !== currentEra.coach && season.year - (currentEra.seasons[currentEra.seasons.length - 1]?.year || 0) === 1) {
        // New era started
        eraGroups.push({
          ...currentEra,
          endYear: currentEra.seasons[currentEra.seasons.length - 1]?.year || 0,
        });
        currentEra = {
          coach: season.coach,
          startYear: season.year,
          seasons: [season],
        };
      } else {
        currentEra.seasons.push(season);
      }
    }

    // Push final era
    if (currentEra.seasons.length > 0) {
      eraGroups.push({
        ...currentEra,
        endYear: currentEra.seasons[currentEra.seasons.length - 1]?.year || 0,
      });
    }

    return eraGroups;
  }, [seasons]);

  const timelineWidth = 100;
  const segmentWidth = timelineWidth / seasons.length;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-navy">{schoolName} Dynasty Timeline</h3>
        <p className="text-sm text-gray-400">Win percentage by season (2000–Present)</p>
      </div>

      {/* Main timeline SVG */}
      <div className="overflow-x-auto mb-6 pb-2">
        <svg
          width={Math.max(400, seasons.length * 12)}
          height="140"
          viewBox={`0 0 ${Math.max(400, seasons.length * 12)} 140`}
          className="font-sans"
          preserveAspectRatio="xMinYMid meet"
          role="img"
          aria-label="Dynasty timeline showing school's win-loss record by season"
        >
          <title>Dynasty Timeline</title>
          {/* Era background bands */}
          {eras.map((era, idx) => {
            const eraStartIdx = seasons.findIndex((s) => s.year === era.startYear);
            const eraEndIdx = seasons.findIndex((s) => s.year === era.endYear);
            const eraStartX = eraStartIdx * (timelineWidth / seasons.length);
            const eraWidth = (eraEndIdx - eraStartIdx + 1) * (timelineWidth / seasons.length);

            const bgColor = idx % 2 === 0 ? '#f8fafc' : '#f1f5f9';

            return (
              <rect
                key={`era-${idx}`}
                x={eraStartX}
                y="0"
                width={eraWidth}
                height="100"
                fill={bgColor}
                opacity="0.5"
              />
            );
          })}

          {/* Timeline segments (one per season) */}
          {seasons.map((season, idx) => {
            const x = idx * segmentWidth;
            const width = segmentWidth;
            const winPct = getWinPercentage(season.wins, season.losses);
            const barHeight = 60;
            const segColor = getSegmentColor(winPct);
            const isHovered = hoveredYear === season.year;

            return (
              <g
                key={`season-${season.year}`}
                onMouseEnter={() => setHoveredYear(season.year)}
                onMouseLeave={() => setHoveredYear(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Segment bar */}
                <rect
                  x={x + 1}
                  y={100 - barHeight * winPct}
                  width={width - 2}
                  height={barHeight * winPct}
                  fill={segColor}
                  opacity={isHovered ? 1 : 0.8}
                  className="transition-opacity"
                />

                {/* Championship markers (gold diamonds) */}
                {season.championships && season.championships.length > 0 && (
                  <g transform={`translate(${x + width / 2}, ${90 - barHeight * winPct - 8})`} aria-label="Championship year">
                    {GOLD_DIAMOND}
                  </g>
                )}

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    {/* Tooltip box background */}
                    <rect
                      x={x + 2}
                      y="10"
                      width="70"
                      height="35"
                      rx="3"
                      fill={segColor}
                      opacity="0.95"
                    />

                    {/* Tooltip text */}
                    <text x={x + 37} y="22" fontSize="11" fontWeight="bold" textAnchor="middle" fill="white">
                      {season.year}
                    </text>
                    <text x={x + 37} y="32" fontSize="10" textAnchor="middle" fill="white">
                      {season.wins}-{season.losses}
                    </text>
                    <text
                      x={x + 37}
                      y="42"
                      fontSize="9"
                      textAnchor="middle"
                      fill="white"
                      opacity="0.9"
                    >
                      {Math.round(winPct * 100)}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* X-axis */}
          <line x1="0" y1="100" x2={timelineWidth} y2="100" stroke="#d1d5db" strokeWidth="1" />

          {/* Year labels (show every 5 years) */}
          {seasons.map((season, idx) => {
            if (idx % 5 !== 0) return null;
            const x = idx * segmentWidth + segmentWidth / 2;
            return (
              <text
                key={`label-${season.year}`}
                x={x}
                y="115"
                fontSize="10"
                textAnchor="middle"
                fill="#6b7280"
              >
                {season.year}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded" />
          <span className="text-gray-700">70%+ Wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 rounded" />
          <span className="text-gray-700">50-70% Wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded" />
          <span className="text-gray-700">30-50% Wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            {GOLD_DIAMOND}
          </div>
          <span className="text-gray-700">Championship</span>
        </div>
      </div>

      {/* Era summary table */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Coaching Eras</h4>
        <div className="space-y-2">
          {eras.map((era, idx) => {
            const totalWins = era.seasons.reduce((sum, s) => sum + s.wins, 0);
            const totalLosses = era.seasons.reduce((sum, s) => sum + s.losses, 0);
            const eraWinPct = getWinPercentage(totalWins, totalLosses);

            return (
              <div
                key={`era-summary-${idx}`}
                className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">{era.coach || 'Unknown Coach'}</p>
                  <p className="text-xs text-gray-400">
                    {era.startYear}–{era.endYear} ({era.seasons.length} seasons)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-navy">
                    {totalWins}-{totalLosses}
                  </p>
                  <p className="text-xs text-gray-400">{Math.round(eraWinPct * 100)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(DynastyTimeline);
