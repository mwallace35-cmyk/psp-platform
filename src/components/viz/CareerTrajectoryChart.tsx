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

const TROPHY_SVG = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="#f0a500">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

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

  // Compute chart dimensions
  const width = 100;
  const padding = { top: 30, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

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
        label: Math.round(value).toString(),
      });
    }
    return ticks;
  }, [minValue, range]);

  // Handle mobile-friendly responsiveness
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const fontSize = isMobile ? 10 : 12;
  const labelSpacing = isMobile ? 2 : 1;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-lg font-bold text-navy">Career Trajectory</h3>
        <p className="text-sm text-gray-500">{stat}</p>
      </div>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="font-sans"
        role="img"
        aria-label="Career trajectory chart showing stat progression across seasons"
      >
        <title>Career Trajectory</title>
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
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
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
          vectorEffect="non-scaling-stroke"
        />

        {/* Y-axis labels */}
        {yAxisTicks.map((tick) => {
          const y = padding.top + scaleY(tick.value);
          return (
            <g key={`yaxis-${tick.value}`}>
              <text
                x={padding.left - 4}
                y={y}
                fontSize={fontSize}
                textAnchor="end"
                dy="0.3em"
                fill="#6b7280"
              >
                {tick.label}
              </text>
              <line
                x1={padding.left - 2}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="#4b5563"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
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
            strokeWidth="1.5"
            strokeDasharray="3,3"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
        )}

        {/* Player line */}
        <path
          d={playerPathData}
          fill="none"
          stroke={sportColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Peak season highlight */}
        <circle
          cx={peakX}
          cy={peakY}
          r="3"
          fill={sportColor}
          stroke="white"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data point circles and interaction areas */}
        {seasons.map((season, i) => {
          const x = padding.left + scaleX(i);
          const y = padding.top + scaleY(season.value);
          const isHovered = hoveredIndex === i;

          return (
            <g key={`point-${i}`} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* Invisible hit area */}
              <circle cx={x} cy={y} r="4" fill="transparent" style={{ cursor: 'pointer' }} />

              {/* Visible circle on hover */}
              {isHovered && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={sportColor}
                    opacity="0.2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill={sportColor}
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              )}

              {/* Championship trophy icon */}
              {season.isChampionship && (
                <g transform={`translate(${x - 1.5}, ${y - 6})`} aria-label="Championship season">
                  {TROPHY_SVG}
                </g>
              )}

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 8}
                    y={y - 20}
                    width="16"
                    height="14"
                    rx="2"
                    fill={sportColor}
                    opacity="0.95"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    fontSize={fontSize - 1}
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="white"
                    vectorEffect="non-scaling-stroke"
                  >
                    {Math.round(season.value)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* X-axis labels (every other year for mobile, every year for desktop) */}
        {seasons.map((season, i) => {
          const shouldShow = isMobile ? i % 2 === 0 : true;
          if (!shouldShow) return null;

          const x = padding.left + scaleX(i);
          return (
            <g key={`xaxis-${i}`}>
              <line
                x1={x}
                y1={padding.top + chartHeight}
                x2={x}
                y2={padding.top + chartHeight + 3}
                stroke="#4b5563"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={x}
                y={padding.top + chartHeight + 12}
                fontSize={fontSize}
                textAnchor="middle"
                fill="#6b7280"
                transform={`rotate(${isMobile ? 45 : 0}, ${x}, ${padding.top + chartHeight + 12})`}
              >
                {season.year.substring(0, 4)}
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
          vectorEffect="non-scaling-stroke"
        />

        {/* Legend */}
        <g transform={`translate(${padding.left}, 5)`}>
          <circle cx="0" cy="0" r="1.5" fill={sportColor} vectorEffect="non-scaling-stroke" />
          <text x="4" y="0" fontSize={fontSize} dy="0.3em" fill="#374151">
            Player
          </text>

          {!hideAverage && leagueAvg && (
            <>
              <line
                x1="30"
                y1="-1.5"
                x2="35"
                y2="-1.5"
                stroke={leagueColor}
                strokeWidth="1.5"
                strokeDasharray="2,2"
                vectorEffect="non-scaling-stroke"
              />
              <text x="38" y="0" fontSize={fontSize} dy="0.3em" fill="#6b7280">
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
          <p className="text-lg font-bold text-navy">{Math.round(peakValue)}</p>
          <p className="text-xs text-gray-600">{seasons[peakIndex]?.year || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase">Average</p>
          <p className="text-lg font-bold text-navy">
            {Math.round(seasons.reduce((sum, s) => sum + s.value, 0) / seasons.length)}
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
