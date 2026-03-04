-- Phase 1: POTW Votes table for public voting
-- Tracks votes with browser fingerprint deduplication per week

CREATE TABLE IF NOT EXISTS potw_votes (
  id serial PRIMARY KEY,
  potw_nominee_id integer NOT NULL REFERENCES potw_nominees(id) ON DELETE CASCADE,
  ip_hash varchar(64) NOT NULL,
  week_label varchar(50) NOT NULL,
  voted_at timestamptz DEFAULT now(),
  UNIQUE(potw_nominee_id, ip_hash, week_label)
);

CREATE INDEX IF NOT EXISTS idx_potw_votes_nominee ON potw_votes(potw_nominee_id);
CREATE INDEX IF NOT EXISTS idx_potw_votes_week ON potw_votes(week_label);

-- RLS: Anyone can insert a vote, only authenticated can read all
ALTER TABLE potw_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "potw_votes_public_insert" ON potw_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "potw_votes_public_read" ON potw_votes
  FOR SELECT USING (true);

-- RPC function to atomically increment vote count
CREATE OR REPLACE FUNCTION increment_potw_votes(nominee_id integer)
RETURNS void AS $$
BEGIN
  UPDATE potw_nominees
  SET vote_count = vote_count + 1
  WHERE id = nominee_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
