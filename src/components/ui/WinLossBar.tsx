import React from 'react';

interface WinLossBarProps {
  wins: number;
  losses: number;
  ties?: number;
  height?: number;
  showLabel?: boolean;
}

export default function WinLossBar({
  wins,
  losses,
  ties = 0,
  height = 8,
  showLabel = true,
}: WinLossBarProps) {
  const total = wins + losses + ties;

  if (total === 0) {
    return <div className="text-xs text-gray-500">No record</div>;
  }

  const winPercentage = (wins / total) * 100;
  const lossPercentage = (losses / total) * 100;
  const tiePercentage = (ties / total) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div
            className="flex rounded-full overflow-hidden bg-gray-200"
            style={{ height: `${height}px` }}
          >
            {wins > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${winPercentage}%` }}
                title={`${wins} wins`}
              />
            )}
            {losses > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${lossPercentage}%` }}
                title={`${losses} losses`}
              />
            )}
            {ties > 0 && (
              <div
                className="bg-gray-400 transition-all"
                style={{ width: `${tiePercentage}%` }}
                title={`${ties} ties`}
              />
            )}
          </div>
        </div>
        {showLabel && (
          <div className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            {wins}-{losses}
            {ties > 0 && `-${ties}`}
          </div>
        )}
      </div>
    </div>
  );
}
