-- ============================================================================
-- PhillySportsPack.com — Statistics & Analytics System Migration
-- Date: March 2026
-- Purpose: Add computed metrics, era adjustment, confidence indicators, and
--          decision-support tables for advanced stat display and recruiting
--          value predictions.
-- ============================================================================

-- ============================================================================
-- 1. ERA DEFINITION TABLES
-- ============================================================================

CREATE TABLE football_eras (
  id SERIAL PRIMARY KEY,
  era_name VARCHAR(100) NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  characteristics JSONB,
  defensive_level VARCHAR(50),
  passing_trend VARCHAR(50),
  pass_yards_multiplier NUMERIC(4, 2) DEFAULT 1.0,
  avg_points_per_game NUMERIC(5, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(start_year, end_year)
);

CREATE TABLE basketball_eras (
  id SERIAL PRIMARY KEY,
  era_name VARCHAR(100) NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  characteristics JSONB,
  pace_factor NUMERIC(4, 2) DEFAULT 1.0,
  three_point_factor NUMERIC(4, 2) DEFAULT 1.0,
  avg_ppg NUMERIC(5, 2),
  avg_three_pt_rate NUMERIC(5, 3),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(start_year, end_year)
);

CREATE TABLE baseball_eras (
  id SERIAL PRIMARY KEY,
  era_name VARCHAR(100) NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  characteristics JSONB,
  ballpark_factor NUMERIC(4, 2) DEFAULT 1.0,
  era_avg_era NUMERIC(5, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(start_year, end_year)
);

INSERT INTO football_eras (era_name, start_year, end_year, defensive_level, passing_trend, pass_yards_multiplier, avg_points_per_game, characteristics)
VALUES
  ('Defensive Dominance', 1990, 1999, 'dominant', 'run_emphasis', 0.85, 21.5,
   '{"rule_set": "pre-2000", "defensive_innovations": true, "passing_rules": "restrictive"}'),
  ('Balanced Football', 2000, 2009, 'strong', 'balanced', 1.0, 24.0,
   '{"rule_set": "early_2000s", "defensive_innovations": true, "passing_rules": "moderate"}'),
  ('Spread Offense Era', 2010, 2019, 'moderate', 'pass_emphasis', 1.18, 27.0,
   '{"rule_set": "spread_adoption", "defensive_shift": true, "passing_rules": "progressive"}'),
  ('Modern Pace Era', 2020, 2025, 'weak', 'pace_dependent', 1.30, 29.0,
   '{"rule_set": "tempo_football", "defensive_challenges": true, "passing_rules": "wide_open"}');

INSERT INTO basketball_eras (era_name, start_year, end_year, pace_factor, three_point_factor, avg_ppg, avg_three_pt_rate, characteristics)
VALUES
  ('Low-Pace Basketball', 2001, 2009, 0.85, 0.70, 55.0, 0.15,
   '{"style": "post_focused", "three_point_emphasis": false}'),
  ('Transition Pace', 2010, 2014, 0.95, 0.85, 58.0, 0.22,
   '{"style": "mixed", "three_point_emphasis": "emerging"}'),
  ('Pace & Space Era', 2015, 2019, 1.05, 1.0, 61.0, 0.32,
   '{"style": "spread", "three_point_emphasis": true}'),
  ('Modern Three-Heavy', 2020, 2025, 1.10, 1.15, 63.0, 0.38,
   '{"style": "three_centric", "three_point_emphasis": "dominant"}');

-- Indexes
CREATE INDEX idx_football_eras_years ON football_eras(start_year, end_year);
CREATE INDEX idx_basketball_eras_years ON basketball_eras(start_year, end_year);
CREATE INDEX idx_baseball_eras_years ON baseball_eras(start_year, end_year);

-- ============================================================================
-- 2. ERA STAT BASELINES (For context and z-score calculations)
-- ============================================================================

CREATE TABLE era_stat_baselines (
  id SERIAL PRIMARY KEY,
  sport_id VARCHAR(30) NOT NULL REFERENCES sports(id),
  era_id INTEGER,
  era_name VARCHAR(100),
  stat_name VARCHAR(100) NOT NULL,
  avg_value NUMERIC(12, 2),
  stddev_value NUMERIC(12, 2),
  min_value NUMERIC(12, 2),
  max_value NUMERIC(12, 2),
  sample_count INTEGER,
  percentile_25 NUMERIC(12, 2),
  percentile_50 NUMERIC(12, 2),
  percentile_75 NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sport_id, era_name, stat_name)
);

CREATE INDEX idx_era_baselines_sport_era ON era_stat_baselines(sport_id, era_name);

-- ============================================================================
-- 3. PLAYER SEASON METRICS (Computed metrics - not persisted, but structure for caching)
-- ============================================================================

CREATE TABLE precomputed_player_metrics (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id),
  season_id INTEGER NOT NULL REFERENCES seasons(id),
  sport_id VARCHAR(30) NOT NULL REFERENCES sports(id),
  school_id INTEGER REFERENCES schools(id),
  -- Football metrics
  rush_ypc NUMERIC(5, 2),
  pass_ypa NUMERIC(5, 2),
  ncaa_passer_rating NUMERIC(6, 2),
  td_per_touch NUMERIC(5, 3),
  all_purpose_yards INTEGER,
  -- Basketball metrics
  ts_pct NUMERIC(5, 3),
  ast_to_ratio NUMERIC(5, 2),
  -- Baseball metrics
  ops_value NUMERIC(5, 3),
  k_bb_ratio NUMERIC(5, 2),
  -- Cross-sport
  dominance_index NUMERIC(5, 1),
  -- Percentiles (within season cohort)
  stat_percentile_rank INTEGER,
  era_percentile_rank INTEGER,
  -- Sample size category
  sample_category VARCHAR(50),
  sample_count INTEGER,
  -- Cache metadata
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(player_id, season_id, sport_id)
);

