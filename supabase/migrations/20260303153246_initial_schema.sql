-- ============================================================================
-- PhillySportsPack.com — Initial Migration
-- Migration: 20260303153246_initial_schema
-- Platform: Supabase (PostgreSQL 15+)
-- ============================================================================
-- This migration creates the complete PSP database schema and seeds lookup data.
-- To apply: supabase db push   (or)   supabase migration up
-- To revert: supabase migration down  (runs the revert section at bottom)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. SHARED ENTITY TABLES
-- ============================================================================

CREATE TABLE regions (
  id          VARCHAR(50) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  state       VARCHAR(2) NOT NULL DEFAULT 'PA',
  metro_area  VARCHAR(100),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sports (
  id          VARCHAR(30) PRIMARY KEY,
  name        VARCHAR(50) NOT NULL,
  emoji       VARCHAR(10),
  sort_order  INTEGER DEFAULT 0,
  stat_schema JSONB,
  is_major    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leagues (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(80) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  short_name  VARCHAR(30),
  region_id   VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  level       VARCHAR(20) DEFAULT 'high_school',
  founded_year INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seasons (
  id          SERIAL PRIMARY KEY,
  year_start  INTEGER NOT NULL,
  year_end    INTEGER NOT NULL,
  label       VARCHAR(20) NOT NULL,
  UNIQUE(year_start, year_end)
);

CREATE INDEX idx_seasons_years ON seasons(year_start, year_end);

CREATE TABLE schools (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(100) UNIQUE NOT NULL,
  name            VARCHAR(150) NOT NULL,
  short_name      VARCHAR(50),
  city            VARCHAR(50) DEFAULT 'Philadelphia',
  state           VARCHAR(2) DEFAULT 'PA',
  region_id       VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  league_id       INTEGER REFERENCES leagues(id),
  founded_year    INTEGER,
  closed_year     INTEGER,
  logo_url        VARCHAR(500),
  mascot          VARCHAR(100),
  colors          JSONB,
  address         TEXT,
  website_url     VARCHAR(500),
  aliases         TEXT[],
  v4_id           VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_schools_slug ON schools(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_league ON schools(league_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_region ON schools(region_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_aliases ON schools USING GIN(aliases);
CREATE INDEX idx_schools_name_trgm ON schools USING GIN(name gin_trgm_ops);

CREATE TABLE players (
  id               SERIAL PRIMARY KEY,
  slug             VARCHAR(150) UNIQUE NOT NULL,
  name             VARCHAR(150) NOT NULL,
  first_name       VARCHAR(75),
  last_name        VARCHAR(75),
  primary_school_id INTEGER REFERENCES schools(id),
  region_id        VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  graduation_year  INTEGER,
  positions        TEXT[],
  height           VARCHAR(10),
  weight           INTEGER,
  bio              TEXT,
  photo_url        VARCHAR(500),
  college          VARCHAR(150),
  college_sport    VARCHAR(30),
  pro_team         VARCHAR(150),
  pro_draft_info   VARCHAR(200),
  is_multi_sport   BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ
);

CREATE INDEX idx_players_slug ON players(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_school ON players(primary_school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_grad_year ON players(graduation_year) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_name_trgm ON players USING GIN(name gin_trgm_ops);
CREATE INDEX idx_players_region ON players(region_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_college ON players(college) WHERE college IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE coaches (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(150) UNIQUE NOT NULL,
  name        VARCHAR(150) NOT NULL,
  region_id   VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  bio         TEXT,
  photo_url   VARCHAR(500),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_coaches_slug ON coaches(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_coaches_name_trgm ON coaches USING GIN(name gin_trgm_ops);

CREATE TABLE coaching_stints (
  id          SERIAL PRIMARY KEY,
  coach_id    INTEGER NOT NULL REFERENCES coaches(id),
  school_id   INTEGER NOT NULL REFERENCES schools(id),
  sport_id    VARCHAR(30) NOT NULL REFERENCES sports(id),
  start_year  INTEGER NOT NULL,
  end_year    INTEGER,
  role        VARCHAR(50) DEFAULT 'head_coach',
  record_wins INTEGER DEFAULT 0,
  record_losses INTEGER DEFAULT 0,
  record_ties INTEGER DEFAULT 0,
  championships INTEGER DEFAULT 0,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coaching_stints_coach ON coaching_stints(coach_id);
CREATE INDEX idx_coaching_stints_school_sport ON coaching_stints(school_id, sport_id);

CREATE TABLE transfers (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  from_school_id INTEGER REFERENCES schools(id),
  to_school_id  INTEGER REFERENCES schools(id),
  transfer_year INTEGER NOT NULL,
  sport_id      VARCHAR(30) REFERENCES sports(id),
  reason        VARCHAR(200),
  verified      BOOLEAN DEFAULT FALSE,
  source_url    VARCHAR(500),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transfers_player ON transfers(player_id);
CREATE INDEX idx_transfers_schools ON transfers(from_school_id, to_school_id);

CREATE TABLE games (
  id              SERIAL PRIMARY KEY,
  sport_id        VARCHAR(30) NOT NULL REFERENCES sports(id),
  season_id       INTEGER NOT NULL REFERENCES seasons(id),
  home_school_id  INTEGER REFERENCES schools(id),
  away_school_id  INTEGER REFERENCES schools(id),
  game_date       DATE,
  home_score      INTEGER,
  away_score      INTEGER,
  period_scores   JSONB,
  league_id       INTEGER REFERENCES leagues(id),
  venue           VARCHAR(200),
  game_type       VARCHAR(30) DEFAULT 'regular',
  playoff_round   VARCHAR(50),
  notes           TEXT,
  region_id       VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_games_sport_season ON games(sport_id, season_id);
CREATE INDEX idx_games_home_school ON games(home_school_id);
CREATE INDEX idx_games_away_school ON games(away_school_id);
CREATE INDEX idx_games_date ON games(game_date);
CREATE INDEX idx_games_type ON games(game_type) WHERE game_type != 'regular';

CREATE TABLE team_seasons (
  id              SERIAL PRIMARY KEY,
  school_id       INTEGER NOT NULL REFERENCES schools(id),
  season_id       INTEGER NOT NULL REFERENCES seasons(id),
  sport_id        VARCHAR(30) NOT NULL REFERENCES sports(id),
  wins            INTEGER DEFAULT 0,
  losses          INTEGER DEFAULT 0,
  ties            INTEGER DEFAULT 0,
  win_pct         NUMERIC(5,3),
  league_wins     INTEGER,
  league_losses   INTEGER,
  league_ties     INTEGER,
  points_for      INTEGER,
  points_against  INTEGER,
  league_finish   VARCHAR(50),
  playoff_result  VARCHAR(100),
  coach_id        INTEGER REFERENCES coaches(id),
  ranking         INTEGER,
  notes           TEXT,
  region_id       VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, season_id, sport_id)
);

CREATE INDEX idx_team_seasons_school ON team_seasons(school_id);
CREATE INDEX idx_team_seasons_sport_season ON team_seasons(sport_id, season_id);
CREATE INDEX idx_team_seasons_wins ON team_seasons(wins DESC);

CREATE TABLE championships (
  id          SERIAL PRIMARY KEY,
  school_id   INTEGER NOT NULL REFERENCES schools(id),
  season_id   INTEGER NOT NULL REFERENCES seasons(id),
  sport_id    VARCHAR(30) NOT NULL REFERENCES sports(id),
  league_id   INTEGER REFERENCES leagues(id),
  level       VARCHAR(50) NOT NULL,
  result      VARCHAR(50) DEFAULT 'champion',
  opponent_id INTEGER REFERENCES schools(id),
  score       VARCHAR(50),
  venue       VARCHAR(200),
  notes       TEXT,
  region_id   VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_championships_school ON championships(school_id);
CREATE INDEX idx_championships_sport_season ON championships(sport_id, season_id);
CREATE INDEX idx_championships_level ON championships(level);

CREATE TABLE awards (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER REFERENCES players(id),
  coach_id      INTEGER REFERENCES coaches(id),
  school_id     INTEGER REFERENCES schools(id),
  season_id     INTEGER REFERENCES seasons(id),
  sport_id      VARCHAR(30) REFERENCES sports(id),
  award_type    VARCHAR(80) NOT NULL,
  award_name    VARCHAR(200),
  category      VARCHAR(80),
  position      VARCHAR(30),
  source        VARCHAR(200),
  source_url    VARCHAR(500),
  region_id     VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_awards_player ON awards(player_id);
CREATE INDEX idx_awards_sport_season ON awards(sport_id, season_id);
CREATE INDEX idx_awards_type ON awards(award_type);
CREATE INDEX idx_awards_school ON awards(school_id);

CREATE TABLE records (
  id            SERIAL PRIMARY KEY,
  sport_id      VARCHAR(30) NOT NULL REFERENCES sports(id),
  category      VARCHAR(100) NOT NULL,
  subcategory   VARCHAR(100),
  scope         VARCHAR(30) DEFAULT 'city',
  record_value  VARCHAR(100) NOT NULL,
  record_number NUMERIC,
  player_id     INTEGER REFERENCES players(id),
  school_id     INTEGER REFERENCES schools(id),
  season_id     INTEGER REFERENCES seasons(id),
  game_id       INTEGER REFERENCES games(id),
  holder_name   VARCHAR(150),
  holder_school VARCHAR(150),
  year_set      INTEGER,
  description   TEXT,
  verified      BOOLEAN DEFAULT FALSE,
  source_url    VARCHAR(500),
  region_id     VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_records_sport ON records(sport_id);
CREATE INDEX idx_records_category ON records(category, subcategory);
CREATE INDEX idx_records_number ON records(record_number DESC NULLS LAST);

-- ============================================================================
-- 2. SPORT-SPECIFIC STAT TABLES
-- ============================================================================

CREATE TABLE football_player_seasons (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  games_played  INTEGER,
  rush_carries  INTEGER DEFAULT 0,
  rush_yards    INTEGER DEFAULT 0,
  rush_ypc      NUMERIC(5,2),
  rush_td       INTEGER DEFAULT 0,
  rush_long     INTEGER,
  pass_comp     INTEGER DEFAULT 0,
  pass_att      INTEGER DEFAULT 0,
  pass_yards    INTEGER DEFAULT 0,
  pass_td       INTEGER DEFAULT 0,
  pass_int      INTEGER DEFAULT 0,
  pass_comp_pct NUMERIC(5,2),
  pass_rating   NUMERIC(6,2),
  receptions    INTEGER DEFAULT 0,
  rec_yards     INTEGER DEFAULT 0,
  rec_ypr       NUMERIC(5,2),
  rec_td        INTEGER DEFAULT 0,
  rec_long      INTEGER,
  total_td      INTEGER DEFAULT 0,
  total_yards   INTEGER DEFAULT 0,
  points        INTEGER DEFAULT 0,
  tackles       INTEGER,
  sacks         NUMERIC(4,1),
  interceptions INTEGER,
  kick_ret_yards INTEGER,
  punt_ret_yards INTEGER,
  source_file   VARCHAR(200),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, season_id, school_id)
);

CREATE INDEX idx_fb_ps_player ON football_player_seasons(player_id);
CREATE INDEX idx_fb_ps_school_season ON football_player_seasons(school_id, season_id);
CREATE INDEX idx_fb_ps_rush_yards ON football_player_seasons(rush_yards DESC);
CREATE INDEX idx_fb_ps_pass_yards ON football_player_seasons(pass_yards DESC);
CREATE INDEX idx_fb_ps_rec_yards ON football_player_seasons(rec_yards DESC);
CREATE INDEX idx_fb_ps_total_td ON football_player_seasons(total_td DESC);

CREATE TABLE football_game_stats (
  id            SERIAL PRIMARY KEY,
  game_id       INTEGER NOT NULL REFERENCES games(id),
  player_id     INTEGER NOT NULL REFERENCES players(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  rush_carries  INTEGER DEFAULT 0,
  rush_yards    INTEGER DEFAULT 0,
  rush_td       INTEGER DEFAULT 0,
  pass_comp     INTEGER DEFAULT 0,
  pass_att      INTEGER DEFAULT 0,
  pass_yards    INTEGER DEFAULT 0,
  pass_td       INTEGER DEFAULT 0,
  pass_int      INTEGER DEFAULT 0,
  receptions    INTEGER DEFAULT 0,
  rec_yards     INTEGER DEFAULT 0,
  rec_td        INTEGER DEFAULT 0,
  total_td      INTEGER DEFAULT 0,
  points        INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

CREATE INDEX idx_fb_gs_game ON football_game_stats(game_id);
CREATE INDEX idx_fb_gs_player ON football_game_stats(player_id);

CREATE TABLE basketball_player_seasons (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  games_played  INTEGER,
  points        INTEGER DEFAULT 0,
  ppg           NUMERIC(5,2),
  rebounds      INTEGER DEFAULT 0,
  rpg           NUMERIC(5,2),
  off_rebounds   INTEGER,
  def_rebounds   INTEGER,
  assists       INTEGER DEFAULT 0,
  apg           NUMERIC(5,2),
  turnovers     INTEGER,
  steals        INTEGER DEFAULT 0,
  blocks        INTEGER DEFAULT 0,
  fgm           INTEGER,
  fga           INTEGER,
  fg_pct        NUMERIC(5,3),
  ftm           INTEGER,
  fta           INTEGER,
  ft_pct        NUMERIC(5,3),
  three_pm      INTEGER,
  three_pa      INTEGER,
  three_pct     NUMERIC(5,3),
  honor_level   VARCHAR(30),
  source_file   VARCHAR(200),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, season_id, school_id)
);

CREATE INDEX idx_bk_ps_player ON basketball_player_seasons(player_id);
CREATE INDEX idx_bk_ps_school_season ON basketball_player_seasons(school_id, season_id);
CREATE INDEX idx_bk_ps_points ON basketball_player_seasons(points DESC);
CREATE INDEX idx_bk_ps_ppg ON basketball_player_seasons(ppg DESC);
CREATE INDEX idx_bk_ps_rebounds ON basketball_player_seasons(rebounds DESC);

CREATE TABLE basketball_game_stats (
  id            SERIAL PRIMARY KEY,
  game_id       INTEGER NOT NULL REFERENCES games(id),
  player_id     INTEGER NOT NULL REFERENCES players(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  points        INTEGER DEFAULT 0,
  rebounds      INTEGER DEFAULT 0,
  assists       INTEGER DEFAULT 0,
  steals        INTEGER DEFAULT 0,
  blocks        INTEGER DEFAULT 0,
  turnovers     INTEGER,
  fgm           INTEGER,
  fga           INTEGER,
  ftm           INTEGER,
  fta           INTEGER,
  three_pm      INTEGER,
  three_pa      INTEGER,
  minutes       INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

CREATE INDEX idx_bk_gs_game ON basketball_game_stats(game_id);
CREATE INDEX idx_bk_gs_player ON basketball_game_stats(player_id);

CREATE TABLE baseball_player_seasons (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  games_played  INTEGER,
  position_type VARCHAR(10) DEFAULT 'batter',
  at_bats       INTEGER,
  hits          INTEGER,
  batting_avg   NUMERIC(5,3),
  doubles       INTEGER,
  triples       INTEGER,
  home_runs     INTEGER DEFAULT 0,
  rbi           INTEGER DEFAULT 0,
  runs          INTEGER DEFAULT 0,
  stolen_bases  INTEGER DEFAULT 0,
  walks         INTEGER,
  strikeouts_b  INTEGER,
  obp           NUMERIC(5,3),
  slg           NUMERIC(5,3),
  ops           NUMERIC(5,3),
  wins          INTEGER,
  losses        INTEGER,
  era           NUMERIC(5,2),
  innings_pitched NUMERIC(6,1),
  strikeouts_p  INTEGER,
  walks_p       INTEGER,
  hits_allowed  INTEGER,
  earned_runs   INTEGER,
  saves         INTEGER,
  source_file   VARCHAR(200),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, season_id, school_id)
);

CREATE INDEX idx_bb_ps_player ON baseball_player_seasons(player_id);
CREATE INDEX idx_bb_ps_school_season ON baseball_player_seasons(school_id, season_id);
CREATE INDEX idx_bb_ps_batting_avg ON baseball_player_seasons(batting_avg DESC NULLS LAST);
CREATE INDEX idx_bb_ps_home_runs ON baseball_player_seasons(home_runs DESC);
CREATE INDEX idx_bb_ps_era ON baseball_player_seasons(era ASC NULLS LAST) WHERE era IS NOT NULL;

-- ============================================================================
-- 3. MINOR SPORT TABLE (JSONB)
-- ============================================================================

CREATE TABLE player_seasons_misc (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  sport_id      VARCHAR(30) NOT NULL REFERENCES sports(id),
  games_played  INTEGER,
  stats         JSONB NOT NULL,
  position      VARCHAR(50),
  notes         TEXT,
  source_file   VARCHAR(200),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, season_id, school_id, sport_id)
);

CREATE INDEX idx_misc_ps_player ON player_seasons_misc(player_id);
CREATE INDEX idx_misc_ps_sport_season ON player_seasons_misc(sport_id, season_id);
CREATE INDEX idx_misc_ps_school ON player_seasons_misc(school_id);
CREATE INDEX idx_misc_ps_stats ON player_seasons_misc USING GIN(stats);

ALTER TABLE player_seasons_misc ADD CONSTRAINT chk_track_stats
  CHECK (sport_id != 'track' OR (stats ? 'event'));

ALTER TABLE player_seasons_misc ADD CONSTRAINT chk_wrestling_stats
  CHECK (sport_id != 'wrestling' OR (stats ? 'weight_class'));

ALTER TABLE player_seasons_misc ADD CONSTRAINT chk_soccer_stats
  CHECK (sport_id != 'soccer' OR (stats ? 'goals' OR stats ? 'saves'));

-- ============================================================================
-- 4. SYSTEM TABLES
-- ============================================================================

CREATE TABLE import_logs (
  id            SERIAL PRIMARY KEY,
  sport_id      VARCHAR(30) REFERENCES sports(id),
  source_type   VARCHAR(50) NOT NULL,
  source_file   VARCHAR(500),
  records_found INTEGER DEFAULT 0,
  records_imported INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  warnings      JSONB,
  errors        JSONB,
  status        VARCHAR(20) DEFAULT 'pending',
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  imported_by   UUID,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_import_logs_sport ON import_logs(sport_id);
CREATE INDEX idx_import_logs_status ON import_logs(status);

CREATE TABLE audit_log (
  id            BIGSERIAL PRIMARY KEY,
  table_name    VARCHAR(80) NOT NULL,
  record_id     INTEGER NOT NULL,
  field_name    VARCHAR(80) NOT NULL,
  old_value     TEXT,
  new_value     TEXT,
  action        VARCHAR(20) NOT NULL,
  changed_by    UUID,
  change_reason VARCHAR(500),
  import_log_id INTEGER REFERENCES import_logs(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
CREATE INDEX idx_audit_user ON audit_log(changed_by);

CREATE TABLE data_conflicts (
  id              SERIAL PRIMARY KEY,
  sport_id        VARCHAR(30) REFERENCES sports(id),
  entity_type     VARCHAR(50) NOT NULL,
  entity_id       INTEGER,
  entity_name     VARCHAR(200),
  field_name      VARCHAR(80) NOT NULL,
  our_value       TEXT,
  external_value  TEXT,
  source_name     VARCHAR(100),
  source_url      VARCHAR(500),
  confidence      VARCHAR(20) DEFAULT 'medium',
  severity        VARCHAR(20) DEFAULT 'minor',
  status          VARCHAR(20) DEFAULT 'open',
  resolved_value  TEXT,
  resolved_by     UUID,
  resolved_at     TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conflicts_status ON data_conflicts(status) WHERE status = 'open';
CREATE INDEX idx_conflicts_sport ON data_conflicts(sport_id);
CREATE INDEX idx_conflicts_severity ON data_conflicts(severity);
CREATE INDEX idx_conflicts_entity ON data_conflicts(entity_type, entity_id);

CREATE TABLE search_index (
  id            SERIAL PRIMARY KEY,
  entity_type   VARCHAR(30) NOT NULL,
  entity_id     INTEGER NOT NULL,
  sport_id      VARCHAR(30) REFERENCES sports(id),
  display_name  VARCHAR(300) NOT NULL,
  context       VARCHAR(500),
  search_text   TEXT NOT NULL,
  url_path      VARCHAR(300),
  popularity    INTEGER DEFAULT 0,
  region_id     VARCHAR(50) DEFAULT 'philadelphia',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_entity ON search_index(entity_type, entity_id);
CREATE INDEX idx_search_text ON search_index USING GIN(search_text gin_trgm_ops);
CREATE INDEX idx_search_sport ON search_index(sport_id);
CREATE INDEX idx_search_popularity ON search_index(popularity DESC);

ALTER TABLE search_index ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', search_text)) STORED;
CREATE INDEX idx_search_fts ON search_index USING GIN(fts);

CREATE TABLE precomputed_cache (
  id            SERIAL PRIMARY KEY,
  cache_key     VARCHAR(200) UNIQUE NOT NULL,
  sport_id      VARCHAR(30) REFERENCES sports(id),
  query_type    VARCHAR(80) NOT NULL,
  filters       JSONB,
  result_data   JSONB NOT NULL,
  record_count  INTEGER,
  computed_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cache_key ON precomputed_cache(cache_key);
CREATE INDEX idx_cache_sport ON precomputed_cache(sport_id, query_type);

-- ============================================================================
-- 5. MATERIALIZED VIEWS
-- ============================================================================

CREATE MATERIALIZED VIEW football_career_leaders AS
SELECT
  p.id AS player_id,
  p.name AS player_name,
  p.slug AS player_slug,
  p.graduation_year,
  p.college,
  s.id AS school_id,
  s.name AS school_name,
  s.slug AS school_slug,
  l.slug AS league_slug,
  COUNT(fs.id) AS seasons_played,
  MIN(se.year_start) AS first_year,
  MAX(se.year_end) AS last_year,
  SUM(fs.games_played) AS career_games,
  SUM(fs.rush_carries) AS career_rush_carries,
  SUM(fs.rush_yards) AS career_rush_yards,
  SUM(fs.rush_td) AS career_rush_td,
  SUM(fs.pass_comp) AS career_pass_comp,
  SUM(fs.pass_att) AS career_pass_att,
  SUM(fs.pass_yards) AS career_pass_yards,
  SUM(fs.pass_td) AS career_pass_td,
  SUM(fs.pass_int) AS career_pass_int,
  SUM(fs.receptions) AS career_receptions,
  SUM(fs.rec_yards) AS career_rec_yards,
  SUM(fs.rec_td) AS career_rec_td,
  SUM(fs.total_td) AS career_total_td,
  SUM(fs.total_yards) AS career_total_yards,
  SUM(fs.points) AS career_points
FROM players p
JOIN football_player_seasons fs ON fs.player_id = p.id
JOIN schools s ON s.id = fs.school_id
LEFT JOIN leagues l ON l.id = s.league_id
JOIN seasons se ON se.id = fs.season_id
WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
GROUP BY p.id, p.name, p.slug, p.graduation_year, p.college,
         s.id, s.name, s.slug, l.slug;

CREATE UNIQUE INDEX idx_fb_leaders_player ON football_career_leaders(player_id);
CREATE INDEX idx_fb_leaders_rush_yards ON football_career_leaders(career_rush_yards DESC);
CREATE INDEX idx_fb_leaders_pass_yards ON football_career_leaders(career_pass_yards DESC);
CREATE INDEX idx_fb_leaders_rec_yards ON football_career_leaders(career_rec_yards DESC);
CREATE INDEX idx_fb_leaders_total_td ON football_career_leaders(career_total_td DESC);
CREATE INDEX idx_fb_leaders_league ON football_career_leaders(league_slug);

CREATE MATERIALIZED VIEW basketball_career_leaders AS
SELECT
  p.id AS player_id,
  p.name AS player_name,
  p.slug AS player_slug,
  p.graduation_year,
  p.college,
  p.pro_team,
  s.id AS school_id,
  s.name AS school_name,
  s.slug AS school_slug,
  l.slug AS league_slug,
  COUNT(bs.id) AS seasons_played,
  MIN(se.year_start) AS first_year,
  MAX(se.year_end) AS last_year,
  SUM(bs.games_played) AS career_games,
  SUM(bs.points) AS career_points,
  CASE WHEN SUM(bs.games_played) > 0
       THEN ROUND(SUM(bs.points)::NUMERIC / SUM(bs.games_played), 2)
       ELSE 0 END AS career_ppg,
  SUM(bs.rebounds) AS career_rebounds,
  SUM(bs.assists) AS career_assists,
  SUM(bs.steals) AS career_steals,
  SUM(bs.blocks) AS career_blocks,
  SUM(bs.three_pm) AS career_three_pm
FROM players p
JOIN basketball_player_seasons bs ON bs.player_id = p.id
JOIN schools s ON s.id = bs.school_id
LEFT JOIN leagues l ON l.id = s.league_id
JOIN seasons se ON se.id = bs.season_id
WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
GROUP BY p.id, p.name, p.slug, p.graduation_year, p.college, p.pro_team,
         s.id, s.name, s.slug, l.slug;

CREATE UNIQUE INDEX idx_bk_leaders_player ON basketball_career_leaders(player_id);
CREATE INDEX idx_bk_leaders_points ON basketball_career_leaders(career_points DESC);
CREATE INDEX idx_bk_leaders_ppg ON basketball_career_leaders(career_ppg DESC);
CREATE INDEX idx_bk_leaders_rebounds ON basketball_career_leaders(career_rebounds DESC);
CREATE INDEX idx_bk_leaders_league ON basketball_career_leaders(league_slug);

CREATE MATERIALIZED VIEW season_leaderboards AS
SELECT
  'football' AS sport_id,
  fs.season_id,
  se.label AS season_label,
  p.id AS player_id,
  p.name AS player_name,
  p.slug AS player_slug,
  s.name AS school_name,
  s.slug AS school_slug,
  'rush_yards' AS stat_category,
  fs.rush_yards AS stat_value
FROM football_player_seasons fs
JOIN players p ON p.id = fs.player_id
JOIN schools s ON s.id = fs.school_id
JOIN seasons se ON se.id = fs.season_id
WHERE p.deleted_at IS NULL AND fs.rush_yards IS NOT NULL

UNION ALL

SELECT
  'football', fs.season_id, se.label, p.id, p.name, p.slug,
  s.name, s.slug, 'pass_yards', fs.pass_yards
FROM football_player_seasons fs
JOIN players p ON p.id = fs.player_id
JOIN schools s ON s.id = fs.school_id
JOIN seasons se ON se.id = fs.season_id
WHERE p.deleted_at IS NULL AND fs.pass_yards IS NOT NULL

UNION ALL

SELECT
  'basketball', bs.season_id, se.label, p.id, p.name, p.slug,
  s.name, s.slug, 'points', bs.points
FROM basketball_player_seasons bs
JOIN players p ON p.id = bs.player_id
JOIN schools s ON s.id = bs.school_id
JOIN seasons se ON se.id = bs.season_id
WHERE p.deleted_at IS NULL AND bs.points IS NOT NULL

UNION ALL

SELECT
  'basketball', bs.season_id, se.label, p.id, p.name, p.slug,
  s.name, s.slug, 'ppg', bs.ppg::INTEGER
FROM basketball_player_seasons bs
JOIN players p ON p.id = bs.player_id
JOIN schools s ON s.id = bs.school_id
JOIN seasons se ON se.id = bs.season_id
WHERE p.deleted_at IS NULL AND bs.ppg IS NOT NULL;

CREATE INDEX idx_season_lb_sport_stat ON season_leaderboards(sport_id, stat_category, stat_value DESC);
CREATE INDEX idx_season_lb_season ON season_leaderboards(season_id, sport_id);

-- ============================================================================
-- 6. ROW-LEVEL SECURITY
-- ============================================================================

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_stints ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_player_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE basketball_player_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE basketball_game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE baseball_player_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_seasons_misc ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE precomputed_cache ENABLE ROW LEVEL SECURITY;

-- Public read (non-deleted for soft-delete tables, all for others)
CREATE POLICY "Public read access" ON schools FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read access" ON players FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read access" ON coaches FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read access" ON sports FOR SELECT USING (true);
CREATE POLICY "Public read access" ON leagues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON regions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON coaching_stints FOR SELECT USING (true);
CREATE POLICY "Public read access" ON games FOR SELECT USING (true);
CREATE POLICY "Public read access" ON team_seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON championships FOR SELECT USING (true);
CREATE POLICY "Public read access" ON awards FOR SELECT USING (true);
CREATE POLICY "Public read access" ON records FOR SELECT USING (true);
CREATE POLICY "Public read access" ON football_player_seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON football_game_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON basketball_player_seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON basketball_game_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON baseball_player_seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_seasons_misc FOR SELECT USING (true);
CREATE POLICY "Public read access" ON search_index FOR SELECT USING (true);
CREATE POLICY "Public read access" ON precomputed_cache FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transfers FOR SELECT USING (true);

-- Admin full CRUD (authenticated users)
CREATE POLICY "Admin full access" ON schools FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON players FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON coaches FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON coaching_stints FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON transfers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON games FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON team_seasons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON championships FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON awards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON football_player_seasons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON football_game_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON basketball_player_seasons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON basketball_game_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON baseball_player_seasons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON player_seasons_misc FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON import_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON audit_log FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON data_conflicts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON search_index FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON precomputed_cache FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 7. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders;
  REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders;
  REFRESH MATERIALIZED VIEW season_leaderboards;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION soft_delete(
  p_table TEXT,
  p_id INTEGER,
  p_user_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1', p_table)
  USING p_id;

  INSERT INTO audit_log (table_name, record_id, field_name, old_value, new_value, action, changed_by)
  VALUES (p_table, p_id, 'deleted_at', NULL, NOW()::TEXT, 'delete', p_user_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restore_record(
  p_table TEXT,
  p_id INTEGER,
  p_user_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NULL, updated_at = NOW() WHERE id = $1', p_table)
  USING p_id;

  INSERT INTO audit_log (table_name, record_id, field_name, old_value, new_value, action, changed_by)
  VALUES (p_table, p_id, 'deleted_at', 'deleted', NULL, 'restore', p_user_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER trg_schools_updated BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_players_updated BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_coaches_updated BEFORE UPDATE ON coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_games_updated BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_team_seasons_updated BEFORE UPDATE ON team_seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_championships_updated BEFORE UPDATE ON championships FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_awards_updated BEFORE UPDATE ON awards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_records_updated BEFORE UPDATE ON records FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_fb_ps_updated BEFORE UPDATE ON football_player_seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bk_ps_updated BEFORE UPDATE ON basketball_player_seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bb_ps_updated BEFORE UPDATE ON baseball_player_seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_misc_ps_updated BEFORE UPDATE ON player_seasons_misc FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 8. SEED DATA
-- ============================================================================

INSERT INTO regions (id, name, state, metro_area) VALUES
  ('philadelphia', 'Philadelphia', 'PA', 'Greater Philadelphia');

INSERT INTO sports (id, name, emoji, sort_order, is_major) VALUES
  ('football',    'Football',      '🏈', 1, TRUE),
  ('basketball',  'Basketball',    '🏀', 2, TRUE),
  ('baseball',    'Baseball',      '⚾', 3, TRUE),
  ('track',       'Track & Field', '🏃', 4, FALSE),
  ('soccer',      'Soccer',        '⚽', 5, FALSE),
  ('lacrosse',    'Lacrosse',      '🥍', 6, FALSE),
  ('wrestling',   'Wrestling',     '🤼', 7, FALSE);

INSERT INTO leagues (slug, name, short_name, region_id, founded_year) VALUES
  ('catholic-league',  'Philadelphia Catholic League',  'PCL',  'philadelphia', 1920),
  ('public-league',    'Philadelphia Public League',    'PL',   'philadelphia', 1913),
  ('inter-ac',         'Inter-Academic League',         'IA',   'philadelphia', 1887),
  ('sol-conference',   'Suburban One League',           'SOL',  'philadelphia', NULL),
  ('bicentennial',     'Bicentennial Athletic League',  'BAL',  'philadelphia', NULL),
  ('del-val',          'Del Val League',                'DVL',  'philadelphia', NULL),
  ('independent',      'Independent',                   'IND',  'philadelphia', NULL),
  ('piaa-1a',          'PIAA District 12 Class 1A',     '1A',   'philadelphia', NULL),
  ('piaa-2a',          'PIAA District 12 Class 2A',     '2A',   'philadelphia', NULL),
  ('piaa-3a',          'PIAA District 12 Class 3A',     '3A',   'philadelphia', NULL),
  ('piaa-4a',          'PIAA District 12 Class 4A',     '4A',   'philadelphia', NULL),
  ('piaa-5a',          'PIAA District 12 Class 5A',     '5A',   'philadelphia', NULL),
  ('piaa-6a',          'PIAA District 12 Class 6A',     '6A',   'philadelphia', NULL);

INSERT INTO seasons (year_start, year_end, label) VALUES
  (1950, 1951, '1950-51'), (1951, 1952, '1951-52'), (1952, 1953, '1952-53'),
  (1953, 1954, '1953-54'), (1954, 1955, '1954-55'), (1955, 1956, '1955-56'),
  (1956, 1957, '1956-57'), (1957, 1958, '1957-58'), (1958, 1959, '1958-59'),
  (1959, 1960, '1959-60'), (1960, 1961, '1960-61'), (1961, 1962, '1961-62'),
  (1962, 1963, '1962-63'), (1963, 1964, '1963-64'), (1964, 1965, '1964-65'),
  (1965, 1966, '1965-66'), (1966, 1967, '1966-67'), (1967, 1968, '1967-68'),
  (1968, 1969, '1968-69'), (1969, 1970, '1969-70'), (1970, 1971, '1970-71'),
  (1971, 1972, '1971-72'), (1972, 1973, '1972-73'), (1973, 1974, '1973-74'),
  (1974, 1975, '1974-75'), (1975, 1976, '1975-76'), (1976, 1977, '1976-77'),
  (1977, 1978, '1977-78'), (1978, 1979, '1978-79'), (1979, 1980, '1979-80'),
  (1980, 1981, '1980-81'), (1981, 1982, '1981-82'), (1982, 1983, '1982-83'),
  (1983, 1984, '1983-84'), (1984, 1985, '1984-85'), (1985, 1986, '1985-86'),
  (1986, 1987, '1986-87'), (1987, 1988, '1987-88'), (1988, 1989, '1988-89'),
  (1989, 1990, '1989-90'), (1990, 1991, '1990-91'), (1991, 1992, '1991-92'),
  (1992, 1993, '1992-93'), (1993, 1994, '1993-94'), (1994, 1995, '1994-95'),
  (1995, 1996, '1995-96'), (1996, 1997, '1996-97'), (1997, 1998, '1997-98'),
  (1998, 1999, '1998-99'), (1999, 2000, '1999-00'), (2000, 2001, '2000-01'),
  (2001, 2002, '2001-02'), (2002, 2003, '2002-03'), (2003, 2004, '2003-04'),
  (2004, 2005, '2004-05'), (2005, 2006, '2005-06'), (2006, 2007, '2006-07'),
  (2007, 2008, '2007-08'), (2008, 2009, '2008-09'), (2009, 2010, '2009-10'),
  (2010, 2011, '2010-11'), (2011, 2012, '2011-12'), (2012, 2013, '2012-13'),
  (2013, 2014, '2013-14'), (2014, 2015, '2014-15'), (2015, 2016, '2015-16'),
  (2016, 2017, '2016-17'), (2017, 2018, '2017-18'), (2018, 2019, '2018-19'),
  (2019, 2020, '2019-20'), (2020, 2021, '2020-21'), (2021, 2022, '2021-22'),
  (2022, 2023, '2022-23'), (2023, 2024, '2023-24'), (2024, 2025, '2024-25'),
  (2025, 2026, '2025-26');
