
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreVertical, User } from "lucide-react";
import { UserProfile } from "../types";

type UsersListProps = {
  users: UserProfile[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  handleRoleChange: (userId: string, newRole: string) => Promise<void>;
  handleStatusChange: (userId: string, newStatus: string) => Promise<void>;
};

const UsersList = ({ 
  users, 
  loading, 
  formatDate, 
  handleRoleChange, 
  handleStatusChange 
}: UsersListProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des utilisateurs...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
        <p>Aucun utilisateur trouvé</p>
        <p className="text-sm mt-1">Créez votre premier utilisateur en cliquant sur "Nouvel utilisateur"</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Tâches</TableHead>
          <TableHead>Inscription</TableHead>
          <TableHead>Abonnement</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === "superadmin" ? "default" : "outline"}>
                {user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Utilisateur"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge 
                className={
                  user.status === "active" 
                    ? "bg-green-500" 
                    : "bg-gray-500"
                }
              >
                {user.status === "active" ? "Actif" : "Inactif"}
              </Badge>
            </TableCell>
            <TableCell>{user.tasks_count || 0}</TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
            <TableCell>
              <Badge 
                variant="outline" 
                className={
                  user.subscription === "premium" 
                    ? "border-yellow-300 text-yellow-700 bg-yellow-50" 
                    : user.subscription === "standard"
                    ? "border-blue-300 text-blue-700 bg-blue-50"
                    : "border-gray-300 text-gray-700 bg-gray-50"
                }
              >
                {user.subscription === "premium" 
                  ? "Premium" 
                  : user.subscription === "standard" 
                  ? "Standard" 
                  : user.subscription === "trial" 
                  ? "Essai"
                  : "Expiré"
                }
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir le menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)}>
                    Voir le profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Changer le rôle</DropdownMenuLabel>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange(user.id, 'user')}
                    disabled={user.role === 'user'}
                  >
                    Utilisateur
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange(user.id, 'admin')}
                    disabled={user.role === 'admin'}
                  >
                    Administrateur
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange(user.id, 'superadmin')}
                    disabled={user.role === 'superadmin'}
                  >
                    Super Admin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className={user.status === 'active' ? "text-red-600" : "text-green-600"}
                    onClick={() => handleStatusChange(
                      user.id, 
                      user.status === 'active' ? 'inactive' : 'active'
                    )}
                  >
                    {user.status === 'active' ? "Désactiver" : "Activer"} le compte
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersList;
