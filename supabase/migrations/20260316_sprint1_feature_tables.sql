-- Sprint 1 Feature Tables Migration
-- 2026-03-16
-- Adds player claims, recruiting updates, coaching staff, API keys, pickems, photos

-- STEP 1: Add columns to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS twitter_handle VARCHAR(100);
ALTER TABLE players ADD COLUMN IF NOT EXISTS instagram_handle VARCHAR(100);
ALTER TABLE players ADD COLUMN IF NOT EXISTS hudl_profile_url VARCHAR(500);
ALTER TABLE players ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE players ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE players ADD COLUMN IF NOT EXISTS recruiting_status VARCHAR(50);

-- STEP 2: Create player_claims table
CREATE TABLE IF NOT EXISTS player_claims (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  claimant_name VARCHAR(255) NOT NULL,
  claimant_email VARCHAR(255) NOT NULL,
  claimant_phone VARCHAR(50),
  relationship VARCHAR(50) NOT NULL DEFAULT 'self',
  parent_name VARCHAR(255),
  parent_email VARCHAR(255),
  measurables JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  recruiting_status VARCHAR(50),
  recruiting_prefs JSONB DEFAULT '{}',
  consent_film BOOLEAN DEFAULT false,
  consent_contact BOOLEAN DEFAULT false,
  consent_academic BOOLEAN DEFAULT false,
  consent_email BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(30) DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Create player_highlights table
CREATE TABLE IF NOT EXISTS player_highlights (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  hudl_url VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  sport_id VARCHAR(30) REFERENCES sports(id),
  season_id INTEGER REFERENCES seasons(id),
  game_id INTEGER REFERENCES games(id),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: Create coaching_staff table
CREATE TABLE IF NOT EXISTS coaching_staff (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id),
  sport_id VARCHAR(30) NOT NULL REFERENCES sports(id),
  coach_name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL DEFAULT 'assistant',
  start_year INTEGER,
  end_year INTEGER,
  bio TEXT,
  photo_url VARCHAR(500),
  twitter_handle VARCHAR(100),
  instagram_handle VARCHAR(100),
  email VARCHAR(255),
  former_player_id INTEGER REFERENCES players(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 5: Create recruiting_updates table
CREATE TABLE IF NOT EXISTS recruiting_updates (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  update_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  source_url VARCHAR(500),
  event_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 6: Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  partner_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) NOT NULL UNIQUE,
  tier VARCHAR(30) NOT NULL DEFAULT 'basic',
  daily_limit INTEGER NOT NULL DEFAULT 100,
  requests_today INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS api_usage_log (
  id SERIAL PRIMARY KEY,
  api_key_id INTEGER REFERENCES api_keys(id),
  endpoint VARCHAR(255),
  response_code INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 7: Create pickems tables
CREATE TABLE IF NOT EXISTS pickem_weeks (
  id SERIAL PRIMARY KEY,
  sport_id VARCHAR(30) REFERENCES sports(id),
  season_id INTEGER REFERENCES seasons(id),
  week_number INTEGER NOT NULL,
  title VARCHAR(255),
  status VARCHAR(30) DEFAULT 'upcoming',
  opens_at TIMESTAMP WITH TIME ZONE,
  closes_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pickem_games (
  id SERIAL PRIMARY KEY,
  week_id INTEGER REFERENCES pickem_weeks(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES games(id),
  home_school_id INTEGER REFERENCES schools(id),
  away_school_id INTEGER REFERENCES schools(id),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pickem_picks (
  id SERIAL PRIMARY KEY,
  week_id INTEGER REFERENCES pickem_weeks(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES pickem_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  picked_school_id INTEGER REFERENCES schools(id),
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

CREATE TABLE IF NOT EXISTS pickem_leaderboard (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  sport_id VARCHAR(30) REFERENCES sports(id),
  season_id INTEGER REFERENCES seasons(id),
  total_picks INTEGER DEFAULT 0,
  correct_picks INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sport_id, season_id)
);

-- STEP 8: Create photo gallery table
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id),
  school_id INTEGER REFERENCES schools(id),
  sport_id VARCHAR(30) REFERENCES sports(id),
  season_id INTEGER REFERENCES seasons(id),
  uploaded_by UUID,
  photo_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  caption TEXT,
  player_tags INTEGER[] DEFAULT '{}',
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 9: Add RLS policies
ALTER TABLE player_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiting_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickem_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickem_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickem_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickem_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Public read for most tables
CREATE POLICY "Public read coaching_staff" ON coaching_staff FOR SELECT USING (true);
CREATE POLICY "Public read player_highlights" ON player_highlights FOR SELECT USING (true);
CREATE POLICY "Public read recruiting_updates" ON recruiting_updates FOR SELECT USING (true);
CREATE POLICY "Public read pickem_weeks" ON pickem_weeks FOR SELECT USING (true);
CREATE POLICY "Public read pickem_games" ON pickem_games FOR SELECT USING (true);
CREATE POLICY "Public read pickem_leaderboard" ON pickem_leaderboard FOR SELECT USING (true);
CREATE POLICY "Public read approved photos" ON photos FOR SELECT USING (approved = true);

-- Authenticated write
CREATE POLICY "Auth insert player_claims" ON player_claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth insert pickem_picks" ON pickem_picks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth read own picks" ON pickem_picks FOR SELECT USING (auth.uid() = user_id);

-- Admin full access
CREATE POLICY "Admin all player_claims" ON player_claims FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all player_highlights" ON player_highlights FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all coaching_staff" ON coaching_staff FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all recruiting_updates" ON recruiting_updates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all api_keys" ON api_keys FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all api_usage_log" ON api_usage_log FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all pickem_weeks" ON pickem_weeks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all pickem_games" ON pickem_games FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all photos" ON photos FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_player_claims_player ON player_claims(player_id);
CREATE INDEX IF NOT EXISTS idx_player_claims_status ON player_claims(status);
CREATE INDEX IF NOT EXISTS idx_player_highlights_player ON player_highlights(player_id);
CREATE INDEX IF NOT EXISTS idx_coaching_staff_school_sport ON coaching_staff(school_id, sport_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_updates_player ON recruiting_updates(player_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_updates_type ON recruiting_updates(update_type);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage_log(api_key_id);
CREATE INDEX IF NOT EXISTS idx_pickem_picks_user ON pickem_picks(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_game ON photos(game_id);
CREATE INDEX IF NOT EXISTS idx_photos_school ON photos(school_id);
CREATE INDEX IF NOT EXISTS idx_players_twitter ON players(twitter_handle) WHERE twitter_handle IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_players_verified ON players(is_verified) WHERE is_verified = true;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_player_claims BEFORE UPDATE ON player_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_player_highlights BEFORE UPDATE ON player_highlights FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_coaching_staff BEFORE UPDATE ON coaching_staff FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_recruiting_updates BEFORE UPDATE ON recruiting_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
