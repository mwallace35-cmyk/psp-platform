DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jaden Craft') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%craft' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jaden Craft','jaden-craft-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 23, 233, 10.1, 66, 172, 38.4, 32, 107, 29.9, 69, 84, 82.1, 22, 68, 90, 3.9, 51, 2.2, 42, 8, 43, '10', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Cooper Fairlamb') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'c%fairlamb' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Cooper Fairlamb','cooper-fairlamb-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 22, 176, 8.0, 68, 182, 37.4, 10, 47, 21.3, 30, 41, 73.2, 10, 76, 86, 3.9, 74, 3.4, 24, 9, 59, '13', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('John Doogan') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%doogan' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('John Doogan','john-doogan-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 22, 153, 7.0, 59, 130, 45.4, 9, 38, 23.7, 26, 45, 57.8, 16, 48, 64, 2.9, 17, 0.8, 18, 10, 28, '21', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Owen Raymond') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'o%raymond' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Owen Raymond','owen-raymond-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 23, 143, 6.2, 55, 160, 34.4, 16, 64, 25.0, 17, 26, 65.4, 18, 43, 61, 2.7, 64, 2.8, 38, 8, 66, '5', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Braeden Fisher') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'b%fisher' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Braeden Fisher','braeden-fisher-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 22, 126, 5.7, 53, 113, 46.9, 5, 19, 26.3, 15, 30, 50.0, 24, 61, 85, 3.9, 42, 1.8, 36, 9, 46, '33', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Dillon Johnson') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'd%johnson' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Dillon Johnson','dillon-johnson-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 23, 123, 5.3, 43, 87, 49.4, 27, 63, 42.9, 10, 14, 71.4, 14, 19, 33, 1.4, 21, 0.9, 19, 2, 16, '3', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Saeed Garrett') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 's%garrett' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Saeed Garrett','saeed-garrett-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 21, 70, 3.3, 22, 80, 27.5, 12, 50, 24.0, 14, 18, 77.8, 4, 13, 17, 0.8, 19, 0.9, 8, 0, 12, '11', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('James Kaune') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%kaune' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('James Kaune','james-kaune-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 19, 52, 2.7, 20, 60, 33.3, 5, 14, 35.7, 7, 16, 43.8, 18, 9, 27, 1.4, 10, 0.5, 10, 1, 7, '34', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Caleb Tesfaye') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'c%tesfaye' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Caleb Tesfaye','caleb-tesfaye-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 17, 46, 2.7, 20, 47, 42.6, 0, 9, 0.0, 6, 8, 75.0, 11, 14, 25, 1.5, 4, 0.2, 3, 6, 10, '20', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jayden Allen-Bates') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%allen-bates' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jayden Allen-Bates','jayden-allen-bates-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 22, 50, 2.3, 18, 45, 40.0, 0, 7, 0.0, 14, 25, 56.0, 10, 16, 26, 1.2, 7, 0.3, 20, 2, 20, '4', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Joseph McGuinn') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%mcguinn' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Joseph McGuinn','joseph-mcguinn-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 9, 23, 2.6, 11, 19, 57.9, 0, 3, 0.0, 1, 2, 50.0, 9, 9, 18, 2.0, 5, 0.6, 1, 1, 8, '14', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Shawn Wheeler') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 's%wheeler' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Shawn Wheeler','shawn-wheeler-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 8, 3, 0.4, 1, 5, 20.0, 1, 3, 33.3, 0, 0, NULL, 0, 7, 7, 0.9, 8, 1.0, 1, 0, 2, '15', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Luke Johnson') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'l%johnson' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Luke Johnson','luke-johnson-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 4, 16, 4.0, 6, 9, 66.7, 2, 3, 66.7, 2, 2, 100.0, 3, 2, 5, 1.3, 1, 0.3, 1, 2, 3, '23', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Kaiden Brooks') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'k%brooks' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Kaiden Brooks','kaiden-brooks-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 1, 4, 4.0, 2, 4, 50.0, 0, 2, 0.0, 0, 0, NULL, 0, 1, 1, 1.0, 2, 2.0, 0, 0, 1, '55', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Cincere Mate') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'c%mate' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Cincere Mate','cincere-mate-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 1, 0, 0.0, 0, 4, 0.0, 0, 2, 0.0, 0, 0, NULL, 0, 1, 1, 1.0, 0, 0.0, 1, 0, 3, '41', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Brennan Wood') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'b%wood' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Brennan Wood','brennan-wood-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 1, 2, 2.0, 0, 1, 0.0, 0, 1, 0.0, 2, 2, 100.0, 0, 2, 2, 2.0, 1, 1.0, 3, 0, 1, '2', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jack Doyle') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%doyle' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jack Doyle','jack-doyle-2026-dp',254,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 254, 1, 0, 0.0, 0, 0, NULL, 0, 0, NULL, 0, 0, NULL, 0, 0, 0, 0.0, 0, 0.0, 0, 0, 2, '12', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;