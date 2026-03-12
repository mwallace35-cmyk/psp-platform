"use client";

import React, { useEffect, useState } from "react";
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
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        const data = await getSimilarPlayers(playerId, sportId, 5);
        setSimilar(data);
      } catch (err) {
        console.error("Error fetching similar players:", err);
        setError("Could not load similar players");
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [playerId, sportId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-navy mb-4 uppercase tracking-wide">
          Similar Players
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || similar.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-navy mb-4 uppercase tracking-wide">
          Similar Players
        </h3>
        <p className="text-sm text-gray-600">
          {error || "No similar players found"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-navy mb-4 uppercase tracking-wide">
        Similar Players
      </h3>
      <div className="space-y-3">
        {similar.map((player, idx) => (
          <Link
            key={player.id}
            href={`/${sportId}/players/${player.slug}`}
            className={`block p-3 rounded border transition-all hover:shadow-md ${
              idx === 0
                ? "border-gold bg-amber-50 hover:bg-amber-100"
                : "border-gray-200 hover:border-gold"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    idx === 0 ? "text-amber-900" : "text-navy"
                  }`}
                >
                  {player.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {player.school_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-psp-blue">
                  {player.similarity_score}%
                </p>
                {player.primary_stat_value && (
                  <p className="text-xs text-gray-600">
                    {player.primary_stat_value.toLocaleString()} pts
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
        🏆 Similarity based on position, stats, and era
      </p>
    </div>
  );
}
