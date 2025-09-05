
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  adminData: any | null;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  verifyAdminSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const verifyAdminSession = (): boolean => {
    try {
      const adminSession = localStorage.getItem('fadem_admin_session');
      if (adminSession) {
        const session = JSON.parse(adminSession);
        
        console.log('🔍 Vérification session admin:', {
          hasSession: !!session,
          username: session?.username,
          hasSessionId: !!session?.sessionId
        });
        
        if (session && session.username === 'AdminFadem' && session.sessionId) {
          setAdminData(session);
          return true;
        } else {
          console.log('❌ Session invalide');
          localStorage.removeItem('fadem_admin_session');
          setAdminData(null);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur vérification session:', error);
      localStorage.removeItem('fadem_admin_session');
      setAdminData(null);
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 Initialisation AuthProvider');
    const adminStatus = verifyAdminSession();
    setIsAdmin(adminStatus);
    console.log('✅ Statut admin initial:', adminStatus);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('🚫 Inscription désactivée');
    return { 
      error: { 
        message: "Inscription non autorisée. Contactez l'administrateur." 
      } 
    };
  };

  const signIn = async (email: string, password: string) => {
    console.log('🚫 Connexion standard désactivée');
    return { 
      error: { 
        message: "Utilisez la page d'administration pour vous connecter" 
      } 
    };
  };

  const signOut = async () => {
    try {
      console.log('👋 Déconnexion admin...');
      
      localStorage.removeItem('fadem_admin_session');
      
      setIsAdmin(false);
      setAdminData(null);
      setUser(null);
      setSession(null);
      setProfile(null);
      
      window.location.href = '/admin';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      window.location.href = '/admin';
    }
  };

  const refreshProfile = async () => {
    return;
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isAdmin,
    adminData,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    verifyAdminSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
