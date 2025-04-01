
import { useState } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SubscriptionPlan, useSubscription } from "@/hooks/useSubscription";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>("trial");
  const [userRole, setUserRole] = useState<string>("user");
  const { updateUserSubscription } = useSubscription();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles data from Supabase
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        toast.error(`Erreur lors du chargement des utilisateurs: ${error.message}`);
        return;
      }

      // Cast the data to our User type
      setUsers(data as User[]);
    } catch (err: any) {
      console.error("Error in fetchUsers:", err);
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Mettre à jour l'abonnement
      if (selectedUser.subscription !== subscriptionPlan) {
        await updateUserSubscription(selectedUser.id, subscriptionPlan);
      }

      // Mettre à jour le rôle si changé
      if (selectedUser.role !== userRole) {
        const { error } = await supabase
          .from("profiles")
          .update({ role: userRole })
          .eq("id", selectedUser.id);

        if (error) {
          console.error("Error updating user role:", error);
          toast.error(`Erreur lors de la mise à jour du rôle: ${error.message}`);
          return;
        }
      }

      toast.success("Utilisateur mis à jour avec succès");
      setDialogOpen(false);
      fetchUsers(); // Rafraîchir la liste des utilisateurs
    } catch (err: any) {
      console.error("Error in handleUpdateUser:", err);
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setSubscriptionPlan(user.subscription as SubscriptionPlan || "trial");
    setUserRole(user.role || "user");
    setDialogOpen(true);
  };

  return {
    users,
    loading,
    selectedUser,
    dialogOpen,
    subscriptionPlan,
    userRole,
    setSubscriptionPlan,
    setUserRole,
    setDialogOpen,
    fetchUsers,
    handleUpdateUser,
    openEditDialog,
  };
};
