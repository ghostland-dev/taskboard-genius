
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/contexts/auth/types";

interface AdminSectionProps {
  user: UserProfile | null;
}

export const AdminSection: React.FC<AdminSectionProps> = ({ user }) => {
  const navigate = useNavigate();
  
  if (user?.role !== "superadmin") {
    return null;
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Administration
        </CardTitle>
        <CardDescription>Statistiques globales et gestion des utilisateurs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">Gérer les utilisateurs</p>
            <p className="text-muted-foreground">En tant que super admin, vous pouvez gérer tous les utilisateurs</p>
          </div>
          <Button 
            onClick={() => navigate("/users")}
            className="bg-primary hover:bg-primary/90"
          >
            <Users className="mr-2 h-4 w-4" />
            Gérer les utilisateurs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
