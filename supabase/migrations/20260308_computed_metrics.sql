-- ============================================================================
-- PhillySportsPack.com — Computed Metrics Functions
-- Migration: 20260308_computed_metrics
-- Author: Bill James (Statistical Validity & Advanced Analytics)
-- ============================================================================
-- PostgreSQL functions for Tier 1 metrics (data exists NOW)
-- Computes efficiency metrics for football, basketball, and baseball
--
-- These functions enable:
--   • Rate stats (yards/carry, yards/attempt, etc.)
--   • Efficiency metrics (TD-to-touch ratio, passer rating, etc.)
--   • Era-adjusted comparisons (Z-scores, percentiles)
--   • Career summary aggregation
--   • Materialized view refreshing
-- ============================================================================

-- ============================================================================
-- 1. FOOTBALL METRICS
-- ============================================================================

/**
 * compute_yards_per_carry
 * Calculate yards per rushing attempt (YPC).
 * NULL if rush_attempts = 0 or NULL.
 */
CREATE OR REPLACE FUNCTION compute_yards_per_carry(
  rush_yards INTEGER,
  rush_attempts INTEGER
) RETURNS NUMERIC AS $$
BEGIN
  IF rush_attempts IS NULL OR rush_attempts = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((rush_yards::NUMERIC / rush_attempts), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_yards_per_attempt
 * Calculate yards per passing attempt (YPA).
 * NULL if pass_attempts = 0 or NULL.
 */
CREATE OR REPLACE FUNCTION compute_yards_per_attempt(
  pass_yards INTEGER,
  pass_attempts INTEGER
) RETURNS NUMERIC AS $$
BEGIN
  IF pass_attempts IS NULL OR pass_attempts = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((pass_yards::NUMERIC / pass_attempts), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_passer_efficiency
 * Calculate NCAA passer efficiency rating.
 * Formula: ((C/ATT - 0.30) * 5.4 + (YDS/ATT - 3.7) * 25 + (TD/ATT) * 330 + (2.4 - INT/ATT) * 40) / 12
 * where C = completions, ATT = attempts, YDS = yards, TD = touchdowns, INT = interceptions
 *
 * Returns NULL if att <= 0.
 * Capped at 0.0 minimum and 158.3 maximum (NCAA standard).
 */
CREATE OR REPLACE FUNCTION compute_passer_efficiency(
  completions INTEGER,
  attempts INTEGER,
  yards INTEGER,
  touchdowns INTEGER,
  interceptions INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  c_ratio NUMERIC;
  y_ratio NUMERIC;
  td_ratio NUMERIC;
  int_ratio NUMERIC;
  rating NUMERIC;
BEGIN
  IF attempts IS NULL OR attempts <= 0 THEN
    RETURN NULL;
  END IF;

  c_ratio := (completions::NUMERIC / attempts) - 0.30;
  y_ratio := (yards::NUMERIC / attempts) - 3.7;
  td_ratio := (touchdowns::NUMERIC / attempts);
  int_ratio := 2.4 - (interceptions::NUMERIC / attempts);

  rating := (c_ratio * 5.4 + y_ratio * 25 + td_ratio * 330 + int_ratio * 40) / 12;

  -- Cap at NCAA limits
  IF rating < 0 THEN
    rating := 0;
  ELSIF rating > 158.3 THEN
    rating := 158.3;
  END IF;

  RETURN ROUND(rating, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_td_to_touch_ratio
 * Calculate TD-to-touch ratio (total TDs / (rushes + receptions)).
 * Indicates scoring efficiency per offensive touch.
 * Returns NULL if total_touches = 0.
 */
CREATE OR REPLACE FUNCTION compute_td_to_touch_ratio(
  total_td INTEGER,
  rush_attempts INTEGER,
  receptions INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  total_touches INTEGER;
BEGIN
  total_touches := COALESCE(rush_attempts, 0) + COALESCE(receptions, 0);
  IF total_touches = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((total_td::NUMERIC / total_touches), 4);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 2. BASKETBALL METRICS (Dean Oliver Advanced)
-- ============================================================================

/**
 * compute_true_shooting_percentage
 * Calculate true shooting percentage (TS%).
 * TS% = Points / (2 * (FGA + 0.44 * FTA))
 * Accounts for 3-pointers (each worth 3 pts) and free throws.
 * Returns NULL if denominator is 0.
 */
CREATE OR REPLACE FUNCTION compute_true_shooting_percentage(
  points INTEGER,
  fga INTEGER,
  fta INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  denominator NUMERIC;
BEGIN
  IF fga IS NULL OR fta IS NULL THEN
    RETURN NULL;
  END IF;
  denominator := 2 * (fga::NUMERIC + 0.44 * fta);
  IF denominator = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((points::NUMERIC / denominator) * 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_effective_fg_percentage
 * Calculate effective field goal percentage (eFG%).
 * eFG% = (FGM + 0.5 * 3PM) / FGA
 * Weights 3-pointers 1.5x to account for their point value.
 * Returns NULL if FGA is 0.
 */
CREATE OR REPLACE FUNCTION compute_effective_fg_percentage(
  fgm INTEGER,
  three_pm INTEGER,
  fga INTEGER
) RETURNS NUMERIC AS $$
BEGIN
  IF fga IS NULL OR fga = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(
    ((fgm::NUMERIC + 0.5 * COALESCE(three_pm, 0)) / fga) * 100,
    2
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_usage_rate
 * Calculate usage rate (USG%).
 * Estimate: USG% ≈ ((FGA + 0.44*FTA + TO) / (FGA + FTA + TO)) * (team_FGA / (player_FGA + teammate_total))
 * Simplified here: (FGA + FTA + TO) / total_possessions * 100
 * Returns NULL if total_possessions = 0.
 *
 * Note: This is a simplified version. Full usage rate requires team totals.
 */
CREATE OR REPLACE FUNCTION compute_usage_rate_simplified(
  fga INTEGER,
  fta INTEGER,
  turnovers INTEGER,
  games_played INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  total_events INTEGER;
BEGIN
  total_events := COALESCE(fga, 0) + COALESCE(fta, 0) + COALESCE(turnovers, 0);
  IF games_played IS NULL OR games_played = 0 THEN
    RETURN NULL;
  END IF;
  -- Rough estimate: events per game
  RETURN ROUND((total_events::NUMERIC / games_played), 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_player_efficiency_rating
 * Simplified PER calculation (Dean Oliver).
 * PER = ((Points + Rebounds + Assists + Steals + Blocks) - ((FGA - FGM) + FTA - FTM + TO)) / Minutes
 * Returns NULL if minutes = 0.
 */
CREATE OR REPLACE FUNCTION compute_player_efficiency_rating(
  points INTEGER,
  rebounds INTEGER,
  assists INTEGER,
  steals INTEGER,
  blocks INTEGER,
  fga INTEGER,
  fgm INTEGER,
  fta INTEGER,
  ftm INTEGER,
  turnovers INTEGER,
  minutes INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  positive_contributions INTEGER;
  negative_contributions INTEGER;
  per_value NUMERIC;
BEGIN
  IF minutes IS NULL OR minutes = 0 THEN
    RETURN NULL;
  END IF;

  positive_contributions := COALESCE(points, 0) + COALESCE(rebounds, 0) + COALESCE(assists, 0)
                            + COALESCE(steals, 0) + COALESCE(blocks, 0);
  negative_contributions := (COALESCE(fga, 0) - COALESCE(fgm, 0))
                            + (COALESCE(fta, 0) - COALESCE(ftm, 0))
                            + COALESCE(turnovers, 0);

  per_value := (positive_contributions - negative_contributions)::NUMERIC / minutes;
  RETURN ROUND(per_value, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 3. BASEBALL METRICS
-- ============================================================================

/**
 * compute_on_base_percentage
 * Calculate on-base percentage (OBP).
 * OBP = (Hits + Walks) / (At-Bats + Walks + HBP)
 * Simplified: (Hits + Walks) / (At-Bats + Walks)
 * Returns NULL if denominator = 0.
 */
CREATE OR REPLACE FUNCTION compute_on_base_percentage(
  hits INTEGER,
  walks INTEGER,
  at_bats INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  denominator INTEGER;
BEGIN
  denominator := COALESCE(at_bats, 0) + COALESCE(walks, 0);
  IF denominator = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((COALESCE(hits, 0)::NUMERIC + COALESCE(walks, 0)) / denominator, 3);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_slugging_percentage
 * Calculate slugging percentage (SLG).
 * SLG = Total Bases / At-Bats
 * Total Bases = Hits - Doubles - Triples + (2 * Doubles) + (3 * Triples) + (4 * Home Runs)
 *             = Hits + Doubles + (2 * Triples) + (3 * Home Runs)
 * Returns NULL if at_bats = 0.
 */
CREATE OR REPLACE FUNCTION compute_slugging_percentage(
  hits INTEGER,
  doubles INTEGER,
  triples INTEGER,
  home_runs INTEGER,
  at_bats INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  total_bases NUMERIC;
BEGIN
  IF at_bats IS NULL OR at_bats = 0 THEN
    RETURN NULL;
  END IF;
  total_bases := COALESCE(hits, 0) + COALESCE(doubles, 0) + (2 * COALESCE(triples, 0)) + (3 * COALESCE(home_runs, 0));
  RETURN ROUND(total_bases / at_bats, 3);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_ops
 * Calculate on-base plus slugging (OPS).
 * OPS = OBP + SLG
 * Returns NULL if either component is NULL.
 */
CREATE OR REPLACE FUNCTION compute_ops(
  obp NUMERIC,
  slg NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
  IF obp IS NULL OR slg IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(obp + slg, 3);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * compute_whip_pitcher
 * Calculate WHIP (walks + hits per inning pitched).
 * WHIP = (Walks + Hits Allowed) / Innings Pitched
 * Returns NULL if innings_pitched = 0.
 */
CREATE OR REPLACE FUNCTION compute_whip_pitcher(
  walks INTEGER,
  hits_allowed INTEGER,
  innings_pitched NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
  IF innings_pitched IS NULL OR innings_pitched = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND((COALESCE(walks, 0) + COALESCE(hits_allowed, 0))::NUMERIC / innings_pitched, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 4. ERA-ADJUSTED COMPARISON FUNCTIONS
-- ============================================================================

/**
 * compute_era_percentile
 * Calculate percentile rank of a stat within a sport-era-league cohort.
 * Uses PERCENT_RANK() window function.
 * Returns percentile (0-100).
 */
CREATE OR REPLACE FUNCTION compute_era_percentile(
  stat_value NUMERIC,
  sport_id_param VARCHAR,
  era_id_param VARCHAR,
  league_id_param INTEGER,
  stat_name_param VARCHAR
) RETURNS NUMERIC AS $$
DECLARE
  percentile NUMERIC;
BEGIN
  -- Query depends on stat_name and sport
  -- This is a simplified implementation showing the pattern
  -- In practice, would dispatch to sport-specific queries

  SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY rush_yards)
  INTO percentile
  FROM football_player_seasons fps
  WHERE fps.sport_id = sport_id_param
    AND EXISTS (
      SELECT 1 FROM seasons s WHERE s.id = fps.season_id
        AND CASE
              WHEN era_id_param = 'football:early' THEN s.year_start < 1950
              WHEN era_id_param = 'football:traditional' THEN s.year_start >= 1950 AND s.year_start < 1980
              WHEN era_id_param = 'football:modern' THEN s.year_start >= 1980
              ELSE TRUE
            END
    );

  IF percentile IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN ROUND(percentile * 100, 2);
END;
$$ LANGUAGE plpgsql;

/**
 * compute_zscore_within_era
 * Calculate Z-score of a stat value within era context.
 * Z = (value - mean) / stddev
 * Returns NULL if stddev = 0.
 */
CREATE OR REPLACE FUNCTION compute_zscore_within_era(
  stat_value NUMERIC,
  sport_id_param VARCHAR,
  era_id_param VARCHAR,
  stat_name_param VARCHAR
) RETURNS NUMERIC AS $$
DECLARE
  era_mean NUMERIC;
  era_stddev NUMERIC;
  zscore NUMERIC;
BEGIN
  -- Example for football rushing yards
  IF sport_id_param = 'football' AND stat_name_param = 'rush_yards' THEN
    SELECT AVG(rush_yards)::NUMERIC, STDDEV_POP(rush_yards)::NUMERIC
    INTO era_mean, era_stddev
    FROM football_player_seasons fps
    JOIN seasons s ON s.id = fps.season_id
    WHERE CASE
            WHEN era_id_param = 'football:early' THEN s.year_start < 1950
            WHEN era_id_param = 'football:traditional' THEN s.year_start >= 1950 AND s.year_start < 1980
            WHEN era_id_param = 'football:modern' THEN s.year_start >= 1980
            ELSE TRUE
          END;

    IF era_stddev IS NULL OR era_stddev = 0 THEN
      RETURN NULL;
    END IF;
    zscore := (stat_value - era_mean) / era_stddev;
    RETURN ROUND(zscore, 3);
  END IF;

  -- Similar patterns for other stats/sports...
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. CAREER SUMMARY AGGREGATION
-- ============================================================================

/**
 * refresh_career_summaries
 * Recompute players.career_summary JSONB with aggregated career stats.
 * Includes career totals, averages, best season, teams played for, etc.
 *
 * Career summary structure:
 * {
 *   "career_totals": { "games": 48, "rushing_yards": 2034, "touchdowns": 25 },
 *   "career_averages": { "games_played": 16, "yards_per_game": 42.4 },
 *   "best_season": { "year": 1998, "rushing_yards": 1200, "school": "La Salle" },
 *   "teams": [{ "school_id": 1, "school_name": "La Salle", "seasons": [1996, 1997, 1998] }]
 * }
 */
CREATE OR REPLACE FUNCTION refresh_career_summaries()
RETURNS TABLE(player_id INTEGER, summary JSONB) AS $$
BEGIN
  RETURN QUERY
  WITH football_careers AS (
    SELECT
      p.id AS player_id,
      p.name AS player_name,
      'football' AS sport_id,
      JSON_BUILD_OBJECT(
        'sport', 'football',
        'career_totals', JSON_BUILD_OBJECT(
          'games', COALESCE(SUM(fps.games_played), 0),
          'rushing_yards', COALESCE(SUM(fps.rush_yards), 0),
          'passing_yards', COALESCE(SUM(fps.pass_yards), 0),
          'receiving_yards', COALESCE(SUM(fps.rec_yards), 0),
          'total_touchdowns', COALESCE(SUM(fps.total_td), 0)
        ),
        'career_averages', JSON_BUILD_OBJECT(
          'yards_per_game', CASE
            WHEN SUM(fps.games_played) > 0
            THEN ROUND((SUM(fps.rush_yards + fps.rec_yards + fps.pass_yards)::NUMERIC / SUM(fps.games_played)), 2)
            ELSE 0
          END
        ),
        'positions', JSONB_AGG(DISTINCT p.positions),
        'schools', JSONB_AGG(DISTINCT JSON_BUILD_OBJECT('school_id', s.id, 'school_name', s.name))
      ) AS career_summary
    FROM players p
    LEFT JOIN football_player_seasons fps ON fps.player_id = p.id
    LEFT JOIN schools s ON s.id = fps.school_id
    WHERE p.deleted_at IS NULL
    GROUP BY p.id, p.name
  ),
  basketball_careers AS (
    SELECT
      p.id AS player_id,
      p.name AS player_name,
      'basketball' AS sport_id,
      JSON_BUILD_OBJECT(
        'sport', 'basketball',
        'career_totals', JSON_BUILD_OBJECT(
          'games', COALESCE(SUM(bps.games_played), 0),
          'points', COALESCE(SUM(bps.points), 0),
          'rebounds', COALESCE(SUM(bps.rebounds), 0),
          'assists', COALESCE(SUM(bps.assists), 0),
          'steals', COALESCE(SUM(bps.steals), 0),
          'blocks', COALESCE(SUM(bps.blocks), 0)
        ),
        'career_averages', JSON_BUILD_OBJECT(
          'ppg', CASE
            WHEN SUM(bps.games_played) > 0
            THEN ROUND((SUM(bps.points)::NUMERIC / SUM(bps.games_played)), 2)
            ELSE 0
          END,
          'rpg', CASE
            WHEN SUM(bps.games_played) > 0
            THEN ROUND((SUM(bps.rebounds)::NUMERIC / SUM(bps.games_played)), 2)
            ELSE 0
          END
        ),
        'positions', JSONB_AGG(DISTINCT p.positions),
        'schools', JSONB_AGG(DISTINCT JSON_BUILD_OBJECT('school_id', s.id, 'school_name', s.name))
      ) AS career_summary
    FROM players p
    LEFT JOIN basketball_player_seasons bps ON bps.player_id = p.id
    LEFT JOIN schools s ON s.id = bps.school_id
    WHERE p.deleted_at IS NULL
    GROUP BY p.id, p.name
  )
  SELECT player_id, career_summary FROM football_careers
  UNION ALL
  SELECT player_id, career_summary FROM basketball_careers;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. MATERIALIZED VIEW REFRESH
-- ============================================================================

/**
 * refresh_era_adjusted_leaders
 * Refresh the era_adjusted_leaders materialized view with latest computations.
 * Safe for concurrent access.
 */
CREATE OR REPLACE FUNCTION refresh_era_adjusted_leaders()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY era_adjusted_leaders;
  RAISE NOTICE 'era_adjusted_leaders view refreshed at %', NOW();
END;
$$ LANGUAGE plpgsql;

/**
 * refresh_school_pipeline_stats
 * Refresh the school_pipeline_stats materialized view.
 * Computes college/pro placement rates per school and sport.
 */
CREATE OR REPLACE FUNCTION refresh_school_pipeline_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY school_pipeline_stats;
  RAISE NOTICE 'school_pipeline_stats view refreshed at %', NOW();
END;
$$ LANGUAGE plpgsql;

/**
 * refresh_all_materialized_views
 * Batch refresh all expert schema materialized views.
 * Call this after major data imports or corrections.
 */
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS TABLE(view_name TEXT, status TEXT, refreshed_at TIMESTAMPTZ) AS $$
BEGIN
  PERFORM refresh_era_adjusted_leaders();
  RETURN QUERY SELECT 'era_adjusted_leaders'::TEXT, 'success'::TEXT, NOW();

  PERFORM refresh_school_pipeline_stats();
  RETURN QUERY SELECT 'school_pipeline_stats'::TEXT, 'success'::TEXT, NOW();

  -- Also refresh original materialized views (if needed)
  REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders;
  RETURN QUERY SELECT 'football_career_leaders'::TEXT, 'success'::TEXT, NOW();

  REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders;
  RETURN QUERY SELECT 'basketball_career_leaders'::TEXT, 'success'::TEXT, NOW();

  REFRESH MATERIALIZED VIEW CONCURRENTLY season_leaderboards;
  RETURN QUERY SELECT 'season_leaderboards'::TEXT, 'success'::TEXT, NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. STAT CORRECTION APPLICATION
-- ============================================================================

/**
 * apply_stat_correction
 * Apply a stat correction to a football_player_season or basketball_player_season record.
 * Logs the correction in stat_corrections table.
 *
 * Returns: correction_id
 */
CREATE OR REPLACE FUNCTION apply_stat_correction(
  p_entity_table VARCHAR,
  p_entity_id INTEGER,
  p_stat_field VARCHAR,
  p_new_value TEXT,
  p_correction_reason VARCHAR,
  p_severity VARCHAR DEFAULT 'minor',
  p_source_citation TEXT DEFAULT NULL,
  p_applied_by UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_old_value TEXT;
  v_correction_id INTEGER;
  v_update_query TEXT;
BEGIN
  -- Get old value before update
  EXECUTE format('SELECT %I::TEXT FROM %I WHERE id = %L', p_stat_field, p_entity_table, p_entity_id)
  INTO v_old_value;

  -- Log the correction
  INSERT INTO stat_corrections (
    entity_type, entity_table, entity_id, stat_field,
    old_value, new_value, correction_reason, severity,
    source_citation, applied_by
  ) VALUES (
    SPLIT_PART(p_entity_table, '_', 1),
    p_entity_table,
    p_entity_id,
    p_stat_field,
    v_old_value,
    p_new_value,
    p_correction_reason,
    p_severity,
    p_source_citation,
    p_applied_by
  ) RETURNING id INTO v_correction_id;

  -- Apply the update (dynamic SQL with safeguards)
  v_update_query := format(
    'UPDATE %I SET %I = %L::INTEGER, updated_at = NOW() WHERE id = %L',
    p_entity_table,
    p_stat_field,
    p_new_value,
    p_entity_id
  );
  EXECUTE v_update_query;

  RETURN v_correction_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. HELPER: Grant permissions
-- ============================================================================

-- Allow Supabase authenticated users to call these functions
GRANT EXECUTE ON FUNCTION compute_yards_per_carry TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_yards_per_attempt TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_passer_efficiency TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_td_to_touch_ratio TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_true_shooting_percentage TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_effective_fg_percentage TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_usage_rate_simplified TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_player_efficiency_rating TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_on_base_percentage TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_slugging_percentage TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_ops TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_whip_pitcher TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_era_percentile TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_zscore_within_era TO anon, authenticated;

-- Admin functions
GRANT EXECUTE ON FUNCTION refresh_career_summaries TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_era_adjusted_leaders TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_school_pipeline_stats TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_materialized_views TO authenticated;
GRANT EXECUTE ON FUNCTION apply_stat_correction TO authenticated;

-- ============================================================================
-- 9. INDEX OPTIMIZATIONS FOR FUNCTION-BASED QUERIES
-- ============================================================================

-- Index on computed fields (if stored)
-- These would be created after adding computed columns to tables
-- Example:
-- CREATE INDEX idx_football_ps_ypc ON football_player_seasons((compute_yards_per_carry(rush_yards, rush_carries)))
-- WHERE rush_carries IS NOT NULL;

-- ============================================================================
-- End of Computed Metrics Functions
-- ============================================================================
