'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PULSE_TABS = [
  { href: '/pulse', label: 'Hub', icon: '🔥' },
  { href: '/pulse/recruiting', label: 'Recruiting', icon: '🎯' },
  { href: '/our-guys', label: 'Our Guys', icon: '🌟' },
  { href: '/rankings', label: 'Rankings', icon: '📊' },
  { href: '/pulse/outside-the-215', label: 'Outside the 215', icon: '🔄' },
];

export default function PulseNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-navy-mid border-b border-gold/30" aria-label="The Pulse navigation">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
          {PULSE_TABS.map((tab) => {
            const isActive = pathname === tab.href ||
              (tab.href !== '/pulse' && pathname.startsWith(tab.href));
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
