-- Migration: Add materialized view refresh functions and helpers
-- Purpose: Enable automated and manual refresh of materialized views

-- Function to refresh a single materialized view by name
-- Usage: SELECT refresh_materialized_view('football_career_leaders');
CREATE OR REPLACE FUNCTION refresh_materialized_view(view_name text)
RETURNS void AS $$
BEGIN
  IF view_name = 'football_career_leaders' THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders;
  ELSIF view_name = 'basketball_career_leaders' THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders;
  ELSIF view_name = 'season_leaderboards' THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY season_leaderboards;
  ELSE
    RAISE EXCEPTION 'Unknown materialized view: %', view_name;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh all materialized views
-- Usage: SELECT refresh_all_materialized_views();
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS TABLE(view_name text, status text, duration_ms integer) AS $$
DECLARE
  start_time timestamp;
  end_time timestamp;
BEGIN
  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'football_career_leaders'::text, 'refreshed'::text, EXTRACT(EPOCH FROM (end_time - start_time))::integer * 1000;

  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'basketball_career_leaders'::text, 'refreshed'::text, EXTRACT(EPOCH FROM (end_time - start_time))::integer * 1000;

  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY season_leaderboards;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'season_leaderboards'::text, 'refreshed'::text, EXTRACT(EPOCH FROM (end_time - start_time))::integer * 1000;
END;
$$ LANGUAGE plpgsql;

-- Enable pg_cron extension if not already enabled (may require superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Scheduled refresh jobs (commented out - uncomment after pg_cron is enabled)
-- SELECT cron.schedule('refresh_football_leaders', '0 */6 * * *', 'SELECT refresh_materialized_view(''football_career_leaders'')');
-- SELECT cron.schedule('refresh_basketball_leaders', '0 */6 * * *', 'SELECT refresh_materialized_view(''basketball_career_leaders'')');
-- SELECT cron.schedule('refresh_season_leaderboards', '0 */4 * * *', 'SELECT refresh_materialized_view(''season_leaderboards'')');

-- Ensure unique indexes exist for CONCURRENTLY refreshes
-- These are required for concurrent refresh without locking
CREATE UNIQUE INDEX IF NOT EXISTS idx_football_career_leaders_player
ON football_career_leaders(player_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_basketball_career_leaders_player
ON basketball_career_leaders(player_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_season_leaderboards_composite
ON season_leaderboards(season_id, sport_id, stat_type, player_id);
