
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserStats } from "../types";

/**
 * Hook for managing user status changes
 */
export const useUserStatus = (
  users: UserProfile[],
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>,
  stats: UserStats,
  setStats: React.Dispatch<React.SetStateAction<UserStats>>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle user status change
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // Type assertion for profiles table
      const { error } = await (supabase
        .from('profiles') as any)
        .update({ status: newStatus })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating user status:', error);
        toast.error("Erreur lors de la mise à jour du statut");
        return;
      }
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      
      // Update stats
      setStats({
        ...stats,
        active: newStatus === 'active' 
          ? stats.active + 1 
          : stats.active - 1
      });
      
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleStatusChange
  };
};
