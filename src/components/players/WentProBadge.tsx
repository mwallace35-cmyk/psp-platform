"use client";

import Link from "next/link";
import { createProAthleteSlug } from "@/lib/slug-utils";

interface WentProBadgeProps {
  playerId: number;
}

async function getProStatus(playerId: number) {
  try {
    const response = await fetch(
      `https://phillysportspack.com/api/players/${playerId}/pro-status`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function WentProBadge({ playerId }: WentProBadgeProps) {
  const proData = await getProStatus(playerId);

  if (!proData || proData.currentLevel !== "pro") {
    return null;
  }

  const leagueColors: Record<string, string> = {
    NFL: "#003da5",
    NBA: "#c4122e",
    MLB: "#002d72",
    WNBA: "#552583",
  };

  const leagueColor = leagueColors[proData.proLeague] || "#0a1628";
  const slug = createProAthleteSlug(proData.personName, proData.id);

  return (
    <Link
      href={`/next-level/${slug}`}
      style={{
        display: "block",
        marginBottom: 16,
        padding: "14px 16px",
        background: leagueColor,
        color: "#fff",
        borderRadius: 6,
        textDecoration: "none",
        transition: ".15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.9";
        (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }} aria-hidden="true">🏆</span>
        <div className="psp-caption">
          Went Pro
        </div>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,.9)" }}>
        {proData.proTeam} — {proData.proLeague}
      </div>
      {proData.draftInfo && (
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)", marginTop: 4 }}>
          {proData.draftInfo}
        </div>
      )}
      <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", marginTop: 8 }}>
        View full pro profile →
      </div>
    </Link>
  );
}
