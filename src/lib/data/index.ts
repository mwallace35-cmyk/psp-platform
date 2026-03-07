/**
 * Barrel export for data layer - consolidates all data functions and types
 * This allows existing imports from @/lib/data to work unchanged
 */

// Common types and utilities
export type {
  Season,
  School,
  Player,
  FootballPlayerSeason,
  BasketballPlayerSeason,
  BaseballPlayerSeason,
  TeamSeason,
  Award,
  SchoolRecord,
  Game,
  RosterPlayer,
  Championship,
  SearchResult,
  PlayerSearchResult,
  TeamSeasonWithRelations,
  LeaderboardEntry,
} from "./common";

export {
  sanitizePostgREST,
  VALID_SPORTS,
  SPORT_META,
  isValidSport,
  createClient,
  withErrorHandling,
  withRetry,
} from "./common";

// Player functions
export {
  getPlayerBySlug,
  getFootballPlayerStats,
  getBasketballPlayerStats,
  getBaseballPlayerStats,
  getPlayerAwards,
  getPlayerStats,
} from "./players";

// School functions
export {
  getSportOverview,
  getSchoolsBySport,
  getSchoolBySlug,
  getSchoolTeamSeasons,
  getSchoolChampionships,
} from "./schools";

// Team and championship functions
export {
  getRecentChampions,
  getChampionshipsBySport,
  getRecordsBySport,
  getTeamSeason,
  getGamesByTeamSeason,
  getTeamRosterBySeason,
  getAvailableTeamSeasons,
  getRecentGamesBySport,
} from "./teams";

// Article functions
export {
  getFeaturedArticles,
  getArticleBySlug,
  getArticlesForEntity,
} from "./articles";

// Events, coaching, alumni, recruiting, leaderboard, and search functions
export {
  searchAll,
  getAllCoaches,
  getCoachesBySport,
  getCoachCount,
  getTrackedAlumni,
  getSocialPosts,
  getFeaturedAlumni,
  getAlumniCounts,
  getRecruits,
  getRecruitsByClass,
  getRecentCommitments,
  getTeamsWithRecords,
  getLeaderboard,
  getFootballCareerLeaders,
  getBasketballCareerLeaders,
  getSeasonLeaderboard,
  getDataFreshness,
  getFootballLeaders,
  getBasketballLeaders,
  type StatCategory,
} from "./events";
