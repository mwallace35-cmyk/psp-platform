/**
 * PhillySportsPack.com — Drizzle ORM Schema
 * Matches schema.sql exactly
 */

import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  boolean,
  numeric,
  timestamp,
  jsonb,
  date,
  bigserial,
  uniqueIndex,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ============================================================================
// SHARED ENTITY TABLES
// ============================================================================

export const regions = pgTable("regions", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull().default("PA"),
  metroArea: varchar("metro_area", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const sports = pgTable("sports", {
  id: varchar("id", { length: 30 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  sortOrder: integer("sort_order").default(0),
  statSchema: jsonb("stat_schema"),
  isMajor: boolean("is_major").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  shortName: varchar("short_name", { length: 30 }),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  level: varchar("level", { length: 20 }).default("high_school"),
  foundedYear: integer("founded_year"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  yearStart: integer("year_start").notNull(),
  yearEnd: integer("year_end").notNull(),
  label: varchar("label", { length: 20 }).notNull(),
}, (table) => ({
  uniqueYears: unique().on(table.yearStart, table.yearEnd),
}));

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  shortName: varchar("short_name", { length: 50 }),
  city: varchar("city", { length: 50 }).default("Philadelphia"),
  state: varchar("state", { length: 2 }).default("PA"),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  leagueId: integer("league_id").references(() => leagues.id),
  foundedYear: integer("founded_year"),
  closedYear: integer("closed_year"),
  logoUrl: varchar("logo_url", { length: 500 }),
  mascot: varchar("mascot", { length: 100 }),
  colors: jsonb("colors"),
  address: text("address"),
  websiteUrl: varchar("website_url", { length: 500 }),
  principal: text("principal"),
  athleticDirector: text("athletic_director"),
  athleticDirectorEmail: text("athletic_director_email"),
  phone: text("phone"),
  enrollment: integer("enrollment"),
  schoolType: text("school_type"),
  aliases: text("aliases").array(),
  v4Id: varchar("v4_id", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_schools_slug").on(table.slug),
  leagueIdx: index("idx_schools_league").on(table.leagueId),
}));

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 150 }).unique().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  firstName: varchar("first_name", { length: 75 }),
  lastName: varchar("last_name", { length: 75 }),
  primarySchoolId: integer("primary_school_id").references(() => schools.id),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  graduationYear: integer("graduation_year"),
  positions: text("positions").array(),
  height: varchar("height", { length: 10 }),
  weight: integer("weight"),
  bio: text("bio"),
  photoUrl: varchar("photo_url", { length: 500 }),
  college: varchar("college", { length: 150 }),
  collegeSport: varchar("college_sport", { length: 30 }),
  proTeam: varchar("pro_team", { length: 150 }),
  proDraftInfo: varchar("pro_draft_info", { length: 200 }),
  isMultiSport: boolean("is_multi_sport").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_players_slug").on(table.slug),
  schoolIdx: index("idx_players_school").on(table.primarySchoolId),
  gradYearIdx: index("idx_players_grad_year").on(table.graduationYear),
}));

