import Link from "next/link";
import type { DecadePick, RosterTier } from "@/lib/data/decades";

interface DecadeRosterProps {
  picks: DecadePick[];
}

const TIER_META: Record<RosterTier, { label: string; border: string; accent: string; badge: string }> = {
  "First Team": {
    label: "First Team",
    border: "rgba(240,165,0,0.3)",
    accent: "var(--psp-gold)",
    badge: "rgba(240,165,0,0.15)",
  },
  "Second Team": {
    label: "Second Team",
    border: "rgba(99,102,241,0.25)",
    accent: "#818cf8",
    badge: "rgba(99,102,241,0.12)",
  },
  "Third Team": {
    label: "Third Team",
    border: "rgba(16,185,129,0.2)",
    accent: "#34d399",
    badge: "rgba(16,185,129,0.1)",
  },
};

// Canonical position order for display grouping
const POSITION_ORDER = [
  "C", "QB", "RB", "MP", "Rec.", "Rec", "L", "K", "P", "KR",
  "ATH", "DL", "NG",
  "LB", "B", "DB", "S", "CB",
];

function positionSortKey(pos: string | null): number {
  if (!pos) return 99;
  const idx = POSITION_ORDER.indexOf(pos.trim());
  return idx === -1 ? 50 : idx;
}

function groupByTierAndCategory(
  picks: DecadePick[],
): Map<RosterTier, { offense: DecadePick[]; defense: DecadePick[]; specialist: DecadePick[] }> {
  const map = new Map<RosterTier, { offense: DecadePick[]; defense: DecadePick[]; specialist: DecadePick[] }>();

  for (const pick of picks) {
    if (!map.has(pick.tier)) {
      map.set(pick.tier, { offense: [], defense: [], specialist: [] });
    }
    const bucket = map.get(pick.tier)!;
    if (pick.category === "Defense") bucket.defense.push(pick);
    else if (pick.category === "Specialist") bucket.specialist.push(pick);
    else bucket.offense.push(pick);
  }

  // Sort within each group by position
  for (const [, groups] of map) {
    groups.offense.sort((a, b) => positionSortKey(a.position) - positionSortKey(b.position));
    groups.defense.sort((a, b) => positionSortKey(a.position) - positionSortKey(b.position));
    groups.specialist.sort((a, b) => positionSortKey(a.position) - positionSortKey(b.position));
  }

  return map;
}

function PickRow({ pick }: { pick: DecadePick }) {
  const nameNode = pick.playerSlug ? (
    <Link
      href={`/football/players/${pick.playerSlug}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "#fff",
        textDecoration: "none",
      }}
    >
      {pick.playerName}
    </Link>
  ) : (
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "#e2e8f0",
      }}
    >
      {pick.playerName}
    </span>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.625rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Position pill */}
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          background: "rgba(255,255,255,0.05)",
          padding: "0.15rem 0.5rem",
          borderRadius: "4px",
          minWidth: "36px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {pick.position ?? "—"}
      </span>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {nameNode}
      </div>

      {/* School + class year */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            color: "#64748b",
          }}
        >
          {pick.school}
          {pick.classYear && (
            <span style={{ marginLeft: "0.375rem", opacity: 0.7 }}>
              &lsquo;{pick.classYear}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function RosterGroup({
  title,
  picks,
  accent,
}: {
  title: string;
  picks: DecadePick[];
  accent: string;
}) {
  if (picks.length === 0) return null;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: "0.25rem",
          paddingLeft: "0.25rem",
        }}
      >
        {title}
      </div>
      <div>
        {picks.map((p) => (
          <PickRow key={p.id} pick={p} />
        ))}
      </div>
    </div>
  );
}

export default function DecadeRoster({ picks }: DecadeRosterProps) {
  if (!picks || picks.length === 0) {
    return (
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#64748b" }}>
          Roster not available.
        </p>
      </section>
    );
  }

  const tiers: RosterTier[] = ["First Team", "Second Team", "Third Team"];
  const grouped = groupByTierAndCategory(picks);

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 1.5rem 2rem",
      }}
    >
      <h2 className="psp-h2" style={{ color: "#fff", marginBottom: "1.5rem" }}>
        The Roster
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {tiers.map((tier) => {
          const groups = grouped.get(tier);
          if (!groups) return null;
          const totalInTier =
            groups.offense.length + groups.defense.length + groups.specialist.length;
          if (totalInTier === 0) return null;

          const meta = TIER_META[tier];

          return (
            <div
              key={tier}
              style={{
                background: "var(--psp-navy-mid)",
                border: `1px solid ${meta.border}`,
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              {/* Tier header */}
              <div
                style={{
                  background: meta.badge,
                  borderBottom: `1px solid ${meta.border}`,
                  padding: "0.75rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.1rem",
                    letterSpacing: "0.06em",
                    color: meta.accent,
                  }}
                >
                  {meta.label}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.7rem",
                    color: "#64748b",
                  }}
                >
                  {totalInTier} selections
                </span>
              </div>

              <div style={{ padding: "1.25rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.5rem 2rem",
                  }}
                >
                  {groups.offense.length > 0 && (
                    <RosterGroup
                      title="Offense"
                      picks={groups.offense}
                      accent={meta.accent}
                    />
                  )}
                  {groups.defense.length > 0 && (
                    <RosterGroup
                      title="Defense"
                      picks={groups.defense}
                      accent={meta.accent}
                    />
                  )}
                  {groups.specialist.length > 0 && (
                    <RosterGroup
                      title="Specialists"
                      picks={groups.specialist}
                      accent={meta.accent}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
