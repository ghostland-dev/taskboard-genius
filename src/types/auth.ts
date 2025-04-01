
import { Session } from "@supabase/supabase-js";

// Typage local de la table "profiles"
export type SupabaseProfileRow = {
  id: string;
  name: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "inactive";
  subscription: string;
  stripe_customer_id?: string;
  subscription_id?: string;
  subscription_status?: string;
  subscription_period_end?: string;
  created_at?: string;
  updated_at?: string;
};

// Utilisateur enrichi avec email de la session
export type UserProfile = SupabaseProfileRow & {
  email: string;
};

export type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
  refreshUser: () => Promise<void>;
};
