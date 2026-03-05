-- Schools System Overhaul Migration
-- Adds school administrative info + coach active status

-- Add new columns to schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS principal text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS athletic_director text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS athletic_director_email text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS enrollment integer;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS school_type text; -- 'catholic', 'public', 'independent', 'charter', 'private'

-- Add is_active column to coaches table
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
