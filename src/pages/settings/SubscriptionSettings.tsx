
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { formatSubscriptionStatus, formatSubscriptionEndDate } from "../users/utils/userProfileUtils";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

const SubscriptionSettings: React.FC = () => {
  const { subscription, loading, createCheckoutSession } = useSubscription();
  
  const handleSubscribe = async () => {
    // Price ID for premium plan - this should come from your Stripe dashboard
    const pricePremium = "price_premium_monthly";
    await createCheckoutSession(pricePremium, "premium");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion de l'abonnement</CardTitle>
        <CardDescription>
          Consultez et gérez votre abonnement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : subscription ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-medium text-lg">{subscription.product_name || "Plan Premium"}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatSubscriptionStatus(subscription.status)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {subscription.price} {subscription.currency}/mois
                </p>
                <p className="text-sm text-muted-foreground">
                  Renouvelé le {formatSubscriptionEndDate(subscription.current_period_end)}
                </p>
              </div>
            </div>
            
            {subscription.cancel_at_period_end && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">
                  Votre abonnement sera annulé le {formatSubscriptionEndDate(subscription.current_period_end)}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="font-medium">Gérer l'abonnement</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.open("https://billing.stripe.com/p/login/test", "_blank")}
                >
                  Gérer le paiement
                </Button>
                {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                  <Button 
                    variant="outline" 
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => window.open("https://billing.stripe.com/p/login/test", "_blank")}
                  >
                    Annuler l'abonnement
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h3 className="text-lg font-medium mb-2">Vous n'avez pas d'abonnement actif</h3>
              <p className="text-muted-foreground mb-6">
                Abonnez-vous pour profiter de toutes les fonctionnalités premium
              </p>
              
              <div className="max-w-md mx-auto p-6 border rounded-lg bg-card">
                <h4 className="text-xl font-bold text-center text-primary mb-4">Plan Premium</h4>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                    <span>Tâches illimitées</span>
                  </li>
                  <li className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                    <span>Statistiques avancées</span>
                  </li>
                  <li className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleSubscribe}>
                  S'abonner - 9,99€/mois
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
