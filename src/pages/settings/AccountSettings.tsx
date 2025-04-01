
import React, { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AccountSettings: React.FC = () => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [user]);
  
  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setUpdating(true);
      
      // Only update name in the profiles table using type assertion
      const { error } = await (supabase
        .from('profiles') as any)
        .update({ name: formData.name })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Erreur lors de la mise à jour du profil");
        return;
      }
      
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error('Error in handleProfileUpdate:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setUpdating(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      setUpdatingPassword(true);
      
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error("Erreur lors de la mise à jour du mot de passe");
        return;
      }
      
      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast.success("Mot de passe mis à jour avec succès");
    } catch (error) {
      console.error('Error in handlePasswordUpdate:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setUpdatingPassword(false);
    }
  };

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
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié directement. Contactez un administrateur pour changer votre adresse email.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  value={
                    user?.role === "superadmin"
                      ? "Super Admin"
                      : user?.role === "admin"
                      ? "Administrateur"
                      : "Utilisateur"
                  }
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <Button 
                type="submit" 
                className="bg-brand-500 hover:bg-brand-600 mt-4"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder les changements"
                )}
              </Button>
            </div>
          </form>
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
          <form onSubmit={handlePasswordUpdate}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="bg-brand-500 hover:bg-brand-600 mt-4"
                disabled={updatingPassword}
              >
                {updatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountSettings;
