-- Create user profiles table to track sign-ups
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  is_new_signup BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public profile inserts"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow public selects
CREATE POLICY "Allow public profile selects"
  ON user_profiles
  FOR SELECT
  USING (true);

-- Add index for email lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
