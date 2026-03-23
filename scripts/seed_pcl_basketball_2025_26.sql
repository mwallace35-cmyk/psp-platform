-- PCL Basketball 2025-26 Season Stats Import
-- 192 players from 14 schools, parsed from AOP Team Stats PDFs


DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Nasir Ralls')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'n%ralls'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%ralls'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nasir Ralls', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 22, 308, 14.0,
    99, 247, 40.1,
    49, 137, 35.8,
    61, 77, 79.2,
    14, 53, 67, 3.0,
    59, 2.7,
    21, 6, 34,
    '55', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Yasir Turner')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'y%turner'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%turner'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Yasir Turner', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 22, 250, 11.4,
    86, 239, 36.0,
    12, 53, 22.6,
    66, 92, 71.7,
    19, 64, 83, 3.8,
    70, 3.2,
    22, 7, 56,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Ian Williams')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'i%williams'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%williams'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ian Williams', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 24, 257, 10.7,
    83, 228, 36.4,
    39, 137, 28.5,
    52, 67, 77.6,
    6, 92, 98, 4.1,
    136, 5.7,
    52, 5, 77,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Drew Corrao')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'd%corrao'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%corrao'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Drew Corrao', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 24, 246, 10.3,
    82, 215, 38.1,
    40, 107, 37.4,
    42, 53, 79.2,
    52, 106, 158, 6.6,
    26, 1.1,
    11, 33, 41,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Nikolai Lugendo')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'n%lugendo'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%lugendo'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nikolai Lugendo', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 23, 205, 8.9,
    90, 155, 58.1,
    2, 16, 12.5,
    23, 32, 71.9,
    60, 71, 131, 5.7,
    7, 0.3,
    9, 26, 19,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Nigel Lambert')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'n%lambert'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%lambert'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nigel Lambert', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 24, 71, 3.0,
    24, 61, 39.3,
    9, 31, 29.0,
    15, 21, 71.4,
    23, 47, 70, 2.9,
    22, 0.9,
    29, 1, 13,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Ceasar Richardson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'c%richardson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%richardson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ceasar Richardson', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 12, 28, 2.3,
    11, 26, 42.3,
    3, 15, 20.0,
    3, 7, 42.9,
    7, 13, 20, 1.7,
    4, 0.3,
    2, 3, 3,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Eric White')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'e%white'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%white'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Eric White', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 15, 18, 1.2,
    9, 13, 69.2,
    0, 0, NULL,
    0, 2, 0.0,
    13, 11, 24, 1.6,
    4, 0.3,
    9, 2, 2,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 166 AND LOWER(name) = LOWER('Kaiden Mooty')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 166
      AND LOWER(name) LIKE 'k%mooty'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 166
      AND LOWER(p.name) LIKE '%mooty'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kaiden Mooty', 166, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 166, 1, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Malik Hughes')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'm%hughes'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%hughes'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Malik Hughes', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 22, 435, 19.8,
    156, 354, 44.1,
    13, 51, 25.5,
    112, 147, 76.2,
    40, 80, 120, 5.5,
    39, 1.8,
    18, 17, 65,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Isaiah Gore')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'i%gore'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%gore'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Isaiah Gore', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 22, 264, 12.0,
    98, 201, 48.8,
    27, 75, 36.0,
    41, 52, 78.8,
    17, 69, 86, 3.9,
    60, 2.7,
    12, 2, 36,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Seth Gaye')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 's%gaye'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%gaye'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Seth Gaye', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 17, 156, 9.2,
    57, 123, 46.3,
    16, 56, 28.6,
    26, 35, 74.3,
    10, 60, 70, 4.1,
    40, 2.4,
    41, 11, 22,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Kaden Brown')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'k%brown'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%brown'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kaden Brown', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 22, 195, 8.9,
    60, 181, 33.1,
    29, 112, 25.9,
    46, 57, 80.7,
    19, 54, 73, 3.3,
    47, 2.1,
    28, 1, 33,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Matt Johnson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'm%johnson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%johnson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Matt Johnson', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 22, 176, 8.0,
    63, 142, 44.4,
    6, 11, 54.5,
    44, 61, 72.1,
    18, 56, 74, 3.4,
    116, 5.3,
    26, 5, 42,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Jeremy Thompson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'j%thompson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%thompson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jeremy Thompson', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 11, 62, 5.6,
    24, 40, 60.0,
    6, 15, 40.0,
    8, 14, 57.1,
    4, 10, 14, 1.3,
    4, 0.4,
    8, 4, 9,
    '20', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Jack McMullin')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'j%mcmullin'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%mcmullin'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jack McMullin', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 15, 53, 3.5,
    17, 42, 40.5,
    16, 37, 43.2,
    3, 7, 42.9,
    4, 30, 34, 2.3,
    10, 0.7,
    5, 1, 5,
    '13', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Gavin Kpan')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'g%kpan'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%kpan'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Gavin Kpan', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 21, 63, 3.0,
    27, 54, 50.0,
    0, 0, NULL,
    9, 22, 40.9,
    37, 47, 84, 4.0,
    16, 0.8,
    19, 29, 11,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Brett Mariani')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'b%mariani'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%mariani'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Brett Mariani', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 9, 23, 2.6,
    8, 17, 47.1,
    6, 15, 40.0,
    1, 2, 50.0,
    2, 4, 6, 0.7,
    2, 0.2,
    2, 0, 1,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('CJ Williams')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'c%williams'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%williams'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('CJ Williams', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 4, 11, 2.8,
    3, 5, 60.0,
    3, 4, 75.0,
    2, 2, 100.0,
    0, 3, 3, 0.8,
    1, 0.3,
    2, 0, 0,
    '30', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('EJ McNeil')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'e%mcneil'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%mcneil'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('EJ McNeil', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 12, 0, 0.0,
    0, 6, 0.0,
    0, 3, 0.0,
    0, 0, NULL,
    5, 5, 10, 0.8,
    3, 0.3,
    4, 0, 1,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('James Samuel')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'j%samuel'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%samuel'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('James Samuel', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 5, 10, 2.0,
    3, 4, 75.0,
    2, 3, 66.7,
    2, 2, 100.0,
    1, 1, 2, 0.4,
    0, 0.0,
    0, 0, 0,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('BJ Scott')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'b%scott'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%scott'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('BJ Scott', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 3, 0, 0.0,
    0, 2, 0.0,
    0, 2, 0.0,
    0, 0, NULL,
    1, 1, 2, 0.7,
    1, 0.3,
    1, 0, 0,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 175 AND LOWER(name) = LOWER('Jack Rock')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 175
      AND LOWER(name) LIKE 'j%rock'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 175
      AND LOWER(p.name) LIKE '%rock'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jack Rock', 175, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 175, 1, 0, 0.0,
    0, 1, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    1, 1.0,
    0, 0, 0,
    '25', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Caleb Lundy')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'c%lundy'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%lundy'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Caleb Lundy', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 25, 432, 17.3,
    128, 272, 47.1,
    39, 95, 41.1,
    137, 176, 77.8,
    11, 110, 121, 4.8,
    116, 4.6,
    24, 9, 78,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Brady MacAdams')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'b%macadams'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%macadams'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Brady MacAdams', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 25, 380, 15.2,
    126, 278, 45.3,
    48, 117, 41.0,
    80, 116, 69.0,
    32, 111, 143, 5.7,
    65, 2.6,
    12, 9, 61,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Jaydn Jenkins')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'j%jenkins'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%jenkins'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jaydn Jenkins', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 24, 233, 9.7,
    95, 153, 62.1,
    4, 12, 33.3,
    39, 59, 66.1,
    57, 107, 164, 6.8,
    27, 1.1,
    11, 88, 35,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Dylan Powell')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'd%powell'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%powell'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Dylan Powell', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 24, 204, 8.5,
    65, 143, 45.5,
    20, 73, 27.4,
    54, 71, 76.1,
    10, 51, 61, 2.5,
    59, 2.5,
    23, 15, 47,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Malachi Warren')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'm%warren'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%warren'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Malachi Warren', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 24, 135, 5.6,
    40, 76, 52.6,
    11, 20, 55.0,
    44, 66, 66.7,
    26, 52, 78, 3.3,
    35, 1.5,
    23, 3, 27,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Brian Donahue')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'b%donahue'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%donahue'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Brian Donahue', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 25, 117, 4.7,
    39, 113, 34.5,
    22, 76, 28.9,
    17, 28, 60.7,
    8, 74, 82, 3.3,
    41, 1.6,
    7, 5, 18,
    '20', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Kyiien Strong')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'k%strong'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%strong'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kyiien Strong', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 25, 85, 3.4,
    31, 74, 41.9,
    10, 32, 31.2,
    13, 16, 81.2,
    8, 32, 40, 1.6,
    19, 0.8,
    12, 2, 20,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Finn McGuire')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'f%mcguire'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%mcguire'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Finn McGuire', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 12, 8, 0.7,
    2, 5, 40.0,
    2, 5, 40.0,
    2, 4, 50.0,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 1,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Pat Breslin')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'p%breslin'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%breslin'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Pat Breslin', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 14, 1, 0.1,
    0, 2, 0.0,
    0, 2, 0.0,
    1, 2, 50.0,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('David Melcher')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'd%melcher'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%melcher'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('David Melcher', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 9, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    1, 3, 4, 0.4,
    1, 0.1,
    0, 0, 0,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Gavin Tumelty')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'g%tumelty'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%tumelty'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Gavin Tumelty', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 7, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 1,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Kevin Bullard')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'k%bullard'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%bullard'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kevin Bullard', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 4, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '24', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('AJ Griffin')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'a%griffin'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%griffin'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('AJ Griffin', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 5, 0, 0.0,
    0, 3, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    2, 1, 3, 0.6,
    0, 0.0,
    1, 0, 1,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('Mason McGuire')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'm%mcguire'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%mcguire'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Mason McGuire', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 2, 0, 0.0,
    0, 2, 0.0,
    0, 1, 0.0,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 1,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 197 AND LOWER(name) = LOWER('David Robbins')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 197
      AND LOWER(name) LIKE 'd%robbins'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 197
      AND LOWER(p.name) LIKE '%robbins'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('David Robbins', 197, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 197, 1, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 1,
    '32', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Korey Francis')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'k%francis'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%francis'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Korey Francis', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 25, 521, 20.8,
    167, 329, 50.8,
    29, 80, 36.2,
    158, 210, 75.2,
    23, 161, 184, 7.4,
    85, 3.4,
    42, 33, 87,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Kam Jackson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'k%jackson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%jackson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kam Jackson', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 25, 384, 15.4,
    132, 258, 51.2,
    44, 104, 42.3,
    76, 92, 82.6,
    19, 75, 94, 3.8,
    125, 5.0,
    48, 8, 56,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Jakeem Carroll')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'j%carroll'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%carroll'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jakeem Carroll', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 25, 270, 10.8,
    86, 203, 42.4,
    61, 151, 40.4,
    37, 41, 90.2,
    8, 70, 78, 3.1,
    45, 1.8,
    22, 4, 29,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('DaShaun Holden')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'd%holden'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%holden'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('DaShaun Holden', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 25, 246, 9.8,
    77, 172, 44.8,
    33, 82, 40.2,
    59, 80, 73.8,
    23, 49, 72, 2.8,
    50, 2.0,
    40, 7, 31,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Aydin Scott')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'a%scott'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%scott'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Aydin Scott', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 25, 102, 4.1,
    41, 61, 67.2,
    0, 0, NULL,
    20, 31, 64.5,
    27, 50, 77, 3.1,
    12, 0.5,
    12, 29, 16,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Tariq Warner')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 't%warner'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%warner'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Tariq Warner', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 23, 62, 2.7,
    22, 61, 36.1,
    12, 35, 34.3,
    6, 11, 54.5,
    4, 18, 22, 1.0,
    4, 0.2,
    3, 3, 9,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Masen Price')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'm%price'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%price'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Masen Price', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 25, 55, 2.2,
    23, 61, 37.7,
    2, 21, 9.5,
    7, 9, 77.8,
    17, 43, 60, 2.4,
    12, 0.5,
    18, 12, 16,
    '24', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Javon Banner')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'j%banner'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%banner'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Javon Banner', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 16, 17, 1.1,
    7, 12, 58.3,
    0, 0, NULL,
    3, 6, 50.0,
    8, 6, 14, 0.9,
    1, 0.1,
    1, 2, 3,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Isaias Jordan')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'i%jordan'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%jordan'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Isaias Jordan', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 8, 9, 1.1,
    4, 5, 80.0,
    0, 0, NULL,
    1, 3, 33.3,
    2, 3, 5, 0.6,
    2, 0.3,
    0, 0, 5,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Tyrie Davis-Winn')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 't%davis-winn'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%davis-winn'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Tyrie Davis-Winn', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 7, 5, 0.7,
    2, 2, 100.0,
    0, 0, NULL,
    1, 2, 50.0,
    3, 6, 9, 1.3,
    1, 0.1,
    0, 2, 2,
    '55', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Charlie Quackenbush')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'c%quackenbush'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%quackenbush'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Charlie Quackenbush', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 5, 4, 0.8,
    2, 5, 40.0,
    0, 0, NULL,
    0, 0, NULL,
    2, 2, 4, 0.8,
    1, 0.2,
    1, 1, 1,
    '21', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Chase D’Ambrosio')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'c%d’ambrosio'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%d’ambrosio'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Chase D’Ambrosio', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 7, 5, 0.7,
    2, 7, 28.6,
    1, 1, 100.0,
    0, 0, NULL,
    1, 2, 3, 0.4,
    1, 0.1,
    0, 0, 3,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Jayden Clark')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'j%clark'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%clark'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jayden Clark', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 5, 4, 0.8,
    2, 3, 66.7,
    0, 0, NULL,
    0, 0, NULL,
    0, 3, 3, 0.6,
    0, 0.0,
    0, 0, 1,
    '25', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 177 AND LOWER(name) = LOWER('Michael Chepyshev')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 177
      AND LOWER(name) LIKE 'm%chepyshev'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 177
      AND LOWER(p.name) LIKE '%chepyshev'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Michael Chepyshev', 177, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 177, 1, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '20', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Myles Moore')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'm%moore'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%moore'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Myles Moore', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 16, 237, 14.8,
    92, 192, 47.9,
    6, 28, 21.4,
    47, 76, 61.8,
    20, 69, 89, 5.6,
    32, 2.0,
    25, 9, 40,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Matthew Tollerson-Irby')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'm%tollerson-irby'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%tollerson-irby'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Matthew Tollerson-Irby', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 16, 158, 9.9,
    57, 120, 47.5,
    5, 19, 26.3,
    39, 51, 76.5,
    15, 65, 80, 5.0,
    63, 3.9,
    36, 6, 39,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Jasir Ross')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'j%ross'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%ross'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jasir Ross', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 16, 147, 9.2,
    50, 119, 42.0,
    26, 77, 33.8,
    21, 31, 67.7,
    3, 25, 28, 1.8,
    39, 2.4,
    19, 1, 36,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Dom Dorsey')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'd%dorsey'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%dorsey'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Dom Dorsey', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 16, 136, 8.5,
    47, 93, 50.5,
    28, 59, 47.5,
    14, 20, 70.0,
    12, 16, 28, 1.8,
    34, 2.1,
    20, 1, 26,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Justin Bobb')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'j%bobb'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%bobb'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Justin Bobb', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 15, 121, 8.1,
    44, 92, 47.8,
    3, 17, 17.6,
    30, 37, 81.1,
    26, 38, 64, 4.3,
    14, 0.9,
    3, 6, 23,
    '13', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Cole Zalewski')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'c%zalewski'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%zalewski'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Cole Zalewski', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 16, 106, 6.6,
    35, 99, 35.4,
    21, 72, 29.2,
    15, 19, 78.9,
    4, 54, 58, 3.6,
    30, 1.9,
    12, 16, 16,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Jared Velez')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'j%velez'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%velez'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jared Velez', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 16, 17, 1.1,
    5, 17, 29.4,
    4, 13, 30.8,
    3, 4, 75.0,
    5, 10, 15, 0.9,
    20, 1.3,
    9, 3, 4,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Tristan Laster')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 't%laster'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%laster'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Tristan Laster', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 12, 10, 0.8,
    4, 9, 44.4,
    0, 2, 0.0,
    2, 2, 100.0,
    1, 6, 7, 0.6,
    0, 0.0,
    3, 2, 6,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Ty Johnson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 't%johnson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%johnson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ty Johnson', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 1, 3, 3.0,
    1, 1, 100.0,
    1, 1, 100.0,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    1, 0, 0,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Chasten Gabriel')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'c%gabriel'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%gabriel'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Chasten Gabriel', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 5, 3, 0.6,
    1, 3, 33.3,
    1, 3, 33.3,
    0, 0, NULL,
    0, 2, 2, 0.4,
    0, 0.0,
    0, 0, 0,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Tyron Lewis')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 't%lewis'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%lewis'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Tyron Lewis', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 6, 2, 0.3,
    1, 3, 33.3,
    0, 0, NULL,
    0, 0, NULL,
    2, 7, 9, 1.5,
    2, 0.3,
    0, 4, 1,
    '34', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Wayne Graham')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'w%graham'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%graham'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Wayne Graham', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 4, 3, 0.8,
    1, 6, 16.7,
    1, 5, 20.0,
    0, 0, NULL,
    1, 0, 1, 0.3,
    0, 0.0,
    0, 0, 0,
    '30', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('Nelson Seda')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'n%seda'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%seda'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nelson Seda', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 3, 2, 0.7,
    1, 2, 50.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    2, 0.7,
    1, 0, 1,
    '21', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2780 AND LOWER(name) = LOWER('John Kurlyk')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2780
      AND LOWER(name) LIKE 'j%kurlyk'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2780
      AND LOWER(p.name) LIKE '%kurlyk'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('John Kurlyk', 2780, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2780, 1, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('DJ Jones')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'd%jones'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%jones'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('DJ Jones', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 50, 10.0,
    21, 49, 42.9,
    3, 17, 17.6,
    5, 7, 71.4,
    11, 24, 35, 7.0,
    6, 1.2,
    0, 3, 9,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Gabe Skehan')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'g%skehan'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%skehan'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Gabe Skehan', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 46, 9.2,
    17, 40, 42.5,
    8, 28, 28.6,
    4, 4, 100.0,
    2, 7, 9, 1.8,
    5, 1.0,
    12, 2, 8,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Toby Hartman')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 't%hartman'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%hartman'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Toby Hartman', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 40, 8.0,
    19, 28, 67.9,
    0, 3, 0.0,
    2, 3, 66.7,
    2, 14, 16, 3.2,
    4, 0.8,
    3, 2, 5,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Kaleb Hargrove')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'k%hargrove'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%hargrove'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kaleb Hargrove', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 39, 7.8,
    14, 38, 36.8,
    8, 23, 34.8,
    3, 5, 60.0,
    3, 10, 13, 2.6,
    16, 3.2,
    5, 2, 6,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Jack Quinn')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'j%quinn'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%quinn'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jack Quinn', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 37, 7.4,
    14, 34, 41.2,
    5, 15, 33.3,
    4, 6, 66.7,
    6, 10, 16, 3.2,
    25, 5.0,
    17, 2, 9,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Kahseem Bronzell')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'k%bronzell'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%bronzell'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kahseem Bronzell', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 16, 3.2,
    7, 22, 31.8,
    1, 9, 11.1,
    1, 2, 50.0,
    5, 3, 8, 1.6,
    15, 3.0,
    4, 0, 9,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Drew Baskerville')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'd%baskerville'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%baskerville'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Drew Baskerville', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 13, 2.6,
    4, 15, 26.7,
    4, 11, 36.4,
    1, 2, 50.0,
    1, 0, 1, 0.2,
    2, 0.4,
    0, 0, 1,
    '33', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Trent Baker')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 't%baker'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%baker'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Trent Baker', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 5, 12, 2.4,
    5, 15, 33.3,
    2, 10, 20.0,
    0, 0, NULL,
    2, 10, 12, 2.4,
    2, 0.4,
    3, 1, 1,
    '13', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Matt Smith')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'm%smith'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%smith'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Matt Smith', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 4, 8, 2.0,
    3, 4, 75.0,
    1, 1, 100.0,
    1, 2, 50.0,
    0, 1, 1, 0.3,
    2, 0.5,
    0, 0, 1,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Dylan Jones')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'd%jones'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%jones'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Dylan Jones', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 4, 4, 1.0,
    2, 4, 50.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 1, 1, 0.3,
    1, 0.3,
    1, 0, 1,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Joey Thompson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'j%thompson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%thompson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Joey Thompson', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 3, 2, 0.7,
    1, 2, 50.0,
    0, 1, 0.0,
    0, 1, 0.0,
    1, 0, 1, 0.3,
    0, 0.0,
    0, 0, 1,
    '25', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Nick Borelli')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'n%borelli'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%borelli'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nick Borelli', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 3, 2, 0.7,
    0, 0, NULL,
    0, 0, NULL,
    2, 2, 100.0,
    0, 0, 0, 0.0,
    1, 0.3,
    1, 0, 2,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 167 AND LOWER(name) = LOWER('Cam Fox')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 167
      AND LOWER(name) LIKE 'c%fox'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 167
      AND LOWER(p.name) LIKE '%fox'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Cam Fox', 167, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 167, 3, 2, 0.7,
    1, 3, 33.3,
    0, 0, NULL,
    0, 0, NULL,
    0, 1, 1, 0.3,
    0, 0.0,
    0, 0, 2,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Jaden Craft')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'j%craft'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%craft'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jaden Craft', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 23, 233, 10.1,
    66, 172, 38.4,
    32, 107, 29.9,
    69, 84, 82.1,
    22, 68, 90, 3.9,
    51, 2.2,
    42, 8, 43,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Cooper Fairlamb')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'c%fairlamb'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%fairlamb'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Cooper Fairlamb', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 22, 176, 8.0,
    68, 182, 37.4,
    10, 47, 21.3,
    30, 41, 73.2,
    10, 76, 86, 3.9,
    74, 3.4,
    24, 9, 59,
    '13', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('John Doogan')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'j%doogan'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%doogan'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('John Doogan', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 22, 153, 7.0,
    59, 130, 45.4,
    9, 38, 23.7,
    26, 45, 57.8,
    16, 48, 64, 2.9,
    17, 0.8,
    18, 10, 28,
    '21', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Owen Raymond')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'o%raymond'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%raymond'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Owen Raymond', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 23, 143, 6.2,
    55, 160, 34.4,
    16, 64, 25.0,
    17, 26, 65.4,
    18, 43, 61, 2.7,
    64, 2.8,
    38, 8, 66,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Braeden Fisher')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'b%fisher'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%fisher'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Braeden Fisher', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 22, 126, 5.7,
    53, 113, 46.9,
    5, 19, 26.3,
    15, 30, 50.0,
    24, 61, 85, 3.9,
    42, 1.8,
    36, 9, 46,
    '33', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Dillon Johnson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'd%johnson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%johnson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Dillon Johnson', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 23, 123, 5.3,
    43, 87, 49.4,
    27, 63, 42.9,
    10, 14, 71.4,
    14, 19, 33, 1.4,
    21, 0.9,
    19, 2, 16,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Saeed Garrett')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 's%garrett'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%garrett'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Saeed Garrett', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 21, 70, 3.3,
    22, 80, 27.5,
    12, 50, 24.0,
    14, 18, 77.8,
    4, 13, 17, 0.8,
    19, 0.9,
    8, 0, 12,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('James Kaune')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'j%kaune'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%kaune'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('James Kaune', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 19, 52, 2.7,
    20, 60, 33.3,
    5, 14, 35.7,
    7, 16, 43.8,
    18, 9, 27, 1.4,
    10, 0.5,
    10, 1, 7,
    '34', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Caleb Tesfaye')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'c%tesfaye'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%tesfaye'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Caleb Tesfaye', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 17, 46, 2.7,
    20, 47, 42.6,
    0, 9, 0.0,
    6, 8, 75.0,
    11, 14, 25, 1.5,
    4, 0.2,
    3, 6, 10,
    '20', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Jayden Allen-Bates')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'j%allen-bates'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%allen-bates'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jayden Allen-Bates', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 22, 50, 2.3,
    18, 45, 40.0,
    0, 7, 0.0,
    14, 25, 56.0,
    10, 16, 26, 1.2,
    7, 0.3,
    20, 2, 20,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Joseph McGuinn')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'j%mcguinn'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%mcguinn'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Joseph McGuinn', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 9, 23, 2.6,
    11, 19, 57.9,
    0, 3, 0.0,
    1, 2, 50.0,
    9, 9, 18, 2.0,
    5, 0.6,
    1, 1, 8,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Shawn Wheeler')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 's%wheeler'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%wheeler'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Shawn Wheeler', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 8, 3, 0.4,
    1, 5, 20.0,
    1, 3, 33.3,
    0, 0, NULL,
    0, 7, 7, 0.9,
    8, 1.0,
    1, 0, 2,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Luke Johnson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'l%johnson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%johnson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Luke Johnson', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 4, 16, 4.0,
    6, 9, 66.7,
    2, 3, 66.7,
    2, 2, 100.0,
    3, 2, 5, 1.3,
    1, 0.3,
    1, 2, 3,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Kaiden Brooks')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'k%brooks'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%brooks'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kaiden Brooks', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 1, 4, 4.0,
    2, 4, 50.0,
    0, 2, 0.0,
    0, 0, NULL,
    0, 1, 1, 1.0,
    2, 2.0,
    0, 0, 1,
    '55', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Cincere Mate')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'c%mate'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%mate'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Cincere Mate', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 1, 0, 0.0,
    0, 4, 0.0,
    0, 2, 0.0,
    0, 0, NULL,
    0, 1, 1, 1.0,
    0, 0.0,
    1, 0, 3,
    '41', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Brennan Wood')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'b%wood'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%wood'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Brennan Wood', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 1, 2, 2.0,
    0, 1, 0.0,
    0, 1, 0.0,
    2, 2, 100.0,
    0, 2, 2, 2.0,
    1, 1.0,
    3, 0, 1,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 138 AND LOWER(name) = LOWER('Jack Doyle')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 138
      AND LOWER(name) LIKE 'j%doyle'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 138
      AND LOWER(p.name) LIKE '%doyle'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jack Doyle', 138, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 138, 1, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 2,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Derrick Morton-Rivera')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'd%morton-rivera'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%morton-rivera'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Derrick Morton-Rivera', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 21, 319, 15.2,
    104, 248, 41.9,
    51, 137, 37.2,
    60, 68, 88.2,
    33, 55, 88, 4.2,
    33, 1.6,
    12, 7, 27,
    '44', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Nasir Tyler')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'n%tyler'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%tyler'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nasir Tyler', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 26, 281, 10.8,
    98, 237, 41.4,
    44, 130, 33.8,
    41, 54, 75.9,
    24, 81, 105, 4.0,
    48, 1.8,
    20, 11, 33,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Max Moshinski')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'm%moshinski'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%moshinski'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Max Moshinski', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 26, 273, 10.5,
    100, 203, 49.3,
    19, 60, 31.7,
    54, 96, 56.2,
    41, 97, 138, 5.3,
    87, 3.3,
    29, 20, 43,
    '24', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Rocco Westfield')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'r%westfield'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%westfield'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Rocco Westfield', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 26, 209, 8.0,
    72, 168, 42.9,
    43, 113, 38.1,
    22, 28, 78.6,
    21, 71, 92, 3.5,
    107, 4.1,
    37, 1, 37,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Jeremiah Adedeji')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'j%adedeji'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%adedeji'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jeremiah Adedeji', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 25, 186, 7.4,
    67, 138, 48.6,
    4, 16, 25.0,
    48, 79, 60.8,
    56, 89, 145, 5.8,
    16, 0.6,
    13, 34, 40,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Rezon Harris')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'r%harris'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%harris'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Rezon Harris', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 23, 119, 5.2,
    42, 116, 36.2,
    26, 84, 31.0,
    9, 12, 75.0,
    5, 53, 58, 2.5,
    23, 1.0,
    10, 9, 15,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Khory Copeland')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'k%copeland'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%copeland'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Khory Copeland', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 26, 112, 4.3,
    40, 88, 45.5,
    5, 24, 20.8,
    27, 41, 65.9,
    8, 43, 51, 2.0,
    49, 1.9,
    12, 2, 33,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Ahmir Brown')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'a%brown'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%brown'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ahmir Brown', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 24, 58, 2.4,
    20, 45, 44.4,
    3, 16, 18.8,
    15, 20, 75.0,
    22, 42, 64, 2.7,
    13, 0.5,
    9, 18, 19,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Rah’kiy Mason')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'r%mason'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%mason'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Rah’kiy Mason', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 22, 25, 1.1,
    10, 21, 47.6,
    0, 2, 0.0,
    5, 14, 35.7,
    3, 11, 14, 0.6,
    15, 0.7,
    16, 0, 18,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Nick Lilly')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'n%lilly'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%lilly'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nick Lilly', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 12, 12, 1.0,
    4, 10, 40.0,
    3, 7, 42.9,
    1, 4, 25.0,
    4, 4, 8, 0.7,
    0, 0.0,
    1, 0, 0,
    '21', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Jamal Hamidou')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'j%hamidou'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%hamidou'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jamal Hamidou', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 12, 10, 0.8,
    5, 10, 50.0,
    0, 0, NULL,
    0, 4, 0.0,
    5, 9, 14, 1.2,
    2, 0.2,
    4, 8, 4,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Uri Stanley')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'u%stanley'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%stanley'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Uri Stanley', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 10, 6, 0.6,
    2, 5, 40.0,
    0, 1, 0.0,
    2, 4, 50.0,
    1, 1, 2, 0.2,
    0, 0.0,
    0, 0, 2,
    '13', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Michael Chase')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'm%chase'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%chase'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Michael Chase', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 11, 5, 0.5,
    2, 9, 22.2,
    1, 3, 33.3,
    0, 0, NULL,
    2, 5, 7, 0.6,
    4, 0.4,
    5, 0, 3,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 147 AND LOWER(name) = LOWER('Nick Evans')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 147
      AND LOWER(name) LIKE 'n%evans'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 147
      AND LOWER(p.name) LIKE '%evans'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nick Evans', 147, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 147, 12, 5, 0.4,
    2, 9, 22.2,
    1, 7, 14.3,
    0, 0, NULL,
    2, 3, 5, 0.4,
    4, 0.3,
    3, 0, 3,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Chase Stevens')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'c%stevens'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%stevens'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Chase Stevens', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 23, 331, 14.4,
    104, 258, 40.3,
    23, 77, 29.9,
    100, 163, 61.3,
    44, 119, 163, 7.1,
    72, 3.1,
    37, 27, 75,
    '33', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Ayden Lewis')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'a%lewis'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%lewis'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ayden Lewis', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 20, 262, 13.1,
    99, 197, 50.3,
    10, 29, 34.5,
    54, 92, 58.7,
    28, 64, 92, 4.6,
    31, 1.6,
    25, 4, 47,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Brayden Martin')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'b%martin'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%martin'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Brayden Martin', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 22, 245, 11.1,
    86, 211, 40.8,
    37, 116, 31.9,
    36, 61, 59.0,
    28, 72, 100, 4.5,
    32, 1.5,
    16, 40, 31,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Eric Green')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'e%green'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%green'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Eric Green', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 22, 122, 5.5,
    43, 103, 41.7,
    2, 6, 33.3,
    34, 55, 61.8,
    13, 32, 45, 2.0,
    64, 2.9,
    28, 3, 36,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Yeboa Cobbold')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'y%cobbold'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%cobbold'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Yeboa Cobbold', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 23, 104, 4.5,
    31, 82, 37.8,
    4, 18, 22.2,
    18, 35, 51.4,
    26, 50, 76, 3.3,
    19, 0.8,
    29, 16, 20,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Danny Houck')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'd%houck'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%houck'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Danny Houck', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 15, 47, 3.1,
    17, 36, 47.2,
    6, 17, 35.3,
    7, 12, 58.3,
    9, 9, 18, 1.2,
    16, 1.1,
    10, 4, 11,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Tony Fitzgerald')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 't%fitzgerald'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%fitzgerald'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Tony Fitzgerald', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 22, 50, 2.3,
    19, 43, 44.2,
    8, 20, 40.0,
    4, 7, 57.1,
    11, 25, 36, 1.6,
    45, 2.0,
    21, 1, 32,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Matt Johnson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'm%johnson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%johnson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Matt Johnson', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 22, 61, 2.8,
    22, 75, 29.3,
    19, 72, 26.4,
    4, 7, 57.1,
    6, 10, 16, 0.7,
    13, 0.6,
    5, 4, 5,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Ben Holdsworth')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'b%holdsworth'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%holdsworth'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ben Holdsworth', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 23, 53, 2.3,
    20, 44, 45.5,
    3, 12, 25.0,
    10, 16, 62.5,
    15, 36, 51, 2.2,
    8, 0.3,
    12, 2, 14,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Carey Romero')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'c%romero'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%romero'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Carey Romero', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 11, 5, 0.5,
    2, 6, 33.3,
    1, 5, 20.0,
    0, 2, 0.0,
    2, 11, 13, 1.2,
    5, 0.5,
    2, 1, 4,
    '20', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Nick Cameron')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'n%cameron'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%cameron'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nick Cameron', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 6, 27, 4.5,
    10, 19, 52.6,
    7, 12, 58.3,
    0, 0, NULL,
    0, 6, 6, 1.0,
    2, 0.3,
    0, 0, 2,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Colton McKeogh')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'c%mckeogh'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%mckeogh'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Colton McKeogh', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 13, 4, 0.3,
    2, 6, 33.3,
    0, 1, 0.0,
    0, 0, NULL,
    9, 4, 13, 1.0,
    2, 0.2,
    0, 2, 3,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Ralph Wallace')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'r%wallace'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%wallace'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ralph Wallace', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 10, 6, 0.6,
    3, 7, 42.9,
    0, 2, 0.0,
    0, 0, NULL,
    2, 12, 14, 1.4,
    1, 0.1,
    0, 0, 4,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('Cortez Benfield')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 'c%benfield'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%benfield'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Cortez Benfield', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 7, 9, 1.3,
    3, 7, 42.9,
    2, 5, 40.0,
    1, 2, 50.0,
    0, 1, 1, 0.1,
    2, 0.3,
    1, 1, 4,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 971 AND LOWER(name) = LOWER('TJ Harrison')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 971
      AND LOWER(name) LIKE 't%harrison'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 971
      AND LOWER(p.name) LIKE '%harrison'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('TJ Harrison', 971, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 971, 3, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Tyler Branson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 't%branson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%branson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Tyler Branson', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 22, 308, 14.0,
    76, 229, 33.2,
    26, 90, 28.9,
    130, 173, 75.1,
    14, 59, 73, 3.3,
    116, 5.3,
    42, 3, 68,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Max Okebata')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'm%okebata'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%okebata'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Max Okebata', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 22, 279, 12.7,
    99, 222, 44.6,
    12, 55, 21.8,
    69, 136, 50.7,
    49, 102, 151, 6.9,
    47, 2.1,
    53, 13, 58,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Nick Neri')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'n%neri'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%neri'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nick Neri', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 18, 136, 7.6,
    50, 112, 44.6,
    2, 13, 15.4,
    34, 51, 66.7,
    49, 43, 92, 5.1,
    17, 0.9,
    13, 3, 32,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Pryce Alston')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'p%alston'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%alston'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Pryce Alston', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 22, 116, 5.3,
    42, 111, 37.8,
    1, 5, 20.0,
    31, 71, 43.7,
    36, 62, 98, 4.5,
    17, 0.7,
    11, 27, 40,
    '50', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Patrick Flaherty')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'p%flaherty'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%flaherty'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Patrick Flaherty', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 21, 104, 5.0,
    36, 84, 42.9,
    22, 53, 41.5,
    10, 14, 71.4,
    18, 32, 50, 2.4,
    17, 0.8,
    13, 2, 13,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Ryan Damon')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'r%damon'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%damon'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ryan Damon', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 22, 97, 4.4,
    42, 83, 50.6,
    4, 12, 33.3,
    9, 12, 75.0,
    23, 37, 60, 2.7,
    13, 0.6,
    16, 5, 25,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Mack O’Neill')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'm%o’neill'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%o’neill'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Mack O’Neill', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 7, 29, 4.1,
    12, 28, 42.9,
    3, 12, 25.0,
    2, 3, 66.7,
    6, 9, 15, 2.1,
    5, 0.7,
    1, 1, 7,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Jaxson Carroll')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'j%carroll'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%carroll'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jaxson Carroll', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 21, 72, 3.4,
    23, 60, 38.3,
    9, 31, 29.0,
    17, 19, 89.5,
    6, 39, 45, 2.1,
    17, 0.8,
    9, 4, 23,
    '33', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Jayden Carr')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'j%carr'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%carr'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jayden Carr', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 17, 40, 2.4,
    11, 49, 22.4,
    0, 12, 0.0,
    18, 25, 72.0,
    5, 15, 20, 1.2,
    9, 0.5,
    4, 1, 15,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Ryan Reing')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'r%reing'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%reing'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ryan Reing', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 22, 49, 2.2,
    17, 46, 37.0,
    11, 24, 45.8,
    4, 10, 40.0,
    13, 33, 46, 2.1,
    14, 0.6,
    11, 2, 15,
    '20', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Nate Walsh')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'n%walsh'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%walsh'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nate Walsh', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 5, 10, 2.0,
    4, 6, 66.7,
    2, 4, 50.0,
    0, 0, NULL,
    0, 2, 2, 0.4,
    1, 0.2,
    2, 0, 0,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Rex Helstrom')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'r%helstrom'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%helstrom'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Rex Helstrom', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 7, 10, 1.4,
    3, 7, 42.9,
    2, 5, 40.0,
    2, 2, 100.0,
    1, 2, 3, 0.4,
    1, 0.1,
    2, 0, 5,
    '25', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 2882 AND LOWER(name) = LOWER('Jack McCabe')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 2882
      AND LOWER(name) LIKE 'j%mccabe'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 2882
      AND LOWER(p.name) LIKE '%mccabe'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jack McCabe', 2882, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 2882, 17, 10, 0.6,
    4, 6, 66.7,
    2, 3, 66.7,
    0, 0, NULL,
    0, 0, 0, 0.0,
    4, 0.2,
    2, 0, 2,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Allassane N’Diaye')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'a%n’diaye'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%n’diaye'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Allassane N’Diaye', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 25, 377, 15.1,
    155, 301, 51.5,
    17, 56, 30.4,
    50, 89, 56.2,
    105, 87, 192, 7.7,
    28, 1.1,
    30, 32, 25,
    '21', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Deshawn Yates')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'd%yates'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%yates'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Deshawn Yates', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 25, 333, 13.3,
    120, 215, 55.8,
    18, 46, 39.1,
    75, 96, 78.1,
    21, 95, 116, 4.6,
    142, 5.7,
    70, 8, 37,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Marquis Newson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'm%newson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%newson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Marquis Newson', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 24, 316, 13.2,
    125, 253, 49.4,
    15, 56, 26.8,
    51, 69, 73.9,
    32, 136, 168, 7.0,
    67, 2.8,
    28, 47, 44,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Kody Colson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'k%colson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%colson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kody Colson', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 25, 320, 12.8,
    107, 255, 42.0,
    62, 172, 36.0,
    37, 50, 74.0,
    1, 56, 57, 2.3,
    68, 2.7,
    20, 1, 42,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Stephan Ashley-Wright')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 's%ashley-wright'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%ashley-wright'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Stephan Ashley-Wright', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 15, 124, 8.3,
    47, 120, 39.2,
    12, 42, 28.6,
    18, 27, 66.7,
    9, 39, 48, 3.2,
    41, 2.7,
    30, 0, 29,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Ernest Stanton')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'e%stanton'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%stanton'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ernest Stanton', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 25, 193, 7.7,
    72, 168, 42.9,
    32, 97, 33.0,
    17, 25, 68.0,
    12, 35, 47, 1.8,
    58, 2.3,
    23, 8, 14,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('London Collins')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'l%collins'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%collins'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('London Collins', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 24, 138, 5.8,
    46, 116, 39.7,
    14, 44, 31.8,
    32, 44, 72.7,
    23, 21, 44, 1.8,
    10, 0.4,
    15, 9, 7,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Oscar Briskin')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'o%briskin'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%briskin'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Oscar Briskin', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 9, 3, 0.3,
    1, 7, 14.3,
    1, 6, 16.7,
    0, 0, NULL,
    1, 3, 4, 0.4,
    0, 0.0,
    0, 1, 1,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Jayden Williams')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'j%williams'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%williams'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jayden Williams', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 15, 5, 0.3,
    2, 10, 20.0,
    1, 5, 20.0,
    0, 0, NULL,
    0, 1, 1, 0.1,
    2, 0.1,
    4, 2, 0,
    '55', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Oreace Torrance')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'o%torrance'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%torrance'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Oreace Torrance', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 10, 4, 0.4,
    2, 8, 25.0,
    0, 2, 0.0,
    0, 0, NULL,
    3, 1, 4, 0.4,
    2, 0.2,
    4, 0, 1,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Ethan Vest')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'e%vest'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%vest'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ethan Vest', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 7, 2, 0.3,
    0, 1, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    1, 1, 2, 0.3,
    0, 0.0,
    0, 0, 1,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Ethan Tran')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'e%tran'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%tran'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Ethan Tran', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 8, 0, 0.0,
    0, 4, 0.0,
    0, 2, 0.0,
    2, 2, 100.0,
    2, 1, 3, 0.4,
    1, 0.1,
    1, 0, 1,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Zion Ricks')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'z%ricks'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%ricks'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Zion Ricks', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 1, 0, 0.0,
    0, 1, 0.0,
    0, 1, 0.0,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 1,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 198 AND LOWER(name) = LOWER('Amar’e White')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 198
      AND LOWER(name) LIKE 'a%white'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 198
      AND LOWER(p.name) LIKE '%white'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Amar’e White', 198, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 198, 2, 0, 0.0,
    0, 1, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Sammy Jackson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 's%jackson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%jackson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Sammy Jackson', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 5, 91, 18.2,
    35, 76, 46.1,
    12, 31, 38.7,
    9, 12, 75.0,
    7, 24, 31, 6.2,
    21, 4.2,
    7, 8, 8,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Bryce Pressley')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'b%pressley'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%pressley'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Bryce Pressley', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 5, 43, 8.6,
    18, 42, 42.9,
    1, 4, 25.0,
    6, 9, 66.7,
    13, 7, 20, 4.0,
    4, 0.8,
    1, 2, 8,
    '24', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Dwayne Ruffin')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'd%ruffin'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%ruffin'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Dwayne Ruffin', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 4, 32, 8.0,
    13, 32, 40.6,
    5, 11, 45.5,
    1, 2, 50.0,
    3, 9, 12, 3.0,
    16, 4.0,
    6, 0, 4,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Bradley Wanamaker')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'b%wanamaker'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%wanamaker'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Bradley Wanamaker', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 5, 36, 7.2,
    11, 22, 50.0,
    4, 13, 30.8,
    10, 15, 66.7,
    8, 18, 26, 5.2,
    11, 2.2,
    6, 2, 5,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Semaj Robinson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 's%robinson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%robinson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Semaj Robinson', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 5, 23, 4.6,
    8, 24, 33.3,
    6, 19, 31.6,
    1, 2, 50.0,
    0, 4, 4, 0.8,
    10, 2.0,
    10, 0, 1,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Aljalil Bey-Moore')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'a%bey-moore'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%bey-moore'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Aljalil Bey-Moore', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 5, 22, 4.4,
    10, 25, 40.0,
    0, 0, NULL,
    2, 9, 22.2,
    11, 7, 18, 3.6,
    4, 0.8,
    1, 1, 6,
    '35', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Tre Scipio')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 't%scipio'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%scipio'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Tre Scipio', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 3, 7, 2.3,
    3, 5, 60.0,
    1, 2, 50.0,
    0, 0, NULL,
    1, 3, 4, 1.3,
    1, 0.3,
    1, 0, 2,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Adrian Alberto')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'a%alberto'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%alberto'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Adrian Alberto', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 2, 6, 3.0,
    3, 3, 100.0,
    0, 0, NULL,
    0, 0, NULL,
    1, 0, 1, 0.5,
    0, 0.0,
    0, 0, 1,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Pat Destephanis')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'p%destephanis'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%destephanis'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Pat Destephanis', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 2, 2, 1.0,
    0, 1, 0.0,
    0, 1, 0.0,
    2, 2, 100.0,
    1, 2, 3, 1.5,
    0, 0.0,
    0, 0, 0,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Gabe Medley')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'g%medley'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%medley'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Gabe Medley', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 2, 0, 0.0,
    0, 1, 0.0,
    0, 1, 0.0,
    0, 0, NULL,
    1, 0, 1, 0.5,
    1, 0.5,
    0, 0, 2,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 127 AND LOWER(name) = LOWER('Chris Cook')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 127
      AND LOWER(name) LIKE 'c%cook'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 127
      AND LOWER(p.name) LIKE '%cook'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Chris Cook', 127, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 127, 2, 0, 0.0,
    0, 1, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    1, 0, 1, 0.5,
    0, 0.0,
    0, 0, 1,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Julian McKie')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'j%mckie'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%mckie'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Julian McKie', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 20, 303, 15.2,
    113, 222, 50.9,
    24, 67, 35.8,
    53, 64, 82.8,
    37, 107, 144, 7.2,
    27, 1.4,
    36, 28, 34,
    '2', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Will Lesovitz')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'w%lesovitz'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%lesovitz'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Will Lesovitz', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 22, 271, 12.3,
    93, 242, 38.4,
    33, 122, 27.0,
    52, 75, 69.3,
    22, 87, 109, 5.0,
    63, 2.9,
    15, 7, 46,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Justin McKie')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'j%mckie'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%mckie'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Justin McKie', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 22, 184, 8.4,
    65, 163, 39.9,
    27, 80, 33.8,
    27, 37, 73.0,
    12, 61, 73, 3.3,
    53, 2.4,
    16, 11, 60,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Myles Peterson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'm%peterson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%peterson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Myles Peterson', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 22, 142, 6.5,
    57, 111, 51.4,
    5, 36, 13.9,
    23, 32, 71.9,
    20, 66, 86, 3.9,
    35, 1.6,
    9, 9, 37,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Jayden Howlett')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'j%howlett'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%howlett'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jayden Howlett', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 22, 110, 5.0,
    40, 82, 48.8,
    6, 17, 35.3,
    24, 29, 82.8,
    25, 44, 69, 3.1,
    38, 1.7,
    29, 4, 31,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Luke Maransky')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'l%maransky'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%maransky'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Luke Maransky', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 22, 81, 3.7,
    25, 92, 27.2,
    20, 71, 28.2,
    11, 14, 78.6,
    7, 30, 37, 1.7,
    50, 2.3,
    9, 1, 37,
    '0', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Alonzo Ellis')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'a%ellis'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%ellis'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Alonzo Ellis', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 20, 29, 1.5,
    12, 24, 50.0,
    1, 7, 14.3,
    4, 7, 57.1,
    5, 12, 17, 0.9,
    8, 0.4,
    5, 4, 13,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Julien O’Hanlon')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'j%o’hanlon'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%o’hanlon'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Julien O’Hanlon', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 4, 6, 1.5,
    2, 5, 40.0,
    2, 3, 66.7,
    0, 0, NULL,
    3, 4, 7, 1.8,
    1, 0.3,
    0, 2, 2,
    '35', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Collin Hartz')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'c%hartz'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%hartz'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Collin Hartz', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 7, 9, 1.3,
    3, 7, 42.9,
    3, 7, 42.9,
    0, 0, NULL,
    1, 1, 2, 0.3,
    1, 0.1,
    0, 0, 1,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Atlee Harvey')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'a%harvey'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%harvey'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Atlee Harvey', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 7, 9, 1.3,
    4, 8, 50.0,
    1, 1, 100.0,
    0, 0, NULL,
    3, 2, 5, 0.7,
    2, 0.3,
    0, 0, 3,
    '24', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Robby Andrews')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'r%andrews'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%andrews'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Robby Andrews', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 9, 8, 0.9,
    3, 9, 33.3,
    2, 6, 33.3,
    0, 0, NULL,
    1, 1, 2, 0.2,
    1, 0.1,
    1, 0, 6,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Kevin O’Connell')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'k%o’connell'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%o’connell'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kevin O’Connell', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 8, 0, 0.0,
    0, 3, 0.0,
    0, 2, 0.0,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 1, 1,
    '5', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Gabe Pennington')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'g%pennington'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%pennington'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Gabe Pennington', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 2, 4, 1.0,
    1, 1, 100.0,
    1, 1, 100.0,
    1, 2, 50.0,
    0, 0, 0, 0.0,
    2, 1.0,
    0, 0, 0,
    '13', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Amir Worrell')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'a%worrell'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%worrell'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Amir Worrell', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 2, 3, 1.5,
    1, 2, 50.0,
    0, 1, 0.0,
    1, 1, 100.0,
    0, 1, 1, 0.5,
    0, 0.0,
    0, 0, 0,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Nate Finn')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 'n%finn'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%finn'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nate Finn', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 2, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 4, 4, 2.0,
    2, 1.0,
    0, 1, 1,
    '45', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 1005 AND LOWER(name) = LOWER('Theron Morris')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 1005
      AND LOWER(name) LIKE 't%morris'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 1005
      AND LOWER(p.name) LIKE '%morris'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Theron Morris', 1005, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 1005, 4, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 2, 2, 0.5,
    2, 0.5,
    0, 0, 1,
    '21', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Kingston Wheatley')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'k%wheatley'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%wheatley'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kingston Wheatley', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 20, 327, 16.4,
    119, 233, 51.1,
    9, 46, 19.6,
    80, 118, 67.8,
    45, 78, 123, 6.2,
    36, 1.8,
    22, 38, 54,
    '22', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Yasai Rozier')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'y%rozier'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%rozier'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Yasai Rozier', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 23, 225, 9.8,
    101, 162, 62.3,
    3, 12, 25.0,
    20, 33, 60.6,
    88, 103, 191, 8.3,
    47, 2.0,
    42, 17, 29,
    '10', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Jayden Ortiz-Muhammad')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'j%ortiz-muhammad'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%ortiz-muhammad'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Jayden Ortiz-Muhammad', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 23, 198, 8.6,
    73, 210, 34.8,
    32, 93, 34.4,
    23, 33, 69.7,
    11, 32, 43, 1.9,
    67, 2.9,
    13, 3, 65,
    '11', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Nyiere Farlow')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'n%farlow'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%farlow'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Nyiere Farlow', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 23, 172, 7.5,
    64, 165, 38.8,
    29, 97, 29.9,
    15, 20, 75.0,
    23, 54, 77, 3.3,
    48, 2.1,
    44, 24, 33,
    '24', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Eric Scott')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'e%scott'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%scott'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Eric Scott', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 13, 90, 6.9,
    28, 105, 26.7,
    9, 49, 18.4,
    25, 30, 83.3,
    8, 17, 25, 1.9,
    47, 3.6,
    15, 1, 42,
    '3', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Rakim Johnson')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'r%johnson'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%johnson'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Rakim Johnson', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 22, 146, 6.6,
    53, 124, 42.7,
    7, 17, 41.2,
    33, 55, 60.0,
    13, 64, 77, 3.5,
    70, 3.2,
    31, 5, 52,
    '1', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Xavier Fauntroy')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'x%fauntroy'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%fauntroy'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Xavier Fauntroy', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 23, 105, 4.6,
    38, 124, 30.6,
    21, 83, 25.3,
    8, 15, 53.3,
    13, 37, 50, 2.2,
    16, 0.7,
    15, 4, 19,
    '4', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Mekhi Graves')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'm%graves'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%graves'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Mekhi Graves', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 16, 27, 1.7,
    9, 22, 40.9,
    0, 0, NULL,
    9, 18, 50.0,
    19, 17, 36, 2.3,
    5, 0.3,
    9, 4, 8,
    '14', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Rahmir Speaks')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'r%speaks'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%speaks'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Rahmir Speaks', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 4, 6, 1.5,
    2, 7, 28.6,
    1, 5, 20.0,
    1, 2, 50.0,
    0, 3, 3, 0.8,
    0, 0.0,
    1, 0, 2,
    '23', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Schleyer Smith')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 's%smith'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%smith'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Schleyer Smith', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 7, 10, 1.4,
    4, 6, 66.7,
    1, 3, 33.3,
    1, 2, 50.0,
    0, 0, 0, 0.0,
    1, 0.1,
    1, 0, 1,
    '12', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Anthony Gordon')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'a%gordon'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%gordon'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Anthony Gordon', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 7, 7, 1.0,
    1, 3, 33.3,
    1, 1, 100.0,
    4, 4, 100.0,
    0, 1, 1, 0.1,
    3, 0.4,
    4, 0, 1,
    '15', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Shane Wright')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 's%wright'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%wright'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Shane Wright', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 6, 3, 0.5,
    1, 5, 20.0,
    1, 4, 25.0,
    0, 2, 0.0,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 1,
    '21', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;

DO $$
DECLARE
  v_pid INTEGER;
BEGIN
  -- Try exact name match on school
  SELECT id INTO v_pid FROM players
  WHERE primary_school_id = 171 AND LOWER(name) = LOWER('Kayden Brooks-Silver')
  LIMIT 1;

  -- Try abbreviated name match (e.g., "M. Hughes" matches "Malik Hughes")
  IF v_pid IS NULL THEN
    SELECT id INTO v_pid FROM players
    WHERE primary_school_id = 171
      AND LOWER(name) LIKE 'k%brooks-silver'
    LIMIT 1;
  END IF;

  -- Try last name + school match with existing season stats
  IF v_pid IS NULL THEN
    SELECT p.id INTO v_pid FROM players p
    JOIN basketball_player_seasons bps ON bps.player_id = p.id AND bps.season_id = 76
    WHERE p.primary_school_id = 171
      AND LOWER(p.name) LIKE '%brooks-silver'
    LIMIT 1;
  END IF;

  -- Create new player if not found
  IF v_pid IS NULL THEN
    INSERT INTO players (name, primary_school_id, graduation_year, region_id, created_at)
    VALUES ('Kayden Brooks-Silver', 171, 2026, 'philly', NOW())
    RETURNING id INTO v_pid;
  END IF;

  -- Upsert season stats
  INSERT INTO basketball_player_seasons (
    player_id, season_id, school_id, games_played, points, ppg,
    fgm, fga, fg_pct, three_pm, three_pa, three_pct,
    ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
    assists, apg, steals, blocks, turnovers,
    jersey_number, source_file, created_at
  ) VALUES (
    v_pid, 76, 171, 1, 0, 0.0,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, NULL,
    0, 0, 0, 0.0,
    0, 0.0,
    0, 0, 0,
    '13', 'pcl_team_stats_2025_26', NOW()
  )
  ON CONFLICT (player_id, season_id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    games_played = EXCLUDED.games_played,
    points = EXCLUDED.points,
    ppg = EXCLUDED.ppg,
    fgm = EXCLUDED.fgm,
    fga = EXCLUDED.fga,
    fg_pct = EXCLUDED.fg_pct,
    three_pm = EXCLUDED.three_pm,
    three_pa = EXCLUDED.three_pa,
    three_pct = EXCLUDED.three_pct,
    ftm = EXCLUDED.ftm,
    fta = EXCLUDED.fta,
    ft_pct = EXCLUDED.ft_pct,
    off_rebounds = EXCLUDED.off_rebounds,
    def_rebounds = EXCLUDED.def_rebounds,
    rebounds = EXCLUDED.rebounds,
    rpg = EXCLUDED.rpg,
    assists = EXCLUDED.assists,
    apg = EXCLUDED.apg,
    steals = EXCLUDED.steals,
    blocks = EXCLUDED.blocks,
    turnovers = EXCLUDED.turnovers,
    jersey_number = EXCLUDED.jersey_number,
    source_file = EXCLUDED.source_file,
    updated_at = NOW();
END $$;