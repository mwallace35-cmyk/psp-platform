-- ============================================================================
-- PSP Sprint 1: Core Experience Migration
-- New tables: rivalries, rivalry_notes
-- New columns: games.data_source, games.last_verified_at, search_index.popularity_score
-- New materialized views: team_alltime_records, player_career_summary, rivalry_records
-- New indexes: 6 performance indexes
-- New functions: search_entities(), refresh_all_views()
-- ============================================================================

-- ============================================================================
-- 1. NEW TABLES
-- ============================================================================

-- Rivalry definitions
CREATE TABLE IF NOT EXISTS rivalries (
  id              SERIAL PRIMARY KEY,
  school_a_id     INTEGER NOT NULL REFERENCES schools(id),
  school_b_id     INTEGER NOT NULL REFERENCES schools(id),
  sport_id        VARCHAR(30) NOT NULL REFERENCES sports(id),
  slug            VARCHAR(200) UNIQUE NOT NULL,
  display_name    VARCHAR(200) NOT NULL,
  subtitle        VARCHAR(300),
  description     TEXT,
  featured        BOOLEAN DEFAULT false,
  region_id       VARCHAR(50) REFERENCES regions(id) DEFAULT 'philadelphia',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_a_id, school_b_id, sport_id)
);

CREATE INDEX idx_rivalries_sport ON rivalries(sport_id);
CREATE INDEX idx_rivalries_featured ON rivalries(featured) WHERE featured = true;
CREATE INDEX idx_rivalries_schools ON rivalries(school_a_id, school_b_id);

