-- Missing Tables & Columns Migration
-- Adds potw_winners table and missing columns to hot_takes
-- Created: 2026-03-08

-- ============================================================================
-- HOT TAKES - ADD MISSING COLUMNS
-- The hot_takes table exists but is missing user_handle and type columns
-- that PulseHotTakes.tsx expects
-- ============================================================================

ALTER TABLE hot_takes ADD COLUMN IF NOT EXISTS user_handle varchar(100);
ALTER TABLE hot_takes ADD COLUMN IF NOT EXISTS type varchar(30) DEFAULT 'hot_take';

-- ============================================================================
-- POTW WINNERS TABLE
-- Stores finalized Player of the Week winners (promoted from potw_nominees)
-- Referenced by: community/page.tsx, potw/page.tsx, admin/potw/page.tsx
-- ============================================================================

CREATE TABLE IF NOT EXISTS potw_winners (
  id serial PRIMARY KEY,
  week integer NOT NULL,
  year integer NOT NULL,
  player_name varchar(150) NOT NULL,
  school_name varchar(150),
  sport_id varchar(30) REFERENCES sports(id),
  vote_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_potw_winners_year_week ON potw_winners(year, week);
CREATE INDEX IF NOT EXISTS idx_potw_winners_sport ON potw_winners(sport_id);

ALTER TABLE potw_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "potw_winners_public_read" ON potw_winners
  FOR SELECT USING (true);

CREATE POLICY "potw_winners_authenticated_write" ON potw_winners
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