export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 150 }).unique().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  bio: text("bio"),
  photoUrl: varchar("photo_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const coachingStints = pgTable("coaching_stints", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  sportId: varchar("sport_id", { length: 30 }).notNull().references(() => sports.id),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  role: varchar("role", { length: 50 }).default("head_coach"),
  recordWins: integer("record_wins").default(0),
  recordLosses: integer("record_losses").default(0),
  recordTies: integer("record_ties").default(0),
  championships: integer("championships").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const transfers = pgTable("transfers", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => players.id),
  fromSchoolId: integer("from_school_id").references(() => schools.id),
  toSchoolId: integer("to_school_id").references(() => schools.id),
  transferYear: integer("transfer_year").notNull(),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  reason: varchar("reason", { length: 200 }),
  verified: boolean("verified").default(false),
  sourceUrl: varchar("source_url", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  sportId: varchar("sport_id", { length: 30 }).notNull().references(() => sports.id),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  homeSchoolId: integer("home_school_id").references(() => schools.id),
  awaySchoolId: integer("away_school_id").references(() => schools.id),
  gameDate: date("game_date"),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  periodScores: jsonb("period_scores"),
  leagueId: integer("league_id").references(() => leagues.id),
  venue: varchar("venue", { length: 200 }),
  gameType: varchar("game_type", { length: 30 }).default("regular"),
  playoffRound: varchar("playoff_round", { length: 50 }),
  notes: text("notes"),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  dataSource: varchar("data_source", { length: 50 }),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const teamSeasons = pgTable("team_seasons", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  sportId: varchar("sport_id", { length: 30 }).notNull().references(() => sports.id),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  ties: integer("ties").default(0),
  winPct: numeric("win_pct", { precision: 5, scale: 3 }),
  leagueWins: integer("league_wins"),
  leagueLosses: integer("league_losses"),
  leagueTies: integer("league_ties"),
  pointsFor: integer("points_for"),
  pointsAgainst: integer("points_against"),
  leagueFinish: varchar("league_finish", { length: 50 }),
  playoffResult: varchar("playoff_result", { length: 100 }),
  coachId: integer("coach_id").references(() => coaches.id),
  ranking: integer("ranking"),
  notes: text("notes"),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueTeamSeason: unique().on(table.schoolId, table.seasonId, table.sportId),
}));

