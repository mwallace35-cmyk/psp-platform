export const revalidate = 86400;
export const dynamic = "force-dynamic";
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise with PSP | Sponsorship Opportunities',
  description: 'Partner with PhillySportsPack. Reach 1000+ daily visitors and the Philly sports community. Flexible sponsorship tiers starting at $50/mo.',
  openGraph: {
    title: 'Advertise with PhillySportsPack',
    description: 'Sponsorship opportunities and advertising packages for Philadelphia high school sports.',
  },
};

interface SponsorTier {
  name: string;
  price: number;
  frequency: string;
  description: string;
  features: string[];
  color: string;
  ctaText: string;
}

const TIERS: SponsorTier[] = [
  {
    name: 'Community Supporter',
    price: 50,
    frequency: '/month',
    description: 'Perfect for local businesses and community organizations',
    features: [
      'Logo in website footer',
      'Monthly mention in newsletter',
      'Social media shout-out',
      'Link to your website',
    ],
    color: 'blue',
    ctaText: 'Get Started',
  },
  {
    name: 'Team Sponsor',
    price: 150,
    frequency: '/month',
    description: 'Ideal for schools and athletic programs',
    features: [
      'Everything in Community Supporter',
      'Sidebar placement on sport pages',
      'Featured logo on school profiles',
      'Custom sponsor badge',
      'Quarterly newsletter feature',
    ],
    color: 'gold',
    ctaText: 'Sponsor a Team',
  },
  {
    name: 'MVP Sponsor',
    price: 500,
    frequency: '/month',
    description: 'Maximum visibility and engagement',
    features: [
      'Everything in Team Sponsor',
      'Banner ads on homepage',
      'Featured content placement',
      'Custom landing page',
      'Newsletter header placement',
      'Sponsor badge on all pages',
      'Monthly performance report',
    ],
    color: 'gold',
    ctaText: 'Become an MVP',
  },
  {
    name: 'Hall of Fame Partner',
    price: 1000,
    frequency: '/month',
    description: 'Premium partner-level sponsorship',
    features: [
      'Everything in MVP Sponsor',
      'Custom landing page',
      'Direct data access & API',
      'Exclusive partnership branding',
      'Dedicated account manager',
      'Quarterly strategy calls',
      'Co-branded content opportunities',
      'Featured in annual report',
    ],
    color: 'gold',
    ctaText: 'Become a Hall of Famer',
  },
];

interface AudienceSegment {
  title: string;
  description: string;
  icon: string;
}

