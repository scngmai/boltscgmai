/*
  # Fix Authentication and Add Activity Tracking

  1. New Tables
    - `user_profiles` - Links Supabase auth users to application roles
    - `activity_logs` - Tracks all user activities in the system

  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
    - Link authentication to user profiles

  3. Sample Data
    - Create sample user profile for testing
    - Add sample activity logs
*/

-- Create user profiles table to link Supabase auth with application roles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Member',
  status text NOT NULL DEFAULT 'active',
  member_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  action text NOT NULL,
  description text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
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

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
    )
  );

-- Policies for activity_logs
CREATE POLICY "Users can read all activity logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own activity"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, user_name, action, description, entity_type, created_at) VALUES
  (gen_random_uuid(), 'System', 'system_start', 'System initialized with sample data', 'system', now() - interval '2 hours'),
  (gen_random_uuid(), 'Admin User', 'member_add', 'New member Juan Dela Cruz registered', 'member', now() - interval '1 hour'),
  (gen_random_uuid(), 'Admin User', 'payment_add', 'Payment received from Juan Dela Cruz for 2024', 'payment', now() - interval '30 minutes'),
  (gen_random_uuid(), 'Admin User', 'member_add', 'New member Maria Santos registered', 'member', now() - interval '15 minutes');