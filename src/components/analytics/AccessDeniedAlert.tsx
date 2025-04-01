
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AccessDeniedAlert: React.FC = () => {
  const navigate = useNavigate();
  
  const handleReturn = () => {
    toast.info("Retour au tableau de bord", {
      description: "Vous avez été redirigé vers le tableau de bord"
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="flex items-center justify-center h-full">
      <Alert className="max-w-lg bg-destructive/10 border-destructive">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-destructive font-semibold">Accès non autorisé</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. Cette section est réservée aux administrateurs.
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre administrateur système.
          </p>
        </AlertDescription>
        <Button 
          className="mt-4 w-full sm:w-auto" 
          variant="outline" 
          onClick={handleReturn}
        >
          Retour au tableau de bord
        </Button>
      </Alert>
    </div>
  );
};

export default AccessDeniedAlert;
