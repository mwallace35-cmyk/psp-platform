/**
 * PSP Visualization Components — Type Definitions
 * Central location for all interfaces and types used across viz components
 */

// ============================================================================
// CareerTrajectoryChart
// ============================================================================

export interface SeasonData {
  year: string;
  value: number;
  label?: string;
  isChampionship?: boolean;
}

export interface LeagueAvgData {
  year: string;
  value: number;
}

export interface CareerTrajectoryChartProps {
  seasons: SeasonData[];
  stat: string;
  sport: string;
  leagueAvg?: LeagueAvgData[];
  maxValue?: number;
  height?: number;
  hideAverage?: boolean;
}

// ============================================================================
// DynastyTimeline
// ============================================================================

export interface SeasonRecord {
  year: number;
  wins: number;
  losses: number;
  championships?: string[];
  coach?: string;
}

export interface DynastyTimelineProps {
  schoolName: string;
  seasons: SeasonRecord[];
  sport: string;
}

export interface EraInfo {
  coach?: string;
  startYear: number;
  endYear: number;
  seasons: SeasonRecord[];
}

// ============================================================================
// EraComparisonTool
// ============================================================================

export interface PlayerData {
  name: string;
  stats: Record<string, number>;
  era: string;
  seasonYear: number;
}

export interface EraComparisonToolProps {
  players: PlayerData[];
  sport: string;
  maxPlayers?: number;
}

export interface EraStatistics {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
}

// ============================================================================
// SmallMultiples
// ============================================================================

export interface SmallMultiplesItem {
  name: string;
  slug: string;
  data: number[];
}

export interface SmallMultiplesProps {
  items: SmallMultiplesItem[];
  sport: string;
  statName: string;
  columns?: number;
  onItemClick?: (slug: string) => void;
}

export interface ItemStatistics {
  min: number;
  max: number;
  avg: number;
}

// ============================================================================
// StatHeatmap
// ============================================================================

export interface ColumnDefinition {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: Record<string, any>) => React.ReactNode;
  hideOnMobile?: boolean;
  primary?: boolean;
}

export interface StatHeatmapProps {
  data: Record<string, any>[];
  columns: ColumnDefinition[];
  colorScale?: 'green-red' | 'blue-gold';
  highlightTop3?: boolean;
  minSampleSize?: number;
}

export interface ColumnStatistics {
  values: number[];
  min: number;
  max: number;
  mean: number;
}

// ============================================================================
// PipelineSankey
// ============================================================================

export interface FlowData {
  from: string;
  to: string;
  count: number;
  names?: string[];
}

export interface PipelineSankeyProps {
  flows: FlowData[];
  title?: string;
  subtitle?: string;
}

export interface NodeInfo {
  name: string;
  level: 0 | 1 | 2; // HS, College, Pro
  x: number;
  y: number;
  totalFlow: number;
  displayName: string;
}

export interface FlowPath {
  from: string;
  to: string;
  d: string;
  width: number;
  opacity: number;
  count: number;
}

export interface Position {
  x: number;
  y: number;
}

// ============================================================================
// Shared Types
// ============================================================================

export type Sport = 'football' | 'basketball' | 'baseball' | 'track' | 'lacrosse' | 'wrestling' | 'soccer';

export type ColorScale = 'green-red' | 'blue-gold';

export interface SportColorMap {
  [key: string]: string;
}

export interface GlobalStats {
  min: number;
  max: number;
}

export interface HoverState {
  [key: string]: string | number | null;
}

// ============================================================================
// Utility Types
// ============================================================================

export type RowData = Record<string, any>;

export interface ResponsiveConfig {
  mobileBreakpoint: number;
  tabletBreakpoint: number;
  desktopBreakpoint: number;
}

export interface PaddingConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SVGChartConfig {
  width: number;
  height: number;
  padding: PaddingConfig;
  viewBox: string;
}

// ============================================================================
// Data Transformation Utilities
// ============================================================================

/**
 * Compute percentile rank of a value within an array
 */
export function computePercentile(value: number, values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.filter(v => v <= value).length;
  return (count / sorted.length) * 100;
}

/**
 * Normalize value using z-score
 */
export function normalizeZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

/**
 * Scale normalized value to 0-100 range
 */
export function scaleNormalizedValue(normalizedValue: number, minStdDev = -3, maxStdDev = 3): number {
  const range = maxStdDev - minStdDev;
  return Math.max(0, Math.min(100, ((normalizedValue - minStdDev) / range) * 100));
}

/**
 * Compute win percentage
 */
export function computeWinPercentage(wins: number, losses: number): number {
  const total = wins + losses;
  return total > 0 ? wins / total : 0;
}

/**
 * Get color from win percentage gradient
 */
export function getWinPercentageColor(winPct: number): string {
  if (winPct <= 0.3) return '#ef4444'; // red-500
  if (winPct <= 0.5) return '#f97316'; // orange-500
  if (winPct <= 0.7) return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
}

/**
 * Format season label (e.g., "2023-24")
 */
export function formatSeasonLabel(year: number | string): string {
  const y = typeof year === 'string' ? parseInt(year) : year;
  if (y >= 2000 && y <= 2100) {
    return `${y}-${String(y + 1).slice(-2)}`;
  }
  return String(year);
}

/**
 * Validate sport type
 */
export const VALID_SPORTS: Sport[] = ['football', 'basketball', 'baseball', 'track', 'lacrosse', 'wrestling', 'soccer'];

export function isValidSport(sport: string): sport is Sport {
  return VALID_SPORTS.includes(sport as Sport);
}

/**
 * Get sport color
 */
export const SPORT_COLOR_MAP: SportColorMap = {
  football: '#16a34a',
  basketball: '#ea580c',
  baseball: '#dc2626',
  track: '#7c3aed',
  lacrosse: '#0891b2',
  wrestling: '#ca8a04',
  soccer: '#059669',
};

export function getSportColor(sport: string): string {
  return SPORT_COLOR_MAP[sport.toLowerCase()] || '#f0a500'; // Default to gold
}

/**
 * Responsive utility
 */
export const RESPONSIVE_CONFIG: ResponsiveConfig = {
  mobileBreakpoint: 640,
  tabletBreakpoint: 1024,
  desktopBreakpoint: 1280,
};

export function getResponsiveColumns(windowWidth: number, defaultCols: number): number {
  if (windowWidth < RESPONSIVE_CONFIG.mobileBreakpoint) return 1;
  if (windowWidth < RESPONSIVE_CONFIG.tabletBreakpoint) return 2;
  return defaultCols;
}

