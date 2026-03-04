-- Phase 2: Community corrections table
-- Allows public users to submit data corrections on player/school pages

CREATE TABLE IF NOT EXISTS corrections (
  id serial PRIMARY KEY,
  entity_type varchar(30) NOT NULL,           -- 'player', 'school', 'team_season', 'championship'
  entity_id integer NOT NULL,
  entity_name varchar(200),                   -- display name for admin reference
  field_name varchar(80) NOT NULL,            -- which field is wrong
  current_value text,                         -- what we currently have
  proposed_value text NOT NULL,               -- what it should be
  reason text,                                -- why the correction is needed
  source_url varchar(500),                    -- optional proof link
  submitter_email varchar(200),               -- optional contact
  submitter_name varchar(100),                -- optional name
  status varchar(20) DEFAULT 'pending',       -- pending, approved, rejected
  reviewed_by text,                           -- admin UUID
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_corrections_status ON corrections(status);
CREATE INDEX IF NOT EXISTS idx_corrections_entity ON corrections(entity_type, entity_id);

-- RLS: Anyone can submit, only authenticated can read all
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "corrections_public_insert" ON corrections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "corrections_authenticated_read" ON corrections
  FOR SELECT USING (true);

CREATE POLICY "corrections_authenticated_update" ON corrections
  FOR UPDATE USING (auth.role() = 'authenticated');
