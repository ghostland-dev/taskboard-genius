
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SubscriptionSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  // Product IDs
  const STANDARD_PRICE_ID = "prod_S3CLObpFqxyJmL";
  const PREMIUM_PRICE_ID = "prod_S3CLSKAjkdYGg8";

  const handleSubscribe = async (priceId: string, planName: string) => {
    try {
      setLoading(planName);
      
      // Use the supabase edge function to create a checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
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
      console.error("Error creating checkout session:", error);
      toast.error("Une erreur est survenue lors de la création de l'abonnement");
    } finally {
      setLoading(null);
    }
  };

  // Check subscription status
  const isStandardActive = user?.subscription === "standard";
  const isPremiumActive = user?.subscription === "premium";
  const isTrial = user?.subscription === "trial";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre abonnement</CardTitle>
        <CardDescription>
          Gérez votre forfait et vos options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-brand-100 p-4 rounded-lg">
          <p className="font-medium">
            Forfait actuel: <span className="text-brand-600">
              {isPremiumActive ? "Premium" : 
               isStandardActive ? "Standard" : 
               "Période d'essai"}
            </span>
          </p>
          {isTrial && (
            <p className="text-sm text-muted-foreground mt-1">
              Il vous reste 10 jours d'essai. Passez à un forfait payant pour débloquer toutes les fonctionnalités.
            </p>
          )}
          {(isStandardActive || isPremiumActive) && (
            <p className="text-sm text-muted-foreground mt-1">
              Vous bénéficiez de toutes les fonctionnalités incluses dans votre forfait.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card className={`${isStandardActive ? 'border-2 border-brand-500' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className={isStandardActive ? "text-brand-600" : ""}>Forfait Standard</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">9,99€/mois</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Jusqu'à 500 tâches
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Notifications par email
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Exportation PDF
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handleSubscribe(STANDARD_PRICE_ID, "standard")}
                disabled={loading !== null || isStandardActive}
              >
                {loading === "standard" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : isStandardActive ? (
                  "Abonnement actif"
                ) : (
                  "S'abonner"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className={`${isPremiumActive ? 'border-2 border-brand-500' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className={isPremiumActive ? "text-brand-600" : ""}>Forfait Premium</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">19,99€/mois</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Tâches illimitées
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Notifications email + SMS
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Exports PDF et CSV
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Support prioritaire
                </li>
              </ul>
              <Button 
                variant={isPremiumActive ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSubscribe(PREMIUM_PRICE_ID, "premium")}
                disabled={loading !== null || isPremiumActive}
              >
                {loading === "premium" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : isPremiumActive ? (
                  "Abonnement actif"
                ) : (
                  "S'abonner"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
