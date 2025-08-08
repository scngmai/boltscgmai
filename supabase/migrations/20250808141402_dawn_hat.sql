/*
  # Fix Database Errors and Setup

  1. Clean Database Setup
    - Drop existing tables safely
    - Create all required tables with proper structure
    - Set up proper relationships and constraints
    - Enable RLS and create policies

  2. Security
    - Enable RLS on all tables
    - Add proper policies for authenticated users
    - Set up proper user management

  3. Sample Data
    - Add initial data for testing
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bulletin_posts CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS officers CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors', 'Member')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    member_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Deceased', 'Dropped', 'Served')),
    date_of_birth DATE,
    address TEXT,
    notes TEXT,
    registration_year INTEGER NOT NULL DEFAULT EXTRACT(year FROM NOW()),
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    profile_picture TEXT,
    health_certificate TEXT,
    delinquent_years INTEGER NOT NULL DEFAULT 0,
    total_delinquent_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    date DATE,
    amount DECIMAL(10,2) NOT NULL DEFAULT 780,
    is_paid BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(member_id, year)
);

-- Create officers table
CREATE TABLE officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    profile_picture TEXT,
    member_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age INTEGER UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bulletin_posts table
CREATE TABLE bulletin_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_members_member_number ON members(member_number);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_payments_member_id ON payments(member_id);
CREATE INDEX idx_payments_year ON payments(year);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bulletin_posts_updated_at BEFORE UPDATE ON bulletin_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles policies
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow profile creation" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Members policies
CREATE POLICY "Authenticated users can read members" ON members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert members" ON members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update members" ON members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete members" ON members FOR DELETE TO authenticated USING (true);

-- Payments policies
CREATE POLICY "Authenticated users can read payments" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert payments" ON payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update payments" ON payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete payments" ON payments FOR DELETE TO authenticated USING (true);

-- Officers policies
CREATE POLICY "Authenticated users can read officers" ON officers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert officers" ON officers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update officers" ON officers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete officers" ON officers FOR DELETE TO authenticated USING (true);

-- Milestones policies
CREATE POLICY "Authenticated users can read milestones" ON milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert milestones" ON milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update milestones" ON milestones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete milestones" ON milestones FOR DELETE TO authenticated USING (true);

-- Bulletin posts policies
CREATE POLICY "Authenticated users can read bulletin posts" ON bulletin_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert bulletin posts" ON bulletin_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update bulletin posts" ON bulletin_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete bulletin posts" ON bulletin_posts FOR DELETE TO authenticated USING (true);

-- Activity logs policies
CREATE POLICY "Users can read activity logs" ON activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert activity logs" ON activity_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO members (member_number, name, email, phone, status, registration_year, registration_date) VALUES
('GM20240001', 'John Doe', 'john.doe@email.com', '+63 912 345 6789', 'Active', 2024, '2024-01-15'),
('GM20240002', 'Jane Smith', 'jane.smith@email.com', '+63 912 345 6790', 'Active', 2024, '2024-02-20'),
('GM20230001', 'Bob Johnson', 'bob.johnson@email.com', '+63 912 345 6791', 'Inactive', 2023, '2023-03-10');

INSERT INTO officers (name, position, email, phone, member_id) VALUES
('John Doe', 'President', 'john.doe@email.com', '+63 912 345 6789', 'GM20240001'),
('Jane Smith', 'Secretary', 'jane.smith@email.com', '+63 912 345 6790', 'GM20240002');

INSERT INTO milestones (age, amount, description) VALUES
(60, 5000.00, 'Senior Citizen Benefit'),
(65, 7500.00, 'Retirement Benefit'),
(70, 10000.00, 'Elderly Care Benefit');

INSERT INTO bulletin_posts (title, content, author) VALUES
('Welcome to SCNGMAI', 'Welcome to our new management system. This will help us better serve our members.', 'Admin'),
('Annual Meeting Notice', 'The annual general meeting will be held next month. Please mark your calendars.', 'Secretary');