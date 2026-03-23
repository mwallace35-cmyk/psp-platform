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
  getSchoolNotablePlayers,
  type NotablePlayer,
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
  getChampionshipGamesWithBoxScores,
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
  getSchoolTeamStats,
  getDiscontinuedSchools,
  type DiscontinuedSchool,
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
  getTeamSeasonStats,
  getGamesWithBoxScores,
  getPlayerGameLog,
  getPlayerTeamGames,
  getHeadToHead,
  type GamePlayerStat,
  type GameDetail,
  type TeamSeasonStats,
  type TeamSeasonPlayer,
  type PlayerGameLog,
  type TeamGame,
  type HeadToHeadResult,
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

// Team page functions
export {
  getTeamHistory,
  getNextGame,
  getTeamArticles,
  getRelatedTeams,
  type TeamHistory,
  type NextGame,
  type LeagueStandingsRow,
  type TeamArticle,
} from "./team-page";

// Awards and All-City functions
export {
  getAllCityByYear,
  getAllCitySummary,
  getAwardsPageData,
  normalizeAwardType,
  AWARD_TAB_CATEGORIES,
  type AwardRecord,
  type AllCityYear,
  type AwardsPageData,
  type AwardTabCategory,
} from "./awards";

// Awards hub functions
export {
  getAwardsSummary,
  getRecentAwards,
  getTopAwardedSchools,
  getAwardsByType,
  getChampionshipsSummary,
  getRecentChampionships,
  getDynastyTracker,
  getAwardsCountBySport,
  getProAthletesCount,
  type AwardDetail,
  type AwardsSummary,
  type ChampionshipHubRecord,
} from "./awards-hub";

// Next Level / Pro Athletes functions
export {
  getProAthletes,
  getProAthleteBySlug,
  getProAthletesBySchool,
  getProAthletesByLeague,
  getFeaturedProAthletes,
  getCollegePlacements,
  getProAthleteStats,
  getNextLevelPipeline,
  getPipelineStats,
  type ProAthlete,
  type ProAthleteDetail,
  type CollegePlacement,
} from "./next-level";

// Dynasties functions
export {
  getDynastyRankings,
  getDynastyTimeline,
  getChampionshipStreaks,
  type DynastyRanking,
  type ChampionshipYear,
} from "./dynasties";

// Dynasty Tracker functions
export {
  getDynastyTrackerData,
  getDynastyLeaders,
  getAvailableDecades,
  type DynastyDecadeData,
  type DynastyLeader,
} from "./dynasty-tracker";

// Greatest Seasons functions
export {
  getGreatestFootballSeasons,
  getGreatestBasketballSeasons,
  getGreatestBaseballSeasons,
  getGreatestSeasonCategories,
  type GreatestSeason,
} from "./greatest-seasons";

// Position Leaders functions
export {
  getFootballPositionLeaders,
  getBasketballPositionLeaders,
  getPositionsForSport,
  getPositionDisplayName,
  type PositionLeader,
} from "./position-leaders";

// Rivalries functions
export {
  getTopRivalries,
  getRivalryDetail,
  getRivalryGames,
  type RivalryRecord,
  type RivalryGame,
} from "./rivalries";

// Standings functions
export {
  getLeagueStandings,
  getAvailableStandingsSeasons,
  type Standing,
  type LeagueStandings,
} from "./standings";

// Rosters functions
export {
  getTeamRoster,
  getRosterSeasons,
  getRosterCount,
  groupRosterByPosition,
  type RosterEntry,
  type RosterSeason,
} from "./rosters";

// Records and Trending functions
export {
  getFilteredRecords,
  getRecordCategories,
  getRecordStats,
  getRecordCount,
  type RecordWithDetails,
  type RecordStats,
  type RecordFilter,
} from "./records";

export * from "./computed-records";

export {
  getTrendingStats,
  getRandomTrendingStat,
  type TrendingStat,
} from "./trending";

// Eras (statistical trends by decade)
export {
  getStatByEra,
  getStatTypes,
  getEraSummary,
  type EraStatistic,
  type EraStatType,
} from "./eras";

