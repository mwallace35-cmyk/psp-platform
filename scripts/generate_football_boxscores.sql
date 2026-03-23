-- Generate football game_player_stats from season averages
-- For each player's season, distribute their per-game averages across all games their team played

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number,
  rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards, points,
  stats_json, source_type, created_at)
SELECT
  g.id as game_id,
  fps.player_id,
  fps.school_id,
  'football' as sport_id,
  p.name as player_name,
  fps.jersey_number,
  CASE WHEN fps.games_played > 0 AND fps.rush_carries > 0 THEN ROUND(fps.rush_carries::numeric / fps.games_played)::int ELSE NULL END,
  CASE WHEN fps.games_played > 0 AND fps.rush_yards IS NOT NULL AND fps.rush_yards != 0 THEN ROUND(fps.rush_yards::numeric / fps.games_played)::int ELSE NULL END,
  CASE WHEN fps.games_played > 0 AND fps.pass_comp > 0 THEN ROUND(fps.pass_comp::numeric / fps.games_played)::int ELSE NULL END,
  CASE WHEN fps.games_played > 0 AND fps.pass_yards IS NOT NULL AND fps.pass_yards != 0 THEN ROUND(fps.pass_yards::numeric / fps.games_played)::int ELSE NULL END,
  CASE WHEN fps.games_played > 0 AND fps.receptions > 0 THEN ROUND(fps.receptions::numeric / fps.games_played)::int ELSE NULL END,
  CASE WHEN fps.games_played > 0 AND fps.rec_yards IS NOT NULL AND fps.rec_yards != 0 THEN ROUND(fps.rec_yards::numeric / fps.games_played)::int ELSE NULL END,
  CASE WHEN fps.games_played > 0 AND fps.points > 0 THEN ROUND(fps.points::numeric / fps.games_played)::int ELSE NULL END,
  jsonb_build_object(
    'games_played', fps.games_played,
    'season_rush_yards', fps.rush_yards,
    'season_rush_td', fps.rush_td,
    'season_pass_yards', fps.pass_yards,
    'season_pass_td', fps.pass_td,
    'season_rec_yards', fps.rec_yards,
    'season_rec_td', fps.rec_td,
    'season_points', fps.points,
    'season_tackles', fps.tackles,
    'season_sacks', fps.sacks,
    'season_interceptions', fps.interceptions
  ) as stats_json,
  'season_average' as source_type,
  NOW() as created_at
FROM football_player_seasons fps
JOIN players p ON fps.player_id = p.id
JOIN games g ON g.season_id = fps.season_id
  AND g.sport_id = 'football'
  AND (g.home_school_id = fps.school_id OR g.away_school_id = fps.school_id)
WHERE fps.season_id IN (SELECT id FROM seasons WHERE year_start BETWEEN 2019 AND 2025)
  AND fps.games_played > 0
  -- Only include players with some meaningful stats
  AND (fps.rush_yards IS NOT NULL OR fps.pass_yards IS NOT NULL OR fps.rec_yards IS NOT NULL OR fps.points > 0 OR fps.tackles > 0)
  -- Don't duplicate existing box scores
  AND NOT EXISTS (
    SELECT 1 FROM game_player_stats gps
    WHERE gps.game_id = g.id AND gps.player_id = fps.player_id
  )
ON CONFLICT DO NOTHING;
