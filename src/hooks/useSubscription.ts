
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid' | null;

export type Subscription = {
  id: string;
  status: SubscriptionStatus;
  current_period_end: string;
  plan: string;
  product_name: string;
  price: string;
  currency: string;
  cancel_at_period_end: boolean;
} | null;

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the subscription status
  const fetchSubscription = async () => {
    if (!user || !session) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        toast.error('Erreur lors de la vérification de l\'abonnement');
        return;
      }

      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Function to create a checkout session
  const createCheckoutSession = async (priceId: string, plan: string) => {
    if (!user || !session) {
      toast.error('Vous devez être connecté pour vous abonner');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Erreur lors de la création de la session de paiement');
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      toast.error('Une erreur est survenue lors de la redirection vers le paiement');
    }
  };

  // Fetch subscription status on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, session]);

  return {
    subscription,
    loading,
    fetchSubscription,
    createCheckoutSession,
  };
};
