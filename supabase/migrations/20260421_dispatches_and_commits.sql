-- Phase 4e / Dispatches + Recruiting — schema additions for Ted's homepage
-- extraction pipeline.
--
-- Context:
--   Ted's homepage (`archive_stories.id = 1941`, `archive_path = newalerts.html`)
--   is a 216K-word rolling alert feed spanning 2005–2013. Scripts in
--   `audits/extract_commits.py` and `audits/extract_dispatches.py` parse this
--   into two new tables:
--     - recruiting_commits:  ~139 college commits (weekly-column + homepage)
--     - archive_dispatches:  ~1,880 date-addressable mini-entries (commit /
--                            memoriam / record / tedbit / etc.)
--   Each mention (archive_story_mentions) and each commit gets linked back
--   to the dispatch it falls inside via body_offset range (for mentions) or
--   text-contains match (for commits).
--
-- Also:
--   - drops NOT NULL on archive_stories.sport_id so cross-sport stories
--     (the homepage) can be tagged honestly.
-- ============================================================================

-- 1. Allow cross-sport stories to have a null sport_id
ALTER TABLE archive_stories ALTER COLUMN sport_id DROP NOT NULL;

-- 2. archive_dispatches  — date-addressable entries extracted from long articles
CREATE TABLE IF NOT EXISTS archive_dispatches (
  id              BIGSERIAL PRIMARY KEY,
  story_id        BIGINT NOT NULL REFERENCES archive_stories(id) ON DELETE CASCADE,
  sequence        INT    NOT NULL,
  dispatch_date   DATE,                      -- parsed date (year inferred)
  raw_date_header TEXT   NOT NULL,           -- "Aug. 18" or "August 18, 2011"
  body_offset     INT    NOT NULL,           -- char offset into body_text
  body_length     INT    NOT NULL,
  body_text       TEXT   NOT NULL,           -- segment between headers
  title           TEXT,                      -- first sentence preview
  category        TEXT,                      -- commit/memoriam/record/tedbit/scrimmage/coaching/tournament/game_report/other
  word_count      INT    GENERATED ALWAYS AS
                         (array_length(regexp_split_to_array(body_text, '\s+'), 1))
                         STORED,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (story_id, sequence)
);
CREATE INDEX IF NOT EXISTS idx_dispatches_date
  ON archive_dispatches(dispatch_date) WHERE dispatch_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dispatches_story_seq
  ON archive_dispatches(story_id, sequence);
CREATE INDEX IF NOT EXISTS idx_dispatches_category
  ON archive_dispatches(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dispatches_fts
  ON archive_dispatches USING GIN (to_tsvector('english', body_text));

-- 3. recruiting_commits — HS → college commitments extracted from archive text
CREATE TABLE IF NOT EXISTS recruiting_commits (
  id                  BIGSERIAL PRIMARY KEY,

  -- Resolved (nullable if fuzzy match failed)
  player_id           BIGINT REFERENCES players(id) ON DELETE SET NULL,
  school_id           BIGINT REFERENCES schools(id) ON DELETE SET NULL,

  -- Raw extracted strings (always populated)
  player_name_raw     TEXT NOT NULL,
  school_name_raw     TEXT,

  destination_college TEXT NOT NULL,
  sport               TEXT,                  -- football / basketball / baseball / ...
  position            TEXT,                  -- PG, RH, 1B, QB, WR, etc.
  class_year          TEXT,                  -- sr / jr / so / fr / 'YY
  commit_date         DATE,
  season_year         INT,

  story_id            BIGINT REFERENCES archive_stories(id) ON DELETE CASCADE,
  snippet             TEXT NOT NULL,         -- ~300-char context
  confidence          NUMERIC(5,2) DEFAULT 100.0,
  match_source        TEXT,                  -- exact_name / unique_last / school_context / raw_only
  verdict             TEXT,                  -- pending / confirmed / duplicate / conflict

  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE (player_name_raw, school_name_raw, destination_college, commit_date)
);
CREATE INDEX IF NOT EXISTS idx_recruiting_commits_player
  ON recruiting_commits(player_id) WHERE player_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_recruiting_commits_school
  ON recruiting_commits(school_id) WHERE school_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_recruiting_commits_year
  ON recruiting_commits(season_year);
CREATE INDEX IF NOT EXISTS idx_recruiting_commits_college
  ON recruiting_commits(destination_college);

-- 4. Link columns back to dispatches (populated by extract scripts)
ALTER TABLE archive_story_mentions
  ADD COLUMN IF NOT EXISTS dispatch_id BIGINT REFERENCES archive_dispatches(id) ON DELETE SET NULL;
ALTER TABLE recruiting_commits
  ADD COLUMN IF NOT EXISTS dispatch_id BIGINT REFERENCES archive_dispatches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_mentions_dispatch
  ON archive_story_mentions(dispatch_id) WHERE dispatch_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_commits_dispatch
  ON recruiting_commits(dispatch_id) WHERE dispatch_id IS NOT NULL;

-- 5. Snapshot column used by image-path rewrite (idempotent safety for Phase E.3)
ALTER TABLE archive_stories ADD COLUMN IF NOT EXISTS body_html_pre_archive_img TEXT;
ALTER TABLE archive_stories ADD COLUMN IF NOT EXISTS image_urls_pre_archive_img TEXT[];
