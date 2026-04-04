'use client';

interface TrendChartProps {
  history: number[];
  sportColor: string;
  maxRank?: number;
}

export default function TrendChart({ history, sportColor, maxRank = 12 }: TrendChartProps) {
  if (!history.length || !history.some(h => h > 0)) return null;

  const width = 80;
  const height = 32;
  const padX = 6;
  const padY = 4;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  // Map rank to Y: rank 1 = top (padY), maxRank = bottom (padY + plotH)
  function rankToY(rank: number): number {
    return padY + ((rank - 1) / (maxRank - 1)) * plotH;
  }

  function rankToX(index: number): number {
    if (history.length === 1) return width / 2;
    return padX + (index / (history.length - 1)) * plotW;
  }

  // Build segments (break on zero/unranked)
  const segments: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];

  history.forEach((rank, i) => {
    if (rank === 0) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    } else {
      current.push({ x: rankToX(i), y: rankToY(rank) });
    }
  });
  if (current.length > 0) segments.push(current);

  // Find last non-zero point for the filled dot
  let lastPoint: { x: number; y: number } | null = null;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i] > 0) {
      lastPoint = { x: rankToX(i), y: rankToY(history[i]) };
      break;
    }
  }

  return (
    <svg
      className="hidden md:block flex-shrink-0"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Rank trend (full season)"
    >
      <title>Rank trend (full season)</title>
      {segments.map((seg, si) => {
        if (seg.length < 2) return null;
        const points = seg.map(p => `${p.x},${p.y}`).join(' ');
        return (
          <polyline
            key={si}
            points={points}
            fill="none"
            stroke={sportColor}
            strokeOpacity={0.4}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      {/* Smaller dots for previous points */}
      {segments.flat().map((pt, i) => {
        const isLast = lastPoint && pt.x === lastPoint.x && pt.y === lastPoint.y;
        if (isLast) return null;
        return (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={1.5}
            fill={sportColor}
            fillOpacity={0.35}
          />
        );
      })}
      {/* Current week filled dot */}
      {lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={3}
          fill={sportColor}
        />
      )}
    </svg>
  );
}
