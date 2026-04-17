import { createClient } from "./common";

export type TimelineNode =
  | {
      kind: "hs";
      school: string;
      schoolSlug: string;
      graduationYear: number | null;
    }
  | {
      kind: "college";
      college: string;
      collegeSport: string | null;
    }
  | {
      kind: "draft";
      year: number | null;
      league: string;
      team: string | null;
      round: string | null;
    }
  | {
      kind: "pro";
      team: string;
      league: string | null;
      role: string | null;
    }
  | {
      kind: "milestone";
      year: number | null;
      title: string;
      subtitle: string | null;
    };

/**
 * Assemble a simple career timeline for a player from existing tables.
 *
 * HS node (always, if graduation_year or primary_school_id present) →
 * College node (if next_level_tracking.college) →
 * Draft node (if next_level_tracking.draft_info has a year-looking token) →
 * Current pro team node (if current_level='pro' and current_org/pro_team) →
 * Up to 3 major milestone nodes from awards (All-American, All-State, HOF).
 *
 * All queries are safe no-ops on missing data — function never throws.
 */
export async function getPlayerTimeline(playerId: number): Promise<TimelineNode[]> {
  const supabase = await createClient();
  const nodes: TimelineNode[] = [];

  try {
    // Player HS info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: player } = await (supabase as any)
      .from("players")
      .select("id, graduation_year, schools:primary_school_id(name, slug)")
      .eq("id", playerId)
      .single();

    if (player) {
      const school = Array.isArray(player.schools) ? player.schools[0] : player.schools;
      if (school?.name) {
        nodes.push({
          kind: "hs",
          school: school.name,
          schoolSlug: school.slug ?? "",
          graduationYear: player.graduation_year ?? null,
        });
      }
    }

    // Next-level tracking: college + draft + pro
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: nlt } = await (supabase as any)
      .from("next_level_tracking")
      .select("college, college_sport, pro_team, pro_league, draft_info, current_level, current_org, current_role")
      .eq("player_id", playerId)
      .limit(1);

    const nltRow = nlt && nlt.length > 0 ? nlt[0] : null;

    if (nltRow?.college) {
      nodes.push({
        kind: "college",
        college: nltRow.college,
        collegeSport: nltRow.college_sport ?? null,
      });
    }

    if (nltRow?.draft_info) {
      const match = String(nltRow.draft_info).match(/\b(19|20)\d{2}\b/);
      const year = match ? Number(match[0]) : null;
      const roundMatch = String(nltRow.draft_info).match(/Rd?\.?\s*\d+|Round\s*\d+|\b\d+(?:st|nd|rd|th)\s*round\b/i);
      nodes.push({
        kind: "draft",
        year,
        league: nltRow.pro_league ?? "Pro",
        team: nltRow.pro_team ?? null,
        round: roundMatch ? roundMatch[0] : null,
      });
    }

    if (nltRow && nltRow.current_level === "pro") {
      const team = nltRow.pro_team || nltRow.current_org;
      if (team) {
        nodes.push({
          kind: "pro",
          team,
          league: nltRow.pro_league ?? null,
          role: nltRow.current_role ?? null,
        });
      }
    }

    // Top 3 major awards as milestones
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: awards } = await (supabase as any)
      .from("awards")
      .select("award_name, year, award_tier")
      .eq("player_id", playerId)
      .order("year", { ascending: true, nullsFirst: false })
      .limit(50);

    if (awards && awards.length > 0) {
      const majorKeywords = [
        "All-American",
        "All American",
        "All-State",
        "All State",
        "Hall of Fame",
        "Mr. Basketball",
        "Mr. Football",
        "Player of the Year",
        "McDonald's",
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const majors = (awards as any[]).filter((a) =>
        majorKeywords.some((kw) =>
          typeof a.award_name === "string" && a.award_name.toLowerCase().includes(kw.toLowerCase())
        )
      );
      // Dedupe by award_name, keep earliest year
      const seen = new Set<string>();
      const picks: Array<{ award_name: string; year: number | null; award_tier: string | null }> = [];
      for (const a of majors) {
        const key = (a.award_name as string).toLowerCase().replace(/\s+/g, " ").trim();
        if (seen.has(key)) continue;
        seen.add(key);
        picks.push({
          award_name: a.award_name,
          year: typeof a.year === "number" ? a.year : null,
          award_tier: a.award_tier ?? null,
        });
        if (picks.length >= 3) break;
      }
      for (const p of picks) {
        nodes.push({
          kind: "milestone",
          year: p.year,
          title: p.award_name,
          subtitle: p.award_tier,
        });
      }
    }
  } catch (err) {
    // Defensive: timeline is best-effort, never blocks the page.
    console.error("[getPlayerTimeline] error:", err);
  }

  return nodes;
}
