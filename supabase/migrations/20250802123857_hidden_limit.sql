/*
  # Create SCNGMAI Management System Database Schema

  1. New Tables
    - `members` - Member information and profiles
    - `payments` - Payment tracking by year for each member
    - `officers` - Association officers and board members
    - `milestones` - Age-based benefit milestones
    - `bulletin_posts` - Announcements and bulletin board
    - `users` - System users with roles and permissions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
    - Foreign key relationships between tables

  3. Sample Data
    - Sample members with payment history
    - Default milestones for ages 60, 65, 70
    - Sample bulletin posts
    - Admin user for testing
*/

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_number text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  status text DEFAULT 'Active' NOT NULL CHECK (status IN ('Active', 'Inactive', 'Deceased', 'Dropped', 'Served')),
  date_of_birth date,
  address text,
  notes text,
  registration_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE) NOT NULL,
  registration_date date DEFAULT CURRENT_DATE NOT NULL,
  profile_picture text,
  health_certificate text,
  delinquent_years integer DEFAULT 0 NOT NULL,
  total_delinquent_amount numeric DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  year integer NOT NULL,
  date date DEFAULT CURRENT_DATE,
  amount numeric DEFAULT 100 NOT NULL,
  is_paid boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(member_id, year)
);

-- Create officers table
CREATE TABLE IF NOT EXISTS public.officers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  email text,
  phone text,
  profile_picture text,
  member_id uuid REFERENCES public.members(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age integer NOT NULL UNIQUE,
  amount numeric NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create bulletin_posts table
CREATE TABLE IF NOT EXISTS public.bulletin_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'Member' NOT NULL CHECK (role IN ('Admin', 'President', 'Secretary', 'Treasurer', 'Auditor', 'Public Information Officer', 'Board of Directors', 'Member')),
  status text DEFAULT 'Active' NOT NULL,
  member_id uuid REFERENCES public.members(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read members" ON public.members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update members" ON public.members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete members" ON public.members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read payments" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update payments" ON public.payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete payments" ON public.payments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read officers" ON public.officers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert officers" ON public.officers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update officers" ON public.officers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete officers" ON public.officers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read milestones" ON public.milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert milestones" ON public.milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update milestones" ON public.milestones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete milestones" ON public.milestones FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read bulletin_posts" ON public.bulletin_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert bulletin_posts" ON public.bulletin_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update bulletin_posts" ON public.bulletin_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete bulletin_posts" ON public.bulletin_posts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert users" ON public.users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update users" ON public.users FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete users" ON public.users FOR DELETE TO authenticated USING (true);

-- Insert sample data
INSERT INTO public.members (member_number, name, email, phone, status, date_of_birth, address, registration_year, registration_date) VALUES
('SCNG-001', 'Juan Dela Cruz', 'juan.delacruz@email.com', '+63 912 345 6789', 'Active', '1960-05-15', '123 Main St, Manila, Philippines', 2020, '2020-01-15'),
('SCNG-002', 'Maria Santos', 'maria.santos@email.com', '+63 917 234 5678', 'Active', '1965-08-22', '456 Oak Ave, Quezon City, Philippines', 2021, '2021-03-10')
ON CONFLICT (member_number) DO NOTHING;

-- Insert sample payments
INSERT INTO public.payments (member_id, year, amount, date, is_paid)
SELECT m.id, 2023, 1200, '2023-01-15', true FROM public.members m WHERE m.member_number = 'SCNG-001'
UNION ALL
SELECT m.id, 2024, 1200, '2024-01-15', true FROM public.members m WHERE m.member_number = 'SCNG-001'
UNION ALL
SELECT m.id, 2023, 1200, '2023-03-10', true FROM public.members m WHERE m.member_number = 'SCNG-002'
UNION ALL
SELECT m.id, 2024, 1200, '2024-03-10', false FROM public.members m WHERE m.member_number = 'SCNG-002'
ON CONFLICT (member_id, year) DO NOTHING;

-- Insert sample milestones
INSERT INTO public.milestones (age, amount, description, is_active) VALUES
(60, 50000, 'Retirement Benefit at Age 60', true),
(65, 75000, 'Senior Citizen Benefit at Age 65', true),
(70, 100000, 'Elderly Care Benefit at Age 70', true)
ON CONFLICT (age) DO NOTHING;

-- Insert sample bulletin posts
INSERT INTO public.bulletin_posts (title, content, author, date, is_active) VALUES
('Welcome to SCNGMAI', 'Welcome to the Senior Citizens of Nueva Generacion Mutual Aid Inc. management system. This platform will help us manage our members, payments, and association activities more efficiently.', 'Admin', CURRENT_DATE, true),
('Annual General Meeting', 'Our annual general meeting is scheduled for next month. All members are encouraged to attend. Details will be sent via email and SMS.', 'Secretary', CURRENT_DATE - INTERVAL ''5 days'', true)
ON CONFLICT DO NOTHING;

-- Insert admin user
INSERT INTO public.users (name, email, role, status) VALUES
('Administrator', 'gabu.sacro@gmail.com', 'Admin', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_officers_updated_at BEFORE UPDATE ON public.officers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_bulletin_posts_updated_at BEFORE UPDATE ON public.bulletin_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();