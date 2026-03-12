"use client";

import { EraStatistic, EraStatType } from "@/lib/data";

interface EraChartProps {
  eras: EraStatistic[];
  statType: EraStatType;
}

export default function EraChart({ eras, statType }: EraChartProps) {
  if (!eras || eras.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No data available
      </div>
    );
  }

  // Find max value for scaling
  const maxValue = Math.max(...eras.map((e) => e.avg_value));
  const padding = maxValue * 0.1; // 10% padding for visual breathing room
  const chartMax = maxValue + padding;

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="space-y-4">
        {eras.map((era, idx) => {
          const percentage = (era.avg_value / chartMax) * 100;
          const isPeak = idx === 0;

          return (
            <div key={era.decade}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-300">
                  {era.decade_label}
                </span>
                <span className={`text-sm font-bold ${isPeak ? "text-[var(--psp-gold)]" : "text-gray-400"}`}>
                  {era.avg_value.toFixed(1)} {statType.unit || ""}
                </span>
              </div>
              <div className="h-8 overflow-hidden rounded bg-gray-800">
                <div
                  className={`h-full transition-all ${
                    isPeak
                      ? "bg-gradient-to-r from-[var(--psp-gold)] to-[var(--psp-blue)]"
                      : "bg-gradient-to-r from-gray-700 to-gray-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                  title={`${era.avg_value.toFixed(1)} ${statType.unit || ""}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400 border-t border-gray-700 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-[var(--psp-gold)] to-[var(--psp-blue)]" />
          <span>Peak Era</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-700 to-gray-600" />
          <span>Other Eras</span>
        </div>
      </div>
    </div>
  );
}
