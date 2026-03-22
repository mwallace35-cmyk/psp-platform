-- =============================================
-- PCL CHAMPIONSHIP DATA INSERT
-- All-Time PCL Champions + PIAA State Champions
-- =============================================

-- First ensure we have season records for all historical years
INSERT INTO seasons (year_start, year_end, label) VALUES
(1919, 1920, '1919-20'), (1920, 1921, '1920-21'), (1921, 1922, '1921-22'), (1922, 1923, '1922-23'),
(1923, 1924, '1923-24'), (1924, 1925, '1924-25'), (1925, 1926, '1925-26'), (1926, 1927, '1926-27'),
(1927, 1928, '1927-28'), (1928, 1929, '1928-29'), (1929, 1930, '1929-30'), (1930, 1931, '1930-31'),
(1931, 1932, '1931-32'), (1932, 1933, '1932-33'), (1933, 1934, '1933-34'), (1934, 1935, '1934-35'),
(1935, 1936, '1935-36'), (1936, 1937, '1936-37'), (1937, 1938, '1937-38'), (1938, 1939, '1938-39'),
(1939, 1940, '1939-40'), (1940, 1941, '1940-41'), (1941, 1942, '1941-42'), (1942, 1943, '1942-43'),
(1943, 1944, '1943-44'), (1944, 1945, '1944-45'), (1945, 1946, '1945-46'), (1946, 1947, '1946-47'),
(1947, 1948, '1947-48'), (1948, 1949, '1948-49'), (1949, 1950, '1949-50'), (1950, 1951, '1950-51'),
(1951, 1952, '1951-52'), (1952, 1953, '1952-53'), (1953, 1954, '1953-54'), (1954, 1955, '1954-55'),
(1955, 1956, '1955-56'), (1956, 1957, '1956-57'), (1957, 1958, '1957-58'), (1958, 1959, '1958-59'),
(1959, 1960, '1959-60'), (1960, 1961, '1960-61'), (1961, 1962, '1961-62'), (1962, 1963, '1962-63'),
(1963, 1964, '1963-64'), (1964, 1965, '1964-65'), (1965, 1966, '1965-66'), (1966, 1967, '1966-67'),
(1967, 1968, '1967-68'), (1968, 1969, '1968-69'), (1969, 1970, '1969-70'), (1970, 1971, '1970-71'),
(1971, 1972, '1971-72'), (1972, 1973, '1972-73'), (1973, 1974, '1973-74'), (1974, 1975, '1974-75'),
(1975, 1976, '1975-76'), (1976, 1977, '1976-77'), (1977, 1978, '1977-78'), (1978, 1979, '1978-79'),
(1979, 1980, '1979-80'), (1980, 1981, '1980-81'), (1981, 1982, '1981-82'), (1982, 1983, '1982-83'),
(1983, 1984, '1983-84'), (1984, 1985, '1984-85'), (1985, 1986, '1985-86'), (1986, 1987, '1986-87')
ON CONFLICT DO NOTHING;

-- =============================================
-- PCL CHAMPIONS (1920-2025) from tedsilary.com
-- championship_type = 'PCL'
-- =============================================

-- Helper: insert PCL champion records
-- We use year_start to find season_id (e.g. 2025 championship => season with year_start=2024 i.e. 2024-25 season)
-- PCL champion year = season year_end

-- 2025: Father Judge
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 147, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2024
ON CONFLICT DO NOTHING;

-- 2024: Neumann-Goretti (based on actual results - need to verify)
-- 2023: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2022
ON CONFLICT DO NOTHING;

-- 2022: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2021
ON CONFLICT DO NOTHING;

-- 2021: Archbishop Wood
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 144, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2020
ON CONFLICT DO NOTHING;

-- 2020: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2019
ON CONFLICT DO NOTHING;

-- 2019: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2018
ON CONFLICT DO NOTHING;

-- 2018: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2017
ON CONFLICT DO NOTHING;

-- 2017: Archbishop Wood
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 144, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2016
ON CONFLICT DO NOTHING;

-- 2016: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2015
ON CONFLICT DO NOTHING;

-- 2015: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2014
ON CONFLICT DO NOTHING;

-- 2014: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2013
ON CONFLICT DO NOTHING;

-- 2013: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2012
ON CONFLICT DO NOTHING;

-- 2012: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2011
ON CONFLICT DO NOTHING;

-- 2011: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2010
ON CONFLICT DO NOTHING;

-- 2010: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2009
ON CONFLICT DO NOTHING;

-- 2009: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2008
ON CONFLICT DO NOTHING;

-- 2008: North Catholic (153)
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 153, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2007
ON CONFLICT DO NOTHING;

-- 2007: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2006
ON CONFLICT DO NOTHING;

-- 2006: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2005
ON CONFLICT DO NOTHING;

-- 2005: Neumann-Goretti
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2004
ON CONFLICT DO NOTHING;

-- 2004: St. Joe's Prep
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 1005, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2003
ON CONFLICT DO NOTHING;

