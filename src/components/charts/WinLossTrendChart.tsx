'use client';

import { useState } from 'react';

export interface WinLossTrendData {
  season: string;
  wins: number;
  losses: number;
  ties?: number;
}

interface WinLossTrendChartProps {
  data: WinLossTrendData[];
  height?: number;
}

export default function WinLossTrendChart({ data, height = 400 }: WinLossTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--psp-gray-500)' }}>
        No season data available
      </div>
    );
  }

  // Show max 15 seasons (most recent)
  const displayData = data.slice(-15);
  const barHeight = 28;
  const margin = { left: 100, right: 80, top: 20, bottom: 20 };
  const svgHeight = displayData.length * barHeight + margin.top + margin.bottom;
  const svgWidth = 800;
  const chartWidth = svgWidth - margin.left - margin.right;

  // Find max total games for scaling
  const maxTotal = Math.max(...displayData.map(d => d.wins + d.losses + (d.ties || 0)));

  return (
    <div className="w-full overflow-x-auto -webkit-overflow-scrolling touch chart-scroll-container">
      <svg
        role="img"
        aria-label={`Win-loss trend chart showing ${displayData.length} seasons`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        height="auto"
        className="min-w-full"
        style={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif', minHeight: `${height}px` }}
      >
        <title>Win-Loss Record by Season</title>
        {/* Render bars */}
        {displayData.map((d, idx) => {
          const total = d.wins + d.losses + (d.ties || 0);
          if (total === 0) return null;

          const y = margin.top + idx * barHeight;
          const winWidth = (d.wins / maxTotal) * chartWidth;
          const lossWidth = (d.losses / maxTotal) * chartWidth;
          const tieWidth = ((d.ties || 0) / maxTotal) * chartWidth;

          const isHovered = hoveredIndex === idx;
          const opacity = isHovered ? 1 : 0.9;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex(hoveredIndex === idx ? null : idx)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`Season ${d.season}: ${d.wins}-${d.losses}${d.ties && d.ties > 0 ? `-${d.ties}` : ''}`}
              style={{ cursor: 'pointer' }}
            >
              {/* Wins bar (green) */}
              {d.wins > 0 && (
                <rect
                  x={margin.left}
                  y={y + 4}
                  width={winWidth}
                  height={20}
                  fill="var(--psp-success, #22c55e)"
                  opacity={opacity}
                  rx={4}
                  style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                />
              )}

              {/* Losses bar (red) */}
              {d.losses > 0 && (
                <rect
                  x={margin.left + winWidth}
                  y={y + 4}
                  width={lossWidth}
                  height={20}
                  fill="var(--psp-error, #ef4444)"
                  opacity={opacity}
                  rx={4}
                  style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                />
              )}

              {/* Ties bar (gray) */}
              {(d.ties || 0) > 0 && (
                <rect
                  x={margin.left + winWidth + lossWidth}
                  y={y + 4}
                  width={tieWidth}
                  height={20}
                  fill="var(--psp-gray-400, #9ca3af)"
                  opacity={opacity}
                  rx={4}
                  style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                />
              )}

              {/* Season label */}
              <text
                x={margin.left - 8}
                y={y + 16}
                textAnchor="end"
                fill="var(--psp-navy, #0a1628)"
                style={{ fontSize: '13px', transition: 'font-weight 0.2s', fontWeight: isHovered ? 'bold' : '500' }}
              >
                {d.season}
              </text>

              {/* Record text on the right */}
              <text
                x={margin.left + chartWidth + 8}
                y={y + 16}
                fill="var(--psp-navy, #0a1628)"
                style={{ fontSize: '13px', fontWeight: 'bold' }}
              >
                {d.wins}-{d.losses}{d.ties && d.ties > 0 ? `-${d.ties}` : ''}
              </text>

              {/* Hover tooltip */}
              {isHovered && total > 0 && (
                <g>
                  <rect
                    x={margin.left + chartWidth / 2 - 45}
                    y={y - 30}
                    width={90}
                    height={24}
                    fill="var(--psp-navy, #0a1628)"
                    rx={4}
                    opacity={0.9}
                  />
                  <text
                    x={margin.left + chartWidth / 2}
                    y={y - 13}
                    textAnchor="middle"
                    fill="white"
                    fontWeight="bold"
                    style={{ fontSize: '12px' }}
                  >
                    {d.wins}-{d.losses}{d.ties && d.ties > 0 ? `-${d.ties}` : ''}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g style={{ fontSize: '12px' }}>
          <rect x={svgWidth - 180} y={10} width={160} height={60} fill="white" stroke="var(--psp-gray-300, #e5e7eb)" rx={4} />

          <circle cx={svgWidth - 160} cy={26} r={6} fill="var(--psp-success, #22c55e)" />
          <text x={svgWidth - 145} y={31} fill="var(--psp-navy, #0a1628)" fontWeight="500">
            Wins
          </text>

          <circle cx={svgWidth - 160} cy={46} r={6} fill="var(--psp-error, #ef4444)" />
          <text x={svgWidth - 145} y={51} fill="var(--psp-navy, #0a1628)" fontWeight="500">
            Losses
          </text>

          <circle cx={svgWidth - 160} cy={66} r={6} fill="var(--psp-gray-400, #9ca3af)" />
          <text x={svgWidth - 145} y={71} fill="var(--psp-navy, #0a1628)" fontWeight="500">
            Ties
          </text>
        </g>
      </svg>
      {/* Visually-hidden data table for accessibility */}
      <div className="sr-only">
        <table>
          <thead>
            <tr>
              <th>Season</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Ties</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((d, idx) => (
              <tr key={idx}>
                <td>{d.season}</td>
                <td>{d.wins}</td>
                <td>{d.losses}</td>
                <td>{d.ties || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
