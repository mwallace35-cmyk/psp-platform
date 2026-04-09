import Link from "next/link";

export default function LegacyNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-['Bebas_Neue'] text-[var(--psp-navy)] mb-2">404</div>
        <h1 className="text-2xl font-bold text-[var(--psp-navy)] mb-3">Career Arc Not Found</h1>
        <p className="text-gray-500 mb-6">
          This career arc page doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/hof/legends"
            className="px-4 py-2 bg-[var(--psp-navy)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--psp-navy-mid)] transition-colors"
          >
            HOF Legends
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
