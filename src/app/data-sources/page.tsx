import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Data Sources — PhillySportsPack',
  description:
    'Learn about the data sources powering PhillySportsPack. Coverage includes Ted Silary archives, MaxPreps, PIAA records, Hudl rosters, and historical newspaper data.',
  alternates: {
    canonical: 'https://phillysportspack.com/data-sources',
  },
};

export default function DataSourcesPage() {
  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={[{ name: 'Home', url: 'https://phillysportspack.com' }, { name: 'Data Sources', url: 'https://phillysportspack.com/data-sources' }]} />

      {/* Hero Section */}
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)` }}>
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Data Sources' }]} />
          <h1 className="psp-h1 text-white mt-4">
            Data Sources
          </h1>
          <p className="text-sm text-gray-300 mt-3 max-w-2xl">
            PhillySportsPack combines data from multiple trusted sources to bring you comprehensive Philadelphia high school sports coverage. Here&apos;s how we compile our data.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Primary Sources */}
        <section className="mb-12">
          <h2 className="psp-h2 mb-6" style={{ color: 'var(--psp-navy)' }}>
            Primary Data Sources
          </h2>

          {/* Ted Silary Archives */}
          <div className="mb-8 p-6 rounded-lg border" style={{ borderColor: 'var(--psp-gold)', background: 'rgba(240, 165, 0, 0.02)' }}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--psp-navy)' }}>
                  Ted Silary Archives (1937–2022)
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--psp-gray-600)' }}>
                  Hand-compiled statistics from Philadelphia newspapers and school records
                </p>
              </div>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--psp-gray-700)' }}>
              <p className="mb-3">
                Ted Silary has spent decades compiling comprehensive sports statistics from Philadelphia high school archives. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Philadelphia Daily News and Philadelphia Inquirer articles and box scores</li>
                <li>School athletic records and historical programs</li>
                <li>Game programs and tournament brackets</li>
                <li>Championships from 1903–2022 across all sports</li>
                <li>All-City teams dating back to 1932 (football)</li>
              </ul>
              <p className="text-xs font-semibold" style={{ color: 'var(--psp-gold)' }}>
                Confidence Level: High (Verified source documentation)
              </p>
            </div>
          </div>

          {/* MaxPreps */}
          <div className="mb-8 p-6 rounded-lg border" style={{ borderColor: 'var(--psp-blue)', background: 'rgba(59, 130, 246, 0.02)' }}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">🌐</span>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--psp-navy)' }}>
                  MaxPreps (2015–Present)
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--psp-gray-600)' }}>
                  Digital sports platform with live scores, schedules, and statistics
                </p>
              </div>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--psp-gray-700)' }}>
              <p className="mb-3">
                MaxPreps is the leading digital platform for high school sports. We extract:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Team schedules and game scores (2015–present)</li>
                <li>Individual player statistics for 45+ Philadelphia area schools</li>
                <li>Real-time game updates and play-by-play data</li>
                <li>Opponent records and strength-of-schedule analysis</li>
              </ul>
              <p className="text-xs font-semibold" style={{ color: 'var(--psp-blue)' }}>
                Confidence Level: High (Real-time, crowd-sourced verification)
              </p>
            </div>
          </div>

          {/* Hudl */}
          <div className="mb-8 p-6 rounded-lg border" style={{ borderColor: 'var(--psp-navy-mid)', background: 'rgba(15, 32, 64, 0.02)' }}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">📹</span>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--psp-navy)' }}>
                  Hudl (2015–Present)
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--psp-gray-600)' }}>
                  Video sports platform with official team rosters and game footage
                </p>
              </div>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--psp-gray-700)' }}>
              <p className="mb-3">
                Hudl is the official platform used by many Philadelphia high schools to manage rosters and share game film.
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Official team rosters for 45+ schools (2015–2026)</li>
                <li>Player names, numbers, and positions</li>
                <li>Season-by-season roster tracking</li>
                <li>Historical rosters back to 2015 in some cases</li>
              </ul>
              <p className="text-xs font-semibold" style={{ color: 'var(--psp-navy-mid)' }}>
                Confidence Level: Very High (Official team records)
              </p>
            </div>
          </div>

          {/* PIAA */}
          <div className="mb-8 p-6 rounded-lg border" style={{ borderColor: 'var(--psp-navy)', background: 'rgba(10, 22, 40, 0.02)' }}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--psp-navy)' }}>
                  PIAA (Pennsylvania Interscholastic Athletic Association)
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--psp-gray-600)' }}>
                  Official state championship brackets and results
                </p>
              </div>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--psp-gray-700)' }}>
              <p className="mb-3">
                PIAA is Pennsylvania&apos;s governing body for high school athletics. We source:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>State championship brackets and results</li>
                <li>Official tournament seedings and pairings</li>
                <li>Historical championship records dating back to 1903</li>
                <li>Six classification levels (6A, 5A, 4A, 3A, 2A, A)</li>
              </ul>
              <p className="text-xs font-semibold" style={{ color: 'var(--psp-navy)' }}>
                Confidence Level: Very High (Official governing body)
              </p>
            </div>
          </div>
        </section>

        {/* Coverage Timeline */}
        <section className="mb-12">
          <h2 className="psp-h2 mb-6" style={{ color: 'var(--psp-navy)' }}>
            Data Coverage Timeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Football */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--psp-gray-200)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--psp-navy)' }}>
                🏈 Football
              </h4>
              <div className="text-sm space-y-1" style={{ color: 'var(--psp-gray-700)' }}>
                <div>
                  <strong>1900–2022:</strong> Championships, standings, awards
                </div>
                <div>
                  <strong>1968–2022:</strong> Season leaders, school records
                </div>
                <div>
                  <strong>1981–2022:</strong> Individual stat leaders
                </div>
                <div>
                  <strong>2015–Present:</strong> Full box scores, team schedules, game results
                </div>
              </div>
            </div>

            {/* Basketball */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--psp-gray-200)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--psp-navy)' }}>
                🏀 Basketball
              </h4>
              <div className="text-sm space-y-1" style={{ color: 'var(--psp-gray-700)' }}>
                <div>
                  <strong>1903–2022:</strong> State championships
                </div>
                <div>
                  <strong>1960–2022:</strong> Scoring leaders, awards
                </div>
                <div>
                  <strong>2001–2022:</strong> Season-by-season statistics
                </div>
                <div>
                  <strong>2015–Present:</strong> Complete box scores, schedules, statistics
                </div>
              </div>
            </div>

            {/* Baseball */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--psp-gray-200)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--psp-navy)' }}>
                ⚾ Baseball
              </h4>
              <div className="text-sm space-y-1" style={{ color: 'var(--psp-gray-700)' }}>
                <div>
                  <strong>1903–2022:</strong> State championships
                </div>
                <div>
                  <strong>2001–2018:</strong> Team standings and league records
                </div>
                <div>
                  <strong>2005–2018:</strong> All-City awards and selections
                </div>
                <div>
                  <strong>2015–Present:</strong> Schedules and scores
                </div>
              </div>
            </div>

            {/* Minor Sports */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--psp-gray-200)' }}>
              <h4 className="font-bold mb-2" style={{ color: 'var(--psp-navy)' }}>
                ⚽ Track, Lacrosse, Soccer, Wrestling
              </h4>
              <div className="text-sm space-y-1" style={{ color: 'var(--psp-gray-700)' }}>
                <div>
                  <strong>1921–2022:</strong> State championships
                </div>
                <div>
                  <strong>2015–Present:</strong> Team rosters and schedules
                </div>
                <div>
                  <strong>Track/XC:</strong> Individual event winners and times
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Quality & Gaps */}
        <section className="mb-12">
          <h2 className="psp-h2 mb-6" style={{ color: 'var(--psp-navy)' }}>
            Data Quality & Known Gaps
          </h2>

          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--psp-gray-200)', background: 'rgba(0, 0, 0, 0.02)' }}>
            <h3 className="font-bold mb-3" style={{ color: 'var(--psp-navy)' }}>
              ✅ High-Quality Coverage (90%+)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm mb-6" style={{ color: 'var(--psp-gray-700)' }}>
              <li>Championships across all sports (1903–present)</li>
              <li>Recent statistics (2015–present from MaxPreps)</li>
              <li>Team rosters from Hudl (2015–2026)</li>
              <li>All-City and All-League awards</li>
              <li>School historical records</li>
            </ul>

            <h3 className="font-bold mb-3" style={{ color: 'var(--psp-navy)' }}>
              ⚠️ Known Data Gaps
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--psp-gray-700)' }}>
              <li>
                <strong>Basketball (1903–1960):</strong> Very limited individual player statistics available
              </li>
              <li>
                <strong>Baseball (2019–present):</strong> Box scores incomplete for all leagues
              </li>
              <li>
                <strong>Minor Sports:</strong> Individual player statistics limited to major championships
              </li>
              <li>
                <strong>2020–2021:</strong> COVID-19 reduced competitions (data reflects actual season schedules)
              </li>
              <li>
                <strong>Independent Schools:</strong> Some PAISAA schools have limited historical records
              </li>
            </ul>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-12">
          <h2 className="psp-h2 mb-6" style={{ color: 'var(--psp-navy)' }}>
            Our Methodology
          </h2>

          <div className="space-y-4 text-sm" style={{ color: 'var(--psp-gray-700)' }}>
            <p>
              <strong>Data Validation:</strong> All imported data is cross-referenced against multiple sources. Conflicts are resolved by prioritizing official records (PIAA &gt; Hudl &gt; MaxPreps &gt; Archive).
            </p>
            <p>
              <strong>Duplicate Detection:</strong> Players with identical names are disambiguated using school, graduation year, and statistical signatures.
            </p>
            <p>
              <strong>Soft Deletes:</strong> Historical records are never permanently deleted. Errors are corrected by marking records as &quot;deleted&quot; while preserving audit trails.
            </p>
            <p>
              <strong>Deduplication:</strong> Archive data imports are carefully deduplicated to avoid counting the same game or player twice when data overlaps between sources.
            </p>
            <p>
              <strong>Enrichment:</strong> Data is enhanced with pro player information, college placements, and biographical details from multiple sources.
            </p>
          </div>
        </section>

        {/* Last Updated */}
        <section className="mb-12 p-6 rounded-lg border" style={{ borderColor: 'var(--psp-gold)', background: 'rgba(240, 165, 0, 0.04)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📅</span>
            <h3 className="font-bold" style={{ color: 'var(--psp-navy)' }}>
              Data Last Updated
            </h3>
          </div>
          <p style={{ color: 'var(--psp-gray-700)' }}>
            <strong>March 10, 2026</strong>
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--psp-gray-600)' }}>
            Most recent data imports: MaxPreps game schedules, Hudl rosters, PIAA championship results
          </p>
        </section>

        {/* Report Issues */}
        <section className="p-6 rounded-lg border" style={{ borderColor: 'var(--psp-blue)', background: 'rgba(59, 130, 246, 0.04)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--psp-navy)' }}>
            Found a Data Error?
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--psp-gray-700)' }}>
            If you spot an inaccuracy or have missing information, please let us know. You can submit a correction through any player or school profile page.
          </p>
          <Link
            href="/search"
            className="inline-block px-4 py-2 rounded font-semibold text-sm transition-colors"
            style={{ background: 'var(--psp-blue)', color: 'white' }}
          >
            Find a Player or School
          </Link>
        </section>
      </div>
    </main>
  );
}
