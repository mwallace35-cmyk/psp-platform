import { Suspense } from "react";
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
    <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="psp-h1 mb-2" style={{ color: "var(--psp-navy)" }}>
          Compare Players
        </h1>
        <p className="text-gray-400 mb-8">
          Search for two players to compare their career statistics side-by-side.
        </p>
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard showImage={true} showTitle={true} showDescription={true} />
            <SkeletonCard showImage={true} showTitle={true} showDescription={true} />
          </div>
        }>
          <PlayerCompare />
        </Suspense>
    </div>
  );
}
