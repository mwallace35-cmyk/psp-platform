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

// Record of the Day Hero
export default function RecordOfTheDayHero({
  record,
  sport,
  sportColor,
}: {
  record: CuratedRecord;
  sport: string;
  sportColor: string;
}) {
  const playerName = record.player_name || record.holder_name || "Unknown";
  const schoolName = record.school_name || record.holder_school || "Unknown";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--psp-navy, #0a1628) 0%, var(--psp-navy, #0a1628) 80%, var(--psp-blue, #3b82f6) 100%)",
        border: `3px solid var(--psp-gold, #f0a500)`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--psp-gold, #f0a500)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            📜 Record of the Day
          </div>
          <h2 className="psp-h1" style={{ margin: "0 0 12px 0" }}>
            {record.record_value || record.record_number?.toLocaleString() || "Record"}
          </h2>
          <div style={{ fontSize: 16, marginBottom: 12 }}>
            {record.player_slug ? (
              <Link
                href={`/${sport}/players/${record.player_slug}`}
                style={{ color: "white", textDecoration: "none", fontWeight: 600, cursor: "pointer" }}
              >
                {playerName}
              </Link>
            ) : (
              <span style={{ fontWeight: 600 }}>{playerName}</span>
            )}
            <span style={{ color: "rgba(255,255,255,0.7)" }}> — </span>
            <Link
              href={`/${sport}/schools/${record.school_slug}`}
              style={{ color: "var(--psp-gold, #f0a500)", textDecoration: "none", fontWeight: 600 }}
            >
              {schoolName}
            </Link>
            {record.year_set && <span style={{ color: "rgba(255,255,255,0.7)" }}> ({record.year_set})</span>}
          </div>
          {record.description && (
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              {record.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
