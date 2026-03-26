"use client";

import { useState, useEffect, useCallback } from "react";

interface DidYouKnowFact {
  id: number;
  fact_text: string;
  sport: string | null;
  category: string | null;
  school_id: number | null;
  player_id: number | null;
}

interface DidYouKnowProps {
  sport?: string;
  schoolId?: number;
}

const SPORT_LABELS: Record<string, string> = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  soccer: "Soccer",
  lacrosse: "Lacrosse",
  "track-field": "Track & Field",
  wrestling: "Wrestling",
};

export default function DidYouKnow({ sport, schoolId }: DidYouKnowProps) {
  const [fact, setFact] = useState<DidYouKnowFact | null>(null);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);

  const fetchFact = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (sport) params.set("sport", sport);
      if (schoolId) params.set("school_id", String(schoolId));
      // Cache-bust for shuffle
      params.set("_t", String(Date.now()));

      const res = await fetch(`/api/did-you-know?${params.toString()}`);
      if (!res.ok) return;
      const data: DidYouKnowFact = await res.json();
      if (data.fact_text) {
        setFact(data);
      }
    } catch {
      // Silently fail — widget is non-critical
    }
  }, [sport, schoolId]);

  useEffect(() => {
    setLoading(true);
    fetchFact().finally(() => setLoading(false));
  }, [fetchFact]);

  const handleShuffle = async () => {
    setShuffling(true);
    await fetchFact();
    setShuffling(false);
  };

  if (loading) {
    return (
      <div className="bg-[var(--psp-navy-mid)] border-l-4 border-[var(--psp-gold)] rounded-lg p-5 animate-pulse">
        <div className="h-5 w-32 bg-gray-700 rounded mb-3" />
        <div className="h-4 w-full bg-gray-700 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gray-700 rounded" />
      </div>
    );
  }

  if (!fact) return null;

  const sportLabel = fact.sport ? SPORT_LABELS[fact.sport] || fact.sport : null;

  return (
    <div className="bg-[var(--psp-navy-mid)] border-l-4 border-[var(--psp-gold)] rounded-lg p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <h3
            className="text-[var(--psp-gold)] font-bold tracking-wide"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "1.2rem",
              letterSpacing: "0.06em",
            }}
          >
            DID YOU KNOW?
          </h3>
          {sportLabel && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--psp-gold)]/15 text-[var(--psp-gold)] px-2 py-0.5 rounded-full">
              {sportLabel}
            </span>
          )}
        </div>
        <button
          onClick={handleShuffle}
          disabled={shuffling}
          aria-label="Shuffle fact"
          className="text-gray-400 hover:text-[var(--psp-gold)] transition-colors disabled:opacity-50 p-1"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={shuffling ? "animate-spin" : ""}
          >
            <path d="M21.5 2v6h-6" />
            <path d="M2.5 22v-6h6" />
            <path d="M2.5 11.5a10 10 0 0 1 18.4-4.5" />
            <path d="M21.5 12.5a10 10 0 0 1-18.4 4.5" />
          </svg>
        </button>
      </div>

      {/* Fact text */}
      <p
        className="text-gray-200 text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {fact.fact_text}
      </p>
    </div>
  );
}
