'use client';

import { useState, useMemo, useEffect } from 'react';

/* ── Column definition ─────────────────────────────────────── */
export interface RDTColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (value: any, row: any, idx: number) => React.ReactNode;
  /** Hide on mobile card (still appears in table) */
  hideOnMobile?: boolean;
  /** Mark as the primary display column (used for card header) */
  primary?: boolean;
  /** Fixed width hint */
  width?: string;
  /** Mobile label override */
  mobileLabel?: string;
}

/* ── Component props ───────────────────────────────────────── */
interface ResponsiveDataTableProps {
  columns: RDTColumn[];
  data: any[];
  /** Gold-highlight top N rows (default 0 = off) */
  highlightTop?: number;
  /** Default sort column key */
  defaultSort?: string;
  /** Default sort direction */
  defaultDir?: 'asc' | 'desc';
  /** Breakpoint in px for card mode (default 900) */
  breakpoint?: number;
  emptyMessage?: string;
  emptyIcon?: string;
  /** Row click handler */
  onRowClick?: (row: any) => void;
  /** Sport color for accent (hex) */
  accentColor?: string;
  /** Show rank numbers on mobile cards */
  showRank?: boolean;
  /** Class for the wrapper */
  className?: string;
}

/* ── Main component ────────────────────────────────────────── */
export default function ResponsiveDataTable({
  columns,
  data,
  highlightTop = 0,
  defaultSort,
  defaultDir = 'desc',
  breakpoint = 900,
  emptyMessage = 'No data available',
  emptyIcon = '📊',
  onRowClick,
  accentColor,
  showRank = true,
  className = '',
}: ResponsiveDataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSort ?? null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultDir);
  const [isMobile, setIsMobile] = useState(false);

  /* ── Responsive detection ─────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  /* ── Sorting logic ────────────────────────────────────────── */
  const handleSort = (key: string) => {
    const col = columns.find((c) => c.key === key);
    if (!col || col.sortable === false) return;

    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  /* ── Empty state ──────────────────────────────────────────── */
  if (!data.length) {
    return (
      <div className="rdt-empty">
        <span className="rdt-empty-icon">{emptyIcon}</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  /* ── Medal helper ─────────────────────────────────────────── */
  const medal = (idx: number) =>
    idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;

  /* ── Mobile card mode ─────────────────────────────────────── */
  if (isMobile) {
    const primaryCol = columns.find((c) => c.primary);
    const visibleCols = columns.filter(
      (c) => !c.hideOnMobile && c.key !== primaryCol?.key
    );

    return (
      <div className={`rdt-cards ${className}`}>
        {sortedData.map((row, idx) => {
          const isHighlighted = highlightTop > 0 && idx < highlightTop;
          return (
            <div
              key={idx}
              className={`rdt-card${isHighlighted ? ' rdt-card-top' : ''}${
                idx < 3 && highlightTop > 0 ? ` rdt-card-medal-${idx + 1}` : ''
              }`}
              style={
                accentColor && isHighlighted
                  ? ({ '--rdt-accent': accentColor } as React.CSSProperties)
                  : undefined
              }
              onClick={() => onRowClick?.(row)}
            >
              {/* Card header */}
              <div className="rdt-card-head">
                {showRank && (
                  <span className="rdt-card-rank">
                    {medal(idx) || `#${idx + 1}`}
                  </span>
                )}
                {primaryCol && (
                  <span className="rdt-card-primary">
                    {primaryCol.render
                      ? primaryCol.render(row[primaryCol.key], row, idx)
                      : row[primaryCol.key]}
                  </span>
                )}
              </div>

              {/* Card body — label : value pairs */}
              <div className="rdt-card-body">
                {visibleCols.map((col) => (
                  <div key={col.key} className="rdt-card-row">
                    <span className="rdt-card-label">
                      {col.mobileLabel || col.label}
                    </span>
                    <span
                      className="rdt-card-value"
                      style={{ textAlign: col.align || 'right' }}
                    >
                      {col.render
                        ? col.render(row[col.key], row, idx)
                        : row[col.key] ?? '—'}
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

  /* ── Desktop table mode ───────────────────────────────────── */
  return (
    <div className={`rdt-wrap ${className}`}>
      <table className="rdt-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              const canSort = col.sortable !== false;
              return (
                <th
                  key={col.key}
                  onClick={() => canSort && handleSort(col.key)}
                  className={canSort ? 'rdt-sortable' : ''}
                  style={{
                    textAlign: col.align || 'left',
                    width: col.width,
                    cursor: canSort ? 'pointer' : 'default',
                  }}
                >
                  <span className="rdt-th-inner">
                    {col.label}
                    {isSorted && (
                      <span className="rdt-sort-arrow">
                        {sortDir === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                    {!isSorted && canSort && (
                      <span className="rdt-sort-hint">⇅</span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => {
            const isHighlighted = highlightTop > 0 && idx < highlightTop;
            return (
              <tr
                key={idx}
                className={`${isHighlighted ? 'rdt-row-top' : ''}${
                  idx < 3 && highlightTop > 0 ? ` rdt-row-medal-${idx + 1}` : ''
                }`}
                onClick={() => onRowClick?.(row)}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.render
                      ? col.render(row[col.key], row, idx)
                      : row[col.key] ?? '—'}
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