CREATE INDEX idx_precomputed_metrics_player ON precomputed_player_metrics(player_id);
CREATE INDEX idx_precomputed_metrics_season ON precomputed_player_metrics(season_id);
CREATE INDEX idx_precomputed_metrics_sport ON precomputed_player_metrics(sport_id);

-- ============================================================================
-- 4. RECRUITING STAT CORRELATIONS (ML-ready table for predictive analytics)
-- ============================================================================

CREATE TABLE recruiting_stat_correlations (
  id SERIAL PRIMARY KEY,
  sport_id VARCHAR(30) NOT NULL REFERENCES sports(id),
  stat_category VARCHAR(50),
  stat_name VARCHAR(100) NOT NULL,
  -- Correlation coefficients to next-level success
  college_correlation NUMERIC(5, 3),
  pro_correlation NUMERIC(5, 3),
  p_value NUMERIC(5, 4),
  sample_size INTEGER,
  -- Feature importance (from logistic regression)
  college_feature_importance NUMERIC(5, 3),
  pro_feature_importance NUMERIC(5, 3),
  -- Notes
  interpretation TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stat_correlations_sport ON recruiting_stat_correlations(sport_id);

-- ============================================================================
-- 5. PLAYER DEVELOPMENT TRAJECTORIES (Career progression tracking)
-- ============================================================================

CREATE TABLE player_career_trajectories (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id),
  sport_id VARCHAR(30) NOT NULL REFERENCES sports(id),
  -- Trajectory metrics
  career_seasons INTEGER,
  improvement_slope NUMERIC(12, 2),
  trajectory_type VARCHAR(50), -- 'breakout', 'steady', 'volatile', 'decline'
  first_season INTEGER,
  last_season INTEGER,
  peak_season INTEGER,
  peak_performance NUMERIC(12, 2),
  -- Prediction
  predicted_next_level VARCHAR(50),
  next_level_probability NUMERIC(5, 3),
  comparable_players TEXT ARRAY,
  -- Metadata
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trajectories_player ON player_career_trajectories(player_id);
CREATE INDEX idx_trajectories_sport ON player_career_trajectories(sport_id);

-- ============================================================================
-- 6. PROGRAM STRENGTH INDEX (School quality metric components)
-- ============================================================================

CREATE TABLE program_strength_components (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id),
  sport_id VARCHAR(30) NOT NULL REFERENCES sports(id),
  -- Component scores (out of max possible)
  championship_count INTEGER DEFAULT 0,
  championship_score INTEGER DEFAULT 0,
  award_count INTEGER DEFAULT 0,
  award_score INTEGER DEFAULT 0,
  next_level_count INTEGER DEFAULT 0,
  pipeline_score INTEGER DEFAULT 0,
  recent_winning_seasons INTEGER DEFAULT 0,
  recent_success_score INTEGER DEFAULT 0,
  -- Composite
  program_strength_index INTEGER,
  strength_tier VARCHAR(50), -- 'elite', 'strong', 'developing', 'building'
  program_strength_percentile NUMERIC(5, 1),
  -- Metadata
  last_recalculated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, sport_id)
);

