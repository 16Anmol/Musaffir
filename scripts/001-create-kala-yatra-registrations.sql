-- Create kala_yatra_registrations table
CREATE TABLE IF NOT EXISTS kala_yatra_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Information
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  
  -- Contact Details
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  school_college TEXT,
  
  -- Referral
  referral_code TEXT,
  
  -- Optional Fields
  hear_about_us TEXT,
  receive_updates BOOLEAN DEFAULT FALSE,
  join_artist_community BOOLEAN DEFAULT FALSE,
  
  -- Terms acceptance
  terms_accepted BOOLEAN NOT NULL DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE kala_yatra_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (public registration)
CREATE POLICY "Allow public inserts" ON kala_yatra_registrations
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reads only for authenticated users (admin)
CREATE POLICY "Allow authenticated reads" ON kala_yatra_registrations
  FOR SELECT
  USING (auth.role() = 'authenticated');
