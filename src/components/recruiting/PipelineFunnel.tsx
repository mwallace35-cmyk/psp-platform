'use client';

interface FunnelLevel {
  label: string;
  count: number;
  percentage: number;
}

interface PipelineFunnelProps {
  data?: {
    tracked?: number;
    college?: number;
    professional?: number;
    coaching?: number;
  };
}

export default function PipelineFunnel({ data }: PipelineFunnelProps) {
  // Use provided data or sample data
  const funnelData = data || {
    tracked: 847,
    college: 234,
    professional: 47,
    coaching: 12,
  };

  const maxCount = (funnelData.tracked || 0) as number;
  const levels: FunnelLevel[] = [
    {
      label: 'High School Players Tracked',
      count: (funnelData.tracked || 0) as number,
      percentage: 100,
    },
    {
      label: 'Playing in College',
      count: (funnelData.college || 0) as number,
      percentage: ((funnelData.college || 0) / maxCount) * 100,
    },
    {
      label: 'Professional Athletes',
      count: (funnelData.professional || 0) as number,
      percentage: ((funnelData.professional || 0) / maxCount) * 100,
    },
    {
      label: 'Coaching/Giving Back',
      count: (funnelData.coaching || 0) as number,
      percentage: ((funnelData.coaching || 0) / maxCount) * 100,
    },
  ];


  return (
    <div
      style={{
        padding: '20px',
        background: 'var(--card)',
        borderRadius: 8,
        border: '1px solid var(--g100)',
        marginBottom: 16,
      }}
    >
      <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16, margin: 0 }}>
        Philly Pipeline
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {levels.map((level, index) => {
          // Calculate color gradient from navy to gold
          const progress = index / (levels.length - 1);
          const colorValue =
            index === 0
              ? '#0a1628'
              : index === levels.length - 1
                ? '#f0a500'
                : `rgb(${Math.round(10 + (240 - 10) * progress)}, ${Math.round(22 + (165 - 22) * progress)}, ${Math.round(40 + (0 - 40) * progress)})`;

          return (
            <div key={level.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                  {level.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colorValue }}>
                  {level.count.toLocaleString()}
                </span>
              </div>

              {/* Funnel bar */}
              <div
                style={{
                  width: `${level.percentage}%`,
                  height: 24,
                  background: `linear-gradient(90deg, #0a1628 0%, #f0a500 100%)`,
                  borderRadius: 4,
                  transition: 'width 0.4s ease-out',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />

              {/* Percentage */}
              <span style={{ fontSize: 11, color: 'var(--g400)', fontWeight: 500 }}>
                {level.percentage.toFixed(1)}% of tracked
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid var(--g100)',
          fontSize: 11,
          color: 'var(--g400)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>Total Tracked:</span>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>
            {levels[0]?.count.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Advanced to Next Level:</span>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>
            {(levels[1]?.count || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
