
import { useState, useEffect } from "react";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // This is a utility component that doesn't render anything
  return null;
};

export default FirstLaunchInitializer;
