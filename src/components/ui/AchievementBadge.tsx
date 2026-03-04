import React from 'react';

type BadgeType = 'pro' | 'champion' | 'college' | 'hall-of-fame' | 'multi-sport';

interface AchievementBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const badgeConfig: Record<BadgeType, { icon: string; bgColor: string; textColor: string; label: string }> = {
  pro: {
    icon: '⭐',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    label: 'Pro Athlete',
  },
  champion: {
    icon: '🏆',
    bgColor: 'bg-blue-900',
    textColor: 'text-yellow-300',
    label: 'Champion',
  },
  college: {
    icon: '🎓',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    label: 'College',
  },
  'hall-of-fame': {
    icon: '👑',
    bgColor: 'bg-amber-600',
    textColor: 'text-white',
    label: 'Hall of Fame',
  },
  'multi-sport': {
    icon: '🔄',
    bgColor: 'bg-teal-600',
    textColor: 'text-white',
    label: 'Multi-Sport',
  },
};

export default function AchievementBadge({
  type,
  size = 'sm',
  showLabel = false,
}: AchievementBadgeProps) {
  const config = badgeConfig[type];

  if (size === 'sm' && !showLabel) {
    // Just the icon, minimal styling
    return (
      <span
        className="inline-flex items-center justify-center"
        title={config.label}
        aria-label={config.label}
      >
        <span className="text-base">{config.icon}</span>
      </span>
    );
  }

  // md size or with label
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}
      aria-label={config.label}
    >
      <span className="text-sm">{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
