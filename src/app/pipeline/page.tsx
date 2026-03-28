export const dynamic = "force-dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getCollegePipeline,
  getPipelineSummary,
  getTopPipelineSchools,
} from "@/lib/data/pipeline";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Link from "next/link";
import PipelineClient from "@/components/pipeline/PipelineClient";

export const metadata: Metadata = {
  title: "College Pipeline — PhillySportsPack",
  description:
    "Where Philly's high school athletes play in college. Interactive map and database of college placements.",
  alternates: {
    canonical: "https://phillysportspack.com/pipeline",
  },
};

async function PipelineContent() {
  const [collegePipeline, summary, topSchools] = await Promise.all([
    getCollegePipeline(),
    getPipelineSummary(),
    getTopPipelineSchools(10),
  ]);

  // Serialize college data for client component (strip players array to reduce payload)
  const collegesForClient = collegePipeline.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.count,
    sports: c.sports,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-8">
        <h1
          className="psp-h1 mb-2"
          style={{ color: "var(--psp-navy)" }}
        >
          College Pipeline
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Where Philly{"'"}s best athletes play next — An interactive look at our college placements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <PipelineClient colleges={collegesForClient} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Pipeline Schools */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3
              className="psp-h3 mb-4"
              style={{ color: "var(--psp-navy)" }}
            >
              Top College Producers
            </h3>
            <div className="space-y-3">
              {topSchools.map((school) => (
                <Link key={school.id} href={`/football/schools/${school.slug}`}>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-900">{school.name}</p>
                      <p className="text-xs text-gray-400">
                        {school.city}, {school.state}
                      </p>
                    </div>
                    <p
                      className="font-bold"
                      style={{ color: "var(--psp-gold)" }}
                    >
                      {school.count}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3
              className="font-bold mb-2"
              style={{ color: "var(--psp-navy)" }}
            >
              About This Data
            </h3>
            <p className="text-sm text-gray-700">
              This pipeline tracks Philly-area high school athletes who have
              committed to or are currently attending colleges nationwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollegePipelinePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SkeletonCard showImage={false} showTitle={true} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
            <div className="lg:col-span-3">
              <SkeletonCard showImage={false} />
            </div>
            <div>
              <SkeletonCard showImage={false} />
            </div>
          </div>
        </div>
      }
    >
      <PipelineContent />
    </Suspense>
  );
}
