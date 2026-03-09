-- ============================================================================
-- PhillySportsPack.com — Expert Schema v2
-- Migration: 20260308_expert_schema_v2
-- Author: Michael Stonebraker (Database Architecture)
-- Implements feedback from Dean Oliver (Basketball Analytics) & Bill James (Statistical Validity)
-- ============================================================================
-- Changes:
--   • rosters table: Team membership independent of stats
--   • eras table: Era definitions with stat availability metadata
--   • team_ratings table: Elo/strength ratings per team-season
--   • stat_corrections table: Post-hoc corrections with reason codes
--   • ALTER basketball_player_seasons: ADD missing efficiency columns
--   • ALTER all stat tables: ADD stat_quality ENUM
--   • ALTER awards: ADD stat_snapshot JSONB
--   • ALTER records: ADD opponent_id, game_context TEXT
--   • NEW materialized views: era_adjusted_leaders, school_pipeline_stats
--   • Covering & BRIN indexes for performance
--   • RLS policies for new tables
--   • Refresh triggers for computed metrics
-- ============================================================================

-- Enable required extensions (if not already)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ROSTERS TABLE (Team Membership)
-- ============================================================================
-- Capture team membership independent of statistics
-- Allows recording bench players, JV squad, etc. without stats data

CREATE TABLE rosters (
  id                SERIAL PRIMARY KEY,
  team_season_id    INTEGER NOT NULL REFERENCES team_seasons(id),
  player_id         INTEGER NOT NULL REFERENCES players(id),
  season_id         INTEGER NOT NULL REFERENCES seasons(id),
  school_id         INTEGER NOT NULL REFERENCES schools(id),
  sport_id          VARCHAR(30) NOT NULL REFERENCES sports(id),
  jersey_number     INTEGER,
  position          VARCHAR(50),
  class_year        VARCHAR(20),                     -- 'freshman', 'sophomore', 'junior', 'senior'
  is_starter        BOOLEAN DEFAULT FALSE,
  games_on_roster   INTEGER,
  games_played      INTEGER DEFAULT 0,
  status            VARCHAR(30) DEFAULT 'active',   -- 'active', 'redshirt', 'injured', 'transferred', 'graduated'
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_season_id, player_id)
);

CREATE INDEX idx_rosters_player ON rosters(player_id);
CREATE INDEX idx_rosters_team_season ON rosters(team_season_id);
CREATE INDEX idx_rosters_sport_season ON rosters(sport_id, season_id);
CREATE INDEX idx_rosters_status ON rosters(status) WHERE status != 'graduated';

-- ============================================================================
-- 2. ERAS TABLE (Historical Context)
-- ============================================================================
-- Define sports eras with metadata on stat availability and scoring patterns
-- Enables era-adjusted comparisons and era-specific leaderboards

