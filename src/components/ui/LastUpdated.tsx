/**
 * LastUpdated — relative-time freshness label for dynamic widgets.
 *
 * Phase 5 / audit CC-8 fix. Drop into any widget that shows time-sensitive
 * data so users know when it was last refreshed. Renders server-side to
 * avoid hydration mismatch on the timestamp text.
 *
 * Usage:
 *   <LastUpdated date={new Date('2026-04-08T07:20:00Z')} />
 *   <LastUpdated date={apiResponse.updatedAt} prefix="Refreshed" />
 */

interface LastUpdatedProps {
  date: Date | string | number | null | undefined;
  prefix?: string;
  className?: string;
}

function formatRelative(date: Date): string {
  const now = Date.now();
  const then = date.getTime();
  const diffMs = now - then;
  if (diffMs < 0) return "just now";

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return "just now";
  if (min < 60) return `${min} min${min === 1 ? "" : "s"} ago`;
  if (hr < 24) return `${hr} hr${hr === 1 ? "" : "s"} ago`;
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  if (day < 30) return `${Math.floor(day / 7)} week${day < 14 ? "" : "s"} ago`;
  if (day < 365) return `${Math.floor(day / 30)} month${day < 60 ? "" : "s"} ago`;
  return `${Math.floor(day / 365)} year${day < 730 ? "" : "s"} ago`;
}

export default function LastUpdated({
  date,
  prefix = "Updated",
  className = "",
}: LastUpdatedProps) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;

  const label = formatRelative(d);
  const fullDate = d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold psp-cream-dim ${className}`}
      title={fullDate}
    >
      {prefix} <span className="psp-cream-muted">{label}</span>
    </span>
  );
}
