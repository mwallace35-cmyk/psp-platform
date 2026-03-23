import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProPlayers, getProPipeline } from "@/lib/data/pro-players";
import ProPlayerCard from "@/components/pro-players/ProPlayerCard";
import ProPipeline from "@/components/pro-players/ProPipeline";
import PSPPromo from "@/components/ads/PSPPromo";

export const revalidate = 86400; // 24 hours
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Before They Were Famous — Pro Athletes from Philly High Schools — PhillySportsPack",
  description:
    "Discover where Philly's pro athletes started. Explore NFL, NBA, and MLB players from Philadelphia high schools including Hall of Famers like Kobe Bryant, Wilt Chamberlain, and Mike Piazza.",
  alternates: {
    canonical: "https://phillysportspack.com/pros",
  },
  openGraph: {
    title: "Before They Were Famous — PhillySportsPack",
    description:
      "Discover where Philly's pro athletes started. Explore NFL, NBA, and MLB players from Philadelphia high schools.",
    url: "https://phillysportspack.com/pros",
    type: "website",
    images: [
      {
        url: "https://phillysportspack.com/og-pros.png",
        width: 1200,
        height: 630,
        alt: "Before They Were Famous",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Before They Were Famous — PhillySportsPack",
    description:
      "Discover where Philly's pro athletes started. Explore NFL, NBA, and MLB players from Philadelphia high schools.",
  },
};

interface SearchParams {
  sport?: string;
}

export default async function ProsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { sport = "all" } = await searchParams;
  const validSports = ["all", "football", "basketball", "baseball"];

  if (!validSports.includes(sport)) {
    notFound();
  }

  const proPlayers = await getProPlayers(
    sport === "all" ? undefined : sport,
    500
  );

  if (proPlayers.length === 0) {
    return notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "https://phillysportspack.com" },
    { name: "Before They Were Famous", url: "https://phillysportspack.com/pros" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Before They Were Famous", href: "/pros" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy to-navy-mid py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbs} />

          <div className="mt-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Before They Were Famous
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Where Philly's pro athletes started. From Hall of Famers to active
              stars, explore the high school roots of 230+ professional athletes
              from NFL, NBA, MLB, and beyond.
            </p>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-navy-light rounded-lg p-4 border border-gold">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Pro Athletes
              </p>
              <p className="text-3xl font-bold text-gold">
                {proPlayers.length}+
              </p>
            </div>
            <div className="bg-navy-light rounded-lg p-4 border border-gold">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Pro Leagues
              </p>
              <p className="text-3xl font-bold text-gold">4+</p>
            </div>
            <div className="bg-navy-light rounded-lg p-4 border border-gold">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Hall of Famers
              </p>
              <p className="text-3xl font-bold text-gold">8+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sport Filter Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-14 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { slug: "all", label: "All Sports" },
              { slug: "football", label: "🏈 Football" },
              { slug: "basketball", label: "🏀 Basketball" },
              { slug: "baseball", label: "⚾ Baseball" },
            ].map(({ slug, label }) => (
              <a
                key={slug}
                href={`/pros${slug !== "all" ? `?sport=${slug}` : ""}`}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  sport === slug
                    ? "border-gold text-gold"
                    : "border-transparent text-gray-600 hover:text-gold"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Pro Player Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy">
                {sport === "all"
                  ? "All Pro Athletes"
                  : `${
                      sport === "football"
                        ? "🏈 Football"
                        : sport === "basketball"
                        ? "🏀 Basketball"
                        : "⚾ Baseball"
                    } Players`}
              </h2>
              <p className="text-sm text-gray-600">{proPlayers.length} results</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {proPlayers.map((player) => (
                <ProPlayerCard
                  key={player.id}
                  player={player}
                  sportId={sport === "all" ? "football" : sport}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Suspense
              fallback={
                <div className="bg-navy-light rounded-lg border border-gold p-6">
                  <div className="h-6 bg-gray-700 rounded mb-4 animate-pulse" />
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-700 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              }
            >
              <ProPipeline limit={10} />
            </Suspense>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wide mb-4">
                About This Feature
              </h3>
              <p className="text-sm text-gray-600">
                Philly has produced dozens of Hall of Famers and hundreds of
                professional athletes. Explore where they started.
              </p>
            </div>

            <PSPPromo size="billboard" />
          </div>
        </div>
      </div>
    </>
  );
}