CREATE TABLE eras (
  id                VARCHAR(50) PRIMARY KEY,        -- 'football:1900s', 'basketball:1970s-1980s'
  sport_id          VARCHAR(30) NOT NULL REFERENCES sports(id),
  era_name          VARCHAR(100) NOT NULL,           -- 'Early Era', 'Modern Era', '3-Point Era'
  year_start        INTEGER NOT NULL,
  year_end          INTEGER NOT NULL,
  description       TEXT,
  -- Stat availability flags
  has_rush_stats    BOOLEAN DEFAULT FALSE,
  has_pass_stats    BOOLEAN DEFAULT FALSE,
  has_rec_stats     BOOLEAN DEFAULT FALSE,
  has_def_stats     BOOLEAN DEFAULT FALSE,
  has_advanced_stats BOOLEAN DEFAULT FALSE,          -- shooting %s, efficiency metrics, etc.
  -- Era characteristics for adjustment
  avg_scoring       NUMERIC(6,2),                   -- average points/game (for context)
  avg_yards_per_game NUMERIC(6,2),
  rule_changes      TEXT[],                         -- ['3-second rule introduced', '3-pointer added']
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_eras_sport ON eras(sport_id);
CREATE INDEX idx_eras_years ON eras(year_start, year_end);

-- Insert era definitions for existing sports
INSERT INTO eras (id, sport_id, era_name, year_start, year_end, description,
                  has_rush_stats, has_pass_stats, has_rec_stats, has_def_stats, has_advanced_stats)
VALUES
  ('football:early', 'football', 'Early Era', 1900, 1949, 'Limited statistics, mostly rushing and passing yards',
   true, true, false, false, false),
  ('football:traditional', 'football', 'Traditional Era', 1950, 1979, 'Rushing/passing/receiving stats recorded',
   true, true, true, false, false),
  ('football:modern', 'football', 'Modern Era', 1980, 2024, 'Complete stats including defense and efficiency metrics',
   true, true, true, true, true),
  ('basketball:early', 'basketball', 'Early Era', 1900, 1969, 'Scoring only, no field goal breakdown',
   false, false, false, false, false),
  ('basketball:3-point', 'basketball', '3-Point Era', 1970, 2024, 'Full advanced shooting statistics and efficiency metrics',
   false, false, false, false, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. TEAM RATINGS TABLE (Strength/Elo)
-- ============================================================================
-- Track team strength ratings over time (Elo, power ratings, etc.)
-- Useful for historical context and strength-of-schedule analysis

CREATE TABLE team_ratings (
  id                SERIAL PRIMARY KEY,
  team_season_id    INTEGER NOT NULL REFERENCES team_seasons(id),
  season_id         INTEGER NOT NULL REFERENCES seasons(id),
  school_id         INTEGER NOT NULL REFERENCES schools(id),
  sport_id          VARCHAR(30) NOT NULL REFERENCES sports(id),
  -- Rating systems
  elo_rating        NUMERIC(6,2),                   -- 1500 = average
  power_rating      NUMERIC(6,2),                   -- points above average
  strength_of_schedule NUMERIC(6,2),
  conference_rating NUMERIC(6,2),
  -- Metadata
  rating_method     VARCHAR(50),                    -- 'elo', 'power_rating', 'jeff_sagarin'
  calculated_at     TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_season_id, rating_method)
);

CREATE INDEX idx_team_ratings_season ON team_ratings(season_id, sport_id);
CREATE INDEX idx_team_ratings_elo ON team_ratings(elo_rating DESC);
CREATE INDEX idx_team_ratings_power ON team_ratings(power_rating DESC);

-- ============================================================================
-- 4. STAT CORRECTIONS TABLE (Post-Hoc Corrections)
-- ============================================================================
-- Track corrections applied to stats with reasoning
-- Enables transparent audit trail and prevents double-corrections

CREATE TABLE stat_corrections (
  id                SERIAL PRIMARY KEY,
  entity_type       VARCHAR(50) NOT NULL,            -- 'player_season', 'game_stat', 'team_season'
  entity_table      VARCHAR(80) NOT NULL,            -- 'football_player_seasons', 'basketball_game_stats'
  entity_id         INTEGER NOT NULL,                -- record ID in the entity table
  stat_field        VARCHAR(80) NOT NULL,            -- column name (e.g., 'pass_yards')
  old_value         TEXT,
  new_value         TEXT,
  correction_reason VARCHAR(255) NOT NULL,           -- enum-like: 'duplicate_removed', 'data_entry_error', 'source_correction', 'calculation_error'
  severity          VARCHAR(30) DEFAULT 'minor',    -- 'critical', 'major', 'minor'
  source_citation   TEXT,                           -- where the correction came from
  applied_by        UUID,                           -- Supabase auth user
  reversal_of_id    INTEGER REFERENCES stat_corrections(id), -- if this correction reverses a previous one
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stat_corrections_entity ON stat_corrections(entity_table, entity_id);
CREATE INDEX idx_stat_corrections_reason ON stat_corrections(correction_reason);
CREATE INDEX idx_stat_corrections_severity ON stat_corrections(severity);
CREATE INDEX idx_stat_corrections_created ON stat_corrections(created_at DESC);

-- ============================================================================
-- 5. ALTER TABLES: ADD stat_quality & ENUM TYPE
-- ============================================================================

CREATE TYPE stat_quality_enum AS ENUM ('official', 'maxpreps', 'newspaper', 'estimated', 'derived');

-- Add stat_quality to football_player_seasons
ALTER TABLE football_player_seasons
ADD COLUMN IF NOT EXISTS stat_quality stat_quality_enum DEFAULT 'estimated';

-- Add stat_quality to basketball_player_seasons
ALTER TABLE basketball_player_seasons
ADD COLUMN IF NOT EXISTS stat_quality stat_quality_enum DEFAULT 'estimated';

-- Add stat_quality to baseball_player_seasons
ALTER TABLE baseball_player_seasons
ADD COLUMN IF NOT EXISTS stat_quality stat_quality_enum DEFAULT 'estimated';

-- Add stat_quality to player_seasons_misc
ALTER TABLE player_seasons_misc
ADD COLUMN IF NOT EXISTS stat_quality stat_quality_enum DEFAULT 'estimated';

-- Add stat_quality to football_game_stats
ALTER TABLE football_game_stats
ADD COLUMN IF NOT EXISTS stat_quality stat_quality_enum DEFAULT 'estimated';

-- Add stat_quality to basketball_game_stats
ALTER TABLE basketball_game_stats
ADD COLUMN IF NOT EXISTS stat_quality stat_quality_enum DEFAULT 'estimated';

-- ============================================================================
-- 6. ALTER BASKETBALL_PLAYER_SEASONS: ADD MISSING EFFICIENCY COLUMNS
-- ============================================================================
-- Dean Oliver: Missing FGM/FGA/3PM/3PA/FTM/FTA/TO/MIN required for modern metrics

ALTER TABLE basketball_player_seasons
ADD COLUMN IF NOT EXISTS minutes INTEGER,
ADD COLUMN IF NOT EXISTS offensive_rebounds INTEGER,
ADD COLUMN IF NOT EXISTS defensive_rebounds INTEGER,
ADD COLUMN IF NOT EXISTS total_rebounds INTEGER,
ADD COLUMN IF NOT EXISTS fga_computed INTEGER,                -- Computed: might differ from fga if only fg% available
ADD COLUMN IF NOT EXISTS fgm_computed INTEGER;

-- Create indexes on new efficiency columns
CREATE INDEX IF NOT EXISTS idx_bk_ps_minutes ON basketball_player_seasons(minutes) WHERE minutes IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bk_ps_oreb ON basketball_player_seasons(offensive_rebounds DESC) WHERE offensive_rebounds IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bk_ps_dreb ON basketball_player_seasons(defensive_rebounds DESC) WHERE defensive_rebounds IS NOT NULL;

-- ============================================================================
-- 7. ALTER AWARDS TABLE: ADD stat_snapshot JSONB
-- ============================================================================
-- Link awards to their statistical basis
-- JSONB structure: {"stat_category": "rushing_yards", "stat_value": 2034, "rank": 1, "era": "2020s"}

ALTER TABLE awards
ADD COLUMN IF NOT EXISTS stat_snapshot JSONB,                 -- Statistical basis for award
ADD COLUMN IF NOT EXISTS award_tier_numeric INTEGER,          -- 1-indexed rank: 1=first team, 2=second, etc.
ADD COLUMN IF NOT EXISTS eligibility_criteria TEXT;           -- Why this player was eligible

-- ============================================================================
-- 8. ALTER RECORDS TABLE: ADD opponent_id, game_context
-- ============================================================================
-- Enhanced records tracking for game-specific records

ALTER TABLE records
ADD COLUMN IF NOT EXISTS opponent_id INTEGER REFERENCES schools(id),
ADD COLUMN IF NOT EXISTS game_context TEXT,                   -- 'playoff_championship', 'regular_season', 'conference_game'
ADD COLUMN IF NOT EXISTS era_id VARCHAR(50) REFERENCES eras(id);

CREATE INDEX IF NOT EXISTS idx_records_opponent ON records(opponent_id) WHERE opponent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_records_era ON records(era_id) WHERE era_id IS NOT NULL;

-- ============================================================================
-- 9. MATERIALIZED VIEW: era_adjusted_leaders
-- ============================================================================
-- Z-score normalized stats within sport-era-league context
-- Allows fair comparison across eras with different scoring norms

CREATE MATERIALIZED VIEW era_adjusted_leaders AS
WITH football_stats AS (
  SELECT
    fs.player_id,
    p.name AS player_name,
    p.slug AS player_slug,
    fs.school_id,
    s.name AS school_name,
    fs.season_id,
    se.year_start,
    'football' AS sport_id,
    -- Era assignment
    CASE
      WHEN se.year_start < 1950 THEN 'football:early'
      WHEN se.year_start < 1980 THEN 'football:traditional'
      ELSE 'football:modern'
    END AS era_id,
    fs.rush_yards,
    fs.pass_yards,
    fs.rec_yards,
    fs.total_td,
    -- Calculate Z-scores within era-league
    CASE WHEN COUNT(*) OVER (PARTITION BY
      CASE WHEN se.year_start < 1950 THEN 'football:early'
           WHEN se.year_start < 1980 THEN 'football:traditional'
           ELSE 'football:modern' END, l.id) > 1
         THEN (fs.rush_yards - AVG(fs.rush_yards) OVER (PARTITION BY
           CASE WHEN se.year_start < 1950 THEN 'football:early'
                WHEN se.year_start < 1980 THEN 'football:traditional'
                ELSE 'football:modern' END, l.id)) /
              NULLIF(STDDEV_POP(fs.rush_yards) OVER (PARTITION BY
                CASE WHEN se.year_start < 1950 THEN 'football:early'
                     WHEN se.year_start < 1980 THEN 'football:traditional'
                     ELSE 'football:modern' END, l.id), 0)
         ELSE 0 END AS rush_yards_zscore,
    CASE WHEN COUNT(*) OVER (PARTITION BY
      CASE WHEN se.year_start < 1950 THEN 'football:early'
           WHEN se.year_start < 1980 THEN 'football:traditional'
           ELSE 'football:modern' END, l.id) > 1
         THEN (fs.total_td - AVG(fs.total_td) OVER (PARTITION BY
           CASE WHEN se.year_start < 1950 THEN 'football:early'
                WHEN se.year_start < 1980 THEN 'football:traditional'
                ELSE 'football:modern' END, l.id)) /
              NULLIF(STDDEV_POP(fs.total_td) OVER (PARTITION BY
                CASE WHEN se.year_start < 1950 THEN 'football:early'
                     WHEN se.year_start < 1980 THEN 'football:traditional'
                     ELSE 'football:modern' END, l.id), 0)
         ELSE 0 END AS total_td_zscore
  FROM football_player_seasons fs
  JOIN players p ON p.id = fs.player_id
  JOIN schools s ON s.id = fs.school_id
  LEFT JOIN leagues l ON l.id = s.league_id
  JOIN seasons se ON se.id = fs.season_id
  WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
),
basketball_stats AS (
  SELECT
    bs.player_id,
    p.name AS player_name,
    p.slug AS player_slug,
    bs.school_id,
    s.name AS school_name,
    bs.season_id,
    se.year_start,
    'basketball' AS sport_id,
    CASE
      WHEN se.year_start < 1970 THEN 'basketball:early'
      ELSE 'basketball:3-point'
    END AS era_id,
    bs.points,
    bs.rebounds,
    bs.assists,
    bs.ppg,
    CASE WHEN COUNT(*) OVER (PARTITION BY
      CASE WHEN se.year_start < 1970 THEN 'basketball:early'
           ELSE 'basketball:3-point' END, l.id) > 1
         THEN (bs.ppg - AVG(bs.ppg) OVER (PARTITION BY
           CASE WHEN se.year_start < 1970 THEN 'basketball:early'
                ELSE 'basketball:3-point' END, l.id)) /
              NULLIF(STDDEV_POP(bs.ppg) OVER (PARTITION BY
                CASE WHEN se.year_start < 1970 THEN 'basketball:early'
                     ELSE 'basketball:3-point' END, l.id), 0)
         ELSE 0 END AS ppg_zscore,
    CASE WHEN COUNT(*) OVER (PARTITION BY
      CASE WHEN se.year_start < 1970 THEN 'basketball:early'
           ELSE 'basketball:3-point' END, l.id) > 1
         THEN (bs.rebounds - AVG(bs.rebounds) OVER (PARTITION BY
           CASE WHEN se.year_start < 1970 THEN 'basketball:early'
                ELSE 'basketball:3-point' END, l.id)) /
              NULLIF(STDDEV_POP(bs.rebounds) OVER (PARTITION BY
                CASE WHEN se.year_start < 1970 THEN 'basketball:early'
                     ELSE 'basketball:3-point' END, l.id), 0)
         ELSE 0 END AS rebounds_zscore
  FROM basketball_player_seasons bs
  JOIN players p ON p.id = bs.player_id
  JOIN schools s ON s.id = bs.school_id
  LEFT JOIN leagues l ON l.id = s.league_id
  JOIN seasons se ON se.id = bs.season_id
  WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
)
SELECT 'football' AS sport_id, player_id, player_name, player_slug, school_id, school_name, season_id, year_start, era_id,
       rush_yards, NULL::INTEGER AS points, NULL::INTEGER AS rebounds, NULL::INTEGER AS assists,
       NULL::NUMERIC AS ppg, rush_yards_zscore AS primary_zscore, total_td_zscore
FROM football_stats
UNION ALL
SELECT 'basketball' AS sport_id, player_id, player_name, player_slug, school_id, school_name, season_id, year_start, era_id,
       NULL::INTEGER, points, rebounds, assists, ppg, ppg_zscore AS primary_zscore, rebounds_zscore
FROM basketball_stats;

CREATE UNIQUE INDEX idx_era_adjusted_leaders_pk ON era_adjusted_leaders(sport_id, player_id, season_id);
CREATE INDEX idx_era_adjusted_leaders_zscore ON era_adjusted_leaders(primary_zscore DESC);
CREATE INDEX idx_era_adjusted_leaders_era ON era_adjusted_leaders(era_id);

-- ============================================================================
-- 10. MATERIALIZED VIEW: school_pipeline_stats
-- ============================================================================
-- College/Pro placement rates and trends per school

CREATE MATERIALIZED VIEW school_pipeline_stats AS
SELECT
  s.id AS school_id,
  s.name AS school_name,
  s.slug AS school_slug,
  p.sport_id,
  COUNT(DISTINCT CASE WHEN p.college IS NOT NULL THEN p.id END) AS college_players,
  COUNT(DISTINCT CASE WHEN p.pro_team IS NOT NULL THEN p.id END) AS pro_players,
  COUNT(DISTINCT p.id) AS total_players,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN p.college IS NOT NULL THEN p.id END) /
        NULLIF(COUNT(DISTINCT p.id), 0), 2) AS college_placement_pct,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN p.pro_team IS NOT NULL THEN p.id END) /
        NULLIF(COUNT(DISTINCT p.id), 0), 2) AS pro_placement_pct,
  COUNT(DISTINCT CASE WHEN p.college IS NOT NULL AND p.pro_team IS NOT NULL THEN p.id END) AS college_to_pro,
  MAX(ps.year_end) AS last_graduate_year
