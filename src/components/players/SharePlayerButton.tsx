'use client';

import { useState, useCallback } from 'react';

interface SharePlayerButtonProps {
  playerName: string;
  playerSlug: string;
  schoolName?: string;
  sport?: string;
  statLine?: string;
}

export default function SharePlayerButton({
  playerName,
  playerSlug,
  schoolName,
  sport,
  statLine,
}: SharePlayerButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://phillysportspack.com/players/${playerSlug}`;

  const shareText = [
    `Check out ${playerName}`,
    schoolName ? `from ${schoolName}` : '',
    sport ? `(${sport})` : '',
    statLine ? `— ${statLine}` : '',
    'on Philly Sports Pack',
  ]
    .filter(Boolean)
    .join(' ');

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${playerName} – Philly Sports Pack`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // cancelled or failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [playerName, shareText, shareUrl]);

  return (
    <button
      onClick={handleShare}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: copied ? '#16a34a' : 'var(--psp-navy)',
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '6px',
        padding: '0.5rem 1.1rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.2s',
        letterSpacing: '0.01em',
      }}
      aria-label={copied ? 'Link copied!' : `Share ${playerName}'s profile`}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
      <span>{copied ? 'Link Copied!' : 'Share Player'}</span>
    </button>
  );
}
