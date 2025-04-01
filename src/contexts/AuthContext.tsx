
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
      try {
        const profile = await loadUserProfile(session.user.id, session);
        setUser(profile);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Initializing authentication...");
        setLoading(true);
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log("Auth state changed:", event, !!currentSession);
          setSession(currentSession);
          
          if (currentSession?.user) {
            try {
              const profile = await loadUserProfile(currentSession.user.id, currentSession);
              setUser(profile);
            } catch (error) {
              console.error("Error loading user profile on auth change:", error);
              setUser(null);
            }
          } else {
            setUser(null);
          }
          
          setLoading(false);
        });

        // THEN check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", !!currentSession);
        
        if (currentSession?.user) {
          try {
            const profile = await loadUserProfile(currentSession.user.id, currentSession);
            setUser(profile);
            setSession(currentSession);
          } catch (error) {
            console.error("Error loading initial user profile:", error);
            setUser(null);
          }
        }
        
        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt starting...");
      setLoading(true);
      const result = await authService.login(email, password);
      console.log("Login result:", result);
      return result;
    } catch (error) {
      console.error("Login error in context:", error);
      return { success: false };
    } finally {
      // Don't set loading to false here, it will be updated by the auth listener
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await authService.signup(email, password, name);
      return result;
    } catch (error) {
      console.error("Signup error in context:", error);
      return false;
    } finally {
      // Don't set loading to false here, it will be updated by the auth listener
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
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
