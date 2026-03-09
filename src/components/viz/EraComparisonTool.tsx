'use client';

import React, { useState, useMemo } from 'react';

interface PlayerData {
  name: string;
  stats: Record<string, number>;
  era: string;
  seasonYear: number;
}

interface EraComparisonToolProps {
  players: PlayerData[];
  sport: string;
  maxPlayers?: number;
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

const PLAYER_COLORS = [
  '#f0a500', // gold
  '#3b82f6', // blue
  '#ef4444', // red
  '#8b5cf6', // purple
];

interface RadarPoint {
  angle: number;
  x: number;
  y: number;
}

function EraComparisonTool({
  players,
  sport,
  maxPlayers = 4,
}: EraComparisonToolProps) {
  const [useAdjusted, setUseAdjusted] = useState(false);
  const [selectedStats, setSelectedStats] = useState<Set<string>>(
    new Set(Object.keys(players[0]?.stats || {}).slice(0, 5))
  );

  const displayPlayers = players.slice(0, maxPlayers);

  // Get all available stat keys
  const allStats = useMemo(() => {
    const statSet = new Set<string>();
    players.forEach((p) => {
      Object.keys(p.stats).forEach((key) => statSet.add(key));
    });
    return Array.from(statSet);
  }, [players]);

  // Compute era statistics for normalization
  const eraStats = useMemo(() => {
    const stats: Record<string, { min: number; max: number; mean: number; stdDev: number }> = {};

    allStats.forEach((stat) => {
      const values = players
        .map((p) => p.stats[stat])
        .filter((v) => v != null && typeof v === 'number');

      if (values.length === 0) return;

      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean = values.reduce((a, b) => a + b) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      stats[stat] = { min, max, mean, stdDev };
    });

    return stats;
  }, [players, allStats]);

  // Normalize stat value (z-score)
  const normalizeValue = (stat: string, value: number): number => {
    const eraData = eraStats[stat];
    if (!eraData || eraData.stdDev === 0) return 0;
    return (value - eraData.mean) / eraData.stdDev;
  };

  // Scale normalized value to 0-100 for visualization
  const scaleValue = (normalizedValue: number): number => {
    // Clamp to -3 to +3 stdDev range, then scale to 0-100
    return Math.max(0, Math.min(100, ((normalizedValue + 3) / 6) * 100));
  };

  // Build radar chart coordinates
  const radarSize = 200;
  const radarCenter = radarSize / 2;
  const radarRadius = radarSize / 2.5;

  const statAngles = useMemo(() => {
    const selectedStatArray = Array.from(selectedStats);
    const angleStep = (Math.PI * 2) / selectedStatArray.length;
    const angles: Record<string, number> = {};
    selectedStatArray.forEach((stat, idx) => {
      angles[stat] = idx * angleStep - Math.PI / 2; // Start at top
    });
    return angles;
  }, [selectedStats]);

  const getRadarPoint = (stat: string, normalizedValue: number): RadarPoint => {
    const angle = statAngles[stat] || 0;
    const scaledValue = scaleValue(normalizedValue);
    const radius = (scaledValue / 100) * radarRadius;
    const x = radarCenter + radius * Math.cos(angle);
    const y = radarCenter + radius * Math.sin(angle);

    return { angle, x, y };
  };

  // Build radar polygon path for each player
  const radarPaths = useMemo(() => {
    const paths: Record<string, string> = {};

    displayPlayers.forEach((player, playerIdx) => {
      const selectedStatArray = Array.from(selectedStats);
      const points = selectedStatArray
        .map((stat) => {
          const rawValue = player.stats[stat] || 0;
          const normalized = useAdjusted ? normalizeValue(stat, rawValue) : (rawValue / 100) - 0.5;
          const point = getRadarPoint(stat, normalized);
          return `${point.x},${point.y}`;
        })
        .join(' ');

      paths[`player-${playerIdx}`] = points;
    });

    return paths;
  }, [displayPlayers, selectedStats, useAdjusted, statAngles]);

  // Radar stat labels
  const radarLabels = useMemo(() => {
    const selectedStatArray = Array.from(selectedStats);
    return selectedStatArray.map((stat) => {
      const angle = statAngles[stat] || 0;
      const labelRadius = radarRadius + 20;
      const x = radarCenter + labelRadius * Math.cos(angle);
      const y = radarCenter + labelRadius * Math.sin(angle);
      return { stat, x, y };
    });
  }, [selectedStats, statAngles]);

  const toggleStat = (stat: string) => {
    const newStats = new Set(selectedStats);
    if (newStats.has(stat)) {
      newStats.delete(stat);
    } else {
      newStats.add(stat);
    }
    setSelectedStats(newStats);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-navy">Era Comparison Tool</h3>
        <p className="text-sm text-gray-500">Compare player stats across different eras</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useAdjusted}
              onChange={(e) => setUseAdjusted(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              {useAdjusted ? 'Era-Adjusted (Z-Score)' : 'Raw Stats'}
            </span>
          </label>
        </div>

        {/* Player count */}
        <div className="text-sm text-gray-600">
          Showing {displayPlayers.length} of {Math.min(players.length, maxPlayers)} players
        </div>
      </div>

      {/* Stat selector pills */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Select Stats</p>
        <div className="flex flex-wrap gap-2">
          {allStats.slice(0, 8).map((stat) => (
            <button
              key={stat}
              onClick={() => toggleStat(stat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedStats.has(stat)
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="flex justify-center">
          <svg
            width={radarSize}
            height={radarSize}
            viewBox={`0 0 ${radarSize} ${radarSize}`}
            className="font-sans"
            role="img"
            aria-label="Radar chart comparing player stats across selected statistical categories"
          >
            <title>Era Comparison Radar Chart</title>
            {/* Grid circles */}
            {[25, 50, 75, 100].map((percent) => {
              const radius = (percent / 100) * radarRadius;
              return (
                <circle
                  key={`grid-${percent}`}
                  cx={radarCenter}
                  cy={radarCenter}
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Spokes */}
            {Array.from(selectedStats).map((stat) => {
              const angle = statAngles[stat] || 0;
              const x = radarCenter + radarRadius * Math.cos(angle);
              const y = radarCenter + radarRadius * Math.sin(angle);
              return (
                <line
                  key={`spoke-${stat}`}
                  x1={radarCenter}
                  y1={radarCenter}
                  x2={x}
                  y2={y}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
              );
            })}

            {/* Player polygons */}
            {displayPlayers.map((player, idx) => {
              const pathData = radarPaths[`player-${idx}`];
              const color = PLAYER_COLORS[idx % PLAYER_COLORS.length];
              if (!pathData) return null;

              return (
                <g key={`player-${idx}`}>
                  {/* Filled polygon */}
                  <polygon
                    points={pathData}
                    fill={color}
                    opacity="0.2"
                    stroke={color}
                    strokeWidth="2"
                  />
                  {/* Data points */}
                  {Array.from(selectedStats).map((stat, statIdx) => {
                    const rawValue = player.stats[stat] || 0;
                    const normalized = useAdjusted ? normalizeValue(stat, rawValue) : (rawValue / 100) - 0.5;
                    const point = getRadarPoint(stat, normalized);
                    return (
                      <circle
                        key={`point-${idx}-${statIdx}`}
                        cx={point.x}
                        cy={point.y}
                        r="2"
                        fill={color}
                        stroke="white"
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Stat labels */}
            {radarLabels.map((label) => (
              <text
                key={`label-${label.stat}`}
                x={label.x}
                y={label.y}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                fill="#374151"
              >
                {label.stat}
              </text>
            ))}

            {/* Center label */}
            <text
              x={radarCenter}
              y={radarCenter + 4}
              fontSize="10"
              textAnchor="middle"
              fill="#999"
            >
              0
            </text>
          </svg>
        </div>

        {/* Stats Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left font-bold text-gray-700 py-2 px-2">Player</th>
                {Array.from(selectedStats).map((stat) => (
                  <th
                    key={`th-${stat}`}
                    className="text-center font-bold text-gray-700 py-2 px-2 text-xs"
                  >
                    {stat}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayPlayers.map((player, idx) => (
                <tr key={`row-${idx}`} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-2 font-semibold text-navy">
                    <div>
                      <p>{player.name}</p>
                      <p className="text-xs text-gray-500">{player.era}</p>
                    </div>
                  </td>
                  {Array.from(selectedStats).map((stat) => {
                    const rawValue = player.stats[stat] || 0;
                    const normalized = useAdjusted ? normalizeValue(stat, rawValue) : rawValue;
                    const displayValue = useAdjusted ? normalized.toFixed(2) : rawValue.toFixed(1);
                    const isPositive = normalized > 0;

                    return (
                      <td
                        key={`cell-${idx}-${stat}`}
                        className={`text-center py-3 px-2 font-medium ${
                          useAdjusted && isPositive ? 'text-green-600' : useAdjusted ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Player Legend</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayPlayers.map((player, idx) => (
            <div key={`legend-${idx}`} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: PLAYER_COLORS[idx % PLAYER_COLORS.length] }}
              />
              <span className="text-sm text-gray-700">{player.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      {useAdjusted && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
          <p className="font-semibold mb-1">Era-Adjusted Stats (Z-Scores)</p>
          <p className="text-xs">
            Positive values indicate above-average performance for the era. Standard deviation units.
          </p>
        </div>
      )}
    </div>
  );
}

export default React.memo(EraComparisonTool);
