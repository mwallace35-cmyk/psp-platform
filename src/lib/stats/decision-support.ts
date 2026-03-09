/**
 * Decision Support Module
 *
 * Provides analytical tools for scouts, coaches, and fans:
 * - College placement rates by school
 * - Professional athlete production scores
 * - All-City probability predictions (logistic regression)
 * - Era-adjusted player comparison tools
 */

import { createClient } from "@/lib/supabase/server";
import type { SportId } from "@/lib/sports";
import { adjustForEra } from "./era-adjustment";
import {
  calculatePercentileRank,
  calculateZScore,
  type PercentileResult,
  type ZScoreResult,
} from "./computed-metrics";

// ============================================================================
// TYPES
// ============================================================================

/**
 * College placement statistics for a school
 */
export interface CollegePlacementStats {
  schoolId: number;
  schoolName: string;
  totalPlayers: number;
  trackedToCollege: number;
  placementRate: number; // 0-1
  divisionBreakdown: {
    p1: number; // FBS / D1 Basketball
    p2: number; // FCS / D2
    p3: number; // D3 / NAIA
    naia: number;
    club: number;
    untracked: number;
  };
}

/**
 * Professional athlete pipeline metrics
 */
export interface ProPipelineScore {
  schoolId: number;
  schoolName: string;
  proAthletes: number;
  proPercentage: number; // Of all time players
  nflCount: number;
  nbaCount: number;
  mlbCount: number;
  hallOfFamers: number;
  score: number; // 0-100
  tier: "elite" | "national" | "regional" | "developing" | "minimal";
}

/**
 * All-City probability prediction result
 */
export interface AllCityPrediction {
  playerName: string;
  sport: SportId;
  allCityProbability: number; // 0-1
  confidenceLevel: "high" | "medium" | "low";
  reasoning: string[];
  comparison: {
    topPercentile: number; // e.g., 95th percentile
    vs: string; // "vs peers in same season"
  };
}

/**
 * Comparison result between two players
 */
export interface PlayerComparison {
  playerA: { name: string; position?: string; value: number };
  playerB: { name: string; position?: string; value: number };
  moreImpressionId: number;
  differenceAmount: number;
  differencePercentage: number;
  eraAdjustedDifference: number | null; // Z-score difference
}

// ============================================================================
// COLLEGE PLACEMENT
// ============================================================================

/**
 * Calculates college placement statistics for a school
 *
 * Analyzes the next_level_tracking table to determine what percentage
 * of a school's players were tracked to colleges and their division levels.
 *
 * @param schoolId School ID
 * @returns College placement statistics, or null if unable to calculate
 */
export async function getCollegePlacementRate(
  schoolId: number
): Promise<CollegePlacementStats | null> {
  try {
    const supabase = await createClient();

    // Get all players from this school
    const { data: schoolPlayers, error: playerError } = await supabase
      .from("players")
      .select(
        `
        id,
        name,
        schools:primary_school_id
      `
      )
      .eq("primary_school_id", schoolId);

    if (playerError || !schoolPlayers) {
      console.error("Error fetching school players:", playerError);
      return null;
    }

    if (schoolPlayers.length === 0) {
      return null;
    }

    const playerIds = schoolPlayers.map((p) => p.id);

    // Get next level tracking for these players
    const { data: tracking, error: trackingError } = await supabase
      .from("next_level_tracking")
      .select("college_committed,college_division,college_committed_division")
      .in("player_id", playerIds);

    if (trackingError || !tracking) {
      console.error("Error fetching next level tracking:", trackingError);
      return null;
    }

    const trackedCount = tracking.filter((t) => t.college_committed).length;

    // Division breakdown
    const divisions = {
      p1: 0,
      p2: 0,
      p3: 0,
      naia: 0,
      club: 0,
      untracked: 0,
    };

    tracking.forEach((t) => {
      if (!t.college_committed) {
        divisions.untracked++;
      } else {
        const division = (t.college_committed_division || "").toLowerCase();
        if (division.includes("fbs") || division.includes("d1")) {
          divisions.p1++;
        } else if (division.includes("fcs") || division.includes("d2")) {
          divisions.p2++;
        } else if (division.includes("d3")) {
          divisions.p3++;
        } else if (division.includes("naia")) {
          divisions.naia++;
        } else if (division.includes("club")) {
          divisions.club++;
        }
      }
    });

    // Get school name
    const { data: school } = await supabase
      .from("schools")
      .select("name")
      .eq("id", schoolId)
      .single();

    return {
      schoolId,
      schoolName: school?.name || "Unknown School",
      totalPlayers: schoolPlayers.length,
      trackedToCollege: trackedCount,
      placementRate: trackedCount / schoolPlayers.length,
      divisionBreakdown: divisions,
    };
  } catch (error) {
    console.error("Error calculating college placement:", error);
    return null;
  }
}

