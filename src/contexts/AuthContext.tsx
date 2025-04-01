
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionPlan = "trial" | "standard" | "premium" | "expired";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "superadmin";
  subscription?: SubscriptionPlan;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  checkSubscription: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to check subscription status
  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }
      
      if (data.subscription) {
        setUser((prev) => 
          prev ? { ...prev, subscription: data.subscription.planType } : null
        );
      }
    } catch (error: any) {
      console.error("Error checking subscription:", error);
    }
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      // Mise à jour du profil dans Supabase
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) {
        toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
        throw error;
      }

      // Mise à jour de l'état local
      setUser((prev) => prev ? { ...prev, ...updates } : null);
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check subscription when user changes
    if (user) {
      checkSubscription();
    }
  }, [user?.id]);

  const login = (email: string, password: string) => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      // Mock authentication for demo purposes
      if (email === "superadmin@nomdomain.fr" && password === "HolySsit++ @!") {
        const superadminUser = {
          id: "1",
          email: "superadmin@nomdomain.fr",
          name: "Super Admin",
          role: "superadmin" as const,
          subscription: "premium" as const,
        };
        setUser(superadminUser);
        localStorage.setItem("user", JSON.stringify(superadminUser));
        toast.success("Connexion réussie en tant que Super Admin");
      } else if (email && password) {
        // Mock regular user login
        const regularUser = {
          id: "2",
          email,
          name: email.split("@")[0],
          role: "user" as const,
          subscription: "trial" as const,
        };
        setUser(regularUser);
        localStorage.setItem("user", JSON.stringify(regularUser));
        toast.success("Connexion réussie");
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Déconnexion réussie");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    checkSubscription,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
