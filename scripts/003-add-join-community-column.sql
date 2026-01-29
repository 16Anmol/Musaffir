-- Add missing join_community column
ALTER TABLE kala_yatra_registrations ADD COLUMN IF NOT EXISTS join_community BOOLEAN DEFAULT false;
