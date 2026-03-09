-- ============================================================================
-- PhillySportsPack.com — Complete PostgreSQL Schema
-- Version: 1.0.0
-- Date: March 2026
-- Platform: Supabase (PostgreSQL 15+)
-- ============================================================================
-- Design Decisions:
--   • Hybrid model: typed tables for football/basketball/baseball, JSONB for minor sports
--   • One league per school (simplified)
--   • Soft deletes (deleted_at) on all entity tables
--   • Field-level audit log for full undo capability
--   • Region column for future multi-city expansion
--   • Final scores + optional JSONB period detail for games
--   • Materialized views + JSON cache for career totals
--   • Transfers table + multiple season records for transfer tracking
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- trigram fuzzy matching for search

-- ============================================================================
-- 1. SHARED ENTITY TABLES
-- ============================================================================

-- Regions (for future multi-city expansion)
CREATE TABLE regions (
  id          VARCHAR(50) PRIMARY KEY,           -- 'philadelphia', 'pittsburgh', etc.
  name        VARCHAR(100) NOT NULL,
  state       VARCHAR(2) NOT NULL DEFAULT 'PA',
  metro_area  VARCHAR(100),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Sports
CREATE TABLE sports (
  id          VARCHAR(30) PRIMARY KEY,           -- 'football', 'basketball', etc.
  name        VARCHAR(50) NOT NULL,
  emoji       VARCHAR(10),
  sort_order  INTEGER DEFAULT 0,
  stat_schema JSONB,                             -- describes expected stat columns for validation
  is_major    BOOLEAN DEFAULT FALSE,             -- true for football/basketball/baseball
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Leagues
CREATE TABLE leagues (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(80) UNIQUE NOT NULL,       -- 'catholic-league', 'public-league', 'inter-ac'
  name        VARCHAR(100) NOT NULL,
  short_name  VARCHAR(30),                       -- 'PCL', 'PL', 'IA'
  region_id   VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  level       VARCHAR(20) DEFAULT 'high_school',
  founded_year INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seasons
CREATE TABLE seasons (
  id          SERIAL PRIMARY KEY,
  year_start  INTEGER NOT NULL,
  year_end    INTEGER NOT NULL,
  label       VARCHAR(20) NOT NULL,              -- "2024-25"
  UNIQUE(year_start, year_end)
);

CREATE INDEX idx_seasons_years ON seasons(year_start, year_end);

-- Schools
CREATE TABLE schools (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(100) UNIQUE NOT NULL,  -- "saint-josephs-prep"
  name            VARCHAR(150) NOT NULL,
  short_name      VARCHAR(50),                   -- "SJP"
  city            VARCHAR(50) DEFAULT 'Philadelphia',
  state           VARCHAR(2) DEFAULT 'PA',
  region_id       VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  league_id       INTEGER REFERENCES leagues(id),
  founded_year    INTEGER,
  closed_year     INTEGER,                       -- NULL if still open
  logo_url        VARCHAR(500),
  mascot          VARCHAR(100),
  colors          JSONB,                         -- {"primary": "#00247d", "secondary": "#fff"}
  address         TEXT,
  website_url     VARCHAR(500),
  aliases         TEXT[],                        -- {"SJ Prep", "St. Joe's Prep", "Saint Joseph's Prep"}
  v4_id           VARCHAR(100),                  -- original v4 JSON identifier
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ                    -- soft delete
);

CREATE INDEX idx_schools_slug ON schools(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_league ON schools(league_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_region ON schools(region_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_aliases ON schools USING GIN(aliases);
CREATE INDEX idx_schools_name_trgm ON schools USING GIN(name gin_trgm_ops);

-- Players
CREATE TABLE players (
  id               SERIAL PRIMARY KEY,
  slug             VARCHAR(150) UNIQUE NOT NULL, -- "brian-westbrook-1998"
  name             VARCHAR(150) NOT NULL,
  first_name       VARCHAR(75),
  last_name        VARCHAR(75),
  primary_school_id INTEGER REFERENCES schools(id),
  region_id        VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  graduation_year  INTEGER,
  positions        TEXT[],                       -- {"QB", "S"}
  height           VARCHAR(10),                  -- "6-2"
  weight           INTEGER,                      -- pounds
  bio              TEXT,
  photo_url        VARCHAR(500),
  -- Enrichment fields (from Step 7-9 verification)
  college          VARCHAR(150),                 -- where they played after HS
  college_sport    VARCHAR(30),                  -- might differ from HS sport
  pro_team         VARCHAR(150),                 -- NFL/NBA/MLB team if applicable
  pro_draft_info   VARCHAR(200),                 -- "2002 NFL Draft, Round 3, Pick 91"
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

-- Coaches
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

-- Coaching Stints
CREATE TABLE coaching_stints (
  id          SERIAL PRIMARY KEY,
  coach_id    INTEGER NOT NULL REFERENCES coaches(id),
  school_id   INTEGER NOT NULL REFERENCES schools(id),
  sport_id    VARCHAR(30) NOT NULL REFERENCES sports(id),
  start_year  INTEGER NOT NULL,
  end_year    INTEGER,                           -- NULL if current
  role        VARCHAR(50) DEFAULT 'head_coach',  -- head_coach, assistant, coordinator
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

-- Transfers
CREATE TABLE transfers (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  from_school_id INTEGER REFERENCES schools(id), -- NULL if incoming from outside region
  to_school_id  INTEGER REFERENCES schools(id),  -- NULL if leaving region
  transfer_year INTEGER NOT NULL,
  sport_id      VARCHAR(30) REFERENCES sports(id),
  reason        VARCHAR(200),
  verified      BOOLEAN DEFAULT FALSE,
  source_url    VARCHAR(500),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transfers_player ON transfers(player_id);
CREATE INDEX idx_transfers_schools ON transfers(from_school_id, to_school_id);

-- Games
CREATE TABLE games (
  id              SERIAL PRIMARY KEY,
  sport_id        VARCHAR(30) NOT NULL REFERENCES sports(id),
  season_id       INTEGER NOT NULL REFERENCES seasons(id),
  home_school_id  INTEGER REFERENCES schools(id),
  away_school_id  INTEGER REFERENCES schools(id),
  game_date       DATE,
  home_score      INTEGER,
  away_score      INTEGER,
  period_scores   JSONB,                         -- {"home": [7, 14, 0, 10], "away": [3, 7, 7, 0]}
  league_id       INTEGER REFERENCES leagues(id),
  venue           VARCHAR(200),
  game_type       VARCHAR(30) DEFAULT 'regular', -- regular, playoff, championship, scrimmage
  playoff_round   VARCHAR(50),                   -- "quarterfinal", "semifinal", "final"
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

-- Team Seasons
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
  league_finish   VARCHAR(50),                   -- "1st", "2nd", "Co-champions"
  playoff_result  VARCHAR(100),                  -- "State Champions", "Lost in semifinals"
  coach_id        INTEGER REFERENCES coaches(id),
  ranking         INTEGER,                       -- end-of-season ranking
  notes           TEXT,
  region_id       VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, season_id, sport_id)
);

CREATE INDEX idx_team_seasons_school ON team_seasons(school_id);
CREATE INDEX idx_team_seasons_sport_season ON team_seasons(sport_id, season_id);
CREATE INDEX idx_team_seasons_wins ON team_seasons(wins DESC);

-- Championships
CREATE TABLE championships (
  id          SERIAL PRIMARY KEY,
  school_id   INTEGER NOT NULL REFERENCES schools(id),
  season_id   INTEGER NOT NULL REFERENCES seasons(id),
  sport_id    VARCHAR(30) NOT NULL REFERENCES sports(id),
  league_id   INTEGER REFERENCES leagues(id),
  level       VARCHAR(50) NOT NULL,              -- 'league', 'district', 'state', 'city'
  result      VARCHAR(50) DEFAULT 'champion',    -- 'champion', 'runner-up', 'semifinalist'
  opponent_id INTEGER REFERENCES schools(id),
  score       VARCHAR(50),                       -- "28-14"
  venue       VARCHAR(200),
  notes       TEXT,
  region_id   VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_championships_school ON championships(school_id);
CREATE INDEX idx_championships_sport_season ON championships(sport_id, season_id);
CREATE INDEX idx_championships_level ON championships(level);

-- Awards
CREATE TABLE awards (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER REFERENCES players(id),
  coach_id      INTEGER REFERENCES coaches(id),  -- some awards go to coaches
  school_id     INTEGER REFERENCES schools(id),
  season_id     INTEGER REFERENCES seasons(id),
  sport_id      VARCHAR(30) REFERENCES sports(id),
  award_type    VARCHAR(80) NOT NULL,            -- 'all-city', 'all-state', 'all-american', 'mvp', 'all-catholic', 'all-public', 'all-inter-ac'
  award_name    VARCHAR(200),                    -- specific name if applicable
  category      VARCHAR(80),                     -- 'first-team', 'second-team', 'honorable-mention'
  position      VARCHAR(30),                     -- position awarded for
  source        VARCHAR(200),                    -- who gave the award
  source_url    VARCHAR(500),
  region_id     VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_awards_player ON awards(player_id);
CREATE INDEX idx_awards_sport_season ON awards(sport_id, season_id);
CREATE INDEX idx_awards_type ON awards(award_type);
CREATE INDEX idx_awards_school ON awards(school_id);

-- Records
CREATE TABLE records (
  id            SERIAL PRIMARY KEY,
  sport_id      VARCHAR(30) NOT NULL REFERENCES sports(id),
  category      VARCHAR(100) NOT NULL,           -- 'career_rushing_yards', 'single_game_passing_td'
  subcategory   VARCHAR(100),                    -- 'catholic_league', 'city', 'school'
  scope         VARCHAR(30) DEFAULT 'city',      -- 'city', 'league', 'school', 'state'
  record_value  VARCHAR(100) NOT NULL,           -- "2,034 yards" (text for flexibility)
  record_number NUMERIC,                         -- 2034 (numeric for sorting)
  player_id     INTEGER REFERENCES players(id),
  school_id     INTEGER REFERENCES schools(id),
  season_id     INTEGER REFERENCES seasons(id),
  game_id       INTEGER REFERENCES games(id),
  holder_name   VARCHAR(150),                    -- for historical records where player isn't in DB
  holder_school VARCHAR(150),                    -- ditto for school
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
-- 2. SPORT-SPECIFIC STAT TABLES (typed columns for major sports)
-- ============================================================================

-- Football Player Seasons
CREATE TABLE football_player_seasons (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  games_played  INTEGER,
  -- Rushing
  rush_carries  INTEGER DEFAULT 0,
  rush_yards    INTEGER DEFAULT 0,
  rush_ypc      NUMERIC(5,2),
  rush_td       INTEGER DEFAULT 0,
  rush_long     INTEGER,
  -- Passing
  pass_comp     INTEGER DEFAULT 0,
  pass_att      INTEGER DEFAULT 0,
  pass_yards    INTEGER DEFAULT 0,
  pass_td       INTEGER DEFAULT 0,
  pass_int      INTEGER DEFAULT 0,
  pass_comp_pct NUMERIC(5,2),
  pass_rating   NUMERIC(6,2),
  -- Receiving
  receptions    INTEGER DEFAULT 0,
  rec_yards     INTEGER DEFAULT 0,
  rec_ypr       NUMERIC(5,2),
  rec_td        INTEGER DEFAULT 0,
  rec_long      INTEGER,
  -- Totals
  total_td      INTEGER DEFAULT 0,
  total_yards   INTEGER DEFAULT 0,               -- yards from scrimmage
  points        INTEGER DEFAULT 0,
  -- Defensive (when available)
  tackles       INTEGER,
  sacks         NUMERIC(4,1),
  interceptions INTEGER,
  -- Special teams
  kick_ret_yards INTEGER,
  punt_ret_yards INTEGER,
  -- Meta
  source_file   VARCHAR(200),                    -- original HTML filename
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

-- Football Game Stats
CREATE TABLE football_game_stats (
  id            SERIAL PRIMARY KEY,
  game_id       INTEGER NOT NULL REFERENCES games(id),
  player_id     INTEGER NOT NULL REFERENCES players(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  -- Rushing
  rush_carries  INTEGER DEFAULT 0,
  rush_yards    INTEGER DEFAULT 0,
  rush_td       INTEGER DEFAULT 0,
  -- Passing
  pass_comp     INTEGER DEFAULT 0,
  pass_att      INTEGER DEFAULT 0,
  pass_yards    INTEGER DEFAULT 0,
  pass_td       INTEGER DEFAULT 0,
  pass_int      INTEGER DEFAULT 0,
  -- Receiving
  receptions    INTEGER DEFAULT 0,
  rec_yards     INTEGER DEFAULT 0,
  rec_td        INTEGER DEFAULT 0,
  -- Totals
  total_td      INTEGER DEFAULT 0,
  points        INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

CREATE INDEX idx_fb_gs_game ON football_game_stats(game_id);
CREATE INDEX idx_fb_gs_player ON football_game_stats(player_id);

-- Basketball Player Seasons
CREATE TABLE basketball_player_seasons (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  games_played  INTEGER,
  -- Scoring
  points        INTEGER DEFAULT 0,
  ppg           NUMERIC(5,2),
  -- Rebounds
  rebounds      INTEGER DEFAULT 0,
  rpg           NUMERIC(5,2),
  off_rebounds   INTEGER,
  def_rebounds   INTEGER,
  -- Assists/Turnovers
  assists       INTEGER DEFAULT 0,
  apg           NUMERIC(5,2),
  turnovers     INTEGER,
  -- Defense
  steals        INTEGER DEFAULT 0,
  blocks        INTEGER DEFAULT 0,
  -- Shooting
  fgm           INTEGER,
  fga           INTEGER,
  fg_pct        NUMERIC(5,3),
  ftm           INTEGER,
  fta           INTEGER,
  ft_pct        NUMERIC(5,3),
  three_pm      INTEGER,
  three_pa      INTEGER,
  three_pct     NUMERIC(5,3),
  -- Honors (quick reference — detailed honors in awards table)
  honor_level   VARCHAR(30),                     -- 'all-american', 'all-state', 'all-city', etc.
  -- Meta
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

-- Basketball Game Stats
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

-- Baseball Player Seasons
CREATE TABLE baseball_player_seasons (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  games_played  INTEGER,
  position_type VARCHAR(10) DEFAULT 'batter',    -- 'batter', 'pitcher', 'both'
  -- Batting
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
  strikeouts_b  INTEGER,                         -- strikeouts as batter
  obp           NUMERIC(5,3),
  slg           NUMERIC(5,3),
  ops           NUMERIC(5,3),
  -- Pitching
  wins          INTEGER,
  losses        INTEGER,
  era           NUMERIC(5,2),
  innings_pitched NUMERIC(6,1),
  strikeouts_p  INTEGER,                         -- strikeouts as pitcher
  walks_p       INTEGER,
  hits_allowed  INTEGER,
  earned_runs   INTEGER,
  saves         INTEGER,
  -- Meta
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
-- 3. MINOR SPORT TABLE (JSONB stats for flexible schemas)
-- ============================================================================

CREATE TABLE player_seasons_misc (
  id            SERIAL PRIMARY KEY,
  player_id     INTEGER NOT NULL REFERENCES players(id),
  season_id     INTEGER NOT NULL REFERENCES seasons(id),
  school_id     INTEGER NOT NULL REFERENCES schools(id),
  sport_id      VARCHAR(30) NOT NULL REFERENCES sports(id),
  games_played  INTEGER,
  stats         JSONB NOT NULL,                  -- sport-specific stats
  -- Examples:
  --   Track: {"event": "100m", "time": "10.8", "place": 1, "meet": "PIAA States"}
  --   Wrestling: {"weight_class": 145, "wins": 32, "losses": 2, "pins": 18}
  --   Soccer: {"goals": 15, "assists": 8, "shots": 42}
  --   Lacrosse: {"goals": 42, "assists": 18, "ground_balls": 67}
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

-- CHECK constraints for known minor sport stat shapes
ALTER TABLE player_seasons_misc ADD CONSTRAINT chk_track_stats
  CHECK (sport_id != 'track' OR (stats ? 'event'));

ALTER TABLE player_seasons_misc ADD CONSTRAINT chk_wrestling_stats
  CHECK (sport_id != 'wrestling' OR (stats ? 'weight_class'));

ALTER TABLE player_seasons_misc ADD CONSTRAINT chk_soccer_stats
  CHECK (sport_id != 'soccer' OR (stats ? 'goals' OR stats ? 'saves'));

-- ============================================================================
-- 4. SYSTEM TABLES
-- ============================================================================

-- Import Logs
CREATE TABLE import_logs (
  id            SERIAL PRIMARY KEY,
  sport_id      VARCHAR(30) REFERENCES sports(id),
  source_type   VARCHAR(50) NOT NULL,            -- 'html', 'json', 'csv', 'xlsx', 'sqlite'
  source_file   VARCHAR(500),
  records_found INTEGER DEFAULT 0,
  records_imported INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  warnings      JSONB,                           -- [{"type": "fuzzy_match", "detail": "..."}]
  errors        JSONB,                           -- [{"type": "parse_error", "detail": "..."}]
  status        VARCHAR(20) DEFAULT 'pending',   -- pending, running, completed, failed
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  imported_by   UUID,                            -- Supabase auth user id
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_import_logs_sport ON import_logs(sport_id);
CREATE INDEX idx_import_logs_status ON import_logs(status);

-- Audit Log (field-level granularity)
CREATE TABLE audit_log (
  id            BIGSERIAL PRIMARY KEY,
  table_name    VARCHAR(80) NOT NULL,
  record_id     INTEGER NOT NULL,
  field_name    VARCHAR(80) NOT NULL,
  old_value     TEXT,
  new_value     TEXT,
  action        VARCHAR(20) NOT NULL,            -- 'create', 'update', 'delete', 'restore'
  changed_by    UUID,                            -- Supabase auth user id
  change_reason VARCHAR(500),
  import_log_id INTEGER REFERENCES import_logs(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
CREATE INDEX idx_audit_user ON audit_log(changed_by);

-- Data Conflicts (from verification steps 7-10)
CREATE TABLE data_conflicts (
  id              SERIAL PRIMARY KEY,
  sport_id        VARCHAR(30) REFERENCES sports(id),
  entity_type     VARCHAR(50) NOT NULL,          -- 'player', 'school', 'team_season', 'award', 'record'
  entity_id       INTEGER,                       -- FK to the relevant table
  entity_name     VARCHAR(200),                  -- human-readable identifier
  field_name      VARCHAR(80) NOT NULL,
  our_value       TEXT,
  external_value  TEXT,
  source_name     VARCHAR(100),                  -- 'MaxPreps', 'PIAA', 'Inquirer', etc.
  source_url      VARCHAR(500),
  confidence      VARCHAR(20) DEFAULT 'medium',  -- 'low', 'medium', 'high'
  severity        VARCHAR(20) DEFAULT 'minor',   -- 'critical', 'major', 'minor'
  status          VARCHAR(20) DEFAULT 'open',    -- 'open', 'resolved_ours', 'resolved_theirs', 'resolved_custom'
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

-- Search Index (precomputed for Fuse.js client-side search)
CREATE TABLE search_index (
  id            SERIAL PRIMARY KEY,
  entity_type   VARCHAR(30) NOT NULL,            -- 'player', 'school', 'coach', 'team_season'
  entity_id     INTEGER NOT NULL,
  sport_id      VARCHAR(30) REFERENCES sports(id),
  display_name  VARCHAR(300) NOT NULL,           -- "Brian Westbrook"
  context       VARCHAR(500),                    -- "La Salle, 1996-1998 — 2,034 rushing yards"
  search_text   TEXT NOT NULL,                   -- concatenated searchable text
  url_path      VARCHAR(300),                    -- "/football/players/brian-westbrook-1998"
  popularity    INTEGER DEFAULT 0,               -- for ranking results
  region_id     VARCHAR(50) DEFAULT 'philadelphia',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_entity ON search_index(entity_type, entity_id);
CREATE INDEX idx_search_text ON search_index USING GIN(search_text gin_trgm_ops);
CREATE INDEX idx_search_sport ON search_index(sport_id);
CREATE INDEX idx_search_popularity ON search_index(popularity DESC);

-- Full-text search vector column
ALTER TABLE search_index ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', search_text)) STORED;
CREATE INDEX idx_search_fts ON search_index USING GIN(fts);

-- Precomputed Cache (for hot queries like top-10 lists)
CREATE TABLE precomputed_cache (
  id            SERIAL PRIMARY KEY,
  cache_key     VARCHAR(200) UNIQUE NOT NULL,    -- 'football:career_rush_yards:top50'
  sport_id      VARCHAR(30) REFERENCES sports(id),
  query_type    VARCHAR(80) NOT NULL,            -- 'career_leaders', 'season_leaders', 'records'
  filters       JSONB,                           -- {"league": "catholic-league", "era": "2010s"}
  result_data   JSONB NOT NULL,                  -- the precomputed result
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

-- Football Career Leaders
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
  -- Rushing
  SUM(fs.rush_carries) AS career_rush_carries,
  SUM(fs.rush_yards) AS career_rush_yards,
  SUM(fs.rush_td) AS career_rush_td,
  -- Passing
  SUM(fs.pass_comp) AS career_pass_comp,
  SUM(fs.pass_att) AS career_pass_att,
  SUM(fs.pass_yards) AS career_pass_yards,
  SUM(fs.pass_td) AS career_pass_td,
  SUM(fs.pass_int) AS career_pass_int,
  -- Receiving
  SUM(fs.receptions) AS career_receptions,
  SUM(fs.rec_yards) AS career_rec_yards,
  SUM(fs.rec_td) AS career_rec_td,
  -- Totals
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

-- Basketball Career Leaders
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

-- Season Leaderboards (cross-sport, per-season top performers)
CREATE MATERIALIZED VIEW season_leaderboards AS
-- Football season leaders
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

-- Basketball season leaders
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
-- 6. ROW-LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
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

-- Public read access (anonymous users can read non-deleted data)
CREATE POLICY "Public read access" ON schools FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read access" ON players FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read access" ON coaches FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read access" ON sports FOR SELECT USING (true);
CREATE POLICY "Public read access" ON leagues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON seasons FOR SELECT USING (true);
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

-- Admin full access (authenticated users with admin role)
-- Note: In Supabase, use auth.uid() and a custom claim or role check
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
-- 7. HELPER FUNCTIONS
-- ============================================================================

-- Function to refresh all materialized views (call after data imports)
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders;
  REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders;
  REFRESH MATERIALIZED VIEW season_leaderboards;
END;
$$ LANGUAGE plpgsql;

-- Function to soft delete a record
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

-- Function to restore a soft-deleted record
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

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
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
