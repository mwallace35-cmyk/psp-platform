import { Suspense } from "react";
import PlayerCompare from "@/components/compare/PlayerCompare";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string>> }): Promise<Metadata> {
  const params = await searchParams;
  const p1 = params.p1;
  const p2 = params.p2;

  if (p1 && p2) {
    // Fetch player names for dynamic title
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://phillysportspack.com"}/api/player/${p1}`, { next: { revalidate: 3600 } }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://phillysportspack.com"}/api/player/${p2}`, { next: { revalidate: 3600 } }),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      const n1 = d1?.data?.player?.name || d1?.player?.name || "Player 1";
      const n2 = d2?.data?.player?.name || d2?.player?.name || "Player 2";
      return {
        title: `${n1} vs ${n2} — PhillySportsPack Compare`,
        description: `Compare ${n1} and ${n2} side-by-side. Career stats, achievements, and head-to-head analysis on PhillySportsPack.`,
        openGraph: {
          title: `${n1} vs ${n2} — PhillySportsPack Compare`,
          description: `Compare ${n1} and ${n2} side-by-side.`,
          url: `https://phillysportspack.com/compare?p1=${p1}&p2=${p2}`,
        },
        twitter: {
          card: "summary_large_image",
          title: `${n1} vs ${n2} — PhillySportsPack Compare`,
          description: `Compare ${n1} and ${n2} side-by-side.`,
        },
      };
    } catch {
      // fall through to default
    }
  }

  return {
    title: "Compare Players — PhillySportsPack",
    description: "Compare Philadelphia high school athletes side-by-side. View career stats, awards, and achievements across sports.",
    alternates: {
      canonical: "https://phillysportspack.com/compare",
    },
  };
}

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="psp-h1 mb-2" style={{ color: "var(--psp-navy)" }}>
          Compare Players
        </h1>
        <p className="text-gray-600 mb-8">
          Search for two players to compare their career statistics side-by-side.
        </p>
        <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
          Select Two Players
        </h2>
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
