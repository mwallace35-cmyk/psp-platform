import React from 'react';

interface WinLossBarProps {
  wins: number;
  losses: number;
  ties?: number;
  height?: number;
  showLabel?: boolean;
}

function WinLossBar({
  wins,
  losses,
  ties = 0,
  height = 8,
  showLabel = true,
}: WinLossBarProps) {
  const total = wins + losses + ties;

  if (total === 0) {
    return <div className="text-xs text-gray-400">No record</div>;
  }

  const winPercentage = (wins / total) * 100;
  const lossPercentage = (losses / total) * 100;
  const tiePercentage = (ties / total) * 100;
  const winLossRecord = `${wins}-${losses}${ties > 0 ? `-${ties}` : ''}`;
  const winPercent = ((wins / total) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div
            className="flex rounded-full overflow-hidden"
            style={{
              height: `${height}px`,
              backgroundColor: 'var(--psp-gray-200, #e5e7eb)',
            }}
            role="progressbar"
            aria-label={`Win-loss record: ${winLossRecord}`}
            aria-valuenow={wins}
            aria-valuemin={0}
            aria-valuemax={total}
          >
            {wins > 0 && (
              <div
                style={{
                  width: `${winPercentage}%`,
                  backgroundColor: 'var(--psp-success, #22c55e)',
                  transition: 'width 0.3s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                title={`${wins} wins`}
              >
                {height >= 16 && winPercentage > 15 && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>W</span>
                )}
              </div>
            )}
            {losses > 0 && (
              <div
                style={{
                  width: `${lossPercentage}%`,
                  backgroundColor: 'var(--psp-danger, #ef4444)',
                  transition: 'width 0.3s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                title={`${losses} losses`}
              >
                {height >= 16 && lossPercentage > 15 && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>L</span>
                )}
              </div>
            )}
            {ties > 0 && (
              <div
                style={{
                  width: `${tiePercentage}%`,
                  backgroundColor: 'var(--psp-gray-400, #9ca3af)',
                  transition: 'width 0.3s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                title={`${ties} ties`}
              >
                {height >= 16 && tiePercentage > 15 && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>T</span>
                )}
              </div>
            )}
          </div>
        </div>
        {showLabel && (
          <div
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: 'var(--psp-navy, #0a1628)' }}
          >
            {winLossRecord}
          </div>
        )}
      </div>
      {/* Win percentage and W/L legend */}
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--psp-navy, #0a1628)' }}>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, backgroundColor: 'var(--psp-success, #22c55e)' }} />
            <span>W {wins}</span>
          </span>
          <span className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, backgroundColor: 'var(--psp-danger, #ef4444)' }} />
            <span>L {losses}</span>
          </span>
          {ties > 0 && (
            <span className="flex items-center gap-1">
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, backgroundColor: 'var(--psp-gray-400, #9ca3af)' }} />
              <span>T {ties}</span>
            </span>
          )}
        </div>
        <span className="font-semibold">{winPercent}%</span>
      </div>
    </div>
  );
}

export default React.memo(WinLossBar);
