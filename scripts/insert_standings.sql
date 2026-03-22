-- =============================================
-- PCL STANDINGS DATA - team_seasons table
-- Seasons 2016-17 through 2025-26
-- =============================================

-- 2025-26 Standings
INSERT INTO team_seasons (school_id, season_id, sport_id, league_wins, league_losses, wins, losses, league_finish, region_id, source_file, created_at)
VALUES
(144, 76, 'basketball', 12, 1, 14, 3, '1st', 'philly', 'aop_standings', NOW()),
(177, 76, 'basketball', 10, 3, 17, 4, '2nd', 'philly', 'aop_standings', NOW()),
(127, 76, 'basketball', 10, 3, 10, 4, '3rd', 'philly', 'aop_standings', NOW()),
(198, 76, 'basketball', 10, 3, 15, 5, '4th', 'philly', 'aop_standings', NOW()),
(145, 76, 'basketball', 9, 4, 11, 6, '5th', 'philly', 'aop_standings', NOW()),
(147, 76, 'basketball', 9, 4, 15, 6, '6th', 'philly', 'aop_standings', NOW()),
(175, 76, 'basketball', 6, 7, 7, 8, '7th', 'philly', 'aop_standings', NOW()),
(1005, 76, 'basketball', 6, 7, 6, 8, '8th', 'philly', 'aop_standings', NOW()),
(171, 76, 'basketball', 5, 8, 11, 10, '9th', 'philly', 'aop_standings', NOW()),
(2882, 76, 'basketball', 4, 9, 4, 10, '10th', 'philly', 'aop_standings', NOW()),
(254, 76, 'basketball', 4, 9, 9, 10, '11th', 'philly', 'aop_standings', NOW()),
(167, 76, 'basketball', 3, 10, 3, 10, '12th', 'philly', 'aop_standings', NOW()),
(971, 76, 'basketball', 2, 11, 3, 12, '13th', 'philly', 'aop_standings', NOW()),
(2780, 76, 'basketball', 1, 12, 1, 12, '14th', 'philly', 'aop_standings', NOW())
ON CONFLICT (school_id, season_id, sport_id) DO UPDATE SET
league_wins=EXCLUDED.league_wins, league_losses=EXCLUDED.league_losses,
wins=EXCLUDED.wins, losses=EXCLUDED.losses, league_finish=EXCLUDED.league_finish,
source_file=EXCLUDED.source_file, updated_at=NOW();

-- 2024-25 Standings
INSERT INTO team_seasons (school_id, season_id, sport_id, league_wins, league_losses, wins, losses, league_finish, region_id, source_file, created_at)
VALUES
(1005, 75, 'basketball', 12, 1, 13, 2, '1st', 'philly', 'aop_standings', NOW()),
(127, 75, 'basketball', 11, 2, 18, 4, '2nd', 'philly', 'aop_standings', NOW()),
(254, 75, 'basketball', 11, 2, 18, 3, '3rd', 'philly', 'aop_standings', NOW()),
(147, 75, 'basketball', 10, 3, 18, 4, '4th', 'philly', 'aop_standings', NOW()),
(198, 75, 'basketball', 7, 6, 13, 7, '5th', 'philly', 'aop_standings', NOW()),
(171, 75, 'basketball', 7, 6, 13, 7, '6th', 'philly', 'aop_standings', NOW()),
(177, 75, 'basketball', 7, 6, 10, 8, '7th', 'philly', 'aop_standings', NOW()),
(2882, 75, 'basketball', 6, 7, 6, 8, '8th', 'philly', 'aop_standings', NOW()),
(175, 75, 'basketball', 5, 8, 6, 9, '9th', 'philly', 'aop_standings', NOW()),
(144, 75, 'basketball', 5, 8, 6, 9, '10th', 'philly', 'aop_standings', NOW()),
(145, 75, 'basketball', 4, 9, 5, 10, '11th', 'philly', 'aop_standings', NOW()),
(167, 75, 'basketball', 4, 9, 4, 9, '12th', 'philly', 'aop_standings', NOW()),
(2780, 75, 'basketball', 2, 11, 2, 11, '13th', 'philly', 'aop_standings', NOW()),
(971, 75, 'basketball', 0, 13, 1, 14, '14th', 'philly', 'aop_standings', NOW())
ON CONFLICT (school_id, season_id, sport_id) DO UPDATE SET
league_wins=EXCLUDED.league_wins, league_losses=EXCLUDED.league_losses,
wins=EXCLUDED.wins, losses=EXCLUDED.losses, league_finish=EXCLUDED.league_finish,
source_file=EXCLUDED.source_file, updated_at=NOW();

