"use client";

import { useState, useEffect, useCallback } from "react";
import { VALID_SPORTS, SPORT_META } from "@/lib/sports";

type EmbedType = "leaderboard" | "school" | "player" | "stat-card";

const STATS_BY_SPORT: Record<string, Array<{ key: string; label: string }>> = {
  football: [
    { key: "rushing", label: "Rushing Yards" },
    { key: "passing", label: "Passing Yards" },
    { key: "receiving", label: "Receiving Yards" },
    { key: "scoring", label: "Touchdowns" },
  ],
  basketball: [
    { key: "points", label: "Total Points" },
    { key: "ppg", label: "Points Per Game" },
    { key: "rebounds", label: "Rebounds" },
    { key: "assists", label: "Assists" },
  ],
  baseball: [
    { key: "batting_avg", label: "Batting Average" },
    { key: "home_runs", label: "Home Runs" },
    { key: "era", label: "ERA" },
  ],
};

export default function EmbedPage() {
  const [embedType, setEmbedType] = useState<EmbedType>("leaderboard");
  const [sport, setSport] = useState("football");
  const [stat, setStat] = useState("rushing");
  const [schoolSlug, setSchoolSlug] = useState("");
  const [playerSlug, setPlayerSlug] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [limit, setLimit] = useState(10);
  const [schoolSuggestions, setSchoolSuggestions] = useState<
    Array<{ name: string; slug: string }>
  >([]);
  const [playerSuggestions, setPlayerSuggestions] = useState<
    Array<{ name: string; slug: string }>
  >([]);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://phillysportspack.com";

  // Search schools
  const handleSchoolSearch = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSchoolSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`/api/players/search?q=${encodeURIComponent(query)}&type=school`);
        const data = await response.json();
        setSchoolSuggestions(
          (data.schools || []).slice(0, 5).map((s: any) => ({
            name: s.name,
            slug: s.slug,
          }))
        );
      } catch (error) {
        console.error("School search error:", error);
      }
    },
    []
  );

  // Search players
  const handlePlayerSearch = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setPlayerSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`/api/players/search?q=${encodeURIComponent(query)}&type=player`);
        const data = await response.json();
        setPlayerSuggestions(
          (data.players || []).slice(0, 5).map((p: any) => ({
            name: p.name,
            slug: p.slug,
          }))
        );
      } catch (error) {
        console.error("Player search error:", error);
      }
    },
    []
  );

  // Build embed URLs
  const getEmbedUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append("type", embedType);

    switch (embedType) {
      case "leaderboard":
        params.append("sport", sport);
        params.append("stat", stat);
        params.append("limit", limit.toString());
        break;
      case "school":
        params.append("slug", schoolSlug);
        if (sport) params.append("sport", sport);
        break;
      case "player":
        params.append("slug", playerSlug);
        if (sport) params.append("sport", sport);
        break;
      case "stat-card":
        break;
    }

    return `${baseUrl}/api/embed/widget?${params.toString()}&theme=${theme}`;
  }, [embedType, sport, stat, limit, schoolSlug, playerSlug, theme, baseUrl]);

  const iframeCode = `<iframe src="${getEmbedUrl()}" width="400" height="${
    embedType === "leaderboard" ? "500" : "300"
  }" frameborder="0" style="border-radius: 8px;"></iframe>`;

  const copyToClipboard = async (text: string, isIframe: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isIframe) {
        setCopiedIframe(true);
        setTimeout(() => setCopiedIframe(false), 2000);
      } else {
        setCopiedDirect(true);
        setTimeout(() => setCopiedDirect(false), 2000);
      }
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0a1628",
        color: "#f3f4f6",
        fontFamily: "system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "32px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            }}
          >
            Embed Builder
          </h1>
          <p
            style={{
              margin: "0",
              fontSize: "16px",
              color: "#9ca3af",
            }}
          >
            Create shareable widgets for your website
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
          }}
        >
          {/* Configuration Panel */}
          <div>
            <div
              style={{
                backgroundColor: "#1a2332",
                borderRadius: "8px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 24px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Configuration
              </h2>

              {/* Widget Type */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#f0a500",
                    marginBottom: "8px",
                  }}
                >
                  Widget Type
                </label>
                <select
                  value={embedType}
                  onChange={(e) => setEmbedType(e.target.value as EmbedType)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: "#0f2040",
                    color: "#f3f4f6",
                    border: "1px solid #374151",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <option value="leaderboard">Leaderboard</option>
                  <option value="school">School</option>
                  <option value="player">Player</option>
                  <option value="stat-card">Stat Card</option>
                </select>
              </div>

              {/* Sport Select (for leaderboard, school, player) */}
              {embedType !== "stat-card" && (
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#f0a500",
                      marginBottom: "8px",
                    }}
                  >
                    Sport
                  </label>
                  <select
                    value={sport}
                    onChange={(e) => {
                      setSport(e.target.value);
                      // Reset stat if not available for new sport
                      if (STATS_BY_SPORT[e.target.value]) {
                        setStat(STATS_BY_SPORT[e.target.value][0].key);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#0f2040",
                      color: "#f3f4f6",
                      border: "1px solid #374151",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {VALID_SPORTS.map((s) => (
                      <option key={s} value={s}>
                        {SPORT_META[s as keyof typeof SPORT_META]?.name || s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Stat Select (for leaderboard) */}
              {embedType === "leaderboard" && (
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#f0a500",
                      marginBottom: "8px",
                    }}
                  >
                    Statistic
                  </label>
                  <select
                    value={stat}
                    onChange={(e) => setStat(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#0f2040",
                      color: "#f3f4f6",
                      border: "1px solid #374151",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {(STATS_BY_SPORT[sport] || []).map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* School Search (for school type) */}
              {embedType === "school" && (
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#f0a500",
                      marginBottom: "8px",
                    }}
                  >
                    School
                  </label>
                  <input
                    type="text"
                    placeholder="Search schools..."
                    value={schoolSlug}
                    onChange={(e) => {
                      setSchoolSlug(e.target.value);
                      handleSchoolSearch(e.target.value);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#0f2040",
                      color: "#f3f4f6",
                      border: "1px solid #374151",
                      borderRadius: "4px",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  />
                  {schoolSuggestions.length > 0 && (
                    <div
                      style={{
                        backgroundColor: "#0f2040",
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid #374151",
                      }}
                    >
                      {schoolSuggestions.map((s) => (
                        <button
                          key={s.slug}
                          onClick={() => setSchoolSlug(s.slug)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: "transparent",
                            color: "#f3f4f6",
                            border: "none",
                            borderBottom: "1px solid #374151",
                            textAlign: "left",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "#1a2332";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "transparent";
                          }}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Player Search (for player type) */}
              {embedType === "player" && (
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#f0a500",
                      marginBottom: "8px",
                    }}
                  >
                    Player
                  </label>
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={playerSlug}
                    onChange={(e) => {
                      setPlayerSlug(e.target.value);
                      handlePlayerSearch(e.target.value);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#0f2040",
                      color: "#f3f4f6",
                      border: "1px solid #374151",
                      borderRadius: "4px",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  />
                  {playerSuggestions.length > 0 && (
                    <div
                      style={{
                        backgroundColor: "#0f2040",
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid #374151",
                      }}
                    >
                      {playerSuggestions.map((p) => (
                        <button
                          key={p.slug}
                          onClick={() => setPlayerSlug(p.slug)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: "transparent",
                            color: "#f3f4f6",
                            border: "none",
                            borderBottom: "1px solid #374151",
                            textAlign: "left",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "#1a2332";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "transparent";
                          }}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#f0a500",
                    marginBottom: "8px",
                  }}
                >
                  Theme
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["dark", "light"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t as "dark" | "light")}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        backgroundColor: theme === t ? "#f0a500" : "#0f2040",
                        color: theme === t ? "#0a1628" : "#f3f4f6",
                        border: "1px solid #374151",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Limit (for leaderboard) */}
              {embedType === "leaderboard" && (
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#f0a500",
                      marginBottom: "8px",
                    }}
                  >
                    Max Rows
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={limit}
                    onChange={(e) => setLimit(Math.max(1, Math.min(100, parseInt(e.target.value))))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#0f2040",
                      color: "#f3f4f6",
                      border: "1px solid #374151",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview & Code Panel */}
          <div>
            <div
              style={{
                backgroundColor: "#1a2332",
                borderRadius: "8px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 24px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Preview & Code
              </h2>

              {/* Preview */}
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#f0a500",
                  }}
                >
                  Live Preview
                </p>
                <div
                  style={{
                    backgroundColor: theme === "dark" ? "#0f2040" : "#f5f5f5",
                    borderRadius: "8px",
                    padding: "16px",
                    minHeight: "300px",
                    border: "1px solid #374151",
                  }}
                >
                  <iframe
                    src={getEmbedUrl()}
                    width="100%"
                    height="300"
                    frameBorder="0"
                    style={{ borderRadius: "4px" }}
                  />
                </div>
              </div>

              {/* Iframe Code */}
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#f0a500",
                  }}
                >
                  Iframe Code
                </p>
                <div
                  style={{
                    backgroundColor: "#0f2040",
                    borderRadius: "4px",
                    padding: "12px",
                    border: "1px solid #374151",
                    marginBottom: "8px",
                  }}
                >
                  <pre
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      color: "#d1d5db",
                      overflowX: "auto",
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {iframeCode}
                  </pre>
                </div>
                <button
                  onClick={() => copyToClipboard(iframeCode, true)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: copiedIframe ? "#10b981" : "#f0a500",
                    color: copiedIframe ? "#f3f4f6" : "#0a1628",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "background-color 0.2s",
                  }}
                >
                  {copiedIframe ? "✓ Copied" : "Copy Iframe Code"}
                </button>
              </div>

              {/* Direct Link */}
              <div>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#f0a500",
                  }}
                >
                  Direct Link
                </p>
                <div
                  style={{
                    backgroundColor: "#0f2040",
                    borderRadius: "4px",
                    padding: "12px",
                    border: "1px solid #374151",
                    marginBottom: "8px",
                  }}
                >
                  <pre
                    style={{
                      margin: "0",
                      fontSize: "11px",
                      color: "#d1d5db",
                      overflowX: "auto",
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {getEmbedUrl()}
                  </pre>
                </div>
                <button
                  onClick={() => copyToClipboard(getEmbedUrl(), false)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: copiedDirect ? "#10b981" : "#f0a500",
                    color: copiedDirect ? "#f3f4f6" : "#0a1628",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "background-color 0.2s",
                  }}
                >
                  {copiedDirect ? "✓ Copied" : "Copy Direct Link"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid #374151",
            textAlign: "center",
            fontSize: "14px",
            color: "#9ca3af",
          }}
        >
          <p>
            Embed widgets are responsive and support dark/light themes. All embeds include a link
            back to PhillySportsPack.com.
          </p>
        </div>
      </div>
    </div>
  );
}
