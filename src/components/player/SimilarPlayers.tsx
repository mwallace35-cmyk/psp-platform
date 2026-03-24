"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getSimilarPlayers, type SimilarPlayer } from "@/lib/data/similar-players";

interface SimilarPlayersProps {
  playerId: number;
  sportId: string;
  currentPlayerSlug: string;
}

export default function SimilarPlayers({
  playerId,
  sportId,
  currentPlayerSlug,
}: SimilarPlayersProps) {
  const [similar, setSimilar] = useState<SimilarPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const fetchSimilar = async () => {
      try {
        setLoading(true);
        const data = await getSimilarPlayers(playerId, sportId, 5);
        setSimilar(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching similar players:", err);
          setError("Could not load similar players");
        }
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    fetchSimilar();
    return () => controller.abort();
  }, [playerId, sportId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6" role="status" aria-busy="true" aria-label="Loading similar players">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
          Similar Players
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || similar.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
          Similar Players
        </h3>
        <p className="text-sm text-gray-400">
          {error || "No similar players found"}
        </p>
        <Link
          href={`/${sportId}/compare?players=${currentPlayerSlug}&sport=${sportId}`}
          className="text-xs font-medium mt-3 inline-block hover:underline"
          style={{ color: "var(--psp-blue)" }}
        >
          Find similar players manually →
        </Link>
      </div>
    );
  }

  const getStatLabel = (score: number, index: number): string => {
    if (index === 0) return "Best Match";
    if (score >= 85) return "Highly Similar";
    if (score >= 75) return "Very Similar";
    return "Similar";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
        Similar Players
      </h3>
      <div className="space-y-3">
        {similar.map((player, idx) => {
          const isTopMatch = idx === 0;
          const statLabel = getStatLabel(player.similarity_score, idx);
          const bgClass = isTopMatch ? "bg-amber-50 border-gold" : "border-gray-200 hover:border-gold";
          const nameClass = isTopMatch ? "text-amber-900" : "text-navy";

          return (
            <Link
              key={player.id}
              href={`/${sportId}/players/${player.slug}`}
              className={`block p-3 rounded-lg border transition-all hover:shadow-md ${bgClass}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p
                      className={`text-sm font-semibold truncate ${nameClass}`}
                    >
                      {player.name}
                    </p>
                    {isTopMatch && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
                        role="img"
                        aria-label="Top match"
                      >
                        ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {player.school_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{statLabel}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="psp-h3"
                    style={{ color: "var(--psp-gold)" }}
                  >
                    {player.similarity_score}%
                  </div>
                  {player.primary_stat_value && (
                    <p className="text-xs text-gray-400 mt-1">
                      {player.primary_stat_value.toLocaleString()}
                      <br />
                      {sportId === "basketball" ? "pts" : "yds"}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-200">
        <span aria-hidden="true">🏆</span> Similarity based on position, stats, and graduation era
      </p>
    </div>
  );
}