-- 2023-24 Standings (need to fetch this - using placeholder structure)
-- Will add when we get the data

-- 2020-21 Standings
INSERT INTO team_seasons (school_id, season_id, sport_id, league_wins, league_losses, wins, losses, league_finish, region_id, source_file, created_at)
VALUES
(144, 71, 'basketball', 14, 0, 19, 1, '1st', 'philly', 'aop_standings', NOW()),
(127, 71, 'basketball', 9, 1, 10, 2, '2nd', 'philly', 'aop_standings', NOW()),
(254, 71, 'basketball', 9, 4, 9, 5, '3rd', 'philly', 'aop_standings', NOW()),
(175, 71, 'basketball', 9, 4, 12, 6, '4th', 'philly', 'aop_standings', NOW()),
(2882, 71, 'basketball', 8, 5, 9, 5, '5th', 'philly', 'aop_standings', NOW()),
(158, 71, 'basketball', 8, 5, 9, 6, '6th', 'philly', 'aop_standings', NOW()),
(171, 71, 'basketball', 6, 4, 7, 5, '7th', 'philly', 'aop_standings', NOW()),
(145, 71, 'basketball', 7, 5, 9, 7, '8th', 'philly', 'aop_standings', NOW()),
(198, 71, 'basketball', 4, 6, 4, 6, '9th', 'philly', 'aop_standings', NOW()),
(177, 71, 'basketball', 3, 4, 3, 4, '10th', 'philly', 'aop_standings', NOW()),
(1005, 71, 'basketball', 3, 10, 3, 11, '11th', 'philly', 'aop_standings', NOW()),
(167, 71, 'basketball', 2, 10, 3, 10, '12th', 'philly', 'aop_standings', NOW()),
(971, 71, 'basketball', 2, 9, 2, 10, '13th', 'philly', 'aop_standings', NOW()),
(147, 71, 'basketball', 2, 10, 4, 12, '14th', 'philly', 'aop_standings', NOW()),
(2780, 71, 'basketball', 2, 11, 2, 11, '15th', 'philly', 'aop_standings', NOW())
ON CONFLICT (school_id, season_id, sport_id) DO UPDATE SET
league_wins=EXCLUDED.league_wins, league_losses=EXCLUDED.league_losses,
wins=EXCLUDED.wins, losses=EXCLUDED.losses, league_finish=EXCLUDED.league_finish,
source_file=EXCLUDED.source_file, updated_at=NOW();

