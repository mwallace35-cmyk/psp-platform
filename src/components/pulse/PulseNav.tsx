'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PULSE_TABS = [
  { href: '/events', label: 'Hub', icon: '🔥' },
  { href: '/events/our-guys', label: 'Our Guys', icon: '🌟' },
  { href: '/events/forum', label: 'Forum', icon: '💬' },
  { href: '/events/transfers', label: 'Transfers', icon: '🔄' },
  { href: '/events/rankings', label: 'Rankings', icon: '📊' },
];

export default function PulseNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-navy-mid border-b border-gold/30" aria-label="The Pulse navigation">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
          {PULSE_TABS.map((tab) => {
            const isActive = pathname === tab.href ||
              (tab.href !== '/events' && pathname.startsWith(tab.href));
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
