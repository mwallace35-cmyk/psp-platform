-- Sprint 5: Live Scoring, Photos, Power Index, Milestones, Follows, Notifications

-- Live scoring
CREATE TABLE IF NOT EXISTS live_scores (
  id serial PRIMARY KEY,
  game_id int REFERENCES games(id),
  period varchar(20) NOT NULL, -- 'Q1','Q2','Q3','Q4','H1','H2','OT','F'
  home_score int NOT NULL DEFAULT 0,
  away_score int NOT NULL DEFAULT 0,
  is_final boolean DEFAULT false,
  reported_by uuid REFERENCES auth.users(id),
  reported_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_live_scores_game_id ON live_scores(game_id);
CREATE INDEX idx_live_scores_is_final ON live_scores(is_final);

-- Photo galleries
CREATE TABLE IF NOT EXISTS photos (
  id serial PRIMARY KEY,
  game_id int REFERENCES games(id),
  school_id int REFERENCES schools(id),
  sport_id varchar(50),
  season_id int REFERENCES seasons(id),
  uploaded_by uuid REFERENCES auth.users(id),
  image_url varchar(500) NOT NULL,
  caption text,
  player_tags int[] DEFAULT '{}',
  approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_photos_game_id ON photos(game_id);
CREATE INDEX idx_photos_school_id ON photos(school_id);
CREATE INDEX idx_photos_approved ON photos(approved);
CREATE INDEX idx_photos_featured ON photos(featured);

-- Power index
CREATE TABLE IF NOT EXISTS power_index (
  id serial PRIMARY KEY,
  school_id int NOT NULL REFERENCES schools(id),
  sport_id varchar(50) NOT NULL,
  season_id int REFERENCES seasons(id),
  overall_score decimal(6,2) NOT NULL,
  championship_score decimal(6,2) DEFAULT 0,
  win_pct_score decimal(6,2) DEFAULT 0,
  pro_athletes_score decimal(6,2) DEFAULT 0,
  recruiting_score decimal(6,2) DEFAULT 0,
  strength_of_schedule decimal(6,2) DEFAULT 0,
  rank int,
  previous_rank int,
  trend varchar(10), -- 'up','down','steady','new'
  calculated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, sport_id, season_id)
);

CREATE INDEX idx_power_index_sport_id ON power_index(sport_id);
CREATE INDEX idx_power_index_school_id ON power_index(school_id);
CREATE INDEX idx_power_index_rank ON power_index(rank);

-- Follow/notification preferences
CREATE TABLE IF NOT EXISTS user_follows (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  entity_type varchar(20) NOT NULL, -- 'school','player','sport'
  entity_id int NOT NULL,
  notify_scores boolean DEFAULT true,
  notify_articles boolean DEFAULT true,
  notify_recruiting boolean DEFAULT true,
  notify_milestones boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX idx_user_follows_user_id ON user_follows(user_id);
CREATE INDEX idx_user_follows_entity ON user_follows(entity_type, entity_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  type varchar(50) NOT NULL, -- 'score_update','article','recruiting','milestone'
  title varchar(200) NOT NULL,
  body text,
  link varchar(500),
  entity_type varchar(20),
  entity_id int,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Stat milestones
CREATE TABLE IF NOT EXISTS stat_milestones (
  id serial PRIMARY KEY,
  player_id int NOT NULL REFERENCES players(id),
  sport_id varchar(50) NOT NULL,
  stat_type varchar(50) NOT NULL, -- 'rush_yards','points','wins'
  current_value decimal(10,2) NOT NULL,
  milestone_target int NOT NULL, -- 1000, 2000, 3000
  remaining decimal(10,2) NOT NULL,
  projected_games_to_reach int,
  season_id int REFERENCES seasons(id),
  achieved boolean DEFAULT false,
  achieved_date date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_stat_milestones_player_id ON stat_milestones(player_id);
CREATE INDEX idx_stat_milestones_sport_id ON stat_milestones(sport_id);
CREATE INDEX idx_stat_milestones_achieved ON stat_milestones(achieved);
