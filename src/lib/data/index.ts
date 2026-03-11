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
  getCrossSportPlayers,
} from "./players";

// School functions
export {
  getSportOverview,
  getSchoolsBySport,
  getSchoolBySlug,
  getSchoolTeamSeasons,
  getSchoolChampionships,
} from "./schools";

// School hub functions
export {
  getSchoolHubData,
  getSchoolAllSportsStats,
  getSchoolNextLevel,
  getSchoolAllChampionships,
  getSchoolRecentSeasons,
  getSchoolArticles,
  type SchoolHubData,
  type SchoolSportStats,
  type NextLevelAthlete,
  type SchoolChampionshipData,
  type RecentSeasonData,
} from "./school-hub";

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
  getSchoolWinsLeaderboard,
  getSchoolChampionshipLeaderboard,
  getSchoolStatProduction,
  type StatCategory,
  type SchoolWinsRow,
  type SchoolChampionshipRow,
  type SchoolStatProductionRow,
  type CareerLeaderRow,
} from "./events";

// Game detail and box score functions
export {
  getGameById,
  getGameBoxScore,
  getGamesWithBoxScores,
  getPlayerGameLog,
  getPlayerTeamGames,
  type GamePlayerStat,
  type GameDetail,
  type PlayerGameLog,
  type TeamGame,
} from "./games";

// Pulse / community hub functions
export {
  getGotwNominees,
  getGotwWinners,
  getForumPosts,
  getForumPost,
  getForumReplies,
  getForumStats,
  getPowerRankings,
  getRecentTransfers,
  getPulseStats,
  type GotwNominee,
  type ForumPost,
  type ForumReply,
  type PowerRanking,
  type Transfer,
} from "./pulse";

// Season preview functions
export {
  isPreviewSeason,
  getReturningRoster,
  getReturningRosterFromRosters,
  getMatchupHistory,
  getLastSeasonRecap,
  getLeagueOutlook,
  getScheduleStrength,
  getNextLevelAlumni,
  type ReturningPlayer,
  type RosterReturningPlayer,
  type MatchupHistory,
  type SeasonRecap,
  type LeagueStanding,
  type ScheduleStrength,
  type NextLevelAlumnus,
} from "./preview";

// Awards and All-City functions
export {
  getAllCityByYear,
  getAllCitySummary,
  type AwardRecord,
  type AllCityYear,
} from "./awards";