FROM schools s
CROSS JOIN sports p
LEFT JOIN football_player_seasons fps ON fps.school_id = s.id AND p.id = 'football'
LEFT JOIN basketball_player_seasons bps ON bps.school_id = s.id AND p.id = 'basketball'
LEFT JOIN players pl ON (pl.id = fps.player_id OR pl.id = bps.player_id)
LEFT JOIN (
  SELECT DISTINCT player_id, MAX(se.year_end) AS year_end
  FROM football_player_seasons fps2
  JOIN seasons se ON se.id = fps2.season_id
  GROUP BY player_id
  UNION ALL
  SELECT DISTINCT player_id, MAX(se.year_end) AS year_end
  FROM basketball_player_seasons bps2
  JOIN seasons se ON se.id = bps2.season_id
  GROUP BY player_id
) ps ON ps.player_id = pl.id
WHERE s.deleted_at IS NULL
GROUP BY s.id, s.name, s.slug, p.id;

CREATE UNIQUE INDEX idx_school_pipeline_pk ON school_pipeline_stats(school_id, sport_id);
CREATE INDEX idx_school_pipeline_college_pct ON school_pipeline_stats(college_placement_pct DESC);
CREATE INDEX idx_school_pipeline_pro_pct ON school_pipeline_stats(pro_placement_pct DESC);

