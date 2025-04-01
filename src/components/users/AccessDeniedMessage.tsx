
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccessDeniedMessageProps {
  isLoggedIn: boolean;
}

const AccessDeniedMessage: React.FC<AccessDeniedMessageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center h-full">
      <Alert className="max-w-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Accès non autorisé</AlertTitle>
        <AlertDescription>
          {isLoggedIn 
            ? "Vous n'avez pas les permissions nécessaires pour accéder à cette page. Cette section est réservée aux super administrateurs."
            : "Vous devez vous connecter pour accéder à cette page."}
        </AlertDescription>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
        >
          {isLoggedIn ? "Retour au tableau de bord" : "Se connecter"}
        </Button>
      </Alert>
    </div>
  );
};

export default AccessDeniedMessage;
