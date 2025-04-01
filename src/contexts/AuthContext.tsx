
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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, isSuperAdmin?: boolean) => Promise<void>;
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

  // Load user profile data from Supabase
  const loadUserProfile = async (userId: string) => {
    try {
      // Type assertion to tell TypeScript to trust that "profiles" exists
      const { data, error } = await (supabase
        .from("profiles") as any)
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
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);

        if (currentSession?.user) {
          const profile = await loadUserProfile(currentSession.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check current session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Connexion réussie");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, isSuperAdmin = false) => {
    try {
      setLoading(true);
      
      // For super admins, we'll use emailRedirect: false to avoid email verification
      const options = {
        data: { name },
        emailRedirect: isSuperAdmin ? undefined : `${window.location.origin}/login`
      };
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        if (isSuperAdmin) {
          // For super admins, automatically create a profile with superadmin role
          const { data: { user: newUser } } = await supabase.auth.getUser();
          
          if (newUser) {
            // Create profile for superadmin
            await (supabase.from("profiles") as any).insert({
              id: newUser.id,
              name,
              role: "superadmin",
              status: "active",
              subscription: "premium"
            });
            
            toast.success("Compte superadmin créé avec succès. Vous pouvez vous connecter immédiatement.");
          }
        } else {
          toast.success("Compte créé avec succès. Vérifiez votre email pour confirmer.");
        }
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