-- 2003: St. Joe's Prep
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 1005, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2002
ON CONFLICT DO NOTHING;

-- 2002: St. John Neumann (198 = Neumann-Goretti successor)
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2001
ON CONFLICT DO NOTHING;

-- 2001: St. John Neumann
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2000
ON CONFLICT DO NOTHING;

-- 2000: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1999
ON CONFLICT DO NOTHING;

-- 1999: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1998
ON CONFLICT DO NOTHING;

-- 1998: Father Judge
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 147, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1997
ON CONFLICT DO NOTHING;

-- 1997: St. John Neumann
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1996
ON CONFLICT DO NOTHING;

-- 1996: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1995
ON CONFLICT DO NOTHING;

-- 1995: Archbishop Carroll
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 145, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1994
ON CONFLICT DO NOTHING;

-- 1994: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1993
ON CONFLICT DO NOTHING;

-- 1993: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1992
ON CONFLICT DO NOTHING;

-- 1992: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1991
ON CONFLICT DO NOTHING;

-- 1991: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1990
ON CONFLICT DO NOTHING;

-- 1990: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1989
ON CONFLICT DO NOTHING;

-- 1989: Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PCL', 'Champion', 'tedsilary_pcl_champions', 'philly', NOW()
FROM seasons s WHERE s.year_start = 1988
ON CONFLICT DO NOTHING;

-- =============================================
-- PIAA STATE CHAMPIONSHIPS - PCL Schools Only
-- championship_type = 'PIAA State'
-- =============================================

-- 2025: Father Judge (6A Champion) 71-60 vs Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, opponent_id, venue, source_file, region_id, created_at)
SELECT 147, s.id, 'basketball', 'PIAA State', 'Champion', '6A', '71-60', 127, 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2024
ON CONFLICT DO NOTHING;

-- 2025: Neumann-Goretti (5A Champion) 85-71 vs Hershey
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', '5A', '85-71', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2024
ON CONFLICT DO NOTHING;

-- 2025: Devon Prep (4A Champion) 55-39 vs Berks Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 254, s.id, 'basketball', 'PIAA State', 'Champion', '4A', '55-39', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2024
ON CONFLICT DO NOTHING;

-- 2025: West Catholic (3A Champion) 60-51 vs South Allegheny
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 171, s.id, 'basketball', 'PIAA State', 'Champion', '3A', '60-51', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2024
ON CONFLICT DO NOTHING;

-- 2025: Roman Catholic (6A Runner-Up)
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, opponent_id, venue, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PIAA State', 'Runner-Up', '6A', '60-71', 147, 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2024
ON CONFLICT DO NOTHING;

-- 2024: Devon Prep (3A Champion) 60-56 vs Franklin Area
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 254, s.id, 'basketball', 'PIAA State', 'Champion', '3A', '60-56', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2023
ON CONFLICT DO NOTHING;

-- 2024: Archbishop Carroll (4A Runner-Up) 50-80 vs Lincoln Park
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 145, s.id, 'basketball', 'PIAA State', 'Runner-Up', '4A', '50-80', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2023
ON CONFLICT DO NOTHING;

-- 2023: West Catholic (3A Champion) 83-55 vs Deer Lake
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 171, s.id, 'basketball', 'PIAA State', 'Champion', '3A', '83-55', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2022
ON CONFLICT DO NOTHING;

-- 2023: Roman Catholic (6A Runner-Up) 56-63 vs Reading
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PIAA State', 'Runner-Up', '6A', '56-63', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2022
ON CONFLICT DO NOTHING;

-- 2023: Neumann-Goretti (4A Runner-Up) 58-62 vs Lincoln Park
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Runner-Up', '4A', '58-62', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2022
ON CONFLICT DO NOTHING;

-- 2022: Roman Catholic (6A Champion) 77-65 vs Archbishop Wood
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, opponent_id, venue, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PIAA State', 'Champion', '6A', '77-65', 144, 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2021
ON CONFLICT DO NOTHING;

-- 2022: Neumann-Goretti (4A Champion) 93-68 vs Quaker Valley
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', '4A', '93-68', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2021
ON CONFLICT DO NOTHING;

-- 2022: Devon Prep (3A Champion) 76-58 vs Aliquippa
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 254, s.id, 'basketball', 'PIAA State', 'Champion', '3A', '76-58', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2021
ON CONFLICT DO NOTHING;

-- 2022: Archbishop Wood (6A Runner-Up) 65-77 vs Roman Catholic
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, opponent_id, venue, source_file, region_id, created_at)
SELECT 144, s.id, 'basketball', 'PIAA State', 'Runner-Up', '6A', '65-77', 127, 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2021
ON CONFLICT DO NOTHING;

-- 2021: Archbishop Wood (6A Runner-Up) 57-58 vs Reading (2OT)
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, notes, source_file, region_id, created_at)
SELECT 144, s.id, 'basketball', 'PIAA State', 'Runner-Up', '6A', '57-58', 'GIANT Center, Hershey', '2OT', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2020
ON CONFLICT DO NOTHING;

