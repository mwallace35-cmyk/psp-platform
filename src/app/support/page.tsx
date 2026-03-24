export const revalidate = 86400;
export const dynamic = "force-dynamic";
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support PSP | Help Preserve Philly Sports History',
  description: 'Help preserve and celebrate Philadelphia high school sports. Support PhillySportsPack with a donation or monthly subscription.',
  openGraph: {
    title: 'Support PhillySportsPack',
    description: 'Help preserve 25 years of Philadelphia high school sports data and stories.',
  },
};

interface SupportTier {
  name: string;
  amount: string;
  frequency: string;
  description: string;
  emoji: string;
  badge?: string;
}

const SUPPORT_TIERS: SupportTier[] = [
  {
    name: 'Buy Me a Coffee',
    amount: '$5',
    frequency: 'one-time',
    description: 'Fuel the mission with a small gesture of support. Every dollar helps keep the servers running.',
    emoji: '☕',
  },
  {
    name: 'Monthly Supporter',
    amount: '$10',
    frequency: '/month',
    description: 'Become a monthly champion. Your recurring support ensures we can continuously improve and expand the platform.',
    emoji: '⭐',
    badge: 'RECOMMENDED',
  },
  {
    name: 'Annual Patron',
    amount: '$100',
    frequency: '/year',
    description: 'Commit to a full year of preservation. Save 17% compared to monthly giving.',
    emoji: '👑',
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy-mid to-navy pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="psp-h1-lg text-gold mb-6">
            HELP PRESERVE HISTORY
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            PhillySportsPack is a passion project dedicated to preserving and celebrating 25 years of Philadelphia high school sports data.
          </p>
          <p className="text-white/70 max-w-2xl mx-auto">
            Founded by Ted Silary and built on the collective memory of thousands of coaches, athletes, and fans, PSP is a gift to the Philly sports community. Your support helps us keep this digital archive alive and continuously growing.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-navy-mid py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="psp-h2 text-white mb-12 text-center">
            THE MISSION
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-white font-bold mb-3 text-lg">Preserve Data</h3>
              <p className="text-white/70 text-sm">
                Digitize 25 years of Philadelphia high school sports history before it's lost to time. From newspaper clippings to historical records, we're building the ultimate archive.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-white font-bold mb-3 text-lg">Celebrate Athletes</h3>
              <p className="text-white/70 text-sm">
                Honor the achievements of thousands of student athletes, coaches, and programs that shaped the Philly sports landscape.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-white font-bold mb-3 text-lg">Build Community</h3>
              <p className="text-white/70 text-sm">
                Create a gathering place for parents, coaches, athletes, alumni, and fans to connect and celebrate Philly HS sports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Support */}
      <section className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="psp-h2 text-white mb-12 text-center">
            WHERE YOUR SUPPORT GOES
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-navy-mid rounded-lg border-l-4 border-gold">
              <h3 className="text-gold font-bold mb-2 text-lg">🖥️ Technology & Hosting</h3>
              <p className="text-white/70">
                Database servers, backup infrastructure, CDN, and continuous deployment keep the site running 24/7.
              </p>
            </div>

            <div className="p-6 bg-navy-mid rounded-lg border-l-4 border-gold">
              <h3 className="text-gold font-bold mb-2 text-lg">🔍 Data Collection & Curation</h3>
              <p className="text-white/70">
                Digitizing archives, fact-checking records, and enriching data with player bios, college/pro placements, and verified stats.
              </p>
            </div>

            <div className="p-6 bg-navy-mid rounded-lg border-l-4 border-gold">
              <h3 className="text-gold font-bold mb-2 text-lg">📱 Platform Development</h3>
              <p className="text-white/70">
                Building new features, improving search, adding mobile responsiveness, and expanding to new sports and features.
              </p>
            </div>

            <div className="p-6 bg-navy-mid rounded-lg border-l-4 border-gold">
              <h3 className="text-gold font-bold mb-2 text-lg">🎯 Community Programs</h3>
              <p className="text-white/70">
                Supporting Player of the Week voting, forums, live game coverage integration, and recruiting tools for schools.
              </p>
            </div>

            <div className="p-6 bg-navy-mid rounded-lg border-l-4 border-gold">
              <h3 className="text-gold font-bold mb-2 text-lg">🎓 Educational Initiatives</h3>
              <p className="text-white/70">
                Partner with schools and programs to integrate PSP data into curricula and athletic programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="bg-navy-mid py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="psp-h2 text-white mb-4 text-center">
            SUPPORT LEVELS
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
            Choose the support level that works for you. Every contribution—big or small—helps keep Philly sports history alive.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {SUPPORT_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`
                  rounded-lg p-8 flex flex-col
                  ${
                    tier.badge
                      ? 'ring-2 ring-gold bg-gradient-to-br from-navy via-blue/5 to-navy'
                      : 'bg-navy border border-white/10'
                  }
                  relative
                `}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute top-0 right-0 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    {tier.badge}
                  </div>
                )}

                {/* Emoji */}
                <div className="text-6xl mb-4">{tier.emoji}</div>

                {/* Header */}
                <div className="mb-6">
                  <h3 className="psp-h3 text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-gold">{tier.amount}</span>
                    <span className="text-white/60 text-sm ml-1">{tier.frequency}</span>
                  </div>
                  <p className="text-white/70 text-sm">{tier.description}</p>
                </div>

                {/* CTA Button */}
                <button
                  disabled
                  className={`
                    w-full py-3 rounded-md font-bold transition-all text-lg
                    ${
                      tier.badge
                        ? 'bg-gold text-navy hover:bg-yellow-300 cursor-not-allowed opacity-75'
                        : 'bg-blue/60 text-white hover:bg-blue/80 cursor-not-allowed opacity-75'
                    }
                  `}
                  title="Coming soon: payment processing"
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>

          {/* Coming Soon Note */}
          <div className="mt-12 p-6 bg-gradient-to-r from-gold/10 via-blue/5 to-gold/10 border border-gold/30 rounded-lg text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="psp-h3 text-gold mb-3">
              PAYMENT PROCESSING COMING SOON
            </h3>
            <p className="text-white/80 mb-6">
              We're integrating with Stripe to enable secure donations and monthly subscriptions. Check back soon to support the mission!
            </p>
            <p className="text-white/60 text-sm">
              In the meantime, reach out to <strong>mike@phillysportspack.com</strong> if you'd like to discuss sponsorship or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="psp-h2 text-white mb-8 text-center">
            WHAT YOU&apos;LL GET
          </h2>

          <div className="bg-navy-mid p-8 rounded-lg border border-gold/30">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-semibold">Supporter Badge</p>
                  <p className="text-white/60 text-sm">Special badge on your profile (when account system launches)</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-gold text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-semibold">Early Access to Features</p>
                  <p className="text-white/60 text-sm">Get first access to new tools, data, and community features</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-gold text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-semibold">Name in Credits</p>
                  <p className="text-white/60 text-sm">Monthly supporters appear in our "Hall of Supporters" page</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-gold text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-semibold">Direct Impact</p>
                  <p className="text-white/60 text-sm">Every dollar directly funds preservation, data entry, and platform improvements</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-gold text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-semibold">Insider Updates</p>
                  <p className="text-white/60 text-sm">Get behind-the-scenes updates on new sports, data acquisitions, and platform roadmap</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-navy-mid py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="psp-h2 text-white mb-8 text-center">
            FREQUENTLY ASKED
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">Is PSP a 501(c)(3) nonprofit?</h3>
              <p className="text-white/70">
                Not yet, but that's on the roadmap. For now, PSP is an independent project run by volunteers. We're exploring nonprofit status to provide tax-deductible donations and formalize our mission.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">How much does it cost to run PSP?</h3>
              <p className="text-white/70">
                Monthly infrastructure costs are approximately $300-500 (database, hosting, CDN). Development, data curation, and community management are currently volunteer-based. Your support helps us scale sustainably.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">Will PSP always be free to use?</h3>
              <p className="text-white/70">
                Yes. Core stats, profiles, and search will always be free. Premium features (advanced filtering, exports, ad-free) will be optional for power users. Donations and sponsorships help keep the base platform free for everyone.
              </p>
            </div>

            <div className="p-6 bg-navy rounded-lg border border-gold/30">
              <h3 className="text-gold font-bold mb-2 text-lg">Can I make a larger one-time donation?</h3>
              <p className="text-white/70">
                Absolutely! Contact us at <strong>mike@phillysportspack.com</strong> to discuss major gifts or planned giving. All contributions are deeply appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-gold/10 via-blue/5 to-gold/10 border-t border-gold/30 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="psp-h2 text-white mb-4">
            Join the Mission
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Help us preserve 25 years of Philadelphia high school sports history. Your support—no matter the size—makes a real difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 rounded-md bg-gold text-navy font-bold hover:bg-yellow-300 transition-all"
            >
              Explore PSP
            </Link>
            <Link
              href="/advertise"
              className="px-8 py-3 rounded-md bg-blue/60 text-white font-bold hover:bg-blue/80 transition-all"
            >
              Business Sponsorship
            </Link>
          </div>
          <p className="text-white/60 text-sm mt-6">
            Questions? Email <strong>mike@phillysportspack.com</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
