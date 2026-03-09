'use client';

import React, { useMemo, useState } from 'react';
import { SortableColumn } from '@/components/ui/SortableTable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RowData = Record<string, any>;

interface StatHeatmapProps {
  data: RowData[];
  columns: SortableColumn[];
  colorScale?: 'green-red' | 'blue-gold';
  highlightTop3?: boolean;
  minSampleSize?: number;
}

function StatHeatmap({
  data,
  columns,
  colorScale = 'blue-gold',
  highlightTop3 = true,
  minSampleSize = 5,
}: StatHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Compute percentile for each numeric column
  const columnStats = useMemo(() => {
    const stats: Record<string, { values: number[]; min: number; max: number; mean: number }> = {};

    columns.forEach((col) => {
      if (col.key === 'rank' || col.key === 'name' || col.key === 'school') return;

      const values = data
        .map((row) => row[col.key])
        .filter((v) => v != null && typeof v === 'number')
        .sort((a, b) => a - b);

      if (values.length < minSampleSize) return;

      stats[col.key] = {
        values,
        min: Math.min(...values),
        max: Math.max(...values),
        mean: values.reduce((a, b) => a + b) / values.length,
      };
    });

    return stats;
  }, [columns, data, minSampleSize]);

  // Compute percentile rank (0-100) for a value within its column
  const getPercentile = (colKey: string, value: number): number => {
    const colData = columnStats[colKey];
    if (!colData) return 0;

    const count = colData.values.filter((v) => v <= value).length;
    return (count / colData.values.length) * 100;
  };

  // Get color for value based on percentile
  const getCellColor = (colKey: string, value: number): string => {
    const percentile = getPercentile(colKey, value);

    if (colorScale === 'blue-gold') {
      // Blue (low) to Gold (high)
      if (percentile < 20) return 'bg-blue-50';
      if (percentile < 40) return 'bg-blue-100';
      if (percentile < 60) return 'bg-blue-200';
      if (percentile < 80) return 'bg-yellow-100';
      return 'bg-yellow-200';
    } else {
      // Green (high) to Red (low)
      if (percentile > 80) return 'bg-green-50';
      if (percentile > 60) return 'bg-yellow-50';
      if (percentile > 40) return 'bg-orange-50';
      if (percentile > 20) return 'bg-red-50';
      return 'bg-red-100';
    }
  };

  // Get text color for contrast
  const getTextColor = (colKey: string, value: number): string => {
    const percentile = getPercentile(colKey, value);

    if (colorScale === 'blue-gold') {
      return percentile > 70 ? 'text-yellow-900 font-bold' : 'text-gray-900';
    } else {
      return percentile > 70 ? 'text-green-900 font-bold' : 'text-gray-900';
    }
  };

  // Find top 3 values in each numeric column
  const top3ByColumn = useMemo(() => {
    const top3: Record<string, Set<unknown>> = {};

    columns.forEach((col) => {
      if (col.key === 'rank' || col.key === 'name' || col.key === 'school') return;

      const values = data
        .map((row) => ({
          value: row[col.key],
          row,
        }))
        .filter((item) => item.value != null && typeof item.value === 'number')
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);

      top3[col.key] = new Set(values.map((v) => v.row));
    });

    return top3;
  }, [columns, data]);

  // Numeric columns only (exclude rank, name, school, etc.)
  const numericColumns = useMemo(() => {
    return columns.filter((col) => {
      const sampleValue = data[0]?.[col.key];
      return typeof sampleValue === 'number' && col.key !== 'rank';
    });
  }, [columns, data]);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-navy">Statistical Heatmap</h3>
        <p className="text-sm text-gray-500">Values color-coded by percentile within each column</p>
      </div>

      {/* Legend */}
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 text-xs">
        <p className="font-semibold text-gray-700 mb-2">Color Scale:</p>
        <div className="flex gap-3 flex-wrap">
          {colorScale === 'blue-gold' ? (
            <>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-blue-50" />
                <span className="text-gray-700">0-20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-blue-100" />
                <span className="text-gray-700">20-40%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-blue-200" />
                <span className="text-gray-700">40-60%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-yellow-100" />
                <span className="text-gray-700">60-80%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-yellow-200" />
                <span className="text-gray-700">80-100%</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-red-100" />
                <span className="text-gray-700">0-20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-red-50" />
                <span className="text-gray-700">20-40%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-orange-50" />
                <span className="text-gray-700">40-60%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-yellow-50" />
                <span className="text-gray-700">60-80%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-4 bg-green-50" />
                <span className="text-gray-700">80-100%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg" role="img" aria-label="Statistical heatmap showing distribution of player stats">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-navy text-white sticky top-0 z-10">
            <tr>
              {columns
                .filter((col) => col.key === 'rank' || col.key === 'name' || col.key === 'school' || numericColumns.includes(col))
                .map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left font-semibold border-r border-gray-300 last:border-r-0 ${
                      numericColumns.includes(col) ? 'text-center' : ''
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={`row-${rowIdx}`} className="border-b border-gray-200 hover:bg-gray-50">
                {columns
                  .filter((col) => col.key === 'rank' || col.key === 'name' || col.key === 'school' || numericColumns.includes(col))
                  .map((col) => {
                    const value = row[col.key];
                    const isNumeric = numericColumns.includes(col);
                    const isTop3 = highlightTop3 && top3ByColumn[col.key]?.has(row);
                    const cellId = `${rowIdx}-${col.key}`;
                    const isHovered = hoveredCell === cellId;

                    const bgColor = isNumeric ? getCellColor(col.key, value) : '';
                    const textColor = isNumeric ? getTextColor(col.key, value) : '';

                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 border-r border-gray-100 last:border-r-0 transition ${bgColor} ${
                          isTop3 ? 'ring-inset ring-2 ring-gold' : ''
                        } ${isHovered ? 'ring-inset ring-2 ring-blue-400' : ''}`}
                        style={{
                          textAlign: col.align || 'left',
                          cursor: isNumeric ? 'pointer' : 'default',
                        }}
                        onMouseEnter={() => isNumeric && setHoveredCell(cellId)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {col.render ? (
                          <span className={isNumeric ? textColor : ''}>
                            {col.render(value, row)}
                          </span>
                        ) : (
                          <span className={isNumeric ? textColor : ''}>
                            {typeof value === 'number' ? value.toFixed(1) : value}
                          </span>
                        )}
                        {isHovered && isNumeric && (
                          <span className="ml-2 text-xs text-gray-600">
                            ({Math.round(getPercentile(col.key, value))}%)
                          </span>
                        )}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="mt-4 text-xs text-gray-600">
        <p>
          <strong>Top 3 Highlight:</strong> Gold ring indicates top 3 values in each column.
          <br />
          <strong>Sample Size:</strong> Columns with fewer than {minSampleSize} values are excluded.
        </p>
      </div>
    </div>
  );
}

export default React.memo(StatHeatmap);
