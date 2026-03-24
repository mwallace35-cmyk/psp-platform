"use client";

import { useEffect, useState } from "react";
import { getTrendingStats, type TrendingStat } from "@/lib/data/trending";

/**
 * Rotating trending stats strip for homepage
 * Shows interesting database facts and notable records
 */
export default function TrendingStrip() {
  const [stats, setStats] = useState<TrendingStat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch trending stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const trendingStats = await getTrendingStats();
        setStats(trendingStats);
      } catch (error) {
        console.error("Failed to fetch trending stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Auto-rotate through stats every 6 seconds
  useEffect(() => {
    if (stats.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [stats.length]);

  if (loading || stats.length === 0) {
    return null;
  }

  const currentStat = stats[currentIndex];

  return (
    <section
      className="py-6"
      style={{
        background: "linear-gradient(90deg, rgba(10, 22, 40, 0.95) 0%, rgba(59, 130, 246, 0.1) 100%)",
        borderBottom: "2px solid var(--psp-gold)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 justify-between overflow-hidden">
          {/* Trending Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl" aria-hidden="true">🔥</span>
            <span
              className="font-bold text-sm whitespace-nowrap"
              style={{ color: "var(--psp-gold)" }}
            >
              TRENDING NOW
            </span>
          </div>

          {/* Current Stat with animation */}
          <div className="flex-1 flex items-center gap-4">
            <div className="text-3xl flex-shrink-0">{currentStat.emoji}</div>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--psp-gold)" }}
              >
                {currentStat.title}
              </p>
              <p className="text-white font-bebas text-lg md:text-2xl truncate">
                {currentStat.value}
              </p>
              <p className="text-gray-300 text-xs mt-1 truncate">
                {currentStat.description}
              </p>
            </div>
          </div>

          {/* Pagination Dots */}
          {stats.length > 1 && (
            <div className="flex gap-2 flex-shrink-0">
              {stats.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background:
                      idx === currentIndex ? "var(--psp-gold)" : "rgba(240, 165, 0, 0.4)",
                  }}
                  aria-label={`Go to stat ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
