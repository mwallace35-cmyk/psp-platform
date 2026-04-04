'use client';

import { useState } from 'react';

interface BullBearCaseProps {
  bullCase: string | null;
  bearCase: string | null;
}

export default function BullBearCase({ bullCase, bearCase }: BullBearCaseProps) {
  const [activeTab, setActiveTab] = useState<'bull' | 'bear'>('bull');

  if (!bullCase && !bearCase) return null;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-2">
        {bullCase && (
          <button
            onClick={() => setActiveTab('bull')}
            className={`pb-1.5 text-sm font-semibold transition border-b-2 ${
              activeTab === 'bull'
                ? 'border-green-500 text-green-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Bull Case
          </button>
        )}
        {bearCase && (
          <button
            onClick={() => setActiveTab('bear')}
            className={`pb-1.5 text-sm font-semibold transition border-b-2 ${
              activeTab === 'bear'
                ? 'border-red-500 text-red-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Bear Case
          </button>
        )}
      </div>

      {/* Content */}
      {activeTab === 'bull' && bullCase && (
        <div className="px-3 py-2.5 rounded-md bg-green-500/5 border border-green-500/15">
          <p className="text-sm text-green-800 leading-relaxed">{bullCase}</p>
        </div>
      )}
      {activeTab === 'bear' && bearCase && (
        <div className="px-3 py-2.5 rounded-md bg-red-500/5 border border-red-500/15">
          <p className="text-sm text-red-800 leading-relaxed">{bearCase}</p>
        </div>
      )}
    </div>
  );
}