CREATE INDEX idx_psi_school ON program_strength_components(school_id);
CREATE INDEX idx_psi_sport ON program_strength_components(sport_id);
CREATE INDEX idx_psi_tier ON program_strength_components(strength_tier);

-- ============================================================================
-- 7. MATERIALIZED VIEWS
-- ============================================================================

-- Football player season metrics
CREATE MATERIALIZED VIEW football_player_season_metrics_view AS
WITH fps_enriched AS (
  SELECT
    fps.id,
    fps.player_id,
    fps.season_id,
    fps.school_id,
    s.year_start,
    p.name AS player_name,
    sc.name AS school_name,
    -- Rate stats
    CASE WHEN fps.rush_carries > 0 THEN ROUND(fps.rush_yards::numeric / fps.rush_carries, 2) ELSE NULL END AS rush_ypc,
    CASE WHEN fps.pass_att > 0 THEN ROUND(fps.pass_yards::numeric / fps.pass_att, 2) ELSE NULL END AS pass_ypa,
    CASE WHEN fps.receptions > 0 THEN ROUND(fps.rec_yards::numeric / fps.receptions, 2) ELSE NULL END AS rec_ypr,
    -- Passer rating (NCAA formula)
    CASE
      WHEN fps.pass_att >= 100 THEN ROUND(
        (8.4 * (fps.pass_comp::numeric / NULLIF(fps.pass_att, 0))
         + 330 * (fps.pass_td::numeric / NULLIF(fps.pass_att, 0))
         + 100 * (1 - (fps.pass_int::numeric / NULLIF(fps.pass_att, 0)))
         - 200
        ) / 30,
        2
      ) ELSE NULL
    END AS ncaa_passer_rating,
    -- TD/Touch ratio
    CASE WHEN (fps.rush_carries + fps.receptions) > 0 THEN ROUND(fps.total_td::numeric / (fps.rush_carries + fps.receptions), 3) ELSE NULL END AS td_per_touch,
    -- All-purpose yards
    (fps.rush_yards + fps.pass_yards + fps.rec_yards + COALESCE(fps.kick_ret_yards, 0) + COALESCE(fps.punt_ret_yards, 0)) AS all_purpose_yards,
    -- Sample categories
    CASE WHEN fps.rush_carries < 75 THEN 'small_sample' WHEN fps.rush_carries < 150 THEN 'moderate_sample' ELSE 'large_sample' END AS rush_sample,
    CASE WHEN fps.pass_att < 150 THEN 'small_sample' WHEN fps.pass_att < 300 THEN 'moderate_sample' ELSE 'large_sample' END AS pass_sample,
    fps.rush_carries,
    fps.pass_att,
    fps.gamesPlayed
  FROM football_player_seasons fps
  JOIN seasons s ON fps.season_id = s.id
  JOIN players p ON fps.player_id = p.id
  JOIN schools sc ON fps.school_id = sc.id
  WHERE fps.deleted_at IS NULL
)
SELECT * FROM fps_enriched;