export const championships = pgTable("championships", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  sportId: varchar("sport_id", { length: 30 }).notNull().references(() => sports.id),
  leagueId: integer("league_id").references(() => leagues.id),
  level: varchar("level", { length: 50 }).notNull(),
  result: varchar("result", { length: 50 }).default("champion"),
  opponentId: integer("opponent_id").references(() => schools.id),
  score: varchar("score", { length: 50 }),
  venue: varchar("venue", { length: 200 }),
  notes: text("notes"),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  coachId: integer("coach_id").references(() => coaches.id),
  schoolId: integer("school_id").references(() => schools.id),
  seasonId: integer("season_id").references(() => seasons.id),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  awardType: varchar("award_type", { length: 80 }).notNull(),
  awardName: varchar("award_name", { length: 200 }),
  category: varchar("category", { length: 80 }),
  position: varchar("position", { length: 30 }),
  source: varchar("source", { length: 200 }),
  sourceUrl: varchar("source_url", { length: 500 }),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const records = pgTable("records", {
  id: serial("id").primaryKey(),
  sportId: varchar("sport_id", { length: 30 }).notNull().references(() => sports.id),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  scope: varchar("scope", { length: 30 }).default("city"),
  recordValue: varchar("record_value", { length: 100 }).notNull(),
  recordNumber: numeric("record_number"),
  playerId: integer("player_id").references(() => players.id),
  schoolId: integer("school_id").references(() => schools.id),
  seasonId: integer("season_id").references(() => seasons.id),
  gameId: integer("game_id").references(() => games.id),
  holderName: varchar("holder_name", { length: 150 }),
  holderSchool: varchar("holder_school", { length: 150 }),
  yearSet: integer("year_set"),
  description: text("description"),
  verified: boolean("verified").default(false),
  sourceUrl: varchar("source_url", { length: 500 }),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================================================
// SPORT-SPECIFIC STAT TABLES
// ============================================================================

export const footballPlayerSeasons = pgTable("football_player_seasons", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => players.id),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  gamesPlayed: integer("games_played"),
  rushCarries: integer("rush_carries").default(0),
  rushYards: integer("rush_yards").default(0),
  rushYpc: numeric("rush_ypc", { precision: 5, scale: 2 }),
  rushTd: integer("rush_td").default(0),
  rushLong: integer("rush_long"),
  passComp: integer("pass_comp").default(0),
  passAtt: integer("pass_att").default(0),
  passYards: integer("pass_yards").default(0),
  passTd: integer("pass_td").default(0),
  passInt: integer("pass_int").default(0),
  passCompPct: numeric("pass_comp_pct", { precision: 5, scale: 2 }),
  passRating: numeric("pass_rating", { precision: 6, scale: 2 }),
  receptions: integer("receptions").default(0),
  recYards: integer("rec_yards").default(0),
  recYpr: numeric("rec_ypr", { precision: 5, scale: 2 }),
  recTd: integer("rec_td").default(0),
  recLong: integer("rec_long"),
  totalTd: integer("total_td").default(0),
  totalYards: integer("total_yards").default(0),
  points: integer("points").default(0),
  tackles: integer("tackles"),
  sacks: numeric("sacks", { precision: 4, scale: 1 }),
  interceptions: integer("interceptions"),
  kickRetYards: integer("kick_ret_yards"),
  puntRetYards: integer("punt_ret_yards"),
  sourceFile: varchar("source_file", { length: 200 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniquePlayerSeason: unique().on(table.playerId, table.seasonId, table.schoolId),
}));

export const basketballPlayerSeasons = pgTable("basketball_player_seasons", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => players.id),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  gamesPlayed: integer("games_played"),
  points: integer("points").default(0),
  ppg: numeric("ppg", { precision: 5, scale: 2 }),
  rebounds: integer("rebounds").default(0),
  rpg: numeric("rpg", { precision: 5, scale: 2 }),
  offRebounds: integer("off_rebounds"),
  defRebounds: integer("def_rebounds"),
  assists: integer("assists").default(0),
  apg: numeric("apg", { precision: 5, scale: 2 }),
  turnovers: integer("turnovers"),
  steals: integer("steals").default(0),
  blocks: integer("blocks").default(0),
  fgm: integer("fgm"),
  fga: integer("fga"),
  fgPct: numeric("fg_pct", { precision: 5, scale: 3 }),
  ftm: integer("ftm"),
  fta: integer("fta"),
  ftPct: numeric("ft_pct", { precision: 5, scale: 3 }),
  threePm: integer("three_pm"),
  threePa: integer("three_pa"),
  threePct: numeric("three_pct", { precision: 5, scale: 3 }),
  honorLevel: varchar("honor_level", { length: 30 }),
  sourceFile: varchar("source_file", { length: 200 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniquePlayerSeason: unique().on(table.playerId, table.seasonId, table.schoolId),
}));

export const baseballPlayerSeasons = pgTable("baseball_player_seasons", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => players.id),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  gamesPlayed: integer("games_played"),
  positionType: varchar("position_type", { length: 10 }).default("batter"),
  atBats: integer("at_bats"),
  hits: integer("hits"),
  battingAvg: numeric("batting_avg", { precision: 5, scale: 3 }),
  doubles: integer("doubles"),
  triples: integer("triples"),
  homeRuns: integer("home_runs").default(0),
  rbi: integer("rbi").default(0),
  runs: integer("runs").default(0),
  stolenBases: integer("stolen_bases").default(0),
  walks: integer("walks"),
  strikeoutsB: integer("strikeouts_b"),
  obp: numeric("obp", { precision: 5, scale: 3 }),
  slg: numeric("slg", { precision: 5, scale: 3 }),
  ops: numeric("ops", { precision: 5, scale: 3 }),
  wins: integer("wins"),
  losses: integer("losses"),
  era: numeric("era", { precision: 5, scale: 2 }),
  inningsPitched: numeric("innings_pitched", { precision: 6, scale: 1 }),
  strikeoutsP: integer("strikeouts_p"),
  walksP: integer("walks_p"),
  hitsAllowed: integer("hits_allowed"),
  earnedRuns: integer("earned_runs"),
  saves: integer("saves"),
  sourceFile: varchar("source_file", { length: 200 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniquePlayerSeason: unique().on(table.playerId, table.seasonId, table.schoolId),
}));

export const playerSeasonsMisc = pgTable("player_seasons_misc", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => players.id),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  sportId: varchar("sport_id", { length: 30 }).notNull().references(() => sports.id),
  gamesPlayed: integer("games_played"),
  stats: jsonb("stats").notNull(),
  position: varchar("position", { length: 50 }),
  notes: text("notes"),
  sourceFile: varchar("source_file", { length: 200 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniquePlayerSportSeason: unique().on(table.playerId, table.seasonId, table.schoolId, table.sportId),
}));

// ============================================================================
// GAME STATS
// ============================================================================

