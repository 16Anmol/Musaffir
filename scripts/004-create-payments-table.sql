-- Create payments table for Kala Yatra registrations
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES kala_yatra_registrations(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  expected_amount INT DEFAULT 100,
  paid_amount INT,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'upi',
  verification_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for payment creation without auth)
CREATE POLICY "Allow public payment inserts"
  ON payments
  FOR INSERT
  WITH CHECK (true);

-- Allow public selects by order_id (for verification)
CREATE POLICY "Allow public payment lookup"
  ON payments
  FOR SELECT
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_token ON payments(verification_token);
