
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AccessDenied from "./AccessDenied";
import UserStatsCards from "./components/UserStatsCards";
import UsersList from "./components/UsersList";
import AddUserDialog from "./components/AddUserDialog";
import { useUserManagement } from "./hooks/useUserManagement";

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const {
    users,
    loading,
    stats,
    newUser,
    setNewUser,
    isDialogOpen,
    setIsDialogOpen,
    isSubmitting,
    formatDate,
    handleRoleChange,
    handleStatusChange,
    handleNewUserSubmit
  } = useUserManagement();

  // If the user isn't superadmin, show access denied
  if (user?.role !== "superadmin") {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground mt-1">
            Administrez les comptes utilisateurs de votre application
          </p>
        </div>
        <AddUserDialog
          onSubmit={handleNewUserSubmit}
          newUser={newUser}
          setNewUser={setNewUser}
          isSubmitting={isSubmitting}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      <UserStatsCards stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez tous les utilisateurs enregistrés dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersList
            users={users}
            loading={loading}
            formatDate={formatDate}
            handleRoleChange={handleRoleChange}
            handleStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
