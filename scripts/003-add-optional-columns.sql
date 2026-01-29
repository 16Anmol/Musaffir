-- Add missing optional columns to kala_yatra_registrations table
ALTER TABLE kala_yatra_registrations ADD COLUMN IF NOT EXISTS join_community BOOLEAN DEFAULT FALSE;
ALTER TABLE kala_yatra_registrations ADD COLUMN IF NOT EXISTS receive_updates BOOLEAN DEFAULT FALSE;
ALTER TABLE kala_yatra_registrations ADD COLUMN IF NOT EXISTS heard_from TEXT;
ALTER TABLE kala_yatra_registrations ADD COLUMN IF NOT EXISTS referral_code TEXT;
