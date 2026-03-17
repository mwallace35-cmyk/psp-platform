"use client";

import { useEffect, useState } from "react";
import {
  getAllSponsors,
  getSponsorStats,
  type Sponsor,
  type SponsorStats,
} from "@/lib/data";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [stats, setStats] = useState<Record<number, SponsorStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const sponsorData = await getAllSponsors();
        setSponsors(sponsorData);

        // Load stats for each sponsor
        const statsMap: Record<number, SponsorStats> = {};
        for (const sponsor of sponsorData) {
          const sponsorStats = await getSponsorStats(sponsor.id);
          statsMap[sponsor.id] = sponsorStats;
        }
        setStats(statsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sponsors");
      } finally {
        setLoading(false);
      }
    };

    loadSponsors();
  }, []);

  if (loading) {
    return (
      <div
        className="p-8 rounded-lg text-center"
        style={{ background: "var(--psp-navy-mid)" }}
      >
        <p className="text-gray-400">Loading sponsors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-8 rounded-lg text-center border border-red-500/30 bg-red-500/10"
      >
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sponsors</h1>
        <p className="text-gray-400 mt-2">
          Manage sponsors and track impressions & clicks
        </p>
      </div>

      {sponsors.length === 0 ? (
        <div
          className="p-8 rounded-lg text-center"
          style={{ background: "var(--psp-navy-mid)" }}
        >
          <p className="text-gray-400">No sponsors yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sponsors.map((sponsor) => {
            const sponsorStats = stats[sponsor.id];
            return (
              <div
                key={sponsor.id}
                className="p-6 rounded-lg border"
                style={{
                  background: "var(--psp-navy-mid)",
                  borderColor: "var(--psp-navy)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {sponsor.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {sponsor.contact_email} • {sponsor.contact_phone}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span
                        className="text-xs px-2 py-1 rounded capitalize"
                        style={{
                          background:
                            sponsor.tier === "platinum"
                              ? "#ffd700"
                              : sponsor.tier === "premium"
                                ? "#c0c0c0"
                                : "#cd7f32",
                          color: "var(--psp-navy)",
                        }}
                      >
                        {sponsor.tier}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          background: sponsor.is_active
                            ? "#10b98120"
                            : "#ef444420",
                          color: sponsor.is_active ? "#10b981" : "#ef4444",
                        }}
                      >
                        {sponsor.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {sponsorStats && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded bg-black/20">
                      <p className="text-xs text-gray-400">Impressions</p>
                      <p className="text-xl font-bold text-white mt-1">
                        {sponsorStats.total_impressions}
                      </p>
                    </div>
                    <div className="p-3 rounded bg-black/20">
                      <p className="text-xs text-gray-400">Clicks</p>
                      <p className="text-xl font-bold text-white mt-1">
                        {sponsorStats.total_clicks}
                      </p>
                    </div>
                    <div className="p-3 rounded bg-black/20">
                      <p className="text-xs text-gray-400">CTR</p>
                      <p className="text-xl font-bold text-white mt-1">
                        {sponsorStats.ctr.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