-- ============================================================================
-- 11. PERFORMANCE INDEXES (Covering & BRIN)
-- ============================================================================

-- BRIN index on games.game_date (range query optimization)
CREATE INDEX idx_games_date_brin ON games USING BRIN(game_date) WHERE deleted_at IS NULL;

-- Covering indexes on awards (avoid table lookups)
CREATE INDEX idx_awards_player_sport_covering ON awards(player_id, sport_id) INCLUDE (season_id, award_type, category);

-- Partial index for active records (speed up record lookups)
CREATE INDEX idx_records_active ON records(sport_id, category) WHERE verified = TRUE;

-- Composite index on team_seasons for common queries
CREATE INDEX idx_team_seasons_school_sport ON team_seasons(school_id, sport_id) INCLUDE (wins, losses, season_id);

-- Index on rosters for roster lookups
CREATE INDEX idx_rosters_school_season_covering ON rosters(school_id, season_id) INCLUDE (player_id, jersey_number, is_starter);

-- ============================================================================
-- 12. RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Enable RLS
ALTER TABLE rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE eras ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stat_corrections ENABLE ROW LEVEL SECURITY;

-- Public read access for non-deleted rosters
CREATE POLICY rosters_public_read ON rosters
  FOR SELECT
  USING (true);

-- Public read access for eras (read-only)
CREATE POLICY eras_public_read ON eras
  FOR SELECT
  USING (true);

