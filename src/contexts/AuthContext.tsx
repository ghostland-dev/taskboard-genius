
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "superadmin";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