// ============================================================================
// PRO PIPELINE
// ============================================================================

/**
 * Calculates pro athlete production score for a school
 *
 * Scores based on:
 * - Total pro athletes (all-time)
 * - Percentage of player base reaching pro
 * - Distribution across NFL/NBA/MLB
 * - Hall of Fame representation
 *
 * @param schoolId School ID
 * @returns Pro pipeline score (0-100), or null if unable to calculate
 */
export async function getProPipelineScore(
  schoolId: number
): Promise<ProPipelineScore | null> {
  try {
    const supabase = await createClient();

    // Get all players from this school
    const { data: schoolPlayers, error: playerError } = await supabase
      .from("players")
      .select("id,pro_team,pro_draft_info")
      .eq("primary_school_id", schoolId);

    if (playerError || !schoolPlayers) {
      console.error("Error fetching school players:", playerError);
      return null;
    }

    if (schoolPlayers.length === 0) {
      return null;
    }

    // Count pro athletes
    const proAthletes = schoolPlayers.filter((p) => p.pro_team).length;
    const nflCount = schoolPlayers.filter(
      (p) => p.pro_team && p.pro_team.toLowerCase().includes("nfl")
    ).length;
    const nbaCount = schoolPlayers.filter(
      (p) => p.pro_team && p.pro_team.toLowerCase().includes("nba")
    ).length;
    const mlbCount = schoolPlayers.filter(
      (p) => p.pro_team && p.pro_team.toLowerCase().includes("mlb")
    ).length;

    // Count Hall of Famers (placeholder - would need specific HOF table)
    // For now, assume Hall of Famers are tracked in awards
    const { data: hoFData } = await supabase
      .from("awards")
      .select("count", { count: "exact" })
      .eq("school_id", schoolId)
      .like("award_name", "%Hall of Fame%");

    const hallOfFamers = hoFData?.[0]?.count || 0;

    const proPercentage = proAthletes / schoolPlayers.length;

    // Calculate score (0-100)
    // Base: pro count (max 50 points for 50+ athletes)
    // Percentage: 0-30 points (100% would be max)
    // Elite positioning: 20 points bonus for strong NFL/NBA presence
    let score = 0;

    score += Math.min(proAthletes / 50 * 50, 50); // Up to 50 points for athlete count
    score += proPercentage * 30; // Up to 30 points for percentage
    if (nflCount >= 10 || nbaCount >= 5 || mlbCount >= 5) {
      score += 20; // Bonus for elite representation
    }

    // Determine tier
    let tier: "elite" | "national" | "regional" | "developing" | "minimal";
    if (score >= 80) {
      tier = "elite";
    } else if (score >= 60) {
      tier = "national";
    } else if (score >= 40) {
      tier = "regional";
    } else if (score >= 20) {
      tier = "developing";
    } else {
      tier = "minimal";
    }

    // Get school name
    const { data: school } = await supabase
      .from("schools")
      .select("name")
      .eq("id", schoolId)
      .single();

    return {
      schoolId,
      schoolName: school?.name || "Unknown School",
      proAthletes,
      proPercentage,
      nflCount,
      nbaCount,
      mlbCount,
      hallOfFamers,
      score: Math.min(score, 100),
      tier,
    };
  } catch (error) {
    console.error("Error calculating pro pipeline score:", error);
    return null;
  }
}

// ============================================================================
// ALL-CITY PREDICTION
// ============================================================================

/**
 * Predicts All-City probability based on player statistics
 *
 * Uses simplified logistic regression thresholds:
 * - Top 10% in key stat -> high probability
 * - Top 25% in key stat -> medium probability
 * - Top 50% in key stat -> low probability
 * - Below top 50% -> very low probability
 *
 * @param playerStats Object with player statistics
 * @param sport Sport identifier
 * @param seasonYear Year of the season
 * @param peers Array of peer player stats for percentile calculation (optional)
 * @returns All-City prediction with confidence and reasoning
 */
