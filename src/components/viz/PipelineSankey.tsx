'use client';

import React, { useState, useMemo } from 'react';

interface FlowData {
  from: string;
  to: string;
  count: number;
  names?: string[];
}

interface PipelineSankeyProps {
  flows: FlowData[];
  title?: string;
  subtitle?: string;
}

interface Position {
  x: number;
  y: number;
}

interface Node {
  name: string;
  level: 0 | 1 | 2; // HS, College, Pro
  x: number;
  y: number;
  totalFlow: number;
}

const LEVEL_NAMES: Record<number, string> = {
  0: 'High School',
  1: 'College',
  2: 'Professional',
};

const LEVEL_COLORS: Record<number, string> = {
  0: '#0a1628', // Navy
  1: '#3b82f6', // Blue
  2: '#f0a500', // Gold
};

function PipelineSankey({ flows, title = 'Player Pipeline', subtitle = 'High School → College → Pro' }: PipelineSankeyProps) {
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);

  // Build node structure from flows
  const nodes = useMemo(() => {
    const nodeMap: Record<string, { level: 0 | 1 | 2; totalFlow: number }> = {};

    flows.forEach((flow) => {
      const fromParts = flow.from.split('_');
      const toParts = flow.to.split('_');

      if (!nodeMap[flow.from]) {
        nodeMap[flow.from] = {
          level: (parseInt(fromParts[0]) as 0 | 1 | 2) || 0,
          totalFlow: 0,
        };
      }
      if (!nodeMap[flow.to]) {
        nodeMap[flow.to] = {
          level: (parseInt(toParts[0]) as 0 | 1 | 2) || 1,
          totalFlow: 0,
        };
      }

      nodeMap[flow.from].totalFlow += flow.count;
      nodeMap[flow.to].totalFlow += flow.count;
    });

    // Sort by total flow within each level
    const nodesByLevel: Record<number, string[]> = { 0: [], 1: [], 2: [] };
    Object.entries(nodeMap).forEach(([name, data]) => {
      nodesByLevel[data.level].push(name);
    });

    Object.values(nodesByLevel).forEach((level) => {
      level.sort((a, b) => (nodeMap[b]?.totalFlow || 0) - (nodeMap[a]?.totalFlow || 0));
    });

    return { nodeMap, nodesByLevel };
  }, [flows]);

  // Calculate positions
  const positions = useMemo(() => {
    const svgHeight = 500;
    const positions: Record<string, Position> = {};
    const levelXPositions = [50, 350, 650];
    const levelSpacing = 150;

    // Position nodes within each level
    Object.entries(nodes.nodesByLevel).forEach((levelEntry) => {
      const levelIdx = parseInt(levelEntry[0]);
      const nodeNames = levelEntry[1];
      const x = levelXPositions[levelIdx];
      const spacing = svgHeight / Math.max(nodeNames.length + 1, 2);

      nodeNames.forEach((name, idx) => {
        positions[name] = {
          x,
          y: spacing * (idx + 1),
        };
      });
    });

    return positions;
  }, [nodes]);

  // Calculate flow paths
  const flowPaths = useMemo(() => {
    const totalFlow = flows.reduce((sum, f) => sum + f.count, 0);
    const paths: Array<{
      from: string;
      to: string;
      d: string;
      width: number;
      opacity: number;
      count: number;
    }> = [];

    flows.forEach((flow) => {
      const fromPos = positions[flow.from];
      const toPos = positions[flow.to];

      if (!fromPos || !toPos) return;

      // Bezier curve
      const controlX = (fromPos.x + toPos.x) / 2;
      const d = `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${(fromPos.y + toPos.y) / 2} ${toPos.x} ${toPos.y}`;

      const width = Math.max(2, (flow.count / totalFlow) * 30);
      const opacity = 0.6;

      paths.push({
        from: flow.from,
        to: flow.to,
        d,
        width,
        opacity,
        count: flow.count,
      });
    });

    return paths;
  }, [flows, positions]);

  // Node display info
  const nodeInfo = useMemo(() => {
    return Object.entries(positions).map(([name, pos]) => {
      const parts = name.split('_');
      const level = (parseInt(parts[0]) as 0 | 1 | 2) || 0;
      const displayName = parts.slice(1).join(' ');
      const totalFlow = nodes.nodeMap[name]?.totalFlow || 0;

      return {
        name,
        displayName,
        level,
        x: pos.x,
        y: pos.y,
        totalFlow,
      };
    });
  }, [positions, nodes]);

  // Maximum flow for scaling
  const maxFlow = Math.max(...flows.map((f) => f.count));

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-navy">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* SVG Sankey Diagram */}
      <div className="overflow-x-auto mb-6 bg-gray-50 rounded-lg p-2">
        <svg
          width="900"
          height="500"
          viewBox="0 0 900 500"
          className="font-sans min-w-full"
          style={{ minWidth: 'min(100%, 900px)' }}
          role="img"
          aria-label="Player pipeline Sankey diagram showing flow from high school to college to professional"
        >
          <title>Player Pipeline Sankey Diagram</title>
          {/* Flow paths */}
          {flowPaths.map((path, idx) => {
            const flowKey = `${path.from}-${path.to}`;
            const isHovered = hoveredFlow === flowKey;

            return (
              <path
                key={`flow-${idx}`}
                d={path.d}
                fill="none"
                stroke="#6b7280"
                strokeWidth={path.width}
                opacity={isHovered ? 0.9 : path.opacity}
                onMouseEnter={() => setHoveredFlow(flowKey)}
                onMouseLeave={() => setHoveredFlow(null)}
                style={{ cursor: 'pointer', transition: 'opacity 200ms' }}
              />
            );
          })}

          {/* Nodes */}
          {nodeInfo.map((node) => {
            const isConnected =
              hoveredFlow === null ||
              hoveredFlow?.startsWith(node.name) ||
              hoveredFlow?.endsWith(node.name);

            const nodeRadius = Math.max(12, Math.min(30, (node.totalFlow / maxFlow) * 30));

            return (
              <g key={`node-${node.name}`} opacity={isConnected ? 1 : 0.3} style={{ transition: 'opacity 200ms' }}>
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  fill={LEVEL_COLORS[node.level]}
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  dy="0.3em"
                  fill="white"
                  pointerEvents="none"
                >
                  {node.totalFlow}
                </text>

                {/* Node name (below circle) */}
                <text
                  x={node.x}
                  y={node.y + nodeRadius + 15}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#374151"
                  pointerEvents="none"
                >
                  {node.displayName}
                </text>
              </g>
            );
          })}

          {/* Level labels */}
          {[0, 1, 2].map((level) => (
            <text
              key={`level-${level}`}
              x={[50, 350, 650][level]}
              y="20"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fill={LEVEL_COLORS[level as 0 | 1 | 2]}
            >
              {LEVEL_NAMES[level]}
            </text>
          ))}
        </svg>
      </div>

      {/* Flow details table */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4 text-sm">Flow Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">From</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">To</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">Count</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">Players</th>
              </tr>
            </thead>
            <tbody>
              {flows
                .sort((a, b) => b.count - a.count)
                .map((flow, idx) => {
                  const fromParts = flow.from.split('_');
                  const toParts = flow.to.split('_');
                  const fromName = fromParts.slice(1).join(' ');
                  const toName = toParts.slice(1).join(' ');

                  return (
                    <tr
                      key={`detail-${idx}`}
                      className="border-b border-gray-200 hover:bg-gray-50"
                      onMouseEnter={() => setHoveredFlow(`${flow.from}-${flow.to}`)}
                      onMouseLeave={() => setHoveredFlow(null)}
                    >
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded text-white text-xs font-semibold" style={{ backgroundColor: LEVEL_COLORS[0] }}>
                          {fromName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded text-white text-xs font-semibold" style={{ backgroundColor: LEVEL_COLORS[parseInt(toParts[0]) as 0 | 1 | 2] }}>
                          {toName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-navy">{flow.count}</td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {flow.names && flow.names.length > 0 ? (
                          <button
                            className="text-blue-600 hover:underline text-xs font-semibold"
                            onClick={() => {
                              if (flow.names && flow.names.length > 0) {
                                alert(`Players: ${flow.names.slice(0, 5).join(', ')}${flow.names.length > 5 ? ` ...and ${flow.names.length - 5} more` : ''}`);
                              }
                            }}
                          >
                            View List
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
        <p className="font-semibold mb-2">About this diagram:</p>
        <ul className="text-xs space-y-1">
          <li>• <strong>Node size</strong> represents total player count</li>
          <li>• <strong>Flow width</strong> represents number of players in each pipeline</li>
          <li>• <strong>Colors</strong> indicate stage: Navy (High School), Blue (College), Gold (Professional)</li>
        </ul>
      </div>
    </div>
  );
}

export default React.memo(PipelineSankey);
