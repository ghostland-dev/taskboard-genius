
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

const SubscriptionSettings: React.FC = () => {
  const { subscription, loading, redirectToCheckout, isSubscribed, isPremium, isStandard, checkSubscription } = useSubscription();
  const location = useLocation();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success) {
      setStatusMessage("Abonnement réussi! Votre abonnement est maintenant actif.");
      toast.success("Abonnement réussi!");
      checkSubscription();
    } else if (canceled) {
      setStatusMessage("Processus d'abonnement annulé. Vous pouvez réessayer quand vous voulez.");
      toast.info("Processus d'abonnement annulé");
    }
  }, [location.search]);

  const handleSubscribe = async (plan: "standard" | "premium") => {
    redirectToCheckout(plan);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre abonnement</CardTitle>
        <CardDescription>
          Gérez votre forfait et vos options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {statusMessage && (
              <div className="bg-brand-100 p-4 rounded-lg mb-4">
                <p className="font-medium">{statusMessage}</p>
              </div>
            )}

            <div className="bg-brand-100 p-4 rounded-lg">
              <p className="font-medium">
                Forfait actuel: <span className="text-brand-600">
                  {isSubscribed 
                    ? (isPremium ? "Premium" : "Standard") 
                    : "Période d'essai"}
                </span>
              </p>
              {!isSubscribed && (
                <p className="text-sm text-muted-foreground mt-1">
                  Il vous reste 10 jours d'essai. Passez à un forfait payant pour débloquer toutes les fonctionnalités.
                </p>
              )}
              {isSubscribed && subscription && (
                <p className="text-sm text-muted-foreground mt-1">
                  Abonnement actif jusqu'au {new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className={`border-2 ${isStandard ? 'border-brand-500' : 'border-gray-200'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className={isStandard ? "text-brand-600" : ""}>Forfait Standard</CardTitle>
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
                  {isStandard ? (
                    <Button className="w-full bg-brand-500" disabled>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Abonnement actif
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe("standard")}
                      disabled={loading}
                    >
                      {isPremium ? "Passer au forfait Standard" : "S'abonner"}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className={`border-2 ${isPremium ? 'border-brand-500' : 'border-gray-200'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className={isPremium ? "text-brand-600" : ""}>Forfait Premium</CardTitle>
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
                  {isPremium ? (
                    <Button className="w-full bg-brand-500" disabled>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Abonnement actif
                    </Button>
                  ) : (
                    <Button 
                      variant={isStandard ? "outline" : "default"}
                      className="w-full" 
                      onClick={() => handleSubscribe("premium")}
                      disabled={loading}
                    >
                      {isStandard ? "Passer au forfait Premium" : "S'abonner"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
