"use client"
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { syncSessionWithBackend, clearBackendSession, fetchMe } from '@/services/auth';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Helper to extract user role from session
    function extractUserRole(session: Session | null) {
      if (session) {
        interface CustomJwtPayload extends JwtPayload {
          user_role: string;
        }
        try {
          const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
          return jwt.user_role || '';
        } catch {
          return '';
        }
      }
      return '';
    }

    // Initialize auth from backend or current session
    const initializeAuth = async () => {
      try {
        const backendData = await fetchMe();

        if (backendData?.access_token && backendData?.refresh_token) {
          const { data: { session: newSession }, error } = await supabase.auth.setSession({
            access_token: backendData.access_token,
            refresh_token: backendData.refresh_token,
          });

          if (!error && newSession) {
            setSession(newSession);
            setUser(newSession.user);
            setUserRole(extractUserRole(newSession));
            setLoading(false);
            return;
          }
        }

        // 2. Fallback to default session check (if any)
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setUserRole(extractUserRole(currentSession));
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(extractUserRole(session));

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          await syncSessionWithBackend(
            session.access_token,
            session.refresh_token || ''
          ).catch(console.error);
        }
      } else if (event === 'SIGNED_OUT') {
        await clearBackendSession().catch(console.error);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    await clearBackendSession().catch(console.error);
    if (error) throw error;
    router.push('/login');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  };

  const value = {
    user,
    session,
    userRole,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <LoadingSpinner />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
