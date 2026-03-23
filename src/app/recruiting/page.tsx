import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getRecruitingBoard,
  getRecruitingClassYears,
  getRecruitingSummary,
} from "@/lib/data/recruiting";
import RecruitBoard from "@/components/recruiting/RecruitBoard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Link from "next/link";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Recruiting Central - PhillySportsPack",
  description:
    "Track Philly's top high school recruits. Ratings from 247Sports, Rivals, and On3. Offers, commitments, and the full recruiting journey.",
  alternates: {
    canonical: "https://phillysportspack.com/recruiting",
  },
};

async function RecruitingContent() {
  const [recruits, classYears, summary] = await Promise.all([
    getRecruitingBoard(),
    getRecruitingClassYears(),
    getRecruitingSummary(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div
        className="rounded-2xl px-8 py-10 mb-8"
        style={{ backgroundColor: "var(--psp-navy)" }}
      >
        <nav className="text-sm mb-4">
          <Link href="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
          <span className="text-gray-500 mx-2">&rsaquo;</span>
          <span className="text-gray-300">Recruiting Central</span>
        </nav>
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          Philly Recruiting Central
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Track Philadelphia's top high school recruits. Ratings from 247Sports,
          Rivals, and On3 side by side. Offers, commitments, and the full
          recruiting journey.
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: "#f0a500", fontFamily: "Bebas Neue, sans-serif" }}
            >
              {summary.total}
            </div>
            <div className="text-gray-400 text-sm">Tracked Recruits</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: "#f0a500", fontFamily: "Bebas Neue, sans-serif" }}
            >
              {summary.committed}
            </div>
            <div className="text-gray-400 text-sm">Committed</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: "#f0a500", fontFamily: "Bebas Neue, sans-serif" }}
            >
              {summary.fiveStars + summary.fourStars}
            </div>
            <div className="text-gray-400 text-sm">4-5 Star Recruits</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: "#f0a500", fontFamily: "Bebas Neue, sans-serif" }}
            >
              {summary.totalOffers}
            </div>
            <div className="text-gray-400 text-sm">Total Offers</div>
          </div>
        </div>
      </div>

      {/* Board */}
      <RecruitBoard recruits={recruits} classYears={classYears} />
    </div>
  );
}

export default function RecruitingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SkeletonCard showImage={false} showTitle={true} />
          <div className="mt-8 space-y-4">
            <SkeletonCard showImage={false} />
            <SkeletonCard showImage={false} />
            <SkeletonCard showImage={false} />
          </div>
        </div>
      }
    >
      <RecruitingContent />
    </Suspense>
  );
}
