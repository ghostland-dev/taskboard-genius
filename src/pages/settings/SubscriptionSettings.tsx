
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { CheckCircle, Clock, AlertCircle, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

// Price IDs for the subscription plans
const STANDARD_PRICE_ID = "price_1H8tFiEDWgz2TvU1VU3UJbLK"; // Replace with your actual Standard price ID
const PREMIUM_PRICE_ID = "price_1H8tFiEDWgz2TvU1o3YHQftG"; // Replace with your actual Premium price ID

const SubscriptionSettings: React.FC = () => {
  const { subscription, loading, createCheckoutSession } = useSubscription();
  const [searchParams] = useSearchParams();
  
  // Handle success or cancelled checkout
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    
    if (checkoutStatus === 'success') {
      toast.success('Votre abonnement a été activé avec succès!');
    } else if (checkoutStatus === 'canceled') {
      toast.info('Le paiement a été annulé');
    }
  }, [searchParams]);

  // Format subscription end date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date inconnue';
    }
  };

  // Function to handle subscription
  const handleSubscribe = (priceId: string, plan: string) => {
    createCheckoutSession(priceId, plan);
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
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        ) : (
          <>
            <div className={`p-4 rounded-lg ${subscription ? 'bg-green-50' : 'bg-brand-100'}`}>
              {subscription ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-500 mr-2" />
                      <p className="font-medium">
                        Forfait actuel: <span className="text-brand-600">{subscription.product_name}</span>
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Actif
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {subscription.price} €/{subscription.plan === 'standard' ? 'mois' : 'mois'}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        Prochain renouvellement le {formatDate(subscription.current_period_end)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium">Forfait actuel: <span className="text-brand-600">Période d'essai</span></p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Il vous reste 10 jours d'essai. Passez à un forfait payant pour débloquer toutes les fonctionnalités.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className={`${subscription?.plan === 'standard' ? 'border-2 border-green-500' : 'border-2 border-brand-500'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-brand-600">Forfait Standard</CardTitle>
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
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    disabled={subscription?.plan === 'standard'}
                    onClick={() => handleSubscribe(STANDARD_PRICE_ID, 'standard')}
                  >
                    {subscription?.plan === 'standard' ? 'Votre forfait actuel' : 'S\'abonner'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className={`${subscription?.plan === 'premium' ? 'border-2 border-green-500' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle>Forfait Premium</CardTitle>
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
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={subscription?.plan === 'premium' ? 'default' : 'outline'} 
                    className="w-full"
                    disabled={subscription?.plan === 'premium'}
                    onClick={() => handleSubscribe(PREMIUM_PRICE_ID, 'premium')}
                  >
                    {subscription?.plan === 'premium' ? 'Votre forfait actuel' : 'S\'abonner'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
