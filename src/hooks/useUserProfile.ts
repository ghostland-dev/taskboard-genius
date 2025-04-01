
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth";

export const useUserProfile = () => {
  const loadUserProfile = async (userId: string, userSession: Session | null): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erreur chargement profil:", error);
        return null;
      }

      if (!userSession?.user?.email) {
        console.warn("Email manquant dans la session");
        return null;
      }

      return {
        ...data,
        email: userSession.user.email,
      };
    } catch (error) {
      console.error("Erreur loadUserProfile:", error);
      return null;
    }
  };

  return { loadUserProfile };
};
