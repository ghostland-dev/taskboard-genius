
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSubscription, SubscriptionPlan } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email?: string; // Make email optional since it might not be in the profiles table
  role: string;
  subscription?: SubscriptionPlan;
  created_at?: string;
  status?: string;
  updated_at?: string;
};

const UserManagement = () => {
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
        toast.error(`Erreur lors du chargement des utilisateurs: ${error.message}`);
        return;
      }

      // Cast the data to our User type
      setUsers(data as User[]);
    } catch (err: any) {
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          toast.error(`Erreur lors de la mise à jour du rôle: ${error.message}`);
          return;
        }
      }

      toast.success("Utilisateur mis à jour avec succès");
      setDialogOpen(false);
      fetchUsers(); // Rafraîchir la liste des utilisateurs
    } catch (err: any) {
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setSubscriptionPlan(user.subscription as SubscriptionPlan || "trial");
    setUserRole(user.role || "user");
    setDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getSubscriptionBadgeStyle = (subscription?: string) => {
    switch (subscription) {
      case "premium":
        return "border-yellow-300 text-yellow-700 bg-yellow-50";
      case "standard":
        return "border-blue-300 text-blue-700 bg-blue-50";
      case "expired":
        return "border-red-300 text-red-700 bg-red-50";
      default:
        return "border-gray-300 text-gray-700 bg-gray-50";
    }
  };

  const getSubscriptionLabel = (subscription?: string) => {
    switch (subscription) {
      case "premium":
        return "Premium";
      case "standard":
        return "Standard";
      case "expired":
        return "Expiré";
      default:
        return "Essai";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <p className="ml-2">Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div>
      {users.length === 0 ? (
        <div className="bg-slate-50 p-6 rounded-lg flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-slate-400 mb-4" />
          <p className="text-center text-slate-600">
            Aucun utilisateur trouvé. Les utilisateurs apparaîtront ici une fois qu'ils auront créé un compte.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left font-medium text-slate-700">Nom</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Email</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Rôle</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Abonnement</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Inscription</th>
                <th className="px-6 py-3 text-left font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4">{user.name || "N/A"}</td>
                  <td className="px-6 py-4">{user.email || "N/A"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === "superadmin" ? "default" : "outline"}>
                      {user.role === "superadmin" ? "Super Admin" : "Utilisateur"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant="outline" 
                      className={getSubscriptionBadgeStyle(user.subscription)}
                    >
                      {getSubscriptionLabel(user.subscription)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(user)}
                    >
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog pour éditer un utilisateur */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifier les détails de l'utilisateur {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rôle
              </Label>
              <Select 
                value={userRole}
                onValueChange={setUserRole}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subscription" className="text-right">
                Abonnement
              </Label>
              <Select 
                value={subscriptionPlan}
                onValueChange={(value) => setSubscriptionPlan(value as SubscriptionPlan)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un abonnement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Essai</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateUser}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
