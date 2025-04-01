
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserManagement from "@/components/UserManagement";
import AccessDeniedMessage from "@/components/users/AccessDeniedMessage";
import UserSummaryCard from "@/components/users/UserSummaryCard";
import UsersHeader from "@/components/users/UsersHeader";

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  
  // If user is not authenticated
  if (!user) {
    return <AccessDeniedMessage isLoggedIn={false} />;
  }
  
  // If user is not superadmin
  if (user.role !== "superadmin") {
    return <AccessDeniedMessage isLoggedIn={true} />;
  }

  return (
    <div className="space-y-6">
      <UsersHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserSummaryCard />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez tous les utilisateurs enregistrés dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
