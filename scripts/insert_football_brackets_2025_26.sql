-- Insert 2025-26 Football Playoff Brackets
-- season_id = 76, sport_id = 'football'
-- DO NOT touch basketball brackets

BEGIN;

-- Insert bracket records
INSERT INTO playoff_brackets (sport_id, season_id, name, bracket_type, classification)
VALUES
  ('football', 76, '2025 PIAA Football Championship (6A)', 'piaa_6a', '6A'),
  ('football', 76, '2025 PIAA Football Championship (5A)', 'piaa_5a', '5A'),
  ('football', 76, '2025 PIAA Football Championship (4A)', 'piaa_4a', '4A'),
  ('football', 76, '2025 PIAA Football Championship (3A)', 'piaa_3a', '3A'),
  ('football', 76, '2025 PIAA Football Championship (2A)', 'piaa_2a', '2A'),
  ('football', 76, '2025 PIAA Football Championship (1A)', 'piaa_1a', '1A'),
  ('football', 76, '2025 PCL Football Playoffs', 'pcl', NULL);

-- Get bracket IDs
DO $$
DECLARE
  v_6a_id INT;
  v_5a_id INT;
  v_4a_id INT;
  v_3a_id INT;
  v_2a_id INT;
  v_1a_id INT;
  v_pcl_id INT;
