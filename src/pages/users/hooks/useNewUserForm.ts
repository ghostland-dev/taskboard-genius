
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserStats } from "../types";

/**
 * Hook for managing new user form
 */
export const useNewUserForm = (
  users: UserProfile[],
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>,
  stats: UserStats,
  setStats: React.Dispatch<React.SetStateAction<UserStats>>
) => {
  // New user form state
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user",
    status: "active",
    subscription: "trial"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle new user form submission
  const handleNewUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Generate a random secure password
      const tempPassword = Math.random().toString(36).slice(-10) + 
                          Math.random().toString(36).toUpperCase().slice(-2) + 
                          Math.floor(Math.random() * 10) + 
                          "!";
      
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name: newUser.name }
      });
      
      if (error) {
        console.error('Error creating user:', error);
        toast.error(`Erreur: ${error.message}`);
        return;
      }
      
      if (data.user) {
        // Type assertion for profiles table
        const { error: profileError } = await (supabase
          .from('profiles') as any)
          .update({
            role: newUser.role,
            status: newUser.status,
            subscription: newUser.subscription
          })
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error('Error updating user profile:', profileError);
          toast.error("Utilisateur créé mais erreur lors de la mise à jour du profil");
        } else {
          toast.success("Utilisateur créé avec succès");
          setIsDialogOpen(false);
          
          // Reset form
          setNewUser({
            email: "",
            name: "",
            role: "user",
            status: "active",
            subscription: "trial"
          });
          
          // Refresh user list
          const newUserProfile: UserProfile = {
            id: data.user.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            subscription: newUser.subscription,
            created_at: new Date().toISOString(),
            tasks_count: 0
          };
          
          setUsers([...users, newUserProfile]);
          
          // Update stats
          setStats({
            total: stats.total + 1,
            active: newUser.status === 'active' ? stats.active + 1 : stats.active,
            premium: newUser.subscription === 'premium' ? stats.premium + 1 : stats.premium
          });
        }
      }
    } catch (error) {
      console.error('Error in handleNewUserSubmit:', error);
      toast.error("Une erreur est survenue lors de la création de l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    newUser,
    setNewUser,
    isDialogOpen,
    setIsDialogOpen,
    isSubmitting,
    handleNewUserSubmit
  };
};
