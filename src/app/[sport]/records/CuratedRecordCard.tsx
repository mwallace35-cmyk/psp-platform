"use client";

import Link from "next/link";

interface CuratedRecord {
  id: number;
  category: string;
  subcategory: string | null;
  scope: string | null;
  record_value: string | null;
  record_number: number | null;
  holder_name: string | null;
  holder_school: string | null;
  year_set: number | null;
  description: string | null;
  player_name: string | null;
  player_slug: string | null;
  school_name: string | null;
  school_slug: string | null;
  season_label: string | null;
}

// Scope labels and display (Fix #2: normalize "city" to "city-title")
const SCOPE_LABELS: Record<string, string> = {
  game: "Game",
  season: "Season",
  career: "Career",
  city: "City Title",
  postseason: "Postseason",
  "city-title": "City Title",
};

const SCOPE_COLORS: Record<string, string> = {
  game: "#3b82f6",
  season: "#10b981",
  career: "#f59e0b",
  city: "#8b5cf6",
  postseason: "#ef4444",
  "city-title": "#f0a500",
};

// Team category detection
const TEAM_CATEGORIES = new Set(["Team", "Team Records"]);

// Helper: format scope label
function scopeLabel(scope: string | null): string {
  if (!scope) return "Record";
  return SCOPE_LABELS[scope] || scope;
}

// Helper: get scope color
function scopeColor(scope: string | null): string {
  if (!scope) return "#6b7280";
  return SCOPE_COLORS[scope] || "#6b7280";
}

// Curated Record Card
export default function CuratedRecordCard({
  record,
  sport,
  sportColor,
}: {
  record: CuratedRecord;
  sport: string;
  sportColor: string;
}) {
  const playerName = record.player_name || record.holder_name || "Unknown";
  const schoolName = record.school_name || record.holder_school || "";
  const isTeam = TEAM_CATEGORIES.has(record.category || "");

  return (
    <div
      style={{
        padding: 12,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 13,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: "var(--psp-navy, #0a1628)", marginBottom: 4 }}>
            {record.subcategory || record.category}
            {record.scope && (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 6px",
                  background: `${scopeColor(record.scope)}18`,
                  color: scopeColor(record.scope),
                  borderRadius: 3,
                  textTransform: "uppercase",
                }}
              >
                {scopeLabel(record.scope)}
              </span>
            )}
          </div>
          <div style={{ color: "#6b7280", marginBottom: 4 }}>
            {isTeam ? (
              <>
                {record.school_slug ? (
                  <Link href={`/${sport}/schools/${record.school_slug}`} style={{ color: "var(--psp-navy)", fontWeight: 500, textDecoration: "none" }}>
                    {schoolName}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 500 }}>{schoolName}</span>
                )}
              </>
            ) : (
              <>
                {record.player_slug ? (
                  <Link href={`/${sport}/players/${record.player_slug}`} style={{ color: "var(--psp-navy)", fontWeight: 500, textDecoration: "none" }}>
                    {playerName}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 500 }}>{playerName}</span>
                )}
                {schoolName && " — "}
                {schoolName && (
                  <Link href={`/${sport}/schools/${record.school_slug}`} style={{ color: "var(--psp-gold, #f0a500)", textDecoration: "none" }}>
                    {schoolName}
                  </Link>
                )}
              </>
            )}
            {record.year_set && <span style={{ color: "#9ca3af" }}> ({record.year_set})</span>}
          </div>
          {record.description && <div style={{ fontSize: 11, color: "#9ca3af" }}>{record.description}</div>}
        </div>
        <div className="font-bebas text-lg tracking-wide" style={{ color: sportColor, whiteSpace: "nowrap" }}>
          {record.record_value || record.record_number?.toLocaleString() || "—"}
        </div>
      </div>
    </div>
  );
}