BEGIN
  SELECT id INTO v_6a_id FROM playoff_brackets WHERE sport_id='football' AND season_id=76 AND bracket_type='piaa_6a';
  SELECT id INTO v_5a_id FROM playoff_brackets WHERE sport_id='football' AND season_id=76 AND bracket_type='piaa_5a';
  SELECT id INTO v_4a_id FROM playoff_brackets WHERE sport_id='football' AND season_id=76 AND bracket_type='piaa_4a';
  SELECT id INTO v_3a_id FROM playoff_brackets WHERE sport_id='football' AND season_id=76 AND bracket_type='piaa_3a';
  SELECT id INTO v_2a_id FROM playoff_brackets WHERE sport_id='football' AND season_id=76 AND bracket_type='piaa_2a';
  SELECT id INTO v_1a_id FROM playoff_brackets WHERE sport_id='football' AND season_id=76 AND bracket_type='piaa_1a';
  SELECT id INTO v_pcl_id FROM playoff_brackets WHERE sport_id='football' AND season_id=76 AND bracket_type='pcl';

  -- ========================================
  -- PIAA 6A GAMES
  -- ========================================
  -- First Round
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_6a_id, 'First Round', 1, 1, 'Parkland', 17, 'Easton Area', 42, NULL, '2025-11-14'),
    (v_6a_id, 'First Round', 1, 2, 'Imhotep Charter', 16, 'La Salle College', 31, NULL, '2025-11-15'),
    (v_6a_id, 'First Round', 1, 3, 'Coatesville', 14, 'Pennridge', 17, NULL, '2025-11-14'),
    (v_6a_id, 'First Round', 1, 4, 'Neshaminy', 7, 'North Penn', 35, NULL, '2025-11-14'),
    (v_6a_id, 'First Round', 1, 5, 'Wilson', 7, 'Central York', 42, NULL, '2025-11-14'),
    (v_6a_id, 'First Round', 1, 6, 'Manheim Township', 7, 'Harrisburg', 34, NULL, '2025-11-15'),
    (v_6a_id, 'First Round', 1, 7, 'Wilkes-Barre', 0, 'State College', 52, NULL, '2025-11-15'),
    (v_6a_id, 'First Round', 1, 8, 'North Allegheny', 7, 'Central Catholic', 42, NULL, '2025-11-15');

  -- Quarterfinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_6a_id, 'Quarterfinals', 2, 1, 'Easton Area', 7, 'La Salle College', 49, NULL, '2025-11-21'),
    (v_6a_id, 'Quarterfinals', 2, 2, 'Pennridge', 14, 'North Penn', 21, NULL, '2025-11-21'),
    (v_6a_id, 'Quarterfinals', 2, 3, 'Central York', 10, 'Harrisburg', 34, NULL, '2025-11-21'),
    (v_6a_id, 'Quarterfinals', 2, 4, 'State College', 21, 'Central Catholic', 42, NULL, '2025-11-22');

  -- Semifinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_6a_id, 'Semifinals', 3, 1, 'La Salle College', 49, 'North Penn', 14, NULL, '2025-11-29'),
    (v_6a_id, 'Semifinals', 3, 2, 'Harrisburg', 14, 'Central Catholic', 32, NULL, '2025-11-29');

  -- Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_6a_id, 'Championship', 4, 1, 'La Salle College', 34, 'Central Catholic', 20, NULL, '2025-12-06');

  -- ========================================
  -- PIAA 5A GAMES
  -- ========================================
  -- First Round
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_5a_id, 'First Round', 1, 1, 'Delaware Valley', 42, 'Hollidaysburg', 56, NULL, '2025-11-14'),
    (v_5a_id, 'First Round', 1, 2, 'Whitehall', 7, 'Roman Catholic', 49, NULL, '2025-11-14'),
    (v_5a_id, 'First Round', 1, 3, 'Strath Haven', 10, 'Springfield', 26, NULL, '2025-11-14'),
    (v_5a_id, 'First Round', 1, 4, 'Bayard Rustin', 13, 'Chester', 27, NULL, '2025-11-15'),
    (v_5a_id, 'First Round', 1, 5, 'Moon Area', 24, 'Pine-Richland', 34, NULL, '2025-11-14'),
    (v_5a_id, 'First Round', 1, 6, 'Upper St. Clair', 6, 'Peters Township', 31, NULL, '2025-11-14'),
    (v_5a_id, 'First Round', 1, 7, 'New Oxford', 12, 'Solanco', 43, NULL, '2025-11-14'),
    (v_5a_id, 'First Round', 1, 8, 'Exeter Township', 0, 'Bishop McDevitt', 42, NULL, '2025-11-14');

  -- Quarterfinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_5a_id, 'Quarterfinals', 2, 1, 'Hollidaysburg', 20, 'Roman Catholic', 55, NULL, '2025-11-21'),
    (v_5a_id, 'Quarterfinals', 2, 2, 'Chester', 12, 'Springfield', 34, NULL, '2025-11-22'),
    (v_5a_id, 'Quarterfinals', 2, 3, 'Pine-Richland', 19, 'Peters Township', 20, NULL, '2025-11-22'),
    (v_5a_id, 'Quarterfinals', 2, 4, 'Solanco', 20, 'Bishop McDevitt', 38, NULL, '2025-11-21');

  -- Semifinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_5a_id, 'Semifinals', 3, 1, 'Roman Catholic', 48, 'Springfield', 20, NULL, '2025-11-28'),
    (v_5a_id, 'Semifinals', 3, 2, 'Peters Township', 28, 'Bishop McDevitt', 31, NULL, '2025-11-29');

  -- Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_5a_id, 'Championship', 4, 1, 'Roman Catholic', 28, 'Bishop McDevitt', 6, NULL, '2025-12-05');

  -- ========================================
  -- PIAA 4A GAMES
  -- ========================================
  -- First Round
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_4a_id, 'First Round', 1, 1, 'Bethlehem Catholic', 28, 'Southern Lehigh', 49, NULL, '2025-11-14'),
    (v_4a_id, 'First Round', 1, 2, 'Bellefonte', 13, 'Shamokin Area', 42, NULL, '2025-11-14'),
    (v_4a_id, 'First Round', 1, 3, 'Bishop Shanahan', 36, 'North Pocono', 40, NULL, '2025-11-14'),
    (v_4a_id, 'First Round', 1, 4, 'West Philadelphia', 6, 'Cardinal O''Hara', 34, NULL, '2025-11-15'),
    (v_4a_id, 'First Round', 1, 5, 'Wyomissing', 35, 'Susquehanna Township', 37, NULL, '2025-11-14'),
    (v_4a_id, 'First Round', 1, 6, 'West York Area', 14, 'Twin Valley', 45, NULL, '2025-11-14'),
    (v_4a_id, 'First Round', 1, 7, 'Punxsutawney', 14, 'Oil City', 47, NULL, '2025-11-14'),
    (v_4a_id, 'First Round', 1, 8, 'McKeesport', 12, 'Aliquippa', 21, NULL, '2025-11-14');

  -- Quarterfinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_4a_id, 'Quarterfinals', 2, 1, 'Shamokin Area', 27, 'Southern Lehigh', 30, NULL, '2025-11-21'),
    (v_4a_id, 'Quarterfinals', 2, 2, 'North Pocono', 6, 'Cardinal O''Hara', 28, NULL, '2025-11-21'),
    (v_4a_id, 'Quarterfinals', 2, 3, 'Susquehanna Township', 21, 'Twin Valley', 41, NULL, '2025-11-21'),
    (v_4a_id, 'Quarterfinals', 2, 4, 'Oil City', 6, 'Aliquippa', 28, NULL, '2025-11-22');

  -- Semifinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_4a_id, 'Semifinals', 3, 1, 'Southern Lehigh', 28, 'Cardinal O''Hara', 24, NULL, '2025-11-28'),
    (v_4a_id, 'Semifinals', 3, 2, 'Twin Valley', 28, 'Aliquippa', 24, NULL, '2025-11-29');

  -- Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_4a_id, 'Championship', 4, 1, 'Southern Lehigh', 43, 'Twin Valley', 21, NULL, '2025-12-04');

  -- ========================================
  -- PIAA 3A GAMES
  -- ========================================
  -- First Round
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_3a_id, 'First Round', 1, 1, 'Berks Catholic', 0, 'Trinity', 17, NULL, '2025-11-14'),
    (v_3a_id, 'First Round', 1, 2, 'Mifflinburg', 21, 'Scranton Prep', 28, NULL, '2025-11-14'),
    (v_3a_id, 'First Round', 1, 3, 'Notre Dame-Green Pond', 14, 'Northwestern Lehigh', 35, NULL, '2025-11-14'),
    (v_3a_id, 'First Round', 1, 4, 'North Catholic', 24, 'Avonworth', 44, NULL, '2025-11-14'),
    (v_3a_id, 'First Round', 1, 5, 'Central Valley', 0, 'Imani Christian Academy', 48, NULL, '2025-11-14'),
    (v_3a_id, 'First Round', 1, 6, 'Brockway', 0, 'Penn Cambria', 27, NULL, '2025-11-14'),
    (v_3a_id, 'First Round', 1, 7, 'Hickory', 17, 'Sharon', 20, NULL, '2025-11-14');

  -- Quarterfinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_3a_id, 'Quarterfinals', 2, 1, 'Neumann-Goretti', 22, 'Trinity', 26, NULL, '2025-11-21'),
    (v_3a_id, 'Quarterfinals', 2, 2, 'Scranton Prep', 14, 'Northwestern Lehigh', 42, NULL, '2025-11-21'),
    (v_3a_id, 'Quarterfinals', 2, 3, 'Imani Christian Academy', 6, 'Avonworth', 30, NULL, '2025-11-22'),
    (v_3a_id, 'Quarterfinals', 2, 4, 'Sharon', 7, 'Penn Cambria', 12, NULL, '2025-11-21');

  -- Semifinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_3a_id, 'Semifinals', 3, 1, 'Trinity', 13, 'Northwestern Lehigh', 48, NULL, '2025-11-28'),
    (v_3a_id, 'Semifinals', 3, 2, 'Penn Cambria', 15, 'Avonworth', 31, NULL, '2025-11-28');

  -- Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_3a_id, 'Championship', 4, 1, 'Northwestern Lehigh', 7, 'Avonworth', 31, NULL, '2025-12-06');

  -- ========================================
  -- PIAA 2A GAMES
  -- ========================================
  -- First Round
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_2a_id, 'First Round', 1, 1, 'Chestnut Ridge', 22, 'Steelton-Highspire', 50, NULL, '2025-11-14'),
    (v_2a_id, 'First Round', 1, 2, 'Troy', 0, 'Southern Columbia Area', 42, NULL, '2025-11-14'),
    (v_2a_id, 'First Round', 1, 3, 'Schuylkill Haven', 31, 'Williams Valley', 34, NULL, '2025-11-14'),
    (v_2a_id, 'First Round', 1, 4, 'Lakeland', 7, 'Lansdale Catholic', 43, NULL, '2025-11-15'),
    (v_2a_id, 'First Round', 1, 5, 'Karns City', 20, 'Farrell', 48, NULL, '2025-11-14'),
    (v_2a_id, 'First Round', 1, 6, 'Bishop McCort', 7, 'Richland', 14, NULL, '2025-11-15'),
    (v_2a_id, 'First Round', 1, 7, 'Washington', 19, 'Seton LaSalle', 27, NULL, '2025-11-14'),
    (v_2a_id, 'First Round', 1, 8, 'Western Beaver', 7, 'Steel Valley', 34, NULL, '2025-11-14');

  -- Quarterfinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_2a_id, 'Quarterfinals', 2, 1, 'Steelton-Highspire', 26, 'Southern Columbia Area', 55, NULL, '2025-11-21'),
    (v_2a_id, 'Quarterfinals', 2, 2, 'Williams Valley', 7, 'Lansdale Catholic', 33, NULL, '2025-11-21'),
    (v_2a_id, 'Quarterfinals', 2, 3, 'Richland', 14, 'Farrell', 32, NULL, '2025-11-21'),
    (v_2a_id, 'Quarterfinals', 2, 4, 'Steel Valley', 14, 'Seton LaSalle', 21, NULL, '2025-11-22');

  -- Semifinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_2a_id, 'Semifinals', 3, 1, 'Lansdale Catholic', 7, 'Southern Columbia Area', 24, NULL, '2025-11-28'),
    (v_2a_id, 'Semifinals', 3, 2, 'Seton LaSalle', 19, 'Farrell', 40, NULL, '2025-11-29');

  -- Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_2a_id, 'Championship', 4, 1, 'Southern Columbia Area', 43, 'Farrell', 22, NULL, '2025-12-05');

  -- ========================================
  -- PIAA 1A GAMES
  -- ========================================
  -- First Round
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_1a_id, 'First Round', 1, 1, 'Juniata Valley', 0, 'Bishop Guilfoyle', 62, NULL, '2025-11-14'),
    (v_1a_id, 'First Round', 1, 2, 'Meyersdale', 0, 'Westinghouse', 44, NULL, '2025-11-14'),
    (v_1a_id, 'First Round', 1, 3, 'York Catholic', 20, 'Belmont Charter', 36, NULL, '2025-11-15'),
    (v_1a_id, 'First Round', 1, 4, 'Line Mountain', 20, 'Lackawanna Trail', 31, NULL, '2025-11-15'),
    (v_1a_id, 'First Round', 1, 5, 'Fort Cherry', 14, 'Laurel', 24, NULL, '2025-11-14'),
    (v_1a_id, 'First Round', 1, 6, 'Bishop Canevin', 22, 'Clairton', 42, NULL, '2025-11-14'),
    (v_1a_id, 'First Round', 1, 7, 'Wilmington', 22, 'Greenville', 25, NULL, '2025-11-15'),
    (v_1a_id, 'First Round', 1, 8, 'Redbank Valley', 19, 'Port Allegany', 41, NULL, '2025-11-14');

  -- Quarterfinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_1a_id, 'Quarterfinals', 2, 1, 'Westinghouse', 6, 'Bishop Guilfoyle', 7, NULL, '2025-11-21'),
    (v_1a_id, 'Quarterfinals', 2, 2, 'Lackawanna Trail', 40, 'Belmont Charter', 52, NULL, '2025-11-21'),
    (v_1a_id, 'Quarterfinals', 2, 3, 'Laurel', 6, 'Clairton', 8, NULL, '2025-11-22'),
    (v_1a_id, 'Quarterfinals', 2, 4, 'Port Allegany', 28, 'Greenville', 36, NULL, '2025-11-21');

  -- Semifinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_1a_id, 'Semifinals', 3, 1, 'Belmont Charter', 0, 'Bishop Guilfoyle', 35, NULL, '2025-11-29'),
    (v_1a_id, 'Semifinals', 3, 2, 'Greenville', 0, 'Clairton', 57, NULL, '2025-11-28');

  -- Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_1a_id, 'Championship', 4, 1, 'Bishop Guilfoyle', 3, 'Clairton', 35, NULL, '2025-12-04');

  -- ========================================
  -- PCL FOOTBALL PLAYOFF GAMES
  -- ========================================
  -- 6A Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_pcl_id, '6A Championship', 1, 1, 'La Salle College', 24, 'St. Joseph''s Prep', 14, NULL, '2025-11-01');

  -- 5A Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_pcl_id, '5A Championship', 1, 2, 'Roman Catholic', 63, 'Father Judge', 21, NULL, '2025-11-01');

  -- 4A Semifinals
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_pcl_id, '4A Semifinals', 1, 3, 'Cardinal O''Hara', 44, 'Archbishop Ryan', 21, NULL, '2025-11-01'),
    (v_pcl_id, '4A Semifinals', 1, 4, 'Bonner & Prendie', 35, 'Archbishop Wood', 7, NULL, '2025-11-01');

  -- 4A Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_pcl_id, '4A Championship', 2, 1, 'Cardinal O''Hara', 24, 'Bonner & Prendie', 3, NULL, '2025-11-08');

  -- 3A Championship
  INSERT INTO playoff_bracket_games (bracket_id, round_name, round_number, game_number, team1_name, team1_score, team2_name, team2_score, winner_school_id, game_date)
  VALUES
    (v_pcl_id, '3A Championship', 1, 5, 'Neumann-Goretti', 20, 'Conwell-Egan', 7, NULL, '2025-11-01');

END;
$$;

COMMIT;