CREATE INDEX idx_football_metrics_view_player ON football_player_season_metrics_view(player_id);
CREATE INDEX idx_football_metrics_view_season ON football_player_season_metrics_view(season_id);

-- Basketball player season metrics
CREATE MATERIALIZED VIEW basketball_player_season_metrics_view AS
WITH bps_enriched AS (
  SELECT
    bps.id,
    bps.player_id,
    bps.season_id,
    bps.school_id,
    s.year_start,
    p.name AS player_name,
    sc.name AS school_name,
    -- True shooting percentage
    CASE WHEN (COALESCE(bps.fga, 0) + 0.44 * COALESCE(bps.fta, 0)) > 0 THEN
      ROUND(bps.points::numeric / (2 * (COALESCE(bps.fga, 0) + 0.44 * COALESCE(bps.fta, 0))), 3)
    ELSE NULL END AS ts_pct,
    -- Assist-to-turnover ratio
    CASE WHEN COALESCE(bps.turnovers, 0) > 0 THEN
      ROUND(COALESCE(bps.assists, 0)::numeric / NULLIF(COALESCE(bps.turnovers, 0), 0), 2)
    ELSE NULL END AS ast_to_ratio,
    -- Sample categories
    CASE WHEN bps.gamesPlayed < 10 THEN 'small_sample' WHEN bps.gamesPlayed < 20 THEN 'moderate_sample' ELSE 'large_sample' END AS sample_category,
    bps.gamesPlayed,
    bps.points
  FROM basketball_player_seasons bps
  JOIN seasons s ON bps.season_id = s.id
  JOIN players p ON bps.player_id = p.id
  JOIN schools sc ON bps.school_id = sc.id
  WHERE bps.deleted_at IS NULL
)
SELECT * FROM bps_enriched;

CREATE INDEX idx_basketball_metrics_view_player ON basketball_player_season_metrics_view(player_id);
CREATE INDEX idx_basketball_metrics_view_season ON basketball_player_season_metrics_view(season_id);

-- Era-adjusted leaders
CREATE MATERIALIZED VIEW era_adjusted_leaders_view AS
WITH football_ranked AS (
  SELECT
    fps.player_id,
    fps.season_id,
    s.year_start,
    'football' AS sport_id,
    CASE
      WHEN s.year_start < 2000 THEN 'defensive_dominance'
      WHEN s.year_start < 2010 THEN 'balanced_football'
      WHEN s.year_start < 2020 THEN 'spread_era'
      ELSE 'modern_pace'
    END AS era,
    fps.pass_yards,
    fps.rush_yards,
    -- Z-score
    ROUND((fps.pass_yards - AVG(fps.pass_yards) OVER (
      PARTITION BY (CASE WHEN s.year_start < 2000 THEN 1 WHEN s.year_start < 2010 THEN 2 WHEN s.year_start < 2020 THEN 3 ELSE 4 END)
    )) / NULLIF(STDDEV_POP(fps.pass_yards) OVER (
      PARTITION BY (CASE WHEN s.year_start < 2000 THEN 1 WHEN s.year_start < 2010 THEN 2 WHEN s.year_start < 2020 THEN 3 ELSE 4 END)
    ), 0), 2) AS pass_z_score,
    -- Percentile
    NTILE(100) OVER (
      PARTITION BY (CASE WHEN s.year_start < 2000 THEN 1 WHEN s.year_start < 2010 THEN 2 WHEN s.year_start < 2020 THEN 3 ELSE 4 END)
      ORDER BY fps.pass_yards DESC
    ) AS pass_era_percentile,
    -- Modern era adjustment
    ROUND(fps.pass_yards * (
      CASE WHEN s.year_start < 2000 THEN 1.30 / 0.85 WHEN s.year_start < 2010 THEN 1.30 / 1.0 WHEN s.year_start < 2020 THEN 1.30 / 1.18 ELSE 1.0 END
    ), 0) AS pass_modern_equivalent
  FROM football_player_seasons fps
  JOIN seasons s ON fps.season_id = s.id
  WHERE fps.pass_att >= 100 AND fps.deleted_at IS NULL
)
SELECT * FROM football_ranked;

