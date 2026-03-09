import Link from 'next/link';

interface DataExplorerTile {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const explorerTiles: DataExplorerTile[] = [
  {
    icon: '🔍',
    title: 'Search Database',
    description: 'Find schools, players, and coaches across all sports',
    href: '/search',
  },
  {
    icon: '⚖️',
    title: 'Compare Stats',
    description: 'Head-to-head comparison for up to 4 players',
    href: '/compare',
  },
  {
    icon: '📊',
    title: 'Leaderboards',
    description: 'All-time and seasonal stat leaders by category',
    href: '/football/leaderboards/rushing',
  },
  {
    icon: '🏆',
    title: 'Championships',
    description: 'Historical titles and dynasty tracking since 1887',
    href: '/football/championships',
  },
  {
    icon: '🏅',
    title: 'All-City Teams',
    description: 'Complete archive of All-City award winners',
    href: '/football/all-city',
  },
  {
    icon: '📖',
    title: 'Stats Glossary',
    description: 'Learn the stats and terminology used in PSP',
    href: '/glossary',
  },
];

export default function DataExplorerSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[var(--psp-gray-50)] [data-theme=dark]:bg-[var(--psp-navy)]/40">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white font-bebas tracking-wide mb-3 sm:mb-4">
            Explore the Data
          </h2>
          <p className="text-base sm:text-lg text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)] max-w-2xl">
            Access comprehensive datasets with powerful search, comparison, and analysis tools
          </p>
        </div>

        {/* Tiles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {explorerTiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group relative p-6 sm:p-8 bg-white [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-lg hover:border-[var(--psp-gold)] [data-theme=dark]:hover:border-[var(--psp-gold)]/60 transition-all"
            >
              {/* Gold accent top border on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--psp-gold)] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />

              {/* Icon */}
              <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                {tile.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white mb-2 group-hover:text-[var(--psp-gold)] [data-theme=dark]:group-hover:text-[var(--psp-gold)] transition-colors">
                {tile.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)] mb-4">
                {tile.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--psp-blue)] [data-theme=dark]:text-[var(--psp-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Info callout */}
        <div className="mt-10 sm:mt-12 lg:mt-16 p-6 sm:p-8 bg-blue-50 [data-theme=dark]:bg-[var(--psp-blue)]/10 rounded-lg border border-blue-200 [data-theme=dark]:border-[var(--psp-blue)]/30">
          <div className="flex gap-4">
            <div className="text-2xl flex-shrink-0">💡</div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 [data-theme=dark]:text-[var(--psp-blue)] mb-2">
                Pro Tip: Advanced Search Features
              </h3>
              <p className="text-sm sm:text-base text-blue-800 [data-theme=dark]:text-blue-200">
                Use filters, sort by multiple columns, and export data to CSV. Our search supports fuzzy matching—find what you're looking for even with typos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
