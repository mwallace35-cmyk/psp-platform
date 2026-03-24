export const revalidate = 3600;
export const dynamic = "force-dynamic";
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium PSP | Advanced Stats & Features',
  description: 'Unlock premium features for PhillySportsPack. Advanced search, data exports, and ad-free browsing. $5/month.',
  openGraph: {
    title: 'Premium PhillySportsPack',
    description: 'Advanced stats, data exports, and ad-free experience.',
  },
};

interface Feature {
  name: string;
  description: string;
  icon: string;
  tier: 'free' | 'premium' | 'both';
}

const FEATURES: Feature[] = [
  {
    name: 'Player Profiles',
    description: 'Complete stat lines, career history, and next-level tracking',
    icon: '👤',
    tier: 'both',
  },
  {
    name: 'School Records',
    description: 'Championship history, records, and program statistics',
    icon: '🏫',
    tier: 'both',
  },
  {
    name: 'Basic Search',
    description: 'Search players, schools, and coaches',
    icon: '🔍',
    tier: 'both',
  },
  {
    name: 'Advanced Filtering',
    description: 'Filter by position, graduation year, stats, and more',
    icon: '⚙️',
    tier: 'premium',
  },
  {
    name: 'CSV Export',
    description: 'Export player stats and records to spreadsheets',
    icon: '📊',
    tier: 'premium',
  },
  {
    name: 'Daily Alerts',
    description: 'Get notified about new records, rankings, and achievements',
    icon: '🔔',
    tier: 'premium',
  },
  {
    name: 'Ad-Free Browsing',
    description: 'No ads, no distractions—pure sports data',
    icon: '✨',
    tier: 'premium',
  },
  {
    name: 'Early Access',
    description: 'Be first to try new features and data',
    icon: '⭐',
    tier: 'premium',
  },
];

export default function PremiumPage() {
  const freeFeatures = FEATURES.filter(f => f.tier === 'free' || f.tier === 'both');
  const premiumFeatures = FEATURES.filter(f => f.tier === 'premium');

  return (
    <main className="min-h-screen bg-navy">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy-mid to-navy pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl md:text-6xl mb-6">✨</div>
          <h1 className="psp-h1-lg text-gold mb-6">
            PREMIUM PSP
          </h1>
          <p className="text-xl text-white/90 mb-4">
            Unlock advanced tools and features for serious sports data enthusiasts
          </p>
          <div className="bg-gradient-to-r from-gold/10 via-blue/5 to-gold/10 border border-gold/30 rounded-lg p-6 max-w-md mx-auto mt-8">
            <div className="text-3xl font-bold text-gold mb-2">$5</div>
            <p className="text-white/80">per month • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-navy-mid py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="psp-h2 text-white mb-12 text-center">
            WHAT YOU GET
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Free Column */}
            <div className="bg-navy rounded-lg p-8 border border-white/10">
              <h3 className="psp-h3 text-white mb-6">FREE</h3>
              <ul className="space-y-4">
                {freeFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{feature.name}</p>
                      <p className="text-white/80 text-xs mt-0.5">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Column */}
            <div className="bg-gradient-to-br from-gold/10 via-blue/5 to-gold/10 border-2 border-gold/40 rounded-lg p-8 relative">
              <div className="absolute top-0 right-0 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                PREMIUM
              </div>
              <h3 className="psp-h3 text-gold mb-6">FREE + PREMIUM</h3>
              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 opacity-60">
                    <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{feature.name}</p>
                      <p className="text-white/80 text-xs mt-0.5">{feature.description}</p>
                    </div>
                  </li>
                ))}
                {premiumFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 pt-3 border-t border-gold/30">
                    <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{feature.name}</p>
                      <p className="text-white/80 text-xs mt-0.5">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              disabled
              className="px-8 py-4 rounded-lg bg-gold text-navy font-bold text-lg hover:bg-yellow-300 transition-all cursor-not-allowed opacity-75"
              title="Coming soon: payment processing"
            >
              Coming Soon: Upgrade to Premium
            </button>
            <p className="text-white/80 text-sm mt-4">
              Payment processing launching Q2 2026
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="psp-h2 text-white mb-12 text-center">
            PERFECT FOR
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-navy-mid rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-white font-bold mb-2 text-lg">Researchers & Writers</h3>
              <p className="text-white/80 text-sm">
                Export data in bulk, analyze trends, and cite official stats for articles and papers.
              </p>
            </div>

            <div className="p-6 bg-navy-mid rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-white font-bold mb-2 text-lg">Recruiters & Scouts</h3>
              <p className="text-white/80 text-sm">
                Advanced filtering by graduation year, position, and performance metrics.
              </p>
            </div>

            <div className="p-6 bg-navy-mid rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-white font-bold mb-2 text-lg">Coaches & Athletic Directors</h3>
              <p className="text-white/80 text-sm">
                Track your program's history, compare schedules, and access opponent data.
              </p>
            </div>

            <div className="p-6 bg-navy-mid rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-white font-bold mb-2 text-lg">Serious Fans</h3>
              <p className="text-white/80 text-sm">
                Deep dives into records, all-time stats, and program championships without ads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-navy-mid py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="psp-h2 text-white mb-8 text-center">
            FAQ
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">Can I cancel anytime?</h3>
              <p className="text-white/80">
                Yes. Premium is month-to-month with no lock-in. Cancel whenever you want.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">Will PSP always have free content?</h3>
              <p className="text-white/80">
                Absolutely. All core stats, profiles, and search will always be free. Premium is optional for power users.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">What file formats can I export?</h3>
              <p className="text-white/80">
                Premium users can export data as CSV, JSON, or Excel files. Perfect for analysis in spreadsheets or databases.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">Do you offer team or school licenses?</h3>
              <p className="text-white/80">
                Yes! Contact us at <strong>mike@phillysportspack.com</strong> to discuss volume pricing or team subscriptions.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">Is there an API for developers?</h3>
              <p className="text-white/80">
                Coming soon! Premium subscribers will get access to our API for custom integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-gold/10 via-blue/5 to-gold/10 border-t border-gold/30 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="psp-h2 text-white mb-4">
            Ready to go premium?
          </h2>
          <p className="text-white/80 mb-6">
            Upgrade to Premium when payment processing launches, or reach out to discuss team/school licenses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 rounded-md bg-gold text-navy font-bold hover:bg-yellow-300 transition-all"
            >
              Back to Home
            </Link>
            <Link
              href="/advertise"
              className="px-8 py-3 rounded-md bg-blue/60 text-white font-bold hover:bg-blue/80 transition-all"
            >
              Business Sponsorship
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