-- 2019-20 Standings
INSERT INTO team_seasons (school_id, season_id, sport_id, league_wins, league_losses, wins, losses, league_finish, region_id, source_file, created_at)
VALUES
(144, 70, 'basketball', 13, 1, 17, 2, '1st', 'philly', 'aop_standings', NOW()),
(158, 70, 'basketball', 12, 2, 13, 4, '2nd', 'philly', 'aop_standings', NOW()),
(198, 70, 'basketball', 12, 2, 18, 2, '3rd', 'philly', 'aop_standings', NOW()),
(177, 70, 'basketball', 11, 3, 14, 4, '4th', 'philly', 'aop_standings', NOW()),
(127, 70, 'basketball', 10, 4, 14, 6, '5th', 'philly', 'aop_standings', NOW()),
(167, 70, 'basketball', 9, 5, 9, 6, '6th', 'philly', 'aop_standings', NOW()),
(175, 70, 'basketball', 8, 6, 13, 7, '7th', 'philly', 'aop_standings', NOW()),
(145, 70, 'basketball', 8, 6, 11, 8, '8th', 'philly', 'aop_standings', NOW()),
(1005, 70, 'basketball', 6, 8, 7, 10, '9th', 'philly', 'aop_standings', NOW()),
(171, 70, 'basketball', 5, 9, 5, 10, '10th', 'philly', 'aop_standings', NOW()),
(254, 70, 'basketball', 3, 11, 3, 11, '11th', 'philly', 'aop_standings', NOW()),
(2882, 70, 'basketball', 3, 11, 3, 11, '12th', 'philly', 'aop_standings', NOW()),
(147, 70, 'basketball', 3, 11, 3, 11, '13th', 'philly', 'aop_standings', NOW()),
(971, 70, 'basketball', 2, 12, 2, 12, '14th', 'philly', 'aop_standings', NOW()),
(2780, 70, 'basketball', 0, 14, 0, 14, '15th', 'philly', 'aop_standings', NOW())
ON CONFLICT (school_id, season_id, sport_id) DO UPDATE SET
league_wins=EXCLUDED.league_wins, league_losses=EXCLUDED.league_losses,
wins=EXCLUDED.wins, losses=EXCLUDED.losses, league_finish=EXCLUDED.league_finish,
source_file=EXCLUDED.source_file, updated_at=NOW();

-- 2018-19 Standings
INSERT INTO team_seasons (school_id, season_id, sport_id, league_wins, league_losses, wins, losses, league_finish, region_id, source_file, created_at)
VALUES
(127, 69, 'basketball', 13, 1, 19, 2, '1st', 'philly', 'aop_standings', NOW()),
(2882, 69, 'basketball', 12, 2, 18, 4, '2nd', 'philly', 'aop_standings', NOW()),
(158, 69, 'basketball', 11, 3, 15, 6, '3rd', 'philly', 'aop_standings', NOW()),
(198, 69, 'basketball', 11, 3, 16, 5, '4th', 'philly', 'aop_standings', NOW()),
(177, 69, 'basketball', 11, 3, 16, 5, '5th', 'philly', 'aop_standings', NOW()),
(144, 69, 'basketball', 9, 5, 14, 7, '6th', 'philly', 'aop_standings', NOW()),
(145, 69, 'basketball', 9, 5, 13, 7, '7th', 'philly', 'aop_standings', NOW()),
(1005, 69, 'basketball', 7, 7, 8, 8, '8th', 'philly', 'aop_standings', NOW()),
(175, 69, 'basketball', 7, 7, 9, 9, '9th', 'philly', 'aop_standings', NOW()),
(147, 69, 'basketball', 4, 10, 4, 11, '10th', 'philly', 'aop_standings', NOW()),
(167, 69, 'basketball', 3, 11, 3, 11, '11th', 'philly', 'aop_standings', NOW()),
(171, 69, 'basketball', 3, 11, 3, 11, '12th', 'philly', 'aop_standings', NOW()),
(254, 69, 'basketball', 2, 12, 2, 12, '13th', 'philly', 'aop_standings', NOW()),
(2780, 69, 'basketball', 2, 12, 2, 12, '14th', 'philly', 'aop_standings', NOW()),
(971, 69, 'basketball', 1, 13, 1, 13, '15th', 'philly', 'aop_standings', NOW())
ON CONFLICT (school_id, season_id, sport_id) DO UPDATE SET
league_wins=EXCLUDED.league_wins, league_losses=EXCLUDED.league_losses,
wins=EXCLUDED.wins, losses=EXCLUDED.losses, league_finish=EXCLUDED.league_finish,
source_file=EXCLUDED.source_file, updated_at=NOW();

