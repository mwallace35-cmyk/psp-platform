
WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Matthew Guokas') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'm%guokas' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matthew Guokas','matthew-guokas-2024-ng',198,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,198,26,40,1.5,14,50,28.0,10,42,23.8,2,2,100.0,5,42,47,1.8,14,0.5,9,7,6,'14','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Oscar Briskin') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'o%briskin' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Oscar Briskin','oscar-briskin-2024-ng',198,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,198,16,18,1.1,6,15,40.0,5,13,38.5,1,2,50.0,0,1,1,0.1,2,0.1,4,0,2,'12','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('D.J. Clark') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'd%clark' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'D.J. Clark','dj-clark-2024-ng',198,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,198,14,7,0.5,3,10,30.0,0,2,0.0,1,2,50.0,6,10,16,1.1,0,0.0,0,2,0,'32','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Ethan Tran') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'e%tran' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Ethan Tran','ethan-tran-2024-ng',198,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,198,12,2,0.2,0,1,0.0,0,1,0.0,2,2,100.0,1,1,2,0.2,1,0.1,0,0,2,'22','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Jayden Williams') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'j%williams' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jayden Williams','jayden-williams-2024-ng',198,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,198,15,1,0.1,0,4,0.0,0,4,0.0,1,4,25.0,2,2,4,0.3,2,0.1,2,2,2,'55','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Orece Torrence') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'o%torrence' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Orece Torrence','orece-torrence-2024-ng',198,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,198,11,4,0.4,1,5,20.0,1,2,50.0,1,4,25.0,1,1,2,0.2,1,0.1,0,0,1,'15','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Rashawn Kim') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'r%kim' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Rashawn Kim','rashawn-kim-2024-ng',198,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,198,4,2,0.5,1,3,33.3,0,2,0.0,0,0,NULL,1,2,3,0.8,0,0.0,0,0,0,'22','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Shareef Jackson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%jackson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Shareef Jackson','shareef-jackson-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,23,396,17.2,156,268,58.2,9,26,34.6,75,118,63.6,62,170,232,10.1,68,3.0,36,33,53,'44','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Travis Reed') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 't%reed' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Travis Reed','travis-reed-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,25,251,10.0,89,205,43.4,39,125,31.2,34,43,79.1,31,54,85,3.4,45,1.8,31,6,37,'0','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Sebastian Edwards') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%edwards' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Sebastian Edwards','sebastian-edwards-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,27,221,8.2,87,171,50.9,34,91,37.4,13,21,61.9,19,37,56,2.1,81,3.0,36,12,43,'4','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Hunter Johnson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'h%johnson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Hunter Johnson','hunter-johnson-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,29,234,8.1,88,193,45.6,26,91,28.6,32,43,74.4,39,82,121,4.2,92,3.2,35,6,34,'5','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Robert Cottrell') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'r%cottrell' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Robert Cottrell','robert-cottrell-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,29,233,8.0,86,190,45.3,25,83,30.1,36,44,81.8,11,37,48,1.7,78,2.7,52,6,31,'3','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Kabe Goss') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'k%goss' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Kabe Goss','kabe-goss-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,13,82,6.3,30,70,42.9,18,44,40.9,4,4,100.0,8,16,24,1.8,51,3.9,18,0,22,'2','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Sammy Jackson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%jackson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Sammy Jackson','sammy-jackson-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,29,211,7.3,82,199,41.2,38,116,32.8,10,20,50.0,42,104,146,5.0,88,3.0,31,20,29,'30','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('CJ Miller') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'c%miller' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'CJ Miller','cj-miller-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,23,68,3.0,27,52,51.9,4,10,40.0,10,19,52.6,27,25,52,2.3,17,0.7,9,8,18,'15','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Malik Hughes') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'm%hughes' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Malik Hughes','malik-hughes-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,25,60,2.4,23,57,40.4,2,6,33.3,12,22,54.5,9,30,39,1.6,15,0.6,3,6,16,'24','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Semaj Robinson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%robinson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Semaj Robinson','semaj-robinson-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,20,13,0.7,5,16,31.2,3,9,33.3,0,3,0.0,3,8,11,0.6,16,0.8,6,0,9,'1','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Derek Carr') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'd%carr' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Derek Carr','derek-carr-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,14,5,0.4,2,3,66.7,1,1,100.0,0,0,NULL,1,3,4,0.3,3,0.2,4,0,4,'10','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Robert Spruill') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'r%spruill' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Robert Spruill','robert-spruill-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,14,7,0.5,3,6,50.0,1,2,50.0,0,0,NULL,1,5,6,0.4,3,0.2,0,0,1,'35','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Mehki Martin') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'm%martin' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Mehki Martin','mehki-martin-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,11,5,0.5,1,4,25.0,0,1,0.0,3,5,60.0,3,2,5,0.5,0,0.0,1,1,0,'32','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Justin Ezeukwu') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'j%ezeukwu' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Justin Ezeukwu','justin-ezeukwu-2024-rc',127,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,127,5,0,0.0,0,4,0.0,0,4,0.0,0,0,NULL,0,1,1,0.2,0,0.0,0,0,1,'14','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Jaron McKie') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'j%mckie' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jaron McKie','jaron-mckie-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,23,417,18.1,140,290,48.3,63,151,41.7,74,87,85.1,19,120,139,6.0,53,2.3,38,19,38,'1','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Jordan Ellerbee') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'j%ellerbee' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jordan Ellerbee','jordan-ellerbee-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,23,337,14.7,125,282,44.3,42,120,35.0,45,67,67.2,28,113,141,6.1,103,4.5,42,11,55,'2','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Olin Chamberlain') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'o%chamberlain' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Olin Chamberlain','olin-chamberlain-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,23,281,12.2,94,195,48.2,51,116,44.0,42,49,85.7,7,37,44,1.9,71,3.1,23,2,27,'0','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Jalen Harper') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'j%harper' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jalen Harper','jalen-harper-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,23,262,11.4,107,200,53.5,14,38,36.8,34,60,56.7,38,108,146,6.3,82,3.6,28,24,51,'3','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Matt Gorman') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'm%gorman' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matt Gorman','matt-gorman-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,19,135,7.1,53,118,44.9,16,62,25.8,13,16,81.2,12,30,42,2.2,29,1.5,17,8,26,'10','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Will Lesovitz') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'w%lesovitz' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Will Lesovitz','will-lesovitz-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,23,89,3.9,34,87,39.1,11,41,26.8,10,26,38.5,21,32,53,2.3,21,0.9,17,1,16,'23','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Jackson Maguire') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'j%maguire' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jackson Maguire','jackson-maguire-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,22,41,1.9,17,34,50.0,2,6,33.3,5,6,83.3,14,39,53,2.4,23,1.0,12,13,14,'13','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Gavin Pennington') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'g%pennington' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Gavin Pennington','gavin-pennington-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,8,10,1.3,4,7,57.1,2,5,40.0,0,0,NULL,0,0,0,0.0,4,0.5,0,0,3,'4','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('KJ Towns') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'k%towns' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'KJ Towns','kj-towns-2024-sjp',1005,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,1005,4,10,2.5,3,6,50.0,1,2,50.0,3,4,75.0,2,7,9,2.3,1,0.3,0,3,2,'22','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();