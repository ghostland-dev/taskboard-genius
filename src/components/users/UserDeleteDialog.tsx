
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { User } from "@/types/user";

interface UserDeleteDialogProps {
  userToDelete: User | null;
  onOpenChange: (open: boolean) => void;
  onDeleteUser: () => Promise<void>;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  userToDelete,
  onOpenChange,
  onDeleteUser,
}) => {
  return (
    <AlertDialog open={userToDelete !== null} onOpenChange={(open) => !open && onOpenChange(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete?.name} ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={onDeleteUser}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserDeleteDialog;
