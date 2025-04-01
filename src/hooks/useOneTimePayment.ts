
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOneTimePayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async () => {
    try {
      setIsLoading(true);
      
      // Call the create-payment edge function (which we'll create next)
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { amount: 1000 }, // Amount in cents (e.g., 10.00 €)
      });

      if (error) {
        throw error;
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Une erreur est survenue lors de l'initialisation du paiement");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { initiatePayment, isLoading };
};
