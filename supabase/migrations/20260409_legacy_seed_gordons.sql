-- Seed: Gordon Family Legacy Profiles (Brett + Drew)
-- Apply after 20260409_legacy_profiles.sql
-- Review all INSERTs before applying — player_id=193692 should be verified against the players table.
--
-- Idempotent: all inserts use ON CONFLICT DO NOTHING or NOT EXISTS guards.

-- ============================================================
-- Step 1: Ensure Brett has a coaches row (he may not yet)
-- ============================================================
INSERT INTO coaches (slug, name, bio)
VALUES (
  'brett-gordon',
  'Brett Gordon',
  'La Salle College HS head football coach; former record-setting QB (1995-97) and offensive coordinator under his father Drew Gordon.'
)
ON CONFLICT (slug) DO NOTHING;

-- Head Coach stint (2018–present; OC tenure deferred pending confirmation)
INSERT INTO coaching_stints (coach_id, school_id, sport_id, start_year, end_year, role)
SELECT c.id, s.id, 1, 2018, NULL, 'Head Coach'
FROM coaches c
JOIN schools s ON s.slug = 'la-salle-college'
WHERE c.slug = 'brett-gordon'
ON CONFLICT DO NOTHING;

-- ============================================================
-- Step 2: Insert legacy_profiles rows for Brett and Drew
-- ============================================================
-- Brett Gordon — player + coach (player_id=193692 per plan; verify against players table)
INSERT INTO legacy_profiles (
  slug, display_name, era_summary,
  primary_sport, primary_school_id,
  player_id, coach_id, legend_slug,
  narrative_md,
  eligibility_reason, is_published, published_at,
  seo_title, seo_description
)
SELECT
  'brett-gordon',
  'Brett Gordon',
  'La Salle QB 1995-97 → OC → Head Coach',
  'football',
  (SELECT id FROM schools WHERE slug = 'la-salle-college'),
  193692,
  (SELECT id FROM coaches WHERE slug = 'brett-gordon'),
  NULL,
  -- Narrative preserved from the mislabeled memoriam entry
  $narrative$# Brett Gordon

## La Salle High's Record-Setting Quarterback, 1995-97

In 1999, the *Daily News* named Brett the top high school player for the century. Among the reasons: he led the Explorers to a record 32-game winning streak (and two Catholic League championships), set a new state record for TD passes with 84, and broke the previous city leagues record for career passing yardage by more than 1,800 yards.

### Career Statistics

Brett quarterbacked La Salle through three outstanding seasons:

- **1995**: 7-0 league, 11-2 overall
- **1996**: Undefeated regular season, Catholic League champions
- **1997**: Catholic League champions, extended winning streak

His career accomplishments included:
- State record 84 touchdown passes
- City leagues career passing yardage record (broke previous mark by 1,800+ yards)
- 32-game winning streak
- Two Catholic League championships
- Named Daily News Player of the Century (1999)

This tribute page includes stories, results, statistics, recaps of playoff games and all players/coaches on those three teams.$narrative$,
  'player_and_coach',
  true,
  now(),
  'Brett Gordon — La Salle QB & Head Coach | PSP Career Arc',
  'Brett Gordon set Pennsylvania state records at La Salle (1995-97) and now leads the Explorers as head coach. Full career arc: player, OC, and head coach.'
WHERE NOT EXISTS (
  SELECT 1 FROM legacy_profiles WHERE slug = 'brett-gordon'
);

-- Drew Gordon — legend + coach
INSERT INTO legacy_profiles (
  slug, display_name, era_summary,
  primary_sport, primary_school_id,
  player_id, coach_id, legend_slug,
  eligibility_reason, is_published, published_at,
  seo_title, seo_description
)
SELECT
  'drew-gordon',
  'Drew Gordon',
  'La Salle player → long-time head coach → HOF legend',
  'football',
  (SELECT id FROM schools WHERE slug = 'la-salle-college'),
  NULL,
  (SELECT id FROM coaches WHERE slug = 'drew-gordon'),
  'drew-gordon',
  'legend_and_coach',
  true,
  now(),
  'Drew Gordon — La Salle Head Coach & HOF Legend | PSP Career Arc',
  'Drew Gordon went 91-26 at La Salle (2006-14), winning 10 championships including the 2009 PIAA state title. Full legacy arc.'
WHERE NOT EXISTS (
  SELECT 1 FROM legacy_profiles WHERE slug = 'drew-gordon'
);

-- ============================================================
-- Step 3: Insert bidirectional family edges
-- ============================================================
WITH b AS (SELECT id FROM legacy_profiles WHERE slug = 'brett-gordon'),
     d AS (SELECT id FROM legacy_profiles WHERE slug = 'drew-gordon')
INSERT INTO legacy_relations (from_profile_id, to_profile_id, relation, note)
VALUES
  ((SELECT id FROM d), (SELECT id FROM b), 'father_of', 'Father-son La Salle dynasty'),
  ((SELECT id FROM b), (SELECT id FROM d), 'son_of',   'Father-son La Salle dynasty')
ON CONFLICT (from_profile_id, to_profile_id, relation) DO NOTHING;
