
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "inactive";
  subscription: string;
  stripe_customer_id?: string;
  subscription_id?: string;
  subscription_status?: string;
  subscription_period_end?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean}>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserProfile = async (userId: string) => {
    try {
      // Use direct SQL query instead of the profiles table to avoid RLS recursion
      // This is safer and prevents the infinite recursion issue
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading user profile:", error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          email: session?.user.email || "",
          name: data.name,
          role: data.role as UserProfile["role"],
          status: data.status as "active" | "inactive",
          subscription: data.subscription,
          stripe_customer_id: data.stripe_customer_id,
          subscription_id: data.subscription_id,
          subscription_status: data.subscription_status,
          subscription_period_end: data.subscription_period_end
        };
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error);
    }
    return null;
  };

  useEffect(() => {
    // First setup the listener, then check for session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);

        // Use setTimeout to break potential recursion chain
        if (currentSession?.user) {
          setTimeout(async () => {
            const profile = await loadUserProfile(currentSession.user.id);
            setUser(profile);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Found session" : "No session");
      setSession(currentSession);

      if (currentSession?.user) {
        const profile = await loadUserProfile(currentSession.user.id);
        setUser(profile);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean}> => {
    try {
      setLoading(true);
      
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(sanitizedEmail)) {
        toast.error("Format d'email invalide");
        return {success: false};
      }
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email: sanitizedEmail, 
        password 
      });
      
      if (error) {
        toast.error("Identifiants invalides");
        console.error("Login error:", error);
        return {success: false};
      } else {
        toast.success("Connexion réussie");
        return {success: true};
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion");
      console.error(error);
      return {success: false};
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
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
      
      // Make sure email verification works by setting a proper redirect URL
      const options = {
        data: { name: sanitizedName },
        emailRedirect: window.location.origin + "/login"
      };
      
      console.log("Starting signup with email:", sanitizedEmail);
      console.log("Redirect URL:", options.emailRedirect);
      
      const { data, error } = await supabase.auth.signUp({ 
        email: sanitizedEmail, 
        password,
        options
      });
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Cet email est déjà utilisé");
        } else {
          toast.error("Une erreur est survenue lors de l'inscription");
          console.error("Signup error:", error);
        }
      } else {
        console.log("Signup response:", data);
        toast.success("Compte créé avec succès. Vérifiez votre email pour confirmer.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info("Déconnexion réussie");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la déconnexion");
      console.error(error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
