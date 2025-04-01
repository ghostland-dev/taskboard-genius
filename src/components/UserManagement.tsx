
import React, { useEffect, useState } from "react";
import { Loader2, AlertTriangle, Plus, UserPlus, Search } from "lucide-react";
import UserTable from "./users/UserTable";
import UserEditDialog from "./users/UserEditDialog";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { User } from "@/types/user";

const UserManagement = () => {
  const {
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
    handleDeleteUser,
    openEditDialog,
    createNewUser,
  } = useUserManagement();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    name: "",
    role: "user",
    subscription: "trial"
  });

  // État pour le dialogue de confirmation de suppression
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.name) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const success = await createNewUser(newUserData);
    if (success) {
      setShowCreateDialog(false);
      setNewUserData({
        email: "",
        name: "",
        role: "user",
        subscription: "trial"
      });
    }
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const executeDeleteUser = async () => {
    if (userToDelete) {
      await handleDeleteUser(userToDelete.id);
      setUserToDelete(null);
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
    <Card className="shadow-md border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Utilisateurs</CardTitle>
            <CardDescription>
              Gérez les utilisateurs et leurs permissions
            </CardDescription>
          </div>
          
          <Button 
            className="bg-brand-500 hover:bg-brand-600"
            onClick={() => setShowCreateDialog(true)}
          >
            <UserPlus size={16} className="mr-2" />
            Nouvel utilisateur
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {users.length === 0 ? (
          <div className="bg-slate-50 p-6 rounded-lg flex flex-col items-center justify-center h-64">
            <AlertTriangle className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-center text-slate-600">
              Aucun utilisateur trouvé. Les utilisateurs apparaîtront ici une fois qu'ils auront créé un compte.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-10 bg-slate-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <UserTable 
                users={filteredUsers} 
                onEditUser={openEditDialog} 
                onDeleteUser={confirmDeleteUser}
              />
            </div>
            
            {filteredUsers.length === 0 && searchQuery !== "" && (
              <div className="text-center py-8 text-slate-500">
                Aucun utilisateur trouvé pour "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-slate-50 py-3 px-6">
        <div className="flex justify-between items-center w-full text-sm text-slate-500">
          <span>Total: {users.length} utilisateurs</span>
          <Button variant="ghost" size="sm" onClick={fetchUsers}>
            Actualiser
          </Button>
        </div>
      </CardFooter>

      {/* Dialog d'édition d'utilisateur */}
      <UserEditDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedUser={selectedUser}
        userRole={userRole}
        setUserRole={setUserRole}
        subscriptionPlan={subscriptionPlan}
        setSubscriptionPlan={setSubscriptionPlan}
        onSave={handleUpdateUser}
      />

      {/* Dialog de création d'utilisateur */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Créer un nouvel utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez remplir les informations suivantes pour créer un nouvel utilisateur
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium">
                Nom
              </label>
              <Input
                id="name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                className="col-span-3"
                placeholder="Nom complet"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                className="col-span-3"
                placeholder="email@exemple.com"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                Rôle
              </label>
              <div className="flex flex-wrap gap-2 col-span-3">
                {["user", "admin", "superadmin"].map((role) => (
                  <Badge
                    key={role}
                    variant={newUserData.role === role ? "default" : "outline"}
                    className={`cursor-pointer ${
                      newUserData.role === role ? "bg-brand-500" : ""
                    }`}
                    onClick={() => setNewUserData({...newUserData, role: role})}
                  >
                    {role === "superadmin" ? "Super Admin" : role === "admin" ? "Admin" : "Utilisateur"}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                Abonnement
              </label>
              <div className="flex flex-wrap gap-2 col-span-3">
                {["trial", "standard", "premium", "expired"].map((plan) => (
                  <Badge
                    key={plan}
                    variant={newUserData.subscription === plan ? "default" : "outline"}
                    className={`cursor-pointer ${
                      newUserData.subscription === plan
                        ? plan === "premium" 
                          ? "bg-yellow-500" 
                          : plan === "standard" 
                            ? "bg-blue-500" 
                            : plan === "expired" 
                              ? "bg-red-500"
                              : "bg-slate-500"
                        : ""
                    }`}
                    onClick={() => setNewUserData({...newUserData, subscription: plan})}
                  >
                    {plan === "premium" 
                      ? "Premium" 
                      : plan === "standard" 
                        ? "Standard" 
                        : plan === "expired" 
                          ? "Expiré" 
                          : "Essai"}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateUser}>Créer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete?.name} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={executeDeleteUser}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UserManagement;
