
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SubscriptionPlan = "standard" | "premium" | "trial" | "expired";

export interface Subscription {
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
        console.error("Subscription check error:", error);
        setError(error.message);
        toast.error("Erreur lors de la vérification de l'abonnement");
      } else {
        setSubscription(data.subscription);
      }
    } catch (err: any) {
      console.error("Subscription check exception:", err);
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
        console.error("Checkout session error:", error);
        toast.error("Erreur lors de la création de la session");
        return null;
      }

      return data.sessionUrl;
    } catch (err: any) {
      console.error("Checkout session exception:", err);
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

  // Fonction pour l'admin pour changer l'abonnement d'un utilisateur
  const updateUserSubscription = async (userId: string, plan: SubscriptionPlan) => {
    if (!user || user.role !== "superadmin") {
      toast.error("Permission refusée");
      return false;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription: plan })
        .eq("id", userId);

      if (error) {
        toast.error(`Erreur: ${error.message}`);
        return false;
      }

      toast.success(`Abonnement mis à jour avec succès`);
      return true;
    } catch (err: any) {
      toast.error(`Erreur: ${err.message}`);
      return false;
    }
  };

  // Fonction pour obtenir tous les abonnements (admin seulement)
  const getAllSubscriptions = async () => {
    if (!user || user.role !== "superadmin") {
      toast.error("Permission refusée");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, subscription, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(`Erreur: ${error.message}`);
        return [];
      }

      return data || [];
    } catch (err: any) {
      toast.error(`Erreur: ${err.message}`);
      return [];
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
    updateUserSubscription,
    getAllSubscriptions,
  };
};
