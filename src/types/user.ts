
import { SubscriptionPlan } from "@/hooks/useSubscription";

export type User = {
  id: string;
  name: string | null;
  email?: string; // Make email optional since it might not be in the profiles table
  role: string;
  subscription?: SubscriptionPlan;
  created_at?: string;
  status?: string;
  updated_at?: string;
};
