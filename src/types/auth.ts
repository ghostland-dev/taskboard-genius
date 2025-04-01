
import { Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  role: "user" | "admin" | "superadmin";
  subscription_tier?: "free" | "premium" | "enterprise";
  subscription_status?: "active" | "trialing" | "canceled" | "past_due";
  subscription_id?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  session: Session | null;
  refreshUser: () => Promise<void>;
}
