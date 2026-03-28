'use client';

import Link from 'next/link';

export default function SchoolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-navy to-navy-mid py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="psp-h1 text-white mb-4">School Directory</h1>
          <p className="text-gold text-lg">
            Browse all Philadelphia-area high schools
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">{'\u26A0\uFE0F'}</div>
        <h2 className="text-xl font-bold text-navy mb-3">
          Unable to load school directory
        </h2>
        <p className="text-gray-500 mb-6">
          The school directory could not be loaded right now. This is usually
          temporary &mdash; please try again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-mid transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
