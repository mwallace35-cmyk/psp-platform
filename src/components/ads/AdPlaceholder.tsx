'use client';

import React from 'react';

/**
 * Standard IAB sizes for sponsor placeholder display.
 * When real sponsors are integrated, swap the placeholder div for actual code.
 * NOTE: Class names and IDs intentionally avoid "ad/ads/advert" to prevent blocker interference.
 */
const SPOT_SIZES = {
  'sidebar-rect': { width: 300, height: 250, label: '300×250 Medium Rectangle' },
  'sidebar-tall': { width: 300, height: 600, label: '300×600 Half Page' },
  'sidebar-square': { width: 250, height: 250, label: '250×250 Square' },
  'leaderboard': { width: 728, height: 90, label: '728×90 Leaderboard' },
  'billboard': { width: 970, height: 250, label: '970×250 Billboard' },
  'mobile-banner': { width: 320, height: 50, label: '320×50 Mobile Banner' },
  'mobile-rect': { width: 320, height: 250, label: '320×250 Mobile Rectangle' },
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
  const config = SPOT_SIZES[size];
  const isFullWidth = config.width === 0;

  return (
    <div
      id={id}
      role="complementary"
      aria-label={`Advertisement placeholder: ${config.label}`}
      className={`psp-promo-spot ${className}`}
      style={{
        width: isFullWidth ? '100%' : `${config.width}px`,
        maxWidth: '100%',
        height: `${config.height}px`,
        background: '#f5f5f5',
        border: '1px solid #e5e5e5',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    />

  );
}

/**
 * Sidebar stack — standard combination for right rail.
 */
export function SidebarAdStack({ count = 2 }: { count?: 1 | 2 | 3 }) {
  return (
    <div className="psp-rail-stack">
      <AdPlaceholder size="sidebar-rect" id="psp-rail-top" />
      {count >= 2 && <AdPlaceholder size="sidebar-tall" id="psp-rail-mid" />}
      {count >= 3 && <AdPlaceholder size="sidebar-rect" id="psp-rail-btm" />}
    </div>
  );
}

/**
 * Leaderboard banner — responsive: 728×90 desktop, 320×50 mobile.
 */
export function LeaderboardAd({ id = 'psp-banner' }: { id?: string }) {
  return (
    <div className="psp-banner-wrap" style={{ margin: '16px 0', textAlign: 'center' }}>
      <div className="hide-mobile">
        <AdPlaceholder size="leaderboard" id={`${id}-lg`} />
      </div>
      <div className="hide-desktop">
        <AdPlaceholder size="mobile-banner" id={`${id}-sm`} />
      </div>
    </div>
  );
}

/**
 * In-content spot — full-width between content sections.
 */
export function InContentAd({ id = 'psp-spot-mid' }: { id?: string }) {
  return (
    <div style={{ margin: '20px 0', padding: '0' }}>
      <AdPlaceholder size="in-content" id={id} />
    </div>
  );
}

/**
 * In-feed spot — shorter, sits between cards.
 */
export function InFeedAd({ id = 'psp-spot-feed' }: { id?: string }) {
  return (
    <div style={{ margin: '12px 0', padding: '0' }}>
      <AdPlaceholder size="in-feed" id={id} />
    </div>
  );
}

/**
 * Billboard — large format. 970×250 desktop, 320×250 mobile.
 */
export function BillboardAd({ id = 'psp-hero-spot' }: { id?: string }) {
  return (
    <div className="psp-hero-wrap" style={{ margin: '20px 0', textAlign: 'center' }}>
      <div className="hide-mobile">
        <AdPlaceholder size="billboard" id={`${id}-lg`} />
      </div>
      <div className="hide-desktop">
        <AdPlaceholder size="mobile-rect" id={`${id}-sm`} />
      </div>
    </div>
  );
}
