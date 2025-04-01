
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for fetching users from Supabase
 */
export const useFetchUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "superadmin") {
      return;
    }
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Get users from the profiles table with type assertion
        const { data: profiles, error } = await (supabase
          .from('profiles') as any)
          .select('*');
        
        if (error) {
          console.error('Error fetching profiles:', error);
          toast.error("Erreur lors du chargement des utilisateurs");
          return;
        }
        
        // Get user stats with type assertion
        const { data: statsData, error: statsError } = await (supabase
          .from('user_stats') as any)
          .select('user_id, tasks_count');
          
        if (statsError) {
          console.error('Error fetching user stats:', statsError);
        }
        
        // Get user emails from auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
        }
        
        // Map emails to profiles
        let usersWithEmail: UserProfile[] = [];
        
        if (profiles) {
          usersWithEmail = profiles.map((profile: any) => {
            // Find matching auth user to get email
            const authUser = authUsers?.users?.find((u: any) => u.id === profile.id);
            // Find user stats
            const userStats = statsData?.find((s: any) => s.user_id === profile.id);
            
            return {
              ...profile,
              email: authUser?.email || 'Email non disponible',
              tasks_count: userStats?.tasks_count || 0
            };
          });
          
          setUsers(usersWithEmail);
        }
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        toast.error("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user?.role]);

  return {
    users,
    setUsers,
    loading
  };
};