const AUDIENCE: AudienceSegment[] = [
  {
    title: 'Student Athletes',
    description: 'Current high school players tracking their stats and recruitment profiles',
    icon: '⚡',
  },
  {
    title: 'Parents & Families',
    description: 'Families following their kids\' teams and connecting with the community',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Coaches & Schools',
    description: 'Athletic directors and coaches managing teams and seasons',
    icon: '🎯',
  },
  {
    title: 'Recruiters',
    description: 'College coaches and scouts evaluating Philadelphia talent',
    icon: '🔍',
  },
  {
    title: 'Media & Journalists',
    description: 'Local sports reporters covering high school athletics',
    icon: '📰',
  },
  {
    title: 'Alumni',
    description: 'Graduates reconnecting with their schools\' athletic legacies',
    icon: '⭐',
  },
];

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy-mid to-navy pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="psp-h1-lg text-gold mb-6">
            PARTNER WITH PSP
          </h1>
          <p className="text-xl text-white/90 mb-4">
            Reach the Philadelphia high school sports community
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-white/80 text-base mt-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-gold">50K+</span>
              <span className="text-sm">Monthly Visitors</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-gold">1,200+</span>
              <span className="text-sm">Schools Covered</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-gold">7</span>
              <span className="text-sm">Sports</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-gold">25</span>
              <span className="text-sm">Years of Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="bg-navy-mid py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="psp-h2 text-white mb-12 text-center">
            WHO VISITS PSP
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {AUDIENCE.map((segment, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-navy border border-gold/30 hover:border-gold/60 transition-colors"
              >
                <div className="text-4xl mb-3">{segment.icon}</div>
                <h3 className="text-white font-bold mb-2 text-lg">{segment.title}</h3>
                <p className="text-white/70 text-sm">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="bg-navy py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="psp-h2 text-white mb-4 text-center">
            SPONSORSHIP TIERS
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
            Flexible pricing for local businesses, schools, and community partners. All packages include custom reporting and support.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier, idx) => {
              const isHighlighted = tier.color === 'gold';
              return (
                <div
                  key={idx}
                  className={`
                    rounded-lg p-6 flex flex-col
                    ${
                      isHighlighted
                        ? 'ring-2 ring-gold bg-gradient-to-br from-navy via-blue/5 to-navy'
                        : 'bg-navy-mid border border-white/10'
                    }
                  `}
                >
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="psp-h3 text-white mb-2">
                      {tier.name}
                    </h3>
                    <div className="mb-3">
                      <span className="text-4xl font-bold text-gold">${tier.price}</span>
                      <span className="text-white/60 text-sm">{tier.frequency}</span>
                    </div>
                    <p className="text-white/70 text-xs leading-snug">{tier.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature, fidx) => (
                      <li
                        key={fidx}
                        className="flex items-start gap-2 text-white/80 text-sm"
                      >
                        <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`
                      w-full py-3 rounded-md font-bold transition-all
                      ${
                        isHighlighted
                          ? 'bg-gold text-navy hover:bg-yellow-300'
                          : 'bg-blue/60 text-white hover:bg-blue/80'
                      }
                    `}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Custom Plans */}
          <div className="mt-12 p-8 bg-gradient-to-r from-gold/10 via-blue/5 to-gold/10 border border-gold/30 rounded-lg text-center">
            <h3 className="psp-h3 text-gold mb-2">
              Looking for something custom?
            </h3>
            <p className="text-white/80 mb-6">
              We offer flexible partnership options tailored to your goals and budget.
            </p>
            <button className="px-6 py-3 rounded-md bg-gold text-navy font-bold hover:bg-yellow-300 transition-all">
              Discuss Custom Sponsorship
            </button>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="bg-navy-mid py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="psp-h2 text-white mb-12 text-center">
            WHY PARTNER WITH PSP
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-white font-bold mb-2 text-lg">Targeted Audience</h3>
              <p className="text-white/70">
                Reach coaches, athletes, parents, and recruiters actively engaged with Philadelphia high school sports.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-white font-bold mb-2 text-lg">Performance Tracking</h3>
              <p className="text-white/70">
                Get detailed analytics on impressions, clicks, and engagement for your sponsorship.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-white font-bold mb-2 text-lg">Community-First</h3>
              <p className="text-white/70">
                Partner with a non-profit-style platform dedicated to preserving and celebrating Philly sports history.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-white font-bold mb-2 text-lg">Brand Association</h3>
              <p className="text-white/70">
                Align your brand with the definitive source for Philadelphia high school sports data and stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-navy py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="psp-h2 text-white mb-8 text-center">
            GET IN TOUCH
          </h2>

          <form className="space-y-6 bg-navy-mid p-8 rounded-lg border border-gold/30">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Your Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-md bg-navy border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-md bg-navy border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Company / Organization
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-md bg-navy border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold"
                placeholder="Your business or organization"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Interested Tier
              </label>
              <select
                className="w-full px-4 py-3 rounded-md bg-navy border border-white/20 text-white focus:outline-none focus:border-gold"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a sponsorship tier
                </option>
                <option value="community">Community Supporter ($50/mo)</option>
                <option value="team">Team Sponsor ($150/mo)</option>
                <option value="mvp">MVP Sponsor ($500/mo)</option>
                <option value="hof">Hall of Fame Partner ($1,000/mo)</option>
                <option value="custom">Custom Package</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Tell Us About Your Sponsorship Goals
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-md bg-navy border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold resize-none"
                rows={5}
                placeholder="What are you looking to achieve with a PSP sponsorship?"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-gold text-navy font-bold hover:bg-yellow-300 transition-all text-lg"
            >
              Submit Sponsorship Inquiry
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            We'll get back to you within 24 hours with more information about your sponsorship options.
          </p>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-gold/10 via-blue/5 to-gold/10 border-t border-gold/30 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="psp-h2 text-white mb-4">
            Ready to reach Philly sports fans?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Partner with PhillySportsPack today and start connecting with the most engaged high school sports community in Philadelphia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#contact"
              className="px-8 py-3 rounded-md bg-gold text-navy font-bold hover:bg-yellow-300 transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/"
              className="px-8 py-3 rounded-md bg-blue/60 text-white font-bold hover:bg-blue/80 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
