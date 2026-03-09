/**
 * PhillySportsPack.com — Expert Schema v2 TypeScript Types
 * File: schema-v2-types.ts
 *
 * Complete TypeScript interfaces for all new/modified tables and materialized views
 * from the 20260308_expert_schema_v2 migration.
 *
 * Usage:
 *   import type { Roster, Era, TeamRating, StatCorrection, EraAdjustedLeader, SchoolPipelineStat } from '@/lib/data/schema-v2-types'
 */

// ============================================================================
// TYPE DEFINITIONS FOR NEW TABLES
// ============================================================================

/**
 * Roster
 * Team membership independent of statistics.
 * Captures bench players, JV squad, injured reserves, etc.
 */
export interface Roster {
  id: number;
  teamSeasonId: number;
  playerId: number;
  seasonId: number;
  schoolId: number;
  sportId: string;
  jerseyNumber?: number | null;
  position?: string | null;
  classYear?: string | null; // 'freshman' | 'sophomore' | 'junior' | 'senior'
  isStarter: boolean;
  gamesOnRoster?: number | null;
  gamesPlayed: number;
  status: 'active' | 'redshirt' | 'injured' | 'transferred' | 'graduated';
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Era
 * Historical era definitions with stat availability metadata.
 * Enables era-adjusted comparisons and era-specific leaderboards.
 */
export interface Era {
  id: string; // e.g., 'football:1900s', 'basketball:1970s-1980s'
  sportId: string;
  eraName: string; // e.g., 'Early Era', 'Modern Era', '3-Point Era'
  yearStart: number;
  yearEnd: number;
  description?: string | null;
  // Stat availability flags
  hasRushStats: boolean;
  hasPassStats: boolean;
  hasRecStats: boolean;
  hasDefStats: boolean;
  hasAdvancedStats: boolean;
  // Era characteristics for adjustment
  avgScoring?: number | null; // average points/game
  avgYardsPerGame?: number | null;
  ruleChanges?: string[] | null; // Array of rule change descriptions
  notes?: string | null;
  createdAt: Date;
}

/**
 * TeamRating
 * Team strength ratings over time (Elo, power ratings, etc.)
 * Useful for historical context and strength-of-schedule analysis.
 */
export interface TeamRating {
  id: number;
  teamSeasonId: number;
  seasonId: number;
  schoolId: number;
  sportId: string;
  // Rating systems
  eloRating?: number | null; // 1500 = average
  powerRating?: number | null; // points above average
  strengthOfSchedule?: number | null;
  conferenceRating?: number | null;
  // Metadata
  ratingMethod: string; // 'elo' | 'power_rating' | 'jeff_sagarin'
  calculatedAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
}

/**
 * StatQuality
 * Enum for stat source quality/confidence levels.
 */
export type StatQuality = 'official' | 'maxpreps' | 'newspaper' | 'estimated' | 'derived';

/**
 * StatCorrection
 * Post-hoc corrections applied to stats with reasoning.
 * Enables transparent audit trail and prevents double-corrections.
 */
export interface StatCorrection {
  id: number;
  entityType: string; // 'player_season' | 'game_stat' | 'team_season'
  entityTable: string; // e.g., 'football_player_seasons', 'basketball_game_stats'
  entityId: number; // record ID in the entity table
  statField: string; // column name (e.g., 'pass_yards')
  oldValue?: string | null;
  newValue?: string | null;
  correctionReason: string; // 'duplicate_removed' | 'data_entry_error' | 'source_correction' | 'calculation_error'
  severity: 'critical' | 'major' | 'minor';
  sourceCitation?: string | null; // where the correction came from
  appliedBy?: string | null; // UUID of Supabase auth user
  reversalOfId?: number | null; // if this correction reverses a previous one
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ENHANCED TYPES FOR MODIFIED TABLES
// ============================================================================

/**
 * BasketballPlayerSeasonEnhanced
 * Extended version with new efficiency columns and stat_quality.
 * Enables computation of: eFG%, TS%, usage rate, PER, and other modern metrics.
 */
export interface BasketballPlayerSeasonEnhanced {
  // Original fields
  id: number;
  playerId: number;
  seasonId: number;
  schoolId: number;
  gamesPlayed?: number | null;
  points: number;
  ppg?: number | null;
  rebounds: number;
  rpg?: number | null;
  offRebounds?: number | null;
  defRebounds?: number | null;
  assists: number;
  apg?: number | null;
  turnovers?: number | null;
  steals: number;
  blocks: number;
  fgm?: number | null;
  fga?: number | null;
  fgPct?: number | null;
  ftm?: number | null;
  fta?: number | null;
  ftPct?: number | null;
  threePm?: number | null;
  threePa?: number | null;
  threePct?: number | null;
  honorLevel?: string | null;
  sourceFile?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // New fields from v2 migration
  statQuality: StatQuality;
  minutes?: number | null;
  offensiveRebounds?: number | null;
  defensiveRebounds?: number | null;
  totalRebounds?: number | null;
  fgaComputed?: number | null; // Computed if only fg% available
  fgmComputed?: number | null;
}

/**
 * FootballPlayerSeasonEnhanced
 * Extended with stat_quality for tracking data confidence.
 */
export interface FootballPlayerSeasonEnhanced {
  id: number;
  playerId: number;
  seasonId: number;
  schoolId: number;
  gamesPlayed?: number | null;
  // Rushing
  rushCarries: number;
  rushYards: number;
  rushYpc?: number | null;
  rushTd: number;
  rushLong?: number | null;
  // Passing
  passComp: number;
  passAtt: number;
  passYards: number;
  passTd: number;
  passInt: number;
  passCompPct?: number | null;
  passRating?: number | null;
  // Receiving
  receptions: number;
  recYards: number;
  recYpr?: number | null;
  recTd: number;
  recLong?: number | null;
  // Totals
  totalTd: number;
  totalYards: number;
  points: number;
  tackles?: number | null;
  sacks?: number | null;
  interceptions?: number | null;
  kickRetYards?: number | null;
  puntRetYards?: number | null;
  sourceFile?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // New field from v2 migration
  statQuality: StatQuality;
}

/**
 * AwardEnhanced
 * Extended with stat_snapshot linking awards to statistical basis.
 */
export interface AwardEnhanced {
  id: number;
  playerId?: number | null;
  coachId?: number | null;
  schoolId?: number | null;
  seasonId?: number | null;
  sportId?: string | null;
  awardType: string; // 'all-city' | 'all-state' | 'all-american' | 'mvp' | etc.
  awardName?: string | null;
  category?: string | null; // 'first-team' | 'second-team' | 'honorable-mention'
  position?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  regionId: string;
  createdAt: Date;
  updatedAt: Date;
  // New fields from v2 migration
  statSnapshot?: AwardStatSnapshot | null; // {"stat_category": "rushing_yards", "stat_value": 2034, "rank": 1}
  awardTierNumeric?: number | null; // 1-indexed: 1=first team, 2=second, etc.
  eligibilityCriteria?: string | null;
}

/**
 * AwardStatSnapshot
 * JSONB structure linking an award to its statistical basis.
 */
export interface AwardStatSnapshot {
  statCategory?: string; // e.g., 'rushing_yards', 'ppg', 'era_adjusted_rushing'
  statValue?: number | string;
  rank?: number; // Rank in that stat category
  era?: string; // Era reference (e.g., '2020s')
  league?: string; // League reference (e.g., 'catholic-league')
  [key: string]: any;
}

/**
 * RecordEnhanced
 * Extended with opponent_id, game_context, and era_id.
 */
export interface RecordEnhanced {
  id: number;
  sportId: string;
  category: string;
  subcategory?: string | null;
  scope: string; // 'city' | 'league' | 'school' | 'state'
  recordValue: string;
  recordNumber?: number | null;
  playerId?: number | null;
  schoolId?: number | null;
  seasonId?: number | null;
  gameId?: number | null;
  holderName?: string | null;
  holderSchool?: string | null;
  yearSet?: number | null;
  description?: string | null;
  verified: boolean;
  sourceUrl?: string | null;
  regionId: string;
  createdAt: Date;
  updatedAt: Date;
  // New fields from v2 migration
  opponentId?: number | null;
  gameContext?: string | null; // 'playoff_championship' | 'regular_season' | 'conference_game'
  eraId?: string | null;
}

// ============================================================================
// MATERIALIZED VIEW TYPES
// ============================================================================

/**
 * EraAdjustedLeader
 * Z-score normalized stats within sport-era-league context.
 * Allows fair comparison across eras with different scoring norms.
 */
export interface EraAdjustedLeader {
  sportId: string;
  playerId: number;
  playerName: string;
  playerSlug: string;
  schoolId: number;
  schoolName: string;
  seasonId: number;
  yearStart: number;
  eraId: string;
  // Football-specific fields
  rushYards?: number | null;
  totalTd?: number | null;
  rushYardsZscore?: number | null;
  totalTdZscore?: number | null;
  // Basketball-specific fields
  points?: number | null;
  rebounds?: number | null;
  assists?: number | null;
  ppg?: number | null;
  ppgZscore?: number | null;
  reboundsZscore?: number | null;
  // Unified field for primary zscore
  primaryZscore?: number | null;
}

/**
 * SchoolPipelineStat
 * College/Pro placement rates and trends per school.
 */
export interface SchoolPipelineStat {
  schoolId: number;
  schoolName: string;
  schoolSlug: string;
  sportId: string;
  collegePlayers: number;
  proPlayers: number;
  totalPlayers: number;
  collegePlacementPct?: number | null; // Percentage (0-100)
  proPlacementPct?: number | null; // Percentage (0-100)
  collegeToProCount: number;
  lastGraduateYear?: number | null;
}

// ============================================================================
// AGGREGATE TYPES FOR COMMON QUERIES
// ============================================================================

/**
 * RosterWithDetails
 * Roster joined with player and team season info.
 */
export interface RosterWithDetails extends Roster {
  player?: {
    id: number;
    name: string;
    slug: string;
    photoUrl?: string | null;
  };
  school?: {
    id: number;
    name: string;
    slug: string;
  };
  season?: {
    id: number;
    label: string;
  };
}

/**
 * TeamSeasonWithRatings
 * Team season with associated Elo/power ratings.
 */
export interface TeamSeasonWithRatings {
  teamSeasonId: number;
  schoolName: string;
  sportId: string;
  seasonId: number;
  wins: number;
  losses: number;
  ties: number;
  winPct?: number | null;
  ratings: TeamRating[];
}

/**
 * PlayerStatsWithCorrections
 * Union type for any player stat with associated corrections.
 */
export type PlayerStatsWithCorrections =
  | (FootballPlayerSeasonEnhanced & { corrections: StatCorrection[] })
  | (BasketballPlayerSeasonEnhanced & { corrections: StatCorrection[] });

/**
 * AwardWithStatContext
 * Award with full stat context and player details.
 */
export interface AwardWithStatContext extends AwardEnhanced {
  playerName?: string;
  playerSlug?: string;
  schoolName?: string;
  seasonLabel?: string;
  statSnapshot?: AwardStatSnapshot;
  computedMetrics?: {
    efficiencyRating?: number;
    eraAdjustedZscore?: number;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * CorrectionReason
 * Enum-like type for stat correction reasons.
 */
export type CorrectionReason =
  | 'duplicate_removed'
  | 'data_entry_error'
  | 'source_correction'
  | 'calculation_error';

/**
 * RosterStatus
 * Enum-like type for roster member status.
 */
export type RosterStatus = 'active' | 'redshirt' | 'injured' | 'transferred' | 'graduated';

/**
 * ClassYear
 * Enum-like type for student class year.
 */
export type ClassYear = 'freshman' | 'sophomore' | 'junior' | 'senior';

/**
 * GameContext
 * Enum-like type for record game context.
 */
export type GameContext = 'playoff_championship' | 'regular_season' | 'conference_game';

/**
 * RatingMethod
 * Enum-like type for team rating calculation method.
 */
export type RatingMethod = 'elo' | 'power_rating' | 'jeff_sagarin';

// ============================================================================
// BATCH OPERATION TYPES
// ============================================================================

/**
 * BulkRosterUpdate
 * For batch roster operations (e.g., importing entire team rosters).
 */
export interface BulkRosterUpdate {
  teamSeasonId: number;
  rosters: Omit<Roster, 'id' | 'createdAt' | 'updatedAt'>[];
}

/**
 * BulkCorrectionApplication
 * For batch stat corrections (e.g., applying source corrections across season).
 */
export interface BulkCorrectionApplication {
  corrections: Omit<StatCorrection, 'id' | 'createdAt' | 'updatedAt'>[];
  appliedBy: string; // UUID
  changeReason?: string;
}

/**
 * EraAdjustmentResult
 * Result of era-adjusted stat calculations.
 */
export interface EraAdjustmentResult {
  playerId: number;
  playerName: string;
  originalStat: number;
  eraAdjustedZscore: number;
  eraMean: number;
  eraStdDev: number;
  percentileRank: number;
}

// All types are exported individually via named `export interface/type` above.