// Breakout alerts (year-over-year stat jumps)
export {
  getBreakoutPlayers,
  getSchoolBreakouts,
  type BreakoutAlert,
} from "./breakouts";

// Pro players functions
export {
  getProPlayers,
  getProPlayersBySchool,
  getProPipeline,
  getProPlayerDetail,
  parseProLeague,
  type ProPlayer,
  type ProPipelineSchool,
} from "./pro-players";

// Similar players functions
export {
  getSimilarPlayers,
  getSimilarFootballPlayers,
  getSimilarBasketballPlayers,
  getSimilarBaseballPlayers,
  type SimilarPlayer,
} from "./similar-players";

// Social feed functions
export {
  getSocialFeedPosts,
  getAllSocialPosts as getAllSocialFeedPosts,
  extractTweetId,
  getSocialHandles,
  getAllSocialHandles,
  type SocialPost,
  type SocialHandle,
} from "./social";

// Coaching staff functions
export {
  getCoachingStaff,
  getCoachingStaffBySchool,
  getCurrentHeadCoach,
  getCoachingHistory,
  getCoachingRecord,
  getCoachRecord,
  type CoachingStaffMember,
  type CoachingRecordStint,
  type CoachingRecordResult,
} from "./coaching";

// Player claims functions
export {
  getPlayerClaims,
  getPendingClaims,
  getClaimById,
  type PlayerClaim,
} from "./claims";

// Player highlights functions
export {
  getPlayerHighlights,
  getFeaturedHighlight,
  getGameHighlights,
  type PlayerHighlight,
} from "./highlights";

// Pick'em (pick-the-game) functions
export {
  getCurrentPickemWeek,
  getPickemGames,
  getUserPicks,
  getPickemLeaderboard,
  getPickemHistory,
  type PickemWeek,
  type PickemGame,
  type PickemPick,
  type PickemLeaderboardEntry,
} from "./pickem";

// School Admin Portal functions
export {
  getSchoolAdminAccess,
  isSchoolAdmin,
  getSchoolAnalytics,
  requestSchoolAccess,
  getPendingAccessRequests,
  respondToAccessRequest,
  type SchoolAdminAccess,
  type SchoolAnalytics,
  type AccessRequest,
} from "./school-admin";

// Widget system functions
export {
  getWidgetConfig,
  getWidgetsBySchool,
  getAllWidgets,
  createWidget,
  updateWidget,
  deleteWidget,
  incrementWidgetViews,
  getWidgetData,
  type WidgetConfig,
  type WidgetData,
} from "./widgets";

// Sponsor management functions
export {
  getActiveSponsor,
  getAllSponsors,
  getSponsorById,
  getSponsorPlacements,
  getSponsorStats,
  createSponsor,
  updateSponsor,
  createPlacement,
  updatePlacement,
  recordImpression,
  recordClick,
  type Sponsor,
  type SponsorPlacement,
  type SponsorStats,
} from "./sponsors";

// Annual Awards functions
export {
  getActiveAwards,
  getAwardById,
  getAwardResults,
  getPastWinners,
  createAnnualAward,
  updateAnnualAward,
  castAwardVote,
  hasUserVoted,
  getAwardVoteCounts,
  type AnnualAward,
  type AnnualAwardNominee,
  type AwardResult,
} from "./annual-awards";

// Live scores functions
export {
  getLiveScores,
  getGameLiveScore,
  getRecentFinalScores,
  getTodaysGames,
  getGameDaySchedule,
  type LiveScore,
  type GameDaySchedule,
} from "./live-scores";

// Power index functions
export {
  getPowerIndexRankings,
  getSchoolPowerIndex,
  getPowerIndexHistory,
  getTopMovers,
  type PowerIndexEntry,
  type PowerIndexWithHistory,
} from "./power-index";

// Stat milestones functions
export {
  getUpcomingMilestones,
  getRecentMilestones,
  getPlayerMilestones,
  getMilestoneAlerts,
  type StatMilestone,
} from "./milestones";

// Playoff bracket functions
export {
  getPlayoffBrackets,
  getPlayoffBracketById,
  getPlayoffBracketTypes,
  type PlayoffBracket,
  type PlayoffBracketGame,
  type PlayoffBracketWithGames,
} from "./playoffs";
