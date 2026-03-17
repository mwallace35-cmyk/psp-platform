import Link from 'next/link';

interface FormerPlayerBadgeProps {
  playerSlug?: string | null;
  schoolName?: string;
  graduationYear?: number;
  sport?: string;
}

export default function FormerPlayerBadge({
  playerSlug,
  schoolName,
  graduationYear,
  sport,
}: FormerPlayerBadgeProps) {
  // Build tooltip text
  const tooltipParts = [];
  tooltipParts.push('Former Player');
  if (schoolName) tooltipParts.push(`at ${schoolName}`);
  if (graduationYear) tooltipParts.push(`'${String(graduationYear).slice(-2)}`);
  const tooltipText = tooltipParts.join(' ');

  const badge = (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--psp-gold)]/10 border border-[var(--psp-gold)] rounded-full group cursor-help"
      title={tooltipText}
    >
      <svg
        className="w-3.5 h-3.5 text-[var(--psp-gold)]"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        {/* Shield icon */}
        <path d="M12 1l-7 3v8c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V4l-7-3z" />
      </svg>
      <span className="text-xs font-semibold text-[var(--psp-gold)] whitespace-nowrap">
        Former Player
      </span>

      {/* Tooltip on hover */}
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap border border-gray-700 z-10">
        {tooltipText}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700" />
      </div>
    </div>
  );

  // If no player slug, return badge without link
  if (!playerSlug) {
    return <div className="relative inline-block">{badge}</div>;
  }

  // Link to player profile
  const href = sport
    ? `/${sport}/players/${playerSlug}`
    : `/players/${playerSlug}`;

  return (
    <Link href={href} className="relative inline-block hover:opacity-80 transition-opacity">
      {badge}
    </Link>
  );
}
