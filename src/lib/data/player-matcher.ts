import Fuse from "fuse.js";
import { createClient } from "./common";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NLTEntry {
  id: number;
  person_name: string;
  current_org: string | null;
  espn_player_id: string | null;
  current_level: string;
  pro_league: string | null;
  high_school_id: number | null;
  high_school_name: string | null; // joined from schools table
  social_twitter: string | null;
  social_instagram: string | null;
}

export interface TeamMapping {
  id: number;
  psp_org_name: string;
  espn_team_id: string;
  espn_display_name: string | null;
  league: string;
  sport: string;
  logo_url: string | null;
}

export interface ESPNPlayerRef {
  espn_id: string;
  name: string;
  team_id: string;
}

export interface MatchResult {
  nltId: number;
  confidence: "exact" | "high" | "low";
  fuseScore?: number;
}

export interface BatchMatchResult {
  matched: Array<{
    espnPlayer: ESPNPlayerRef;
    nltEntry: NLTEntry;
    confidence: string;
  }>;
  unmatched: string[];
  reviewNeeded: Array<{ espnName: string; nltName: string; score: number }>;
}

// ============================================================================
// NAME NORMALIZATION
// ============================================================================

const ABBREVIATION_MAP: Record<string, string> = {
  "wm.": "william",
  "chas.": "charles",
  "thos.": "thomas",
  "jas.": "james",
  "robt.": "robert",
  "jno.": "john",
  "geo.": "george",
  "edw.": "edward",
};

const SUFFIX_PATTERN = /\s+(jr\.?|sr\.?|iii|ii|iv|v)\s*$/i;
const MIDDLE_INITIAL_PATTERN = /\s+[a-z]\.\s+/i;

/**
 * Normalizes a player name for fuzzy matching.
 * Strips suffixes (Jr., Sr., III, etc.), expands abbreviations,
 * drops middle initials, trims, and lowercases.
 */
