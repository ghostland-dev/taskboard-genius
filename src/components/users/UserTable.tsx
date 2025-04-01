
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { formatDate } from "@/lib/utils-date";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser, onDeleteUser }) => {
  const getSubscriptionBadgeStyle = (subscription?: string) => {
    switch (subscription) {
      case "premium":
        return "border-yellow-300 text-yellow-700 bg-yellow-50";
      case "standard":
        return "border-blue-300 text-blue-700 bg-blue-50";
      case "expired":
        return "border-red-300 text-red-700 bg-red-50";
      default:
        return "border-gray-300 text-gray-700 bg-gray-50";
    }
  };

  const getSubscriptionLabel = (subscription?: string) => {
    switch (subscription) {
      case "premium":
        return "Premium";
      case "standard":
        return "Standard";
      case "expired":
        return "Expiré";
      default:
        return "Essai";
    }
  };

  if (users.length === 0) {
    return <div className="p-4 text-center text-gray-500">Aucun résultat trouvé</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Abonnement</TableHead>
          <TableHead>Inscription</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="hover:bg-slate-50">
            <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
            <TableCell>{user.email || "N/A"}</TableCell>
            <TableCell>
              <Badge variant={user.role === "superadmin" ? "default" : "outline"} className={user.role === "admin" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}>
                {user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Utilisateur"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant="outline" 
                className={getSubscriptionBadgeStyle(user.subscription)}
              >
                {getSubscriptionLabel(user.subscription)}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditUser(user)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Modifier</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteUser(user)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Supprimer</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
