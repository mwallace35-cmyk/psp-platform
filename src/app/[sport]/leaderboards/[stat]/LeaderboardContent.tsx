'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SortableTable, { SortableColumn } from '@/components/ui/SortableTable';

const ClientStatHeatmap = dynamic(() => import('@/components/viz/ClientStatHeatmap'), {
  ssr: false,
  loading: () => <div className="text-center py-8 text-gray-400 text-sm">Loading heatmap...</div>,
});

interface LeaderboardContentProps {
  columns: SortableColumn[];
  tableData: Record<string, any>[];
  statLabel: string;
  sportName: string;
  sport: string;
  stat: string;
}

export default function LeaderboardContent({
  columns,
  tableData,
  statLabel,
  sportName,
  sport,
  stat,
}: LeaderboardContentProps) {
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');

  if (tableData.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--psp-gray-400)' }}>
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--psp-navy)' }}>
          {statLabel} data is being collected
        </h3>
        <p className="text-sm mb-6">We&apos;re working on gathering {statLabel.toLowerCase()} statistics. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded text-sm font-medium transition ${
            viewMode === 'table' ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          style={
            viewMode === 'table'
              ? { background: 'var(--psp-navy)', color: 'white' }
              : { background: 'var(--psp-gray-200, #e5e7eb)', color: 'var(--psp-gray-dark, #374151)' }
          }
        >
          📊 Table View
        </button>
        <button
          onClick={() => setViewMode('heatmap')}
          className={`px-4 py-2 rounded text-sm font-medium transition ${
            viewMode === 'heatmap' ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          style={
            viewMode === 'heatmap'
              ? { background: 'var(--psp-navy)', color: 'white' }
              : { background: 'var(--psp-gray-200, #e5e7eb)', color: 'var(--psp-gray-dark, #374151)' }
          }
        >
          🔥 Heatmap View
        </button>
      </div>

      {/* Leaderboard content */}
      <div className="my-8">
        {viewMode === 'table' ? (
          <SortableTable
            columns={columns}
            data={tableData}
            highlightTop3={true}
            mobileCardMode={true}
            emptyMessage="No leaderboard data available"
            ariaLabel={`${statLabel} leaders leaderboard for Philadelphia high school ${sportName}`}
          />
        ) : (
          <ClientStatHeatmap
            data={tableData}
            columns={columns}
            colorScale="blue-gold"
            highlightTop3={true}
            minSampleSize={5}
          />
        )}
      </div>
    </>
  );
}
