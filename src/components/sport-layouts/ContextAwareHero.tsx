'use client';

import React from 'react';

interface School {
  name: string;
}

interface Game {
  id: number;
  game_date?: string | null;
  home_school?: School | null;
  away_school?: School | null;
  home_score?: number | null;
  away_score?: number | null;
}

interface FeaturedArticle {
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
  published_at?: string | null;
}

interface ContextAwareHeroProps {
  sport: string;
  sportColor: string;
  metaName: string;
  recentGames: Game[];
  featuredArticle?: FeaturedArticle;
  playerCount?: number;
  schoolCount?: number;
}

const ContextAwareHero: React.FC<ContextAwareHeroProps> = ({
  sport,
  sportColor,
  metaName,
  recentGames,
  featuredArticle,
  playerCount,
  schoolCount,
}) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Check if there's a game today
  const gameToday = recentGames.find((game) => {
    if (!game.game_date) return false;
    const gameDate = game.game_date.split('T')[0];
    return gameDate === todayString;
  });

  const pulseKeyframes = `
    @keyframes heroGameDayPulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
    }
  `;

  if (gameToday) {
    // Game Day Mode
    const homeTeam = gameToday.home_school?.name || 'Home Team';
    const awayTeam = gameToday.away_school?.name || 'Away Team';
    const hasScore =
      gameToday.home_score !== null &&
      gameToday.home_score !== undefined &&
      gameToday.away_score !== null &&
      gameToday.away_score !== undefined;

    return (
      <>
        <style>{pulseKeyframes}</style>
        <div
          style={{
            height: '320px',
            borderRadius: '6px',
            background: `linear-gradient(135deg, #1A2744 0%, ${sportColor}33 100%)`,
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
          }}
        >
          {/* Game Day Badge */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: sportColor,
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              animation: 'heroGameDayPulse 2s infinite',
            }}
          >
            GAME DAY
          </div>

          {/* Matchup Section */}
          <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', opacity: 0.9 }}>
              {metaName}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{awayTeam}</div>
                {hasScore && <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{gameToday.away_score}</div>}
              </div>
              <div style={{ fontSize: '18px', opacity: 0.7 }}>vs</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{homeTeam}</div>
                {hasScore && <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{gameToday.home_score}</div>}
              </div>
            </div>

            {!hasScore && <div style={{ fontSize: '14px', opacity: 0.8 }}>TODAY</div>}
          </div>

          {/* Footer */}
          <div style={{ fontSize: '12px', opacity: 0.7, textAlign: 'center' }}>
            {sport} • Philadelphia
          </div>
        </div>
      </>
    );
  }

  if (featuredArticle) {
    // Off-Season Mode with Featured Article
    const backgroundImage = featuredArticle.featured_image_url
      ? `linear-gradient(135deg, rgba(26, 39, 68, 0.85) 0%, rgba(26, 39, 68, 0.85) 100%), url('${featuredArticle.featured_image_url}')`
      : `linear-gradient(135deg, #1A2744 0%, ${sportColor}33 100%)`;

    return (
      <div
        style={{
          height: '320px',
          borderRadius: '6px',
          background: backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
        }}
      >
        <h2
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}
        >
          {featuredArticle.title}
        </h2>

        {featuredArticle.excerpt && (
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.5',
              opacity: 0.9,
              marginBottom: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {featuredArticle.excerpt}
          </p>
        )}

        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          {sport} • Philadelphia
        </div>
      </div>
    );
  }

  // Fallback Mode
  return (
    <div
      style={{
        height: '320px',
        borderRadius: '6px',
        background: `linear-gradient(135deg, #1A2744 0%, ${sportColor}33 100%)`,
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}
        >
          Philadelphia High School {sport}
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '0' }}>
          The latest scores, standings, and stories from the {metaName}.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
        {playerCount !== undefined && (
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: sportColor }}>
              {playerCount.toLocaleString()}
            </div>
            <div style={{ opacity: 0.8 }}>Players</div>
          </div>
        )}
        {schoolCount !== undefined && (
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: sportColor }}>
              {schoolCount.toLocaleString()}
            </div>
            <div style={{ opacity: 0.8 }}>Schools</div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '12px', opacity: 0.7 }}>
        {sport} • Philadelphia
      </div>
    </div>
  );
};

export default ContextAwareHero;
