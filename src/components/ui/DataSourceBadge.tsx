'use client';

import React, { useState } from 'react';

export interface DataSourceBadgeProps {
  source: string;
  lastUpdated?: string;
  confidence?: 'verified' | 'estimated' | 'partial';
  detail?: string;
}

const sourceIcons: Record<string, string> = {
  'Ted Silary Archives': '📋',
  'MaxPreps': '🌐',
  'PIAA': '🏆',
  'Hudl': '📹',
  'School Archives': '🏫',
  'Newspaper Archives': '📰',
  'Local Records': '📚',
};

const confidenceConfig: Record<string, { icon: string; label: string; color: string }> = {
  verified: { icon: '✓', label: 'Verified', color: 'text-green-600' },
  estimated: { icon: '~', label: 'Estimated', color: 'text-amber-600' },
  partial: { icon: '?', label: 'Partial', color: 'text-gray-500' },
};

export default function DataSourceBadge({
  source,
  lastUpdated,
  confidence = 'verified',
  detail,
}: DataSourceBadgeProps) {
  const [showDetail, setShowDetail] = useState(false);
  const icon = sourceIcons[source] || '📊';
  const confConfig = confidenceConfig[confidence];

  const lastUpdatedText = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="inline-block">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
        style={{
          background: 'rgba(10, 22, 40, 0.06)',
          color: 'var(--psp-navy)',
          border: '1px solid rgba(10, 22, 40, 0.12)',
        }}
        title={detail || `Data source: ${source}`}
      >
        <span>{icon}</span>
        <span>{source}</span>
        {lastUpdatedText && (
          <span
            style={{
              color: 'var(--psp-gray-500)',
              fontSize: '0.75rem',
            }}
          >
            ({lastUpdatedText})
          </span>
        )}
        <span className={`${confConfig.color}`}>
          {confConfig.icon}
        </span>
      </button>

      {/* Tooltip/detail panel */}
      {showDetail && (
        <div
          className="absolute mt-2 p-3 rounded-lg shadow-lg border max-w-xs z-50"
          style={{
            background: 'white',
            borderColor: 'var(--psp-gray-200)',
          }}
        >
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--psp-navy)' }}>
            Data Source: {source}
          </div>
          <div className="text-xs mb-2" style={{ color: 'var(--psp-gray-600)' }}>
            <div className="flex items-center gap-1 mb-1">
              <span className={confConfig.color}>{confConfig.icon}</span>
              <span>
                {confConfig.label}
              </span>
            </div>
            {lastUpdatedText && (
              <div>
                Last updated: {lastUpdatedText}
              </div>
            )}
          </div>
          {detail && (
            <div className="text-xs" style={{ color: 'var(--psp-gray-700)' }}>
              {detail}
            </div>
          )}
          <div
            className="mt-2 pt-2 border-t text-xs"
            style={{ borderColor: 'var(--psp-gray-200)', color: 'var(--psp-gray-600)' }}
          >
            <a href="/data-sources" className="hover:underline" style={{ color: 'var(--psp-blue)' }}>
              Learn about our data sources
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
