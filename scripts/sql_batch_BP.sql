DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Korey Francis') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'k%francis' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Korey Francis','korey-francis-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 25, 521, 20.8, 167, 329, 50.8, 29, 80, 36.2, 158, 210, 75.2, 23, 161, 184, 7.4, 85, 3.4, 42, 33, 87, '1', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Kam Jackson') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'k%jackson' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Kam Jackson','kam-jackson-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 25, 384, 15.4, 132, 258, 51.2, 44, 104, 42.3, 76, 92, 82.6, 19, 75, 94, 3.8, 125, 5.0, 48, 8, 56, '2', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Jakeem Carroll') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'j%carroll' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jakeem Carroll','jakeem-carroll-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 25, 270, 10.8, 86, 203, 42.4, 61, 151, 40.4, 37, 41, 90.2, 8, 70, 78, 3.1, 45, 1.8, 22, 4, 29, '4', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('DaShaun Holden') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'd%holden' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('DaShaun Holden','dashaun-holden-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 25, 246, 9.8, 77, 172, 44.8, 33, 82, 40.2, 59, 80, 73.8, 23, 49, 72, 2.8, 50, 2.0, 40, 7, 31, '3', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Aydin Scott') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'a%scott' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Aydin Scott','aydin-scott-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 25, 102, 4.1, 41, 61, 67.2, 0, 0, NULL, 20, 31, 64.5, 27, 50, 77, 3.1, 12, 0.5, 12, 29, 16, '5', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Tariq Warner') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 't%warner' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Tariq Warner','tariq-warner-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 23, 62, 2.7, 22, 61, 36.1, 12, 35, 34.3, 6, 11, 54.5, 4, 18, 22, 1.0, 4, 0.2, 3, 3, 9, '0', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Masen Price') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'm%price' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Masen Price','masen-price-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 25, 55, 2.2, 23, 61, 37.7, 2, 21, 9.5, 7, 9, 77.8, 17, 43, 60, 2.4, 12, 0.5, 18, 12, 16, '24', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Javon Banner') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'j%banner' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Javon Banner','javon-banner-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 16, 17, 1.1, 7, 12, 58.3, 0, 0, NULL, 3, 6, 50.0, 8, 6, 14, 0.9, 1, 0.1, 1, 2, 3, '10', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Isaias Jordan') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'i%jordan' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Isaias Jordan','isaias-jordan-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 8, 9, 1.1, 4, 5, 80.0, 0, 0, NULL, 1, 3, 33.3, 2, 3, 5, 0.6, 2, 0.3, 0, 0, 5, '23', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Tyrie Davis-Winn') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 't%davis-winn' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Tyrie Davis-Winn','tyrie-davis-winn-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 7, 5, 0.7, 2, 2, 100.0, 0, 0, NULL, 1, 2, 50.0, 3, 6, 9, 1.3, 1, 0.1, 0, 2, 2, '55', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Charlie Quackenbush') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'c%quackenbush' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Charlie Quackenbush','charlie-quackenbush-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 5, 4, 0.8, 2, 5, 40.0, 0, 0, NULL, 0, 0, NULL, 2, 2, 4, 0.8, 1, 0.2, 1, 1, 1, '21', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Chase D'Ambrosio') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'c%d'ambrosio' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Chase D'Ambrosio','chase-dambrosio-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 7, 5, 0.7, 2, 7, 28.6, 1, 1, 100.0, 0, 0, NULL, 1, 2, 3, 0.4, 1, 0.1, 0, 0, 3, '22', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Jayden Clark') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'j%clark' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jayden Clark','jayden-clark-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 5, 4, 0.8, 2, 3, 66.7, 0, 0, NULL, 0, 0, NULL, 0, 3, 3, 0.6, 0, 0.0, 0, 0, 1, '25', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name)=LOWER('Michael Chepyshev') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=177 AND LOWER(name) LIKE 'm%chepyshev' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Michael Chepyshev','michael-chepyshev-2026-bp',177,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 177, 1, 0, 0.0, 0, 0, NULL, 0, 0, NULL, 0, 0, NULL, 0, 0, 0, 0.0, 0, 0.0, 0, 0, 0, '20', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;