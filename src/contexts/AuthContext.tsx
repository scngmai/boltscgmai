import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        await loadUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        console.log('Found existing session for:', session.user.email);
        await loadUserProfile(session.user.id, session.user.email || '');
      } else {
        console.log('No existing session found');
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      console.log('Loading user profile for:', userId, email);
      
      // First check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading user profile:', profileError);
        return;
      }

      if (!profile) {
        console.log('No profile found, creating one...');
        // Create profile for new user
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            name: email.split('@')[0], // Use email prefix as default name
            role: 'Admin', // First user gets admin role
            status: 'active'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return;
        }

        console.log('Created new profile:', newProfile);
        
        const userObj: User = {
          id: newProfile.id,
          name: newProfile.name,
          email: email,
          role: newProfile.role as UserRole,
          status: newProfile.status,
          memberId: newProfile.member_id || undefined
        };
        
        setUser(userObj);
      } else {
        console.log('Found existing profile:', profile);
        
        const userObj: User = {
          id: profile.id,
          name: profile.name,
          email: email,
          role: profile.role as UserRole,
          status: profile.status,
          memberId: profile.member_id || undefined
        };
        
        setUser(userObj);
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole = 'Admin') => {
    try {
      console.log('Starting signup process for:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        
        // Create user profile immediately
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            name: name,
            role: role,
            status: 'active'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Failed to create user' };
    } catch (error) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process for:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        console.log('User signed in successfully:', data.user.id);
        await loadUserProfile(data.user.id, data.user.email || '');
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Failed to sign in' };
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};