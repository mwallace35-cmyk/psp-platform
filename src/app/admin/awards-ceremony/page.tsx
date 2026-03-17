"use client";

import { useEffect, useState } from "react";
import {
  getActiveAwards,
  getAwardVoteCounts,
  type AnnualAward,
} from "@/lib/data";

export default function AwardsCeremonyPage() {
  const [awards, setAwards] = useState<AnnualAward[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<number, Record<number, number>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAwards = async () => {
      try {
        // Get all awards (not just active ones) for admin view
        const awardData = await getActiveAwards();
        setAwards(awardData);

        // Load vote counts
        const countsMap: Record<number, Record<number, number>> = {};
        for (const award of awardData) {
          if (award.voting_open) {
            const counts = await getAwardVoteCounts(award.id);
            countsMap[award.id] = counts;
          }
        }
        setVoteCounts(countsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load awards");
      } finally {
        setLoading(false);
      }
    };

    loadAwards();
  }, []);

  if (loading) {
    return (
      <div
        className="p-8 rounded-lg text-center"
        style={{ background: "var(--psp-navy-mid)" }}
      >
        <p className="text-gray-400">Loading awards...</p>
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
        <h1 className="text-3xl font-bold">Annual Awards Ceremony</h1>
        <p className="text-gray-400 mt-2">
          Manage annual awards, nominees, voting, and results
        </p>
      </div>

      {awards.length === 0 ? (
        <div
          className="p-8 rounded-lg text-center"
          style={{ background: "var(--psp-navy-mid)" }}
        >
          <p className="text-gray-400">No awards created yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {awards.map((award) => {
            const counts = voteCounts[award.id] || {};
            const totalVotes = Object.values(counts).reduce(
              (sum, val) => sum + val,
              0
            );

            return (
              <div
                key={award.id}
                className="p-6 rounded-lg border"
                style={{
                  background: "var(--psp-navy-mid)",
                  borderColor: "var(--psp-navy)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {award.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 capitalize">
                      {award.category}
                      {award.sport_id && ` • ${award.sport_id}`}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          background: award.voting_open
                            ? "#3b82f620"
                            : "#6b7280",
                          color: award.voting_open ? "#3b82f6" : "#9ca3af",
                        }}
                      >
                        {award.voting_open
                          ? "Voting Open"
                          : "Voting Closed"}
                      </span>
                    </div>
                  </div>
                </div>

                {award.nominees && award.nominees.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300">
                      Nominees & Votes ({totalVotes})
                    </h4>
                    {award.nominees.map((nominee, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded bg-black/20"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {nominee.player_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {nominee.school_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">
                            {counts[idx] || 0}
                          </p>
                          <p className="text-xs text-gray-400">votes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {award.winner_player_id && (
                  <div
                    className="mt-4 p-3 rounded border-l-4"
                    style={{ borderColor: "var(--psp-gold)" }}
                  >
                    <p className="text-xs text-gray-400">Winner</p>
                    <p className="text-white font-semibold mt-1">
                      Winner Announced
                    </p>
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
