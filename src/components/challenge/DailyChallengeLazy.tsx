'use client';

import dynamic from 'next/dynamic';

const DailyChallenge = dynamic(() => import('./DailyChallenge'), {
  loading: () => (
    <div className="text-center py-12">
      <div className="inline-block w-12 h-12 border-4 border-[var(--psp-gold)]/30 border-t-[var(--psp-gold)] rounded-full animate-spin" />
      <p className="text-gray-400 mt-4">Loading today's challenge...</p>
    </div>
  ),
  ssr: false, // Don't SSR challenge (uses localStorage)
});

export default DailyChallenge;
