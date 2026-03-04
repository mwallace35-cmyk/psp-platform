'use client';

import React from 'react';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDot?: boolean;
}

export default function SparkLine({
  data,
  width = 80,
  height = 24,
  color = '#f0a500',
  showDot = false,
}: SparkLineProps) {
  // Handle edge cases
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <text x={width / 2} y={height / 2} textAnchor="middle" dy="0.3em" fill="#999" fontSize="10">
          —
        </text>
      </svg>
    );
  }

  if (data.length === 1) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <circle cx={width / 2} cy={height / 2} r="2" fill={color} />
      </svg>
    );
  }

  // Find min and max for normalization
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid division by zero

  // Normalize data to fit within SVG height (with padding)
  const padding = 2;
  const usableHeight = height - padding * 2;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const normalizedValue = (value - min) / range;
    const y = height - padding - normalizedValue * usableHeight;
    return `${x},${y}`;
  });

  const pointsString = points.join(' ');
  const lastX = (width * (data.length - 1)) / (data.length - 1);
  const lastValue = data[data.length - 1];
  const normalizedLastValue = (lastValue - min) / range;
  const lastY = height - padding - normalizedLastValue * usableHeight;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={pointsString}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {showDot && <circle cx={lastX} cy={lastY} r="2" fill={color} />}
    </svg>
  );
}
