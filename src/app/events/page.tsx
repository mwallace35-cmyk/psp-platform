import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import EventHero from "@/components/events/EventHero";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import EventFilters from "@/components/events/EventFilters";
import EventCard from "@/components/events/EventCard";
import { getCommunityEvents, getFeaturedEvents } from "@/lib/data/community-events";

export const revalidate = 1800;

const BASE_URL = "https://phillysportspack.com";

interface SearchParams {
  type?: string;
  sport?: string;
  when?: string;
  page?: string;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const pageLabel = currentPage > 1 ? ` - Page ${currentPage}` : "";

  return {
    title: `Community Events${pageLabel}`,
    description: "Find camps, clinics, showcases, award ceremonies, tournaments, and more across Philadelphia high school sports.",
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: `${BASE_URL}/events` },
    openGraph: {
      title: `Community Events${pageLabel} | PhillySportsPack.com`,
      description: "Find camps, clinics, showcases, award ceremonies, tournaments, and more across Philadelphia high school sports.",
      url: `${BASE_URL}/events`,
      siteName: "PhillySportsPack.com",
      images: [{ url: `${BASE_URL}/og-default.png`, width: 1200, height: 630, alt: "PhillySportsPack.com" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Community Events${pageLabel} | PhillySportsPack.com`,
      description: "Find camps, clinics, showcases, and more across Philadelphia high school sports.",
      images: [`${BASE_URL}/og-default.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const currentType = params.type || "all";
  const currentSport = params.sport || "all";
  const currentWhen = params.when || "upcoming";

  const [featuredResult, eventsResult] = await Promise.all([
    getFeaturedEvents(),
    getCommunityEvents({
      type: currentType,
      sport: currentSport,
      when: currentWhen,
      page: currentPage,
    }),
  ]);

  const featured = featuredResult ?? [];
  const { events, total, totalPages } = eventsResult ?? { events: [], total: 0, totalPages: 0 };

  function buildUrl(page: number) {
    const p = new URLSearchParams();
    if (page > 1) p.set("page", page.toString());
    if (currentType !== "all") p.set("type", currentType);
    if (currentSport !== "all") p.set("sport", currentSport);
    if (currentWhen !== "upcoming") p.set("when", currentWhen);
    const qs = p.toString();
    return `/events${qs ? `?${qs}` : ""}`;
  }

  return (
    <main id="main-content" className="min-h-screen" style={{ background: "var(--psp-gray-50, #f8fafc)" }}>
      <EventHero />

      {/* Featured events - only show on first page with no filters */}
      {currentPage === 1 && currentType === "all" && currentSport === "all" && currentWhen === "upcoming" && (
        <FeaturedEvents events={featured} />
      )}

      <Suspense fallback={null}>
        <EventFilters />
      </Suspense>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-4 mt-1">
        <p className="text-sm text-gray-400 pb-4 border-b border-gray-200">
          {total} event{total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Event grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">&#x1F4C5;</div>
            <p className="text-gray-400 text-lg mb-2">No events found</p>
            <p className="text-gray-500 text-sm mb-4">Try broadening your filters or check back soon.</p>
            {(currentType !== "all" || currentSport !== "all" || currentWhen !== "upcoming") && (
              <Link href="/events" className="text-sm font-medium hover:opacity-80" style={{ color: "var(--psp-gold-text)" }}>
                View all upcoming events &rarr;
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={buildUrl(currentPage - 1)}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition"
                  >
                    &larr; Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-sm text-gray-400">
                        ...
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={buildUrl(p as number)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition ${
                          p === currentPage
                            ? "bg-[var(--psp-gold)] text-[var(--psp-navy)] font-bold"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                {currentPage < totalPages && (
                  <Link
                    href={buildUrl(currentPage + 1)}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
