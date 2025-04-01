
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserProfile } from "./types";

// Load user profile data from Supabase
export const loadUserProfile = async (userId: string, session: Session | null): Promise<UserProfile | null> => {
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
        stripe_customer_id: data.stripe_customer_id
      };
    }
  } catch (error) {
    console.error("Error in loadUserProfile:", error);
  }
  return null;
};

// Check for subscription URL parameters and handle them
export const handleSubscriptionParams = (
  queryParams: URLSearchParams, 
  user: UserProfile | null,
  updateUserSubscription: (subscription: string) => Promise<void>
) => {
  const subscriptionStatus = queryParams.get('subscription');
  
  if (subscriptionStatus === 'success' && user) {
    // For now, we'll just update the user's subscription for the demo
    if (user.email === "user@exemple.com") {
      updateUserSubscription("standard").then(() => {
        // Remove query params from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      });
      return true;
    }
  } else if (subscriptionStatus === 'canceled') {
    // Remove query params from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  
  return false;
};
