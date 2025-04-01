
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sparkles, PlusCircle, CreditCard } from "lucide-react"; // Added CreditCard import
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/contexts/auth/types";
import { useOneTimePayment } from "@/hooks/useOneTimePayment";
import { toast } from "sonner";

interface DashboardHeaderProps {
  user: UserProfile | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const { initiatePayment, isLoading } = useOneTimePayment();
  
  // User welcome greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Bonjour";
    } else if (hour < 18) {
      return "Bon après-midi";
    } else {
      return "Bonsoir";
    }
  };

  const handleOneTimePayment = async () => {
    try {
      await initiatePayment();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'initialisation du paiement");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold gradient-heading">{getGreeting()}, {user?.name}</h1>
              <p className="text-muted-foreground mt-1">
                Voici la vue d'ensemble de vos tâches et activités
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button 
            onClick={handleOneTimePayment}
            className="bg-primary/90 hover:bg-primary/80"
            disabled={isLoading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isLoading ? "Chargement..." : "Faire un don"}
          </Button>
          
          <Button 
            onClick={() => navigate("/tasks")}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {!user?.role && (
        <Alert className="bg-primary/5 border-primary/20 mt-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle>Période d'essai</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Vous êtes actuellement en période d'essai. Pour débloquer toutes les fonctionnalités, 
              passez à un abonnement payant.</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate('/settings')}
            >
              Voir les forfaits
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