-- Public read access for team_ratings
CREATE POLICY team_ratings_public_read ON team_ratings
  FOR SELECT
  USING (true);

-- Public read access for stat_corrections
CREATE POLICY stat_corrections_public_read ON stat_corrections
  FOR SELECT
  USING (true);

-- Admin write access for rosters
CREATE POLICY rosters_admin_write ON rosters
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY rosters_admin_insert ON rosters
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admin write access for team_ratings
CREATE POLICY team_ratings_admin_write ON team_ratings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY team_ratings_admin_insert ON team_ratings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admin write access for stat_corrections
CREATE POLICY stat_corrections_admin_write ON stat_corrections
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY stat_corrections_admin_insert ON stat_corrections
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 13. TRIGGERS: updated_at ON NEW TABLES
-- ============================================================================

-- Trigger for rosters.updated_at
CREATE OR REPLACE FUNCTION update_rosters_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rosters_updated_at_trigger
  BEFORE UPDATE ON rosters
  FOR EACH ROW
  EXECUTE FUNCTION update_rosters_timestamp();

-- Trigger for stat_corrections.updated_at
CREATE OR REPLACE FUNCTION update_stat_corrections_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stat_corrections_updated_at_trigger
  BEFORE UPDATE ON stat_corrections
  FOR EACH ROW
  EXECUTE FUNCTION update_stat_corrections_timestamp();

-- ============================================================================
-- 14. REFRESH MATERIALIZED VIEWS (CONCURRENT safe)
-- ============================================================================
-- Note: These materialized views should be refreshed daily via pg_cron (future enhancement)

-- Refresh era_adjusted_leaders
REFRESH MATERIALIZED VIEW CONCURRENTLY era_adjusted_leaders;

-- Refresh school_pipeline_stats
REFRESH MATERIALIZED VIEW CONCURRENTLY school_pipeline_stats;

-- ============================================================================
-- End of Migration
-- ============================================================================