CREATE INDEX idx_era_leaders_view_player ON era_adjusted_leaders_view(player_id);
CREATE INDEX idx_era_leaders_view_era ON era_adjusted_leaders_view(era);

-- ============================================================================
-- 8. TABLE UPDATES (Add columns if not present)
-- ============================================================================

-- Add sample size classifications to existing tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='football_player_seasons' AND column_name='sample_category') THEN
    ALTER TABLE football_player_seasons ADD COLUMN sample_category VARCHAR(50);
    ALTER TABLE football_player_seasons ADD COLUMN confidence_level VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='basketball_player_seasons' AND column_name='sample_category') THEN
    ALTER TABLE basketball_player_seasons ADD COLUMN sample_category VARCHAR(50);
    ALTER TABLE basketball_player_seasons ADD COLUMN confidence_level VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='baseball_player_seasons' AND column_name='sample_category') THEN
    ALTER TABLE baseball_player_seasons ADD COLUMN sample_category VARCHAR(50);
    ALTER TABLE baseball_player_seasons ADD COLUMN confidence_level VARCHAR(50);
  END IF;
END $$;

-- ============================================================================
-- 9. HELPER FUNCTIONS
-- ============================================================================

-- Function: Calculate confidence level
CREATE OR REPLACE FUNCTION get_confidence_level(
  p_stat_name VARCHAR,
  p_value NUMERIC,
  p_sport_id VARCHAR
)
RETURNS TABLE(
  level VARCHAR,
  opacity NUMERIC,
  badge_text VARCHAR,
  badge_color VARCHAR
) AS $$
BEGIN
  -- Football carries thresholds
  IF p_stat_name = 'rushes' AND p_sport_id = 'football' THEN
    IF p_value < 75 THEN
      RETURN QUERY SELECT 'small_sample'::varchar, 0.5::numeric, 'Small Sample'::varchar, 'bg-orange-900'::varchar;
    ELSIF p_value < 150 THEN
      RETURN QUERY SELECT 'moderate_sample'::varchar, 0.75::numeric, 'Moderate Sample'::varchar, 'bg-yellow-900'::varchar;
    ELSE
      RETURN QUERY SELECT 'large_sample'::varchar, 1.0::numeric, 'Reliable'::varchar, 'bg-green-900'::varchar;
    END IF;
  END IF;

  -- Basketball games thresholds
  IF p_stat_name = 'games' AND p_sport_id = 'basketball' THEN
    IF p_value < 10 THEN
      RETURN QUERY SELECT 'small_sample'::varchar, 0.5::numeric, 'Small Sample'::varchar, 'bg-orange-900'::varchar;
    ELSIF p_value < 20 THEN
      RETURN QUERY SELECT 'moderate_sample'::varchar, 0.75::numeric, 'Moderate Sample'::varchar, 'bg-yellow-900'::varchar;
    ELSE
      RETURN QUERY SELECT 'large_sample'::varchar, 1.0::numeric, 'Reliable'::varchar, 'bg-green-900'::varchar;
    END IF;
  END IF;

  -- Baseball at-bats thresholds
  IF p_stat_name = 'at_bats' AND p_sport_id = 'baseball' THEN
    IF p_value < 50 THEN
      RETURN QUERY SELECT 'small_sample'::varchar, 0.5::numeric, 'Small Sample'::varchar, 'bg-orange-900'::varchar;
    ELSIF p_value < 150 THEN
      RETURN QUERY SELECT 'moderate_sample'::varchar, 0.75::numeric, 'Moderate Sample'::varchar, 'bg-yellow-900'::varchar;
    ELSE
      RETURN QUERY SELECT 'large_sample'::varchar, 1.0::numeric, 'Reliable'::varchar, 'bg-green-900'::varchar;
    END IF;
  END IF;

  -- Default
  RETURN QUERY SELECT 'moderate_sample'::varchar, 0.75::numeric, 'Data Available'::varchar, 'bg-gray-900'::varchar;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate NCAA passer rating