-- Rivalry notes (notable games, history, trivia)
CREATE TABLE IF NOT EXISTS rivalry_notes (
  id              SERIAL PRIMARY KEY,
  rivalry_id      INTEGER NOT NULL REFERENCES rivalries(id) ON DELETE CASCADE,
  game_id         INTEGER REFERENCES games(id),
  note_type       VARCHAR(30) NOT NULL DEFAULT 'history',  -- 'notable_game', 'history', 'trivia', 'stat'
  title           VARCHAR(200),
  content         TEXT NOT NULL,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rivalry_notes_rivalry ON rivalry_notes(rivalry_id);

-- ============================================================================
-- 2. NEW COLUMNS (safe ADD IF NOT EXISTS via DO blocks)
-- ============================================================================

-- Add data_source and last_verified_at to games (may already exist from Drizzle)
DO $$ BEGIN
  ALTER TABLE games ADD COLUMN IF NOT EXISTS data_source VARCHAR(50);
  ALTER TABLE games ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add play_by_play JSONB column to games (for future use)
DO $$ BEGIN
  ALTER TABLE games ADD COLUMN IF NOT EXISTS play_by_play JSONB;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add jersey_number to sport-specific player season tables
DO $$ BEGIN
  ALTER TABLE football_player_seasons ADD COLUMN IF NOT EXISTS jersey_number VARCHAR(5);
  ALTER TABLE basketball_player_seasons ADD COLUMN IF NOT EXISTS jersey_number VARCHAR(5);
  ALTER TABLE baseball_player_seasons ADD COLUMN IF NOT EXISTS jersey_number VARCHAR(5);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add popularity_score to search_index (for ranking typeahead results)
DO $$ BEGIN
  ALTER TABLE search_index ADD COLUMN IF NOT EXISTS popularity_score NUMERIC DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ============================================================================
-- 3. NEW INDEXES (performance)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_games_sport_date ON games(sport_id, game_date DESC);
CREATE INDEX IF NOT EXISTS idx_player_seasons_school_sport ON football_player_seasons(school_id, season_id);
CREATE INDEX IF NOT EXISTS idx_bk_ps_school_sport ON basketball_player_seasons(school_id, season_id);
CREATE INDEX IF NOT EXISTS idx_championships_school_sport ON championships(school_id, sport_id);
CREATE INDEX IF NOT EXISTS idx_team_seasons_school_sport_season ON team_seasons(school_id, sport_id, season_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_sport ON articles(sport_id, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_search_popularity_score ON search_index(popularity_score DESC);

-- ============================================================================
-- 4. MATERIALIZED VIEWS
-- ============================================================================

-- Team All-Time Records: W-L-T, win%, championships, pro athletes per school per sport
CREATE MATERIALIZED VIEW IF NOT EXISTS team_alltime_records AS
SELECT
  s.id AS school_id,
  s.slug AS school_slug,
  s.name AS school_name,
  s.short_name AS school_short_name,
  s.city,
  s.mascot,
  s.logo_url,
  l.id AS league_id,
  l.name AS league_name,
  l.short_name AS league_short_name,
  ts.sport_id,
  COUNT(DISTINCT ts.season_id) AS total_seasons,
  SUM(ts.wins) AS total_wins,
  SUM(ts.losses) AS total_losses,
  SUM(COALESCE(ts.ties, 0)) AS total_ties,
  SUM(ts.wins + ts.losses + COALESCE(ts.ties, 0)) AS total_games,
  CASE
    WHEN SUM(ts.wins + ts.losses + COALESCE(ts.ties, 0)) > 0
    THEN ROUND(
      (SUM(ts.wins) + 0.5 * SUM(COALESCE(ts.ties, 0)))::NUMERIC /
      SUM(ts.wins + ts.losses + COALESCE(ts.ties, 0)), 4
    )
    ELSE 0
  END AS win_pct,
  SUM(COALESCE(ts.points_for, 0)) AS total_points_for,
  SUM(COALESCE(ts.points_against, 0)) AS total_points_against,
  (SELECT COUNT(*) FROM championships c WHERE c.school_id = s.id AND c.sport_id = ts.sport_id) AS championship_count,
  (SELECT COUNT(*) FROM players p
   WHERE p.primary_school_id = s.id AND p.pro_team IS NOT NULL AND p.deleted_at IS NULL) AS pro_athlete_count,
  MIN(se.year_start) AS first_year,
  MAX(se.year_end) AS last_year
FROM schools s
JOIN team_seasons ts ON ts.school_id = s.id
JOIN seasons se ON se.id = ts.season_id
LEFT JOIN leagues l ON l.id = s.league_id
WHERE s.deleted_at IS NULL
GROUP BY s.id, s.slug, s.name, s.short_name, s.city, s.mascot, s.logo_url,
         l.id, l.name, l.short_name, ts.sport_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tar_school_sport ON team_alltime_records(school_id, sport_id);
CREATE INDEX IF NOT EXISTS idx_tar_sport_wins ON team_alltime_records(sport_id, total_wins DESC);
CREATE INDEX IF NOT EXISTS idx_tar_sport_winpct ON team_alltime_records(sport_id, win_pct DESC);

-- Player Career Summary: totals, averages, peak season per player
CREATE MATERIALIZED VIEW IF NOT EXISTS player_career_summary AS
-- Football players
SELECT
  'football'::VARCHAR(30) AS sport_id,
  p.id AS player_id,
  p.slug AS player_slug,
  p.name AS player_name,
  p.graduation_year,
  p.college,
  p.pro_team,
  p.pro_draft_info,
  s.id AS school_id,
  s.slug AS school_slug,
  s.name AS school_name,
  COUNT(fs.id) AS seasons_played,
  SUM(COALESCE(fs.games_played, 0)) AS career_games,
  MIN(se.year_start) AS first_year,
  MAX(se.year_end) AS last_year,
  -- Football-specific JSON stats blob
  jsonb_build_object(
    'rush_yards', SUM(COALESCE(fs.rush_yards, 0)),
    'rush_td', SUM(COALESCE(fs.rush_td, 0)),
    'rush_carries', SUM(COALESCE(fs.rush_carries, 0)),
    'pass_yards', SUM(COALESCE(fs.pass_yards, 0)),
    'pass_td', SUM(COALESCE(fs.pass_td, 0)),
    'pass_comp', SUM(COALESCE(fs.pass_comp, 0)),
    'pass_att', SUM(COALESCE(fs.pass_att, 0)),
    'pass_int', SUM(COALESCE(fs.pass_int, 0)),
    'rec_yards', SUM(COALESCE(fs.rec_yards, 0)),
    'rec_td', SUM(COALESCE(fs.rec_td, 0)),
    'receptions', SUM(COALESCE(fs.receptions, 0)),
    'total_td', SUM(COALESCE(fs.total_td, 0)),
    'total_yards', SUM(COALESCE(fs.total_yards, 0))
  ) AS career_stats
FROM players p
JOIN football_player_seasons fs ON fs.player_id = p.id
JOIN schools s ON s.id = fs.school_id
JOIN seasons se ON se.id = fs.season_id
WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
GROUP BY p.id, p.slug, p.name, p.graduation_year, p.college, p.pro_team, p.pro_draft_info,
         s.id, s.slug, s.name

UNION ALL

-- Basketball players
SELECT
  'basketball'::VARCHAR(30) AS sport_id,
  p.id AS player_id,
  p.slug AS player_slug,
  p.name AS player_name,
  p.graduation_year,
  p.college,
  p.pro_team,
  p.pro_draft_info,
  s.id AS school_id,
  s.slug AS school_slug,
  s.name AS school_name,
  COUNT(bs.id) AS seasons_played,
  SUM(COALESCE(bs.games_played, 0)) AS career_games,
  MIN(se.year_start) AS first_year,
  MAX(se.year_end) AS last_year,
  jsonb_build_object(
    'points', SUM(COALESCE(bs.points, 0)),
    'ppg', CASE WHEN SUM(COALESCE(bs.games_played, 0)) > 0
           THEN ROUND(SUM(COALESCE(bs.points, 0))::NUMERIC / SUM(bs.games_played), 1)
           ELSE 0 END,
    'rebounds', SUM(COALESCE(bs.rebounds, 0)),
    'assists', SUM(COALESCE(bs.assists, 0)),
    'steals', SUM(COALESCE(bs.steals, 0)),
    'blocks', SUM(COALESCE(bs.blocks, 0)),
    'three_pm', SUM(COALESCE(bs.three_pm, 0))
  ) AS career_stats
FROM players p
JOIN basketball_player_seasons bs ON bs.player_id = p.id
JOIN schools s ON s.id = bs.school_id
JOIN seasons se ON se.id = bs.season_id
WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
GROUP BY p.id, p.slug, p.name, p.graduation_year, p.college, p.pro_team, p.pro_draft_info,
         s.id, s.slug, s.name

UNION ALL

-- Baseball players
SELECT
  'baseball'::VARCHAR(30) AS sport_id,
  p.id AS player_id,
  p.slug AS player_slug,
  p.name AS player_name,
  p.graduation_year,
  p.college,
  p.pro_team,
  p.pro_draft_info,
  s.id AS school_id,
  s.slug AS school_slug,
  s.name AS school_name,
  COUNT(bp.id) AS seasons_played,
  SUM(COALESCE(bp.games_played, 0)) AS career_games,
  MIN(se.year_start) AS first_year,
  MAX(se.year_end) AS last_year,
  jsonb_build_object(
    'batting_avg', MAX(bp.batting_avg),
    'hits', SUM(COALESCE(bp.hits, 0)),
    'runs', SUM(COALESCE(bp.runs, 0)),
    'rbi', SUM(COALESCE(bp.rbi, 0)),
    'hr', SUM(COALESCE(bp.hr, 0)),
    'sb', SUM(COALESCE(bp.sb, 0)),
    'era', MIN(bp.era),
    'wins_pitching', SUM(COALESCE(bp.wins_pitching, 0)),
    'strikeouts', SUM(COALESCE(bp.strikeouts, 0))
  ) AS career_stats
FROM players p
JOIN baseball_player_seasons bp ON bp.player_id = p.id
JOIN schools s ON s.id = bp.school_id
JOIN seasons se ON se.id = bp.season_id
WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
GROUP BY p.id, p.slug, p.name, p.graduation_year, p.college, p.pro_team, p.pro_draft_info,
         s.id, s.slug, s.name;

CREATE INDEX IF NOT EXISTS idx_pcs_sport_player ON player_career_summary(sport_id, player_id);
CREATE INDEX IF NOT EXISTS idx_pcs_school ON player_career_summary(school_id);
CREATE INDEX IF NOT EXISTS idx_pcs_slug ON player_career_summary(player_slug);

-- Rivalry Records: pre-computed head-to-head W-L-T, point differential, streaks
CREATE MATERIALIZED VIEW IF NOT EXISTS rivalry_records AS
SELECT
  r.id AS rivalry_id,
  r.slug AS rivalry_slug,
  r.display_name,
  r.sport_id,
  r.school_a_id,
  sa.name AS school_a_name,
  sa.slug AS school_a_slug,
  sa.logo_url AS school_a_logo,
  r.school_b_id,
  sb.name AS school_b_name,
  sb.slug AS school_b_slug,
  sb.logo_url AS school_b_logo,
  -- School A wins (home or away)
  COUNT(*) FILTER (WHERE
    (g.home_school_id = r.school_a_id AND g.home_score > g.away_score) OR
    (g.away_school_id = r.school_a_id AND g.away_score > g.home_score)
  ) AS school_a_wins,
  -- School B wins
  COUNT(*) FILTER (WHERE
    (g.home_school_id = r.school_b_id AND g.home_score > g.away_score) OR
    (g.away_school_id = r.school_b_id AND g.away_score > g.home_score)
  ) AS school_b_wins,
  -- Ties
  COUNT(*) FILTER (WHERE g.home_score = g.away_score) AS ties,
  -- Total games
  COUNT(*) AS total_games,
  -- School A total points
  SUM(CASE
    WHEN g.home_school_id = r.school_a_id THEN COALESCE(g.home_score, 0)
    WHEN g.away_school_id = r.school_a_id THEN COALESCE(g.away_score, 0)
    ELSE 0
  END) AS school_a_total_points,
  -- School B total points
  SUM(CASE
    WHEN g.home_school_id = r.school_b_id THEN COALESCE(g.home_score, 0)
    WHEN g.away_school_id = r.school_b_id THEN COALESCE(g.away_score, 0)
    ELSE 0
  END) AS school_b_total_points,
  -- First and last meeting
  MIN(g.game_date) AS first_meeting,
  MAX(g.game_date) AS last_meeting
FROM rivalries r
JOIN schools sa ON sa.id = r.school_a_id
JOIN schools sb ON sb.id = r.school_b_id
LEFT JOIN games g ON g.sport_id = r.sport_id
  AND (
    (g.home_school_id = r.school_a_id AND g.away_school_id = r.school_b_id) OR
    (g.home_school_id = r.school_b_id AND g.away_school_id = r.school_a_id)
  )
GROUP BY r.id, r.slug, r.display_name, r.sport_id,
         r.school_a_id, sa.name, sa.slug, sa.logo_url,
         r.school_b_id, sb.name, sb.slug, sb.logo_url;

CREATE UNIQUE INDEX IF NOT EXISTS idx_rr_rivalry ON rivalry_records(rivalry_id);
CREATE INDEX IF NOT EXISTS idx_rr_sport ON rivalry_records(sport_id);

-- ============================================================================
-- 5. FUNCTIONS
-- ============================================================================

-- Server-side search via pg_trgm
CREATE OR REPLACE FUNCTION search_entities(
  query TEXT,
  p_sport VARCHAR(30) DEFAULT NULL,
  p_entity_type VARCHAR(30) DEFAULT NULL,
  p_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
  entity_type VARCHAR(30),
  entity_id INTEGER,
  sport_id VARCHAR(30),
  display_name VARCHAR(300),
  context VARCHAR(500),
  url_path VARCHAR(300),
  popularity INTEGER,
  popularity_score NUMERIC,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    si.entity_type,
    si.entity_id,
    si.sport_id,
    si.display_name,
    si.context,
    si.url_path,
    si.popularity,
    si.popularity_score,
    similarity(si.search_text, query) AS relevance
  FROM search_index si
  WHERE (
    si.fts @@ plainto_tsquery('english', query)
    OR similarity(si.search_text, query) > 0.15
    OR si.display_name ILIKE '%' || query || '%'
  )
  AND (p_sport IS NULL OR si.sport_id = p_sport)
  AND (p_entity_type IS NULL OR si.entity_type = p_entity_type)
  ORDER BY
    -- Exact name match first
    CASE WHEN LOWER(si.display_name) = LOWER(query) THEN 0
         WHEN si.display_name ILIKE query || '%' THEN 1
         WHEN si.display_name ILIKE '%' || query || '%' THEN 2
         ELSE 3
    END,
    -- Then by relevance + popularity blend
    (similarity(si.search_text, query) * 0.6 + COALESCE(si.popularity_score, 0) / 100.0 * 0.4) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Refresh all materialized views (called by pg_cron daily + on data import)
CREATE OR REPLACE FUNCTION refresh_all_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders;
  REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders;
  REFRESH MATERIALIZED VIEW season_leaderboards;
  REFRESH MATERIALIZED VIEW team_alltime_records;
  REFRESH MATERIALIZED VIEW player_career_summary;
  REFRESH MATERIALIZED VIEW rivalry_records;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. RLS POLICIES (matching existing pattern)
-- ============================================================================

ALTER TABLE rivalries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rivalry_notes ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read rivalries" ON rivalries FOR SELECT USING (true);
CREATE POLICY "Public read rivalry_notes" ON rivalry_notes FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admin write rivalries" ON rivalries FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write rivalry_notes" ON rivalry_notes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