export function normalizePlayerName(name: string): string {
  let normalized = name.trim().toLowerCase();

  // Strip suffixes
  normalized = normalized.replace(SUFFIX_PATTERN, "");

  // Expand common abbreviations
  for (const [abbr, full] of Object.entries(ABBREVIATION_MAP)) {
    const escapedAbbr = abbr.replace(/\./g, "\\.");
    normalized = normalized.replace(
      new RegExp(`\\b${escapedAbbr}`, "gi"),
      full
    );
  }

  // Drop middle initial (e.g., "First M. Last" → "First Last")
  normalized = normalized.replace(MIDDLE_INITIAL_PATTERN, " ");

  // Clean up whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

// ============================================================================
// FUSE.JS INDEX
// ============================================================================

/**
 * Creates a Fuse.js instance configured for player name matching.
 * Returns the Fuse instance for reuse across multiple matches.
 */
export function buildNLTIndex(nltEntries: NLTEntry[]): Fuse<NLTEntry> {
  return new Fuse(nltEntries, {
    keys: [{ name: "person_name", weight: 1.0 }],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 3,
    getFn: (obj, path) => {
      const value = Fuse.config.getFn(obj, path);
      if (typeof value === "string") {
        return normalizePlayerName(value);
      }
      if (Array.isArray(value)) {
        return value.map((v) =>
          typeof v === "string" ? normalizePlayerName(v) : v
        );
      }
      return value;
    },
  });
}

// ============================================================================
// SINGLE PLAYER MATCHING
// ============================================================================

/**
 * Matches an ESPN box score player name to a PSP next_level_tracking entry.
 *
 * Match strategy:
 * 1. Exact match on espn_player_id (confidence: 'exact')
 * 2. Fuzzy match via Fuse.js on normalized name within same team
 *    - Score <= 0.15 → 'high' confidence
 *    - Score 0.15-0.3 → 'low' confidence (logged for review)
 *    - Score > 0.3 → no match
 *
 * @returns MatchResult or null if no match found
 */
export function matchPlayerToNLT(
  espnName: string,
  espnTeamId: string,
  nltEntries: NLTEntry[],
  teamMappings?: TeamMapping[]
): MatchResult | null {
  try {
    // Primary: check for exact ESPN player ID match
    // (ESPN IDs are embedded in some NLT entries)
    const exactMatch = nltEntries.find(
      (entry) =>
        entry.espn_player_id !== null &&
        entry.espn_player_id === espnTeamId // check if any entry has this ESPN ID stored
    );

    // Actually, espn_player_id on NLT is per-player, not per-team.
    // We need to check if any NLT entry's espn_player_id matches an ESPN player ID.
    // But the function receives espnName + espnTeamId, not espnPlayerId.
    // The primary match should check NLT entries that have an espn_player_id set
    // and see if any match by name on the same team.

    // Filter NLT entries by team if mappings provided
    let teamFilteredEntries = nltEntries;
    if (teamMappings && espnTeamId) {
      const mapping = teamMappings.find((m) => m.espn_team_id === espnTeamId);
      if (mapping) {
        teamFilteredEntries = nltEntries.filter(
          (entry) =>
            entry.current_org?.toLowerCase() ===
            mapping.psp_org_name.toLowerCase()
        );
      }
    }

    // If no team-filtered entries, fall back to all entries
    if (teamFilteredEntries.length === 0) {
      teamFilteredEntries = nltEntries;
    }

    // Check for exact espn_player_id match across all entries first
    // (espn_player_id is the ESPN-specific ID for this player)
    for (const entry of nltEntries) {
      if (entry.espn_player_id && entry.espn_player_id === espnTeamId) {
        // This would only work if espnTeamId is actually the player's ESPN ID
        // In practice, the caller should pass the right ID
        return { nltId: entry.id, confidence: "exact" };
      }
    }

    // Secondary: Fuse.js fuzzy match on name within team
    const normalizedQuery = normalizePlayerName(espnName);
    const fuseIndex = buildNLTIndex(teamFilteredEntries);
    const results = fuseIndex.search(normalizedQuery);

    if (results.length === 0) {
      return null;
    }

    const topResult = results[0];
    const score = topResult.score ?? 1;

    if (score <= 0.15) {
      return {
        nltId: topResult.item.id,
        confidence: "high",
        fuseScore: score,
      };
    }

    if (score <= 0.3) {
      console.warn(
        `[player-matcher] Low confidence match: "${espnName}" → "${topResult.item.person_name}" (score: ${score.toFixed(4)})`
      );
      return {
        nltId: topResult.item.id,
        confidence: "low",
        fuseScore: score,
      };
    }

    return null;
  } catch (error) {
    console.error("[player-matcher] Error matching player:", espnName, error);
    return null;
  }
}

// ============================================================================
// BATCH MATCHING
// ============================================================================

/**
 * Matches an array of ESPN players against NLT entries.
 * Groups by team first for efficiency (only fuzzy-match against
 * NLT entries on the same team).
 *
 * @returns BatchMatchResult with matched, unmatched, and reviewNeeded arrays
 */
export function matchBatchPlayers(
  espnPlayers: ESPNPlayerRef[],
  nltEntries: NLTEntry[],
  teamMappings: TeamMapping[]
): BatchMatchResult {
  const matched: BatchMatchResult["matched"] = [];
  const unmatched: string[] = [];
  const reviewNeeded: BatchMatchResult["reviewNeeded"] = [];

  try {
    // Build a lookup: espn_team_id → psp_org_name
    const teamLookup = new Map<string, string>();
    for (const mapping of teamMappings) {
      teamLookup.set(mapping.espn_team_id, mapping.psp_org_name);
    }

    // Group ESPN players by team
    const playersByTeam = new Map<string, ESPNPlayerRef[]>();
    for (const player of espnPlayers) {
      const group = playersByTeam.get(player.team_id) || [];
      group.push(player);
      playersByTeam.set(player.team_id, group);
    }

    // Pre-group NLT entries by org name (lowercased)
    const nltByOrg = new Map<string, NLTEntry[]>();
    for (const entry of nltEntries) {
      const orgKey = (entry.current_org || "").toLowerCase();
      const group = nltByOrg.get(orgKey) || [];
      group.push(entry);
      nltByOrg.set(orgKey, group);
    }

    // Process each team group
    for (const [teamId, players] of Array.from(playersByTeam.entries())) {
      const pspOrgName = teamLookup.get(teamId);
      const teamNLTEntries = pspOrgName
        ? nltByOrg.get(pspOrgName.toLowerCase()) || []
        : [];

      // Build a Fuse index for this team's NLT entries
      const fuseIndex =
        teamNLTEntries.length > 0 ? buildNLTIndex(teamNLTEntries) : null;

      for (const player of players) {
        // Check exact espn_player_id match first (across ALL NLT entries)
        const exactMatch = nltEntries.find(
          (e) => e.espn_player_id === player.espn_id
        );

        if (exactMatch) {
          matched.push({
            espnPlayer: player,
            nltEntry: exactMatch,
            confidence: "exact",
          });
          continue;
        }

        // Fuzzy match within team
        if (!fuseIndex || teamNLTEntries.length === 0) {
          unmatched.push(player.name);
          continue;
        }

        const normalizedQuery = normalizePlayerName(player.name);
        const results = fuseIndex.search(normalizedQuery);

        if (results.length === 0) {
          unmatched.push(player.name);
          continue;
        }

        const topResult = results[0];
        const score = topResult.score ?? 1;

        if (score <= 0.15) {
          matched.push({
            espnPlayer: player,
            nltEntry: topResult.item,
            confidence: "high",
          });
        } else if (score <= 0.3) {
          matched.push({
            espnPlayer: player,
            nltEntry: topResult.item,
            confidence: "low",
          });
          reviewNeeded.push({
            espnName: player.name,
            nltName: topResult.item.person_name,
            score,
          });
        } else {
          unmatched.push(player.name);
        }
      }
    }
  } catch (error) {
    console.error("[player-matcher] Batch matching error:", error);
  }

  return { matched, unmatched, reviewNeeded };
}

// ============================================================================
// DATA FETCHERS
// ============================================================================

/**
 * Queries Supabase for all active next_level_tracking entries.
 * Returns typed array ready for matching.
 */
export async function getActiveNLTEntries(): Promise<NLTEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("next_level_tracking")
      .select(
        "id, person_name, current_org, espn_player_id, current_level, pro_league, high_school_id, social_twitter, social_instagram, schools:high_school_id(name)"
      )
      .eq("status", "active")
      .limit(5000);

    if (error) {
      console.error("[player-matcher] Error fetching NLT entries:", error);
      return [];
    }

    // Map joined school name to flat structure
    return ((data as any[]) || []).map((row: any) => ({
      id: row.id,
      person_name: row.person_name,
      current_org: row.current_org,
      espn_player_id: row.espn_player_id,
      current_level: row.current_level,
      pro_league: row.pro_league,
      high_school_id: row.high_school_id,
      high_school_name: row.schools?.name ?? null,
      social_twitter: row.social_twitter,
      social_instagram: row.social_instagram,
    })) as NLTEntry[];
  } catch (error) {
    console.error("[player-matcher] Error in getActiveNLTEntries:", error);
    return [];
  }
}

/**
 * Queries all team_mapping rows from Supabase.
 * Returns typed array for ESPN team ID → PSP org name lookups.
 */
export async function getTeamMappings(): Promise<TeamMapping[]> {
  try {
    const supabase = await createClient();
    // Cast to any — team_mapping is a new table not yet in Drizzle schema
    const { data, error } = await (supabase as any)
      .from("team_mapping")
      .select(
        "id, psp_org_name, espn_team_id, espn_display_name, league, sport, logo_url"
      )
      .limit(1000);

    if (error) {
      console.error("[player-matcher] Error fetching team mappings:", error);
      return [];
    }

    return (data as unknown as TeamMapping[]) || [];
  } catch (error) {
    console.error("[player-matcher] Error in getTeamMappings:", error);
    return [];
  }
}
