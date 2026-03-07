import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PlayerCompare from "@/components/compare/PlayerCompare";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Players — PhillySportsPack",
  description: "Compare Philadelphia high school athletes side-by-side. View career stats, awards, and achievements across sports.",
  alternates: {
    canonical: "https://phillysportspack.com/compare",
  },
};

export default function ComparePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" style={{ flex: 1 }}>
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--psp-navy)" }}>
          Compare Players
        </h1>
        <p className="text-gray-500 mb-8">
          Search for two players to compare their career statistics side-by-side.
        </p>
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonCard showImage={true} showTitle={true} showDescription={true} />
            <SkeletonCard showImage={true} showTitle={true} showDescription={true} />
          </div>
        }>
          <PlayerCompare />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
