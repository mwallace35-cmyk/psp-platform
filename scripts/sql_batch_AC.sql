DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Nasir Ralls') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'n%ralls' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nasir Ralls','nasir-ralls-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 22, 308, 14.0, 99, 247, 40.1, 49, 137, 35.8, 61, 77, 79.2, 14, 53, 67, 3.0, 59, 2.7, 21, 6, 34, '55', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Yasir Turner') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'y%turner' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Yasir Turner','yasir-turner-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 22, 250, 11.4, 86, 239, 36.0, 12, 53, 22.6, 66, 92, 71.7, 19, 64, 83, 3.8, 70, 3.2, 22, 7, 56, '3', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Ian Williams') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'i%williams' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Ian Williams','ian-williams-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 24, 257, 10.7, 83, 228, 36.4, 39, 137, 28.5, 52, 67, 77.6, 6, 92, 98, 4.1, 136, 5.7, 52, 5, 77, '5', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Drew Corrao') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'd%corrao' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Drew Corrao','drew-corrao-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 24, 246, 10.3, 82, 215, 38.1, 40, 107, 37.4, 42, 53, 79.2, 52, 106, 158, 6.6, 26, 1.1, 11, 33, 41, '23', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Nikolai Lugendo') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'n%lugendo' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nikolai Lugendo','nikolai-lugendo-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 23, 205, 8.9, 90, 155, 58.1, 2, 16, 12.5, 23, 32, 71.9, 60, 71, 131, 5.7, 7, 0.3, 9, 26, 19, '4', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Nigel Lambert') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'n%lambert' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nigel Lambert','nigel-lambert-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 24, 71, 3.0, 24, 61, 39.3, 9, 31, 29.0, 15, 21, 71.4, 23, 47, 70, 2.9, 22, 0.9, 29, 1, 13, '10', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Ceasar Richardson') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'c%richardson' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Ceasar Richardson','ceasar-richardson-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 12, 28, 2.3, 11, 26, 42.3, 3, 15, 20.0, 3, 7, 42.9, 7, 13, 20, 1.7, 4, 0.3, 2, 3, 3, '0', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Eric White') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'e%white' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Eric White','eric-white-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 15, 18, 1.2, 9, 13, 69.2, 0, 0, NULL, 0, 2, 0.0, 13, 11, 24, 1.6, 4, 0.3, 9, 2, 2, '4', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name)=LOWER('Kaiden Mooty') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=145 AND LOWER(name) LIKE 'k%mooty' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Kaiden Mooty','kaiden-mooty-2026-ac',145,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 145, 1, 0, 0.0, 0, 0, NULL, 0, 0, NULL, 0, 0, NULL, 0, 0, 0, 0.0, 0, 0.0, 0, 0, 0, '11', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;