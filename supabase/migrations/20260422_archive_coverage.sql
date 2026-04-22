-- Phases H / K / O — Archive content coverage extension
-- (See ~/.claude/plans/i-want-to-verify-radiant-abelson.md § "Extension: Archive Content Coverage")
--
-- H: tag feature-column series on archive_stories (Only in the Pub, Wyzard of
--    Wyndmoor, Pat the Stat, Where There's a Will, etc.)
-- K: dedicated all_time_team_selections table for decade / N-year / all-time
--    selections Ted made (distinct from single-year awards)
-- O: playoff metadata on existing games rows so we can render brackets without
--    introducing a new tree schema
-- ============================================================================

-- H. Feature-column series tagging
ALTER TABLE archive_stories
  ADD COLUMN IF NOT EXISTS series_name TEXT,
  ADD COLUMN IF NOT EXISTS series_sequence INT;
CREATE INDEX IF NOT EXISTS idx_archive_stories_series
  ON archive_stories(series_name) WHERE series_name IS NOT NULL;


-- K. All-time team selections (distinct from year-scoped awards)
CREATE TABLE IF NOT EXISTS all_time_team_selections (
  id                  BIGSERIAL PRIMARY KEY,
  team_name           TEXT NOT NULL,             -- "2000s Decade Team", "30-Year Team", "50-Year Team"
  sport               TEXT NOT NULL,
  scope               TEXT NOT NULL,             -- "decade" | "n_year" | "all_time" | "pre_2000"
  era_start           INT,
  era_end             INT,
  position_group      TEXT,                      -- "first_team" | "second_team" | "coach" | "honorable_mention"
  player_id           BIGINT REFERENCES players(id) ON DELETE SET NULL,
  player_name_raw     TEXT NOT NULL,
  coach_id            BIGINT REFERENCES coaches(id) ON DELETE SET NULL,
  coach_name_raw      TEXT,
  school_id           BIGINT REFERENCES schools(id) ON DELETE SET NULL,
  position            TEXT,
  source_story_id     BIGINT REFERENCES archive_stories(id) ON DELETE SET NULL,
  source_archive_path TEXT,
  confidence          NUMERIC(5,2) DEFAULT 100.0,
  match_source        TEXT,
  verdict             TEXT DEFAULT 'pending',
  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE (team_name, sport, player_name_raw, position_group)
);
CREATE INDEX IF NOT EXISTS idx_att_sport
  ON all_time_team_selections(sport);
CREATE INDEX IF NOT EXISTS idx_att_player
  ON all_time_team_selections(player_id) WHERE player_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_att_team
  ON all_time_team_selections(team_name);


-- O. Playoff metadata on games (flat rows per game; no bracket-tree table)
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS playoff_round TEXT,       -- "quarterfinal" | "semifinal" | "final" | "state_semi" | "state_final"
  ADD COLUMN IF NOT EXISTS playoff_league TEXT,      -- "CL" | "PL" | "IA" | "PIAA" | "INTER_CITY"
  ADD COLUMN IF NOT EXISTS playoff_division TEXT,    -- "AAAA" | "AAA" | "AA" | "A" | null
  ADD COLUMN IF NOT EXISTS playoff_source_file TEXT;
CREATE INDEX IF NOT EXISTS idx_games_playoff_round
  ON games(playoff_round) WHERE playoff_round IS NOT NULL;
