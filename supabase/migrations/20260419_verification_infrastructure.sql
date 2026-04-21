-- Verification infrastructure: provenance, verdicts, gold set, alias resolver.
-- Migration: 20260419_verification_infrastructure
-- Context:
--   Phase 2 of the Ted Silary Archive verification project (see
--   ~/.claude/plans/i-want-to-verify-radiant-abelson.md). Adds six tables so
--   every future stat import and every verification run produces a durable
--   audit trail pinned to a specific archive snapshot.
--
--   This migration is strictly ADDITIVE — no existing table is altered, no
--   data is deleted, and every new table is CREATE TABLE IF NOT EXISTS. Safe
--   to re-run.
--
--   Phantom-player cleanup (8K NULL-name rows) is deliberately NOT in this
--   migration; it needs a separate 26-FK-reference audit first (see
--   audits/phantom_players_audit.py, forthcoming).
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. archive_files — the content-addressable catalog
-- ============================================================================
-- One row per (archive_version, relative_path). sha256 is the content hash; a
-- given hash can appear in multiple archive versions if identical content was
-- preserved in both (common: v1 + v2 contain the same football HTML files).
--
-- Paths are relative to the manifest's archive_root at the time the manifest
-- was built. Full provenance (which archive root, which manifest) sits in
-- archive_version plus verification_runs.archive_manifest_hash.

CREATE TABLE IF NOT EXISTS public.archive_files (
  archive_version   VARCHAR(20)  NOT NULL,       -- 'v1', 'v2', 'v2_external'
  relative_path     TEXT         NOT NULL,
  sha256            CHAR(64)     NOT NULL,
  size_bytes        BIGINT       NOT NULL,
  encoding          VARCHAR(20),                 -- utf-8 | windows-1252 | latin-1 | null for binary
  kind              VARCHAR(20)  NOT NULL DEFAULT 'content',  -- content | other | ignore (matches preserve_archive.py)
  manifest_hash     CHAR(64)     NOT NULL,       -- the manifest this row came from
  first_seen_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (archive_version, relative_path)
);

CREATE INDEX IF NOT EXISTS idx_archive_files_sha256 ON public.archive_files(sha256);
CREATE INDEX IF NOT EXISTS idx_archive_files_manifest ON public.archive_files(manifest_hash);
-- Trigram on relative_path for fuzzy URL lookup when we need to match a
-- parsed HTML path to its archive entry despite encoding variations.
CREATE INDEX IF NOT EXISTS idx_archive_files_path_trgm ON public.archive_files USING GIN (relative_path gin_trgm_ops);

COMMENT ON TABLE public.archive_files IS 'Content-addressable catalog of every file in every preserved archive version. Populated from audits/archive_manifest*.json.';


-- ============================================================================
-- 2. verification_runs — one row per classification/audit invocation
-- ============================================================================
-- Every verdict writer pins the parser git SHA and the archive manifest hash
-- it ran against. That triple (run_id, parser_git_sha, archive_manifest_hash)
-- makes every verdict reproducible years from now.

CREATE TABLE IF NOT EXISTS public.verification_runs (
  id                     UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_tag                TEXT        NOT NULL,             -- 'post-infra-baseline', 'remediation-batch-003', ...
  entity_scope           TEXT        NOT NULL,             -- 'football_game_player_stats', 'awards', 'coaching_records', ...
  parser_git_sha         VARCHAR(40),                      -- git rev-parse HEAD at run time
  archive_manifest_hash  CHAR(64)    NOT NULL,             -- pins the corpus snapshot
  started_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at           TIMESTAMPTZ,
  stats                  JSONB       NOT NULL DEFAULT '{}'::jsonb,  -- verdict counts, elapsed, etc.
  notes                  TEXT,
  created_by             TEXT        NOT NULL DEFAULT 'system'
);

