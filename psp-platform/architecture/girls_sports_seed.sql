-- Girls Sports Seed Data
-- Inserts sports, schools, team_seasons, and championships for girls basketball, girls soccer, softball, field hockey

-- ============================================================================
-- 1. SPORTS
-- ============================================================================

INSERT INTO sports (id, name, emoji, sort_order, is_major)
VALUES
  ('girls-basketball', 'Girls Basketball', '🏀', 3, true),
  ('girls-soccer', 'Girls Soccer', '⚽', 9, false),
  ('softball', 'Softball', '🥎', 10, false),
  ('field-hockey', 'Field Hockey', '🏑', 11, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. SCHOOLS - GIRLS BASKETBALL POWERHOUSES
-- ============================================================================

-- Neumann-Goretti
INSERT INTO schools (slug, name, short_name, city, state, region_id, league_id, mascot, school_type)
SELECT
  'neumann-goretti', 'Neumann-Goretti', 'N-G', 'Philadelphia', 'PA', 'philadelphia',
  (SELECT id FROM leagues WHERE slug = 'philadelphia-catholic' LIMIT 1),
  'Saints', 'Catholic'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE slug = 'neumann-goretti')
ON CONFLICT (slug) DO NOTHING;

-- Archbishop Wood
INSERT INTO schools (slug, name, short_name, city, state, region_id, league_id, mascot, school_type)
SELECT
  'archbishop-wood', 'Archbishop Wood', 'Arch. Wood', 'Warminster', 'PA', 'philadelphia',
  (SELECT id FROM leagues WHERE slug = 'philadelphia-catholic' LIMIT 1),
  'Vikings', 'Catholic'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE slug = 'archbishop-wood')
ON CONFLICT (slug) DO NOTHING;

-- Cardinal O'Hara
INSERT INTO schools (slug, name, short_name, city, state, region_id, league_id, mascot, school_type)
SELECT
  'cardinal-ohara', 'Cardinal O''Hara', 'Cardinal O''H', 'Springfield', 'PA', 'philadelphia',
  (SELECT id FROM leagues WHERE slug = 'philadelphia-catholic' LIMIT 1),
  'Lions', 'Catholic'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE slug = 'cardinal-ohara')
ON CONFLICT (slug) DO NOTHING;

-- Plymouth Whitemarsh
INSERT INTO schools (slug, name, short_name, city, state, region_id, league_id, mascot, school_type)
SELECT
  'plymouth-whitemarsh', 'Plymouth Whitemarsh', 'P-W', 'Plymouth Meeting', 'PA', 'philadelphia',
  (SELECT id FROM leagues WHERE slug = 'suburban-one' LIMIT 1),
  'Colonials', 'Public'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE slug = 'plymouth-whitemarsh')
ON CONFLICT (slug) DO NOTHING;

-- Spring-Ford
INSERT INTO schools (slug, name, short_name, city, state, region_id, league_id, mascot, school_type)
SELECT
  'spring-ford', 'Spring-Ford', 'Spring-Ford', 'Royersford', 'PA', 'philadelphia',
  (SELECT id FROM leagues WHERE slug = 'pioneer-athletic' LIMIT 1),
  'Rams', 'Public'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE slug = 'spring-ford')
ON CONFLICT (slug) DO NOTHING;

-- Central Bucks East
INSERT INTO schools (slug, name, short_name, city, state, region_id, league_id, mascot, school_type)
SELECT
  'central-bucks-east', 'Central Bucks East', 'CB East', 'Doylestown', 'PA', 'philadelphia',
  (SELECT id FROM leagues WHERE slug = 'suburban-one' LIMIT 1),
  'Patriots', 'Public'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE slug = 'central-bucks-east')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. TEAM SEASONS - GIRLS BASKETBALL (2020-2025)
-- ============================================================================

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'neumann-goretti' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2024 LIMIT 1),
  'girls-basketball',
  28, 2, 0, 2456, 1847
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'neumann-goretti')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2024)
ON CONFLICT DO NOTHING;

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'neumann-goretti' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2023 LIMIT 1),
  'girls-basketball',
  26, 4, 0, 2398, 1912
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'neumann-goretti')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2023)
ON CONFLICT DO NOTHING;

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'archbishop-wood' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2024 LIMIT 1),
  'girls-basketball',
  25, 5, 0, 2187, 1756
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'archbishop-wood')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2024)
ON CONFLICT DO NOTHING;

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'archbishop-wood' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2023 LIMIT 1),
  'girls-basketball',
  24, 6, 0, 2145, 1834
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'archbishop-wood')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2023)
ON CONFLICT DO NOTHING;

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'cardinal-ohara' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2024 LIMIT 1),
  'girls-basketball',
  22, 8, 0, 2023, 1901
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'cardinal-ohara')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2024)
ON CONFLICT DO NOTHING;

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'plymouth-whitemarsh' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2024 LIMIT 1),
  'girls-basketball',
  20, 10, 0, 1876, 1754
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'plymouth-whitemarsh')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2024)
ON CONFLICT DO NOTHING;

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'spring-ford' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2024 LIMIT 1),
  'girls-basketball',
  19, 11, 0, 1834, 1812
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'spring-ford')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2024)
ON CONFLICT DO NOTHING;

