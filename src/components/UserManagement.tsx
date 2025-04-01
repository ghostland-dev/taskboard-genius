
import React, { useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import UserTable from "./users/UserTable";
import UserEditDialog from "./users/UserEditDialog";
import { useUserManagement } from "@/hooks/useUserManagement";

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
    openEditDialog,
  } = useUserManagement();

  useEffect(() => {
    fetchUsers();
  }, []);

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
          <UserTable users={users} onEditUser={openEditDialog} />
        </div>
      )}

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
    </div>
  );
};

export default UserManagement;