CREATE INDEX IF NOT EXISTS idx_verification_runs_scope_ts ON public.verification_runs(entity_scope, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_runs_manifest ON public.verification_runs(archive_manifest_hash);

COMMENT ON TABLE public.verification_runs IS 'One row per verification invocation. Pins parser version + archive snapshot for reproducibility.';


-- ============================================================================
-- 3. verdicts — one row per (entity, run)
-- ============================================================================
-- Polymorphic: (entity_type, entity_id) points at any existing row in
-- football_player_seasons / game_player_stats / awards / championships / etc.
-- We don't enforce a FK because entity_type varies; entity_id is BIGINT which
-- covers the SERIAL/UUID range used across the schema (UUIDs go in
-- entity_uuid). Reads should always filter by entity_type.
--
-- archive_version + archive_path + archive_sha256 pin the exact evidence file
-- this verdict was drawn from. archive_snippet holds a short quote so we can
-- eyeball the source without reopening the HTML.

CREATE TABLE IF NOT EXISTS public.verdicts (
  id                BIGSERIAL   PRIMARY KEY,
  run_id            UUID        NOT NULL REFERENCES public.verification_runs(id) ON DELETE CASCADE,
  entity_type       TEXT        NOT NULL,
  entity_id         BIGINT,                                -- for integer PKs
  entity_uuid       UUID,                                  -- for UUID PKs (same row uses one or the other)
  verdict           TEXT        NOT NULL,                  -- see CHECK below
  confidence        NUMERIC(5,2) NOT NULL DEFAULT 100.0
                    CHECK (confidence >= 0 AND confidence <= 100),
  archive_version   VARCHAR(20),
  archive_path      TEXT,
  archive_sha256    CHAR(64),
  archive_snippet   TEXT,
  observed_value    JSONB,                                 -- what the DB had at verification time
  expected_value    JSONB,                                 -- what the archive said
  diff_summary      TEXT,
  notes             TEXT,
  verified_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_by       TEXT        NOT NULL DEFAULT 'system', -- 'system' | 'mike' | reviewer name
  CHECK (
    verdict IN (
      'MATCH_EXACT',            -- bytes/values identical
      'MATCH_NORMALIZED',       -- match after whitespace/encoding normalization
      'MISMATCH_VALUE_MINOR',   -- known-benign delta (off-by-one null etc.)
      'MISMATCH_VALUE',         -- values differ; no alternate archive match
      'MISMATCH_GAME',          -- classic column-shift bug — stats on wrong game
      'PLAYER_NOT_FOUND',       -- player not in archive for this (school, year)
      'GAME_NOT_FOUND',         -- DB game not in archive schedule
      'PLAYER_MISSING_IN_GAME', -- player in archive but not in matched game
      'NO_ARCHIVE',             -- no archive HTML covers this entity (pre-2000 etc.)
      'CONFLICT',               -- multiple sources disagree; both stored
      'DUPLICATE',              -- same content recorded twice
      'PENDING_REVIEW'          -- flagged for Mike / SME
    )
  ),
  CHECK (
    -- Exactly one id column populated (polymorphic: int or uuid).
    (entity_id IS NOT NULL AND entity_uuid IS NULL) OR
    (entity_id IS NULL AND entity_uuid IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_verdicts_entity ON public.verdicts(entity_type, entity_id) WHERE entity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_verdicts_entity_uuid ON public.verdicts(entity_type, entity_uuid) WHERE entity_uuid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_verdicts_run ON public.verdicts(run_id);
CREATE INDEX IF NOT EXISTS idx_verdicts_verdict ON public.verdicts(verdict);
CREATE INDEX IF NOT EXISTS idx_verdicts_archive ON public.verdicts(archive_version, archive_sha256);
CREATE INDEX IF NOT EXISTS idx_verdicts_latest ON public.verdicts(entity_type, entity_id, verified_at DESC)
  WHERE entity_id IS NOT NULL;

COMMENT ON TABLE public.verdicts IS 'Polymorphic audit log: one row per (entity, verification run) with full provenance. History is preserved — do not UPDATE, always INSERT.';


-- ============================================================================
-- 4. entity_aliases — unified canonical-name resolver
-- ============================================================================
-- Replaces the scattered alias logic in school_normalizer.py, _mapper_dicts.py
-- explicit_map, data/school_name_aliases.md, etc. Every downstream parser
-- should resolve names through this table + a Python helper that does NFKD
-- normalization + fuzzy match with confidence scoring.

CREATE TABLE IF NOT EXISTS public.entity_aliases (
  id                BIGSERIAL    PRIMARY KEY,
  entity_type       VARCHAR(20)  NOT NULL,  -- 'school' | 'player' | 'coach'
  canonical_id      BIGINT       NOT NULL,  -- FK to schools/players/coaches (not enforced — polymorphic)
  variant_name      TEXT         NOT NULL,  -- the raw string as it appears in some source
  normalized_name   TEXT         NOT NULL,  -- NFKD lowercased + stripped-punct (computed by ingesting code)
  source            VARCHAR(60)  NOT NULL,  -- 'manual' | 'school_normalizer_py' | 'explicit_map_football' | ...
  confidence        NUMERIC(5,2) NOT NULL DEFAULT 100.0
                    CHECK (confidence >= 0 AND confidence <= 100),
  active            BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by        TEXT         NOT NULL DEFAULT 'system',
  notes             TEXT,
  CHECK (entity_type IN ('school', 'player', 'coach'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_entity_aliases_variant
  ON public.entity_aliases(entity_type, canonical_id, variant_name);
CREATE INDEX IF NOT EXISTS idx_entity_aliases_normalized
  ON public.entity_aliases(entity_type, normalized_name);
CREATE INDEX IF NOT EXISTS idx_entity_aliases_norm_trgm
  ON public.entity_aliases USING GIN (normalized_name gin_trgm_ops);

COMMENT ON TABLE public.entity_aliases IS 'Canonical name resolver. Every variant Ted or a scraper produced maps back to a single canonical_id with confidence.';


-- ============================================================================
-- 5. gold_set — hand-verified regression rows
-- ============================================================================
-- Mike hand-certifies 200 rows across sports/stat types. Every verdict_engine
-- run checks the gold set first; any non-MATCH_EXACT aborts the run. This is
-- the regression harness that makes all downstream cleanup safe.

CREATE TABLE IF NOT EXISTS public.gold_set (
  id                  BIGSERIAL    PRIMARY KEY,
  entity_type         TEXT         NOT NULL,
  entity_id           BIGINT,
  entity_uuid         UUID,
  expected_value      JSONB        NOT NULL,  -- canonical answer (what verdict_engine must observe)
  archive_version     VARCHAR(20)  NOT NULL,
  archive_path        TEXT         NOT NULL,
  archive_sha256      CHAR(64)     NOT NULL,
  archive_snippet     TEXT         NOT NULL,  -- quote of the supporting HTML
  screenshot_path     TEXT,                   -- local path or R2 key to an image of the source
  rationale           TEXT,                   -- why this row was chosen (canary, edge case, etc.)
  certified_by        TEXT         NOT NULL DEFAULT 'mike',
  certified_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  active              BOOLEAN      NOT NULL DEFAULT TRUE,
  CHECK (
    (entity_id IS NOT NULL AND entity_uuid IS NULL) OR
    (entity_id IS NULL AND entity_uuid IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_gold_set_entity
  ON public.gold_set(entity_type, entity_id, entity_uuid);
CREATE INDEX IF NOT EXISTS idx_gold_set_active
  ON public.gold_set(entity_type) WHERE active;

COMMENT ON TABLE public.gold_set IS 'Hand-verified regression rows. Every verdict run must MATCH_EXACT on 100% of active gold rows or abort.';


-- ============================================================================
-- 6. source_precedence — conflict resolution policy
-- ============================================================================
-- When two sources disagree, which one wins? This encodes Mike's written
-- policy. Time-bounded rules (Ted for 2000-2013, MaxPreps for 2019+).
-- 'mike_reviews' means no silent winner — the conflict is surfaced in the
-- verdict queue.

CREATE TABLE IF NOT EXISTS public.source_precedence (
  id                SERIAL      PRIMARY KEY,
  entity_type       TEXT        NOT NULL,
  source_a          VARCHAR(40) NOT NULL,  -- 'tedsilary' | 'maxpreps' | 'piaa' | 'pennlive' | 'ap' | 'upi' | 'pfw' | 'pfn'
  source_b          VARCHAR(40) NOT NULL,
  winner            VARCHAR(40) NOT NULL,  -- source_a | source_b | 'mike_reviews' | 'preserve_both'
  applies_from_year INT,                   -- inclusive; NULL means no lower bound
  applies_to_year   INT,                   -- inclusive; NULL means no upper bound
  rationale         TEXT        NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by        TEXT        NOT NULL DEFAULT 'mike',
  CHECK (winner IN ('source_a', 'source_b', 'mike_reviews', 'preserve_both')),
  CHECK (applies_from_year IS NULL OR applies_to_year IS NULL OR applies_from_year <= applies_to_year)
);

CREATE INDEX IF NOT EXISTS idx_source_precedence_lookup
  ON public.source_precedence(entity_type, source_a, source_b);

COMMENT ON TABLE public.source_precedence IS 'Conflict resolution policy: when source A and B disagree on an entity in a year window, which one wins.';


-- ============================================================================
-- 7. Seed initial source_precedence policies
-- ============================================================================
-- These reflect Mike's stated ground-truth philosophy (Apr 17 interview): Ted
-- primary, cross-reference preserves BOTH with CONFLICT verdict when sources
-- disagree. Exceptions: MaxPreps is authoritative for post-2018 basketball
-- (Ted didn't cover it), PIAA is the official state championship source.

-- winner is a meta-reference ('source_a' | 'source_b' | 'preserve_both' |
-- 'mike_reviews'), NOT the source name. Readers resolve the winner by looking
-- up which column contains the winning source name.

INSERT INTO public.source_precedence
  (entity_type,                 source_a,    source_b,    winner,          applies_from_year, applies_to_year, rationale)
VALUES
  ('football_game_player_stats', 'tedsilary', 'maxpreps',  'source_a',      2000, 2018,
   'Ted hand-verified the 2000-2018 football corpus; MaxPreps is derivative.'),
  ('football_game_player_stats', 'maxpreps',  'tedsilary', 'source_a',      2019, NULL,
   'Ted stopped maintaining post-2018; MaxPreps is primary.'),
  ('basketball_game_player_stats','maxpreps', 'tedsilary', 'preserve_both', NULL, NULL,
   '82K tedsilary-bb rows have unknown provenance; preserve both until audited.'),
  ('championship',               'piaa',      'tedsilary', 'source_a',      1970, NULL,
   'PIAA is the official PA state championship record.'),
  ('championship',               'tedsilary', 'piaa',      'source_b',      1970, NULL,
   'Reverse-order lookup: PIAA still wins.'),
  ('award',                      'tedsilary', 'ap',        'preserve_both', NULL, NULL,
   'All-State: multiple selectors (AP/UPI/PFW/PFN/PennLive) each pick differently; preserve every selection.'),
  ('award',                      'tedsilary', 'upi',       'preserve_both', NULL, NULL,
   'Same.'),
  ('award',                      'tedsilary', 'pfw',       'preserve_both', NULL, NULL,
   'Same.'),
  ('award',                      'tedsilary', 'pfn',       'preserve_both', NULL, NULL,
   'Same.'),
  ('award',                      'tedsilary', 'pennlive',  'preserve_both', NULL, NULL,
   'PennLive All-State (2018+) is one voice among several.'),
  ('player_identity',            'tedsilary', 'maxpreps',  'mike_reviews',  NULL, NULL,
   'Name spellings and school assignments need human review when they disagree.')
ON CONFLICT DO NOTHING;


COMMIT;

-- ============================================================================
-- Revert (manual, if needed):
-- ============================================================================
-- DROP TABLE IF EXISTS public.source_precedence CASCADE;
-- DROP TABLE IF EXISTS public.gold_set           CASCADE;
-- DROP TABLE IF EXISTS public.entity_aliases     CASCADE;
-- DROP TABLE IF EXISTS public.verdicts           CASCADE;
-- DROP TABLE IF EXISTS public.verification_runs  CASCADE;
-- DROP TABLE IF EXISTS public.archive_files      CASCADE;