CREATE OR REPLACE FUNCTION calculate_ncaa_passer_rating(
  p_completions INTEGER,
  p_attempts INTEGER,
  p_yards INTEGER,
  p_tds INTEGER,
  p_ints INTEGER
)
RETURNS NUMERIC AS $$
DECLARE
  v_comp_pct NUMERIC;
  v_td_pct NUMERIC;
  v_int_pct NUMERIC;
BEGIN
  IF p_attempts = 0 THEN RETURN NULL; END IF;

  v_comp_pct := p_completions::numeric / p_attempts;
  v_td_pct := p_tds::numeric / p_attempts;
  v_int_pct := p_ints::numeric / p_attempts;

  RETURN ROUND(
    (8.4 * v_comp_pct + 330 * v_td_pct + 100 * (1 - v_int_pct) - 200) / 30,
    2
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate true shooting percentage
CREATE OR REPLACE FUNCTION calculate_ts_pct(
  p_points INTEGER,
  p_fga INTEGER,
  p_fta INTEGER
)
RETURNS NUMERIC AS $$
BEGIN
  IF (p_fga + 0.44 * p_fta) <= 0 THEN RETURN NULL; END IF;

  RETURN ROUND(
    p_points::numeric / (2 * (p_fga + 0.44 * p_fta)),
    3
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 10. GRANTS (RLS policies already exist, verify)
-- ============================================================================

-- Allow authenticated users to read stats tables
GRANT SELECT ON football_eras, basketball_eras, baseball_eras TO authenticated;
GRANT SELECT ON era_stat_baselines, recruiting_stat_correlations TO authenticated;
GRANT SELECT ON player_career_trajectories, program_strength_components TO authenticated;
GRANT SELECT ON precomputed_player_metrics TO authenticated;
GRANT SELECT ON football_player_season_metrics_view, basketball_player_season_metrics_view, era_adjusted_leaders_view TO authenticated;

-- Allow service role (admin) to manage stats
GRANT ALL ON football_eras, basketball_eras, baseball_eras TO service_role;
GRANT ALL ON era_stat_baselines, recruiting_stat_correlations TO service_role;
GRANT ALL ON player_career_trajectories, program_strength_components TO service_role;
GRANT ALL ON precomputed_player_metrics TO service_role;

-- ============================================================================
-- 11. REFRESH SCHEDULE (Note: requires pg_cron extension)
-- ============================================================================

-- Optional: Uncomment if using pg_cron extension
-- SELECT cron.schedule(
--   'refresh_football_metrics',
--   '0 2 * * *',
--   'REFRESH MATERIALIZED VIEW CONCURRENTLY football_player_season_metrics_view'
-- );
--
-- SELECT cron.schedule(
--   'refresh_basketball_metrics',
--   '0 2 * * *',
--   'REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_player_season_metrics_view'
-- );
--
-- SELECT cron.schedule(
--   'refresh_era_leaders',
--   '0 2 * * *',
--   'REFRESH MATERIALIZED VIEW CONCURRENTLY era_adjusted_leaders_view'
-- );

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Note: Ensure to backfill era_stat_baselines and recruiting_stat_correlations
-- via Python scripts after this migration runs. See:
-- - scripts/backfill_era_baselines.py
-- - scripts/backfill_correlations.py
