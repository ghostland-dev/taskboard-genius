
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SubscriptionPlan = "standard" | "premium";

interface Subscription {
  id: string;
  status: string;
  planType: SubscriptionPlan;
  currentPeriodEnd: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) {
        setError(error.message);
        toast.error("Erreur lors de la vérification de l'abonnement");
      } else {
        setSubscription(data.subscription);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Erreur lors de la vérification de l'abonnement");
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (plan: SubscriptionPlan, returnUrl?: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour vous abonner");
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-subscription", {
        body: { plan, returnUrl },
      });

      if (error) {
        toast.error("Erreur lors de la création de la session");
        return null;
      }

      return data.sessionUrl;
    } catch (err) {
      toast.error("Erreur lors de la création de la session");
      return null;
    }
  };

  const redirectToCheckout = async (plan: SubscriptionPlan, returnUrl?: string) => {
    const sessionUrl = await createCheckoutSession(plan, returnUrl);
    if (sessionUrl) {
      window.location.href = sessionUrl;
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  return {
    subscription,
    loading,
    error,
    checkSubscription,
    redirectToCheckout,
    isSubscribed: !!subscription,
    isPremium: subscription?.planType === "premium",
    isStandard: subscription?.planType === "standard",
  };
};
