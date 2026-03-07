import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui';
import { STAT_DEFINITIONS } from '@/lib/stats';

export const metadata: Metadata = {
  title: 'Stats Glossary — PhillySportsPack',
  description:
    'Complete reference guide for all statistical abbreviations and definitions used across PhillySportsPack football, basketball, baseball, and minor sports coverage.',
  openGraph: {
    title: 'Stats Glossary — PhillySportsPack',
    description:
      'Complete reference guide for all statistical abbreviations and definitions used across PhillySportsPack football, basketball, baseball, and minor sports coverage.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://phillysportspack.com/glossary',
  },
};

// Group stats by sport
const FOOTBALL_STATS = [
  'RUSH YDS',
  'CARRIES',
  'RUSH TD',
  'YPC',
  'PASS YDS',
  'COMP',
  'ATT',
  'TD',
  'INT',
  'QBR',
  'REC',
  'REC YDS',
  'REC TD',
  'YPR',
  'PTS',
];

const BASKETBALL_STATS = ['PPG', 'RPG', 'APG', 'GP', 'FG%', 'FT%', '3PT%', 'STL', 'BLK'];

const BASEBALL_STATS = ['AVG', 'HR', 'RBI', 'ERA', 'K', 'W', 'L', 'T', 'W-L', 'WIN%'];

const GENERAL_STATS = ['GS', 'SEASON'];

const SPORT_GROUPS = [
  { name: 'Football', color: 'var(--fb)', stats: FOOTBALL_STATS },
  { name: 'Basketball', color: 'var(--bb)', stats: BASKETBALL_STATS },
  { name: 'Baseball', color: 'var(--base)', stats: BASEBALL_STATS },
  { name: 'General', color: 'var(--psp-gray-400)', stats: GENERAL_STATS },
];

export default function GlossaryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Stats Glossary',
    description:
      'Complete reference guide for all statistical abbreviations and definitions used across PhillySportsPack',
    itemListElement: Object.entries(STAT_DEFINITIONS).map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'DefinedTerm',
        name: entry[0],
        description: entry[1],
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="wrapper">
        <div className="hero-container">
          <div className="hero-content">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Glossary' }]} className="mb-6" />

            {/* Page Title */}
            <h1 className="text-5xl font-black tracking-wide mb-2" style={{ fontFamily: 'Bebas Neue' }}>
              Stats Glossary
            </h1>
            <p className="text-gray-400 mb-8">
              Complete reference guide for statistical abbreviations and definitions used across PhillySportsPack.
            </p>

            {/* Sport Groups */}
            <div className="space-y-12">
              {SPORT_GROUPS.map((group) => (
                <section key={group.name}>
                  {/* Group Header */}
                  <div
                    className="flex items-center gap-3 mb-6 pb-3 border-b-2"
                    style={{
                      borderColor: group.color,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <h2
                      className="text-2xl font-black tracking-wide"
                      style={{
                        fontFamily: 'Bebas Neue',
                        color: group.color,
                      }}
                    >
                      {group.name}
                    </h2>
                  </div>

                  {/* Stats Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-300 w-32">
                            Abbreviation
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300">
                            Definition
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.stats.map((stat) => (
                          <tr
                            key={stat}
                            className="border-b border-gray-800 hover:bg-gray-900/30 transition"
                          >
                            <td className="py-3 px-4 font-mono font-semibold text-white">
                              {stat}
                            </td>
                            <td className="py-3 px-4 text-gray-300">{STAT_DEFINITIONS[stat]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                These abbreviations are used consistently across player profiles, leaderboards, and historical
                records on PhillySportsPack. Hover over any stat abbreviation on the site to see its definition.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="widget">
              <div className="widget-header">Quick Facts</div>
              <div className="widget-content space-y-3">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Sports Covered</div>
                  <div className="text-xl font-black mt-1">7</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Total Stats</div>
                  <div className="text-xl font-black mt-1">{Object.keys(STAT_DEFINITIONS).length}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Data Coverage</div>
                  <div className="text-xs text-gray-300 mt-1">
                    25 seasons, 76 schools, 28,000+ records
                  </div>
                </div>
              </div>
            </div>

            <div className="widget">
              <div className="widget-header">About</div>
              <div className="widget-content text-sm text-gray-400">
                PhillySportsPack tracks comprehensive statistics for Philadelphia high school sports. This glossary
                helps you understand all the abbreviations used throughout the site.
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
