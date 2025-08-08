import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Activity logging function
export const logActivity = async (action: string, description: string, entityType?: string, entityId?: string, metadata?: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name')
      .eq('user_id', user.id)
      .single();

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        user_name: profile?.name || user.email || 'Unknown User',
        action,
        description,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata || {}
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error in logActivity:', error);
  }
};

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          role: string;
          status: string;
          member_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          role?: string;
          status?: string;
          member_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          role?: string;
          status?: string;
          member_id?: string | null;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          action: string;
          description: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          action: string;
          description: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          action?: string;
          description?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: any;
        };
      };
    };
  };
}