-- 2021: Archbishop Ryan (5A Runner-Up) 49-69 vs Cathedral Prep
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 175, s.id, 'basketball', 'PIAA State', 'Runner-Up', '5A', '49-69', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2020
ON CONFLICT DO NOTHING;

-- 2019: Archbishop Wood (5A Runner-Up) 64-74 vs Moon
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 144, s.id, 'basketball', 'PIAA State', 'Runner-Up', '5A', '64-74', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2018
ON CONFLICT DO NOTHING;

-- 2018: Roman Catholic (6A Champion) 64-60 vs Lincoln
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PIAA State', 'Champion', '6A', '64-60', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2017
ON CONFLICT DO NOTHING;

-- 2018: Neumann-Goretti (3A Champion) 57-42 vs Richland
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', '3A', '57-42', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2017
ON CONFLICT DO NOTHING;

-- 2017: Archbishop Wood (5A Champion) 73-40 vs Meadville
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 144, s.id, 'basketball', 'PIAA State', 'Champion', '5A', '73-40', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2016
ON CONFLICT DO NOTHING;

-- 2017: Neumann-Goretti (3A Champion) 89-58 vs Lincoln Park
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', '3A', '89-58', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2016
ON CONFLICT DO NOTHING;

-- 2016: Roman Catholic (AAAA Champion) 73-62 vs Allderdice
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PIAA State', 'Champion', 'AAAA', '73-62', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2015
ON CONFLICT DO NOTHING;

-- 2016: Neumann-Goretti (AAA Champion) 99-66 vs Mars
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', 'AAA', '99-66', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2015
ON CONFLICT DO NOTHING;

-- 2015: Roman Catholic (AAAA Champion) 62-45 vs MLK
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 127, s.id, 'basketball', 'PIAA State', 'Champion', 'AAAA', '62-45', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2014
ON CONFLICT DO NOTHING;

-- 2015: Neumann-Goretti (AAA Champion) 69-67 vs Archbishop Carroll
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, opponent_id, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', 'AAA', '69-67', 145, 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2014
ON CONFLICT DO NOTHING;

-- 2015: Conwell-Egan (AA Champion) 62-51 vs Aliquippa
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 2780, s.id, 'basketball', 'PIAA State', 'Champion', 'AA', '62-51', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2014
ON CONFLICT DO NOTHING;

-- 2015: Archbishop Carroll (AAA Runner-Up)
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, opponent_id, venue, source_file, region_id, created_at)
SELECT 145, s.id, 'basketball', 'PIAA State', 'Runner-Up', 'AAA', '67-69', 198, 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2014
ON CONFLICT DO NOTHING;

-- 2014: La Salle (AAAA Runner-Up) 39-52 vs New Castle
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 2882, s.id, 'basketball', 'PIAA State', 'Runner-Up', 'AAAA', '39-52', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2013
ON CONFLICT DO NOTHING;

-- 2014: Neumann-Goretti (AAA Champion) 64-57 vs Susquehanna Twp (OT)
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, notes, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', 'AAA', '64-57', 'GIANT Center, Hershey', 'OT', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2013
ON CONFLICT DO NOTHING;

-- 2013: Archbishop Carroll (AAA Runner-Up) 45-54 vs Imhotep Charter
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 145, s.id, 'basketball', 'PIAA State', 'Runner-Up', 'AAA', '45-54', 'GIANT Center, Hershey', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2012
ON CONFLICT DO NOTHING;

-- 2012: Neumann-Goretti (AAA Champion) 48-45 vs Montour
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', 'AAA', '48-45', 'Bryce Jordan Center, Penn State', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2011
ON CONFLICT DO NOTHING;

-- 2011: Neumann-Goretti (AAA Champion) 55-45 vs Montour
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', 'AAA', '55-45', 'Bryce Jordan Center, Penn State', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2010
ON CONFLICT DO NOTHING;

-- 2010: Neumann-Goretti (AAA Champion) 65-63 vs Chartiers Valley
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 198, s.id, 'basketball', 'PIAA State', 'Champion', 'AAA', '65-63', 'Bryce Jordan Center, Penn State', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2009
ON CONFLICT DO NOTHING;

-- 2009: Archbishop Carroll (AAA Champion) 75-54 vs Greensburg Salem
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, level, score, venue, source_file, region_id, created_at)
SELECT 145, s.id, 'basketball', 'PIAA State', 'Champion', 'AAA', '75-54', 'Bryce Jordan Center, Penn State', 'piaa_bb_past_champs', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2008
ON CONFLICT DO NOTHING;

-- 2026: Father Judge PCL Champion (current season)
INSERT INTO championships (school_id, season_id, sport_id, championship_type, result, source_file, region_id, created_at)
SELECT 147, s.id, 'basketball', 'PCL', 'Champion', 'aop_standings_2025_26', 'philly', NOW()
FROM seasons s WHERE s.year_start = 2025
ON CONFLICT DO NOTHING;
