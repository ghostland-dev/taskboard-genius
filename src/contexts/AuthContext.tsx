
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
};

// Default users for testing
const TEST_USERS = [
  {
    id: "1",
    email: "admin@exemple.com",
    password: "admin123",
    name: "Admin Test",
    role: "admin",
    status: "active",
    subscription: "premium"
  },
  {
    id: "2",
    email: "user@exemple.com",
    password: "user123",
    name: "User Test",
    role: "user",
    status: "active",
    subscription: "trial"
  }
];

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  // Check for test user in local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("testUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing stored test user:", error);
        localStorage.removeItem("testUser");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

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
          subscription: data.subscription
        };
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error);
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Find test user
      const testUser = TEST_USERS.find(
        user => user.email === email && user.password === password
      );
      
      if (testUser) {
        // Create user profile without password field
        const userProfile: UserProfile = {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role as UserProfile["role"],
          status: testUser.status as "active" | "inactive",
          subscription: testUser.subscription
        };
        
        // Save to local storage and state
        localStorage.setItem("testUser", JSON.stringify(userProfile));
        setUser(userProfile);
        toast.success("Connexion réussie");
        return;
      }
      
      // If no test user matches, try Supabase authentication as fallback
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

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Create new test user
      const newId = (TEST_USERS.length + 1).toString();
      const newUser = {
        id: newId,
        email,
        password,
        name,
        role: "user" as const,
        status: "active" as const,
        subscription: "trial"
      };
      
      // Add to test users
      TEST_USERS.push(newUser);
      
      // Create user profile without password
      const userProfile: UserProfile = {
        id: newId,
        email,
        name,
        role: "user",
        status: "active",
        subscription: "trial"
      };
      
      // Save to local storage and state
      localStorage.setItem("testUser", JSON.stringify(userProfile));
      setUser(userProfile);
      toast.success("Compte créé avec succès. Vous êtes maintenant connecté.");
      
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear test user from local storage
      localStorage.removeItem("testUser");
      setUser(null);
      
      // Also sign out from Supabase if there was a session
      if (session) {
        await supabase.auth.signOut();
      }
      
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
