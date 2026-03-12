-- Create RPC function for finding similar football players
CREATE OR REPLACE FUNCTION get_similar_football_players(
  target_player_id INT,
  target_positions TEXT[],
  target_primary_stat INT,
  target_graduation_year INT,
  result_limit INT DEFAULT 5
)
RETURNS TABLE (
  id INT,
  name TEXT,
  slug TEXT,
  primary_school_id INT,
  school_name TEXT,
  school_slug TEXT,
  college TEXT,
  pro_team TEXT,
  pro_draft_info TEXT,
  positions TEXT[],
  graduation_year INT,
  primary_stat_value INT,
  similarity_score INT
) AS $$
BEGIN
  RETURN QUERY
  WITH player_stats AS (
    SELECT
      p.id,
      p.name,
      p.slug,
      p.primary_school_id,
      s.name as school_name,
      s.slug as school_slug,
      p.college,
      p.pro_team,
      p.pro_draft_info,
      p.positions,
      p.graduation_year,
      MAX(fps.rush_yards) as rush_yards,
      MAX(fps.pass_yards) as pass_yards,
      MAX(fps.rec_yards) as rec_yards
    FROM players p
    LEFT JOIN schools s ON p.primary_school_id = s.id
    LEFT JOIN football_player_seasons fps ON p.id = fps.player_id
    WHERE p.id != target_player_id
      AND p.deleted_at IS NULL
      AND (p.positions && target_positions OR p.positions IS NULL OR array_length(p.positions, 1) = 0)
    GROUP BY p.id, p.name, p.slug, p.primary_school_id, s.name, s.slug, p.college, p.pro_team, p.pro_draft_info, p.positions, p.graduation_year
  )
  SELECT
    ps.id,
    ps.name,
    ps.slug,
    ps.primary_school_id,
    ps.school_name,
    ps.school_slug,
    ps.college,
    ps.pro_team,
    ps.pro_draft_info,
    ps.positions,
    ps.graduation_year,
    COALESCE(GREATEST(ps.rush_yards, ps.pass_yards, ps.rec_yards), 0)::INT as primary_stat_value,
    ROUND(
      (1 - ABS(COALESCE(GREATEST(ps.rush_yards, ps.pass_yards, ps.rec_yards), 0) - target_primary_stat)::FLOAT /
       GREATEST(COALESCE(GREATEST(ps.rush_yards, ps.pass_yards, ps.rec_yards), 0), target_primary_stat, 1)) * 40 +
      CASE WHEN ps.positions && target_positions THEN 30 ELSE 10 END +
      CASE WHEN ABS(COALESCE(ps.graduation_year, target_graduation_year) - target_graduation_year) <= 5 THEN 20 ELSE 10 END +
      10
    )::INT as similarity_score
  FROM player_stats ps
  WHERE COALESCE(GREATEST(ps.rush_yards, ps.pass_yards, ps.rec_yards), 0) BETWEEN target_primary_stat * 0.5 AND target_primary_stat * 2
  ORDER BY similarity_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create RPC function for finding similar basketball players
