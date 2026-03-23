'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SportNavProps {
  sport: string;
}

interface Tab {
  href: string;
  label: string;
  matchPrefix?: string;
}

// Standard tabs every sport gets, plus optional extras
function buildTabs(sport: string, extras?: Tab[]): Tab[] {
  const base: Tab[] = [
    { href: `/${sport}`, label: 'Overview' },
    { href: `/${sport}/teams`, label: 'Teams' },
    { href: `/${sport}/leaderboards`, label: 'Leaderboards', matchPrefix: `/${sport}/leaderboards` },
    { href: `/${sport}/records`, label: 'Records' },
    { href: `/${sport}/championships`, label: 'Championships' },
    { href: `/${sport}/playoffs`, label: 'Playoffs' },
  ];
  if (extras) base.push(...extras);
  base.push({ href: `/${sport}/schedule`, label: 'Schedule' });
  return base;
}

const SPORT_TAB_CONFIG: Record<string, Tab[]> = {
  football: buildTabs('football', [
    { href: '/football/awards', label: 'Awards' },
  ]),
  basketball: buildTabs('basketball'),
  baseball: buildTabs('baseball'),
  soccer: buildTabs('soccer'),
  lacrosse: buildTabs('lacrosse'),
  'track-field': buildTabs('track-field'),
  wrestling: buildTabs('wrestling'),
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

export default function SportNavTabs({ sport }: SportNavProps) {
  const pathname = usePathname();
  const tabs = SPORT_TAB_CONFIG[sport] || [];
  const sportName = SPORT_DISPLAY_NAMES[sport] || sport;

  if (tabs.length === 0) {
    return null;
  }

  return (
    <nav
      className="bg-white border-b border-gray-200"
      aria-label={`${sportName} section navigation`}

    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
          {tabs.map((tab) => {
            const isActive = tab.matchPrefix
              ? pathname.startsWith(tab.matchPrefix)
              : pathname === tab.href ||
                (tab.href !== `/${sport}` && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-1.5 text-sm font-semibold whitespace-nowrap rounded-full transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={isActive ? {
                  backgroundColor: 'var(--psp-navy)',
                } : {
                  border: '1.5px solid #e2e8f0',
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
