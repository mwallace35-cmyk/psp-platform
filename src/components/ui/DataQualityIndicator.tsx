'use client';

interface DataQualityIndicatorProps {
  totalRecords: number;
  sport: string;
  isCareer: boolean;
  coverageYears?: string;
}

export default function DataQualityIndicator({
  totalRecords,
  sport,
  isCareer,
  coverageYears = '1937-2026',
}: DataQualityIndicatorProps) {
  const getQualityStatus = (s: string) => {
    if (s === 'football' || s === 'basketball') {
      return { status: 'Verified', dot: '🟢', color: 'var(--psp-green, #10b981)' };
    }
    if (s === 'baseball') {
      return { status: 'Partial', dot: '🟡', color: 'var(--psp-amber, #f59e0b)' };
    }
    return { status: 'Limited', dot: '⚫', color: 'var(--psp-gray-500)' };
  };

  const { status } = getQualityStatus(sport);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border" style={{ borderColor: 'var(--psp-gray-200)', background: 'rgba(10, 22, 40, 0.02)' }}>
      <span className="text-lg">{status === 'Verified' ? '✓' : status === 'Partial' ? '⚠' : '•'}</span>
      <div className="flex-1">
        <p className="text-xs font-semibold" style={{ color: 'var(--psp-navy)' }}>
          {status} Data
        </p>
        <p className="text-xs" style={{ color: 'var(--psp-gray-500)' }}>
          {totalRecords.toLocaleString()} records | Coverage: {coverageYears}
        </p>
      </div>
    </div>
  );
}
