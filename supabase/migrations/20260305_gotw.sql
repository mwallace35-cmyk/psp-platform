-- Game of the Week tables
-- Mirrors POTW pattern: nominees + votes + winners

-- ============================================================================
-- GOTW NOMINEES (weekly matchup nominations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS gotw_nominees (
  id serial PRIMARY KEY,
  home_team varchar(150) NOT NULL,
  away_team varchar(150) NOT NULL,
  home_school_id integer REFERENCES schools(id),
  away_school_id integer REFERENCES schools(id),
  sport_id varchar(30) REFERENCES sports(id),
  season_id integer REFERENCES seasons(id),
  week_label varchar(50) NOT NULL,
  game_date date,
  game_time varchar(50),
  venue varchar(200),
  context text,  -- e.g. "Catholic League Championship", "Rivalry Game", "Key Matchup"
  vote_count integer DEFAULT 0,
  is_winner boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gotw_nominees_sport ON gotw_nominees(sport_id);
CREATE INDEX IF NOT EXISTS idx_gotw_nominees_week ON gotw_nominees(week_label);

-- ============================================================================
-- GOTW VOTES (browser fingerprint dedup)
-- ============================================================================
CREATE TABLE IF NOT EXISTS gotw_votes (
  id serial PRIMARY KEY,
  gotw_nominee_id integer NOT NULL REFERENCES gotw_nominees(id) ON DELETE CASCADE,
  ip_hash varchar(64) NOT NULL,
  week_label varchar(50) NOT NULL,
  voted_at timestamptz DEFAULT now(),
  UNIQUE(gotw_nominee_id, ip_hash, week_label)
);

CREATE INDEX IF NOT EXISTS idx_gotw_votes_nominee ON gotw_votes(gotw_nominee_id);
CREATE INDEX IF NOT EXISTS idx_gotw_votes_week ON gotw_votes(week_label);

-- ============================================================================
-- GOTW WINNERS (archived past winners)
-- ============================================================================
CREATE TABLE IF NOT EXISTS gotw_winners (
  id serial PRIMARY KEY,
  home_team varchar(150) NOT NULL,
  away_team varchar(150) NOT NULL,
  home_score integer,
  away_score integer,
  sport_id varchar(30) REFERENCES sports(id),
  week integer NOT NULL,
  year integer NOT NULL,
  vote_count integer DEFAULT 0,
  context text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE gotw_nominees ENABLE ROW LEVEL SECURITY;
ALTER TABLE gotw_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gotw_winners ENABLE ROW LEVEL SECURITY;

-- Nominees: public read
CREATE POLICY "gotw_nominees_public_read" ON gotw_nominees
  FOR SELECT USING (true);

-- Nominees: authenticated write
CREATE POLICY "gotw_nominees_authenticated_write" ON gotw_nominees
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Votes: public insert + read
CREATE POLICY "gotw_votes_public_insert" ON gotw_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "gotw_votes_public_read" ON gotw_votes
  FOR SELECT USING (true);

-- Winners: public read
CREATE POLICY "gotw_winners_public_read" ON gotw_winners
  FOR SELECT USING (true);

-- Winners: authenticated write
CREATE POLICY "gotw_winners_authenticated_write" ON gotw_winners
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- RPC: Atomically increment vote count
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_gotw_votes(nominee_id integer)
RETURNS void AS $$
BEGIN
  UPDATE gotw_nominees
  SET vote_count = vote_count + 1
  WHERE id = nominee_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
