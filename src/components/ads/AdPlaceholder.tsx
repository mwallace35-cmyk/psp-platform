import React from 'react';

/**
 * Standard IAB sizes for sponsor placeholder display.
 * When real sponsors are integrated, swap the placeholder div for actual code.
 * NOTE: Class names and IDs intentionally avoid "ad/ads/advert" to prevent blocker interference.
 */
const SPOT_SIZES = {
  'sidebar-rect': { width: 300, height: 250, label: '300�250 Medium Rectangle' },
  'sidebar-tall': { width: 300, height: 600, label: '300�600 Half Page' },
  'sidebar-square': { width: 250, height: 250, label: '250�250 Square' },
  'leaderboard': { width: 728, height: 90, label: '728�90 Leaderboard' },
  'billboard': { width: 970, height: 250, label: '970�250 Billboard' },
  'mobile-banner': { width: 320, height: 50, label: '320�50 Mobile Banner' },
  'mobile-rect': { width: 320, height: 250, label: '320�250 Mobile Rectangle' },
  'in-content': { width: 0, height: 250, label: 'In-Content Spot' },
  'in-feed': { width: 0, height: 120, label: 'In-Feed Spot' },
} as const;

type SpotSize = keyof typeof SPOT_SIZES;

interface SpotPlaceholderProps {
  size: SpotSize;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export default function AdPlaceholder({ size, className = '', id, style }: SpotPlaceholderProps) {
  // Hide ad placeholders until real sponsors are integrated.
  // Returning null prevents empty gray boxes from cluttering the UI.
  return null;
}

/**
 * Sidebar stack — standard combination for right rail.
 * Hidden until real sponsors are integrated.
 */
export function SidebarAdStack({ count = 2 }: { count?: 1 | 2 | 3 }) {
  return null;
}

/**
 * Leaderboard banner — responsive: 728x90 desktop, 320x50 mobile.
 * Hidden until real sponsors are integrated.
 */
export function LeaderboardAd({ id = 'psp-banner' }: { id?: string }) {
  return null;
}

/**
 * In-content spot — full-width between content sections.
 * Hidden until real sponsors are integrated.
 */
export function InContentAd({ id = 'psp-spot-mid' }: { id?: string }) {
  return null;
}

/**
 * In-feed spot — shorter, sits between cards.
 * Hidden until real sponsors are integrated.
 */
export function InFeedAd({ id = 'psp-spot-feed' }: { id?: string }) {
  return null;
}

/**
 * Billboard — large format. 970x250 desktop, 320x250 mobile.
 * Hidden until real sponsors are integrated.
 */
export function BillboardAd({ id = 'psp-hero-spot' }: { id?: string }) {
  return null;
}
