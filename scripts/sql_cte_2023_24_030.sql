
WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Brady McAdams') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'b%mcadams' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Brady McAdams','brady-mcadams-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,28,106,3.8,38,90,42.2,20,59,33.9,10,17,58.8,25,33,58,2.1,46,1.6,11,4,30,'23','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Tahir Howell') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 't%howell' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Tahir Howell','tahir-howell-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,28,104,3.7,44,64,68.8,0,6,0.0,16,26,61.5,40,56,96,3.4,23,0.8,24,32,13,'12','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Ihsan Beyah') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'i%beyah' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Ihsan Beyah','ihsan-beyah-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,28,23,0.8,8,28,28.6,4,15,26.7,3,4,75.0,7,23,30,1.1,32,1.1,15,2,30,'11','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Jaydin Jenkins') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'j%jenkins' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jaydin Jenkins','jaydin-jenkins-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,23,18,0.8,7,12,58.3,0,0,NULL,4,8,50.0,8,17,25,1.1,0,0.0,3,8,6,'32','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Brian Donahue') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'b%donahue' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Brian Donahue','brian-donahue-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,8,9,1.1,3,7,42.9,3,7,42.9,0,0,NULL,0,1,1,0.1,0,0.0,0,0,2,'20','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Jarrod Denard') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'j%denard' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jarrod Denard','jarrod-denard-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,12,6,0.5,2,6,33.3,1,5,20.0,1,2,50.0,0,2,2,0.2,1,0.1,0,0,5,'4','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Samir Palmer') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 's%palmer' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Samir Palmer','samir-palmer-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,17,6,0.4,3,15,20.0,0,2,0.0,0,0,NULL,3,9,12,0.7,1,0.1,1,2,5,'24','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Joe Kelly') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'j%kelly' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Joe Kelly','joe-kelly-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,15,15,1.0,5,11,45.5,5,10,50.0,0,0,NULL,3,6,9,0.6,7,0.5,2,0,5,'13','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('JJ Levasseur') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'j%levasseur' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'JJ Levasseur','jj-levasseur-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,6,2,0.3,1,3,33.3,0,2,0.0,0,0,NULL,1,0,1,0.2,0,0.0,0,0,0,'33','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name)=LOWER('Aiden Davis-Carter') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=144 AND LOWER(name) LIKE 'a%davis-carter' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Aiden Davis-Carter','aiden-davis-carter-2024-aw',144,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,144,5,0,0.0,0,1,0.0,0,0,NULL,0,0,NULL,0,1,1,0.2,0,0.0,0,0,1,'22','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Aasim Burton') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'a%burton' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Aasim Burton','aasim-burton-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,24,518,21.6,183,450,40.7,44,141,31.2,108,147,73.5,20,104,124,5.2,86,3.6,46,16,84,'2','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Pearse McGuinn') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'p%mcguinn' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Pearse McGuinn','pearse-mcguinn-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,24,289,12.0,114,210,54.3,15,54,27.8,52,62,83.9,69,118,187,7.8,40,1.7,16,57,55,'31','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Tygee Clark') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 't%clark' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Tygee Clark','tygee-clark-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,15,102,6.8,40,104,38.5,9,53,17.0,13,25,52.0,2,22,24,1.6,24,1.6,16,3,25,'15','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Noah McIntosh') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'n%mcintosh' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Noah McIntosh','noah-mcintosh-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,19,106,5.6,41,93,44.1,5,22,22.7,19,30,63.3,31,48,79,4.2,13,0.7,13,17,17,'3','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Miles Johnson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'm%johnson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Miles Johnson','miles-johnson-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,24,128,5.3,49,102,48.0,1,5,20.0,29,56,51.8,27,66,93,3.9,20,0.8,28,15,35,'5','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('John Quinn') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'j%quinn' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'John Quinn','john-quinn-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,24,87,3.6,27,73,37.0,16,39,41.0,17,23,73.9,9,41,50,2.1,46,1.9,19,9,32,'11','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Anthony Hobbs') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'a%hobbs' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Anthony Hobbs','anthony-hobbs-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,24,64,2.7,23,81,28.4,7,30,23.3,11,21,52.4,7,32,39,1.6,32,1.3,26,3,28,'0','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('John Welde') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'j%welde' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'John Welde','john-welde-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,14,8,0.6,3,13,23.1,2,11,18.2,0,0,NULL,2,10,12,0.9,3,0.2,1,2,5,'34','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Matt Cervellero') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'm%cervellero' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matt Cervellero','matt-cervellero-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,3,6,2.0,2,3,66.7,2,3,66.7,0,0,NULL,0,0,0,0.0,0,0.0,0,0,0,'33','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Abdulai Bayraytay') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'a%bayraytay' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Abdulai Bayraytay','abdulai-bayraytay-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,5,4,0.8,1,2,50.0,0,1,0.0,2,3,66.7,0,1,1,0.2,2,0.4,0,0,0,'12','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Edwin Ujor') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'e%ujor' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Edwin Ujor','edwin-ujor-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,7,5,0.7,2,7,28.6,0,1,0.0,1,2,50.0,3,5,8,1.1,0,0.0,1,1,0,'4','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Matt Smith') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'm%smith' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matt Smith','matt-smith-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,8,1,0.1,0,1,0.0,0,0,NULL,1,2,50.0,2,5,7,0.9,1,0.1,0,0,0,'20','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Obinna Okebata') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'o%okebata' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Obinna Okebata','obinna-okebata-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,3,0,0.0,0,0,NULL,0,0,NULL,0,0,NULL,0,1,1,0.3,0,0.0,0,0,0,'14','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name)=LOWER('Cassius Law') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=167 AND LOWER(name) LIKE 'c%law' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Cassius Law','cassius-law-2024-co',167,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,167,1,0,0.0,0,1,0.0,0,1,0.0,0,0,NULL,0,0,0,0.0,0,0.0,0,0,0,'13','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Kevair Kennedy') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'k%kennedy' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Kevair Kennedy','kevair-kennedy-2024-fj',147,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,147,24,415,17.3,120,266,45.1,16,42,38.1,157,208,75.5,48,108,156,6.5,145,6.0,48,10,88,'5','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Derrick Morton-Rivera') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'd%morton-rivera' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Derrick Morton-Rivera','derrick-morton-rivera-2024-fj',147,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,147,24,368,15.3,126,285,44.2,62,160,38.8,54,66,81.8,36,68,104,4.3,36,1.5,16,13,26,'44','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Laquan Byrd') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'l%byrd' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Laquan Byrd','laquan-byrd-2024-fj',147,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,147,24,309,12.9,112,245,45.7,38,112,33.9,47,63,74.6,32,132,164,6.8,65,2.7,16,1,62,'1','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Nazir Tyler') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'n%tyler' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Nazir Tyler','nazir-tyler-2024-fj',147,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,147,24,171,7.1,58,145,40.0,35,87,40.2,20,32,62.5,17,79,96,4.0,49,2.0,10,4,24,'3','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Anthony Lilly') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'a%lilly' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Anthony Lilly','anthony-lilly-2024-fj',147,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,147,24,157,6.5,66,122,54.1,5,17,29.4,20,31,64.5,54,56,110,4.6,23,1.0,6,11,22,'21','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Rocco Westfield') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'r%westfield' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Rocco Westfield','rocco-westfield-2024-fj',147,2024,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,74,147,24,109,4.5,37,85,43.5,28,70,40.0,7,13,53.8,6,20,26,1.1,31,1.3,17,1,17,'0','pcl_team_stats_2023_24',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();