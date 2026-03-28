'use client';

import React, { useState } from 'react';

interface TrendChartProps {
  data: { label: string; value: number }[];
  title: string;
  unit?: string; // "yards", "points", "wins", etc.
  height?: number; // default 200
}

/**
 * TrendChart — Year-over-year stat trend visualization
 * Shows 5-10 data points as an SVG line/area chart with labeled axes
 * Features:
 * - Line and area fill (PSP blue)
 * - Best year highlighted with gold dot
 * - Trend direction arrow comparing last 2 points
 * - Hover tooltips showing values
 * - Responsive scaling
 */
function TrendChart({
  data,
  title,
  unit = '',
  height = 200,
}: TrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Handle edge cases
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg bg-white border border-[var(--psp-gray-200)] p-6">
        <h3 className="psp-h3 mb-4" style={{ color: 'var(--psp-navy)' }}>
          {title}
        </h3>
        <div className="text-center py-8 text-gray-400">No data available</div>
      </div>
    );
  }

  // Find min and max for normalization
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Find best year (highest value)
  const bestIndex = values.indexOf(Math.max(...values));

  // Calculate trend (last vs second-to-last)
  const lastValue = values[values.length - 1];
  const prevValue = values[values.length - 2] || lastValue;
  const trendUp = lastValue >= prevValue;

  // SVG dimensions
  const width = 100; // percentage-based
  const padding = 8;
  const usableHeight = height - padding * 2;

  // Normalize data to fit within SVG
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * (100 - padding * 2) + padding;
    const normalizedValue = (d.value - min) / range;
    const y = height - padding - normalizedValue * usableHeight;
    return { x, y, ...d, index };
  });

  // Create path string for polyline
  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  // Create area path (closed polygon for fill)
  const areaPath = `
    M ${padding},${height - padding}
    L ${pointsString}
    L ${100 - padding},${height - padding}
    Z
  `;

  return (
    <div className="rounded-lg bg-white border border-[var(--psp-gray-200)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="psp-h3" style={{ color: 'var(--psp-navy)' }}>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="text-2xl"
            style={{ color: trendUp ? '#22c55e' : '#ef4444' }}
            aria-label={trendUp ? 'Trend up' : 'Trend down'}
          >
            {trendUp ? '▲' : '▼'}
          </span>
          <span className="text-sm text-gray-400">
            {trendUp ? '+' : ''}{(lastValue - prevValue).toFixed(0)}
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="w-full"
          role="img"
          aria-label={`Trend chart showing ${title} over ${data.length} periods`}
        >
          <title>{title} Trend</title>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <line
              key={`grid-${fraction}`}
              x1="0"
              y1={height - (fraction * usableHeight + padding)}
              x2="100"
              y2={height - (fraction * usableHeight + padding)}
              stroke="#e5e7eb"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="none"
          />

          {/* Line */}
          <polyline
            points={pointsString}
            fill="none"
            stroke="var(--psp-blue)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {points.map((p) => (
            <g key={`point-${p.index}`}>
              {/* Best year highlight */}
              {p.index === bestIndex && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="1.5"
                  fill="var(--psp-gold)"
                  stroke="white"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Interactive circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === p.index ? '2.5' : '1.2'}
                fill={hoveredIndex === p.index ? 'var(--psp-gold)' : 'var(--psp-blue)'}
                opacity={hoveredIndex === p.index ? '1' : '0.7'}
                onMouseEnter={() => setHoveredIndex(p.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute top-0 left-0 pointer-events-none">
            <div
              className="absolute -top-10 -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-xs whitespace-nowrap"
              style={{
                left: `${points[hoveredIndex].x}%`,
              }}
            >
              <div className="font-semibold">{points[hoveredIndex].label}</div>
              <div>
                {points[hoveredIndex].value} {unit}
              </div>
              {hoveredIndex === bestIndex && (
                <div style={{ color: 'var(--psp-gold)' }}>★ Best</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="mt-3 relative text-xs text-gray-400" style={{ height: '1.5em' }}>
        {points.map((p, i) => {
          // Show every nth label to avoid crowding
          const step = Math.ceil(data.length / 6);
          const showLabel = data.length <= 6 || i % step === 0 || i === data.length - 1;
          if (!showLabel) return null;
          return (
            <span
              key={`label-${i}`}
              className="absolute whitespace-nowrap"
              style={{
                left: `${p.x}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {p.label}
            </span>
          );
        })}
      </div>

      {/* Y-axis label */}
      {unit && (
        <div className="mt-2 text-xs text-gray-400 text-right">
          {unit}
        </div>
      )}
    </div>
  );
}

export default React.memo(TrendChart);
