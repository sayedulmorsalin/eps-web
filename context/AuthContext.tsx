'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase/client';
import { trackAuthEvent } from '../lib/analytics';
import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  preferredLanguage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  supabaseUser: SupabaseUser | null;
  supabaseSession: SupabaseSession | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  supabaseUser: null,
  supabaseSession: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, email?: string): Promise<User | null> => {
    try {
      const supabase = getSupabaseClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('id,full_name,phone,role,preferred_language')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        return {
          id: profile.id,
          name: profile.full_name || email?.split('@')[0] || 'User',
          email: email || '',
          phone: profile.phone || '',
          role: profile.role || 'customer',
          preferredLanguage: profile.preferred_language || 'bn',
        };
      }
    } catch {
      // Ignore profile lookup errors
    }
    return null;
  }, []);

  useEffect(() => {
    let active = true;
    // 1. Restore local cache asynchronously if available
    Promise.resolve().then(() => {
      if (!active) return;
      const savedToken = localStorage.getItem('epsr_token');
      const savedUser = localStorage.getItem('epsr_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    });

    // 2. Direct Supabase Session & Realtime Auth state
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSupabaseSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.access_token) {
        setToken(session.access_token);
        localStorage.setItem('epsr_token', session.access_token);
        if (session.user) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          const userData: User = profile || {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone,
            role: session.user.user_metadata?.role || 'customer',
          };
          setUser(userData);
          localStorage.setItem('epsr_user', JSON.stringify(userData));
        }
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSupabaseSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session) {
        setToken(session.access_token);
        localStorage.setItem('epsr_token', session.access_token);
        if (session.user) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          const userData: User = profile || {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone,
            role: session.user.user_metadata?.role || 'customer',
          };
          setUser(userData);
          localStorage.setItem('epsr_user', JSON.stringify(userData));
        }
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('epsr_token');
        localStorage.removeItem('epsr_user');
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      throw error;
    }

    const session = data.session;
    const authUser = data.user;
    if (session && authUser) {
      setSupabaseSession(session);
      setSupabaseUser(authUser);
      setToken(session.access_token);
      localStorage.setItem('epsr_token', session.access_token);

      const profile = await fetchProfile(authUser.id, authUser.email);
      const userData: User = profile || {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || email.split('@')[0],
        email: authUser.email || email,
        phone: authUser.user_metadata?.phone,
        role: authUser.user_metadata?.role || 'customer',
      };
      setUser(userData);
      localStorage.setItem('epsr_user', JSON.stringify(userData));
      trackAuthEvent('login', email);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: name,
          phone: phone || '',
          role: 'customer',
        },
      },
    });

    if (error) {
      throw error;
    }

    const session = data.session;
    const authUser = data.user;
    if (authUser) {
      setSupabaseUser(authUser);
      if (session) {
        setSupabaseSession(session);
        setToken(session.access_token);
        localStorage.setItem('epsr_token', session.access_token);
      }
      const userData: User = {
        id: authUser.id,
        name: name,
        email: authUser.email || email,
        phone: phone || '',
        role: 'customer',
      };
      setUser(userData);
      localStorage.setItem('epsr_user', JSON.stringify(userData));
      trackAuthEvent('register', email);
    }
  };

  const logout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signOut error:', e);
    } finally {
      setUser(null);
      setToken(null);
      setSupabaseUser(null);
      setSupabaseSession(null);
      localStorage.removeItem('epsr_token');
      localStorage.removeItem('epsr_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        supabaseUser,
        supabaseSession,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
