'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SPORT_META, VALID_SPORTS } from '@/lib/sports';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
}

export default function NewsletterSignup({ variant = 'card' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  function toggleSport(sport: string) {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError('');

    try {
      // Generate tokens
      const confirmToken = crypto.randomUUID();
      const unsubToken = crypto.randomUUID();

      const { error: insertError } = await supabase.from('email_subscribers').insert({
        email,
        favorite_sports: selectedSports,
        confirmation_token: confirmToken,
        unsubscribe_token: unsubToken,
      });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This email is already subscribed!');
          return;
        }
        throw insertError;
      }

      // Trigger confirmation email via API
      await fetch('/api/email/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: confirmToken }),
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Newsletter signup error:', err);
      setError('Could not sign up. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={variant === 'card' ? 'bg-green-50 border border-green-200 rounded-lg p-6 text-center' : ''}>
        <p className="text-green-700 font-medium">Check your email to confirm your subscription!</p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md text-sm font-bold transition disabled:opacity-50"
          style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
        >
          {submitting ? '...' : 'Subscribe'}
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-lg p-6" style={{ background: 'var(--psp-navy)' }}>
      <h3
        className="text-xl font-bold text-white mb-2 tracking-wider"
        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
      >
        Stay in the Game
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Get weekly updates on Philly high school sports delivered to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-2 rounded-md text-sm bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />

        {/* Sport selection */}
        <div className="flex flex-wrap gap-1.5">
          {VALID_SPORTS.slice(0, 4).map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => toggleSport(sport)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                selectedSports.includes(sport)
                  ? 'text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
              style={selectedSports.includes(sport) ? { background: 'var(--psp-gold)', color: 'var(--psp-navy)' } : {}}
            >
              {SPORT_META[sport].emoji} {SPORT_META[sport].name}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-md text-sm font-bold transition disabled:opacity-50"
          style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
        >
          {submitting ? 'Signing up...' : 'Subscribe Free'}
        </button>
      </form>
    </div>
  );
}
