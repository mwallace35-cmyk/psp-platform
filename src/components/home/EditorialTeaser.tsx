'use client';

import { useEffect, useState } from 'react';

const EDITORIAL_TEASERS = [
  {
    text: "Did you know? Wilt Chamberlain's Overbrook HS squad is part of the database. See his stats in context.",
    emoji: '🏀',
  },
  {
    text: "St. Joseph's Prep has produced 12+ NFL players. Explore the pipeline to professional football.",
    emoji: '🏈',
  },
  {
    text: "Roman Catholic leads all schools with 34 Catholic League football titles spanning decades.",
    emoji: '🏆',
  },
  {
    text: "From Neumann-Goretti's historic dynasty to Imhotep's recent run, see the greatest basketball programs.",
    emoji: '🏀',
  },
  {
    text: "La Salle has produced elite athletes across football, basketball, and baseball. Check their championship count.",
    emoji: '⚾',
  },
  {
    text: "Kobe Bryant played high school ball in the area. See who else from local schools made it to the NBA.",
    emoji: '🌟',
  },
];

export default function EditorialTeaser() {
  const [teaser, setTeaser] = useState<(typeof EDITORIAL_TEASERS)[0] | null>(null);

  useEffect(() => {
    // Select a random teaser on mount
    const randomIndex = Math.floor(Math.random() * EDITORIAL_TEASERS.length);
    setTeaser(EDITORIAL_TEASERS[randomIndex]);
  }, []);

  if (!teaser) return null;

  return (
    <div
      style={{
        marginTop: '2rem',
        padding: '1.25rem',
        backgroundColor: 'rgba(240, 165, 0, 0.08)',
        border: '1px solid var(--psp-gold)',
        borderRadius: '0.375rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        fontSize: '0.95rem',
        fontFamily: 'var(--font-dm-sans)',
        color: 'var(--psp-navy)',
      }}
    >
      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{teaser.emoji}</span>
      <p style={{ margin: 0, lineHeight: 1.5 }}>
        <strong>Did you know?</strong> {teaser.text}
      </p>
    </div>
  );
}
