-- Phase 4: User Profiles, Comments, and Comment Flags
-- Enables public user registration, threaded article comments, and moderation

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name varchar(100),
  avatar_url varchar(500),
  school_affiliation varchar(200),
  favorite_sports text[] DEFAULT '{}',
  role varchar(20) DEFAULT 'user',   -- user, moderator, admin
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_public_read" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "user_profiles_own_update" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "user_profiles_own_insert" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Comments (threaded via parent_comment_id)
CREATE TABLE IF NOT EXISTS comments (
  id serial PRIMARY KEY,
  article_id integer NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id integer REFERENCES comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  status varchar(20) DEFAULT 'pending',  -- pending, approved, rejected
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
CREATE POLICY "comments_read_approved" ON comments
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

-- Authenticated users can insert their own comments
CREATE POLICY "comments_insert_own" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin/moderator can update any comment status
CREATE POLICY "comments_admin_update" ON comments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Comment flags (for moderation)
CREATE TABLE IF NOT EXISTS comment_flags (
  id serial PRIMARY KEY,
  comment_id integer NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  flagged_by uuid REFERENCES auth.users(id),
  reason varchar(200) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comment_flags_comment ON comment_flags(comment_id);

ALTER TABLE comment_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comment_flags_insert" ON comment_flags
  FOR INSERT WITH CHECK (auth.uid() = flagged_by);

CREATE POLICY "comment_flags_admin_read" ON comment_flags
  FOR SELECT USING (auth.role() = 'authenticated');

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();
