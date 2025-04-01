import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Typage local de la table "profiles"
type SupabaseProfileRow = {
  id: string;
  name: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "inactive";
  subscription: string;
  stripe_customer_id?: string;
  subscription_id?: string;
  subscription_status?: string;
  subscription_period_end?: string;
};

// Utilisateur enrichi avec email de la session
type UserProfile = SupabaseProfileRow & {
  email: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
  refreshUser: () => Promise<void>;
};

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

  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single<SupabaseProfileRow>();

      if (error) {
        console.error("Erreur chargement profil:", error);
        return null;
      }

      if (!session?.user?.email) {
        console.warn("Email manquant dans la session");
        return null;
      }

      return {
        ...data,
        email: session.user.email,
      };
    } catch (error) {
      console.error("Erreur loadUserProfile:", error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      const profile = await loadUserProfile(session.user.id);
      setUser(profile);
    }
  };

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const profile = await loadUserProfile(currentSession.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    }).data.subscription;

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const profile = await loadUserProfile(currentSession.user.id);
        setUser(profile);
      }
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean }> => {
    try {
      setLoading(true);
      const sanitizedEmail = email.trim().toLowerCase();

      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(sanitizedEmail)) {
        toast.error("Format d'email invalide");
        return { success: false };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        toast.error("Identifiants invalides");
        return { success: false };
      }

      toast.success("Connexion réussie");
      return { success: true };
    } catch (error) {
      toast.error("Erreur lors de la connexion");
      console.error(error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = name.trim();

      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(sanitizedEmail)) {
        toast.error("Format d'email invalide");
        return;
      }

      if (sanitizedName.length < 2) {
        toast.error("Le nom doit contenir au moins 2 caractères");
        return;
      }

      if (password.length < 8) {
        toast.error("Mot de passe trop court");
        return;
      }

      const options = {
        data: { name: sanitizedName },
        emailRedirectTo: `${window.location.origin}/login`,
      };

      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Email déjà utilisé");
        } else {
          toast.error("Erreur lors de l'inscription");
          console.error("Signup error:", error);
        }
      } else {
        toast.success("Compte créé. Vérifiez votre email.");
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.info("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
      console.error(error);
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
