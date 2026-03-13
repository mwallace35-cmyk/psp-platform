'use client';

import { useState } from 'react';
import { SPORT_EMOJI } from './SportIcon';

interface ShareableStatCardProps {
  sport: string;
  statLabel: string; // "Rushing Yards"
  statValue: string | number; // "2,847"
  playerName: string;
  schoolName: string;
  timeframe: string; // "Career" or "2024-25 Season"
  rank?: number; // for "#1 All-Time"
  shareUrl?: string; // URL for the stat page
}

/**
 * ShareableStatCard — A visual card designed for social media sharing
 * Features:
 * - PSP branding (navy bg, gold stat number, white text)
 * - Copy link button
 * - Share on Twitter button with pre-filled text
 * - Looks good as a screenshot for sharing
 */
export default function ShareableStatCard({
  sport,
  statLabel,
  statValue,
  playerName,
  schoolName,
  timeframe,
  rank,
  shareUrl,
}: ShareableStatCardProps) {
  const [copied, setCopied] = useState(false);

  const emoji = SPORT_EMOJI[sport as keyof typeof SPORT_EMOJI] || '🏆';
  const fullUrl = shareUrl
    ? `https://phillysportspack.com${shareUrl}`
    : `https://phillysportspack.com`;

  // Build Twitter share text
  const tweetText = `${playerName} — ${statValue} ${statLabel}${rank ? ` (#${rank} All-Time)` : ''} | ${schoolName} • ${timeframe}`;
  const encodedTweet = encodeURIComponent(
    `${tweetText}\n\nCheck out this stat on PhillySportsPack →`
  );
  const encodedUrl = encodeURIComponent(fullUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <div
        className="rounded-xl p-8 text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">{emoji}</span>
          <h3
            className="text-sm font-bold tracking-wider uppercase"
            style={{ color: 'var(--psp-gold)' }}
          >
            {statLabel.toUpperCase()}
          </h3>
        </div>

        {/* Stat value (large and prominent) */}
        <div className="mb-6">
          <div
            className="text-6xl font-bold mb-2"
            style={{
              color: 'var(--psp-gold)',
              fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            {statValue}
          </div>
          <div className="text-sm text-gray-300 uppercase tracking-wide">
            {statLabel}
          </div>
        </div>

        {/* Player info */}
        <div className="border-t border-white/20 pt-6 mb-6">
          <div className="font-bold text-lg mb-1">{playerName}</div>
          <div className="text-sm text-gray-300">
            {schoolName} • {timeframe}
          </div>
          {rank && (
            <div
              className="text-xs mt-2 px-2 py-1 rounded w-fit"
              style={{
                background: 'rgba(240, 165, 0, 0.2)',
                color: 'var(--psp-gold)',
              }}
            >
              #{rank} All-Time
            </div>
          )}
        </div>

        {/* Branding */}
        <div className="text-xs text-gray-400">PhillySportsPack.com</div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-3">
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--psp-blue)',
            border: '1px solid var(--psp-blue)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
          }}
          title="Copy link to clipboard"
        >
          <span className="mr-1.5">🔗</span>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

        {/* Share on Twitter Button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTweet}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all text-white"
          style={{
            background: 'var(--psp-gold)',
            color: 'var(--psp-navy)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.filter = 'brightness(1)';
          }}
          title="Share on Twitter/X"
        >
          <span className="mr-1.5">𝕏</span>
          <span className="hidden sm:inline">Share</span>
          <span className="sm:hidden">Post</span>
        </a>
      </div>

      {/* Subtext */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Share this stat on social media
      </p>
    </div>
  );
}
