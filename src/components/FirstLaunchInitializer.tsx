
import { useState, useEffect } from "react";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

const FirstLaunchInitializer: React.FC = () => {
  const { isFirstLaunch, isLoading } = useFirstLaunch();
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);

  useEffect(() => {
    const createTestUsers = async () => {
      if (!isFirstLaunch || isCreatingUsers) return;
      
      try {
        setIsCreatingUsers(true);
        toast.info("Création des utilisateurs de test en cours...");
        
        // Call Supabase Edge Function to create test users
        const { data, error } = await supabase.functions.invoke("create-test-users", {
          body: { admin_secret: "task_manager_secure_key" }
        });
        
        if (error) {
          console.error("Erreur lors de la création des utilisateurs:", error);
          toast.error("Échec de la création des utilisateurs de test");
          return;
        }
        
        console.log("Utilisateurs créés:", data);
        toast.success("Utilisateurs de test créés avec succès");
        
        // Force un rechargement de la page après la création des utilisateurs pour s'assurer
        // que tout est bien initialisé
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Une erreur est survenue");
      } finally {
        setIsCreatingUsers(false);
      }
    };
    
    if (isFirstLaunch && !isLoading) {
      createTestUsers();
    }
  }, [isFirstLaunch, isLoading, isCreatingUsers]);

  // Add a manual reset button for development purposes
  const handleResetUsers = async () => {
    if (import.meta.env.VITE_APP_ENV !== 'development') {
      toast.error("Cette fonctionnalité n'est disponible qu'en environnement de développement");
      return;
    }
    
    try {
      setIsCreatingUsers(true);
      toast.info("Réinitialisation des utilisateurs de test en cours...");
      
      const success = await authService.resetTestUsers();
      
      if (success) {
        toast.success("Utilisateurs de test réinitialisés avec succès");
        // Force un rechargement de la page
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Échec de la réinitialisation des utilisateurs de test");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsCreatingUsers(false);
    }
  };

  // This is a utility component that doesn't render anything visibly by default
  // But in development mode, it provides a reset button
  if (import.meta.env.VITE_APP_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleResetUsers}
          disabled={isCreatingUsers}
        >
          {isCreatingUsers ? "Réinitialisation..." : "Réinitialiser utilisateurs de test"}
        </Button>
      </div>
    );
  }
  
  return null;
};

export default FirstLaunchInitializer;
