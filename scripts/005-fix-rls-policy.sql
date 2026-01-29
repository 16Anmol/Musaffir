-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow public inserts" ON kala_yatra_registrations;
DROP POLICY IF EXISTS "Allow public reads" ON kala_yatra_registrations;
DROP POLICY IF EXISTS "Users can view own registrations" ON kala_yatra_registrations;

-- Create new RLS policies that allow public access
CREATE POLICY "Allow public inserts registration"
  ON kala_yatra_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select registration"
  ON kala_yatra_registrations
  FOR SELECT
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE kala_yatra_registrations ENABLE ROW LEVEL SECURITY;
