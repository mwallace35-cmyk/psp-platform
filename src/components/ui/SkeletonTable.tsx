/**
 * SkeletonTable — Pulsing placeholder table with header row + 5 data rows.
 * Dark navy theme with bg-white/5 pulse bars.
 */
export default function SkeletonTable({
  rows = 5,
  columns = 4,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[var(--psp-navy-mid)] border border-gray-700/50 overflow-hidden ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading table"
    >
      {/* Header row */}
      <div className="flex gap-4 px-4 py-3 border-b border-gray-700/50">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="h-3 rounded bg-white/10"
            style={{ flex: i === 0 ? "0 0 80px" : "1" }}
          />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 px-4 py-3 border-b border-gray-700/30 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className="h-3 rounded bg-white/5"
              style={{ flex: colIdx === 0 ? "0 0 80px" : "1" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
