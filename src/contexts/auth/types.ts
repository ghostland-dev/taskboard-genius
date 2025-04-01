
import { Session, User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "inactive";
  subscription: string;
  stripe_customer_id?: string;
};

export type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
  updateUserSubscription: (subscription: string) => Promise<void>;
};

// Default test users for authentication
export const TEST_USERS = [
  {
    id: "1",
    email: "admin@exemple.com",
    password: "admin123",
    name: "Admin Test",
    role: "admin",
    status: "active",
    subscription: "premium",
    stripe_customer_id: "cus_test_1"
  },
  {
    id: "2",
    email: "user@exemple.com",
    password: "user123",
    name: "User Test",
    role: "user",
    status: "active",
    subscription: "trial",
    stripe_customer_id: "cus_test_2"
  }
];
