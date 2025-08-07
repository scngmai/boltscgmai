import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection
supabase.from('user_profiles').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connection successful');
    }
  });

// Activity logging function
export const logActivity = async (action: string, description: string, entityType?: string, entityId?: string, metadata?: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user for activity logging');
      return;
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name')
      .eq('user_id', user.id)
      .single();

    console.log('Logging activity:', { action, description, user: user.id });

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
    // Don't throw error to prevent breaking the main functionality
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