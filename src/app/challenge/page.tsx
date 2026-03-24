import { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui';
import DailyChallenge from '@/components/challenge/DailyChallengeLazy';
import StreakCounter from '@/components/challenge/StreakCounter';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 86400; // 24 hours
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'Daily Challenge — Who Had the Better Season? | PhillySportsPack',
  description: 'Test your knowledge with our daily player stats challenge. Compare two Philly athletes and guess who had the better season.',
  alternates: {
    canonical: 'https://phillysportspack.com/challenge',
  },
  openGraph: {
    title: 'Daily Challenge — PhillySportsPack',
    description: 'Test your knowledge with our daily player stats challenge.',
    url: 'https://phillysportspack.com/challenge',
    type: 'website',
  },
};

export default function ChallengePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--psp-navy)] to-[#1a3155]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://phillysportspack.com' },
          { name: 'Challenge', url: 'https://phillysportspack.com/challenge' },
        ]}
      />

      {/* Header */}
      <div className="border-b border-[var(--psp-gold)]/20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Challenge', href: '/challenge' },
            ]}
          />
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="psp-h1 text-white">
                WHO HAD THE BETTER SEASON?
              </h1>
              <p className="text-[var(--psp-gold)] text-lg mt-2">
                Test your Philly high school sports knowledge daily
              </p>
            </div>
            <StreakCounter />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DailyChallenge />
      </div>
    </main>
  );
}
