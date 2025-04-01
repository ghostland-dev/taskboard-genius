
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AccountSettings: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Information du compte</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              defaultValue={user?.name || ""}
              readOnly={user?.role === "superadmin"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email || ""}
              readOnly={user?.role === "superadmin"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Input
              id="role"
              defaultValue={
                user?.role === "superadmin"
                  ? "Super Admin"
                  : user?.role === "admin"
                  ? "Administrateur"
                  : "Utilisateur"
              }
              readOnly
            />
          </div>

          <Button className="bg-brand-500 hover:bg-brand-600 mt-4">
            Sauvegarder les changements
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input id="confirm-password" type="password" />
          </div>

          <Button className="bg-brand-500 hover:bg-brand-600 mt-4">
            Mettre à jour le mot de passe
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountSettings;
