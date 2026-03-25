'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import SparkLine from '@/components/ui/SparkLine';

interface SmallMultiplesItem {
  name: string;
  slug: string;
  data: number[];
}

interface SmallMultiplesProps {
  items: SmallMultiplesItem[];
  sport: string;
  statName: string;
  columns?: number;
  onItemClick?: (slug: string) => void;
}

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#dc2626',
  track: '#7c3aed',
  lacrosse: '#0891b2',
  wrestling: '#ca8a04',
  soccer: '#059669',
};

function SmallMultiples({
  items,
  sport,
  statName,
  columns = 4,
  onItemClick,
}: SmallMultiplesProps) {
  const sportColor = SPORT_COLORS[sport.toLowerCase()] || '#f0a500';

  // Compute global min/max for all data (to maintain honest comparison)
  const globalStats = useMemo(() => {
    let globalMin = Infinity;
    let globalMax = -Infinity;

    items.forEach((item) => {
      item.data.forEach((value) => {
        if (value != null) {
          globalMin = Math.min(globalMin, value);
          globalMax = Math.max(globalMax, value);
        }
      });
    });

    // Handle edge case where all values are the same
    if (globalMin === globalMax) {
      globalMin = 0;
      globalMax = globalMin || 1;
    }

    return { min: globalMin === Infinity ? 0 : globalMin, max: globalMax };
  }, [items]);

  // Get responsive column count
  const getResponsiveColumns = (): number => {
    if (typeof window === 'undefined') return columns;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return columns;
  };

  const responsiveColumns = getResponsiveColumns();

  // Item statistics
  const itemStats = useMemo(() => {
    return items.map((item) => {
      const validData = item.data.filter((v) => v != null);
      return {
        min: Math.min(...validData),
        max: Math.max(...validData),
        avg: validData.length > 0 ? validData.reduce((a, b) => a + b) / validData.length : 0,
      };
    });
  }, [items]);

  // Grid styling
  const gridColsClass =
    responsiveColumns === 1
      ? 'grid-cols-1'
      : responsiveColumns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4" role="img" aria-label={`${statName} comparison across ${items.length} schools with small multiple charts`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-navy">
          {statName} Comparison
        </h3>
        <p className="text-sm text-gray-400">
          {items.length} {items.length === 1 ? 'school' : 'schools'} — Honest scale for fair comparison
        </p>
      </div>

      {/* Info box about honest comparison */}
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
        <p className="font-semibold text-xs mb-1">Data Integrity</p>
        <p className="text-xs">
          All sparklines use the same scale ({Math.round(globalStats.min)} to {Math.round(globalStats.max)}),
          following Tufte's principle of honest data visualization.
        </p>
      </div>

      {/* Grid */}
      <div className={`grid ${gridColsClass} gap-4`}>
        {items.map((item, idx) => {
          const stats = itemStats[idx];
          const sparkColor = sportColor;

          // Construct href based on pattern
          const href = `/[sport]/${item.slug}`.replace('[sport]', sport.toLowerCase());

          return (
            <Link href={href} key={`small-multiple-${idx}`}>
              <div className="block p-4 border border-gray-200 rounded-lg hover:border-gold hover:shadow-md transition cursor-pointer group h-full">
                {/* School name */}
                <h4 className="font-bold text-sm text-navy mb-2 truncate group-hover:text-gold transition">
                  {item.name}
                </h4>

                {/* Sparkline */}
                <div className="mb-3 flex justify-center py-2 bg-gray-50 rounded">
                  <SparkLine
                    data={item.data}
                    width={120}
                    height={40}
                    color={sparkColor}
                    showDot={true}
                  />
                </div>

                {/* Stats bar */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span className="font-semibold">Avg</span>
                    <span className="font-bold text-navy">{stats.avg.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span className="font-semibold">Min</span>
                    <span className="text-gray-700">{stats.min.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span className="font-semibold">Max</span>
                    <span className="text-gray-700">{stats.max.toFixed(1)}</span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="mt-3 text-center">
                  <span className="text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition">
                    View Profile →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          <strong>Scale:</strong> {Math.round(globalStats.min)} (low) to {Math.round(globalStats.max)} (high).
          Click any card to view detailed profile.
        </p>
      </div>
    </div>
  );
}

export default React.memo(SmallMultiples);
