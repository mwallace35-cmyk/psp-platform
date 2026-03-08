'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RowData = Record<string, any>;

export interface SortableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: RowData) => React.ReactNode;
  hideOnMobile?: boolean;
  primary?: boolean;
}

interface SortableTableProps {
  columns: SortableColumn[];
  data: RowData[];
  highlightTop3?: boolean;
  mobileCardMode?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: RowData) => void;
  ariaLabel?: string;
}

function SortableTable({
  columns,
  data,
  highlightTop3 = false,
  mobileCardMode = false,
  emptyMessage = 'No data available',
  onRowClick,
  ariaLabel,
}: SortableTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Memoize column lookup to prevent recalculations
  const visibleColumns = useMemo(() => columns.filter((c) => !c.hideOnMobile), [columns]);
  const primaryColumn = useMemo(() => columns.find((c) => c.primary), [columns]);

  // Detect mobile on mount/resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Handle column click
  const handleSort = useCallback((key: string) => {
    setSortKey((currentSortKey) => {
      setSortDir((currentSortDir) => {
        const col = columns.find((c) => c.key === key);
        if (!col || col.sortable === false) return currentSortDir;

        if (currentSortKey === key) {
          if (currentSortDir === 'asc') {
            return 'desc';
          } else if (currentSortDir === 'desc') {
            setSortKey(null);
            return null;
          }
        } else {
          setSortKey(key);
          return 'asc';
        }
        return currentSortDir;
      });
      return currentSortKey === key ? currentSortKey : key;
    });
  }, [columns]);

  // Handle keyboard navigation on sortable headers
  const handleHeaderKeyDown = useCallback((e: React.KeyboardEvent<HTMLTableCellElement>, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(key);
    }
  }, [handleSort]);

  // Get aria-sort value for a column
  const getAriaSort = useCallback((key: string) => {
    if (sortKey !== key) return 'none';
    return sortDir === 'asc' ? 'ascending' : 'descending';
  }, [sortKey, sortDir]);

  // Get accessible label for a sortable column header
  const getHeaderAriaLabel = useCallback((col: SortableColumn) => {
    if (col.sortable === false) return col.label;
    const ariaSort = getAriaSort(col.key);
    const sortStatus = ariaSort === 'ascending'
      ? ', sorted ascending'
      : ariaSort === 'descending'
      ? ', sorted descending'
      : ', not sorted';
    return `${col.label}${sortStatus}. Click to sort`;
  }, [getAriaSort]);

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
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              className={`border ${borderColor} rounded-lg p-4 ${bgColor} ${onRowClick ? 'cursor-pointer hover:shadow-md focus:outline-2 focus:outline-offset-2 focus:outline-blue-400' : ''} transition`}
              onClick={() => onRowClick?.(row)}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(row);
                }
              }}
            >
              {/* Rank + Primary Value */}
              <div className="flex items-baseline gap-3 mb-3">
                {rankCol && rankCol.key !== primaryColumn?.key && (
                  <div className="text-sm font-semibold text-gray-500 min-w-8">
                    {row[rankCol.key]}
                  </div>
                )}
                {primaryColumn && (
                  <div className="text-lg font-bold text-navy">
                    {primaryColumn.render
                      ? primaryColumn.render(row[primaryColumn.key], row)
                      : row[primaryColumn.key]}
                  </div>
                )}
              </div>

              {/* Other columns as label:value pairs */}
              <div className="space-y-1 text-sm">
                {columns
                  .filter((c) => c.key !== rankCol.key && c.key !== primaryColumn?.key)
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
      <table className="w-full text-sm" aria-label={ariaLabel}>
        <thead className="sticky top-0 z-10 bg-navy text-white">
          <tr>
            {visibleColumns
              .map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  role={col.sortable !== false ? 'button' : undefined}
                  tabIndex={col.sortable !== false ? 0 : undefined}
                  onClick={() => handleSort(col.key)}
                  onKeyDown={(e) => col.sortable !== false && handleHeaderKeyDown(e, col.key)}
                  aria-sort={col.sortable !== false ? getAriaSort(col.key) : undefined}
                  aria-label={getHeaderAriaLabel(col)}
                  className={`px-4 py-3 text-left font-semibold border-b border-gray-300 transition min-h-[44px] flex items-center ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-gray-800 focus:outline-2 focus:outline-offset-[-2px] focus:outline-blue-400' : ''
                  }`}
                  style={{
                    textAlign: col.align || 'left',
                  }}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-gold" aria-hidden="true">
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
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                className={`${bgColor} border-b border-gray-100 hover:bg-gray-100 transition focus:outline-2 focus:outline-offset-[-2px] focus:outline-blue-400 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                {visibleColumns
                  .map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 min-h-[44px] flex items-center"
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

export default React.memo(SortableTable);
