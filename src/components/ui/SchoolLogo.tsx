'use client';

/**
 * SchoolLogo — shows a school's logo image or falls back to initials on a colored circle.
 * Reusable across standings, score strips, school cards, etc.
 */

import { useState } from 'react';

interface SchoolLogoProps {
  logoUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 24,
  md: 32,
  lg: 48,
} as const;

const FONT_SIZE_MAP = {
  sm: '10px',
  md: '12px',
  lg: '16px',
} as const;

function getInitials(name: string): string {
  const words = name
    .replace(/^(Archbishop|Cardinal|Monsignor|St\.\s*)/i, '')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function InitialsCircle({ name, px, fontSize, className }: { name: string; px: number; fontSize: string; className: string }) {
  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-bold select-none ${className}`}
      style={{
        width: px,
        height: px,
        fontSize,
        backgroundColor: '#0a1628',
        color: '#ffffff',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

export default function SchoolLogo({ logoUrl, name, size = 'md', className = '' }: SchoolLogoProps) {
  const [imgError, setImgError] = useState(false);
  const px = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  if (!logoUrl || imgError) {
    return <InitialsCircle name={name} px={px} fontSize={fontSize} className={className} />;
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      width={px}
      height={px}
      loading="lazy"
      className={`rounded-md object-contain shrink-0 ${className}`}
      style={{ width: px, height: px }}
      onError={() => setImgError(true)}
    />
  );
}