export function predictAllCityProbability(
  playerStats: Record<string, number | null | undefined>,
  sport: SportId,
  seasonYear: number,
  peers?: Record<string, number | null | undefined>[]
): AllCityPrediction | null {
  const playerName = (playerStats as any).name || "Unknown Player";
  const reasoning: string[] = [];
  let probabilityScore = 0;

  // Define thresholds by sport
  const thresholds: Record<
    SportId,
    { keyStats: string[]; thresholds: Record<string, number> }
  > = {
    football: {
      keyStats: ["rush_yards", "pass_yards", "total_yards", "total_td"],
      thresholds: {
        rush_yards: 1200,
        pass_yards: 2000,
        total_yards: 2000,
        total_td: 20,
      },
    },
    basketball: {
      keyStats: ["ppg", "points", "rebounds", "assists"],
      thresholds: {
        ppg: 18,
        points: 450,
        rebounds: 7,
        assists: 5,
      },
    },
    baseball: {
      keyStats: ["batting_avg", "home_runs", "rbi"],
      thresholds: {
        batting_avg: 0.350,
        home_runs: 12,
        rbi: 45,
      },
    },
    "track-field": {
      keyStats: ["wins", "places"],
      thresholds: {
        wins: 5,
        places: 10,
      },
    },
    lacrosse: {
      keyStats: ["goals", "assists"],
      thresholds: {
        goals: 35,
        assists: 15,
      },
    },
    wrestling: {
      keyStats: ["wins", "pins"],
      thresholds: {
        wins: 30,
        pins: 15,
      },
    },
    soccer: {
      keyStats: ["goals", "assists"],
      thresholds: {
        goals: 15,
        assists: 8,
      },
    },
  };

  const sportThresholds = thresholds[sport];

  // Check each key stat
  sportThresholds.keyStats.forEach((stat) => {
    const value = playerStats[stat];
    const threshold = sportThresholds.thresholds[stat];

    if (value === null || value === undefined) {
      return;
    }

    // Calculate percentile if peers provided
    if (peers && peers.length > 0) {
      const peerValues = peers
        .map((p) => p[stat])
        .filter((v): v is number => v !== null && v !== undefined);

      const percentile = calculatePercentileRank(value, peerValues);
      if (percentile) {
        if (percentile.percentile >= 90) {
          probabilityScore += 40;
          reasoning.push(`Top 10% in ${stat}`);
        } else if (percentile.percentile >= 75) {
          probabilityScore += 25;
          reasoning.push(`Top 25% in ${stat}`);
        } else if (percentile.percentile >= 50) {
          probabilityScore += 10;
          reasoning.push(`Top 50% in ${stat}`);
        }
      }
    } else {
      // Use absolute threshold if no peers
      if (value >= threshold * 1.2) {
        probabilityScore += 35;
        reasoning.push(`${stat} exceeds threshold by 20%+`);
      } else if (value >= threshold) {
        probabilityScore += 25;
        reasoning.push(`${stat} meets all-city threshold`);
      } else if (value >= threshold * 0.85) {
        probabilityScore += 10;
        reasoning.push(`${stat} approaches threshold`);
      }
    }
  });

  // Cap probability at 1.0
  const probability = Math.min(probabilityScore / 100, 1.0);

  // Determine confidence level
  let confidenceLevel: "high" | "medium" | "low";
  if (reasoning.length >= 3) {
    confidenceLevel = "high";
  } else if (reasoning.length >= 2) {
    confidenceLevel = "medium";
  } else {
    confidenceLevel = "low";
  }

  return {
    playerName,
    sport,
    allCityProbability: probability,
    confidenceLevel,
    reasoning: reasoning.length > 0 ? reasoning : ["Insufficient data"],
    comparison: {
      topPercentile: Math.round(Math.min(probability * 100, 100)),
      vs: "peers in same season",
    },
  };
}

// ============================================================================
// COMPARATIVE ANALYTICS
// ============================================================================

/**
 * Compares two players' performances, with era adjustment
 *
 * @param playerA First player data
 * @param playerB Second player data
 * @param sport Sport identifier
 * @param stat Statistic to compare
 * @returns Comparison result with raw and era-adjusted differences
 */
export function comparePlayersAcrossEras(
  playerA: {
    id: number;
    name: string;
    position?: string;
    value: number | null | undefined;
    seasonYear: number;
  },
  playerB: {
    id: number;
    name: string;
    position?: string;
    value: number | null | undefined;
    seasonYear: number;
  },
  sport: SportId,
  stat: string
): PlayerComparison | null {
  if (
    playerA.value === null ||
    playerA.value === undefined ||
    playerB.value === null ||
    playerB.value === undefined
  ) {
    return null;
  }

  const difference = playerA.value - playerB.value;
  const differencePercentage =
    (difference / playerB.value) * 100;

  // Era adjust if possible
  let eraAdjustedDifference: number | null = null;
  const zScoreA = adjustForEra(
    playerA.value,
    sport,
    stat,
    playerA.seasonYear
  );
  const zScoreB = adjustForEra(
    playerB.value,
    sport,
    stat,
    playerB.seasonYear
  );

  if (zScoreA !== null && zScoreB !== null) {
    eraAdjustedDifference = zScoreA - zScoreB;
  }

  return {
    playerA: {
      name: playerA.name,
      position: playerA.position,
      value: playerA.value,
    },
    playerB: {
      name: playerB.name,
      position: playerB.position,
      value: playerB.value,
    },
    moreImpressionId: difference >= 0 ? playerA.id : playerB.id,
    differenceAmount: Math.abs(difference),
    differencePercentage: Math.abs(differencePercentage),
    eraAdjustedDifference,
  };
}
