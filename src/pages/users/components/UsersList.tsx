
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserProfile } from "../types";
import { Loader2 } from "lucide-react";

type UsersListProps = {
  users: UserProfile[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  handleRoleChange: (userId: string, newRole: string) => Promise<void>;
  handleStatusChange: (userId: string, newStatus: string) => Promise<void>;
};

const UsersList: React.FC<UsersListProps> = ({
  users,
  loading,
  formatDate,
  handleRoleChange,
  handleStatusChange
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Abonnement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Sélectionner rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.status}
                    onValueChange={(value) => handleStatusChange(user.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Sélectionner statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactif</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.subscription === "premium" ? "default" : "outline"} 
                    className={
                      user.subscription === "premium" 
                        ? "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
                        : user.subscription === "standard"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    {user.subscription === "premium" 
                      ? "Premium" 
                      : user.subscription === "standard" 
                      ? "Standard" 
                      : "Essai"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