export const footballGameStats = pgTable("football_game_stats", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => games.id),
  playerId: integer("player_id").notNull().references(() => players.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  rushCarries: integer("rush_carries").default(0),
  rushYards: integer("rush_yards").default(0),
  rushTd: integer("rush_td").default(0),
  passComp: integer("pass_comp").default(0),
  passAtt: integer("pass_att").default(0),
  passYards: integer("pass_yards").default(0),
  passTd: integer("pass_td").default(0),
  passInt: integer("pass_int").default(0),
  receptions: integer("receptions").default(0),
  recYards: integer("rec_yards").default(0),
  recTd: integer("rec_td").default(0),
  totalTd: integer("total_td").default(0),
  points: integer("points").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueGamePlayer: unique().on(table.gameId, table.playerId),
}));

export const basketballGameStats = pgTable("basketball_game_stats", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => games.id),
  playerId: integer("player_id").notNull().references(() => players.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  points: integer("points").default(0),
  rebounds: integer("rebounds").default(0),
  assists: integer("assists").default(0),
  steals: integer("steals").default(0),
  blocks: integer("blocks").default(0),
  turnovers: integer("turnovers"),
  fgm: integer("fgm"),
  fga: integer("fga"),
  ftm: integer("ftm"),
  fta: integer("fta"),
  threePm: integer("three_pm"),
  threePa: integer("three_pa"),
  minutes: integer("minutes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueGamePlayer: unique().on(table.gameId, table.playerId),
}));

// ============================================================================
// CONTENT TABLES
// ============================================================================

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  excerpt: text("excerpt"),
  body: text("body").notNull(),
  authorName: varchar("author_name", { length: 100 }).default("PSP Staff"),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  schoolId: integer("school_id").references(() => schools.id),
  playerId: integer("player_id").references(() => players.id),
  championshipId: integer("championship_id").references(() => championships.id),
  featuredImageUrl: varchar("featured_image_url", { length: 500 }),
  status: varchar("status", { length: 20 }).default("draft"),
  featuredAt: timestamp("featured_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_articles_slug").on(table.slug),
  sportIdx: index("idx_articles_sport").on(table.sportId),
  statusIdx: index("idx_articles_status").on(table.status),
  featuredIdx: index("idx_articles_featured").on(table.featuredAt),
}));

