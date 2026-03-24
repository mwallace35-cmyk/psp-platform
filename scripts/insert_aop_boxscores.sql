-- Delete season_average entries for games that now have real box scores
DELETE FROM game_player_stats gps
USING games g
WHERE gps.game_id = g.id
  AND gps.source_type = 'season_average'
  AND g.sport_id = 'basketball'
  AND g.season_id = 76
  AND EXISTS (
    SELECT 1 FROM game_player_stats gps2
    WHERE gps2.game_id = g.id AND gps2.source_type = 'box_score'
  );

-- Insert real box scores

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 8, '{"minutes": 32, "fgm": 3, "fga": 8, "tpm": 2, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 10, "rebounds": 13, "assists": 1, "steals": 1, "blocks": 4, "turnovers": 2, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 9, '{"minutes": 32, "fgm": 3, "fga": 6, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 3, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 11, '{"minutes": 31, "fgm": 5, "fga": 9, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 1, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 8, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 14, '{"minutes": 32, "fgm": 6, "fga": 16, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 14, '{"minutes": 19, "fgm": 7, "fga": 9, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 4, "def_reb": 2, "rebounds": 6, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 10, '{"minutes": 14, "fgm": 3, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 10, '{"minutes": 31, "fgm": 3, "fga": 12, "tpm": 0, "tpa": 3, "ftm": 4, "fta": 6, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 8, "steals": 4, "blocks": 2, "turnovers": 0, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 18, '{"minutes": 31, "fgm": 7, "fga": 13, "tpm": 2, "tpa": 5, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 9, '{"minutes": 28, "fgm": 3, "fga": 9, "tpm": 3, "tpa": 9, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 15, '{"minutes": 31, "fgm": 6, "fga": 10, "tpm": 3, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 2, "turnovers": 2, "fouls": 0, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 2, '{"minutes": 5, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 0, '{"minutes": 9, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 3, '{"minutes": 20, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Banner', '10', 0, '{"minutes": 5, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 8, '{"minutes": 29, "fgm": 3, "fga": 8, "tpm": 2, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 4, "def_reb": 5, "rebounds": 9, "assists": 1, "steals": 1, "blocks": 3, "turnovers": 3, "fouls": 0, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 16, '{"minutes": 28, "fgm": 5, "fga": 11, "tpm": 1, "tpa": 5, "ftm": 5, "fta": 6, "off_reb": 2, "def_reb": 6, "rebounds": 8, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 1, '{"minutes": 15, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 19, '{"minutes": 31, "fgm": 4, "fga": 12, "tpm": 0, "tpa": 1, "ftm": 11, "fta": 12, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 5, "steals": 1, "blocks": 1, "turnovers": 6, "fouls": 1, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 7, '{"minutes": 31, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 1, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 6, '{"minutes": 22, "fgm": 2, "fga": 4, "tpm": 1, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 9, "rebounds": 10, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'White', '4', 2, '{"minutes": 9, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Richardson', '0', 2, '{"minutes": 3, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 5, '{"minutes": 21, "fgm": 2, "fga": 8, "tpm": 0, "tpa": 3, "ftm": 1, "fta": 1, "off_reb": 2, "def_reb": 6, "rebounds": 8, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fairlamb', '13', 0, '{"minutes": 22, "fgm": 0, "fga": 9, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 5, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 0, '{"minutes": 15, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 0, '{"minutes": 21, "fgm": 0, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 4, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 9, '{"minutes": 26, "fgm": 3, "fga": 9, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 8, "rebounds": 9, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Allen-Bates', '25', 2, '{"minutes": 6, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Tesafaye', '20', 4, '{"minutes": 10, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Kaune', '34', 2, '{"minutes": 9, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Garrett', '11', 3, '{"minutes": 9, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 14, '{"minutes": 16, "fgm": 5, "fga": 9, "tpm": 4, "tpa": 7, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 15, '{"minutes": 32, "fgm": 5, "fga": 10, "tpm": 1, "tpa": 4, "ftm": 4, "fta": 4, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 0, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 12, '{"minutes": 31, "fgm": 2, "fga": 10, "tpm": 2, "tpa": 8, "ftm": 6, "fta": 6, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 11, '{"minutes": 30, "fgm": 2, "fga": 8, "tpm": 2, "tpa": 7, "ftm": 5, "fta": 6, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 5, "steals": 5, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 14, '{"minutes": 32, "fgm": 7, "fga": 14, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 5, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 10, '{"minutes": 20, "fgm": 5, "fga": 10, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 2, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 0, '{"minutes": 15, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 15, '{"minutes": 30, "fgm": 4, "fga": 9, "tpm": 3, "tpa": 7, "ftm": 4, "fta": 4, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 0, '{"minutes": 22, "fgm": 0, "fga": 12, "tpm": 0, "tpa": 7, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 0, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 7, '{"minutes": 20, "fgm": 3, "fga": 6, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 2, '{"minutes": 24, "fgm": 1, "fga": 6, "tpm": 0, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 4, '{"minutes": 14, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 0, "steals": 0, "blocks": 2, "turnovers": 3, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 6, '{"minutes": 19, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 2, '{"minutes": 10, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 9, '{"minutes": 13, "fgm": 2, "fga": 6, "tpm": 2, "tpa": 5, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Lilly', '21', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Chase', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Evans', '12', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Stanley', '13', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Hamidu', '10', 2, '{"minutes": 1, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 9, '{"minutes": 31, "fgm": 2, "fga": 7, "tpm": 0, "tpa": 3, "ftm": 5, "fta": 5, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 12, '{"minutes": 29, "fgm": 4, "fga": 10, "tpm": 2, "tpa": 6, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 3, '{"minutes": 31, "fgm": 1, "fga": 7, "tpm": 1, "tpa": 7, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 16, '{"minutes": 32, "fgm": 7, "fga": 12, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 3, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 13, '{"minutes": 23, "fgm": 6, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 4, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 5, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 6, '{"minutes": 14, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 6, "off_reb": 2, "def_reb": 5, "rebounds": 7, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 13, '{"minutes": 26, "fgm": 5, "fga": 8, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 6, "off_reb": 4, "def_reb": 7, "rebounds": 11, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 12, '{"minutes": 28, "fgm": 3, "fga": 13, "tpm": 0, "tpa": 4, "ftm": 6, "fta": 7, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 1, '{"minutes": 26, "fgm": 0, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 8, "off_reb": 2, "def_reb": 5, "rebounds": 7, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 3, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 0, '{"minutes": 8, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 4, '{"minutes": 17, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 2, '{"minutes": 11, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 5, '{"minutes": 20, "fgm": 2, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 11, '{"minutes": 21, "fgm": 3, "fga": 11, "tpm": 3, "tpa": 8, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'McCabe', '1', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 8, '{"minutes": 32, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 4, '{"minutes": 32, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 16, '{"minutes": 32, "fgm": 5, "fga": 9, "tpm": 2, "tpa": 4, "ftm": 4, "fta": 6, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 5, "steals": 5, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 3, '{"minutes": 14, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'White', '4', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 6, '{"minutes": 30, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 2, '{"minutes": 18, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 6, '{"minutes": 29, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 1, "off_reb": 4, "def_reb": 2, "rebounds": 6, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 6, '{"minutes": 32, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 6, "def_reb": 4, "rebounds": 10, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 3, '{"minutes": 28, "fgm": 1, "fga": 8, "tpm": 1, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 5, "rebounds": 7, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz-Muhammad', '11', 8, '{"minutes": 31, "fgm": 4, "fga": 14, "tpm": 0, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 5, '{"minutes": 28, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 5, '{"minutes": 12, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 27, '{"minutes": 32, "fgm": 11, "fga": 20, "tpm": 0, "tpa": 0, "ftm": 5, "fta": 7, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 2, "steals": 2, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 27}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 15, '{"minutes": 22, "fgm": 6, "fga": 9, "tpm": 2, "tpa": 5, "ftm": 1, "fta": 3, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 7, '{"minutes": 30, "fgm": 3, "fga": 5, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 10, '{"minutes": 29, "fgm": 4, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 7, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 2, '{"minutes": 13, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 3, "turnovers": 1, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 19, '{"minutes": 20, "fgm": 7, "fga": 14, "tpm": 3, "tpa": 10, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 4, "steals": 3, "blocks": 1, "turnovers": 0, "fouls": 0, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 0, '{"minutes": 12, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Thompson', '20', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 13, '{"minutes": 31, "fgm": 5, "fga": 8, "tpm": 3, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 0, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 17, '{"minutes": 32, "fgm": 4, "fga": 10, "tpm": 2, "tpa": 5, "ftm": 7, "fta": 7, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 5, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 14, '{"minutes": 32, "fgm": 5, "fga": 13, "tpm": 2, "tpa": 6, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 7, "steals": 4, "blocks": 1, "turnovers": 8, "fouls": 4, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 18, '{"minutes": 27, "fgm": 8, "fga": 10, "tpm": 2, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 4, '{"minutes": 20, "fgm": 2, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'White', '4', 0, '{"minutes": 10, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 0, '{"minutes": 8, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 24, '{"minutes": 36, "fgm": 9, "fga": 19, "tpm": 1, "tpa": 4, "ftm": 5, "fta": 5, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 3, "steals": 1, "blocks": 3, "turnovers": 2, "fouls": 2, "points": 24}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 14, '{"minutes": 27, "fgm": 5, "fga": 14, "tpm": 2, "tpa": 8, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 18, '{"minutes": 36, "fgm": 7, "fga": 11, "tpm": 1, "tpa": 4, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 5, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 8, '{"minutes": 33, "fgm": 4, "fga": 13, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 5, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 0, '{"minutes": 10, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 12, '{"minutes": 27, "fgm": 4, "fga": 9, "tpm": 1, "tpa": 4, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 0, '{"minutes": 10, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McNeil', '4', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 21, '{"minutes": 35, "fgm": 7, "fga": 15, "tpm": 2, "tpa": 4, "ftm": 5, "fta": 8, "off_reb": 4, "def_reb": 7, "rebounds": 11, "assists": 5, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 29, '{"minutes": 34, "fgm": 8, "fga": 16, "tpm": 0, "tpa": 2, "ftm": 13, "fta": 13, "off_reb": 1, "def_reb": 7, "rebounds": 8, "assists": 7, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 29}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 11, '{"minutes": 28, "fgm": 4, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 4, "fouls": 4, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 17, '{"minutes": 36, "fgm": 6, "fga": 12, "tpm": 1, "tpa": 4, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 6, '{"minutes": 32, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 4, '{"minutes": 14, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Breslin', '5', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 22, '{"minutes": 24, "fgm": 7, "fga": 16, "tpm": 0, "tpa": 1, "ftm": 8, "fta": 8, "off_reb": 3, "def_reb": 6, "rebounds": 9, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 3, "fouls": 4, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McNeil', '4', 0, '{"minutes": 11, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Samuel', '11', 7, '{"minutes": 5, "fgm": 2, "fga": 3, "tpm": 1, "tpa": 2, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Mariani', '10', 0, '{"minutes": 6, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 5, '{"minutes": 22, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 6, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 5, '{"minutes": 24, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 27, '{"minutes": 28, "fgm": 9, "fga": 14, "tpm": 3, "tpa": 4, "ftm": 6, "fta": 8, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 1, "points": 27}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 3, '{"minutes": 25, "fgm": 1, "fga": 7, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 2, '{"minutes": 3, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Thompson', '20', 6, '{"minutes": 11, "fgm": 3, "fga": 7, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Scott', '22', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 13, '{"minutes": 31, "fgm": 5, "fga": 7, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 2, "blocks": 1, "turnovers": 4, "fouls": 3, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 12, '{"minutes": 28, "fgm": 5, "fga": 12, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 8, "off_reb": 1, "def_reb": 11, "rebounds": 12, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 12, '{"minutes": 20, "fgm": 4, "fga": 7, "tpm": 2, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 5, '{"minutes": 13, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 3, '{"minutes": 31, "fgm": 1, "fga": 5, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 6, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 19, '{"minutes": 29, "fgm": 6, "fga": 11, "tpm": 5, "tpa": 8, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 4, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Graham', '30', 3, '{"minutes": 1, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Gabriel', '14', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Seda', '21', 0, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Lewis', '34', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 16, '{"minutes": 32, "fgm": 6, "fga": 14, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 6, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 5, "fouls": 3, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 5, '{"minutes": 28, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 4, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 14, '{"minutes": 31, "fgm": 5, "fga": 8, "tpm": 1, "tpa": 3, "ftm": 3, "fta": 5, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 5, '{"minutes": 29, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 6, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 4, '{"minutes": 13, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 1, "blocks": 2, "turnovers": 0, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 10, '{"minutes": 20, "fgm": 4, "fga": 9, "tpm": 1, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 0, '{"minutes": 5, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Mariani', '10', 3, '{"minutes": 2, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 20, '{"minutes": 31, "fgm": 6, "fga": 18, "tpm": 1, "tpa": 6, "ftm": 7, "fta": 7, "off_reb": 5, "def_reb": 3, "rebounds": 8, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 8, '{"minutes": 31, "fgm": 2, "fga": 11, "tpm": 0, "tpa": 3, "ftm": 4, "fta": 5, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 1, "steals": 3, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 5, '{"minutes": 30, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 0, '{"minutes": 16, "fgm": 0, "fga": 6, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 2, '{"minutes": 16, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 4, "def_reb": 3, "rebounds": 7, "assists": 2, "steals": 2, "blocks": 2, "turnovers": 1, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 10, '{"minutes": 15, "fgm": 3, "fga": 7, "tpm": 1, "tpa": 4, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 1, '{"minutes": 8, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 4, '{"minutes": 10, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-11'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 14, '{"minutes": 21, "fgm": 3, "fga": 13, "tpm": 0, "tpa": 3, "ftm": 8, "fta": 10, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 2, '{"minutes": 19, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 2, "blocks": 3, "turnovers": 1, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 12, '{"minutes": 32, "fgm": 4, "fga": 9, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 4, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 2, '{"minutes": 32, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 4, "steals": 1, "blocks": 1, "turnovers": 4, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 16, '{"minutes": 24, "fgm": 3, "fga": 8, "tpm": 3, "tpa": 7, "ftm": 7, "fta": 7, "off_reb": 2, "def_reb": 6, "rebounds": 8, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 0, '{"minutes": 10, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Thompson', '20', 17, '{"minutes": 18, "fgm": 6, "fga": 7, "tpm": 2, "tpa": 2, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 0, '{"minutes": 4, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 19, '{"minutes": 31, "fgm": 8, "fga": 13, "tpm": 1, "tpa": 1, "ftm": 2, "fta": 5, "off_reb": 5, "def_reb": 6, "rebounds": 11, "assists": 1, "steals": 3, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 10, '{"minutes": 32, "fgm": 2, "fga": 7, "tpm": 0, "tpa": 4, "ftm": 6, "fta": 8, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 9, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 10, '{"minutes": 16, "fgm": 4, "fga": 7, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 17, '{"minutes": 29, "fgm": 6, "fga": 12, "tpm": 4, "tpa": 9, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 6, "rebounds": 8, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 8, '{"minutes": 26, "fgm": 2, "fga": 9, "tpm": 0, "tpa": 3, "ftm": 4, "fta": 6, "off_reb": 5, "def_reb": 2, "rebounds": 7, "assists": 1, "steals": 3, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 3, '{"minutes": 13, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 4, "steals": 0, "blocks": 4, "turnovers": 2, "fouls": 4, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 0, '{"minutes": 2, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 0, '{"minutes": 6, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-30'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 19, '{"minutes": 31, "fgm": 5, "fga": 10, "tpm": 1, "tpa": 3, "ftm": 8, "fta": 8, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 6, "steals": 0, "blocks": 2, "turnovers": 2, "fouls": 4, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 6, '{"minutes": 21, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 15, '{"minutes": 32, "fgm": 6, "fga": 10, "tpm": 2, "tpa": 5, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 3, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 7, '{"minutes": 31, "fgm": 3, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 3, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 0, '{"minutes": 15, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 8, '{"minutes": 18, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 4, "ftm": 3, "fta": 3, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 4, '{"minutes": 12, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 17, '{"minutes": 22, "fgm": 6, "fga": 10, "tpm": 2, "tpa": 5, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 8, '{"minutes": 30, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 4, '{"minutes": 19, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 5, '{"minutes": 20, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 19, '{"minutes": 27, "fgm": 8, "fga": 11, "tpm": 2, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 5, "def_reb": 3, "rebounds": 8, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Ruffin', '0', 0, '{"minutes": 21, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 8, '{"minutes": 21, "fgm": 3, "fga": 9, "tpm": 2, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 6, "rebounds": 9, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 24, '{"minutes": 31, "fgm": 9, "fga": 16, "tpm": 4, "tpa": 7, "ftm": 2, "fta": 4, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 0, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 0, "points": 24}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 27, '{"minutes": 28, "fgm": 8, "fga": 16, "tpm": 3, "tpa": 6, "ftm": 8, "fta": 11, "off_reb": 0, "def_reb": 8, "rebounds": 8, "assists": 8, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 27}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 6, '{"minutes": 29, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 8, "turnovers": 0, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 7, '{"minutes": 27, "fgm": 3, "fga": 8, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 2, '{"minutes": 20, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 7, '{"minutes": 11, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 4, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 4, '{"minutes": 14, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 3, '{"minutes": 32, "fgm": 1, "fga": 6, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 2, "turnovers": 1, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 20, '{"minutes": 31, "fgm": 7, "fga": 17, "tpm": 4, "tpa": 10, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 23, '{"minutes": 31, "fgm": 8, "fga": 14, "tpm": 2, "tpa": 6, "ftm": 5, "fta": 5, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 3, "fouls": 5, "points": 23}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 7, '{"minutes": 29, "fgm": 2, "fga": 12, "tpm": 0, "tpa": 3, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 5, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 6, '{"minutes": 26, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 1, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 3, '{"minutes": 11, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-01'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 18, '{"minutes": 31, "fgm": 7, "fga": 14, "tpm": 1, "tpa": 4, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 4, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 23, '{"minutes": 32, "fgm": 6, "fga": 11, "tpm": 1, "tpa": 1, "ftm": 10, "fta": 13, "off_reb": 0, "def_reb": 8, "rebounds": 8, "assists": 4, "steals": 2, "blocks": 1, "turnovers": 3, "fouls": 2, "points": 23}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 10, '{"minutes": 26, "fgm": 5, "fga": 7, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 5, "rebounds": 8, "assists": 0, "steals": 0, "blocks": 4, "turnovers": 2, "fouls": 5, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 5, '{"minutes": 15, "fgm": 2, "fga": 4, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 3, '{"minutes": 22, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 5, '{"minutes": 17, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 14, '{"minutes": 17, "fgm": 5, "fga": 7, "tpm": 2, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 2, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 31, '{"minutes": 31, "fgm": 7, "fga": 19, "tpm": 4, "tpa": 5, "ftm": 13, "fta": 19, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 31}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 24, '{"minutes": 28, "fgm": 9, "fga": 13, "tpm": 2, "tpa": 4, "ftm": 4, "fta": 6, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 4, "points": 24}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 2, '{"minutes": 23, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 7, "rebounds": 8, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 7, '{"minutes": 32, "fgm": 2, "fga": 6, "tpm": 2, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 3, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 4, '{"minutes": 23, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 2, "turnovers": 0, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 0, '{"minutes": 14, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 5, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 5, '{"minutes": 9, "fgm": 2, "fga": 4, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 14, '{"minutes": 32, "fgm": 5, "fga": 8, "tpm": 1, "tpa": 3, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 7, "rebounds": 8, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 7, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 21, '{"minutes": 29, "fgm": 8, "fga": 10, "tpm": 1, "tpa": 3, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 6, '{"minutes": 28, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 2, '{"minutes": 20, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 8, '{"minutes": 31, "fgm": 3, "fga": 8, "tpm": 1, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 8, '{"minutes": 19, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 4, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Breslin', '5', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 6, '{"minutes": 25, "fgm": 1, "fga": 9, "tpm": 0, "tpa": 2, "ftm": 4, "fta": 5, "off_reb": 3, "def_reb": 3, "rebounds": 6, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 17, '{"minutes": 31, "fgm": 5, "fga": 13, "tpm": 2, "tpa": 9, "ftm": 5, "fta": 10, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 5, "fouls": 1, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 12, '{"minutes": 17, "fgm": 4, "fga": 10, "tpm": 3, "tpa": 6, "ftm": 1, "fta": 2, "off_reb": 3, "def_reb": 0, "rebounds": 3, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 7, '{"minutes": 31, "fgm": 3, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 7, '{"minutes": 26, "fgm": 3, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 8, '{"minutes": 13, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 0, '{"minutes": 10, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 0, '{"minutes": 5, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'McCabe', '1', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 12, '{"minutes": 38, "fgm": 2, "fga": 9, "tpm": 1, "tpa": 2, "ftm": 7, "fta": 8, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 15, '{"minutes": 38, "fgm": 3, "fga": 10, "tpm": 1, "tpa": 3, "ftm": 8, "fta": 8, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 4, "steals": 3, "blocks": 0, "turnovers": 4, "fouls": 1, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 14, '{"minutes": 38, "fgm": 6, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 2, "steals": 0, "blocks": 5, "turnovers": 3, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 13, '{"minutes": 35, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 8, "fta": 11, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 2, "turnovers": 6, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 13, '{"minutes": 36, "fgm": 5, "fga": 9, "tpm": 3, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 2, "turnovers": 0, "fouls": 3, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 0, '{"minutes": 10, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 2, '{"minutes": 4, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'McGuire', '4', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 22, '{"minutes": 33, "fgm": 7, "fga": 15, "tpm": 1, "tpa": 2, "ftm": 7, "fta": 8, "off_reb": 3, "def_reb": 3, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 6, "turnovers": 2, "fouls": 4, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 6, '{"minutes": 37, "fgm": 3, "fga": 10, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 7, "def_reb": 6, "rebounds": 13, "assists": 2, "steals": 5, "blocks": 1, "turnovers": 1, "fouls": 5, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 18, '{"minutes": 31, "fgm": 7, "fga": 10, "tpm": 4, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 2, "steals": 3, "blocks": 1, "turnovers": 1, "fouls": 5, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Scott', '3', 8, '{"minutes": 39, "fgm": 3, "fga": 14, "tpm": 2, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz', '11', 5, '{"minutes": 30, "fgm": 1, "fga": 7, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 5, '{"minutes": 24, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 0, '{"minutes": 4, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 26, '{"minutes": 36, "fgm": 8, "fga": 12, "tpm": 0, "tpa": 2, "ftm": 10, "fta": 13, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 2, "steals": 0, "blocks": 2, "turnovers": 3, "fouls": 3, "points": 26}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 14, '{"minutes": 35, "fgm": 5, "fga": 10, "tpm": 4, "tpa": 7, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 5, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 13, '{"minutes": 31, "fgm": 3, "fga": 14, "tpm": 3, "tpa": 11, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 8, '{"minutes": 34, "fgm": 3, "fga": 11, "tpm": 2, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 6, '{"minutes": 27, "fgm": 3, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 2, '{"minutes": 12, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 0, '{"minutes": 5, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 18, '{"minutes": 36, "fgm": 6, "fga": 15, "tpm": 0, "tpa": 3, "ftm": 6, "fta": 10, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 4, '{"minutes": 30, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 20, '{"minutes": 36, "fgm": 7, "fga": 11, "tpm": 3, "tpa": 4, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 10, '{"minutes": 36, "fgm": 4, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 4, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 10, '{"minutes": 30, "fgm": 3, "fga": 5, "tpm": 2, "tpa": 3, "ftm": 2, "fta": 4, "off_reb": 0, "def_reb": 8, "rebounds": 8, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 2, '{"minutes": 11, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McNeil', '4', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 15, '{"minutes": 24, "fgm": 5, "fga": 9, "tpm": 0, "tpa": 2, "ftm": 5, "fta": 7, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 17, '{"minutes": 30, "fgm": 6, "fga": 11, "tpm": 2, "tpa": 3, "ftm": 3, "fta": 3, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 7, "steals": 2, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 5, '{"minutes": 29, "fgm": 1, "fga": 9, "tpm": 1, "tpa": 7, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 14, '{"minutes": 25, "fgm": 4, "fga": 8, "tpm": 0, "tpa": 3, "ftm": 6, "fta": 8, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 10, '{"minutes": 23, "fgm": 5, "fga": 6, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 2, "turnovers": 0, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 4, '{"minutes": 10, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 9, '{"minutes": 19, "fgm": 3, "fga": 5, "tpm": 2, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 5, '{"minutes": 17, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 5, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 24, '{"minutes": 29, "fgm": 8, "fga": 19, "tpm": 1, "tpa": 5, "ftm": 7, "fta": 8, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 24}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 3, '{"minutes": 20, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 14, '{"minutes": 21, "fgm": 5, "fga": 9, "tpm": 3, "tpa": 5, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 9, '{"minutes": 31, "fgm": 3, "fga": 8, "tpm": 2, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 8, "rebounds": 8, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 0, '{"minutes": 29, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 3, '{"minutes": 10, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Graham', '30', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 17, '{"minutes": 32, "fgm": 7, "fga": 19, "tpm": 1, "tpa": 5, "ftm": 2, "fta": 4, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 3, "steals": 3, "blocks": 4, "turnovers": 5, "fouls": 1, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 16, '{"minutes": 27, "fgm": 5, "fga": 12, "tpm": 1, "tpa": 4, "ftm": 5, "fta": 7, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 11, '{"minutes": 32, "fgm": 3, "fga": 6, "tpm": 3, "tpa": 5, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 9, '{"minutes": 29, "fgm": 3, "fga": 10, "tpm": 3, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 3, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 2, '{"minutes": 13, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 2, "turnovers": 0, "fouls": 5, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 4, '{"minutes": 13, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 5, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 5, '{"minutes": 12, "fgm": 2, "fga": 2, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Banner', '10', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Davis-Winn', '55', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 13, '{"minutes": 30, "fgm": 5, "fga": 12, "tpm": 0, "tpa": 3, "ftm": 3, "fta": 3, "off_reb": 4, "def_reb": 3, "rebounds": 7, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 17, '{"minutes": 30, "fgm": 6, "fga": 13, "tpm": 1, "tpa": 2, "ftm": 4, "fta": 4, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 7, '{"minutes": 27, "fgm": 3, "fga": 9, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 4, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 2, "steals": 3, "blocks": 2, "turnovers": 3, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 0, '{"minutes": 28, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 22, '{"minutes": 20, "fgm": 6, "fga": 10, "tpm": 0, "tpa": 0, "ftm": 10, "fta": 13, "off_reb": 5, "def_reb": 6, "rebounds": 11, "assists": 0, "steals": 0, "blocks": 2, "turnovers": 1, "fouls": 3, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 2, '{"minutes": 12, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 0, '{"minutes": 7, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 2, '{"minutes": 4, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 28, '{"minutes": 32, "fgm": 11, "fga": 17, "tpm": 0, "tpa": 1, "ftm": 6, "fta": 10, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 2, "steals": 2, "blocks": 1, "turnovers": 4, "fouls": 2, "points": 28}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 11, '{"minutes": 28, "fgm": 3, "fga": 6, "tpm": 1, "tpa": 2, "ftm": 4, "fta": 6, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 5, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 16, '{"minutes": 32, "fgm": 4, "fga": 7, "tpm": 3, "tpa": 5, "ftm": 5, "fta": 6, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 9, '{"minutes": 29, "fgm": 2, "fga": 2, "tpm": 2, "tpa": 2, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 4, '{"minutes": 24, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 0, '{"minutes": 8, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 3, '{"minutes": 7, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 17, '{"minutes": 31, "fgm": 7, "fga": 13, "tpm": 1, "tpa": 2, "ftm": 2, "fta": 5, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 4, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 4, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 13, '{"minutes": 31, "fgm": 5, "fga": 11, "tpm": 0, "tpa": 4, "ftm": 3, "fta": 6, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 6, '{"minutes": 24, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 4, "off_reb": 5, "def_reb": 5, "rebounds": 10, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 0, '{"minutes": 23, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 16, '{"minutes": 30, "fgm": 7, "fga": 10, "tpm": 1, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 5, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 7, '{"minutes": 19, "fgm": 3, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Scipio', '4', 0, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Alberto', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 27, '{"minutes": 31, "fgm": 8, "fga": 9, "tpm": 0, "tpa": 0, "ftm": 11, "fta": 12, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 27}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 12, '{"minutes": 31, "fgm": 5, "fga": 11, "tpm": 2, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 3, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 7, '{"minutes": 29, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 5, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 13, '{"minutes": 31, "fgm": 3, "fga": 6, "tpm": 2, "tpa": 4, "ftm": 5, "fta": 6, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 4, '{"minutes": 18, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 0, '{"minutes": 8, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 7, '{"minutes": 6, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 4, "fta": 4, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Banner', '10', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Clark', '25', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Quackenbush', '21', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'D’Ambrosio', '22', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Davis-Winn', '55', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jordan', '23', 1, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 9, '{"minutes": 26, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 9, "fta": 10, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 2, "turnovers": 4, "fouls": 5, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 8, '{"minutes": 20, "fgm": 4, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 9, '{"minutes": 25, "fgm": 4, "fga": 10, "tpm": 1, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 2, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Scott', '3', 7, '{"minutes": 25, "fgm": 2, "fga": 10, "tpm": 1, "tpa": 6, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz', '11', 2, '{"minutes": 26, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 15, '{"minutes": 25, "fgm": 6, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 3, '{"minutes": 8, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 2, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Gordon', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Smith', '12', 1, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-28'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 4, '{"minutes": 17, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 4, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 18, '{"minutes": 30, "fgm": 9, "fga": 12, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 7, '{"minutes": 29, "fgm": 3, "fga": 6, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 11, '{"minutes": 25, "fgm": 4, "fga": 10, "tpm": 0, "tpa": 2, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 5, "rebounds": 7, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 11, '{"minutes": 31, "fgm": 4, "fga": 11, "tpm": 3, "tpa": 7, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 2, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 0, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 3, '{"minutes": 13, "fgm": 1, "fga": 6, "tpm": 1, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 2, '{"minutes": 15, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 12, '{"minutes": 31, "fgm": 3, "fga": 7, "tpm": 2, "tpa": 3, "ftm": 4, "fta": 4, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 21, '{"minutes": 31, "fgm": 8, "fga": 13, "tpm": 4, "tpa": 7, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 4, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 10, '{"minutes": 31, "fgm": 3, "fga": 9, "tpm": 3, "tpa": 8, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 7, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Turner', '3', 14, '{"minutes": 31, "fgm": 5, "fga": 15, "tpm": 1, "tpa": 5, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 5, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 2, '{"minutes": 14, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 7, '{"minutes": 22, "fgm": 3, "fga": 3, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 2, '{"minutes": 24, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 16, '{"minutes": 27, "fgm": 5, "fga": 16, "tpm": 1, "tpa": 3, "ftm": 5, "fta": 6, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 2, '{"minutes": 19, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 1, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 18, '{"minutes": 31, "fgm": 8, "fga": 14, "tpm": 2, "tpa": 4, "ftm": 0, "fta": 1, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 7, '{"minutes": 28, "fgm": 3, "fga": 7, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 6, '{"minutes": 16, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 4, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Seda', '21', 3, '{"minutes": 9, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 2, '{"minutes": 2, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Graham', '30', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Lewis', '34', 0, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Kurlyk', '22', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 23, '{"minutes": 26, "fgm": 9, "fga": 12, "tpm": 3, "tpa": 6, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 23}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 19, '{"minutes": 28, "fgm": 5, "fga": 12, "tpm": 1, "tpa": 5, "ftm": 8, "fta": 9, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 9, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 16, '{"minutes": 26, "fgm": 7, "fga": 12, "tpm": 1, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 3, "def_reb": 6, "rebounds": 9, "assists": 1, "steals": 1, "blocks": 4, "turnovers": 1, "fouls": 2, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 2, '{"minutes": 14, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 4, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 3, '{"minutes": 18, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 7, '{"minutes": 16, "fgm": 2, "fga": 3, "tpm": 2, "tpa": 3, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 4, '{"minutes": 22, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Breslin', '5', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Melcher', '12', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'McGuire, Finn', '4', 1, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Griffin', '10', 0, '{"minutes": 2, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'McGuire, Mason', '22', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Tumelty', '3', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 6, '{"minutes": 20, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 20, '{"minutes": 28, "fgm": 9, "fga": 20, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 4, "off_reb": 2, "def_reb": 6, "rebounds": 8, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 0, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 2, '{"minutes": 23, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 4, '{"minutes": 22, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 3, '{"minutes": 24, "fgm": 1, "fga": 6, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 3, '{"minutes": 22, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 3, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 0, '{"minutes": 21, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 12, '{"minutes": 31, "fgm": 4, "fga": 7, "tpm": 0, "tpa": 2, "ftm": 4, "fta": 4, "off_reb": 1, "def_reb": 7, "rebounds": 8, "assists": 2, "steals": 0, "blocks": 2, "turnovers": 3, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 9, '{"minutes": 32, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 7, "fta": 9, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 4, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 11, '{"minutes": 29, "fgm": 3, "fga": 8, "tpm": 2, "tpa": 5, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 0, '{"minutes": 18, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 4, '{"minutes": 20, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 3, '{"minutes": 8, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 6, '{"minutes": 18, "fgm": 2, "fga": 8, "tpm": 0, "tpa": 5, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 4, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-09'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 2, '{"minutes": 31, "fgm": 1, "fga": 9, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 6, "steals": 4, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 9, '{"minutes": 27, "fgm": 3, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 5, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 3, "steals": 1, "blocks": 1, "turnovers": 4, "fouls": 5, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 10, '{"minutes": 28, "fgm": 3, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 3, "fta": 3, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 5, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 8, '{"minutes": 20, "fgm": 4, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 12, '{"minutes": 28, "fgm": 4, "fga": 13, "tpm": 1, "tpa": 8, "ftm": 3, "fta": 5, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 3, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 7, '{"minutes": 20, "fgm": 3, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 2, "turnovers": 0, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 2, '{"minutes": 4, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Lewis', '34', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 7, '{"minutes": 18, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 6, "off_reb": 0, "def_reb": 8, "rebounds": 8, "assists": 3, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 12, '{"minutes": 31, "fgm": 2, "fga": 9, "tpm": 1, "tpa": 4, "ftm": 7, "fta": 8, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 7, "steals": 1, "blocks": 0, "turnovers": 5, "fouls": 1, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 12, '{"minutes": 28, "fgm": 5, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 3, "off_reb": 2, "def_reb": 9, "rebounds": 11, "assists": 0, "steals": 0, "blocks": 4, "turnovers": 2, "fouls": 0, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 9, '{"minutes": 20, "fgm": 4, "fga": 8, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 3, '{"minutes": 25, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 4, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 0, '{"minutes": 6, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 4, '{"minutes": 10, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 2, '{"minutes": 9, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 5, '{"minutes": 12, "fgm": 2, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Walsh', '12', 2, '{"minutes": 1, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-05'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 10, '{"minutes": 31, "fgm": 4, "fga": 9, "tpm": 2, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 7, "steals": 4, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 20, '{"minutes": 32, "fgm": 6, "fga": 17, "tpm": 0, "tpa": 3, "ftm": 8, "fta": 12, "off_reb": 4, "def_reb": 4, "rebounds": 8, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 8, "fouls": 2, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 3, '{"minutes": 16, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 21, '{"minutes": 30, "fgm": 8, "fga": 11, "tpm": 1, "tpa": 2, "ftm": 4, "fta": 4, "off_reb": 4, "def_reb": 4, "rebounds": 8, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 7, '{"minutes": 29, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 5, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 3, '{"minutes": 18, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Lewis', '34', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 22, '{"minutes": 29, "fgm": 7, "fga": 12, "tpm": 0, "tpa": 2, "ftm": 8, "fta": 10, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 1, "steals": 1, "blocks": 3, "turnovers": 1, "fouls": 3, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 2, '{"minutes": 15, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 6, '{"minutes": 27, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 2, "blocks": 2, "turnovers": 1, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Scott', '3', 18, '{"minutes": 31, "fgm": 5, "fga": 10, "tpm": 1, "tpa": 3, "ftm": 7, "fta": 7, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 13, '{"minutes": 27, "fgm": 3, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 6, "fta": 8, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz', '11', 5, '{"minutes": 20, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 2, '{"minutes": 8, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Gordon', '15', 3, '{"minutes": 3, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 2, '{"minutes": 17, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 13, '{"minutes": 31, "fgm": 4, "fga": 10, "tpm": 4, "tpa": 8, "ftm": 1, "fta": 3, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 6, "steals": 5, "blocks": 0, "turnovers": 5, "fouls": 4, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 15, '{"minutes": 24, "fgm": 6, "fga": 10, "tpm": 3, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 2, "blocks": 1, "turnovers": 0, "fouls": 3, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 4, '{"minutes": 10, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 5, '{"minutes": 23, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 6, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 9, '{"minutes": 27, "fgm": 4, "fga": 12, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 4, "def_reb": 1, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 5, '{"minutes": 17, "fgm": 1, "fga": 7, "tpm": 1, "tpa": 6, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 3, '{"minutes": 11, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Corrao', '22', 11, '{"minutes": 31, "fgm": 4, "fga": 8, "tpm": 2, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 8, "rebounds": 8, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 4, "fouls": 3, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Ralls', '55', 10, '{"minutes": 32, "fgm": 3, "fga": 9, "tpm": 1, "tpa": 4, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 5, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 1, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Williams', '5', 13, '{"minutes": 32, "fgm": 5, "fga": 12, "tpm": 3, "tpa": 7, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 8, "steals": 3, "blocks": 0, "turnovers": 6, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lambert', '10', 2, '{"minutes": 26, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Lugendo', '33', 24, '{"minutes": 27, "fgm": 9, "fga": 11, "tpm": 0, "tpa": 0, "ftm": 6, "fta": 7, "off_reb": 4, "def_reb": 7, "rebounds": 11, "assists": 0, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 4, "points": 24}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'White', '4', 0, '{"minutes": 5, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 145, 'basketball', 'Richardson', '0', 5, '{"minutes": 7, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (145 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 15, '{"minutes": 32, "fgm": 6, "fga": 15, "tpm": 3, "tpa": 8, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 21, '{"minutes": 29, "fgm": 8, "fga": 14, "tpm": 4, "tpa": 7, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 6, '{"minutes": 31, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 3, "steals": 0, "blocks": 5, "turnovers": 1, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 8, '{"minutes": 12, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 3, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 7, '{"minutes": 27, "fgm": 2, "fga": 7, "tpm": 2, "tpa": 6, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 0, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 7, '{"minutes": 19, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 5, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 0, '{"minutes": 10, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 7, '{"minutes": 27, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 34, '{"minutes": 31, "fgm": 10, "fga": 21, "tpm": 2, "tpa": 5, "ftm": 12, "fta": 13, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 34}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 6, '{"minutes": 31, "fgm": 2, "fga": 8, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 4, '{"minutes": 30, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 19, '{"minutes": 31, "fgm": 9, "fga": 14, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 1, "steals": 0, "blocks": 2, "turnovers": 1, "fouls": 3, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 0, '{"minutes": 4, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 15, '{"minutes": 32, "fgm": 6, "fga": 15, "tpm": 3, "tpa": 8, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 21, '{"minutes": 29, "fgm": 8, "fga": 14, "tpm": 4, "tpa": 7, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 6, '{"minutes": 31, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 3, "steals": 0, "blocks": 5, "turnovers": 1, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 8, '{"minutes": 12, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 3, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 7, '{"minutes": 27, "fgm": 2, "fga": 7, "tpm": 2, "tpa": 6, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 0, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 7, '{"minutes": 19, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 5, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 0, '{"minutes": 10, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 7, '{"minutes": 27, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 34, '{"minutes": 31, "fgm": 10, "fga": 21, "tpm": 2, "tpa": 5, "ftm": 12, "fta": 13, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 34}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 6, '{"minutes": 31, "fgm": 2, "fga": 8, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 4, '{"minutes": 30, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 19, '{"minutes": 31, "fgm": 9, "fga": 14, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 7, "rebounds": 7, "assists": 1, "steals": 0, "blocks": 2, "turnovers": 1, "fouls": 3, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 0, '{"minutes": 4, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 7, '{"minutes": 29, "fgm": 3, "fga": 8, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 11, '{"minutes": 26, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 5, "ftm": 6, "fta": 7, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 6, "steals": 3, "blocks": 0, "turnovers": 5, "fouls": 4, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 13, '{"minutes": 26, "fgm": 3, "fga": 7, "tpm": 1, "tpa": 4, "ftm": 6, "fta": 7, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 13, '{"minutes": 30, "fgm": 4, "fga": 11, "tpm": 3, "tpa": 8, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 2, '{"minutes": 17, "fgm": 0, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 0, "steals": 0, "blocks": 4, "turnovers": 2, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 2, '{"minutes": 18, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 0, '{"minutes": 8, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 2, '{"minutes": 2, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 4, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 23, '{"minutes": 32, "fgm": 7, "fga": 16, "tpm": 0, "tpa": 2, "ftm": 9, "fta": 9, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 3, "steals": 2, "blocks": 1, "turnovers": 3, "fouls": 0, "points": 23}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 13, '{"minutes": 28, "fgm": 5, "fga": 7, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 11, '{"minutes": 32, "fgm": 4, "fga": 11, "tpm": 3, "tpa": 8, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 1, "steals": 4, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 9, '{"minutes": 27, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 5, "fta": 6, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 3, '{"minutes": 22, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 0, "steals": 1, "blocks": 2, "turnovers": 1, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 2, '{"minutes": 11, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 1, '{"minutes": 8, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 7, '{"minutes": 26, "fgm": 3, "fga": 8, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 6, '{"minutes": 30, "fgm": 1, "fga": 6, "tpm": 1, "tpa": 2, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 2, '{"minutes": 26, "fgm": 1, "fga": 11, "tpm": 0, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 9, '{"minutes": 27, "fgm": 3, "fga": 8, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 4, '{"minutes": 21, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 5, "rebounds": 7, "assists": 3, "steals": 2, "blocks": 3, "turnovers": 2, "fouls": 5, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 8, '{"minutes": 17, "fgm": 3, "fga": 4, "tpm": 2, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 10, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 10, '{"minutes": 30, "fgm": 4, "fga": 11, "tpm": 0, "tpa": 2, "ftm": 2, "fta": 3, "off_reb": 6, "def_reb": 7, "rebounds": 13, "assists": 3, "steals": 5, "blocks": 1, "turnovers": 5, "fouls": 1, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 8, '{"minutes": 31, "fgm": 3, "fga": 10, "tpm": 1, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 2, '{"minutes": 18, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 5, '{"minutes": 28, "fgm": 2, "fga": 3, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 9, '{"minutes": 28, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 2, '{"minutes": 13, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 4, '{"minutes": 7, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 0, '{"minutes": 4, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'McCabe', '1', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 13, '{"minutes": 29, "fgm": 5, "fga": 13, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 3, "steals": 1, "blocks": 3, "turnovers": 1, "fouls": 5, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 3, '{"minutes": 26, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 5, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 13, '{"minutes": 32, "fgm": 5, "fga": 6, "tpm": 1, "tpa": 1, "ftm": 2, "fta": 4, "off_reb": 6, "def_reb": 2, "rebounds": 8, "assists": 3, "steals": 1, "blocks": 3, "turnovers": 4, "fouls": 4, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 0, '{"minutes": 21, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz', '11', 5, '{"minutes": 24, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 6, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 10, '{"minutes": 26, "fgm": 4, "fga": 11, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 5, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 5, "steals": 1, "blocks": 2, "turnovers": 5, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 28, '{"minutes": 30, "fgm": 11, "fga": 14, "tpm": 2, "tpa": 4, "ftm": 4, "fta": 7, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 4, "blocks": 3, "turnovers": 4, "fouls": 1, "points": 28}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 12, '{"minutes": 23, "fgm": 4, "fga": 7, "tpm": 1, "tpa": 2, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 3, '{"minutes": 17, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 1, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 1, '{"minutes": 29, "fgm": 0, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 12, '{"minutes": 28, "fgm": 4, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 6, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Ruffin', '0', 4, '{"minutes": 20, "fgm": 2, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 0, '{"minutes": 13, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 18, '{"minutes": 31, "fgm": 6, "fga": 10, "tpm": 4, "tpa": 7, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 4, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fairlamb', '13', 17, '{"minutes": 32, "fgm": 7, "fga": 10, "tpm": 2, "tpa": 2, "ftm": 1, "fta": 3, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 8, '{"minutes": 21, "fgm": 4, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 1, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 4, "fouls": 5, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 0, '{"minutes": 14, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 4, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 5, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 12, '{"minutes": 30, "fgm": 4, "fga": 7, "tpm": 2, "tpa": 3, "ftm": 2, "fta": 4, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 4, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Allen-Bates', '4', 0, '{"minutes": 4, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Tesafaye', '20', 2, '{"minutes": 11, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Kaune', '34', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Garrett', '11', 2, '{"minutes": 14, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 18, '{"minutes": 28, "fgm": 5, "fga": 10, "tpm": 3, "tpa": 6, "ftm": 5, "fta": 6, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 4, '{"minutes": 20, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 3, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 0, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 8, '{"minutes": 32, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 3, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 9, '{"minutes": 28, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 5, "fta": 7, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 7, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 0, '{"minutes": 10, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 15, '{"minutes": 26, "fgm": 3, "fga": 11, "tpm": 0, "tpa": 5, "ftm": 9, "fta": 9, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 9, '{"minutes": 7, "fgm": 3, "fga": 5, "tpm": 3, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McNeil', '4', 0, '{"minutes": 9, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 12, '{"minutes": 28, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 1, "ftm": 8, "fta": 10, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 5, '{"minutes": 28, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 7, '{"minutes": 19, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 3, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 7, '{"minutes": 24, "fgm": 2, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 5, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 6, '{"minutes": 26, "fgm": 2, "fga": 3, "tpm": 2, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Garrett', '11', 0, '{"minutes": 13, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Tesfaye', '20', 4, '{"minutes": 15, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Kaune', '34', 7, '{"minutes": 4, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Allen-Bates', '4', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 22, '{"minutes": 30, "fgm": 4, "fga": 11, "tpm": 1, "tpa": 3, "ftm": 13, "fta": 16, "off_reb": 1, "def_reb": 10, "rebounds": 11, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 14, '{"minutes": 30, "fgm": 4, "fga": 11, "tpm": 1, "tpa": 6, "ftm": 5, "fta": 6, "off_reb": 4, "def_reb": 3, "rebounds": 7, "assists": 8, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 13, '{"minutes": 31, "fgm": 5, "fga": 11, "tpm": 3, "tpa": 8, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 8, '{"minutes": 30, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 3, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 3, '{"minutes": 17, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 4, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 2, "turnovers": 1, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 4, '{"minutes": 17, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Davis-Winn', '55', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Quackenbush', '21', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jordan', '23', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'D’Ambrosio', '22', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 29, '{"minutes": 37, "fgm": 5, "fga": 10, "tpm": 2, "tpa": 5, "ftm": 17, "fta": 20, "off_reb": 3, "def_reb": 6, "rebounds": 9, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 4, "fouls": 5, "points": 29}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fairlamb', '13', 3, '{"minutes": 34, "fgm": 1, "fga": 12, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 5, "fouls": 5, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 6, '{"minutes": 9, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 1, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 5, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 12, '{"minutes": 26, "fgm": 5, "fga": 11, "tpm": 1, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 3, "def_reb": 0, "rebounds": 3, "assists": 3, "steals": 4, "blocks": 1, "turnovers": 4, "fouls": 5, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 8, '{"minutes": 31, "fgm": 2, "fga": 4, "tpm": 2, "tpa": 4, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 15, '{"minutes": 31, "fgm": 5, "fga": 7, "tpm": 1, "tpa": 1, "ftm": 4, "fta": 8, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 5, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Allen-Bates', '4', 2, '{"minutes": 14, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 6, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Tesfaye', '20', 1, '{"minutes": 4, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 0, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Garrett', '11', 5, '{"minutes": 13, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Kaune', '34', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 13, '{"minutes": 38, "fgm": 3, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 6, "fta": 7, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 8, "steals": 6, "blocks": 0, "turnovers": 6, "fouls": 5, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 17, '{"minutes": 18, "fgm": 6, "fga": 8, "tpm": 4, "tpa": 4, "ftm": 1, "fta": 3, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 5, "fouls": 5, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 13, '{"minutes": 30, "fgm": 4, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 4, "fta": 6, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 18, '{"minutes": 35, "fgm": 7, "fga": 10, "tpm": 1, "tpa": 3, "ftm": 3, "fta": 6, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 6, '{"minutes": 39, "fgm": 2, "fga": 8, "tpm": 2, "tpa": 8, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 5, '{"minutes": 23, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 3, "ftm": 5, "fta": 6, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 0, '{"minutes": 14, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 5, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Graham', '30', 0, '{"minutes": 1, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Gabriel', '14', 0, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-23'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 15, '{"minutes": 30, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 4, "ftm": 9, "fta": 11, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fairlamb', '13', 9, '{"minutes": 32, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 2, "ftm": 4, "fta": 4, "off_reb": 0, "def_reb": 9, "rebounds": 9, "assists": 4, "steals": 1, "blocks": 4, "turnovers": 3, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 8, '{"minutes": 32, "fgm": 3, "fga": 6, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 3, "off_reb": 3, "def_reb": 6, "rebounds": 9, "assists": 0, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 4, '{"minutes": 27, "fgm": 1, "fga": 8, "tpm": 0, "tpa": 2, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 5, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 6, '{"minutes": 26, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 2, "turnovers": 1, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Kaune', '34', 0, '{"minutes": 4, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Garrett', '11', 3, '{"minutes": 7, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 0, '{"minutes": 2, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 4, '{"minutes": 26, "fgm": 2, "fga": 11, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 11, '{"minutes": 32, "fgm": 5, "fga": 11, "tpm": 0, "tpa": 3, "ftm": 1, "fta": 3, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 14, '{"minutes": 21, "fgm": 4, "fga": 8, "tpm": 4, "tpa": 7, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 3, "blocks": 1, "turnovers": 1, "fouls": 4, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 2, '{"minutes": 22, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 4, '{"minutes": 24, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 5, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 0, '{"minutes": 20, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 3, '{"minutes": 7, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 5, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 19, '{"minutes": 31, "fgm": 7, "fga": 14, "tpm": 3, "tpa": 8, "ftm": 2, "fta": 3, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 4, "steals": 5, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fairlamb', '13', 13, '{"minutes": 31, "fgm": 6, "fga": 14, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 1, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 4, '{"minutes": 23, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 5, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 12, '{"minutes": 28, "fgm": 6, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 6, "steals": 1, "blocks": 2, "turnovers": 3, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 14, '{"minutes": 27, "fgm": 5, "fga": 9, "tpm": 3, "tpa": 5, "ftm": 1, "fta": 3, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 3, "steals": 3, "blocks": 1, "turnovers": 3, "fouls": 4, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 7, '{"minutes": 19, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 5, "rebounds": 7, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Allen-Bates', '4', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 31, '{"minutes": 31, "fgm": 11, "fga": 16, "tpm": 3, "tpa": 5, "ftm": 6, "fta": 6, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 3, "blocks": 3, "turnovers": 6, "fouls": 2, "points": 31}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 8, '{"minutes": 29, "fgm": 2, "fga": 8, "tpm": 0, "tpa": 2, "ftm": 4, "fta": 4, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 6, '{"minutes": 20, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 4, "def_reb": 6, "rebounds": 10, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 3, '{"minutes": 28, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 4, "steals": 3, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 8, '{"minutes": 21, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 4, "fta": 5, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 17, '{"minutes": 23, "fgm": 6, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 5, "fta": 7, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 4, "steals": 2, "blocks": 2, "turnovers": 5, "fouls": 2, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Scipio', '4', 2, '{"minutes": 8, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-06'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 16, '{"minutes": 31, "fgm": 4, "fga": 7, "tpm": 2, "tpa": 3, "ftm": 6, "fta": 7, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 4, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 8, '{"minutes": 20, "fgm": 2, "fga": 5, "tpm": 2, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 17, '{"minutes": 30, "fgm": 6, "fga": 13, "tpm": 1, "tpa": 4, "ftm": 4, "fta": 6, "off_reb": 2, "def_reb": 6, "rebounds": 8, "assists": 4, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 11, '{"minutes": 31, "fgm": 3, "fga": 7, "tpm": 2, "tpa": 6, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 8, "rebounds": 10, "assists": 9, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 12, '{"minutes": 15, "fgm": 6, "fga": 8, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 1, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 2, "blocks": 2, "turnovers": 1, "fouls": 4, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 5, '{"minutes": 12, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 3, '{"minutes": 9, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 2, '{"minutes": 11, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 18, '{"minutes": 25, "fgm": 4, "fga": 15, "tpm": 1, "tpa": 3, "ftm": 9, "fta": 10, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 4, "fouls": 4, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 27, '{"minutes": 28, "fgm": 9, "fga": 14, "tpm": 3, "tpa": 6, "ftm": 6, "fta": 7, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 1, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 27}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 5, '{"minutes": 32, "fgm": 2, "fga": 8, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 1, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 2, '{"minutes": 31, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 6, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 0, '{"minutes": 14, "fgm": 0, "fga": 6, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Thompson', '20', 9, '{"minutes": 18, "fgm": 3, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 4, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 5, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 3, '{"minutes": 11, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 2, "turnovers": 1, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Mariani', '10', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-04'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 17, '{"minutes": 31, "fgm": 5, "fga": 15, "tpm": 0, "tpa": 5, "ftm": 7, "fta": 7, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 15, '{"minutes": 26, "fgm": 6, "fga": 14, "tpm": 3, "tpa": 9, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 14, '{"minutes": 26, "fgm": 5, "fga": 8, "tpm": 2, "tpa": 2, "ftm": 2, "fta": 4, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 5, '{"minutes": 29, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 2, "rebounds": 5, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 0, '{"minutes": 13, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 3, '{"minutes": 15, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 0, '{"minutes": 4, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 4, '{"minutes": 10, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 2, "turnovers": 0, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 0, '{"minutes": 5, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Hamidu', '10', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 15, '{"minutes": 32, "fgm": 5, "fga": 12, "tpm": 3, "tpa": 5, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 5, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 16, '{"minutes": 30, "fgm": 5, "fga": 9, "tpm": 0, "tpa": 1, "ftm": 6, "fta": 8, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 6, '{"minutes": 29, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 1, "off_reb": 1, "def_reb": 8, "rebounds": 9, "assists": 0, "steals": 0, "blocks": 2, "turnovers": 6, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 12, '{"minutes": 28, "fgm": 5, "fga": 9, "tpm": 1, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 5, "steals": 0, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 9, '{"minutes": 24, "fgm": 3, "fga": 6, "tpm": 3, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 0, '{"minutes": 9, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 5, '{"minutes": 8, "fgm": 2, "fga": 3, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 19, '{"minutes": 26, "fgm": 6, "fga": 8, "tpm": 3, "tpa": 4, "ftm": 4, "fta": 4, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 14, '{"minutes": 17, "fgm": 6, "fga": 13, "tpm": 2, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 21, '{"minutes": 24, "fgm": 8, "fga": 10, "tpm": 3, "tpa": 5, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 2, "blocks": 2, "turnovers": 1, "fouls": 0, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 19, '{"minutes": 24, "fgm": 8, "fga": 9, "tpm": 3, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 7, "steals": 2, "blocks": 1, "turnovers": 1, "fouls": 0, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 9, '{"minutes": 26, "fgm": 4, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 1, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 11, "steals": 0, "blocks": 1, "turnovers": 3, "fouls": 0, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 10, '{"minutes": 11, "fgm": 4, "fga": 5, "tpm": 2, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Chase', '15', 0, '{"minutes": 10, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Hamidu', '10', 2, '{"minutes": 13, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 3, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Lilly', '23', 3, '{"minutes": 3, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Evans', '12', 0, '{"minutes": 3, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Stanley', '13', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 5, '{"minutes": 22, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 23, '{"minutes": 26, "fgm": 10, "fga": 19, "tpm": 3, "tpa": 4, "ftm": 0, "fta": 3, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 23}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 5, '{"minutes": 22, "fgm": 2, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 14, '{"minutes": 20, "fgm": 6, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 4, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 3, '{"minutes": 19, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 6, '{"minutes": 14, "fgm": 2, "fga": 5, "tpm": 2, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 3, '{"minutes": 8, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Graham', '30', 3, '{"minutes": 7, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Gabriel', '14', 0, '{"minutes": 3, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Seda', '21', 4, '{"minutes": 5, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 2, '{"minutes": 6, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Lewis', '34', 0, '{"minutes": 5, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Kurlyk', '22', 3, '{"minutes": 3, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 18, '{"minutes": 17, "fgm": 7, "fga": 11, "tpm": 3, "tpa": 5, "ftm": 1, "fta": 1, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 3, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 16, '{"minutes": 18, "fgm": 5, "fga": 12, "tpm": 5, "tpa": 11, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 6, '{"minutes": 18, "fgm": 3, "fga": 7, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 3, "steals": 0, "blocks": 2, "turnovers": 0, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 6, '{"minutes": 18, "fgm": 2, "fga": 4, "tpm": 2, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 6, '{"minutes": 12, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 5, "rebounds": 8, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 4, '{"minutes": 14, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 6, '{"minutes": 12, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 4, '{"minutes": 14, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 2, '{"minutes": 12, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Lilly', '23', 3, '{"minutes": 8, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Chase', '15', 0, '{"minutes": 8, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Evans', '12', 0, '{"minutes": 6, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Stanley', '13', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 6, '{"minutes": 24, "fgm": 2, "fga": 10, "tpm": 1, "tpa": 5, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 6, "rebounds": 7, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 0, '{"minutes": 23, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 0, '{"minutes": 23, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 12, '{"minutes": 24, "fgm": 5, "fga": 15, "tpm": 2, "tpa": 6, "ftm": 0, "fta": 1, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 4, '{"minutes": 14, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 0, '{"minutes": 13, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 12, '{"minutes": 20, "fgm": 4, "fga": 10, "tpm": 4, "tpa": 9, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 10, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, Dylan', '0', 2, '{"minutes": 3, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Thompson', '25', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Borelli', '12', 0, '{"minutes": 3, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 23, '{"minutes": 19, "fgm": 8, "fga": 12, "tpm": 7, "tpa": 10, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 23}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 9, '{"minutes": 16, "fgm": 3, "fga": 8, "tpm": 1, "tpa": 4, "ftm": 2, "fta": 4, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 9, '{"minutes": 17, "fgm": 4, "fga": 6, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 6, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 5, '{"minutes": 18, "fgm": 2, "fga": 3, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 5, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 5, '{"minutes": 16, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 6, "off_reb": 3, "def_reb": 2, "rebounds": 5, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 9, '{"minutes": 13, "fgm": 2, "fga": 2, "tpm": 1, "tpa": 1, "ftm": 4, "fta": 4, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 5, '{"minutes": 13, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 2, '{"minutes": 15, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 2, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 4, '{"minutes": 10, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Hamidu', '10', 2, '{"minutes": 8, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Evans', '12', 3, '{"minutes": 3, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Lilly', '23', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Chase', '15', 2, '{"minutes": 3, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Stanley', '13', 2, '{"minutes": 3, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 0, '{"minutes": 14, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fairlamb', '13', 0, '{"minutes": 18, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 2, '{"minutes": 17, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 7, '{"minutes": 19, "fgm": 3, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 5, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 6, '{"minutes": 12, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Kaune', '34', 7, '{"minutes": 14, "fgm": 2, "fga": 4, "tpm": 2, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Garrett', '11', 3, '{"minutes": 20, "fgm": 1, "fga": 5, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 4, '{"minutes": 15, "fgm": 1, "fga": 5, "tpm": 1, "tpa": 5, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Allen-Bates', '4', 6, '{"minutes": 12, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 5, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Tesfaye', '20', 0, '{"minutes": 14, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'McGuinn', '14', 4, '{"minutes": 5, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 0, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-12'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 19, '{"minutes": 28, "fgm": 7, "fga": 15, "tpm": 4, "tpa": 8, "ftm": 1, "fta": 1, "off_reb": 4, "def_reb": 3, "rebounds": 7, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 2, '{"minutes": 28, "fgm": 0, "fga": 6, "tpm": 0, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 9, '{"minutes": 29, "fgm": 4, "fga": 9, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 7, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 21, '{"minutes": 31, "fgm": 6, "fga": 7, "tpm": 5, "tpa": 5, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 6, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 16, '{"minutes": 26, "fgm": 6, "fga": 10, "tpm": 2, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 0, "steals": 2, "blocks": 2, "turnovers": 0, "fouls": 0, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 2, '{"minutes": 11, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Smith', '1', 0, '{"minutes": 6, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 20, '{"minutes": 29, "fgm": 9, "fga": 16, "tpm": 2, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 7, "rebounds": 8, "assists": 5, "steals": 0, "blocks": 3, "turnovers": 1, "fouls": 2, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 11, '{"minutes": 31, "fgm": 5, "fga": 9, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 9, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 11, '{"minutes": 28, "fgm": 5, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 4, "def_reb": 4, "rebounds": 8, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 9, '{"minutes": 24, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 5, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 11, '{"minutes": 24, "fgm": 5, "fga": 9, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Ruffin', '0', 4, '{"minutes": 13, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 2, '{"minutes": 11, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-16'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 18, '{"minutes": 25, "fgm": 7, "fga": 17, "tpm": 1, "tpa": 5, "ftm": 3, "fta": 8, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 4, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 5, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 10, '{"minutes": 31, "fgm": 3, "fga": 7, "tpm": 2, "tpa": 4, "ftm": 2, "fta": 4, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 8, '{"minutes": 16, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 0, '{"minutes": 30, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 0, '{"minutes": 23, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 8, '{"minutes": 12, "fgm": 4, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 3, "fouls": 4, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 2, '{"minutes": 8, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 3, '{"minutes": 12, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'McCabe', '1', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Francis', '1', 25, '{"minutes": 32, "fgm": 9, "fga": 11, "tpm": 2, "tpa": 3, "ftm": 5, "fta": 8, "off_reb": 0, "def_reb": 9, "rebounds": 9, "assists": 3, "steals": 1, "blocks": 2, "turnovers": 3, "fouls": 1, "points": 25}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Jackson', '2', 15, '{"minutes": 32, "fgm": 5, "fga": 12, "tpm": 2, "tpa": 4, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 2, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Carroll', '4', 4, '{"minutes": 17, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 1, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Holden', '3', 12, '{"minutes": 31, "fgm": 4, "fga": 7, "tpm": 1, "tpa": 3, "ftm": 3, "fta": 7, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Scott', '5', 2, '{"minutes": 16, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 3, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 5, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Price', '24', 0, '{"minutes": 13, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Warner', '0', 3, '{"minutes": 15, "fgm": 1, "fga": 3, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 177, 'basketball', 'Banner', '10', 0, '{"minutes": 4, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (177 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 9, '{"minutes": 27, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 7, "fta": 10, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 5, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 16, '{"minutes": 32, "fgm": 5, "fga": 12, "tpm": 3, "tpa": 5, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 7, "steals": 5, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 0, '{"minutes": 7, "fgm": 0, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 13, '{"minutes": 29, "fgm": 4, "fga": 6, "tpm": 2, "tpa": 3, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 9, '{"minutes": 29, "fgm": 4, "fga": 9, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 5, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 2, '{"minutes": 18, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 5, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 5, '{"minutes": 16, "fgm": 1, "fga": 7, "tpm": 0, "tpa": 2, "ftm": 3, "fta": 6, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 0, '{"minutes": 16, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 5, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 0, '{"minutes": 4, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Walsh', '12', 3, '{"minutes": 1, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'McCabe', '1', 2, '{"minutes": 1, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 12, '{"minutes": 34, "fgm": 3, "fga": 10, "tpm": 2, "tpa": 7, "ftm": 4, "fta": 6, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 3, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 22, '{"minutes": 31, "fgm": 7, "fga": 11, "tpm": 5, "tpa": 8, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 4, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 0, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 14, '{"minutes": 27, "fgm": 4, "fga": 6, "tpm": 0, "tpa": 2, "ftm": 6, "fta": 13, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 2, '{"minutes": 30, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 4, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 6, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 12, '{"minutes": 24, "fgm": 4, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 4, "fta": 10, "off_reb": 3, "def_reb": 9, "rebounds": 12, "assists": 1, "steals": 1, "blocks": 4, "turnovers": 0, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 3, '{"minutes": 15, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 0, '{"minutes": 4, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 3, '{"minutes": 13, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 3, "def_reb": 3, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 9, '{"minutes": 26, "fgm": 4, "fga": 12, "tpm": 0, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 2, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 11, '{"minutes": 29, "fgm": 4, "fga": 8, "tpm": 1, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 7, "rebounds": 8, "assists": 5, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 3, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 4, '{"minutes": 18, "fgm": 2, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 0, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 2, "turnovers": 3, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 6, '{"minutes": 21, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 9, '{"minutes": 25, "fgm": 4, "fga": 10, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 1, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 0, '{"minutes": 14, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 2, "blocks": 2, "turnovers": 2, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carr', '5', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 6, '{"minutes": 14, "fgm": 2, "fga": 4, "tpm": 2, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 2, '{"minutes": 9, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'McCabe', '1', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 21, '{"minutes": 32, "fgm": 8, "fga": 13, "tpm": 1, "tpa": 3, "ftm": 4, "fta": 8, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 4, "steals": 0, "blocks": 5, "turnovers": 0, "fouls": 2, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 0, '{"minutes": 10, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 14, '{"minutes": 32, "fgm": 7, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 6, "def_reb": 3, "rebounds": 9, "assists": 4, "steals": 5, "blocks": 1, "turnovers": 0, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 11, '{"minutes": 32, "fgm": 4, "fga": 10, "tpm": 3, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 4, "steals": 5, "blocks": 2, "turnovers": 2, "fouls": 1, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz', '11', 13, '{"minutes": 31, "fgm": 4, "fga": 14, "tpm": 3, "tpa": 6, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 4, '{"minutes": 23, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 6, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 20, '{"minutes": 22, "fgm": 8, "fga": 13, "tpm": 2, "tpa": 5, "ftm": 2, "fta": 4, "off_reb": 3, "def_reb": 3, "rebounds": 6, "assists": 3, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 0, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 10, '{"minutes": 24, "fgm": 4, "fga": 9, "tpm": 2, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 11, '{"minutes": 24, "fgm": 4, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 3, "fta": 4, "off_reb": 5, "def_reb": 7, "rebounds": 12, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 8, '{"minutes": 26, "fgm": 3, "fga": 8, "tpm": 2, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 4, '{"minutes": 18, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Ruffins', '0', 5, '{"minutes": 23, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 9, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 4, '{"minutes": 13, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Scipio', '4', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Alberto', '15', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Cook', '14', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Medley', '5', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Destephanis', '10', 2, '{"minutes": 2, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Corrao', '2', 5, '{"minutes": 29, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 5, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Ralls', '55', 4, '{"minutes": 28, "fgm": 1, "fga": 10, "tpm": 0, "tpa": 6, "ftm": 2, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Williams', '5', 7, '{"minutes": 30, "fgm": 2, "fga": 10, "tpm": 0, "tpa": 5, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 4, "steals": 3, "blocks": 0, "turnovers": 4, "fouls": 0, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Turner', '3', 10, '{"minutes": 31, "fgm": 4, "fga": 10, "tpm": 0, "tpa": 3, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Lugendo', '13', 10, '{"minutes": 21, "fgm": 3, "fga": 6, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 4, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 0, "steals": 1, "blocks": 2, "turnovers": 0, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'White', '4', 0, '{"minutes": 14, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Lambert', '24', 0, '{"minutes": 7, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-02'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 22, '{"minutes": 32, "fgm": 8, "fga": 16, "tpm": 1, "tpa": 3, "ftm": 5, "fta": 8, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 8, "steals": 0, "blocks": 2, "turnovers": 0, "fouls": 2, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 6, '{"minutes": 27, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 6, "steals": 7, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 4, '{"minutes": 22, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 4, "def_reb": 0, "rebounds": 4, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 6, '{"minutes": 28, "fgm": 2, "fga": 5, "tpm": 2, "tpa": 2, "ftm": 0, "fta": 2, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 22, '{"minutes": 32, "fgm": 8, "fga": 13, "tpm": 3, "tpa": 4, "ftm": 3, "fta": 7, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 22}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 5, '{"minutes": 17, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 5, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Scipio', '4', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'MacAdams', '23', 20, '{"minutes": 31, "fgm": 9, "fga": 16, "tpm": 2, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 5, "points": 20}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Lundy', '2', 18, '{"minutes": 29, "fgm": 6, "fga": 14, "tpm": 0, "tpa": 3, "ftm": 6, "fta": 7, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 1, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Jenkins', '11', 10, '{"minutes": 17, "fgm": 4, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 4, "steals": 2, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Powell', '0', 4, '{"minutes": 23, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 4, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 3, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Donahue', '20', 0, '{"minutes": 28, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Warren', '14', 14, '{"minutes": 15, "fgm": 3, "fga": 4, "tpm": 2, "tpa": 2, "ftm": 6, "fta": 10, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Strong', '1', 4, '{"minutes": 15, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'Breslin', '5', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 144, 'basketball', 'McGuire, Finn', '4', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-14'
  AND (144 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 34, '{"minutes": 30, "fgm": 12, "fga": 20, "tpm": 5, "tpa": 7, "ftm": 5, "fta": 5, "off_reb": 3, "def_reb": 2, "rebounds": 5, "assists": 7, "steals": 5, "blocks": 2, "turnovers": 1, "fouls": 2, "points": 34}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 18, '{"minutes": 26, "fgm": 7, "fga": 12, "tpm": 4, "tpa": 8, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 7, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 7, '{"minutes": 22, "fgm": 3, "fga": 6, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 1, "off_reb": 5, "def_reb": 6, "rebounds": 11, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 4, "fouls": 4, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 8, '{"minutes": 24, "fgm": 3, "fga": 8, "tpm": 2, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 8, "steals": 5, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 19, '{"minutes": 28, "fgm": 9, "fga": 11, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 3, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 19}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Scipio', '4', 5, '{"minutes": 15, "fgm": 2, "fga": 3, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Alberto', '15', 3, '{"minutes": 9, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Ethan', '30', 3, '{"minutes": 2, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Cook', '14', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Medley', '5', 2, '{"minutes": 2, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Tolerson-Irby', '5', 11, '{"minutes": 27, "fgm": 2, "fga": 9, "tpm": 0, "tpa": 1, "ftm": 7, "fta": 7, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 5, "fouls": 2, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Moore', '4', 11, '{"minutes": 22, "fgm": 4, "fga": 9, "tpm": 0, "tpa": 3, "ftm": 3, "fta": 7, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 4, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Dorsey', '1', 8, '{"minutes": 24, "fgm": 3, "fga": 3, "tpm": 2, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Bobb', '13', 9, '{"minutes": 27, "fgm": 3, "fga": 9, "tpm": 1, "tpa": 2, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Zalewski', '3', 15, '{"minutes": 27, "fgm": 5, "fga": 6, "tpm": 5, "tpa": 6, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 4, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 2, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Ross', '2', 9, '{"minutes": 20, "fgm": 3, "fga": 5, "tpm": 2, "tpa": 4, "ftm": 1, "fta": 3, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 3, "steals": 1, "blocks": 0, "turnovers": 4, "fouls": 0, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Velez', '0', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Laster', '15', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Seda', '21', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Graham', '30', 0, '{"minutes": 2, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Lewis', '34', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Gabriel', '14', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2780, 'basketball', 'Kurlyk', '22', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (2780 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 15, '{"minutes": 31, "fgm": 6, "fga": 15, "tpm": 0, "tpa": 7, "ftm": 3, "fta": 3, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 6, "steals": 4, "blocks": 1, "turnovers": 2, "fouls": 0, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 8, '{"minutes": 28, "fgm": 4, "fga": 9, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 8, "steals": 6, "blocks": 0, "turnovers": 2, "fouls": 3, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 7, '{"minutes": 22, "fgm": 3, "fga": 7, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 1, "off_reb": 5, "def_reb": 1, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 5, '{"minutes": 20, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 11, '{"minutes": 24, "fgm": 5, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wannamaker', '11', 9, '{"minutes": 20, "fgm": 3, "fga": 8, "tpm": 1, "tpa": 4, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Scipio', '4', 4, '{"minutes": 10, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Medley', '5', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Alberto', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Destephanis', '10', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Cook', '14', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Ethan', '30', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 8, '{"minutes": 28, "fgm": 4, "fga": 9, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 4, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 8, '{"minutes": 25, "fgm": 3, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 5, "steals": 1, "blocks": 0, "turnovers": 6, "fouls": 1, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 7, '{"minutes": 19, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 8, '{"minutes": 28, "fgm": 3, "fga": 9, "tpm": 0, "tpa": 5, "ftm": 2, "fta": 2, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 1, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 2, '{"minutes": 19, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 3, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 5, '{"minutes": 17, "fgm": 2, "fga": 8, "tpm": 1, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 6, '{"minutes": 14, "fgm": 2, "fga": 3, "tpm": 2, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 2, '{"minutes": 5, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, Dylan', '0', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Thompson', '25', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Borelli', '12', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-24'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 21, '{"minutes": 31, "fgm": 6, "fga": 9, "tpm": 2, "tpa": 4, "ftm": 7, "fta": 8, "off_reb": 0, "def_reb": 5, "rebounds": 5, "assists": 5, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 2, "points": 21}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 8, '{"minutes": 30, "fgm": 3, "fga": 8, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 4, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 5, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 8}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 3, '{"minutes": 16, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 4, "def_reb": 1, "rebounds": 5, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 11, '{"minutes": 28, "fgm": 5, "fga": 10, "tpm": 1, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 0, '{"minutes": 25, "fgm": 0, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 3, "def_reb": 3, "rebounds": 6, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 10, '{"minutes": 23, "fgm": 3, "fga": 3, "tpm": 1, "tpa": 1, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 0, "steals": 2, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Scipio', '4', 0, '{"minutes": 4, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Destephanis', '10', 3, '{"minutes": 2, "fgm": 1, "fga": 1, "tpm": 1, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'McNicholas', '20', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Okebata', '4', 16, '{"minutes": 28, "fgm": 7, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 3, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 5, "fouls": 2, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Branson', '3', 12, '{"minutes": 32, "fgm": 4, "fga": 9, "tpm": 0, "tpa": 2, "ftm": 4, "fta": 5, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 7, "steals": 1, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Damon', '10', 0, '{"minutes": 9, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Flaherty', '0', 6, '{"minutes": 28, "fgm": 3, "fga": 7, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Neri', '23', 4, '{"minutes": 30, "fgm": 2, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 3, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Alston', '50', 10, '{"minutes": 23, "fgm": 5, "fga": 8, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 3, "off_reb": 2, "def_reb": 1, "rebounds": 3, "assists": 0, "steals": 1, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Reing', '20', 2, '{"minutes": 8, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 2882, 'basketball', 'Carroll', '33', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (2882 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 31, '{"minutes": 36, "fgm": 14, "fga": 22, "tpm": 0, "tpa": 2, "ftm": 3, "fta": 6, "off_reb": 4, "def_reb": 1, "rebounds": 5, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 4, "fouls": 2, "points": 31}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 5, '{"minutes": 30, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 3, "def_reb": 6, "rebounds": 9, "assists": 3, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 4, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 9, '{"minutes": 32, "fgm": 3, "fga": 7, "tpm": 2, "tpa": 5, "ftm": 1, "fta": 2, "off_reb": 2, "def_reb": 5, "rebounds": 7, "assists": 1, "steals": 3, "blocks": 3, "turnovers": 4, "fouls": 4, "points": 9}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Scott', '3', 15, '{"minutes": 33, "fgm": 5, "fga": 10, "tpm": 2, "tpa": 6, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 15}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz', '11', 5, '{"minutes": 24, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 2, "ftm": 2, "fta": 2, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 0, '{"minutes": 18, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 5, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 0, '{"minutes": 6, "fgm": 0, "fga": 2, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 0, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hughes', '15', 27, '{"minutes": 35, "fgm": 8, "fga": 18, "tpm": 3, "tpa": 6, "ftm": 8, "fta": 9, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 1, "steals": 2, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 27}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gaye', '5', 10, '{"minutes": 29, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 6, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 2, "steals": 5, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Gore', '0', 11, '{"minutes": 36, "fgm": 5, "fga": 11, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 1, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Johnson', '1', 2, '{"minutes": 34, "fgm": 1, "fga": 8, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 4, "steals": 0, "blocks": 1, "turnovers": 4, "fouls": 3, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Kpan', '23', 6, '{"minutes": 24, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 2, "off_reb": 4, "def_reb": 3, "rebounds": 7, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Brown', '3', 5, '{"minutes": 15, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'McMullin', '13', 0, '{"minutes": 7, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-19'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 17, '{"minutes": 29, "fgm": 8, "fga": 13, "tpm": 0, "tpa": 1, "ftm": 1, "fta": 3, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 0, "steals": 0, "blocks": 3, "turnovers": 4, "fouls": 3, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 16, '{"minutes": 27, "fgm": 8, "fga": 10, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 5, "def_reb": 11, "rebounds": 16, "assists": 3, "steals": 2, "blocks": 1, "turnovers": 0, "fouls": 4, "points": 16}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 0, '{"minutes": 25, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Scott', '3', 4, '{"minutes": 29, "fgm": 1, "fga": 7, "tpm": 0, "tpa": 3, "ftm": 2, "fta": 4, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 12, '{"minutes": 29, "fgm": 4, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 4, "fta": 4, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 11, '{"minutes": 16, "fgm": 3, "fga": 6, "tpm": 2, "tpa": 5, "ftm": 3, "fta": 4, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wright', '21', 0, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Gordon', '15', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Smith', '12', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Jones, DJ', '5', 10, '{"minutes": 30, "fgm": 4, "fga": 12, "tpm": 0, "tpa": 2, "ftm": 2, "fta": 5, "off_reb": 6, "def_reb": 3, "rebounds": 9, "assists": 0, "steals": 0, "blocks": 3, "turnovers": 1, "fouls": 1, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Quinn', '11', 5, '{"minutes": 29, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 6, "steals": 0, "blocks": 1, "turnovers": 2, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Skehan', '3', 2, '{"minutes": 16, "fgm": 1, "fga": 5, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hargrove', '1', 17, '{"minutes": 30, "fgm": 6, "fga": 15, "tpm": 3, "tpa": 6, "ftm": 2, "fta": 2, "off_reb": 2, "def_reb": 3, "rebounds": 5, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 17}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Hartman', '10', 4, '{"minutes": 19, "fgm": 2, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baskerville', '33', 3, '{"minutes": 18, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Baker', '13', 0, '{"minutes": 11, "fgm": 0, "fga": 4, "tpm": 0, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Smith', '4', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 175, 'basketball', 'Bronzell', '2', 2, '{"minutes": 5, "fgm": 1, "fga": 4, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-29'
  AND (175 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 6, '{"minutes": 26, "fgm": 2, "fga": 5, "tpm": 0, "tpa": 1, "ftm": 2, "fta": 4, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 5, "steals": 1, "blocks": 0, "turnovers": 5, "fouls": 0, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 14, '{"minutes": 31, "fgm": 6, "fga": 9, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 7, "off_reb": 5, "def_reb": 3, "rebounds": 8, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 6, '{"minutes": 26, "fgm": 2, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 1, "fta": 1, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 5, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 2, '{"minutes": 7, "fgm": 1, "fga": 2, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 6, '{"minutes": 27, "fgm": 2, "fga": 5, "tpm": 1, "tpa": 3, "ftm": 1, "fta": 3, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 2, "steals": 0, "blocks": 1, "turnovers": 4, "fouls": 4, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 5, '{"minutes": 22, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 3, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 0, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz-Muhammad', '11', 5, '{"minutes": 21, "fgm": 2, "fga": 6, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 3, "fouls": 4, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Craft', '10', 11, '{"minutes": 31, "fgm": 3, "fga": 11, "tpm": 0, "tpa": 3, "ftm": 5, "fta": 6, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 3, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fairlamb', '13', 10, '{"minutes": 29, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 4, "fta": 6, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 3, "steals": 1, "blocks": 1, "turnovers": 3, "fouls": 3, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Fisher', '33', 6, '{"minutes": 22, "fgm": 3, "fga": 4, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 4, "rebounds": 4, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 5, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Raymond', '5', 7, '{"minutes": 26, "fgm": 3, "fga": 6, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 4, "fouls": 5, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Johnson, Dillon', '3', 10, '{"minutes": 20, "fgm": 3, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 4, "fta": 4, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 0, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Doogan', '21', 7, '{"minutes": 26, "fgm": 3, "fga": 5, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 2, "off_reb": 1, "def_reb": 3, "rebounds": 4, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Allen-Bates', '4', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 254, 'basketball', 'Kaune', '34', 2, '{"minutes": 4, "fgm": 1, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 1, "points": 2}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-02'
  AND (254 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 1, '{"minutes": 23, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 4, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 2, "blocks": 1, "turnovers": 1, "fouls": 5, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 18, '{"minutes": 31, "fgm": 9, "fga": 13, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 5, "def_reb": 4, "rebounds": 9, "assists": 3, "steals": 2, "blocks": 3, "turnovers": 1, "fouls": 3, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 6, '{"minutes": 26, "fgm": 1, "fga": 5, "tpm": 1, "tpa": 4, "ftm": 3, "fta": 5, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 5, "points": 6}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz-Muhammad', '11', 11, '{"minutes": 24, "fgm": 4, "fga": 14, "tpm": 3, "tpa": 7, "ftm": 0, "fta": 2, "off_reb": 1, "def_reb": 0, "rebounds": 1, "assists": 4, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 11}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 18, '{"minutes": 27, "fgm": 6, "fga": 7, "tpm": 3, "tpa": 3, "ftm": 3, "fta": 4, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 2, "steals": 2, "blocks": 0, "turnovers": 4, "fouls": 2, "points": 18}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 5, '{"minutes": 27, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 4, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Smith', '12', 0, '{"minutes": 1, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wright', '21', 0, '{"minutes": 1, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Morton-Rivera', '44', 10, '{"minutes": 26, "fgm": 4, "fga": 9, "tpm": 2, "tpa": 5, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Tyler', '3', 14, '{"minutes": 23, "fgm": 5, "fga": 7, "tpm": 2, "tpa": 2, "ftm": 2, "fta": 3, "off_reb": 0, "def_reb": 6, "rebounds": 6, "assists": 2, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 1, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Moshinski', '24', 7, '{"minutes": 27, "fgm": 2, "fga": 6, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 8, "off_reb": 1, "def_reb": 5, "rebounds": 6, "assists": 5, "steals": 1, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 7}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Westfield', '0', 3, '{"minutes": 29, "fgm": 1, "fga": 2, "tpm": 1, "tpa": 2, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 7, "steals": 2, "blocks": 0, "turnovers": 2, "fouls": 1, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Adedeji', '2', 10, '{"minutes": 14, "fgm": 3, "fga": 6, "tpm": 0, "tpa": 0, "ftm": 4, "fta": 7, "off_reb": 1, "def_reb": 1, "rebounds": 2, "assists": 0, "steals": 2, "blocks": 0, "turnovers": 1, "fouls": 4, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Copeland', '4', 3, '{"minutes": 10, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 6, "off_reb": 0, "def_reb": 2, "rebounds": 2, "assists": 1, "steals": 0, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Harris', '5', 14, '{"minutes": 15, "fgm": 5, "fga": 7, "tpm": 3, "tpa": 4, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 0, "fouls": 2, "points": 14}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Brown', '1', 4, '{"minutes": 13, "fgm": 2, "fga": 3, "tpm": 0, "tpa": 1, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 2, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 1, "turnovers": 1, "fouls": 1, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 147, 'basketball', 'Mason', '11', 0, '{"minutes": 3, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-02-08'
  AND (147 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Wheatley', '22', 13, '{"minutes": 29, "fgm": 5, "fga": 13, "tpm": 0, "tpa": 1, "ftm": 3, "fta": 4, "off_reb": 2, "def_reb": 4, "rebounds": 6, "assists": 3, "steals": 1, "blocks": 3, "turnovers": 1, "fouls": 5, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Fauntroy', '4', 3, '{"minutes": 26, "fgm": 1, "fga": 4, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 0, "blocks": 1, "turnovers": 5, "fouls": 2, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Rozier', '10', 13, '{"minutes": 32, "fgm": 5, "fga": 6, "tpm": 1, "tpa": 1, "ftm": 2, "fta": 4, "off_reb": 6, "def_reb": 2, "rebounds": 8, "assists": 3, "steals": 1, "blocks": 3, "turnovers": 4, "fouls": 4, "points": 13}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Farlow', '24', 0, '{"minutes": 21, "fgm": 0, "fga": 3, "tpm": 0, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 2, "fouls": 4, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Ortiz', '11', 5, '{"minutes": 24, "fgm": 2, "fga": 7, "tpm": 1, "tpa": 3, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 2, "steals": 0, "blocks": 0, "turnovers": 6, "fouls": 3, "points": 5}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Johnson', '1', 10, '{"minutes": 26, "fgm": 4, "fga": 11, "tpm": 0, "tpa": 0, "ftm": 2, "fta": 5, "off_reb": 2, "def_reb": 7, "rebounds": 9, "assists": 5, "steals": 1, "blocks": 2, "turnovers": 5, "fouls": 2, "points": 10}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 171, 'basketball', 'Graves', '14', 0, '{"minutes": 2, "fgm": 0, "fga": 0, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 0, "steals": 0, "blocks": 0, "turnovers": 1, "fouls": 0, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (171 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Jackson, Sammy', '1', 28, '{"minutes": 30, "fgm": 11, "fga": 14, "tpm": 2, "tpa": 4, "ftm": 4, "fta": 7, "off_reb": 0, "def_reb": 3, "rebounds": 3, "assists": 1, "steals": 4, "blocks": 3, "turnovers": 4, "fouls": 1, "points": 28}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Smith', '3', 12, '{"minutes": 23, "fgm": 4, "fga": 7, "tpm": 1, "tpa": 2, "ftm": 3, "fta": 3, "off_reb": 0, "def_reb": 0, "rebounds": 0, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 3, "fouls": 2, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Bey-Moore', '35', 3, '{"minutes": 17, "fgm": 1, "fga": 3, "tpm": 0, "tpa": 0, "ftm": 1, "fta": 1, "off_reb": 1, "def_reb": 4, "rebounds": 5, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 3}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Robinson', '2', 1, '{"minutes": 29, "fgm": 0, "fga": 5, "tpm": 0, "tpa": 2, "ftm": 1, "fta": 2, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 3, "steals": 2, "blocks": 0, "turnovers": 0, "fouls": 2, "points": 1}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Pressley', '24', 12, '{"minutes": 28, "fgm": 4, "fga": 11, "tpm": 0, "tpa": 1, "ftm": 4, "fta": 6, "off_reb": 3, "def_reb": 4, "rebounds": 7, "assists": 1, "steals": 1, "blocks": 0, "turnovers": 0, "fouls": 3, "points": 12}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Ruffin', '0', 4, '{"minutes": 20, "fgm": 2, "fga": 7, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 2, "def_reb": 2, "rebounds": 4, "assists": 2, "steals": 3, "blocks": 0, "turnovers": 1, "fouls": 2, "points": 4}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO game_player_stats (game_id, player_id, school_id, sport_id, player_name, jersey_number, points, stats_json, source_type, source_file, created_at)
SELECT g.id, NULL, 127, 'basketball', 'Wanamaker', '11', 0, '{"minutes": 13, "fgm": 0, "fga": 1, "tpm": 0, "tpa": 0, "ftm": 0, "fta": 0, "off_reb": 0, "def_reb": 1, "rebounds": 1, "assists": 1, "steals": 3, "blocks": 0, "turnovers": 2, "fouls": 2, "points": 0}'::jsonb, 'box_score', 'aop_pdf', NOW()
FROM games g
WHERE g.sport_id = 'basketball'
  AND g.game_date = '2026-01-04'
  AND (127 IN (g.home_school_id, g.away_school_id))
  AND g.season_id = 76
LIMIT 1
ON CONFLICT DO NOTHING;
