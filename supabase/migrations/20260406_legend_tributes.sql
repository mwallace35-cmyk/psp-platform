-- Legend Tributes: comments on HOF legend pages
-- Stores both live user-submitted tributes and archived comments imported
-- from the original Ted Silary HTML tribute pages.
--
-- No account required for submission — users provide name + affiliation.
-- Moderation: all new submissions land in 'pending'; admins approve via
-- /admin/tributes queue. Archived rows are seeded with status='approved'.

-- ─────────────────────────────────────────────────────────────────────────
-- legend_tributes
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legend_tributes (
  id              bigserial PRIMARY KEY,
  legend_slug     varchar(200) NOT NULL,
  name            varchar(200) NOT NULL,
  affiliation     varchar(300),                 -- e.g. "Frankford Class of 1978"
  body            text NOT NULL,
  email_optional  varchar(320),                 -- optional contact, never displayed
  source          varchar(32) NOT NULL DEFAULT 'user',
                  -- 'user' | 'ted-silary-archive'
  archived_date   date,                         -- original publication date if known
  status          varchar(20) NOT NULL DEFAULT 'pending',
                  -- 'pending' | 'approved' | 'rejected'
  ip_hash         varchar(64),                  -- sha-256 of IP for rate limiting
  created_at      timestamptz NOT NULL DEFAULT now(),
  approved_at     timestamptz,
  approved_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  CONSTRAINT legend_tributes_source_check
    CHECK (source IN ('user', 'ted-silary-archive')),
  CONSTRAINT legend_tributes_status_check
    CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT legend_tributes_body_length
    CHECK (char_length(body) BETWEEN 2 AND 8000),
  CONSTRAINT legend_tributes_name_length
    CHECK (char_length(name) BETWEEN 1 AND 200)
);

CREATE INDEX IF NOT EXISTS idx_legend_tributes_slug_status
  ON legend_tributes(legend_slug, status);
CREATE INDEX IF NOT EXISTS idx_legend_tributes_status_created
  ON legend_tributes(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_legend_tributes_ip_hash_created
  ON legend_tributes(ip_hash, created_at DESC)
  WHERE ip_hash IS NOT NULL;

ALTER TABLE legend_tributes ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved tributes
CREATE POLICY "legend_tributes_read_approved" ON legend_tributes
  FOR SELECT USING (status = 'approved');

-- Anyone (unauthenticated) can submit a tribute — lands in 'pending'
CREATE POLICY "legend_tributes_insert_pending" ON legend_tributes
  FOR INSERT WITH CHECK (
    status = 'pending'
    AND source = 'user'
  );

-- Authenticated users (admin layout enforces role) can update/read any row
CREATE POLICY "legend_tributes_auth_update" ON legend_tributes
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "legend_tributes_auth_read_all" ON legend_tributes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "legend_tributes_auth_delete" ON legend_tributes
  FOR DELETE USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────
-- legend_allstar_matches
-- Build-time cache of fuzzy matches between All-Star names in legend
-- tributes and rows in the players table. Populated by
-- scripts/legends/match-allstars.ts.
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legend_allstar_matches (
  id              bigserial PRIMARY KEY,
  legend_slug     varchar(200) NOT NULL,
  raw_name        varchar(200) NOT NULL,        -- exactly as it appears in the tribute
  raw_position    varchar(20),
  raw_year        integer,
  player_id       integer REFERENCES players(id) ON DELETE SET NULL,
  match_score     numeric(4,3),                 -- 0..1 confidence
  match_method    varchar(40),                  -- 'exact' | 'fuzzy_name' | 'name_school_year' | 'manual'
  reviewed        boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (legend_slug, raw_name, raw_position, raw_year)
);

CREATE INDEX IF NOT EXISTS idx_legend_allstar_matches_slug
  ON legend_allstar_matches(legend_slug);
CREATE INDEX IF NOT EXISTS idx_legend_allstar_matches_player
  ON legend_allstar_matches(player_id)
  WHERE player_id IS NOT NULL;

ALTER TABLE legend_allstar_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "legend_allstar_matches_public_read" ON legend_allstar_matches
  FOR SELECT USING (true);

CREATE POLICY "legend_allstar_matches_auth_write" ON legend_allstar_matches
  FOR ALL USING (auth.role() = 'authenticated');
