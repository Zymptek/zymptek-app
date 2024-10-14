"use client"

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js';
import { Database, Tables } from '@/lib/database.types';
import { useRouter } from 'next/navigation';

export type Profile = Tables<'profiles'>;

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>()
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });


    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {

      const currentUser = session?.user || null;

      if (currentUser) {
        supabase.from('profiles').select('*').eq('user_id', currentUser.id).single().then(({ data }) => {
          setProfile(data);
        });
      }

      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [ supabase, router]);

  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};