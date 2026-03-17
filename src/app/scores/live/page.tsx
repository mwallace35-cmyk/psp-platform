"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import SportIcon from "@/components/ui/SportIcon";
import { GameDaySchedule } from "@/lib/data/live-scores";

interface LiveScoresState {
  games: GameDaySchedule[];
  loading: boolean;
  error: string | null;
}

export default function GameDayModePage() {
  const [sportFilter, setSportFilter] = useState("all");
  const [scoresState, setScoresState] = useState<LiveScoresState>({
    games: [],
    loading: true,
    error: null,
  });

  // Fetch live scores on mount and every 30 seconds
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const url = new URL("/api/v1/live/scores", window.location.origin);
        if (sportFilter !== "all") {
          url.searchParams.set("sport", sportFilter);
        }

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch scores");

        const games = await response.json();
        setScoresState({
          games: games || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        setScoresState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load scores",
        }));
      }
    };

    fetchScores();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, [sportFilter]);

  const gamesByStatus = {
    in_progress: scoresState.games.filter((g) => g.status === "in_progress"),
    final: scoresState.games.filter((g) => g.status === "final"),
    scheduled: scoresState.games.filter((g) => g.status === "scheduled"),
  };

  return (
    <main
      id="main-content"
      className="flex-1 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen"
    >
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "1.5rem 1rem",
          textAlign: "center",
          borderBottom: "3px solid var(--psp-gold)",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            fontFamily: "var(--font-bebas)",
            color: "var(--psp-gold)",
            margin: "0 0 0.5rem 0",
            letterSpacing: "0.05em",
          }}
        >
          GAME DAY
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#bbb",
            margin: "0 0 1.5rem 0",
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Sport Filter Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            justifyContent: "center",
            margin: "0 -1rem",
            padding: "0 1rem",
          }}
        >
          <button
            onClick={() => setSportFilter("all")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "2px solid",
              borderColor:
                sportFilter === "all" ? "var(--psp-gold)" : "#444",
              background:
                sportFilter === "all"
                  ? "rgba(240, 165, 0, 0.2)"
                  : "transparent",
              color:
                sportFilter === "all" ? "var(--psp-gold)" : "#aaa",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            All Sports
          </button>

          {VALID_SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: "2px solid",
                borderColor:
                  sportFilter === sport ? "var(--psp-gold)" : "#444",
                background:
                  sportFilter === sport
                    ? "rgba(240, 165, 0, 0.2)"
                    : "transparent",
                color:
                  sportFilter === sport ? "var(--psp-gold)" : "#aaa",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>{SPORT_META[sport]?.emoji}</span>
              <span>{SPORT_META[sport]?.name || sport}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
        }}
      >
        {scoresState.error && (
          <div
            style={{
              background: "#4a2626",
              border: "1px solid #8b4343",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              color: "#ffa0a0",
              fontSize: "0.9rem",
            }}
          >
            {scoresState.error}
          </div>
        )}

        {/* In Progress Games */}
        {gamesByStatus.in_progress.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.2rem",
                fontFamily: "var(--font-bebas)",
                color: "var(--psp-gold)",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--psp-gold)",
              }}
            >
              🔴 IN PROGRESS ({gamesByStatus.in_progress.length})
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {gamesByStatus.in_progress.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* Final Games */}
        {gamesByStatus.final.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.2rem",
                fontFamily: "var(--font-bebas)",
                color: "#bbb",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #444",
              }}
            >
              ✓ FINAL ({gamesByStatus.final.length})
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {gamesByStatus.final.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Games */}
        {gamesByStatus.scheduled.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "1.2rem",
                fontFamily: "var(--font-bebas)",
                color: "#888",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #333",
              }}
            >
              ⏱ UPCOMING ({gamesByStatus.scheduled.length})
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {gamesByStatus.scheduled.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {scoresState.games.length === 0 && !scoresState.loading && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 1rem",
              color: "#999",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              No games today
            </p>
            <Link
              href="/scores/schedule"
              style={{
                color: "var(--psp-gold)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View Upcoming Schedule →
            </Link>
          </div>
        )}

        {/* Loading State */}
        {scoresState.loading && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 1rem",
              color: "#999",
            }}
          >
            <p>Loading scores...</p>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "#666",
            textAlign: "center",
            marginTop: "2rem",
          }}
        >
          Auto-refreshing every 30 seconds
        </p>
      </div>
    </main>
  );
}

// ==================================================================
// GAME CARD COMPONENT
// ==================================================================

function GameCard({ game }: { game: GameDaySchedule }) {
  const homeWin =
    game.home_score !== null &&
    game.away_score !== null &&
    (game.home_score as number) > (game.away_score as number);
  const awayWin =
    game.away_score !== null &&
    game.home_score !== null &&
    (game.away_score as number) > (game.home_score as number);

  const statusColor =
    game.status === "in_progress"
      ? "var(--psp-gold)"
      : game.status === "final"
      ? "#888"
      : "#666";

  const statusLabel =
    game.status === "in_progress"
      ? game.live_score?.period || "In Progress"
      : game.status === "final"
      ? "Final"
      : "Scheduled";

  return (
    <Link
      href={`/${game.sport_id}/games/${game.id}`}
      style={{
        background:
          game.status === "in_progress"
            ? "linear-gradient(135deg, rgba(240, 165, 0, 0.15) 0%, rgba(240, 165, 0, 0.05) 100%)"
            : "linear-gradient(135deg, #1a1a1a 0%, #222 100%)",
        border:
          game.status === "in_progress"
            ? "2px solid var(--psp-gold)"
            : "1px solid #333",
        borderRadius: "12px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as any).style.borderColor =
          game.status === "in_progress"
            ? "var(--psp-gold)"
            : "#444";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as any).style.borderColor =
          game.status === "in_progress"
            ? "var(--psp-gold)"
            : "#333";
      }}
    >
      {/* Status Badge */}
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: statusColor,
        }}
      >
        {statusLabel}
      </div>

      {/* Score Display */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* Away Team */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              margin: "0 0 0.25rem 0",
              color: awayWin ? "var(--psp-gold)" : "#ccc",
              fontWeight: awayWin ? 700 : 500,
              fontSize: "0.95rem",
            }}
          >
            {game.away_school?.name || "TBD"}
          </p>
        </div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "1.8rem",
            fontFamily: "var(--font-bebas)",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              color: awayWin ? "var(--psp-gold)" : "#999",
            }}
          >
            {game.away_score ?? "-"}
          </span>
          <span style={{ color: "#555", fontSize: "1rem" }}>–</span>
          <span
            style={{
              color: homeWin ? "var(--psp-gold)" : "#999",
            }}
          >
            {game.home_score ?? "-"}
          </span>
        </div>

        {/* Home Team */}
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              margin: "0 0 0.25rem 0",
              color: homeWin ? "var(--psp-gold)" : "#ccc",
              fontWeight: homeWin ? 700 : 500,
              fontSize: "0.95rem",
            }}
          >
            {game.home_school?.name || "TBD"}
          </p>
        </div>
      </div>

      {/* Period-by-period scores (if expanded) */}
      {game.live_score && game.status === "in_progress" && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#999",
            borderTop: "1px solid #444",
            paddingTop: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          <p style={{ margin: "0.25rem 0" }}>
            Updated: {new Date(game.live_score.reported_at).toLocaleTimeString()}
          </p>
        </div>
      )}
    </Link>
  );
}
