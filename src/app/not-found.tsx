import Link from 'next/link';
import { Button } from '@/components/ui';
import { VALID_SPORTS, SPORT_META } from '@/lib/sports';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-navy to-navy-mid flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="text-9xl font-bebas text-gold mb-4">404</div>

        {/* Message */}
        <h1 className="text-4xl font-bebas text-white mb-4">Page Not Found</h1>
        <p className="text-gold text-lg mb-8">
          Sorry, we can't find the page you're looking for.
        </p>

        {/* Search Box */}
        <div className="mb-12">
          <label htmlFor="not-found-search" className="text-white mb-4 text-sm block">Try searching for what you're looking for:</label>
          <form action="/search" method="get" className="flex gap-2 max-w-md mx-auto">
            <input
              id="not-found-search"
              type="text"
              name="q"
              placeholder="Search players, schools, stats..."
              className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gold text-navy font-medium rounded-md hover:bg-gold/90 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <p className="text-white mb-6 text-sm font-medium">Or explore by sport:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 justify-center">
            {VALID_SPORTS.map((sport) => (
              <Link
                key={sport}
                href={`/${sport}`}
                className="px-4 py-2 bg-white/10 hover:bg-gold hover:text-navy text-white rounded-md transition font-medium text-sm"
              >
                {SPORT_META[sport].emoji} {SPORT_META[sport].name}
              </Link>
            ))}
          </div>
        </div>

        {/* Home Button */}
        <Link href="/">
          <Button variant="primary" className="inline-block">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
