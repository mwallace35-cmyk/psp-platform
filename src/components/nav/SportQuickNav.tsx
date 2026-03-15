'use client';

import Link from 'next/link';
import { useMemo } from 'react';

interface SportQuickNavProps {
  sport: string;
  activePage?: string;
}

export default function SportQuickNav({ sport, activePage }: SportQuickNavProps) {
  // Map sport to default leaderboard stat
  const leaderboardStats: Record<string, string> = {
    football: 'rushing',
    basketball: 'scoring',
    baseball: 'batting',
    'track-field': '100m',
    lacrosse: 'goals',
    wrestling: 'pins',
    soccer: 'goals',
  };

  const defaultStat = leaderboardStats[sport] || 'scoring';

  // Build navigation items
  const navItems = useMemo(() => [
    {
      label: 'Hub',
      href: `/${sport}`,
      id: 'hub',
      icon: '🏠',
    },
    {
      label: 'Leaderboards',
      href: `/${sport}/leaderboards/${defaultStat}`,
      id: 'leaderboards',
      icon: '📊',
    },
    {
      label: 'Records',
      href: `/${sport}/records`,
      id: 'records',
      icon: '📈',
    },
    {
      label: 'Championships',
      href: `/${sport}/championships`,
      id: 'championships',
      icon: '🏆',
    },
    ...(sport === 'football'
      ? [
          {
            label: 'Awards',
            href: `/${sport}/awards`,
            id: 'awards',
            icon: '⭐',
          },
        ]
      : []),
    {
      label: 'Box Scores',
      href: `/${sport}/box-scores`,
      id: 'box-scores',
      icon: '📋',
    },
    {
      label: 'Standings',
      href: `/${sport}/standings`,
      id: 'standings',
      icon: '📍',
    },
    {
      label: 'Schedule',
      href: `/${sport}/schedule`,
      id: 'schedule',
      icon: '📅',
    },
    {
      label: 'Dynasties',
      href: `/${sport}/dynasties`,
      id: 'dynasties',
      icon: '👑',
    },
    {
      label: 'Eras',
      href: `/${sport}/eras`,
      id: 'eras',
      icon: '📚',
    },
  ], [sport, defaultStat]);

  return (
    <nav
      className="sticky top-16 z-40 bg-white dark:bg-[#0a1628] border-b border-gray-200 dark:border-gray-700 overflow-x-auto"
      aria-label={`${sport} navigation`}
    >
      <div className="max-w-7xl mx-auto px-4 flex gap-2 py-2 md:py-3">
        {navItems.map((item) => {
          const isActive = activePage === item.id || (activePage === undefined && item.id === 'hub');

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base
                font-medium whitespace-nowrap transition-all duration-200
                ${
                  isActive
                    ? 'bg-yellow-400 dark:bg-[#f0a500] text-gray-900 dark:text-[#0a1628]'
                    : 'text-gray-700 dark:text-gray-300 hover:border-b-2 hover:border-[#f0a500] dark:hover:border-[#f0a500]'
                }
              `}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--psp-gold, #f0a500)',
                      color: 'var(--psp-navy, #0a1628)',
                    }
                  : {
                      color: 'var(--text-body, #374151)',
                    }
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
