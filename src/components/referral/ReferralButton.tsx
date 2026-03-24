'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface ReferralButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function ReferralButton({ className = '', variant = 'secondary' }: ReferralButtonProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralUrl, setReferralUrl] = useState<string | null>(null);

  const handleCreateReferral = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/referral/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: pathname }),
      });

      if (!response.ok) {
        throw new Error('Failed to create referral link');
      }

      const data = await response.json();
      setReferralUrl(data.referralUrl);

      // Copy to clipboard
      navigator.clipboard.writeText(data.referralUrl);
      setCopied(true);

      // Track the creation as an event
      await fetch('/api/referral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: data.referralCode,
          eventType: 'link_created',
        }),
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error creating referral link:', err);
    } finally {
      setLoading(false);
    }
  };

  const variantStyles = {
    primary: 'bg-[#f0a500] text-[#0a1628] hover:bg-[#d98900]',
    secondary: 'bg-[#0f2040] text-white hover:bg-[#1a2e52]',
    outline: 'border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white',
  };

  return (
    <div className={className}>
      <button
        onClick={handleCreateReferral}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${variantStyles[variant]} ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Creating...' : copied ? '✓ Copied!' : '📤 Share & Earn'}
      </button>
      {referralUrl && (
        <p className="text-xs text-gray-400 mt-2">
          Link copied to clipboard!
        </p>
      )}
    </div>
  );
}
