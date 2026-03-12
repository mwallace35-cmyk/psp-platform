import React from "react";
import Link from "next/link";
import { getProPipeline, type ProPipelineSchool } from "@/lib/data/pro-players";

interface ProPipelineProps {
  limit?: number;
}

export default async function ProPipeline({ limit = 10 }: ProPipelineProps) {
  const schools = await getProPipeline(limit);

  if (schools.length === 0) {
    return (
      <div className="bg-navy-light rounded-lg border border-gold p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
          Pro Pipeline
        </h3>
        <p className="text-sm text-gray-300">
          No pro athlete data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-navy-light rounded-lg border border-gold p-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
        🏆 Pro Pipeline
      </h3>
      <div className="space-y-3">
        {schools.map((school, idx) => (
          <Link
            key={school.school_id}
            href={`/football/schools/${school.school_slug}`}
            className="block group"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">
                {idx + 1}. {school.school_name}
              </p>
              <span className="text-xs font-bold bg-gold text-navy px-2 py-1 rounded">
                {school.total_pro_athletes}
              </span>
            </div>
            <div className="flex gap-2 text-xs text-gray-300">
              {school.football_count > 0 && (
                <span>🏈 {school.football_count}</span>
              )}
              {school.basketball_count > 0 && (
                <span>🏀 {school.basketball_count}</span>
              )}
              {school.baseball_count > 0 && (
                <span>⚾ {school.baseball_count}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