-- 2017-18 Standings
INSERT INTO team_seasons (school_id, season_id, sport_id, league_wins, league_losses, wins, losses, league_finish, region_id, source_file, created_at)
VALUES
(177, 68, 'basketball', 12, 1, 18, 3, '1st', 'philly', 'aop_standings', NOW()),
(198, 68, 'basketball', 12, 1, 18, 2, '2nd', 'philly', 'aop_standings', NOW()),
(127, 68, 'basketball', 11, 2, 19, 3, '3rd', 'philly', 'aop_standings', NOW()),
(145, 68, 'basketball', 10, 3, 14, 5, '4th', 'philly', 'aop_standings', NOW()),
(144, 68, 'basketball', 8, 5, 8, 6, '5th', 'philly', 'aop_standings', NOW()),
(2882, 68, 'basketball', 8, 5, 8, 6, '6th', 'philly', 'aop_standings', NOW()),
(1005, 68, 'basketball', 7, 6, 11, 8, '7th', 'philly', 'aop_standings', NOW()),
(175, 68, 'basketball', 6, 7, 6, 8, '8th', 'philly', 'aop_standings', NOW()),
(167, 68, 'basketball', 5, 8, 6, 9, '9th', 'philly', 'aop_standings', NOW()),
(158, 68, 'basketball', 4, 9, 7, 11, '10th', 'philly', 'aop_standings', NOW()),
(171, 68, 'basketball', 3, 10, 3, 10, '11th', 'philly', 'aop_standings', NOW()),
(2780, 68, 'basketball', 2, 11, 4, 13, '12th', 'philly', 'aop_standings', NOW()),
(971, 68, 'basketball', 2, 11, 2, 12, '13th', 'philly', 'aop_standings', NOW()),
(147, 68, 'basketball', 1, 12, 1, 12, '14th', 'philly', 'aop_standings', NOW())
ON CONFLICT (school_id, season_id, sport_id) DO UPDATE SET
league_wins=EXCLUDED.league_wins, league_losses=EXCLUDED.league_losses,
wins=EXCLUDED.wins, losses=EXCLUDED.losses, league_finish=EXCLUDED.league_finish,
source_file=EXCLUDED.source_file, updated_at=NOW();

-- 2016-17 Standings
INSERT INTO team_seasons (school_id, season_id, sport_id, league_wins, league_losses, wins, losses, league_finish, region_id, source_file, created_at)
VALUES
(144, 67, 'basketball', 12, 1, 28, 3, '1st', 'philly', 'aop_standings', NOW()),
(198, 67, 'basketball', 12, 1, 24, 7, '2nd', 'philly', 'aop_standings', NOW()),
(127, 67, 'basketball', 10, 3, 20, 6, '3rd', 'philly', 'aop_standings', NOW()),
(175, 67, 'basketball', 9, 4, 23, 6, '4th', 'philly', 'aop_standings', NOW()),
(147, 67, 'basketball', 9, 4, 16, 7, '5th', 'philly', 'aop_standings', NOW()),
(1005, 67, 'basketball', 8, 5, 15, 8, '6th', 'philly', 'aop_standings', NOW()),
(145, 67, 'basketball', 7, 6, 20, 9, '7th', 'philly', 'aop_standings', NOW()),
(177, 67, 'basketball', 7, 6, 16, 9, '8th', 'philly', 'aop_standings', NOW()),
(2780, 67, 'basketball', 5, 8, 10, 15, '9th', 'philly', 'aop_standings', NOW()),
(2882, 67, 'basketball', 5, 8, 11, 12, '10th', 'philly', 'aop_standings', NOW()),
(971, 67, 'basketball', 3, 10, 10, 12, '11th', 'philly', 'aop_standings', NOW()),
(171, 67, 'basketball', 3, 10, 5, 20, '12th', 'philly', 'aop_standings', NOW()),
(158, 67, 'basketball', 1, 12, 4, 18, '13th', 'philly', 'aop_standings', NOW()),
(167, 67, 'basketball', 0, 13, 4, 17, '14th', 'philly', 'aop_standings', NOW())
ON CONFLICT (school_id, season_id, sport_id) DO UPDATE SET
league_wins=EXCLUDED.league_wins, league_losses=EXCLUDED.league_losses,
wins=EXCLUDED.wins, losses=EXCLUDED.losses, league_finish=EXCLUDED.league_finish,
source_file=EXCLUDED.source_file, updated_at=NOW();
