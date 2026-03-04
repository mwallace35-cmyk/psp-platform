-- ============================================================================
-- PSP Feature Expansion Migration
-- Tables: next_level_tracking, social_posts, recruiting_profiles
-- ============================================================================

-- Next Level Tracking (Our Guys)
CREATE TABLE IF NOT EXISTS next_level_tracking (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  person_name VARCHAR(200) NOT NULL,
  high_school_id INTEGER REFERENCES schools(id),
  sport_id VARCHAR(30) REFERENCES sports(id),
  current_level VARCHAR(30) NOT NULL DEFAULT 'college', -- college, pro, coaching, staff
  current_org VARCHAR(200),
  current_role VARCHAR(200),
  college VARCHAR(200),
  college_sport VARCHAR(50),
  pro_team VARCHAR(200),
  pro_league VARCHAR(30), -- NFL, NBA, MLB, MLS, other
  draft_info VARCHAR(300),
  social_twitter VARCHAR(200),
  social_instagram VARCHAR(200),
  featured BOOLEAN DEFAULT false,
  bio_note TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, retired, inactive
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_next_level_level ON next_level_tracking(current_level);
CREATE INDEX IF NOT EXISTS idx_next_level_league ON next_level_tracking(pro_league);
CREATE INDEX IF NOT EXISTS idx_next_level_featured ON next_level_tracking(featured);

-- Social Posts (curated embeds)
CREATE TABLE IF NOT EXISTS social_posts (
  id SERIAL PRIMARY KEY,
  tracking_id INTEGER NOT NULL REFERENCES next_level_tracking(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL, -- twitter, instagram
  post_url VARCHAR(500) NOT NULL,
  post_embed_html TEXT,
  caption_preview VARCHAR(300),
  media_url VARCHAR(500),
  posted_at TIMESTAMPTZ,
  curated_at TIMESTAMPTZ DEFAULT now(),
  featured BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_social_posts_tracking ON social_posts(tracking_id);

-- Recruiting Profiles
CREATE TABLE IF NOT EXISTS recruiting_profiles (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  sport_id VARCHAR(30) REFERENCES sports(id),
  class_year INTEGER NOT NULL,
  position VARCHAR(50),
  star_rating INTEGER CHECK (star_rating BETWEEN 2 AND 5),
  composite_rating NUMERIC(6,4),
  status VARCHAR(30) DEFAULT 'unsigned', -- unsigned, committed, signed, enrolled, decommitted
  committed_school VARCHAR(200),
  committed_date DATE,
  offers TEXT[],
  ranking_247 INTEGER,
  ranking_rivals INTEGER,
  ranking_on3 INTEGER,
  ranking_espn INTEGER,
  url_247 VARCHAR(500),
  url_rivals VARCHAR(500),
  url_on3 VARCHAR(500),
  url_maxpreps VARCHAR(500),
  url_hudl VARCHAR(500),
  height VARCHAR(10),
  weight INTEGER,
  highlights_url VARCHAR(500),
  last_updated TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruiting_class ON recruiting_profiles(class_year);
CREATE INDEX IF NOT EXISTS idx_recruiting_sport ON recruiting_profiles(sport_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_status ON recruiting_profiles(status);
CREATE INDEX IF NOT EXISTS idx_recruiting_stars ON recruiting_profiles(star_rating);

-- RLS Policies
ALTER TABLE next_level_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiting_profiles ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read next_level_tracking" ON next_level_tracking FOR SELECT USING (true);
CREATE POLICY "Public read social_posts" ON social_posts FOR SELECT USING (true);
CREATE POLICY "Public read recruiting_profiles" ON recruiting_profiles FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin full next_level_tracking" ON next_level_tracking FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);
CREATE POLICY "Admin full social_posts" ON social_posts FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);
CREATE POLICY "Admin full recruiting_profiles" ON recruiting_profiles FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);
