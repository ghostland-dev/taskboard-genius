
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserManagement from "@/components/UserManagement";
import { useSubscription } from "@/hooks/useSubscription";

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Si l'utilisateur n'est pas superadmin, rediriger ou afficher un message
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Vous devez vous connecter pour accéder à cette page.
          </AlertDescription>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => navigate("/login")}
          >
            Se connecter
          </Button>
        </Alert>
      </div>
    );
  }
  
  if (user?.role !== "superadmin") {
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
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground mt-1">
            Administrez les comptes utilisateurs de votre application
          </p>
        </div>
        <Button 
          className="bg-brand-500 hover:bg-brand-600"
          onClick={() => navigate("/settings?tab=subscription")}
        >
          <UserPlus size={16} className="mr-2" />
          Gérer les abonnements
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Gestion des utilisateurs</p>
                <p className="text-3xl font-bold">Administration</p>
              </div>
              <div className="bg-brand-100 p-3 rounded-full">
                <User className="text-brand-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez tous les utilisateurs enregistrés dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
