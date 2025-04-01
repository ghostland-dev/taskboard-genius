
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile } from "@/types/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { authService } from "@/services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { loadUserProfile } = useUserProfile();

  const refreshUser = async () => {
    if (session?.user) {
      const profile = await loadUserProfile(session.user.id, session);
      setUser(profile);
    }
  };

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const profile = await loadUserProfile(currentSession.user.id, currentSession);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    }).data.subscription;

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const profile = await loadUserProfile(currentSession.user.id, currentSession);
        setUser(profile);
      }
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);
    return result;
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    await authService.signup(email, password, name);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    session,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
