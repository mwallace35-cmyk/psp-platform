"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PERIODS = [
  { value: "Q1", label: "Quarter 1" },
  { value: "Q2", label: "Quarter 2" },
  { value: "Q3", label: "Quarter 3" },
  { value: "Q4", label: "Quarter 4" },
  { value: "H1", label: "Half 1" },
  { value: "H2", label: "Half 2" },
  { value: "OT", label: "Overtime" },
  { value: "F", label: "Final" },
];

interface TodayGame {
  id: number;
  sport_id: string;
  game_date: string;
  home_school_id: number;
  away_school_id: number;
  home_school: { name: string; slug: string } | null;
  away_school: { name: string; slug: string } | null;
}

interface FormState {
  gameId: number | null;
  homeScore: string;
  awayScore: string;
  period: string;
  submitting: boolean;
  error: string | null;
}

export default function ScoreReporterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [todaysGames, setTodaysGames] = useState<TodayGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [formState, setFormState] = useState<FormState>({
    gameId: null,
    homeScore: "",
    awayScore: "",
    period: "F",
    submitting: false,
    error: null,
  });
  const [success, setSuccess] = useState(false);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/scores/report");
      } else {
        setUser(user);
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, [router, supabase.auth]);

  // Load today's games
  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await fetch("/api/v1/live/games-today");
        if (!response.ok) throw new Error("Failed to load games");
        const games = await response.json();
        setTodaysGames(games);
      } catch (err) {
        console.error("Error loading games:", err);
      } finally {
        setGamesLoading(false);
      }
    };

    loadGames();
  }, []);

  const selectedGame = todaysGames.find((g) => g.id === formState.gameId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.gameId) {
      setFormState((prev) => ({ ...prev, error: "Please select a game" }));
      return;
    }

    if (!formState.homeScore || !formState.awayScore) {
      setFormState((prev) => ({
        ...prev,
        error: "Please enter both scores",
      }));
      return;
    }

    const homeScore = parseInt(formState.homeScore, 10);
    const awayScore = parseInt(formState.awayScore, 10);

    if (homeScore < 0 || awayScore < 0 || homeScore > 200 || awayScore > 200) {
      setFormState((prev) => ({
        ...prev,
        error: "Scores must be between 0 and 200",
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      submitting: true,
      error: null,
    }));

    try {
      const response = await fetch("/api/scores/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: formState.gameId,
          home_score: homeScore,
          away_score: awayScore,
          period: formState.period,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to report score");
      }

      setSuccess(true);
      setFormState({
        gameId: null,
        homeScore: "",
        awayScore: "",
        period: "F",
        submitting: false,
        error: null,
      });

      // Redirect to live scores after 2 seconds
      setTimeout(() => {
        router.push("/scores/live");
      }, 2000);
    } catch (err) {
      setFormState((prev) => ({
        ...prev,
        submitting: false,
        error: err instanceof Error ? err.message : "Failed to report score",
      }));
    }
  };

  if (authLoading) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center min-h-screen">
        <p style={{ color: "#999" }}>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <main id="main-content" className="flex-1 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen">
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "2rem 1rem",
          textAlign: "center",
          borderBottom: "3px solid var(--psp-gold)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "var(--font-bebas)",
            color: "var(--psp-gold)",
            margin: "0 0 0.5rem 0",
          }}
        >
          REPORT SCORE
        </h1>
        <p style={{ color: "#bbb", margin: 0 }}>
          Submit live game scores from the field
        </p>
      </div>

      {/* Form */}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        {success && (
          <div
            style={{
              background: "#1a4d2e",
              border: "1px solid #4a9d6f",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              color: "#a0ffb0",
              textAlign: "center",
            }}
          >
            ✓ Score reported! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Game Selection */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#ccc",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Step 1: Select Game
            </label>

            {gamesLoading ? (
              <p style={{ color: "#999" }}>Loading today's games...</p>
            ) : todaysGames.length === 0 ? (
              <p style={{ color: "#999" }}>No games scheduled for today</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "0.5rem",
                }}
              >
                {todaysGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        gameId: game.id,
                      }))
                    }
                    style={{
                      background:
                        formState.gameId === game.id
                          ? "rgba(240, 165, 0, 0.15)"
                          : "#1a1a1a",
                      border:
                        formState.gameId === game.id
                          ? "2px solid var(--psp-gold)"
                          : "1px solid #333",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      color: "#ccc",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontSize: "0.9rem",
                    }}
                  >
                    {game.away_school?.name || "Away"} vs{" "}
                    {game.home_school?.name || "Home"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Score Input */}
          {selectedGame && (
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#ccc",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Step 2: Enter Scores
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "#999",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {selectedGame.away_school?.name || "Away Team"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formState.awayScore}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        awayScore: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #333",
                      background: "#1a1a1a",
                      color: "#fff",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      textAlign: "center",
                      fontFamily: "var(--font-bebas)",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "#999",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {selectedGame.home_school?.name || "Home Team"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formState.homeScore}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        homeScore: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #333",
                      background: "#1a1a1a",
                      color: "#fff",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      textAlign: "center",
                      fontFamily: "var(--font-bebas)",
                    }}
                  />
                </div>
              </div>

              {/* Period Selector */}
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#999",
                  marginBottom: "0.4rem",
                }}
              >
                Period / Status
              </label>
              <select
                value={formState.period}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    period: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  background: "#1a1a1a",
                  color: "#fff",
                  fontSize: "1rem",
                }}
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message */}
          {formState.error && (
            <div
              style={{
                background: "#4a2626",
                border: "1px solid #8b4343",
                borderRadius: "8px",
                padding: "0.75rem",
                marginBottom: "1rem",
                color: "#ffa0a0",
                fontSize: "0.9rem",
              }}
            >
              {formState.error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              formState.submitting || !formState.gameId || !selectedGame
            }
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "8px",
              border: "none",
              background:
                formState.submitting || !formState.gameId || !selectedGame
                  ? "#555"
                  : "linear-gradient(135deg, var(--psp-gold) 0%, #d99c0d 100%)",
              color:
                formState.submitting || !formState.gameId || !selectedGame
                  ? "#999"
                  : "#000",
              fontWeight: 700,
              fontSize: "1rem",
              cursor:
                formState.submitting || !formState.gameId || !selectedGame
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {formState.submitting ? "Submitting..." : "Submit Score"}
          </button>
        </form>
      </div>
    </main>
  );
}
