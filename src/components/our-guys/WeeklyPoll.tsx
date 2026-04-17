"use client";

import { useEffect, useState, useCallback } from "react";

interface WeeklyOption {
  index: number;
  label: string;
  votes: number;
}

interface WeeklyPollData {
  poll_id: string;
  question: string;
  ends_at: string;
  options: WeeklyOption[];
  total_votes: number;
}

function generateFingerprint(): string {
  const parts = [
    typeof navigator !== "undefined" ? navigator.userAgent : "",
    typeof navigator !== "undefined" ? navigator.language : "",
    typeof screen !== "undefined" ? screen.width : 0,
    typeof screen !== "undefined" ? screen.height : 0,
    typeof Date !== "undefined" ? new Date().getTimezoneOffset() : 0,
  ].join("|");
  let hash = 0;
  for (let i = 0; i < parts.length; i++) {
    hash = ((hash << 5) - hash) + parts.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function formatEndsAt(endsAt: string): string {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "Poll closed";
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  if (days > 0) return `Ends in ${days}d ${hours}h`;
  if (hours > 0) return `Ends in ${hours}h`;
  return "Ends soon";
}

/**
 * WeeklyPoll — thin anonymous poll widget for /our-guys.
 *
 * Fetches the active poll from /api/weekly-poll. One vote per fingerprint,
 * persisted in localStorage for UI state. Renders selection view before
 * vote, results view with percent bars after vote.
 */
export default function WeeklyPoll() {
  const [poll, setPoll] = useState<WeeklyPollData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch("/api/weekly-poll", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "unknown");
      setPoll(json.data);
      setLoaded(true);
    } catch {
      setFetchError(true);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  useEffect(() => {
    if (!poll) return;
    const key = `psp-weekly-poll-${poll.poll_id}`;
    const voted = localStorage.getItem(key);
    if (voted !== null) {
      setHasVoted(true);
      setSelected(Number(voted));
    }
  }, [poll]);

  const handleVote = useCallback(async () => {
    if (!poll || selected === null || voting || hasVoted) return;
    setVoting(true);
    try {
      const fingerprint = generateFingerprint();
      const res = await fetch("/api/weekly-poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poll_id: poll.poll_id, option_index: selected, fingerprint }),
      });
      const json = await res.json();
      if (json.success) {
        setPoll({ ...poll, options: json.data.options, total_votes: json.data.total_votes });
        setHasVoted(true);
        localStorage.setItem(`psp-weekly-poll-${poll.poll_id}`, String(selected));
      } else if (res.status === 409) {
        // already voted
        setHasVoted(true);
        localStorage.setItem(`psp-weekly-poll-${poll.poll_id}`, String(selected));
      }
    } catch {
      // silent fail
    } finally {
      setVoting(false);
    }
  }, [poll, selected, voting, hasVoted]);

  if (!loaded) return null;
  if (fetchError || !poll) return null;
  if (!poll.options || poll.options.length === 0) return null;

  return (
    <div
      className="bar-card"
      style={{
        padding: 16,
        border: "1px solid var(--psp-rule, rgba(245,235,214,0.15))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 10,
          gap: 8,
        }}
      >
        <h3 className="bar-section-header" style={{ fontSize: 16, margin: 0 }}>
          WEEKLY POLL
        </h3>
        <span style={{ fontSize: 10, color: "var(--bar-text-muted)", fontWeight: 600 }}>
          {formatEndsAt(poll.ends_at)}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--bar-text, #f5ebd6)",
          marginBottom: 12,
          lineHeight: 1.35,
        }}
      >
        {poll.question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {poll.options.map((opt) => {
          const pct = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0;
          const isSelected = selected === opt.index;

          if (hasVoted) {
            return (
              <div
                key={opt.index}
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid var(--psp-rule, rgba(245,235,214,0.15))",
                  background: isSelected
                    ? "rgba(240, 165, 0, 0.06)"
                    : "var(--bar-surface-elevated, rgba(255,255,255,0.02))",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${pct}%`,
                    background: isSelected
                      ? "rgba(240, 165, 0, 0.15)"
                      : "rgba(245, 235, 214, 0.05)",
                    transition: "width .5s",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "var(--psp-gold, #f0a500)" : "var(--bar-text, #f5ebd6)",
                    }}
                  >
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: "var(--psp-gold, #f0a500)",
                          marginRight: 6,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                    {opt.label}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isSelected ? "var(--psp-gold, #f0a500)" : "var(--bar-text-muted)",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={opt.index}
              type="button"
              onClick={() => setSelected(opt.index)}
              aria-pressed={isSelected}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                background: isSelected
                  ? "rgba(240, 165, 0, 0.08)"
                  : "var(--bar-surface-elevated, rgba(255,255,255,0.02))",
                border: isSelected
                  ? "1px solid var(--psp-gold, #f0a500)"
                  : "1px solid var(--psp-rule, rgba(245,235,214,0.15))",
                color: "var(--bar-text, #f5ebd6)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  border: `2px solid ${isSelected ? "var(--psp-gold, #f0a500)" : "var(--psp-rule-strong, rgba(245,235,214,0.3))"}`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "var(--psp-gold, #f0a500)",
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {!hasVoted && (
        <button
          type="button"
          onClick={handleVote}
          disabled={selected === null || voting}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            background: selected === null ? "rgba(245,235,214,0.08)" : "var(--psp-gold, #f0a500)",
            color: selected === null ? "var(--bar-text-muted)" : "var(--psp-navy, #0a1628)",
            border: "none",
            cursor: selected === null || voting ? "not-allowed" : "pointer",
            opacity: voting ? 0.7 : 1,
          }}
        >
          {voting ? "Voting…" : "Cast vote"}
        </button>
      )}

      <p
        style={{
          marginTop: 10,
          fontSize: 10,
          color: "var(--bar-text-muted)",
          textAlign: "center",
          letterSpacing: 0.3,
        }}
      >
        {poll.total_votes} vote{poll.total_votes === 1 ? "" : "s"} · 1 per device
      </p>
    </div>
  );
}
