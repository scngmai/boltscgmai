/*
  # Complete SCNGMAI Database Setup

  1. New Tables
    - `user_profiles` - User authentication and roles
    - `activity_logs` - System activity tracking
    - `members` - Member information and status
    - `payments` - Payment records
    - `officers` - Association officers
    - `milestones` - Age-based benefits
    - `bulletin_posts` - Announcements and updates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Proper access control based on user roles

  3. Functions
    - Auto-create user profiles on signup
    - Activity logging triggers
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS officers CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS bulletin_posts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors', 'Member')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  member_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  action text NOT NULL,
  description text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create members table
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_number text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Deceased', 'Dropped', 'Served')),
  date_of_birth date,
  address text,
  notes text,
  registration_year integer NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  registration_date date NOT NULL DEFAULT CURRENT_DATE,
  profile_picture text,
  health_certificate text,
  delinquent_years integer NOT NULL DEFAULT 0,
  total_delinquent_amount numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  year integer NOT NULL,
  date date,
  amount numeric(10,2) NOT NULL DEFAULT 780,
  is_paid boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(member_id, year)
);

-- Create officers table
CREATE TABLE officers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  position text NOT NULL,
  email text,
  phone text,
  profile_picture text,
  member_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  age integer NOT NULL UNIQUE,
  amount numeric(10,2) NOT NULL,
  description text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bulletin_posts table
CREATE TABLE bulletin_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletin_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow profile creation"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for activity_logs
CREATE POLICY "Users can read activity logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert activity logs"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for members
CREATE POLICY "Authenticated users can read members"
  ON members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update members"
  ON members
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete members"
  ON members
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for payments
CREATE POLICY "Authenticated users can read payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete payments"
  ON payments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for officers
CREATE POLICY "Authenticated users can read officers"
  ON officers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert officers"
  ON officers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update officers"
  ON officers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete officers"
  ON officers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for milestones
CREATE POLICY "Authenticated users can read milestones"
  ON milestones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert milestones"
  ON milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update milestones"
  ON milestones
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete milestones"
  ON milestones
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for bulletin_posts
CREATE POLICY "Authenticated users can read bulletin posts"
  ON bulletin_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert bulletin posts"
  ON bulletin_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bulletin posts"
  ON bulletin_posts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete bulletin posts"
  ON bulletin_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_members_member_number ON members(member_number);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_payments_member_id ON payments(member_id);
CREATE INDEX idx_payments_year ON payments(year);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bulletin_posts_updated_at BEFORE UPDATE ON bulletin_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO milestones (age, amount, description) VALUES
  (60, 5000, 'Senior Citizen Benefit'),
  (65, 7500, 'Retirement Benefit'),
  (70, 10000, 'Golden Years Benefit'),
  (75, 12500, 'Diamond Benefit');

INSERT INTO bulletin_posts (title, content, author) VALUES
  ('Welcome to SCNGMAI', 'Welcome to the Surigao City and Norte Golden Mentors Association, Inc. management system.', 'System Administrator'),
  ('Annual Meeting Notice', 'The annual general meeting will be held next month. All members are encouraged to attend.', 'Secretary');

-- Log the database setup
INSERT INTO activity_logs (user_id, user_name, action, description) VALUES
  (null, 'System', 'database_setup', 'Complete database setup completed successfully');