CREATE OR REPLACE FUNCTION get_similar_basketball_players(
  target_player_id INT,
  target_positions TEXT[],
  target_primary_stat INT,
  target_graduation_year INT,
  result_limit INT DEFAULT 5
)
RETURNS TABLE (
  id INT,
  name TEXT,
  slug TEXT,
  primary_school_id INT,
  school_name TEXT,
  school_slug TEXT,
  college TEXT,
  pro_team TEXT,
  pro_draft_info TEXT,
  positions TEXT[],
  graduation_year INT,
  primary_stat_value INT,
  similarity_score INT
) AS $$
BEGIN
  RETURN QUERY
  WITH player_stats AS (
    SELECT
      p.id,
      p.name,
      p.slug,
      p.primary_school_id,
      s.name as school_name,
      s.slug as school_slug,
      p.college,
      p.pro_team,
      p.pro_draft_info,
      p.positions,
      p.graduation_year,
      MAX(bps.points) as career_points
    FROM players p
    LEFT JOIN schools s ON p.primary_school_id = s.id
    LEFT JOIN basketball_player_seasons bps ON p.id = bps.player_id
    WHERE p.id != target_player_id
      AND p.deleted_at IS NULL
      AND (p.positions && target_positions OR p.positions IS NULL OR array_length(p.positions, 1) = 0)
    GROUP BY p.id, p.name, p.slug, p.primary_school_id, s.name, s.slug, p.college, p.pro_team, p.pro_draft_info, p.positions, p.graduation_year
  )
  SELECT
    ps.id,
    ps.name,
    ps.slug,
    ps.primary_school_id,
    ps.school_name,
    ps.school_slug,
    ps.college,
    ps.pro_team,
    ps.pro_draft_info,
    ps.positions,
    ps.graduation_year,
    COALESCE(ps.career_points, 0)::INT as primary_stat_value,
    ROUND(
      (1 - ABS(COALESCE(ps.career_points, 0) - target_primary_stat)::FLOAT /
       GREATEST(COALESCE(ps.career_points, 0), target_primary_stat, 1)) * 40 +
      CASE WHEN ps.positions && target_positions THEN 30 ELSE 10 END +
      CASE WHEN ABS(COALESCE(ps.graduation_year, target_graduation_year) - target_graduation_year) <= 5 THEN 20 ELSE 10 END +
      10
    )::INT as similarity_score
  FROM player_stats ps
  WHERE COALESCE(ps.career_points, 0) BETWEEN target_primary_stat * 0.5 AND target_primary_stat * 2
  ORDER BY similarity_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create RPC function for finding similar baseball players
CREATE OR REPLACE FUNCTION get_similar_baseball_players(
  target_player_id INT,
  target_positions TEXT[],
  target_primary_stat INT,
  target_graduation_year INT,
  result_limit INT DEFAULT 5
)
RETURNS TABLE (
  id INT,
  name TEXT,
  slug TEXT,
  primary_school_id INT,
  school_name TEXT,
  school_slug TEXT,
  college TEXT,
  pro_team TEXT,
  pro_draft_info TEXT,
  positions TEXT[],
  graduation_year INT,
  primary_stat_value INT,
  similarity_score INT
) AS $$
BEGIN
  RETURN QUERY
  WITH player_stats AS (
    SELECT
      p.id,
      p.name,
      p.slug,
      p.primary_school_id,
      s.name as school_name,
      s.slug as school_slug,
      p.college,
      p.pro_team,
      p.pro_draft_info,
      p.positions,
      p.graduation_year,
      MAX(bps.home_runs) as career_home_runs
    FROM players p
    LEFT JOIN schools s ON p.primary_school_id = s.id
    LEFT JOIN baseball_player_seasons bps ON p.id = bps.player_id
    WHERE p.id != target_player_id
      AND p.deleted_at IS NULL
      AND (p.positions && target_positions OR p.positions IS NULL OR array_length(p.positions, 1) = 0)
    GROUP BY p.id, p.name, p.slug, p.primary_school_id, s.name, s.slug, p.college, p.pro_team, p.pro_draft_info, p.positions, p.graduation_year
  )
  SELECT
    ps.id,
    ps.name,
    ps.slug,
    ps.primary_school_id,
    ps.school_name,
    ps.school_slug,
    ps.college,
    ps.pro_team,
    ps.pro_draft_info,
    ps.positions,
    ps.graduation_year,
    COALESCE(ps.career_home_runs, 0)::INT as primary_stat_value,
    ROUND(
      (1 - ABS(COALESCE(ps.career_home_runs, 0) - target_primary_stat)::FLOAT /
       GREATEST(COALESCE(ps.career_home_runs, 0), target_primary_stat, 1)) * 40 +
      CASE WHEN ps.positions && target_positions THEN 30 ELSE 10 END +
      CASE WHEN ABS(COALESCE(ps.graduation_year, target_graduation_year) - target_graduation_year) <= 5 THEN 20 ELSE 10 END +
      10
    )::INT as similarity_score
  FROM player_stats ps
  WHERE COALESCE(ps.career_home_runs, 0) BETWEEN target_primary_stat * 0.5 AND target_primary_stat * 2
  ORDER BY similarity_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;
