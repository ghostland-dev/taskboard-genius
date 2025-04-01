
import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full">
      <Alert className="max-w-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Accès non autorisé</AlertTitle>
        <AlertDescription>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
          Cette section est réservée aux super administrateurs.
        </AlertDescription>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => navigate("/dashboard")}
        >
          Retour au tableau de bord
        </Button>
      </Alert>
    </div>
  );
};

export default AccessDenied;
