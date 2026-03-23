-- Soccer Playoff Brackets 2025-26 (season_id = 76, sport_id = 'soccer')
-- PIAA 1A, 2A, 3A, 4A + PPL Invitational + PPL Varsity

BEGIN;

-- Insert brackets
INSERT INTO playoff_brackets (sport_id, season_id, name, bracket_type, classification) VALUES
('soccer', 76, '2025 PIAA Boys Soccer Championships - 1A', 'piaa_1a', '1A'),
('soccer', 76, '2025 PIAA Boys Soccer Championships - 2A', 'piaa_2a', '2A'),
('soccer', 76, '2025 PIAA Boys Soccer Championships - 3A', 'piaa_3a', '3A'),
('soccer', 76, '2025 PIAA Boys Soccer Championships - 4A', 'piaa_4a', '4A'),
('soccer', 76, '2025 PPL Boys Soccer Invitational (PIT Bracket)', 'ppl_invitational', 'PPL'),
('soccer', 76, '2025 PPL Boys Varsity Soccer Playoffs', 'ppl_varsity', 'PPL');

-- Get the bracket IDs we just inserted
-- We'll use a CTE approach with the bracket names

-- =============================================
-- PIAA 1A BRACKET GAMES
-- =============================================
INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
SELECT b.id, v.round_name, v.round_number, v.game_number, v.team1_name, v.team1_score, v.team2_name, v.team2_score, v.game_date::date
FROM playoff_brackets b
CROSS JOIN (VALUES
  -- First Round
  ('First Round', 1, 1, 'Camp Hill', 2, 'Millville', 1, '2025-11-04'),
  ('First Round', 1, 2, 'Masterman', 0, 'Delaware County Christian', 4, '2025-11-04'),
  ('First Round', 1, 3, 'Southern Columbia Area', 4, 'York Catholic', 0, '2025-11-04'),
  ('First Round', 1, 4, 'Wyoming Seminary College Prep', 6, 'Minersville', 0, '2025-11-04'),
  ('First Round', 1, 5, 'McConnellsburg', 1, 'Lancaster Mennonite', 3, '2025-11-04'),
  ('First Round', 1, 6, 'Bishop Carroll', 0, 'OLSH', 8, '2025-11-04'),
  ('First Round', 1, 7, 'Bentworth', 3, 'Mercyhurst Prep', 1, '2025-11-04'),
  ('First Round', 1, 8, 'Brockway', 0, 'Winchester Thurston', 6, '2025-11-04'),
  -- Quarterfinals
  ('Quarterfinals', 2, 1, 'Camp Hill', 0, 'Delaware County Christian', 2, '2025-11-08'),
  ('Quarterfinals', 2, 2, 'Southern Columbia Area', 1, 'Wyoming Seminary College Prep', 3, '2025-11-08'),
  ('Quarterfinals', 2, 3, 'Lancaster Mennonite', 1, 'OLSH', 2, '2025-11-08'),
  ('Quarterfinals', 2, 4, 'Bentworth', 5, 'Winchester Thurston', 0, '2025-11-08'),
  -- Semifinals
  ('Semifinals', 3, 1, 'Delaware County Christian', 1, 'Wyoming Seminary College Prep', 0, '2025-11-11'),
  ('Semifinals', 3, 2, 'OLSH', 1, 'Bentworth', 2, '2025-11-11'),
  -- Championship
  ('Championship', 4, 1, 'Delaware County Christian', 0, 'Bentworth', 1, '2025-11-15')
) AS v(round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
WHERE b.name = '2025 PIAA Boys Soccer Championships - 1A' AND b.season_id = 76;

-- =============================================
-- PIAA 2A BRACKET GAMES
-- =============================================
INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
SELECT b.id, v.round_name, v.round_number, v.game_number, v.team1_name, v.team1_score, v.team2_name, v.team2_score, v.game_date::date
FROM playoff_brackets b
CROSS JOIN (VALUES
  -- First Round
  ('First Round', 1, 1, 'Northwestern Lehigh', 10, 'Midd-West', 3, '2025-11-04'),
  ('First Round', 1, 2, 'Lancaster Catholic', 0, 'Faith Christian Academy', 1, '2025-11-04'),
  ('First Round', 1, 3, 'Devon Prep', 5, 'Palisades', 1, '2025-11-04'),
  ('First Round', 1, 4, 'Lake-Lehman', 2, 'Lewisburg', 3, '2025-11-04'),
  ('First Round', 1, 5, 'Juniata', 0, 'Tulpehocken', 4, '2025-11-04'),
  ('First Round', 1, 6, 'Deer Lakes', 1, 'Harbor Creek', 0, '2025-11-04'),
  ('First Round', 1, 7, 'Somerset', 1, 'Beaver', 9, '2025-11-04'),
  ('First Round', 1, 8, 'Fairview', 7, 'Quaker Valley', 0, '2025-11-04'),
  -- Quarterfinals
  ('Quarterfinals', 2, 1, 'Northwestern Lehigh', 1, 'Faith Christian Academy', 2, '2025-11-08'),
  ('Quarterfinals', 2, 2, 'Devon Prep', 0, 'Lewisburg', 2, '2025-11-08'),
  ('Quarterfinals', 2, 3, 'Tulpehocken', 1, 'Deer Lakes', 2, '2025-11-08'),
  ('Quarterfinals', 2, 4, 'Beaver', 0, 'Fairview', 4, '2025-11-08'),
  -- Semifinals
  ('Semifinals', 3, 1, 'Faith Christian Academy', 0, 'Lewisburg', 1, '2025-11-11'),
  ('Semifinals', 3, 2, 'Deer Lakes', 1, 'Fairview', 3, '2025-11-11'),
  -- Championship
  ('Championship', 4, 1, 'Lewisburg', 1, 'Fairview', 0, '2025-11-14')
) AS v(round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
WHERE b.name = '2025 PIAA Boys Soccer Championships - 2A' AND b.season_id = 76;

-- =============================================
-- PIAA 3A BRACKET GAMES
-- =============================================
INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
SELECT b.id, v.round_name, v.round_number, v.game_number, v.team1_name, v.team1_score, v.team2_name, v.team2_score, v.game_date::date
FROM playoff_brackets b
CROSS JOIN (VALUES
  -- First Round
  ('First Round', 1, 1, 'Archbishop Ryan', 3, 'Northern York', 2, '2025-11-04'),
  ('First Round', 1, 2, 'Harriton', 1, 'Susquehannock', 0, '2025-11-04'),
  ('First Round', 1, 3, 'Abington Heights', 5, 'Selinsgrove', 0, '2025-11-04'),
  ('First Round', 1, 4, 'Blue Mountain', 2, 'Franklin Towne', 1, '2025-11-04'),
  ('First Round', 1, 5, 'Conrad Weiser', 4, 'Thomas Jefferson', 1, '2025-11-04'),
  ('First Round', 1, 6, 'Franklin Regional', 3, 'Hollidaysburg', 0, '2025-11-04'),
  ('First Round', 1, 7, 'General McLane', 0, 'Taylor Allderdice', 1, '2025-11-04'),
  ('First Round', 1, 8, 'West Allegheny', 2, 'York Suburban', 1, '2025-11-04'),
  -- Quarterfinals
  ('Quarterfinals', 2, 1, 'Harriton', 1, 'Archbishop Ryan', 0, '2025-11-08'),
  ('Quarterfinals', 2, 2, 'Abington Heights', 1, 'Blue Mountain', 0, '2025-11-08'),
  ('Quarterfinals', 2, 3, 'Conrad Weiser', 2, 'Franklin Regional', 0, '2025-11-08'),
  ('Quarterfinals', 2, 4, 'Taylor Allderdice', 3, 'West Allegheny', 3, '2025-11-08'),
  -- Semifinals
  ('Semifinals', 3, 1, 'Abington Heights', 2, 'Harriton', 0, '2025-11-11'),
  ('Semifinals', 3, 2, 'Conrad Weiser', 3, 'Taylor Allderdice', 1, '2025-11-11'),
  -- Championship
  ('Championship', 4, 1, 'Abington Heights', 2, 'Conrad Weiser', 0, '2025-11-15')
) AS v(round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
WHERE b.name = '2025 PIAA Boys Soccer Championships - 3A' AND b.season_id = 76;

-- =============================================
-- PIAA 4A BRACKET GAMES
-- =============================================
INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
SELECT b.id, v.round_name, v.round_number, v.game_number, v.team1_name, v.team1_score, v.team2_name, v.team2_score, v.game_date::date
FROM playoff_brackets b
CROSS JOIN (VALUES
  -- First Round
  ('First Round', 1, 1, 'Haverford', 3, 'Manheim Township', 1, '2025-11-04'),
  ('First Round', 1, 2, 'Parkland', 3, 'Springfield Township', 2, '2025-11-04'),
  ('First Round', 1, 3, 'La Salle College', 0, 'Emmaus', 1, '2025-11-04'),
  ('First Round', 1, 4, 'Henderson', 2, 'Wyoming Valley West', 1, '2025-11-04'),
  ('First Round', 1, 5, 'Warwick', 1, 'Great Valley', 0, '2025-11-04'),
  ('First Round', 1, 6, 'Seneca Valley', 2, 'McDowell', 1, '2025-11-04'),
  ('First Round', 1, 7, 'Abington', 3, 'Chambersburg', 1, '2025-11-04'),
  ('First Round', 1, 8, 'Fox Chapel', 2, 'Central York', 1, '2025-11-04'),
  -- Quarterfinals
  ('Quarterfinals', 2, 1, 'Parkland', 4, 'Haverford', 3, '2025-11-08'),
  ('Quarterfinals', 2, 2, 'Henderson', 0, 'Emmaus', 0, '2025-11-08'),
  ('Quarterfinals', 2, 3, 'Seneca Valley', 1, 'Warwick', 0, '2025-11-08'),
  ('Quarterfinals', 2, 4, 'Abington', 2, 'Fox Chapel', 0, '2025-11-08'),
  -- Semifinals
  ('Semifinals', 3, 1, 'Henderson', 3, 'Parkland', 1, '2025-11-11'),
  ('Semifinals', 3, 2, 'Abington', 4, 'Seneca Valley', 1, '2025-11-11'),
  -- Championship
  ('Championship', 4, 1, 'Henderson', 1, 'Abington', 3, '2025-11-14')
) AS v(round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
WHERE b.name = '2025 PIAA Boys Soccer Championships - 4A' AND b.season_id = 76;

-- =============================================
-- PPL INVITATIONAL (PIT BRACKET) GAMES
-- =============================================
INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
SELECT b.id, v.round_name, v.round_number, v.game_number, v.team1_name, v.team1_score, v.team2_name, v.team2_score, v.game_date::date
FROM playoff_brackets b
CROSS JOIN (VALUES
  ('Semifinals', 1, 1, 'Prep Charter', 0, 'MAST Charter II', NULL, '2025-10-20'),
  ('Semifinals', 1, 2, 'Olney', 0, 'Mastery Charter South', 2, '2025-10-21'),
  ('Championship', 2, 1, 'MAST Charter II', 2, 'Mastery Charter South', 0, '2025-10-23')
) AS v(round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
WHERE b.name = '2025 PPL Boys Soccer Invitational (PIT Bracket)' AND b.season_id = 76;

-- =============================================
-- PPL VARSITY BRACKET GAMES
-- =============================================
INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
SELECT b.id, v.round_name, v.round_number, v.game_number, v.team1_name, v.team1_score, v.team2_name, v.team2_score, v.game_date::date
FROM playoff_brackets b
CROSS JOIN (VALUES
  -- First Round
  ('First Round', 1, 1, 'Academy at Palumbo', 1, 'Central', 2, '2025-10-14'),
  ('First Round', 1, 2, 'Franklin Learning Center', 2, 'Samuel Fels', 1, '2025-10-14'),
  ('First Round', 1, 3, 'South Philadelphia', 0, 'Masterman', 1, '2025-10-14'),
  ('First Round', 1, 4, 'Frankford', 1, 'John Bartram', 7, '2025-10-14'),
  -- Quarterfinals
  ('Quarterfinals', 2, 1, 'Franklin Learning Center', 0, 'Northeast', 8, '2025-10-16'),
  ('Quarterfinals', 2, 2, 'Central', 2, 'Franklin Towne', 6, '2025-10-16'),
  ('Quarterfinals', 2, 3, 'Masterman', 1, 'George Washington', 2, '2025-10-16'),
  ('Quarterfinals', 2, 4, 'Science Leadership Academy', 2, 'John Bartram', 3, '2025-10-16'),
  -- Semifinals
  ('Semifinals', 3, 1, 'John Bartram', 1, 'Northeast', 2, '2025-10-21'),
  ('Semifinals', 3, 2, 'George Washington', 1, 'Franklin Towne', 2, '2025-10-21'),
  -- Championship
  ('Championship', 4, 1, 'Franklin Towne', 0, 'Northeast', 2, '2025-10-24')
) AS v(round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, game_date)
WHERE b.name = '2025 PPL Boys Varsity Soccer Playoffs' AND b.season_id = 76;

COMMIT;
