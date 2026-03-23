DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Derrick Morton-Rivera') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'd%morton-rivera' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Derrick Morton-Rivera','derrick-morton-rivera-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 21, 319, 15.2, 104, 248, 41.9, 51, 137, 37.2, 60, 68, 88.2, 33, 55, 88, 4.2, 33, 1.6, 12, 7, 27, '44', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Nasir Tyler') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'n%tyler' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nasir Tyler','nasir-tyler-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 26, 281, 10.8, 98, 237, 41.4, 44, 130, 33.8, 41, 54, 75.9, 24, 81, 105, 4.0, 48, 1.8, 20, 11, 33, '3', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Max Moshinski') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'm%moshinski' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Max Moshinski','max-moshinski-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 26, 273, 10.5, 100, 203, 49.3, 19, 60, 31.7, 54, 96, 56.2, 41, 97, 138, 5.3, 87, 3.3, 29, 20, 43, '24', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Rocco Westfield') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'r%westfield' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Rocco Westfield','rocco-westfield-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 26, 209, 8.0, 72, 168, 42.9, 43, 113, 38.1, 22, 28, 78.6, 21, 71, 92, 3.5, 107, 4.1, 37, 1, 37, '0', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Jeremiah Adedeji') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'j%adedeji' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jeremiah Adedeji','jeremiah-adedeji-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 25, 186, 7.4, 67, 138, 48.6, 4, 16, 25.0, 48, 79, 60.8, 56, 89, 145, 5.8, 16, 0.6, 13, 34, 40, '2', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Rezon Harris') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'r%harris' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Rezon Harris','rezon-harris-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 23, 119, 5.2, 42, 116, 36.2, 26, 84, 31.0, 9, 12, 75.0, 5, 53, 58, 2.5, 23, 1.0, 10, 9, 15, '5', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Khory Copeland') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'k%copeland' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Khory Copeland','khory-copeland-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 26, 112, 4.3, 40, 88, 45.5, 5, 24, 20.8, 27, 41, 65.9, 8, 43, 51, 2.0, 49, 1.9, 12, 2, 33, '4', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Ahmir Brown') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'a%brown' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Ahmir Brown','ahmir-brown-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 24, 58, 2.4, 20, 45, 44.4, 3, 16, 18.8, 15, 20, 75.0, 22, 42, 64, 2.7, 13, 0.5, 9, 18, 19, '1', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Rah'kiy Mason') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'r%mason' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Rah'kiy Mason','rahkiy-mason-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 22, 25, 1.1, 10, 21, 47.6, 0, 2, 0.0, 5, 14, 35.7, 3, 11, 14, 0.6, 15, 0.7, 16, 0, 18, '11', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Nick Lilly') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'n%lilly' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nick Lilly','nick-lilly-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 12, 12, 1.0, 4, 10, 40.0, 3, 7, 42.9, 1, 4, 25.0, 4, 4, 8, 0.7, 0, 0.0, 1, 0, 0, '21', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Jamal Hamidou') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'j%hamidou' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jamal Hamidou','jamal-hamidou-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 12, 10, 0.8, 5, 10, 50.0, 0, 0, NULL, 0, 4, 0.0, 5, 9, 14, 1.2, 2, 0.2, 4, 8, 4, '10', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Uri Stanley') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'u%stanley' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Uri Stanley','uri-stanley-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 10, 6, 0.6, 2, 5, 40.0, 0, 1, 0.0, 2, 4, 50.0, 1, 1, 2, 0.2, 0, 0.0, 0, 0, 2, '13', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Michael Chase') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'm%chase' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Michael Chase','michael-chase-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 11, 5, 0.5, 2, 9, 22.2, 1, 3, 33.3, 0, 0, NULL, 2, 5, 7, 0.6, 4, 0.4, 5, 0, 3, '14', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Nick Evans') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'n%evans' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nick Evans','nick-evans-2026-fj',147,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 147, 12, 5, 0.4, 2, 9, 22.2, 1, 7, 14.3, 0, 0, NULL, 2, 3, 5, 0.4, 4, 0.3, 3, 0, 3, '12', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;