'use client';

import React, { useState } from 'react';

type Tab = 'overview' | 'stats' | 'gamelog' | 'awards';

interface Props {
  awardsCount: number;
  hasGameLog: boolean;
  overview: React.ReactNode;
  stats: React.ReactNode;
  gamelog: React.ReactNode;
  awards: React.ReactNode;
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '\uD83D\uDCCA' },
  { key: 'stats', label: 'Stats', icon: '\uD83D\uDCCB' },
  { key: 'gamelog', label: 'Game Log', icon: '\uD83D\uDCC5' },
  { key: 'awards', label: 'Awards', icon: '\uD83C\uDFC6' },
];

export default function PlayerProfileTabs({ awardsCount, hasGameLog, overview, stats, gamelog, awards }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const visibleTabs = TABS.filter(t => {
    if (t.key === 'gamelog' && !hasGameLog) return false;
    if (t.key === 'awards' && awardsCount === 0) return false;
    return true;
  });

  return (
    <div>
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 mb-6">
        <div className="flex gap-0">
          {visibleTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition-colors ${
                activeTab === tab.key
                  ? 'text-[var(--psp-navy,#0a1628)]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              style={{
                borderBottom: activeTab === tab.key ? '3px solid var(--psp-gold, #f0a500)' : '3px solid transparent',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {tab.key === 'awards' && awardsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--psp-gold,#f0a500)] text-[var(--psp-navy,#0a1628)]">
                  {awardsCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && overview}
      {activeTab === 'stats' && stats}
      {activeTab === 'gamelog' && gamelog}
      {activeTab === 'awards' && awards}
    </div>
  );
}
