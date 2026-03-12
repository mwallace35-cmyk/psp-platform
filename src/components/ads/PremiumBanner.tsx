'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PremiumBanner() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if dismissed (localStorage check)
    const dismissed = localStorage.getItem('psp-premium-banner-dismissed');
    const dismissedAt = dismissed ? parseInt(dismissed, 10) : null;
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    if (dismissedAt && now - dismissedAt < sevenDaysMs) {
      setIsDismissed(true);
    } else {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('psp-premium-banner-dismissed', Date.now().toString());
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div
      className="w-full bg-gradient-to-r from-gold/10 via-blue/5 to-gold/10 border-t border-b border-gold/30 py-4 px-6"
      role="region"
      aria-label="Premium features promotion"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm md:text-base text-white/90 font-medium">
            <span className="text-gold font-bold">✨ Go Premium:</span> Advanced stats, data exports, and
            ad-free browsing for $5/mo
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/premium"
            className="px-4 py-2 rounded-md bg-gold text-navy font-bold text-sm hover:bg-yellow-300 transition-colors shadow-md"
            aria-label="Learn about premium features"
          >
            Learn More
          </Link>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white/90"
            aria-label="Dismiss premium banner"
            title="Dismiss for 7 days"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
