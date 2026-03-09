/**
 * Performance Optimization Indexes
 *
 * Adds strategic indexes to improve query performance:
 * - Covering index for rushing leader queries
 * - BRIN index for game date range queries
 * - Composite index for award filtering
 * - Partial index for pro player tracking
 * - Composite index for school profile queries
 * - Index on game dates with schools for efficient filtering
 *
 * Migration: 2026-03-08
 * Purpose: Improve query performance for common API patterns
 */

-- ============================================================================
-- FOOTBALL RUSHING LEADERS - COVERING INDEX
-- ============================================================================
-- Optimizes queries like: SELECT * FROM football_player_seasons WHERE sport_id = 'football' ORDER BY rush_yards DESC
-- INCLUDE columns allow index-only scans without touching the main table
CREATE INDEX IF NOT EXISTS idx_football_rush_yards_covering
  ON football_player_seasons(rush_yards DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE rush_yards IS NOT NULL;

-- Similar for other rushing stats
CREATE INDEX IF NOT EXISTS idx_football_pass_yards_covering
  ON football_player_seasons(pass_yards DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE pass_yards IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_football_rec_yards_covering
  ON football_player_seasons(rec_yards DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE rec_yards IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_football_total_yards_covering
  ON football_player_seasons(total_yards DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE total_yards IS NOT NULL;

-- ============================================================================
-- BASKETBALL SCORING LEADERS - COVERING INDEX
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_basketball_points_covering
  ON basketball_player_seasons(points DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE points IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_basketball_ppg_covering
  ON basketball_player_seasons(ppg DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE ppg IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_basketball_rebounds_covering
  ON basketball_player_seasons(rebounds DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE rebounds IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_basketball_assists_covering
  ON basketball_player_seasons(assists DESC NULLS LAST)
  INCLUDE (player_id, school_id, season_id)
  WHERE assists IS NOT NULL;

-- ============================================================================
-- GAME DATE RANGE QUERIES - BRIN INDEX
-- ============================================================================
-- BRIN (Block Range Index) is more efficient than B-tree for large sequential data
-- Optimizes range queries on game_date (e.g., games between Jan-Dec 2024)
-- Uses 10x less space while still providing fast range scans
CREATE INDEX IF NOT EXISTS idx_games_game_date_brin
  ON games USING BRIN (game_date)
  WITH (pages_per_range = 128);

-- B-tree for point lookups combined with sport
CREATE INDEX IF NOT EXISTS idx_games_sport_date
  ON games(sport_id, game_date DESC)
  WHERE deleted_at IS NULL;

-- Index for school-specific game queries
CREATE INDEX IF NOT EXISTS idx_games_home_school_date
  ON games(home_school_id, game_date DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_games_away_school_date
  ON games(away_school_id, game_date DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- AWARDS FILTERING - COMPOSITE INDEX
-- ============================================================================
-- Optimizes queries filtering awards by player and sport
CREATE INDEX IF NOT EXISTS idx_awards_player_sport
  ON awards(player_id, sport_id)
  WHERE deleted_at IS NULL;

-- For award type queries
CREATE INDEX IF NOT EXISTS idx_awards_sport_type
  ON awards(sport_id, award_type)
  WHERE deleted_at IS NULL;

-- For year-based award queries
CREATE INDEX IF NOT EXISTS idx_awards_player_season
  ON awards(player_id, season_id);

-- ============================================================================
-- PRO PLAYER TRACKING - PARTIAL INDEX
-- ============================================================================
-- Only indexes players with pro_team set (much smaller index)
-- Optimizes "Find all pro players from school X"
CREATE INDEX IF NOT EXISTS idx_next_level_pro_players
  ON next_level_tracking(high_school_id, pro_team)
  WHERE pro_team IS NOT NULL;

-- Similarly for college
CREATE INDEX IF NOT EXISTS idx_next_level_college_players
  ON next_level_tracking(high_school_id, college_name)
  WHERE college_name IS NOT NULL AND status = 'active';

-- ============================================================================
-- SCHOOL PROFILE QUERIES - COMPOSITE INDEX
-- ============================================================================
-- Optimizes the pattern: school_id + sport_id + season_id lookups
-- Used for fetching a school's record in specific sport/season
CREATE INDEX IF NOT EXISTS idx_team_seasons_school_sport_season
  ON team_seasons(school_id, sport_id, season_id)
  WHERE deleted_at IS NULL;

-- For listing all teams for a school
CREATE INDEX IF NOT EXISTS idx_team_seasons_school_sport
  ON team_seasons(school_id, sport_id)
  INCLUDE (wins, losses, ties, season_id)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- CHAMPIONSHIP QUERIES
-- ============================================================================
-- Optimizes finding championships for a school
CREATE INDEX IF NOT EXISTS idx_championships_school_sport_season
  ON championships(school_id, sport_id, season_id)
  WHERE deleted_at IS NULL;

-- For getting all championships in a season
CREATE INDEX IF NOT EXISTS idx_championships_season_sport
  ON championships(season_id, sport_id);

-- ============================================================================
-- PLAYER SEASON QUERIES
-- ============================================================================
-- For finding all seasons a player played in
CREATE INDEX IF NOT EXISTS idx_football_seasons_player_season
  ON football_player_seasons(player_id, season_id);

CREATE INDEX IF NOT EXISTS idx_basketball_seasons_player_season
  ON basketball_player_seasons(player_id, season_id);

CREATE INDEX IF NOT EXISTS idx_baseball_seasons_player_season
  ON baseball_player_seasons(player_id, season_id);

-- ============================================================================
-- ARTICLE QUERIES
-- ============================================================================
-- For published article listing with date ordering
CREATE INDEX IF NOT EXISTS idx_articles_status_published
  ON articles(status, published_at DESC)
  WHERE status = 'published' AND published_at IS NOT NULL;

-- For article mentions queries
CREATE INDEX IF NOT EXISTS idx_article_mentions_article
  ON article_mentions(article_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_article_mentions_entity
  ON article_mentions(entity_type, entity_id)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- ROSTER QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_rosters_school_sport_season
  ON rosters(school_id, sport_id, season_id);

-- ============================================================================
-- COACH QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_coaches_school_sport
  ON coaches(primary_school_id, sport_id)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- SOFT DELETE PERFORMANCE
-- ============================================================================
-- These are already partially handled by partial indexes above,
-- but explicitly index deleted_at for general queries
CREATE INDEX IF NOT EXISTS idx_schools_not_deleted
  ON schools(id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_players_not_deleted
  ON players(id)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- COMMENT & COMMUNITY FEATURES
-- ============================================================================
-- For comment moderation queues
CREATE INDEX IF NOT EXISTS idx_comments_status
  ON comments(status, created_at DESC)
  WHERE status IN ('pending', 'flagged');

-- For user activity queries
CREATE INDEX IF NOT EXISTS idx_comments_author_created
  ON comments(author_id, created_at DESC);

-- For article comment counts
CREATE INDEX IF NOT EXISTS idx_comments_article_approved
  ON comments(article_id, created_at DESC)
  WHERE status = 'approved';

-- ============================================================================
-- ANALYTICAL QUERIES
-- ============================================================================
-- For "career leader" queries across all time
CREATE INDEX IF NOT EXISTS idx_football_rush_alltime
  ON football_player_seasons(rush_yards DESC)
  INCLUDE (player_id)
  WHERE rush_yards > 0;

CREATE INDEX IF NOT EXISTS idx_basketball_points_alltime
  ON basketball_player_seasons(points DESC)
  INCLUDE (player_id)
  WHERE points > 0;

-- ============================================================================
-- SEARCH & AUTOCOMPLETE
-- ============================================================================
-- Prefix search on names
CREATE INDEX IF NOT EXISTS idx_schools_name_trgm
  ON schools USING gin (name gin_trgm_ops)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_players_name_trgm
  ON players USING gin (name gin_trgm_ops)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_coaches_name_trgm
  ON coaches USING gin (name gin_trgm_ops)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- MIGRATION METADATA
-- ============================================================================
COMMENT ON INDEX idx_football_rush_yards_covering IS 'Covering index for rushing yards leaderboard - allows index-only scans';
COMMENT ON INDEX idx_games_game_date_brin IS 'BRIN index for game date ranges - efficient for large time windows';
COMMENT ON INDEX idx_awards_player_sport IS 'Composite index for award queries by player and sport';
COMMENT ON INDEX idx_next_level_pro_players IS 'Partial index for pro-level tracking - only includes pro_team entries';
COMMENT ON INDEX idx_team_seasons_school_sport_season IS 'Composite index for school profile queries';

-- ============================================================================
-- ANALYZE AND VACUUM
-- ============================================================================
-- Update table statistics after creating indexes
ANALYZE schools;
ANALYZE players;
ANALYZE football_player_seasons;
ANALYZE basketball_player_seasons;
ANALYZE games;
ANALYZE awards;
ANALYZE team_seasons;
ANALYZE championships;
ANALYZE articles;
ANALYZE coaches;
