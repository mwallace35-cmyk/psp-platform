/**
 * SkeletonCard — Pulsing placeholder card for loading states.
 * Matches the standard card style: rounded-xl, p-6, navy bg with lighter pulse.
 */
export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[var(--psp-navy-mid)] border border-gray-700/50 p-6 ${className}`}
    >
      {/* Title line */}
      <div className="h-4 w-3/5 rounded bg-white/5 mb-4" />
      {/* Body lines */}
      <div className="space-y-3">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-4/5 rounded bg-white/5" />
        <div className="h-3 w-2/3 rounded bg-white/5" />
      </div>
    </div>
  );
}
