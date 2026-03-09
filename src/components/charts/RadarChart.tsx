'use client';

import { useState } from 'react';

export interface RadarStat {
  label: string;
  value: number;
  max: number;
}

export interface RadarPlayer {
  name: string;
  school: string;
  color: string;
  stats: RadarStat[];
}

interface RadarChartProps {
  players: RadarPlayer[];
  size?: number;
}

export default function RadarChart({ players, size = 400 }: RadarChartProps) {
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--psp-gray-500)' }}>
        No data available
      </div>
    );
  }

  // Use 4-6 stats depending on available data
  const numStats = Math.min(players[0]?.stats?.length || 4, 6);
  const stats = players[0]?.stats?.slice(0, numStats) || [];

  if (stats.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--psp-gray-500)' }}>
        No stats available
      </div>
    );
  }

  const center = size / 2;
  const maxRadius = size * 0.35;
  const numLevels = 4;
  const angleSlice = (Math.PI * 2) / stats.length;

  // Calculate point position on radar
  const getCoordinates = (statIndex: number, value: number, max: number): [number, number] => {
    const angle = angleSlice * statIndex - Math.PI / 2;
    const radius = (value / max) * maxRadius;
    return [center + radius * Math.cos(angle), center + radius * Math.sin(angle)];
  };

  // Generate polygon points for a player
  const getPolygonPoints = (playerStats: RadarStat[]): string => {
    return playerStats
      .slice(0, numStats)
      .map((stat, idx) => {
        const max = stat.max || 100;
        const [x, y] = getCoordinates(idx, stat.value, max);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const colors = ['var(--psp-gold, #f0a500)', 'var(--psp-blue, #3b82f6)', 'var(--psp-success, #22c55e)', 'var(--psp-error, #ef4444)'];

  const playerNames = players.map(p => p.name).join(' vs ');

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: '100%', maxWidth: `${size}px` }}>
        <svg
          role="img"
          aria-label={`Stat comparison radar chart for ${playerNames}`}
          viewBox={`0 0 ${size} ${size}`}
          width="100%"
          height="auto"
          className="mb-4"
          style={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}
        >
        <title>Player Stat Comparison</title>
        {/* Grid circles */}
        {Array.from({ length: numLevels }).map((_, i) => {
          const r = ((i + 1) / numLevels) * maxRadius;
          return (
            <g key={`grid-${i}`}>
              <circle cx={center} cy={center} r={r} fill="none" stroke="var(--psp-gray-200, #f3f4f6)" strokeWidth="1" opacity={0.5} />
              {/* Grid label */}
              <text x={center + r + 5} y={center - 5} fill="var(--psp-gray-400, #9ca3af)" style={{ fontSize: '11px' }}>
                {Math.round(((i + 1) / numLevels) * 100)}%
              </text>
            </g>
          );
        })}

        {/* Axis lines and labels */}
        {stats.map((stat, idx) => {
          const [x, y] = getCoordinates(idx, stat.max || 100, stat.max || 100);
          const isHovered = hoveredAxis === idx;

          return (
            <g
              key={`axis-${idx}`}
              onMouseEnter={() => setHoveredAxis(idx)}
              onMouseLeave={() => setHoveredAxis(null)}
              onClick={() => setHoveredAxis(hoveredAxis === idx ? null : idx)}
              onFocus={() => setHoveredAxis(idx)}
              onBlur={() => setHoveredAxis(null)}
              tabIndex={0}
              role="button"
              aria-label={`${stat.label} stat axis`}
              style={{ cursor: 'pointer' }}
            >
              {/* Axis line */}
              <line x1={center} y1={center} x2={x} y2={y} stroke={isHovered ? 'var(--psp-blue, #3b82f6)' : 'var(--psp-gray-300, #e5e7eb)'} strokeWidth={isHovered ? 2 : 1} opacity={isHovered ? 1 : 0.5} style={{ transition: 'all 0.2s' }} />

              {/* Axis label */}
              <text
                x={x * 1.2}
                y={y * 1.2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--psp-navy, #0a1628)"
                fontWeight={isHovered ? 'bold' : '500'}
                style={{ fontSize: 'clamp(9px, 2vw, 11px)', transition: 'font-weight 0.2s' }}
              >
                {stat.label}
              </text>
            </g>
          );
        })}

        {/* Player polygons */}
        {players.map((player, playerIdx) => {
          const polygonPoints = getPolygonPoints(player.stats);
          const playerColor = colors[playerIdx % colors.length];

          return (
            <g key={`player-${playerIdx}`}>
              <polygon points={polygonPoints} fill={playerColor} fillOpacity="0.25" stroke={playerColor} strokeWidth="2" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))' }} />

              {/* Data points */}
              {player.stats.slice(0, numStats).map((stat, idx) => {
                const [x, y] = getCoordinates(idx, stat.value, stat.max || 100);
                return <circle key={`point-${playerIdx}-${idx}`} cx={x} cy={y} r={3} fill={playerColor} opacity={0.8} />;
              })}
            </g>
          );
        })}
        </svg>
      </div>

      {/* Visually-hidden data table for accessibility */}
      <div className="sr-only">
        <table>
          <thead>
            <tr>
              <th>Stat</th>
              {players.map((p, idx) => (
                <th key={idx}>{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.slice(0, numStats).map((stat, idx) => (
              <tr key={idx}>
                <td>{stat.label}</td>
                {players.map((p, pIdx) => (
                  <td key={pIdx}>{p.stats[idx]?.value || 'N/A'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {players.map((player, idx) => (
          <div key={`legend-${idx}`} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: colors[idx % colors.length] }} />
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--psp-navy, #0a1628)' }}>
                {player.name}
              </div>
              <div className="text-xs" style={{ color: 'var(--psp-gray-500, #6b7280)' }}>
                {player.school}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
