-- Blueprint Recommendations Migration
-- Adds content tables, data freshness tracking, and RLS policies
-- Created: 2026-03-04

-- ============================================================================
-- ARTICLES TABLE
-- ============================================================================

CREATE TABLE articles (
  id serial PRIMARY KEY,
  slug varchar(200) UNIQUE NOT NULL,
  title varchar(300) NOT NULL,
  excerpt text,
  body text NOT NULL,
  author_name varchar(100) DEFAULT 'PSP Staff',
  sport_id varchar(30) REFERENCES sports(id),
  school_id integer REFERENCES schools(id),
  player_id integer REFERENCES players(id),
  championship_id integer REFERENCES championships(id),
  featured_image_url varchar(500),
  status varchar(20) DEFAULT 'draft',
  featured_at timestamptz,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_sport ON articles(sport_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_featured ON articles(featured_at);

-- ============================================================================
-- ARTICLE MENTIONS TABLE
-- ============================================================================

CREATE TABLE article_mentions (
  id serial PRIMARY KEY,
  article_id integer NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  entity_type varchar(30) NOT NULL,
  entity_id integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, entity_type, entity_id)
);

CREATE INDEX idx_article_mentions_entity ON article_mentions(entity_type, entity_id);

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================

CREATE TABLE events (
  id serial PRIMARY KEY,
  title varchar(300) NOT NULL,
  description text,
  sport_id varchar(30) REFERENCES sports(id),
  event_type varchar(50) DEFAULT 'game',
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  location varchar(300),
  registration_url varchar(500),
  status varchar(20) DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- POTW NOMINEES TABLE
-- ============================================================================

CREATE TABLE potw_nominees (
  id serial PRIMARY KEY,
  player_id integer REFERENCES players(id),
  player_name varchar(150) NOT NULL,
  school_name varchar(150),
  sport_id varchar(30) REFERENCES sports(id),
  season_id integer REFERENCES seasons(id),
  week_label varchar(50),
  stat_line text,
  votes integer DEFAULT 0,
  is_winner boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ALTER GAMES TABLE - ADD DATA FRESHNESS COLUMNS
-- ============================================================================

ALTER TABLE games ADD COLUMN data_source varchar(50);
ALTER TABLE games ADD COLUMN last_verified_at timestamptz;

-- ============================================================================
-- RLS POLICIES - PUBLIC READ (NON-DELETED)
-- ============================================================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE potw_nominees ENABLE ROW LEVEL SECURITY;

-- Articles: public read (published, non-deleted)
CREATE POLICY "articles_public_read" ON articles
  FOR SELECT USING (
    status = 'published' AND deleted_at IS NULL
  );

-- Articles: authenticated full CRUD
CREATE POLICY "articles_authenticated_crud" ON articles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Article Mentions: public read
CREATE POLICY "article_mentions_public_read" ON article_mentions
  FOR SELECT USING (true);

-- Article Mentions: authenticated write
CREATE POLICY "article_mentions_authenticated_write" ON article_mentions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "article_mentions_authenticated_delete" ON article_mentions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Events: public read (non-deleted, upcoming or past)
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (
    deleted_at IS NULL
  );

-- Events: authenticated full CRUD
CREATE POLICY "events_authenticated_crud" ON events
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- POTW Nominees: public read
CREATE POLICY "potw_nominees_public_read" ON potw_nominees
  FOR SELECT USING (true);

-- POTW Nominees: authenticated write
CREATE POLICY "potw_nominees_authenticated_write" ON potw_nominees
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGER FOR ARTICLE UPDATED_AT
-- ============================================================================

CREATE TRIGGER articles_updated_at_trigger
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER FOR EVENTS UPDATED_AT
-- ============================================================================

CREATE TRIGGER events_updated_at_trigger
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
