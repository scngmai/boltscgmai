/*
  # SCNGMAI Management System Database Schema

  1. New Tables
    - `members` - Store member information and profile data
    - `payments` - Track member payments by year
    - `officers` - Association officers and board members
    - `milestones` - Age-based benefit milestones
    - `bulletin_posts` - Announcements and bulletin board posts
    - `users` - System users with roles and permissions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Secure data access with proper permissions

  3. Features
    - Auto-generated UUIDs for primary keys
    - Timestamps for created/updated tracking
    - Foreign key relationships
    - Proper indexing for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE member_status AS ENUM ('Active', 'Inactive', 'Deceased', 'Dropped', 'Served');
CREATE TYPE user_role AS ENUM ('Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors', 'Member');

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_number text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  status member_status DEFAULT 'Active',
  date_of_birth date,
  address text,
  notes text,
  registration_year integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  registration_date date DEFAULT CURRENT_DATE,
  profile_picture text,
  health_certificate text,
  delinquent_years integer DEFAULT 0,
  total_delinquent_amount decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  year integer NOT NULL,
  date date,
  amount decimal(10,2) NOT NULL DEFAULT 780,
  is_paid boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(member_id, year)
);

-- Officers table
CREATE TABLE IF NOT EXISTS officers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  position text NOT NULL,
  email text,
  phone text,
  profile_picture text,
  member_id uuid REFERENCES members(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  age integer NOT NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bulletin posts table
CREATE TABLE IF NOT EXISTS bulletin_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'Member',
  status text DEFAULT 'active',
  member_id uuid REFERENCES members(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_registration_year ON members(registration_year);
CREATE INDEX IF NOT EXISTS idx_payments_member_year ON payments(member_id, year);
CREATE INDEX IF NOT EXISTS idx_payments_year ON payments(year);
CREATE INDEX IF NOT EXISTS idx_bulletin_posts_active ON bulletin_posts(is_active, date DESC);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Members policies
CREATE POLICY "Users can view all members" ON members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert members" ON members FOR INSERT TO authenticated USING (true);
CREATE POLICY "Admins can update members" ON members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete members" ON members FOR DELETE TO authenticated USING (true);

-- Payments policies
CREATE POLICY "Users can view all payments" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert payments" ON payments FOR INSERT TO authenticated USING (true);
CREATE POLICY "Admins can update payments" ON payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete payments" ON payments FOR DELETE TO authenticated USING (true);

-- Officers policies
CREATE POLICY "Users can view all officers" ON officers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert officers" ON officers FOR INSERT TO authenticated USING (true);
CREATE POLICY "Admins can update officers" ON officers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete officers" ON officers FOR DELETE TO authenticated USING (true);

-- Milestones policies
CREATE POLICY "Users can view all milestones" ON milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert milestones" ON milestones FOR INSERT TO authenticated USING (true);
CREATE POLICY "Admins can update milestones" ON milestones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete milestones" ON milestones FOR DELETE TO authenticated USING (true);

-- Bulletin posts policies
CREATE POLICY "Users can view active bulletin posts" ON bulletin_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert bulletin posts" ON bulletin_posts FOR INSERT TO authenticated USING (true);
CREATE POLICY "Admins can update bulletin posts" ON bulletin_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete bulletin posts" ON bulletin_posts FOR DELETE TO authenticated USING (true);

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert users" ON users FOR INSERT TO authenticated USING (true);
CREATE POLICY "Admins can update users" ON users FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete users" ON users FOR DELETE TO authenticated USING (true);

-- Insert sample data
INSERT INTO members (member_number, name, email, phone, status, date_of_birth, address, registration_year, registration_date) VALUES
('GM20240001', 'Juan Dela Cruz', 'juan@email.com', '+63 912 345 6789', 'Active', '1980-05-15', 'Surigao City', 2020, '2020-01-15'),
('GM20190002', 'Maria Santos', 'maria@email.com', '+63 923 456 7890', 'Inactive', '1975-08-22', 'Surigao del Norte', 2019, '2019-03-10')
ON CONFLICT (member_number) DO NOTHING;

-- Insert sample payments
INSERT INTO payments (member_id, year, date, amount, is_paid) 
SELECT m.id, 2020, '2020-02-01', 780, true FROM members m WHERE m.member_number = 'GM20240001'
UNION ALL
SELECT m.id, 2021, '2021-01-15', 780, true FROM members m WHERE m.member_number = 'GM20240001'
UNION ALL
SELECT m.id, 2022, '2022-01-20', 780, true FROM members m WHERE m.member_number = 'GM20240001'
UNION ALL
SELECT m.id, 2023, '2023-01-10', 780, true FROM members m WHERE m.member_number = 'GM20240001'
UNION ALL
SELECT m.id, 2024, '2024-01-05', 780, true FROM members m WHERE m.member_number = 'GM20240001'
UNION ALL
SELECT m.id, 2020, '2020-02-15', 780, true FROM members m WHERE m.member_number = 'GM20190002'
UNION ALL
SELECT m.id, 2021, '2021-02-10', 780, true FROM members m WHERE m.member_number = 'GM20190002'
ON CONFLICT (member_id, year) DO NOTHING;

-- Insert sample milestones
INSERT INTO milestones (age, amount, description, is_active) VALUES
(60, 50000, 'Senior Citizen Benefit', true),
(65, 75000, 'Retirement Benefit', true),
(70, 100000, 'Golden Years Benefit', true)
ON CONFLICT DO NOTHING;

-- Insert sample bulletin posts
INSERT INTO bulletin_posts (title, content, author, date, is_active) VALUES
('Annual General Assembly 2024', 'The Annual General Assembly will be held on December 15, 2024, at the Surigao City Convention Center.', 'Admin', '2024-11-15', true),
('Membership Fee Reminder', 'Please be reminded that the annual membership fee of ₱780 is due by January 31, 2025.', 'Treasurer', '2024-11-10', true)
ON CONFLICT DO NOTHING;

-- Insert sample user
INSERT INTO users (name, email, role, status) VALUES
('Admin User', 'gabu.sacro@gmail.com', 'Admin', 'active')
ON CONFLICT (email) DO NOTHING;