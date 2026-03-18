'use client';

import { useEffect, useState } from 'react';

interface PercentileData {
  sport: string;
  totalPlayers: number;
  percentiles: Record<string, number>;
  careerTotals: Record<string, number>;
}

interface PercentileRadarProps {
  slug: string;
  sport?: string;
}

export const PercentileRadar = ({ slug, sport }: PercentileRadarProps) => {
  const [data, setData] = useState<PercentileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPercentiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = sport ? `?sport=${sport}` : '';
        const response = await fetch(`/api/v1/players/${slug}/percentiles${queryParams}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch percentiles: ${response.statusText}`);
        }

        const percentileData = await response.json();

        if (!percentileData.percentiles || Object.keys(percentileData.percentiles).length === 0) {
          setError('No percentile data available');
          setData(null);
        } else {
          setData(percentileData);
        }
      } catch (err) {
        setError('No percentile data available');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPercentiles();
  }, [slug, sport]);

  const navy = '#0a1628';
  const footballGreen = '#16a34a';
  const basketballBlue = '#3b82f6';

  const barColor = data?.sport === 'football' ? footballGreen : basketballBlue;

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            height: '24px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          padding: '16px',
          color: '#666',
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        {error || 'No percentile data available'}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'DM Sans, sans-serif' }}>
      <div
        style={{
          fontSize: '13px',
          color: '#666',
          marginBottom: '20px',
          fontWeight: '500',
        }}
      >
        vs. {data.totalPlayers} players
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(data.percentiles).map(([key, percentile]) => {
          const labelText = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();

          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  minWidth: '100px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: navy,
                }}
              >
                {labelText}
              </div>

              <div
                style={{
                  flex: 1,
                  height: '24px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percentile}%`,
                    backgroundColor: barColor,
                    transition: 'width 0.6s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '8px',
                  }}
                >
                  {percentile > 10 && (
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {percentile}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  minWidth: '40px',
                  textAlign: 'right',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: navy,
                }}
              >
                {percentile}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};