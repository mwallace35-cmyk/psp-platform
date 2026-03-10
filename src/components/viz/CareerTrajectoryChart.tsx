'use client';

import React, { useState, useMemo } from 'react';

interface SeasonData {
  year: string;
  value: number;
  label?: string;
  isChampionship?: boolean;
}

interface CareerTrajectoryChartProps {
  seasons: SeasonData[];
  stat: string;
  sport: string;
  leagueAvg?: Array<{ year: string; value: number }>;
  maxValue?: number;
  height?: number;
  hideAverage?: boolean;
}

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#ea580c',
  baseball: '#dc2626',
  track: '#7c3aed',
  lacrosse: '#0891b2',
  wrestling: '#ca8a04',
  soccer: '#059669',
};

function CareerTrajectoryChart({
  seasons,
  stat,
  sport,
  leagueAvg,
  maxValue: propMaxValue,
  height = 300,
  hideAverage = false,
}: CareerTrajectoryChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Use a properly-sized viewBox so text renders at reasonable proportions
  const vbWidth = 600;
  const vbHeight = height;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartWidth = vbWidth - padding.left - padding.right;
  const chartHeight = vbHeight - padding.top - padding.bottom;

  // Find data bounds
  const allValues = [
    ...seasons.map((s) => s.value),
    ...(leagueAvg?.map((a) => a.value) || []),
  ].filter((v) => v != null);

  const minValue = Math.min(...allValues, 0);
  const maxValue = propMaxValue || Math.max(...allValues, 1);
  const range = maxValue - minValue || 1;

  // Color scheme
  const sportColor = SPORT_COLORS[sport.toLowerCase()] || '#f0a500';
  const leagueColor = '#d1d5db';

  // Scale functions
  const scaleX = (index: number) => (index / Math.max(seasons.length - 1, 1)) * chartWidth;
  const scaleY = (value: number) => chartHeight - ((value - minValue) / range) * chartHeight;

  // Build player line path
  const playerPathData = useMemo(() => {
    return seasons
      .map((s, i) => {
        const x = padding.left + scaleX(i);
        const y = padding.top + scaleY(s.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [seasons, chartHeight, chartWidth]);

  // Build league average line path
  const leaguePathData = useMemo(() => {
    if (!leagueAvg || leagueAvg.length === 0) return '';
    return leagueAvg
      .map((a, i) => {
        const x = padding.left + scaleX(i);
        const y = padding.top + scaleY(a.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [leagueAvg, chartHeight, chartWidth]);

  // Find peak season
  const peakIndex = useMemo(() => {
    return seasons.reduce((maxIdx, season, idx) => {
      return season.value > seasons[maxIdx].value ? idx : maxIdx;
    }, 0);
  }, [seasons]);

  const peakValue = seasons[peakIndex]?.value;
  const peakX = padding.left + scaleX(peakIndex);
  const peakY = padding.top + scaleY(peakValue);

  // Y-axis labels
  const yAxisTicks = useMemo(() => {
    const tickCount = 4;
    const ticks: Array<{ value: number; label: string }> = [];
    for (let i = 0; i <= tickCount; i++) {
      const value = minValue + (i / tickCount) * range;
      ticks.push({
        value,
        label: Math.round(value).toLocaleString(),
      });
    }
    return ticks;
  }, [minValue, range]);

  // Format year label: "2008-09" → "'08-09", "2020-21" → "'20-21"
  const formatYear = (year: string) => {
    if (year.includes('-')) {
      const parts = year.split('-');
      return `'${parts[0].slice(-2)}-${parts[1].slice(-2)}`;
    }
    return year.slice(-4);
  };

  // Build accessible description
  const accessibleDesc = `Career trajectory chart for ${stat}: ${seasons.map(s => `${s.year}: ${Math.round(s.value).toLocaleString()}`).join(', ')}`;

  const fontSize = 12;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-lg font-bold text-navy">Career Trajectory</h3>
        <p className="text-sm text-gray-500">{stat}</p>
      </div>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="font-sans"
        role="img"
        aria-label={accessibleDesc}
      >
        <title>Career Trajectory — {stat}</title>
        <desc>{accessibleDesc}</desc>

        {/* Grid lines */}
        {yAxisTicks.map((tick) => {
          const y = padding.top + scaleY(tick.value);
          return (
            <line
              key={`gridline-${tick.value}`}
              x1={padding.left}
              y1={y}
              x2={padding.left + chartWidth}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#4b5563"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        {yAxisTicks.map((tick) => {
          const y = padding.top + scaleY(tick.value);
          return (
            <g key={`yaxis-${tick.value}`}>
              <text
                x={padding.left - 8}
                y={y}
                fontSize={fontSize}
                textAnchor="end"
                dy="0.35em"
                fill="#6b7280"
              >
                {tick.label}
              </text>
              <line
                x1={padding.left - 4}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="#4b5563"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* League average line */}
        {!hideAverage && leaguePathData && (
          <path
            d={leaguePathData}
            fill="none"
            stroke={leagueColor}
            strokeWidth="2"
            strokeDasharray="6,4"
            opacity="0.7"
          />
        )}

        {/* Player line */}
        <path
          d={playerPathData}
          fill="none"
          stroke={sportColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Peak season highlight */}
        <circle
          cx={peakX}
          cy={peakY}
          r="6"
          fill={sportColor}
          stroke="white"
          strokeWidth="2"
        />

        {/* Data point circles and interaction areas */}
        {seasons.map((season, i) => {
          const x = padding.left + scaleX(i);
          const y = padding.top + scaleY(season.value);
          const isHovered = hoveredIndex === i;

          return (
            <g key={`point-${i}`} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* Invisible hit area */}
              <circle cx={x} cy={y} r="12" fill="transparent" style={{ cursor: 'pointer' }} />

              {/* Visible circle on hover */}
              {isHovered && (
                <>
                  <circle cx={x} cy={y} r="10" fill={sportColor} opacity="0.15" />
                  <circle cx={x} cy={y} r="5" fill={sportColor} />
                </>
              )}

              {/* Championship trophy icon */}
              {season.isChampionship && (
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fontSize="14"
                  aria-label="Championship season"
                >
                  🏆
                </text>
              )}

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 40}
                    y={y - 36}
                    width="80"
                    height="24"
                    rx="4"
                    fill={sportColor}
                    opacity="0.95"
                  />
                  <text
                    x={x}
                    y={y - 20}
                    fontSize={fontSize}
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="white"
                  >
                    {Math.round(season.value).toLocaleString()} ({formatYear(season.year)})
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {seasons.map((season, i) => {
          const x = padding.left + scaleX(i);
          return (
            <g key={`xaxis-${i}`}>
              <line
                x1={x}
                y1={padding.top + chartHeight}
                x2={x}
                y2={padding.top + chartHeight + 6}
                stroke="#4b5563"
                strokeWidth="1"
              />
              <text
                x={x}
                y={padding.top + chartHeight + 22}
                fontSize={fontSize}
                textAnchor="middle"
                fill="#6b7280"
              >
                {formatYear(season.year)}
              </text>
            </g>
          );
        })}

        {/* X-axis line */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#4b5563"
          strokeWidth="1"
        />

        {/* Legend */}
        <g transform={`translate(${padding.left + 10}, 14)`}>
          <circle cx="0" cy="0" r="4" fill={sportColor} />
          <text x="10" y="0" fontSize={fontSize} dy="0.35em" fill="#374151">
            Player
          </text>

          {!hideAverage && leagueAvg && (
            <>
              <line x1="70" y1="0" x2="85" y2="0" stroke={leagueColor} strokeWidth="2" strokeDasharray="4,3" />
              <text x="92" y="0" fontSize={fontSize} dy="0.35em" fill="#6b7280">
                League Avg
              </text>
            </>
          )}
        </g>
      </svg>

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase">Peak</p>
          <p className="text-lg font-bold text-navy">{Math.round(peakValue).toLocaleString()}</p>
          <p className="text-xs text-gray-600">{seasons[peakIndex]?.year || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase">Average</p>
          <p className="text-lg font-bold text-navy">
            {Math.round(seasons.reduce((sum, s) => sum + s.value, 0) / seasons.length).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase">Seasons</p>
          <p className="text-lg font-bold text-navy">{seasons.length}</p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CareerTrajectoryChart);
