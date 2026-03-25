'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SimilarPlayer {
  name: string;
  slug: string;
  school_name: string;
  positions: string[];
  graduation_year: number;
  primary_stat_value: number;
  similarity_score: number;
}

interface SimilarPlayersResponse {
  player: {
    name: string;
    slug: string;
    school: string;
  };
  sport: string;
  primaryStat: number;
  similar: SimilarPlayer[];
}

interface SimilarPlayersProps {
  slug: string;
  sport?: string;
}

const DESIGN_TOKENS = {
  navy: '#0a1628',
  gold: '#f0a500',
  cardBg: '#f8fafc',
  border: '#e2e8f0',
  textMuted: '#64748b',
  textSecondary: '#475569',
};

const SkeletonCard = () => (
  <div
    style={{
      backgroundColor: DESIGN_TOKENS.cardBg,
      border: `1px solid ${DESIGN_TOKENS.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      animation: 'pulse 2s infinite',
    }}
  >
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
    <div
      style={{
        height: '20px',
        backgroundColor: DESIGN_TOKENS.border,
        borderRadius: '4px',
        marginBottom: '8px',
      }}
    />
    <div
      style={{
        height: '16px',
        backgroundColor: DESIGN_TOKENS.border,
        borderRadius: '4px',
        width: '70%',
      }}
    />
  </div>
);

export default function SimilarPlayers({ slug, sport }: SimilarPlayersProps) {
  const [data, setData] = useState<SimilarPlayersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarPlayers = async () => {
      try {
        setLoading(true);
        const url = new URL(`/api/v1/players/${slug}/similar`, window.location.origin);
        if (sport) {
          url.searchParams.set('sport', sport);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch similar players');
        }
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarPlayers();
  }, [slug, sport]);

  const similarPlayers = data?.similar?.slice(0, 5) ?? [];
  const hasPlayers = similarPlayers.length > 0;

  return (
    <section style={{ marginTop: '24px' }}>
      <h2
        style={{
          fontSize: '20px',
          fontWeight: '600',
          color: DESIGN_TOKENS.navy,
          marginBottom: '16px',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Similar Players
      </h2>

      {loading && (
        <div>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        >
          Error loading similar players: {error}
        </div>
      )}

      {!loading && !error && !hasPlayers && (
        <div
          style={{
            backgroundColor: DESIGN_TOKENS.cardBg,
            border: `1px solid ${DESIGN_TOKENS.border}`,
            color: DESIGN_TOKENS.textMuted,
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          No similar players found
        </div>
      )}

      {!loading && !error && hasPlayers && (
        <div>
          {similarPlayers.map((player) => (
            <div
              key={player.slug}
              style={{
                backgroundColor: DESIGN_TOKENS.cardBg,
                border: `1px solid ${DESIGN_TOKENS.border}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <Link
                href={`/players/${player.slug}`}
                style={{
                  color: DESIGN_TOKENS.navy,
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {player.name ?? 'Unknown'}
              </Link>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '8px',
                  fontSize: '14px',
                  color: DESIGN_TOKENS.textSecondary,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {player.school_name && (
                  <div>
                    <span style={{ color: DESIGN_TOKENS.textMuted }}>School:</span> {player.school_name}
                  </div>
                )}
                {player.positions?.length > 0 && (
                  <div>
                    <span style={{ color: DESIGN_TOKENS.textMuted }}>Position:</span> {player.positions.join(', ')}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '12px',
                  fontSize: '13px',
                  color: DESIGN_TOKENS.textSecondary,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <div>
                  <span style={{ color: DESIGN_TOKENS.textMuted }}>Stat:</span> {player.primary_stat_value ?? 0}
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    color: DESIGN_TOKENS.textMuted,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span>Similarity</span>
                  <span>{Math.round(player.similarity_score ?? 0)}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: DESIGN_TOKENS.border,
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${player.similarity_score ?? 0}%`,
                      backgroundColor: DESIGN_TOKENS.gold,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}