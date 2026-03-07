import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const alt = "Player Profile - PhillySportsPack.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PlayerOGData {
  name: string;
  schools?: { name: string } | null;
}

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

export default async function Image({ params }: { params: Promise<{ sport: string; slug: string }> }) {
  const { sport, slug } = await params;
  const color = SPORT_COLORS[sport] || "#1a365d";

  let playerName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  let schoolName = "";

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("players")
      .select("name, schools:schools!players_primary_school_id_fkey(name)")
      .eq("slug", slug)
      .single();
    if (data) {
      const playerData = data as unknown as PlayerOGData;
      playerName = playerData.name;
      schoolName = playerData.schools?.name || "";
    }
  } catch {
    // Use formatted slug as fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: `linear-gradient(135deg, #0a1628 0%, ${color}44 100%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, color: color, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 2 }}>
          Player Profile
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#ffffff", lineHeight: 1.1, marginBottom: 16 }}>
          {playerName}
        </div>
        {schoolName && (
          <div style={{ fontSize: 32, color: "#d4a843", marginBottom: 32 }}>
            {schoolName}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            marginTop: "auto",
          }}
        >
          <span style={{ color: "#ffffff" }}>PHILLY</span>
          <span style={{ color: "#d4a843" }}>SPORTS</span>
          <span style={{ color: "#ffffff" }}>PACK</span>
          <span style={{ color: "#64748b", marginLeft: 16 }}>phillysportspack.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
