
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth";

export const useUserProfile = () => {
  const loadUserProfile = async (userId: string, userSession: Session | null): Promise<UserProfile | null> => {
    try {
      // First check if we have a valid session
      if (!userSession?.user) {
        console.warn("Session manquante lors du chargement du profil");
        return null;
      }

      // Attempt to fetch profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erreur chargement profil:", error);
        
        // Return a minimal profile when the table might not exist yet
        return {
          id: userId,
          email: userSession.user.email || "",
          name: userSession.user.email ? userSession.user.email.split('@')[0] : "User",
          role: "user" as "user" | "admin" | "superadmin"
        };
      }

      // Ensure the role value conforms to the UserProfile type
      const validatedRole = (data.role === 'user' || data.role === 'admin' || data.role === 'superadmin') 
        ? data.role as "user" | "admin" | "superadmin" 
        : "user"; // Default to 'user' if value is not one of the expected values

      return {
        ...data,
        email: userSession.user.email || "",
        role: validatedRole
      } as UserProfile;
    } catch (error) {
      console.error("Erreur loadUserProfile:", error);
      
      // In case of error, return minimal profile
      if (userSession?.user) {
        return {
          id: userId,
          email: userSession.user.email || "",
          name: userSession.user.email ? userSession.user.email.split('@')[0] : "User",
          role: "user" as "user" | "admin" | "superadmin"
        };
      }
      
      return null;
    }
  };

  return { loadUserProfile };
};
