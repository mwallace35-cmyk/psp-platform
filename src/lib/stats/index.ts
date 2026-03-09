/**
 * Stats Module - Barrel Export
 *
 * Unified entry point for all statistical computation, confidence assessment,
 * era adjustment, and decision support tools.
 *
 * Usage:
 *   import { calculateYardsPerCarry, getStatReliability, adjustForEra } from '@/lib/stats'
 */

// ============================================================================
// Computed Metrics
// ============================================================================

export {
  // Football
  calculateYardsPerCarry,
  calculateYardsPerAttempt,
  calculatePasserEfficiency,
  calculateYardsPerReception,
  calculateTDToTurnoverRatio,
  calculateCompletionPercentage,
  calculateTDPercentage,
  // Basketball
  calculatePointsPerGame,
  calculateReboundsPerGame,
  calculateAssistsPerGame,
  calculateStealsPerGame,
  calculateBlocksPerGame,
  // Statistical Analysis
  calculateZScore,
  calculatePercentileRank,
  estimatePercentile,
  applyEraAdjustment,
  unadjustToEra,
  // Utilities
  formatRateStat,
  formatPercentage,
  formatNumber,
  calculateStdDev,
  calculateMean,
  type PercentileResult,
  type ZScoreResult,
} from './computed-metrics';

// ============================================================================
// Confidence & Uncertainty
// ============================================================================

export {
  getStatReliability,
  isSmallSample,
  getMinGamesThreshold,
  getConfidenceInterval,
  assessReliability,
  getConfidenceScore,
  getConfidenceIndicator,
  getConfidenceColorClass,
  getSmallSampleWarning,
  type ReliabilityLevel,
  type ConfidenceInterval,
  type ReliabilityAssessment,
} from './confidence';

// ============================================================================
// Era Adjustment
// ============================================================================

export {
  getEraDefinitions,
  getEraForYear,
  getEraForSeasonLabel,
  getEraContext,
  adjustForEra,
  formatWithEraContext,
  compareAcrossEras,
  getEraDescription,
  getSeasonsByEra,
  type Era,
  type EraContext,
  type EraAdjustedComparison,
} from './era-adjustment';

// ============================================================================
// Decision Support
// ============================================================================

export {
  getCollegePlacementRate,
  getProPipelineScore,
  predictAllCityProbability,
  comparePlayersAcrossEras,
  type CollegePlacementStats,
  type ProPipelineScore,
  type AllCityPrediction,
  type PlayerComparison,
} from './decision-support';