export const articleMentions = pgTable("article_mentions", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: integer("entity_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueMention: unique().on(table.articleId, table.entityType, table.entityId),
  entityIdx: index("idx_article_mentions_entity").on(table.entityType, table.entityId),
}));

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  eventType: varchar("event_type", { length: 50 }).default("game"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  location: varchar("location", { length: 300 }),
  registrationUrl: varchar("registration_url", { length: 500 }),
  status: varchar("status", { length: 20 }).default("upcoming"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const potwNominees = pgTable("potw_nominees", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  playerName: varchar("player_name", { length: 150 }).notNull(),
  schoolName: varchar("school_name", { length: 150 }),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  seasonId: integer("season_id").references(() => seasons.id),
  weekLabel: varchar("week_label", { length: 50 }),
  statLine: text("stat_line"),
  votes: integer("votes").default(0),
  isWinner: boolean("is_winner").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================================================
// GOTW (Game of the Week) TABLES
// ============================================================================

export const gotwNominees = pgTable("gotw_nominees", {
  id: serial("id").primaryKey(),
  homeTeam: varchar("home_team", { length: 150 }).notNull(),
  awayTeam: varchar("away_team", { length: 150 }).notNull(),
  homeSchoolId: integer("home_school_id").references(() => schools.id),
  awaySchoolId: integer("away_school_id").references(() => schools.id),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  seasonId: integer("season_id").references(() => seasons.id),
  weekLabel: varchar("week_label", { length: 50 }).notNull(),
  gameDate: date("game_date"),
  gameTime: varchar("game_time", { length: 50 }),
  venue: varchar("venue", { length: 200 }),
  context: text("context"),
  voteCount: integer("vote_count").default(0),
  isWinner: boolean("is_winner").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const gotwVotes = pgTable("gotw_votes", {
  id: serial("id").primaryKey(),
  gotwNomineeId: integer("gotw_nominee_id").references(() => gotwNominees.id),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  weekLabel: varchar("week_label", { length: 50 }).notNull(),
  votedAt: timestamp("voted_at", { withTimezone: true }).defaultNow(),
});

export const gotwWinners = pgTable("gotw_winners", {
  id: serial("id").primaryKey(),
  homeTeam: varchar("home_team", { length: 150 }).notNull(),
  awayTeam: varchar("away_team", { length: 150 }).notNull(),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  week: integer("week").notNull(),
  year: integer("year").notNull(),
  voteCount: integer("vote_count").default(0),
  context: text("context"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================================================
// SYSTEM TABLES
// ============================================================================

export const importLogs = pgTable("import_logs", {
  id: serial("id").primaryKey(),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  sourceType: varchar("source_type", { length: 50 }).notNull(),
  sourceFile: varchar("source_file", { length: 500 }),
  recordsFound: integer("records_found").default(0),
  recordsImported: integer("records_imported").default(0),
  recordsSkipped: integer("records_skipped").default(0),
  recordsUpdated: integer("records_updated").default(0),
  warnings: jsonb("warnings"),
  errors: jsonb("errors"),
  status: varchar("status", { length: 20 }).default("pending"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  importedBy: text("imported_by"), // UUID as text for Supabase auth
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tableName: varchar("table_name", { length: 80 }).notNull(),
  recordId: integer("record_id").notNull(),
  fieldName: varchar("field_name", { length: 80 }).notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  action: varchar("action", { length: 20 }).notNull(),
  changedBy: text("changed_by"),
  changeReason: varchar("change_reason", { length: 500 }),
  importLogId: integer("import_log_id").references(() => importLogs.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const dataConflicts = pgTable("data_conflicts", {
  id: serial("id").primaryKey(),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: integer("entity_id"),
  entityName: varchar("entity_name", { length: 200 }),
  fieldName: varchar("field_name", { length: 80 }).notNull(),
  ourValue: text("our_value"),
  externalValue: text("external_value"),
  sourceName: varchar("source_name", { length: 100 }),
  sourceUrl: varchar("source_url", { length: 500 }),
  confidence: varchar("confidence", { length: 20 }).default("medium"),
  severity: varchar("severity", { length: 20 }).default("minor"),
  status: varchar("status", { length: 20 }).default("open"),
  resolvedValue: text("resolved_value"),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const searchIndex = pgTable("search_index", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: integer("entity_id").notNull(),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  displayName: varchar("display_name", { length: 300 }).notNull(),
  context: varchar("context", { length: 500 }),
  searchText: text("search_text").notNull(),
  urlPath: varchar("url_path", { length: 300 }),
  popularity: integer("popularity").default(0),
  regionId: varchar("region_id", { length: 50 }).default("philadelphia"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================================================
// NEXT LEVEL TRACKING (Our Guys)
// ============================================================================

export const nextLevelTracking = pgTable("next_level_tracking", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  personName: varchar("person_name", { length: 200 }).notNull(),
  highSchoolId: integer("high_school_id").references(() => schools.id),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  currentLevel: varchar("current_level", { length: 30 }).notNull().default("college"), // college, pro, coaching, staff
  currentOrg: varchar("current_org", { length: 200 }),
  currentRole: varchar("current_role", { length: 200 }),
  college: varchar("college", { length: 200 }),
  collegeSport: varchar("college_sport", { length: 50 }),
  proTeam: varchar("pro_team", { length: 200 }),
  proLeague: varchar("pro_league", { length: 30 }), // NFL, NBA, MLB, MLS, other
  draftInfo: varchar("draft_info", { length: 300 }),
  socialTwitter: varchar("social_twitter", { length: 200 }),
  socialInstagram: varchar("social_instagram", { length: 200 }),
  featured: boolean("featured").default(false),
  bioNote: text("bio_note"),
  status: varchar("status", { length: 20 }).default("active"), // active, retired, inactive
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  levelIdx: index("idx_next_level_level").on(table.currentLevel),
  leagueIdx: index("idx_next_level_league").on(table.proLeague),
  featuredIdx: index("idx_next_level_featured").on(table.featured),
}));

export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  trackingId: integer("tracking_id").notNull().references(() => nextLevelTracking.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 20 }).notNull(), // twitter, instagram
  postUrl: varchar("post_url", { length: 500 }).notNull(),
  postEmbedHtml: text("post_embed_html"),
  captionPreview: varchar("caption_preview", { length: 300 }),
  mediaUrl: varchar("media_url", { length: 500 }),
  postedAt: timestamp("posted_at", { withTimezone: true }),
  curatedAt: timestamp("curated_at", { withTimezone: true }).defaultNow(),
  featured: boolean("featured").default(false),
}, (table) => ({
  trackingIdx: index("idx_social_posts_tracking").on(table.trackingId),
}));

// ============================================================================
// RECRUITING PROFILES
// ============================================================================

export const recruitingProfiles = pgTable("recruiting_profiles", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  classYear: integer("class_year").notNull(),
  position: varchar("position", { length: 50 }),
  starRating: integer("star_rating"), // 2-5
  compositeRating: numeric("composite_rating", { precision: 6, scale: 4 }),
  status: varchar("status", { length: 30 }).default("unsigned"), // unsigned, committed, signed, enrolled, decommitted
  committedSchool: varchar("committed_school", { length: 200 }),
  committedDate: date("committed_date"),
  offers: text("offers").array(),
  ranking247: integer("ranking_247"),
  rankingRivals: integer("ranking_rivals"),
  rankingOn3: integer("ranking_on3"),
  rankingEspn: integer("ranking_espn"),
  url247: varchar("url_247", { length: 500 }),
  urlRivals: varchar("url_rivals", { length: 500 }),
  urlOn3: varchar("url_on3", { length: 500 }),
  urlMaxpreps: varchar("url_maxpreps", { length: 500 }),
  urlHudl: varchar("url_hudl", { length: 500 }),
  height: varchar("height", { length: 10 }),
  weight: integer("weight"),
  highlightsUrl: varchar("highlights_url", { length: 500 }),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  classYearIdx: index("idx_recruiting_class").on(table.classYear),
  sportIdx: index("idx_recruiting_sport").on(table.sportId),
  statusIdx: index("idx_recruiting_status").on(table.status),
  starIdx: index("idx_recruiting_stars").on(table.starRating),
}));

// ============================================================================
// SPRINT 1: RIVALRIES
// ============================================================================

export const rivalries = pgTable("rivalries", {
  id: serial("id").primaryKey(),
  schoolAId: integer("school_a_id").notNull().references(() => schools.id),
  schoolBId: integer("school_b_id").notNull().references(() => schools.id),
  sportId: varchar("sport_id", { length: 30 }).notNull().references(() => sports.id),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  displayName: varchar("display_name", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 300 }),
  description: text("description"),
  featured: boolean("featured").default(false),
  regionId: varchar("region_id", { length: 50 }).references(() => regions.id).default("philadelphia"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  sportIdx: index("idx_rivalries_sport").on(table.sportId),
  schoolsIdx: index("idx_rivalries_schools").on(table.schoolAId, table.schoolBId),
  uniqueRivalry: unique().on(table.schoolAId, table.schoolBId, table.sportId),
}));

export const rivalryNotes = pgTable("rivalry_notes", {
  id: serial("id").primaryKey(),
  rivalryId: integer("rivalry_id").notNull().references(() => rivalries.id),
  gameId: integer("game_id").references(() => games.id),
  noteType: varchar("note_type", { length: 30 }).notNull().default("history"),
  title: varchar("title", { length: 200 }),
  content: text("content").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  rivalryIdx: index("idx_rivalry_notes_rivalry").on(table.rivalryId),
}));

// ============================================================================
// PRECOMPUTED CACHE
// ============================================================================

export const precomputedCache = pgTable("precomputed_cache", {
  id: serial("id").primaryKey(),
  cacheKey: varchar("cache_key", { length: 200 }).unique().notNull(),
  sportId: varchar("sport_id", { length: 30 }).references(() => sports.id),
  queryType: varchar("query_type", { length: 80 }).notNull(),
  filters: jsonb("filters"),
  resultData: jsonb("result_data").notNull(),
  recordCount: integer("record_count"),
  computedAt: timestamp("computed_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
