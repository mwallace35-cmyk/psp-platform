-- Add division and piaa_class columns to schools table
-- Division = league-internal subdivision (e.g., American, Independence, Liberty, National for Public League)
-- PIAA Class = PIAA enrollment-based classification (6A, 5A, 4A, 3A, 2A, A)

ALTER TABLE schools ADD COLUMN IF NOT EXISTS division VARCHAR(50);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS piaa_class VARCHAR(10);

-- ═══════════════════════════════════════════════════════════════
-- PUBLIC LEAGUE DIVISIONS (2025 Football)
-- Source: pafootballnews.com/league-rankings/philadelphia-public/
-- ═══════════════════════════════════════════════════════════════

-- American Division
UPDATE schools SET division = 'American' WHERE name ILIKE '%Audenried%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'American' WHERE name ILIKE '%Kipp%DuBois%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'American' WHERE name ILIKE '%Thomas Edison%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'American' WHERE name ILIKE '%Vaux%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'American' WHERE name ILIKE '%Samuel%Fels%' OR name ILIKE '%Fels%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'American' WHERE name ILIKE 'Overbrook%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'American' WHERE name ILIKE '%Dobbins%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');

-- Independence Division
UPDATE schools SET division = 'Independence' WHERE name ILIKE '%Imhotep%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Independence' WHERE name ILIKE '%Abraham Lincoln%' OR name ILIKE '%Lincoln High%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Independence' WHERE name ILIKE '%Bartram%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Independence' WHERE name ILIKE 'Northeast%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Independence' WHERE name ILIKE '%Simon Gratz%' OR name ILIKE '%Gratz%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Independence' WHERE name ILIKE '%Martin Luther King%' OR name ILIKE '%MLK%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');

-- Liberty Division
UPDATE schools SET division = 'Liberty' WHERE name ILIKE '%George Washington%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Liberty' WHERE name ILIKE '%Belmont Charter%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Liberty' WHERE name ILIKE '%Boys Latin%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Liberty' WHERE name ILIKE '%Philadelphia Central%' OR name ILIKE '%Central High%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Liberty' WHERE name ILIKE '%Mastery Charter North%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Liberty' WHERE name ILIKE 'Olney%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'Liberty' WHERE name ILIKE '%West Philadelphia%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');

-- National Division
UPDATE schools SET division = 'National' WHERE name ILIKE '%School of the Future%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'National' WHERE name ILIKE 'Frankford%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'National' WHERE name ILIKE '%Academy at Palumbo%' OR name ILIKE '%Palumbo%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'National' WHERE name ILIKE 'Roxborough%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'National' WHERE name ILIKE '%South Philadelphia%' OR name ILIKE '%South Phila%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'National' WHERE name ILIKE '%Benjamin Franklin%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');
UPDATE schools SET division = 'National' WHERE name ILIKE 'Kensington%' AND league_id = (SELECT id FROM leagues WHERE slug = 'public-league');

-- ═══════════════════════════════════════════════════════════════
-- PIAA CLASSIFICATIONS (2024-25 Football — based on enrollment)
-- Major programs with known classifications
-- ═══════════════════════════════════════════════════════════════

-- Class 6A (largest schools)
UPDATE schools SET piaa_class = '6A' WHERE slug IN (
  'northeast', 'central-high', 'la-salle-college-high-school',
  'north-penn', 'pennsbury', 'council-rock-north', 'council-rock-south',
  'downingtown-west', 'downingtown-east', 'coatesville'
);

-- Class 5A
UPDATE schools SET piaa_class = '5A' WHERE slug IN (
  'st-josephs-prep', 'archbishop-wood', 'roman-catholic',
  'upper-dublin', 'cheltenham', 'plymouth-whitemarsh',
  'springfield-montco', 'conestoga'
);

-- Class 4A
UPDATE schools SET piaa_class = '4A' WHERE slug IN (
  'neumann-goretti', 'father-judge', 'bonner-prendergast',
  'cardinal-ohara', 'west-catholic', 'lansdale-catholic',
  'pope-john-paul-ii', 'devon-prep'
);

-- Class 3A
UPDATE schools SET piaa_class = '3A' WHERE slug IN (
  'imhotep-charter', 'martin-luther-king', 'abraham-lincoln',
  'john-bartram', 'frankford', 'roxborough',
  'south-philadelphia', 'overbrook', 'simon-gratz'
);

-- Class 2A
UPDATE schools SET piaa_class = '2A' WHERE slug IN (
  'academy-at-palumbo', 'george-washington', 'benjamin-franklin',
  'kensington', 'thomas-edison', 'audenried-charter',
  'dobbins-randolph-vo-tech', 'samuel-s-fels', 'vaux-big-picture',
  'school-of-the-future', 'kipp-dubois'
);

-- Class 1A
UPDATE schools SET piaa_class = '1A' WHERE slug IN (
  'belmont-charter', 'boys-latin-charter', 'mastery-charter-north',
  'olney', 'west-philadelphia', 'philadelphia-central'
);

-- PAISAA (Independent schools — separate from PIAA)
UPDATE schools SET piaa_class = 'PAISAA' WHERE slug IN (
  'haverford-school', 'episcopal-academy', 'germantown-academy',
  'malvern-prep', 'penn-charter', 'agnes-irwin',
  'baldwin-school', 'shipley-school'
);
