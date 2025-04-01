
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const authService = {
  login: async (email: string, password: string): Promise<{ success: boolean }> => {
    try {
      const sanitizedEmail = email.trim().toLowerCase();

      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(sanitizedEmail)) {
        toast.error("Format d'email invalide");
        return { success: false };
      }

      console.log("Tentative de connexion avec l'email:", sanitizedEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        console.error("Erreur détaillée:", error);
        toast.error("Identifiants invalides");
        return { success: false };
      }

      if (!data.user || !data.session) {
        console.error("Authentification réussie mais données utilisateur manquantes");
        toast.error("Erreur lors de la connexion");
        return { success: false };
      }

      toast.success("Connexion réussie");
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error("Erreur lors de la connexion");
      return { success: false };
    }
  },

  signup: async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = name.trim();

      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(sanitizedEmail)) {
        toast.error("Format d'email invalide");
        return false;
      }

      if (sanitizedName.length < 2) {
        toast.error("Le nom doit contenir au moins 2 caractères");
        return false;
      }

      if (password.length < 8) {
        toast.error("Mot de passe trop court");
        return false;
      }

      // Signup without email verification
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: { name: sanitizedName },
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Email déjà utilisé");
        } else {
          toast.error("Erreur lors de l'inscription");
          console.error("Signup error:", error);
        }
        return false;
      } else {
        // Since emailConfirm is disabled in Supabase settings, we can log in immediately
        await authService.login(sanitizedEmail, password);
        toast.success("Compte créé avec succès");
        return true;
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
      console.error(error);
      return false;
    }
  },

  logout: async (): Promise<boolean> => {
    try {
      await supabase.auth.signOut();
      toast.info("Déconnexion réussie");
      return true;
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
      console.error(error);
      return false;
    }
  },
  
  // Helper method to clean database for testing purposes
  // This should only be used in development environments
  resetTestUsers: async (): Promise<boolean> => {
    try {
      if (import.meta.env.VITE_APP_ENV !== 'development') {
        console.error('Cannot reset users in non-development environment');
        return false;
      }
      
      await supabase.functions.invoke("create-test-users", {
        body: { admin_secret: "task_manager_secure_key" }
      });
      
      return true;
    } catch (error) {
      console.error("Error resetting test users:", error);
      return false;
    }
  }
};