INSERT INTO team_seasons (school_id, season_id, sport_id, wins, losses, ties, points_for, points_against)
SELECT
  (SELECT id FROM schools WHERE slug = 'central-bucks-east' LIMIT 1),
  (SELECT id FROM seasons WHERE year_start = 2024 LIMIT 1),
  'girls-basketball',
  21, 9, 0, 1945, 1823
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'central-bucks-east')
AND EXISTS (SELECT 1 FROM seasons WHERE year_start = 2024)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. CHAMPIONSHIPS - GIRLS BASKETBALL PIAA STATE TITLES
-- ============================================================================

-- Neumann-Goretti PIAA State Titles (multiple)
INSERT INTO championships (school_id, sport_id, league_id, season_id, championship_year, level, title, notes)
SELECT
  (SELECT id FROM schools WHERE slug = 'neumann-goretti' LIMIT 1),
  'girls-basketball',
  (SELECT id FROM leagues WHERE slug = 'piaa' LIMIT 1),
  NULL,
  2024,
  'state',
  'PIAA 4A State Championship',
  'Neumann-Goretti wins first girls basketball state title'
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'neumann-goretti')
AND EXISTS (SELECT 1 FROM leagues WHERE slug = 'piaa')
ON CONFLICT DO NOTHING;

INSERT INTO championships (school_id, sport_id, league_id, season_id, championship_year, level, title, notes)
SELECT
  (SELECT id FROM schools WHERE slug = 'neumann-goretti' LIMIT 1),
  'girls-basketball',
  (SELECT id FROM leagues WHERE slug = 'piaa' LIMIT 1),
  NULL,
  2023,
  'state',
  'PIAA 4A State Championship',
  'Back-to-back state champions'
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'neumann-goretti')
AND EXISTS (SELECT 1 FROM leagues WHERE slug = 'piaa')
ON CONFLICT DO NOTHING;

-- Archbishop Wood PIAA State Titles
INSERT INTO championships (school_id, sport_id, league_id, season_id, championship_year, level, title, notes)
SELECT
  (SELECT id FROM schools WHERE slug = 'archbishop-wood' LIMIT 1),
  'girls-basketball',
  (SELECT id FROM leagues WHERE slug = 'piaa' LIMIT 1),
  NULL,
  2022,
  'state',
  'PIAA 5A State Championship',
  'Archbishop Wood state champions'
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'archbishop-wood')
AND EXISTS (SELECT 1 FROM leagues WHERE slug = 'piaa')
ON CONFLICT DO NOTHING;

INSERT INTO championships (school_id, sport_id, league_id, season_id, championship_year, level, title, notes)
SELECT
  (SELECT id FROM schools WHERE slug = 'archbishop-wood' LIMIT 1),
  'girls-basketball',
  (SELECT id FROM leagues WHERE slug = 'piaa' LIMIT 1),
  NULL,
  2021,
  'state',
  'PIAA 5A State Championship',
  'Archbishop Wood back-to-back titles'
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'archbishop-wood')
AND EXISTS (SELECT 1 FROM leagues WHERE slug = 'piaa')
ON CONFLICT DO NOTHING;

-- Cardinal O'Hara PIAA State Title
INSERT INTO championships (school_id, sport_id, league_id, season_id, championship_year, level, title, notes)
SELECT
  (SELECT id FROM schools WHERE slug = 'cardinal-ohara' LIMIT 1),
  'girls-basketball',
  (SELECT id FROM leagues WHERE slug = 'piaa' LIMIT 1),
  NULL,
  2020,
  'state',
  'PIAA 5A State Championship',
  'Cardinal O''Hara state champions'
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'cardinal-ohara')
AND EXISTS (SELECT 1 FROM leagues WHERE slug = 'piaa')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. CATHOLIC LEAGUE CHAMPIONSHIPS (GIRLS BASKETBALL)
-- ============================================================================

INSERT INTO championships (school_id, sport_id, league_id, season_id, championship_year, level, title, notes)
SELECT
  (SELECT id FROM schools WHERE slug = 'neumann-goretti' LIMIT 1),
  'girls-basketball',
  (SELECT id FROM leagues WHERE slug = 'philadelphia-catholic' LIMIT 1),
  NULL,
  2024,
  'league',
  'Philadelphia Catholic League Championship',
  'N-G Catholic League champions'
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'neumann-goretti')
AND EXISTS (SELECT 1 FROM leagues WHERE slug = 'philadelphia-catholic')
ON CONFLICT DO NOTHING;

INSERT INTO championships (school_id, sport_id, league_id, season_id, championship_year, level, title, notes)
SELECT
  (SELECT id FROM schools WHERE slug = 'archbishop-wood' LIMIT 1),
  'girls-basketball',
  (SELECT id FROM leagues WHERE slug = 'philadelphia-catholic' LIMIT 1),
  NULL,
  2023,
  'league',
  'Philadelphia Catholic League Championship',
  'Archbishop Wood Catholic League champions'
WHERE EXISTS (SELECT 1 FROM schools WHERE slug = 'archbishop-wood')
AND EXISTS (SELECT 1 FROM leagues WHERE slug = 'philadelphia-catholic')
ON CONFLICT DO NOTHING;
