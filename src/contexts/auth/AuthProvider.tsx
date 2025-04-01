
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import { UserProfile, TEST_USERS } from "./types";
import { handleSubscriptionParams, loadUserProfile } from "./authUtils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    
    if (user) {
      const handled = handleSubscriptionParams(queryParams, user, updateUserSubscription);
      if (handled) {
        toast.success("Abonnement souscrit avec succès!");
      }
    }
  }, [user, window.location.search]);

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
          subscription: testUser.subscription,
          stripe_customer_id: testUser.stripe_customer_id
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
        subscription: "trial",
        stripe_customer_id: `cus_test_${newId}`
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
        subscription: "trial",
        stripe_customer_id: `cus_test_${newId}`
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

  const updateUserSubscription = async (subscription: string) => {
    if (!user) return;
    
    try {
      // Update local user state
      const updatedUser = { ...user, subscription };
      setUser(updatedUser);
      
      // Update in local storage
      localStorage.setItem("testUser", JSON.stringify(updatedUser));
      
      // In a real implementation, you would also update this in your database
      toast.success(`Votre abonnement a été mis à jour vers ${subscription}`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'abonnement");
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    session,
    updateUserSubscription
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
