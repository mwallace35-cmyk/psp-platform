'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface HistoricalEvent {
  date: string;
  title: string;
  description: string;
  sport: string;
  sportSlug: string;
  year: number;
}

export default function ThisDayInHistory() {
  const [event, setEvent] = useState<HistoricalEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodaysEvent = async () => {
      try {
        // Get today's month and day
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const response = await fetch(
          `/api/this-day-in-history?month=${month}&day=${day}`
        );

        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        }
      } catch (error) {
        console.error('Failed to fetch historical event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysEvent();
  }, []);

  if (loading || !event) {
    return null;
  }

  // Determine sport emoji
  const sportEmojis: Record<string, string> = {
    football: '🏈',
    basketball: '🏀',
    baseball: '⚾',
    soccer: '⚽',
    lacrosse: '🥍',
    'track-field': '🏃',
    wrestling: '🤼',
  };

  const emoji = sportEmojis[event.sportSlug] || '🏆';

  return (
    <section className="this-day-in-history">
      <div
        className="this-day-container"
        style={{
          background:
            'linear-gradient(135deg, var(--psp-navy) 0%, #0f2040 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{emoji}</div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: 0.9,
                fontFamily: 'var(--font-bebas)',
                marginBottom: '0.5rem',
              }}
            >
              This Day in Philly Sports
            </p>
            <h3
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontFamily: 'var(--font-bebas)',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: 'var(--psp-gold)',
              }}
            >
              {event.title}
            </h3>
            <p
              style={{
                margin: '0 0 1rem 0',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                opacity: 0.95,
              }}
            >
              {event.description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.875rem',
                opacity: 0.85,
              }}
            >
              <span>{event.year}</span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--psp-gold)',
                  color: 'var(--psp-navy)',
                  borderRadius: '0.25rem',
                  fontWeight: 'bold',
                }}
              >
                {event.sport}
              </span>
              {event.sportSlug && (
                <Link
                  href={`/${event.sportSlug}`}
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--psp-gold)',
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                  }}
                >
                  Explore {event.sport} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
