-- Generate basketball game_player_stats from season averages
-- For each player's season, distribute their per-game averages across all games their team played

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, created_at)
SELECT
  g.id as game_id,
  bps.player_id,
  bps.school_id,
  'basketball' as sport_id,
  p.name as player_name,
  bps.jersey_number,
  CASE WHEN bps.ppg IS NOT NULL THEN ROUND(bps.ppg)::int ELSE NULL END as points,
  jsonb_build_object(
    'ppg', bps.ppg,
    'rpg', bps.rpg,
    'apg', bps.apg,
    'fgm', CASE WHEN bps.games_played > 0 THEN ROUND(bps.fgm::numeric / bps.games_played, 1) ELSE NULL END,
    'fga', CASE WHEN bps.games_played > 0 THEN ROUND(bps.fga::numeric / bps.games_played, 1) ELSE NULL END,
    'fg_pct', bps.fg_pct,
    'three_pm', CASE WHEN bps.games_played > 0 THEN ROUND(bps.three_pm::numeric / bps.games_played, 1) ELSE NULL END,
    'three_pa', CASE WHEN bps.games_played > 0 THEN ROUND(bps.three_pa::numeric / bps.games_played, 1) ELSE NULL END,
    'three_pct', bps.three_pct,
    'ftm', CASE WHEN bps.games_played > 0 THEN ROUND(bps.ftm::numeric / bps.games_played, 1) ELSE NULL END,
    'fta', CASE WHEN bps.games_played > 0 THEN ROUND(bps.fta::numeric / bps.games_played, 1) ELSE NULL END,
    'ft_pct', bps.ft_pct,
    'rebounds', bps.rpg,
    'assists', bps.apg,
    'steals', CASE WHEN bps.games_played > 0 THEN ROUND(bps.steals::numeric / bps.games_played, 1) ELSE NULL END,
    'blocks', CASE WHEN bps.games_played > 0 THEN ROUND(bps.blocks::numeric / bps.games_played, 1) ELSE NULL END,
    'games_played', bps.games_played,
    'season_points', bps.points,
    'season_rebounds', bps.rebounds,
    'season_assists', bps.assists
  ) as stats_json,
  'season_average' as source_type,
  NOW() as created_at
FROM basketball_player_seasons bps
JOIN players p ON bps.player_id = p.id
JOIN games g ON g.season_id = bps.season_id
  AND g.sport_id = 'basketball'
  AND (g.home_school_id = bps.school_id OR g.away_school_id = bps.school_id)
WHERE bps.season_id IN (SELECT id FROM seasons WHERE year_start BETWEEN 2016 AND 2025)
  AND bps.games_played > 0
  AND bps.ppg IS NOT NULL
  -- Don't duplicate existing box scores
  AND NOT EXISTS (
    SELECT 1 FROM game_player_stats gps
    WHERE gps.game_id = g.id AND gps.player_id = bps.player_id
  )
ON CONFLICT DO NOTHING;
