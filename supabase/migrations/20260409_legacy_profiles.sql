-- Migration: Legacy Career Pages
-- Creates legacy_profiles and legacy_relations tables.
-- Apply manually: psql $DATABASE_URL < supabase/migrations/20260409_legacy_profiles.sql

-- ============================================================
-- TABLE: legacy_profiles
-- One row per person; binds player / coach / legend identities
-- ============================================================
CREATE TABLE IF NOT EXISTS legacy_profiles (
  id              bigserial PRIMARY KEY,
  slug            varchar(160) NOT NULL UNIQUE,
  display_name    varchar(200) NOT NULL,
  era_summary     varchar(280),
  hero_photo_url  text,
  birth_year      smallint,
  death_year      smallint,                    -- NULL if living
  primary_sport   varchar(20),
  primary_school_id integer REFERENCES schools(id) ON DELETE SET NULL,

  -- identity bindings (at least one required)
  player_id       integer REFERENCES players(id) ON DELETE SET NULL,
  coach_id        integer REFERENCES coaches(id) ON DELETE SET NULL,
  legend_slug     varchar(200),               -- matches legend MDX frontmatter slug

  -- optional narrative prose (e.g. migrated from memoriam)
  narrative_md    text,

  eligibility_reason varchar(40) NOT NULL,    -- 'player_and_coach' | 'legend_and_player'
                                              -- | 'legend_and_coach' | 'manual' | 'dynasty_member'
  is_published    boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  seo_title       varchar(200),
  seo_description varchar(320),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT legacy_profiles_has_identity
    CHECK (player_id IS NOT NULL OR coach_id IS NOT NULL OR legend_slug IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_legacy_profiles_player_id
  ON legacy_profiles(player_id) WHERE player_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_legacy_profiles_coach_id
  ON legacy_profiles(coach_id) WHERE coach_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_legacy_profiles_legend
  ON legacy_profiles(legend_slug) WHERE legend_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_legacy_profiles_published
  ON legacy_profiles(is_published, published_at DESC);

-- ============================================================
-- TABLE: legacy_relations
-- Directed edges for family + coaching lineage
-- Stored bidirectionally (father_of + inverse son_of)
-- ============================================================
CREATE TABLE IF NOT EXISTS legacy_relations (
  id              bigserial PRIMARY KEY,
  from_profile_id bigint NOT NULL REFERENCES legacy_profiles(id) ON DELETE CASCADE,
  to_profile_id   bigint NOT NULL REFERENCES legacy_profiles(id) ON DELETE CASCADE,
  relation        varchar(30) NOT NULL,
                  -- 'father_of' | 'son_of' | 'brother_of' | 'spouse_of'
                  -- | 'coached_by' | 'coach_of' | 'mentored_by' | 'mentor_of'
  note            varchar(200),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (from_profile_id, to_profile_id, relation),
  CHECK (from_profile_id <> to_profile_id)
);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE legacy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_relations ENABLE ROW LEVEL SECURITY;

-- Public read for published profiles
DROP POLICY IF EXISTS legacy_profiles_public_read ON legacy_profiles;
CREATE POLICY legacy_profiles_public_read
  ON legacy_profiles FOR SELECT
  USING (is_published = true);

-- Authenticated write for editors
DROP POLICY IF EXISTS legacy_profiles_auth_write ON legacy_profiles;
CREATE POLICY legacy_profiles_auth_write
  ON legacy_profiles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Relations: public read (relation visible if at least one endpoint is published)
DROP POLICY IF EXISTS legacy_relations_public_read ON legacy_relations;
CREATE POLICY legacy_relations_public_read
  ON legacy_relations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM legacy_profiles lp
      WHERE lp.id = legacy_relations.from_profile_id
        AND lp.is_published = true
    )
  );

DROP POLICY IF EXISTS legacy_relations_auth_write ON legacy_relations;
CREATE POLICY legacy_relations_auth_write
  ON legacy_relations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
