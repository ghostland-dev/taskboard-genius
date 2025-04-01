
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newUserData: {
    email: string;
    name: string;
    role: string;
    subscription: string;
  };
  setNewUserData: (data: {
    email: string;
    name: string;
    role: string;
    subscription: string;
  }) => void;
  onCreateUser: () => Promise<void>;
}

const UserCreateDialog: React.FC<UserCreateDialogProps> = ({
  open,
  onOpenChange,
  newUserData,
  setNewUserData,
  onCreateUser,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <AlertDialogAction onClick={onCreateUser}>Créer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserCreateDialog;
