'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SportNavProps {
  sport: string;
}

interface Tab {
  href: string;
  label: string;
  icon: string;
  matchPrefix?: string; // If set, tab is active when pathname starts with this prefix
  condition?: boolean; // Optional condition to show/hide tab
}

// Helper to build standard tabs for a sport
function buildTabs(sport: string, icon: string, defaultLeaderboardStat: string, extras?: Tab[]): Tab[] {
  return [
    { href: `/${sport}`, label: 'Overview', icon },
    { href: `/${sport}/teams`, label: 'Teams', icon: '🏟️' },
    { href: `/${sport}/leaderboards`, label: 'Leaderboards', icon: '📊', matchPrefix: `/${sport}/leaderboards` },
    { href: `/${sport}/records`, label: 'Records', icon: '🏆' },
    { href: `/${sport}/championships`, label: 'Championships', icon: '👑' },
    ...(extras || []),
    { href: `/${sport}/schedule`, label: 'Schedule', icon: '📅' },
  ];
}

const SPORT_TAB_CONFIG: Record<string, Tab[]> = {
  football: buildTabs('football', '🏈', 'rushing', [
    { href: '/football/awards', label: 'Awards', icon: '⭐' },
  ]),
  basketball: buildTabs('basketball', '🏀', 'scoring'),
  baseball: buildTabs('baseball', '⚾', 'batting'),
  soccer: buildTabs('soccer', '⚽', 'goals'),
  lacrosse: buildTabs('lacrosse', '🥍', 'goals'),
  'track-field': buildTabs('track-field', '🏃', 'sprints'),
  wrestling: buildTabs('wrestling', '🤼', 'wins'),
};

const SPORT_DISPLAY_NAMES: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  baseball: 'Baseball',
  soccer: 'Soccer',
  lacrosse: 'Lacrosse',
  'track-field': 'Track & Field',
  wrestling: 'Wrestling',
};

export default function SportNav({ sport }: SportNavProps) {
  const pathname = usePathname();
  const tabs = SPORT_TAB_CONFIG[sport] || [];
  const sportName = SPORT_DISPLAY_NAMES[sport] || sport;

  if (tabs.length === 0) {
    return null;
  }

  return (
    <nav
      className="bg-navy-mid border-b border-gold/30"
      aria-label={`${sportName} section navigation`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
          {tabs.map((tab) => {
            const isActive = tab.matchPrefix
              ? pathname.startsWith(tab.matchPrefix)
              : pathname === tab.href ||
                (tab.href !== `/${sport}` && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-md transition-colors ${
                  isActive
                    ? 'bg-white text-navy border-b-2 border-gold'
                    : 'text-gray-300 hover:text-gold hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
