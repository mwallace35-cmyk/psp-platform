'use client';

import { useState } from 'react';

export interface TimelineChampionship {
  year: number;
  level: string;
  sport?: string;
  school_name?: string;
}

interface ChampionshipTimelineProps {
  championships: TimelineChampionship[];
  highlightSchool?: string;
}

export default function ChampionshipTimeline({ championships, highlightSchool }: ChampionshipTimelineProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  if (!championships || championships.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--psp-gray-500)' }}>
        No championship data available
      </div>
    );
  }

  // Sort by year and find min/max
  const sorted = [...championships].sort((a, b) => a.year - b.year);
  const minYear = sorted[0].year;
  const maxYear = sorted[sorted.length - 1].year;
  const yearRange = maxYear - minYear;

  // Group consecutive years for dynasty lines
  const dynasties: { startYear: number; endYear: number; count: number }[] = [];
  let currentStart = sorted[0].year;
  let currentEnd = sorted[0].year;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].year === currentEnd + 1) {
      currentEnd = sorted[i].year;
    } else {
      if (currentEnd - currentStart > 0) {
        dynasties.push({ startYear: currentStart, endYear: currentEnd, count: currentEnd - currentStart + 1 });
      }
      currentStart = sorted[i].year;
      currentEnd = sorted[i].year;
    }
  }
  if (currentEnd - currentStart > 0) {
    dynasties.push({ startYear: currentStart, endYear: currentEnd, count: currentEnd - currentStart + 1 });
  }

  // SVG dimensions
  const padding = 40;
  const svgHeight = 300;
  const svgWidth = Math.max(1000, 50 * yearRange + padding * 2);
  const timelineY = 150;
  const dotRadius = 6;

  // Helper to calculate X position
  const yearToX = (year: number): number => {
    if (yearRange === 0) return svgWidth / 2;
    return padding + ((year - minYear) / yearRange) * (svgWidth - padding * 2);
  };

  return (
    <div className="w-full overflow-x-auto -webkit-overflow-scrolling touch pb-4 chart-scroll-container">
      <svg
        role="img"
        aria-label={`Championship timeline showing ${sorted.length} titles from ${minYear} to ${maxYear}`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        height="auto"
        preserveAspectRatio="xMinYMid meet"
        className="min-w-full"
        style={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif', minHeight: '300px' }}
      >
        <title>Championship Timeline</title>
        {/* Timeline base line */}
        <line x1={padding} y1={timelineY} x2={svgWidth - padding} y2={timelineY} stroke="var(--psp-gray-300, #e5e7eb)" strokeWidth="2" />

        {/* Dynasty lines (consecutive championship years) */}
        {dynasties.map((dynasty, idx) => {
          const x1 = yearToX(dynasty.startYear);
          const x2 = yearToX(dynasty.endYear);
          return (
            <g key={`dynasty-${idx}`}>
              <line
                x1={x1}
                y1={timelineY - 40}
                x2={x2}
                y2={timelineY - 40}
                stroke="var(--psp-gold, #f0a500)"
                strokeWidth="3"
                opacity={0.5}
              />
              {/* Dynasty label */}
              <text
                x={(x1 + x2) / 2}
                y={timelineY - 50}
                textAnchor="middle"
                fill="var(--psp-gold, #f0a500)"
                fontWeight="bold"
                style={{ fontSize: 'clamp(9px, 2vw, 11px)' }}
              >
                {dynasty.count}-yr
              </text>
            </g>
          );
        })}

        {/* Year markers and dots */}
        {sorted.map((champ, idx) => {
          const x = yearToX(champ.year);
          const isHighlighted = champ.school_name === highlightSchool;
          const isHovered = hoveredYear === champ.year;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredYear(champ.year)}
              onMouseLeave={() => setHoveredYear(null)}
              onClick={() => setHoveredYear(hoveredYear === champ.year ? null : champ.year)}
              onFocus={() => setHoveredYear(champ.year)}
              onBlur={() => setHoveredYear(null)}
              tabIndex={0}
              role="button"
              aria-label={`${champ.year} championship - ${champ.level}${champ.sport ? ` ${champ.sport}` : ''}`}
              style={{ cursor: 'pointer' }}
            >
              {/* Championship dot */}
              <circle
                cx={x}
                cy={timelineY}
                r={isHighlighted ? 8 : isHovered ? 7 : dotRadius}
                fill={isHighlighted ? 'var(--psp-gold, #f0a500)' : 'var(--psp-blue, #3b82f6)'}
                style={{ transition: 'all 0.2s', opacity: isHovered ? 1 : 0.8 }}
              />

              {/* Year label below */}
              <text
                x={x}
                y={timelineY + 25}
                textAnchor="middle"
                fill="var(--psp-navy, #0a1628)"
                style={{ fontSize: '12px', transition: 'font-weight 0.2s', fontWeight: isHovered ? 'bold' : '500' }}
              >
                {champ.year}
              </text>

              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 55}
                    y={timelineY - 65}
                    width={110}
                    height={50}
                    fill="var(--psp-navy, #0a1628)"
                    rx={4}
                    opacity={0.95}
                  />
                  <text
                    x={x}
                    y={timelineY - 47}
                    textAnchor="middle"
                    fill="white"
                    fontWeight="bold"
                    style={{ fontSize: '12px' }}
                  >
                    {champ.year}
                  </text>
                  <text
                    x={x}
                    y={timelineY - 30}
                    textAnchor="middle"
                    fill="var(--psp-gold, #f0a500)"
                    fontWeight="normal"
                    style={{ fontSize: '11px' }}
                  >
                    {champ.level}
                  </text>
                  {champ.sport && (
                    <text
                      x={x}
                      y={timelineY - 16}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.8)"
                      style={{ fontSize: '10px' }}
                    >
                      {champ.sport}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g style={{ fontSize: '11px' }}>
          <rect x={padding} y={10} width={160} height={50} fill="white" stroke="var(--psp-gray-300, #e5e7eb)" rx={4} />

          <circle cx={padding + 15} cy={30} r={5} fill="var(--psp-blue, #3b82f6)" />
          <text x={padding + 30} y={34} fill="var(--psp-navy, #0a1628)" fontWeight="500">
            Championships
          </text>

          <circle cx={padding + 15} cy={50} r={5} fill="var(--psp-gold, #f0a500)" />
          <text x={padding + 30} y={54} fill="var(--psp-navy, #0a1628)" fontWeight="500">
            Highlighted School
          </text>
        </g>
      </svg>
      {/* Visually-hidden data table for accessibility */}
      <div className="sr-only">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Level</th>
              <th>Sport</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((champ, idx) => (
              <tr key={idx}>
                <td>{champ.year}</td>
                <td>{champ.level}</td>
                <td>{champ.sport || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
