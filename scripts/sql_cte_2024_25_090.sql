
WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Mike Pergolis') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'm%pergolis' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Mike Pergolis','mike-pergolis-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,28,54,1.9,20,55,36.4,10,39,25.6,4,6,66.7,6,10,16,0.6,17,0.6,18,0,14,'3','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Braeden Fisher') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'b%fisher' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Braeden Fisher','braeden-fisher-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,28,47,1.7,21,41,51.2,2,10,20.0,3,7,42.9,15,31,46,1.6,13,0.5,14,3,14,'33','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Cooper Fairlamb') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'c%fairlamb' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Cooper Fairlamb','cooper-fairlamb-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,18,34,1.9,13,29,44.8,6,13,46.2,2,4,50.0,5,9,14,0.8,12,0.7,3,0,22,'13','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Owen Raymond') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'o%raymond' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Owen Raymond','owen-raymond-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,22,29,1.3,12,41,29.3,4,24,16.7,1,4,25.0,12,21,33,1.5,17,0.8,4,0,15,'15','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('John Doogan') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%doogan' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'John Doogan','john-doogan-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,7,10,1.4,4,15,26.7,1,5,20.0,1,2,50.0,2,8,10,1.4,3,0.4,3,4,3,'21','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jaden Craft') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%craft' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jaden Craft','jaden-craft-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,10,21,2.1,6,22,27.3,4,18,22.2,5,7,71.4,1,7,8,0.8,3,0.3,3,0,2,'10','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jayden Allen-Bates') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%allen-bates' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jayden Allen-Bates','jayden-allen-bates-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,9,3,0.3,1,5,20.0,0,2,0.0,1,2,50.0,1,0,1,0.1,0,0.0,4,1,1,'14','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Jack Doyle') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'j%doyle' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jack Doyle','jack-doyle-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,6,0,0.0,0,3,0.0,0,2,0.0,0,0,NULL,0,3,3,0.5,2,0.3,0,0,6,'12','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name)=LOWER('Brennan Wood') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=254 AND LOWER(name) LIKE 'b%wood' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Brennan Wood','brennan-wood-2025-dp',254,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,254,1,2,2.0,1,1,100.0,0,0,NULL,0,0,NULL,1,1,2,2.0,1,1.0,1,0,0,'34','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Derrick Morton-Rivera') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'd%morton-rivera' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Derrick Morton-Rivera','derrick-morton-rivera-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,28,481,17.2,181,366,49.5,79,197,40.1,40,53,75.5,24,82,106,3.8,31,1.1,15,6,29,'44','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Kevair Kennedy') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'k%kennedy' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Kevair Kennedy','kevair-kennedy-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,29,466,16.1,150,287,52.3,15,39,38.5,151,198,76.3,54,139,193,6.7,213,7.3,57,11,88,'5','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Nazir Tyler') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'n%tyler' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Nazir Tyler','nazir-tyler-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,29,279,9.6,98,247,39.7,51,142,35.9,32,50,64.0,17,81,98,3.4,63,2.2,22,12,37,'3','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Rocco Westfield') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'r%westfield' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Rocco Westfield','rocco-westfield-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,31,296,9.5,100,226,44.2,60,139,43.2,36,43,83.7,35,100,135,4.4,89,2.9,36,1,45,'0','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Everett Barnes') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'e%barnes' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Everett Barnes','everett-barnes-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,30,276,9.2,103,166,62.0,2,6,33.3,68,98,69.4,77,129,206,6.9,10,0.3,6,70,31,'25','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Max Moshinski') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'm%moshinski' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Max Moshinski','max-moshinski-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,28,143,5.1,56,107,52.3,7,28,25.0,24,38,63.2,29,51,80,2.9,38,1.4,18,7,45,'24','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Kevin Beck') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'k%beck' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Kevin Beck','kevin-beck-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,30,124,4.1,48,109,44.0,22,60,36.7,6,6,100.0,16,67,83,2.8,38,1.3,10,10,19,'35','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Rahkiy Mason') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'r%mason' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Rahkiy Mason','rahkiy-mason-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,29,44,1.5,16,30,53.3,3,7,42.9,9,17,52.9,8,14,22,0.8,48,1.7,18,0,26,'11','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Kiev Rucker') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'k%rucker' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Kiev Rucker','kiev-rucker-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,22,18,0.8,6,17,35.3,2,8,25.0,4,5,80.0,5,11,16,0.7,4,0.2,4,0,7,'4','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Dylan Handley') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'd%handley' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Dylan Handley','dylan-handley-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,18,17,0.9,7,19,36.8,2,8,25.0,1,2,50.0,1,17,18,1.0,2,0.1,1,5,7,'10','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Nick Lilly') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'n%lilly' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Nick Lilly','nick-lilly-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,8,13,1.6,5,9,55.6,3,5,60.0,0,0,NULL,1,3,4,0.5,1,0.1,0,0,2,'21','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Dom Dorsey') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'd%dorsey' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Dom Dorsey','dom-dorsey-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,10,13,1.3,4,9,44.4,2,3,66.7,3,6,50.0,2,4,6,0.6,6,0.6,2,0,5,'1','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Jeremiah Adedeji') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'j%adedeji' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Jeremiah Adedeji','jeremiah-adedeji-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,11,10,0.9,5,12,41.7,0,2,0.0,0,0,NULL,5,8,13,1.2,0,0.0,1,2,0,'2','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Nick Evans') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'n%evans' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Nick Evans','nick-evans-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,8,8,1.0,3,5,60.0,0,2,0.0,2,3,66.7,1,0,1,0.1,0,0.0,0,0,0,'12','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name)=LOWER('Michael Chase') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=147 AND LOWER(name) LIKE 'm%chase' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Michael Chase','michael-chase-2025-fj',147,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,147,11,4,0.4,1,5,20.0,0,4,0.0,2,2,100.0,0,2,2,0.2,2,0.2,1,0,1,'14','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Chase Stevens') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'c%stevens' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Chase Stevens','chase-stevens-2025-lc',971,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,971,20,234,11.7,68,176,38.6,20,59,33.9,78,115,67.8,27,91,118,5.9,50,2.5,28,22,64,'33','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Rowan Romero') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'r%romero' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Rowan Romero','rowan-romero-2025-lc',971,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,971,24,223,9.3,91,195,46.7,9,33,27.3,32,59,54.2,37,73,110,4.6,40,1.7,26,23,52,'2','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Ben Holdsworth') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'b%holdsworth' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Ben Holdsworth','ben-holdsworth-2025-lc',971,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,971,18,146,8.1,60,116,51.7,4,21,19.0,22,36,61.1,34,64,98,5.4,14,0.8,20,8,22,'22','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Melo Aylmer') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'm%aylmer' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Melo Aylmer','melo-aylmer-2025-lc',971,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,971,24,205,8.5,77,211,36.5,29,87,33.3,22,33,66.7,17,48,65,2.7,91,3.8,20,5,99,'1','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Matt Johnson') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'm%johnson' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Matt Johnson','matt-johnson-2025-lc',971,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,971,24,161,6.7,55,147,37.4,44,125,35.2,6,9,66.7,3,18,21,0.9,11,0.5,7,2,26,'20','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();

