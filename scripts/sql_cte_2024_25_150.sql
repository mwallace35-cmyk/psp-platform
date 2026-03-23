
WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Kody Colson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'k%colson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Kody Colson','kody-colson-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,26,326,12.5,113,295,38.3,71,193,36.8,29,36,80.6,4,48,52,2.0,64,2.5,22,1,38,'3','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Keon Long-Mtume') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'k%long-mtume' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Keon Long-Mtume','keon-long-mtume-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,29,359,12.4,136,282,48.2,41,117,35.0,46,63,73.0,44,93,137,4.7,44,1.5,61,20,38,'4','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Cain Van Noden') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'c%noden' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Cain Van Noden','cain-van-noden-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,26,70,2.7,30,60,50.0,0,0,NULL,10,29,34.5,39,34,73,2.8,13,0.5,6,15,16,'34','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Ennest Stanton') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'e%stanton' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Ennest Stanton','ennest-stanton-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,29,89,3.1,32,80,40.0,20,53,37.7,5,10,50.0,7,10,17,0.6,37,1.3,14,2,16,'5','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Jayden Williams') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'j%williams' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jayden Williams','jayden-williams-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,24,20,0.8,7,27,25.9,5,22,22.7,1,4,25.0,5,6,11,0.5,4,0.2,6,2,1,'55','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Rashawn Kim') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'r%kim' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Rashawn Kim','rashawn-kim-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,10,5,0.5,1,4,25.0,0,1,0.0,3,3,100.0,1,4,5,0.5,1,0.1,1,0,2,'10','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('DonJuan Clark') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'd%clark' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'DonJuan Clark','donjuan-clark-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,9,8,0.9,3,8,37.5,1,2,50.0,0,0,NULL,1,2,3,0.3,1,0.1,1,1,1,'32','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Cassius Law') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'c%law' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Cassius Law','cassius-law-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,9,5,0.6,2,6,33.3,1,3,33.3,0,0,NULL,0,5,5,0.6,0,0.0,0,0,3,'11','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Eric Green') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'e%green' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Eric Green','eric-green-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,5,8,1.6,1,4,25.0,0,0,NULL,6,6,100.0,0,0,0,0.0,1,0.2,2,0,1,'23','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Ethan Tran') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'e%tran' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Ethan Tran','ethan-tran-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,4,0,0.0,0,0,NULL,0,0,NULL,0,2,0.0,1,0,1,0.3,2,0.5,0,1,0,'22','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Oreace Torrence') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'o%torrence' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Oreace Torrence','oreace-torrence-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,6,0,0.0,0,2,0.0,0,0,NULL,0,0,NULL,0,0,0,0.0,2,0.3,1,0,1,'12','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name)=LOWER('Ayden Lewis') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=198 AND LOWER(name) LIKE 'a%lewis' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Ayden Lewis','ayden-lewis-2025-ng',198,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,198,1,0,0.0,0,0,NULL,0,0,NULL,0,0,NULL,1,0,1,1.0,0,0.0,0,0,2,'14','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Tyler Sutton') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 't%sutton' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Tyler Sutton','tyler-sutton-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,31,442,14.3,160,367,43.6,44,138,31.9,78,106,73.6,31,74,105,3.4,122,3.9,83,10,85,'3','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Shareef Jackson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%jackson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Shareef Jackson','shareef-jackson-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,31,437,14.1,169,323,52.3,10,35,28.6,89,132,67.4,102,245,347,11.2,115,3.7,50,29,71,'44','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Sammy Jackson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%jackson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Sammy Jackson','sammy-jackson-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,27,361,13.4,127,305,41.6,51,163,31.3,56,74,75.7,24,108,132,4.9,86,3.2,33,21,36,'1','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Sebastian Edwards') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%edwards' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Sebastian Edwards','sebastian-edwards-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,29,298,10.3,109,251,43.4,43,127,33.9,37,43,86.0,31,57,88,3.0,68,2.3,47,12,47,'4','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('CJ Miller') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'c%miller' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'CJ Miller','cj-miller-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,31,197,6.4,80,145,55.2,10,27,37.0,27,47,57.4,61,58,119,3.8,33,1.1,23,20,34,'14','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Elijah Guer') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'e%guer' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Elijah Guer','elijah-guer-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,10,59,5.9,26,62,41.9,3,15,20.0,4,6,66.7,9,10,19,1.9,7,0.7,4,3,10,'2','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Wayne Ruffin') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'w%ruffin' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Wayne Ruffin','wayne-ruffin-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,28,68,2.4,29,60,48.3,1,8,12.5,9,19,47.4,24,24,48,1.7,43,1.5,31,1,11,'0','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Semaj Robinson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 's%robinson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Semaj Robinson','semaj-robinson-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,30,70,2.3,25,63,39.7,14,36,38.9,6,11,54.5,2,23,25,0.8,31,1.0,18,2,17,'5','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Judah Sterling') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'j%sterling' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Judah Sterling','judah-sterling-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,16,13,0.8,4,13,30.8,1,2,50.0,4,6,66.7,4,6,10,0.6,1,0.1,1,1,6,'15','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Doo Carr') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'd%carr' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Doo Carr','doo-carr-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,14,9,0.6,3,9,33.3,3,9,33.3,0,0,NULL,0,2,2,0.1,4,0.3,3,0,5,'10','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Brad Wannamaker') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 'b%wannamaker' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Brad Wannamaker','brad-wannamaker-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,15,8,0.5,3,11,27.3,0,6,0.0,2,5,40.0,0,8,8,0.5,2,0.1,2,1,5,'24','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name)=LOWER('Tre Scipio') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=127 AND LOWER(name) LIKE 't%scipio' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Tre Scipio','tre-scipio-2025-rc',127,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,127,3,3,1.0,1,1,100.0,0,0,NULL,1,1,100.0,0,0,0,0.0,0,0.0,0,0,0,'20','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Jordan Ellerbee') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'j%ellerbee' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jordan Ellerbee','jordan-ellerbee-2025-sjp',1005,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,1005,23,390,17.0,142,332,42.8,32,119,26.9,74,88,84.1,52,101,153,6.7,125,5.4,39,12,63,'2','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Jaron McKie') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'j%mckie' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jaron McKie','jaron-mckie-2025-sjp',1005,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,1005,23,346,15.0,119,242,49.2,67,141,47.5,41,47,87.2,8,91,99,4.3,51,2.2,32,12,20,'1','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Mehki Robertson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'm%robertson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Mehki Robertson','mehki-robertson-2025-sjp',1005,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,1005,23,233,10.1,95,203,46.8,19,62,30.6,24,47,51.1,25,83,108,4.7,60,2.6,28,25,44,'11','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Olin Chamberlain') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'o%chamberlain' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Olin Chamberlain','olin-chamberlain-2025-sjp',1005,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,1005,23,230,10.0,79,176,44.9,36,101,35.6,36,45,80.0,13,42,55,2.4,69,3.0,15,2,20,'0','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Will Lesovitz') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'w%lesovitz' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Will Lesovitz','will-lesovitz-2025-sjp',1005,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,1005,19,176,9.3,61,120,50.8,22,52,42.3,32,41,78.0,22,58,80,4.2,29,1.5,26,10,15,'23','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name)=LOWER('Julian McKie') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=1005 AND LOWER(name) LIKE 'j%mckie' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Julian McKie','julian-mckie-2025-sjp',1005,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,1005,23,91,4.0,36,76,47.4,9,26,34.6,10,20,50.0,45,62,107,4.7,15,0.7,9,23,10,'10','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();