-- Phase 5: Email subscribers and email logs

CREATE TABLE IF NOT EXISTS email_subscribers (
  id serial PRIMARY KEY,
  email varchar(200) UNIQUE NOT NULL,
  confirmed boolean DEFAULT false,
  favorite_sports text[] DEFAULT '{}',
  confirmation_token varchar(100),
  unsubscribe_token varchar(100),
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_confirmed ON email_subscribers(confirmed);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_subscribers_public_insert" ON email_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "email_subscribers_admin_read" ON email_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "email_subscribers_admin_update" ON email_subscribers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Email logs for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id serial PRIMARY KEY,
  email_type varchar(50) NOT NULL,    -- 'confirmation', 'newsletter', 'potw_announcement'
  recipient varchar(200) NOT NULL,
  subject varchar(500),
  resend_id varchar(100),
  status varchar(20) DEFAULT 'sent',
  sent_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_logs_admin_read" ON email_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "email_logs_admin_insert" ON email_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
