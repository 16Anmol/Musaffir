-- Add missing columns to kala_yatra_registrations table
ALTER TABLE kala_yatra_registrations 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS gender TEXT;
