-- Sprint 6: School Admin Portal, Embeddable Widgets, Sponsors, Annual Awards

-- ============================================================================
-- School Admin Portal
-- ============================================================================

CREATE TABLE IF NOT EXISTS school_admins (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id int NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role varchar(30) NOT NULL DEFAULT 'editor', -- 'editor','admin'
  approved boolean DEFAULT false,
  approved_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, school_id)
);

CREATE INDEX IF NOT EXISTS idx_school_admins_user ON school_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_school_admins_school ON school_admins(school_id);

-- ============================================================================
-- Embeddable Widgets
-- ============================================================================

CREATE TABLE IF NOT EXISTS widget_configs (
  id serial PRIMARY KEY,
  school_id int NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  widget_type varchar(30) NOT NULL, -- 'schedule','roster','record','scores','stats'
  sport_id varchar(50),
  season_id int REFERENCES seasons(id) ON DELETE SET NULL,
  config jsonb DEFAULT '{}',
  embed_key varchar(64) NOT NULL UNIQUE, -- unique key for widget URL
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_widget_configs_school ON widget_configs(school_id);
CREATE INDEX IF NOT EXISTS idx_widget_configs_embed_key ON widget_configs(embed_key);

-- ============================================================================
-- Sponsor Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS sponsors (
  id serial PRIMARY KEY,
  name varchar(200) NOT NULL,
  contact_email varchar(200),
  contact_phone varchar(30),
  logo_url varchar(500),
  website_url varchar(500),
  tier varchar(20) NOT NULL DEFAULT 'basic', -- 'basic','premium','platinum'
  is_active boolean DEFAULT true,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(is_active);

CREATE TABLE IF NOT EXISTS sponsor_placements (
  id serial PRIMARY KEY,
  sponsor_id int NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  placement_type varchar(30) NOT NULL, -- 'school_page','sport_hub','homepage','sidebar','pickem'
  target_entity_type varchar(20), -- 'school','sport','league', null = site-wide
  target_entity_id int,
  creative_html text, -- ad creative HTML (sanitized)
  impression_count int DEFAULT 0,
  click_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sponsor_placements_sponsor ON sponsor_placements(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_placements_active ON sponsor_placements(is_active);
CREATE INDEX IF NOT EXISTS idx_sponsor_placements_placement ON sponsor_placements(placement_type, target_entity_type, target_entity_id);

-- ============================================================================
-- Annual Awards
-- ============================================================================

CREATE TABLE IF NOT EXISTS annual_awards (
  id serial PRIMARY KEY,
  name varchar(200) NOT NULL, -- 'PSP Player of the Year', 'PSP Dynasty Award'
  sport_id varchar(50),
  category varchar(50) NOT NULL, -- 'player','team','coach','community'
  season_id int REFERENCES seasons(id) ON DELETE CASCADE,
  description text,
  nominees jsonb DEFAULT '[]', -- [{player_id, school_id, stats_summary}]
  winner_player_id int REFERENCES players(id) ON DELETE SET NULL,
  winner_school_id int REFERENCES schools(id) ON DELETE SET NULL,
  voting_open boolean DEFAULT false,
  voting_start timestamptz,
  voting_end timestamptz,
  ceremony_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_annual_awards_season ON annual_awards(season_id);
CREATE INDEX IF NOT EXISTS idx_annual_awards_voting_open ON annual_awards(voting_open);

CREATE TABLE IF NOT EXISTS annual_award_votes (
  id serial PRIMARY KEY,
  award_id int NOT NULL REFERENCES annual_awards(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nominee_index int NOT NULL, -- index into nominees JSONB array
  created_at timestamptz DEFAULT now(),
  UNIQUE(award_id, voter_id)
);

CREATE INDEX IF NOT EXISTS idx_annual_award_votes_award ON annual_award_votes(award_id);
CREATE INDEX IF NOT EXISTS idx_annual_award_votes_voter ON annual_award_votes(voter_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- school_admins: authenticated users can read their own admin assignments
ALTER TABLE school_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own school admin assignments"
  ON school_admins FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all school admin assignments"
  ON school_admins FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- widget_configs: public read, admin/school admin write
ALTER TABLE widget_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read public widget configs"
  ON widget_configs FOR SELECT
  USING (true);
CREATE POLICY "Admins and school admins can manage widgets"
  ON widget_configs FOR ALL
  USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
    OR auth.uid() IN (SELECT user_id FROM school_admins WHERE school_id = widget_configs.school_id AND approved = true)
  );

-- sponsors: public read, admin write
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active sponsors"
  ON sponsors FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admins can manage sponsors"
  ON sponsors FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- sponsor_placements: public read, admin write
ALTER TABLE sponsor_placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active sponsor placements"
  ON sponsor_placements FOR SELECT
  USING (is_active = true AND EXISTS (SELECT 1 FROM sponsors WHERE id = sponsor_id AND is_active = true));
CREATE POLICY "Admins can manage sponsor placements"
  ON sponsor_placements FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- annual_awards: public read, admin write
ALTER TABLE annual_awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read annual awards"
  ON annual_awards FOR SELECT
  USING (true);
CREATE POLICY "Admins can manage annual awards"
  ON annual_awards FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- annual_award_votes: authenticated users can vote, anyone can read vote counts
ALTER TABLE annual_award_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can cast votes"
  ON annual_award_votes FOR INSERT
  WITH CHECK (voter_id = auth.uid());
CREATE POLICY "Users can see their own votes"
  ON annual_award_votes FOR SELECT
  USING (voter_id = auth.uid());
CREATE POLICY "Admins can see all votes"
  ON annual_award_votes FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
