'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/homepage.module.css';

interface SubscriptionTier {
  name: string;
  price: string;
  frequency: string;
  features: string[];
  highlighted: boolean;
}

const TIERS: SubscriptionTier[] = [
  {
    name: 'Free',
    price: '$0',
    frequency: 'forever',
    features: [
      'Weekly newsletter',
      'Basic stats access',
      'School & player profiles',
      'Community forum',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$5',
    frequency: '/month',
    features: [
      'Everything in Free',
      'Daily alerts',
      'Advanced search & filters',
      'Export player stats to CSV',
      'Ad-free experience',
      'Early access to new features',
    ],
    highlighted: false,
  },
];

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className={styles.newsletterSection}>
      <div className={styles.newsletterContainer}>
        <h2 className={styles.newsletterTitle}>STAY IN THE GAME</h2>
        <p className={styles.newsletterDesc}>
          Get weekly updates on top performances, championship highlights, and the stories shaping Philadelphia high school sports
        </p>

        {/* Tabs for Free vs Premium */}
        <div className="mb-8 flex gap-4 justify-center">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'free'
                ? 'bg-gold text-navy shadow-lg'
                : 'bg-navy-mid text-white/70 hover:text-white'
            }`}
          >
            Free Newsletter
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'premium'
                ? 'bg-gold text-navy shadow-lg'
                : 'bg-navy-mid text-white/70 hover:text-white'
            }`}
          >
            Premium Access
          </button>
        </div>

        {/* Free Tab */}
        {activeTab === 'free' && (
          <div className="mb-8 p-6 bg-navy-mid/30 border border-blue/30 rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gold mb-3">Free Tier Benefits</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                {TIERS[0].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-gold">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-white/60 text-sm mb-4">
              <strong className="text-white">Join 500+ Philly sports fans</strong> who stay updated on the action
            </p>

            <form className={styles.newsletterForm} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address for newsletter"
                className={styles.newsletterInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.newsletterBtn}>
                {submitted ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        )}

        {/* Premium Tab */}
        {activeTab === 'premium' && (
          <div className="mb-8 p-6 bg-gradient-to-br from-gold/10 via-blue/5 to-gold/10 border-2 border-gold/40 rounded-lg">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-gold">Premium Tier</h3>
                <span className="text-xs bg-gold text-navy px-2 py-1 rounded font-bold">BEST VALUE</span>
              </div>
              <p className="text-white/80 font-semibold mb-3">
                $5/month � Cancel anytime
              </p>
              <ul className="space-y-2 text-white/80 text-sm">
                {TIERS[1].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-gold">★</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/premium"
              className="block mt-6 px-6 py-3 rounded-lg bg-gold text-navy font-bold text-center hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
            >
              Start Your Free Trial
            </Link>
          </div>
        )}

        {/* Social Proof */}
        <p className="text-center text-white/50 text-xs mt-6">
          The official Philadelphia high school sports database — 25 years of data, 1,200+ schools, 50,000+ players
        </p>
      </div>
    </section>
  );
}
