
WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Pearse McGuinn') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'p%mcguinn' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Pearse McGuinn','pearse-mcguinn-2021-co',167,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,167,13,37,2.8,12,36,33.3,8,24,33.3,5,5,100.0,4,14,18,1.4,4,0.3,1,4,0,'35','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Trey Roberts') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 't%roberts' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Trey Roberts','trey-roberts-2021-co',167,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,167,13,35,2.7,13,30,43.3,0,6,0.0,9,15,60.0,26,24,50,3.8,17,1.3,13,4,0,'3','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Josh Sharkey') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'j%sharkey' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Josh Sharkey','josh-sharkey-2021-co',167,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,167,7,20,2.9,5,13,38.5,3,8,37.5,7,7,100.0,1,2,3,0.4,2,0.3,3,0,0,'4','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Zuri Harris') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'z%harris' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Zuri Harris','zuri-harris-2021-co',167,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,167,11,19,1.7,7,16,43.8,2,8,25.0,3,4,75.0,9,9,18,1.6,8,0.7,7,1,0,'12','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Adrian Irving Jr.') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'a%jr.' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Adrian Irving Jr.','adrian-irving-jr-2021-co',167,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,167,1,9,9.0,4,15,26.7,0,5,0.0,1,2,50.0,0,1,1,1.0,3,3.0,0,0,0,'2','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Chev Cheverello') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'c%cheverello' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Chev Cheverello','chev-cheverello-2021-co',167,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,167,8,2,0.2,1,5,20.0,0,2,0.0,0,2,0.0,3,1,4,0.5,1,0.1,0,0,0,'10','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Karmon Bambara') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'k%bambara' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Karmon Bambara','karmon-bambara-2021-co',167,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,167,3,0,0.0,0,1,0.0,0,1,0.0,0,0,NULL,0,0,0,0.0,0,0.0,0,0,0,'22','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('IV Pettit') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'i%pettit' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'IV Pettit','iv-pettit-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,12,170,14.2,52,136,38.2,29,79,36.7,37,48,77.1,5,44,49,4.1,27,2.3,11,0,0,'2','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Ty Mishock') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 't%mishock' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Ty Mishock','ty-mishock-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,14,122,8.7,35,78,44.9,21,49,42.9,31,48,64.6,7,10,17,1.2,44,3.1,17,0,0,'22','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Chris Patton') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'c%patton' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Chris Patton','chris-patton-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,14,110,7.9,36,90,40.0,23,55,41.8,15,18,83.3,6,27,33,2.4,16,1.1,13,2,0,'5','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Eamon Walsh') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'e%walsh' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Eamon Walsh','eamon-walsh-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,12,101,8.4,32,53,60.4,11,23,47.8,26,39,66.7,7,29,36,3.0,30,2.5,22,3,0,'34','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Lucas Orchard') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'l%orchard' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Lucas Orchard','lucas-orchard-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,14,101,7.2,39,92,42.4,13,39,33.3,10,14,71.4,16,57,73,5.2,44,3.2,37,3,0,'4','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jacen Holloway') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%holloway' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jacen Holloway','jacen-holloway-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,14,94,6.7,38,64,59.4,11,22,50.0,7,14,50.0,10,21,31,2.2,18,1.3,16,2,0,'10','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Allan Cieslak') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'a%cieslak' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Allan Cieslak','allan-cieslak-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,13,52,4.0,19,46,41.3,5,26,19.2,9,9,100.0,2,16,18,1.4,10,0.8,5,0,0,'3','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jake Kenney') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%kenney' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jake Kenney','jake-kenney-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,14,44,3.1,17,34,50.0,3,12,25.0,7,10,70.0,10,20,30,2.1,20,1.4,20,0,0,'24','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Mike Ferry') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'm%ferry' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Mike Ferry','mike-ferry-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,10,4,0.4,2,5,40.0,0,1,0.0,0,0,NULL,3,9,12,1.2,6,0.6,1,1,0,'25','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Tyler Scarpulla') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 't%scarpulla' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Tyler Scarpulla','tyler-scarpulla-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,3,0,0.0,0,1,0.0,0,0,NULL,0,0,NULL,0,0,0,0.0,0,0.0,0,0,0,'12','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Billy Rayer') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'b%rayer' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Billy Rayer','billy-rayer-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,2,0,0.0,0,0,NULL,0,0,NULL,0,0,NULL,0,0,0,0.0,0,0.0,0,0,0,'1','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Dave Cherry') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'd%cherry' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Dave Cherry','dave-cherry-2021-dp',254,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,254,2,0,0.0,0,1,0.0,0,0,NULL,0,0,NULL,0,4,4,2.0,0,0.0,0,0,0,'42','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Jimmy Casey') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'j%casey' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jimmy Casey','jimmy-casey-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,11,151,13.7,62,135,45.9,3,21,14.3,24,42,57.1,26,77,103,9.4,12,1.1,13,15,0,'44','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Liam McDonnell') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'l%mcdonnell' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Liam McDonnell','liam-mcdonnell-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,12,66,5.5,25,70,35.7,5,23,21.7,11,15,73.3,3,28,31,2.6,24,2.0,11,0,0,'10','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Brandon Thomson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'b%thomson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Brandon Thomson','brandon-thomson-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,11,63,5.7,21,54,38.9,10,27,37.0,11,14,78.6,4,12,16,1.5,10,0.9,4,0,0,'3','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Kellen Ward') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'k%ward' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Kellen Ward','kellen-ward-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,6,44,7.3,18,61,29.5,2,11,18.2,6,17,35.3,17,29,46,7.7,5,0.8,6,10,0,'12','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Shawn Gibbons') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 's%gibbons' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Shawn Gibbons','shawn-gibbons-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,12,55,4.6,18,58,31.0,8,26,30.8,11,16,68.8,5,21,26,2.2,23,1.9,10,1,0,'21','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('James Juarez') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'j%juarez' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'James Juarez','james-juarez-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,12,45,3.8,12,44,27.3,8,24,33.3,13,21,61.9,6,18,24,2.0,9,0.8,10,1,0,'22','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Matt McDougal') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'm%mcdougal' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matt McDougal','matt-mcdougal-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,9,38,4.2,15,46,32.6,2,5,40.0,6,6,100.0,11,16,27,3.0,22,2.4,5,0,0,'1','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Matt Hopkins') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'm%hopkins' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matt Hopkins','matt-hopkins-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,6,16,2.7,4,10,40.0,3,7,42.9,5,6,83.3,1,6,7,1.2,1,0.2,1,1,0,'33','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Matt Dome') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'm%dome' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matt Dome','matt-dome-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,9,13,1.4,5,26,19.2,3,14,21.4,0,1,0.0,3,7,10,1.1,4,0.4,4,0,0,'24','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Evan Lojewski') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'e%lojewski' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Evan Lojewski','evan-lojewski-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,5,12,2.4,3,7,42.9,0,2,0.0,6,8,75.0,3,5,8,1.6,1,0.2,1,0,0,'42','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Thomas Engard') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 't%engard' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Thomas Engard','thomas-engard-2021-lc',971,2021,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,71,971,10,5,0.5,2,8,25.0,0,2,0.0,1,2,50.0,4,7,11,1.1,1,0.1,1,0,0,'34','pcl_team_stats_2020_21',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();