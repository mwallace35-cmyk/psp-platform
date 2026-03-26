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

  // Ensure data.percentiles exists and is not empty
  const percentileEntries = data?.percentiles ? Object.entries(data.percentiles) : [];

  if (percentileEntries.length === 0) {
    return (
      <div
        style={{
          padding: '16px',
          color: '#666',
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        No percentile data available
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
        vs. {data?.totalPlayers ?? 0} players
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {percentileEntries.map(([key, percentile]) => {
          // Use friendly labels for known stat keys to avoid issues with
          // consecutive capitals (e.g. rushTDs -> "Rush T Ds")
          const STAT_LABELS: Record<string, string> = {
            rushYards: 'Rush Yards',
            rushTDs: 'Rush TDs',
            passYards: 'Pass Yards',
            passTDs: 'Pass TDs',
            recYards: 'Rec Yards',
            recTDs: 'Rec TDs',
            careerPoints: 'Career Points',
            careerRebounds: 'Career Rebounds',
            careerAssists: 'Career Assists',
            bestPpg: 'Best PPG',
          };
          const labelText = STAT_LABELS[key] ?? key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();

          // Ensure percentile is a valid number
          const validPercentile = typeof percentile === 'number' && !isNaN(percentile) ? Math.max(0, Math.min(100, percentile)) : 0;

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
                {labelText || 'Unknown'}
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
                    width: `${validPercentile}%`,
                    backgroundColor: barColor,
                    transition: 'width 0.6s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '8px',
                  }}
                >
                  {validPercentile > 10 && (
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {validPercentile}
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
                {validPercentile}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};