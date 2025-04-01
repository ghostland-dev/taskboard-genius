
import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import UserTable from "./users/UserTable";
import UserEditDialog from "./users/UserEditDialog";
import UserCreateDialog from "./users/UserCreateDialog";
import UserDeleteDialog from "./users/UserDeleteDialog";
import UserSearch from "./users/UserSearch";
import UserLoading from "./users/UserLoading";
import UserEmptyState from "./users/UserEmptyState";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types/user";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

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
    return <UserLoading />;
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
          <UserEmptyState />
        ) : (
          <div className="space-y-4">
            <UserSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            
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
      <UserCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        newUserData={newUserData}
        setNewUserData={setNewUserData}
        onCreateUser={handleCreateUser}
      />

      {/* Dialog de confirmation de suppression */}
      <UserDeleteDialog
        userToDelete={userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onDeleteUser={executeDeleteUser}
      />
    </Card>
  );
};

export default UserManagement;
