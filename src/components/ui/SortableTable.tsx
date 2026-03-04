'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface SortableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  hideOnMobile?: boolean;
  primary?: boolean;
}

interface SortableTableProps {
  columns: SortableColumn[];
  data: any[];
  highlightTop3?: boolean;
  mobileCardMode?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
}

export default function SortableTable({
  columns,
  data,
  highlightTop3 = false,
  mobileCardMode = false,
  emptyMessage = 'No data available',
  onRowClick,
}: SortableTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount/resize
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Handle column click
  const handleSort = (key: string) => {
    const col = columns.find((c) => c.key === key);
    if (!col || col.sortable === false) return;

    if (sortKey === key) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else if (sortDir === 'desc') {
        setSortKey(null);
        setSortDir(null);
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Nulls/undefined always last
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Numeric sort
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // String sort
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const cmp = aStr.localeCompare(bStr);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Mobile card mode
  if (mobileCardMode && isMobile) {
    const primaryCol = columns.find((c) => c.primary);
    const rankCol = columns[0];

    return (
      <div className="space-y-4">
        {sortedData.map((row, idx) => {
          const isTopThree = highlightTop3 && idx < 3;
          const bgColor =
            isTopThree && idx === 0
              ? 'bg-yellow-50'
              : isTopThree && idx === 1
                ? 'bg-gray-100'
                : isTopThree
                  ? 'bg-orange-50'
                  : 'bg-white';

          const borderColor =
            isTopThree && idx === 0
              ? 'border-yellow-300'
              : isTopThree && idx === 1
                ? 'border-gray-300'
                : isTopThree
                  ? 'border-orange-300'
                  : 'border-gray-200';

          return (
            <div
              key={idx}
              className={`border ${borderColor} rounded-lg p-4 ${bgColor} cursor-pointer hover:shadow-md transition`}
              onClick={() => onRowClick?.(row)}
            >
              {/* Rank + Primary Value */}
              <div className="flex items-baseline gap-3 mb-3">
                {rankCol && rankCol.key !== primaryCol?.key && (
                  <div className="text-sm font-semibold text-gray-500 min-w-8">
                    {row[rankCol.key]}
                  </div>
                )}
                {primaryCol && (
                  <div className="text-lg font-bold text-navy">
                    {primaryCol.render
                      ? primaryCol.render(row[primaryCol.key], row)
                      : row[primaryCol.key]}
                  </div>
                )}
              </div>

              {/* Other columns as label:value pairs */}
              <div className="space-y-1 text-sm">
                {columns
                  .filter((c) => c.key !== rankCol.key && c.key !== primaryCol?.key)
                  .map((col) => (
                    <div key={col.key} className="flex justify-between text-gray-600">
                      <span className="font-medium">{col.label}</span>
                      <span className="text-right">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop table mode
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-navy text-white">
          <tr>
            {columns
              .filter((c) => !c.hideOnMobile)
              .map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-left font-semibold border-b border-gray-300 ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-gray-800' : ''
                  }`}
                  style={{
                    textAlign: col.align || 'left',
                  }}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-gold">
                        {sortDir === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => {
            const isTopThree = highlightTop3 && idx < 3;
            const bgColor =
              idx % 2 === 1
                ? 'bg-gray-50'
                : isTopThree && idx === 0
                  ? 'bg-yellow-50'
                  : isTopThree && idx === 1
                    ? 'bg-gray-100'
                    : isTopThree
                      ? 'bg-orange-50'
                      : 'bg-white';

            return (
              <tr
                key={idx}
                className={`${bgColor} border-b border-gray-100 hover:bg-gray-100 transition ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns
                  .filter((c) => !c.hideOnMobile)
                  .map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3"
                      style={{
                        textAlign: col.align || 'left',
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
