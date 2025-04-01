
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";

/**
 * Hook for managing user role changes
 */
export const useUserRole = (
  users: UserProfile[],
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>
) => {
  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Type assertion for the profiles table
      const { error } = await (supabase
        .from('profiles') as any)
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating user role:', error);
        toast.error("Erreur lors de la mise à jour du rôle");
        return;
      }
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      
      const roleDisplayNames = {
        user: "Utilisateur",
        admin: "Administrateur",
        superadmin: "Super Admin"
      };
      
      toast.success(`Rôle mis à jour vers ${roleDisplayNames[newRole as keyof typeof roleDisplayNames] || newRole}`);
    } catch (error) {
      console.error('Error in handleRoleChange:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return {
    handleRoleChange
  };
};