WITH pid AS (
  SELECT COALESCE(
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name)=LOWER('Yeboa Cobbold') LIMIT 1),
    (SELECT id FROM players WHERE primary_school_id=971 AND LOWER(name) LIKE 'y%cobbold' LIMIT 1)
  ) as id
), new_player AS (
  INSERT INTO players (name,slug,primary_school_id,graduation_year,region_id,created_at)
  SELECT 'Yeboa Cobbold','yeboa-cobbold-2025-lc',971,2025,'philly',NOW()
  WHERE (SELECT id FROM pid) IS NULL
  RETURNING id
), final_pid AS (
  SELECT COALESCE((SELECT id FROM pid),(SELECT id FROM new_player)) as id
)
INSERT INTO basketball_player_seasons (player_id,season_id,school_id,games_played,points,ppg,fgm,fga,fg_pct,three_pm,three_pa,three_pct,ftm,fta,ft_pct,off_rebounds,def_rebounds,rebounds,rpg,assists,apg,steals,blocks,turnovers,jersey_number,source_file,created_at)
SELECT id,75,971,24,116,4.8,46,117,39.3,8,39,20.5,16,33,48.5,12,64,76,3.2,40,1.7,31,17,28,'12','pcl_team_stats_2024_25',NOW()
FROM final_pid
ON CONFLICT (player_id,season_id,school_id) DO UPDATE SET games_played=EXCLUDED.games_played,points=EXCLUDED.points,ppg=EXCLUDED.ppg,fgm=EXCLUDED.fgm,fga=EXCLUDED.fga,fg_pct=EXCLUDED.fg_pct,three_pm=EXCLUDED.three_pm,three_pa=EXCLUDED.three_pa,three_pct=EXCLUDED.three_pct,ftm=EXCLUDED.ftm,fta=EXCLUDED.fta,ft_pct=EXCLUDED.ft_pct,off_rebounds=EXCLUDED.off_rebounds,def_rebounds=EXCLUDED.def_rebounds,rebounds=EXCLUDED.rebounds,rpg=EXCLUDED.rpg,assists=EXCLUDED.assists,apg=EXCLUDED.apg,steals=EXCLUDED.steals,blocks=EXCLUDED.blocks,turnovers=EXCLUDED.turnovers,jersey_number=EXCLUDED.jersey_number,source_file=EXCLUDED.source_file,updated_at=NOW();