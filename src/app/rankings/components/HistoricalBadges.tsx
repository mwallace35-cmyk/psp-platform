'use client';

interface Badge {
  type: string;
  icon: string;
  text: string;
  source: string;
}

interface HistoricalBadgesProps {
  badges: Badge[] | null;
}

export default function HistoricalBadges({ badges }: HistoricalBadgesProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge, idx) => (
        <span
          key={`${badge.type}-${idx}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/5 border border-purple-500/15 text-sm"
        >
          <span className="text-xs">{badge.icon}</span>
          <span className="text-purple-700 font-medium">{badge.text}</span>
          <span className="text-gray-400 text-[10px]">{badge.source}</span>
        </span>
      ))}
    </div>
  );
}
