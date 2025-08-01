import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          member_number: string;
          name: string;
          email: string | null;
          phone: string | null;
          status: 'Active' | 'Inactive' | 'Deceased' | 'Dropped' | 'Served';
          date_of_birth: string | null;
          address: string | null;
          notes: string | null;
          registration_year: number;
          registration_date: string;
          profile_picture: string | null;
          health_certificate: string | null;
          delinquent_years: number;
          total_delinquent_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_number: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          status?: 'Active' | 'Inactive' | 'Deceased' | 'Dropped' | 'Served';
          date_of_birth?: string | null;
          address?: string | null;
          notes?: string | null;
          registration_year?: number;
          registration_date?: string;
          profile_picture?: string | null;
          health_certificate?: string | null;
          delinquent_years?: number;
          total_delinquent_amount?: number;
        };
        Update: {
          id?: string;
          member_number?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          status?: 'Active' | 'Inactive' | 'Deceased' | 'Dropped' | 'Served';
          date_of_birth?: string | null;
          address?: string | null;
          notes?: string | null;
          registration_year?: number;
          registration_date?: string;
          profile_picture?: string | null;
          health_certificate?: string | null;
          delinquent_years?: number;
          total_delinquent_amount?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          member_id: string;
          year: number;
          date: string | null;
          amount: number;
          is_paid: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          year: number;
          date?: string | null;
          amount?: number;
          is_paid?: boolean;
        };
        Update: {
          id?: string;
          member_id?: string;
          year?: number;
          date?: string | null;
          amount?: number;
          is_paid?: boolean;
        };
      };
      officers: {
        Row: {
          id: string;
          name: string;
          position: string;
          email: string | null;
          phone: string | null;
          profile_picture: string | null;
          member_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          email?: string | null;
          phone?: string | null;
          profile_picture?: string | null;
          member_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          email?: string | null;
          phone?: string | null;
          profile_picture?: string | null;
          member_id?: string | null;
        };
      };
      milestones: {
        Row: {
          id: string;
          age: number;
          amount: number;
          description: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          age: number;
          amount: number;
          description: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          age?: number;
          amount?: number;
          description?: string;
          is_active?: boolean;
        };
      };
      bulletin_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          author: string;
          date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author: string;
          date?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author?: string;
          date?: string;
          is_active?: boolean;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'Admin' | 'President' | 'Secretary' | 'Treasurer' | 'Auditor' | 'Public Information Officer' | 'Board of Directors' | 'Member';
          status: string;
          member_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role?: 'Admin' | 'President' | 'Secretary' | 'Treasurer' | 'Auditor' | 'Public Information Officer' | 'Board of Directors' | 'Member';
          status?: string;
          member_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'Admin' | 'President' | 'Secretary' | 'Treasurer' | 'Auditor' | 'Public Information Officer' | 'Board of Directors' | 'Member';
          status?: string;
          member_id?: string | null;
        };
      };
    };
  };
}