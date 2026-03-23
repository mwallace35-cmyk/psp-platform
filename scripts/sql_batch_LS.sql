DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Tyler Branson') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 't%branson' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Tyler Branson','tyler-branson-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 22, 308, 14.0, 76, 229, 33.2, 26, 90, 28.9, 130, 173, 75.1, 14, 59, 73, 3.3, 116, 5.3, 42, 3, 68, '3', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Max Okebata') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'm%okebata' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Max Okebata','max-okebata-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 22, 279, 12.7, 99, 222, 44.6, 12, 55, 21.8, 69, 136, 50.7, 49, 102, 151, 6.9, 47, 2.1, 53, 13, 58, '4', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Nick Neri') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'n%neri' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nick Neri','nick-neri-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 18, 136, 7.6, 50, 112, 44.6, 2, 13, 15.4, 34, 51, 66.7, 49, 43, 92, 5.1, 17, 0.9, 13, 3, 32, '23', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Pryce Alston') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'p%alston' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Pryce Alston','pryce-alston-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 22, 116, 5.3, 42, 111, 37.8, 1, 5, 20.0, 31, 71, 43.7, 36, 62, 98, 4.5, 17, 0.7, 11, 27, 40, '50', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Patrick Flaherty') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'p%flaherty' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Patrick Flaherty','patrick-flaherty-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 21, 104, 5.0, 36, 84, 42.9, 22, 53, 41.5, 10, 14, 71.4, 18, 32, 50, 2.4, 17, 0.8, 13, 2, 13, '0', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Ryan Damon') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'r%damon' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Ryan Damon','ryan-damon-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 22, 97, 4.4, 42, 83, 50.6, 4, 12, 33.3, 9, 12, 75.0, 23, 37, 60, 2.7, 13, 0.6, 16, 5, 25, '10', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Mack O'Neill') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'm%o'neill' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Mack O'Neill','mack-oneill-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 7, 29, 4.1, 12, 28, 42.9, 3, 12, 25.0, 2, 3, 66.7, 6, 9, 15, 2.1, 5, 0.7, 1, 1, 7, '15', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Jaxson Carroll') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'j%carroll' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jaxson Carroll','jaxson-carroll-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 21, 72, 3.4, 23, 60, 38.3, 9, 31, 29.0, 17, 19, 89.5, 6, 39, 45, 2.1, 17, 0.8, 9, 4, 23, '33', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Jayden Carr') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'j%carr' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jayden Carr','jayden-carr-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 17, 40, 2.4, 11, 49, 22.4, 0, 12, 0.0, 18, 25, 72.0, 5, 15, 20, 1.2, 9, 0.5, 4, 1, 15, '5', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Ryan Reing') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'r%reing' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Ryan Reing','ryan-reing-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 22, 49, 2.2, 17, 46, 37.0, 11, 24, 45.8, 4, 10, 40.0, 13, 33, 46, 2.1, 14, 0.6, 11, 2, 15, '20', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Nate Walsh') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'n%walsh' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Nate Walsh','nate-walsh-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 5, 10, 2.0, 4, 6, 66.7, 2, 4, 50.0, 0, 0, NULL, 0, 2, 2, 0.4, 1, 0.2, 2, 0, 0, '12', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Rex Helstrom') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'r%helstrom' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Rex Helstrom','rex-helstrom-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 7, 10, 1.4, 3, 7, 42.9, 2, 5, 40.0, 2, 2, 100.0, 1, 2, 3, 0.4, 1, 0.1, 2, 0, 5, '25', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;
DO $$
DECLARE v_pid INTEGER;
BEGIN
  SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name)=LOWER('Jack McCabe') LIMIT 1;
  IF v_pid IS NULL THEN SELECT id INTO v_pid FROM players WHERE primary_school_id=2882 AND LOWER(name) LIKE 'j%mccabe' LIMIT 1; END IF;
  IF v_pid IS NULL THEN INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at) VALUES('Jack McCabe','jack-mccabe-2026-ls',2882,2026,'philly',NOW()) RETURNING id INTO v_pid; END IF;
  INSERT INTO basketball_player_seasons (player_id, season_id, school_id, games_played, points, ppg, fgm, fga, fg_pct, three_pm, three_pa, three_pct, ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg, assists, apg, steals, blocks, turnovers, jersey_number, source_file, created_at) VALUES (v_pid, 76, 2882, 17, 10, 0.6, 4, 6, 66.7, 2, 3, 66.7, 0, 0, NULL, 0, 0, 0, 0.0, 4, 0.2, 2, 0, 2, '1', 'pcl_team_stats_2025_26', NOW())
  ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played, points=EXCLUDED.points, ppg=EXCLUDED.ppg, fgm=EXCLUDED.fgm, fga=EXCLUDED.fga, fg_pct=EXCLUDED.fg_pct, three_pm=EXCLUDED.three_pm, three_pa=EXCLUDED.three_pa, three_pct=EXCLUDED.three_pct, ftm=EXCLUDED.ftm, fta=EXCLUDED.fta, ft_pct=EXCLUDED.ft_pct, off_rebounds=EXCLUDED.off_rebounds, def_rebounds=EXCLUDED.def_rebounds, rebounds=EXCLUDED.rebounds, rpg=EXCLUDED.rpg, assists=EXCLUDED.assists, apg=EXCLUDED.apg, steals=EXCLUDED.steals, blocks=EXCLUDED.blocks, turnovers=EXCLUDED.turnovers, jersey_number=EXCLUDED.jersey_number, source_file=EXCLUDED.source_file, updated_at=NOW();
END $$;