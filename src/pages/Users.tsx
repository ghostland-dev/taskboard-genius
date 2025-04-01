
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Search, MoreVertical, UserCheck, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock user data for the admin page
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "inactive";
  subscription: "trial" | "standard" | "premium" | "none";
  lastActive: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@nomdomain.fr",
    role: "superadmin",
    status: "active",
    subscription: "premium",
    lastActive: "Aujourd'hui à 10:45",
  },
  {
    id: "2",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "user",
    status: "active",
    subscription: "standard",
    lastActive: "Hier à 15:30",
  },
  {
    id: "3",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    role: "user",
    status: "active",
    subscription: "trial",
    lastActive: "Il y a 3 jours",
  },
  {
    id: "4",
    name: "Pierre Lefebvre",
    email: "pierre.lefebvre@example.com",
    role: "admin",
    status: "active",
    subscription: "premium",
    lastActive: "Aujourd'hui à 09:15",
  },
  {
    id: "5",
    name: "Sophie Dubois",
    email: "sophie.dubois@example.com",
    role: "user",
    status: "inactive",
    subscription: "none",
    lastActive: "Il y a 2 semaines",
  },
];

const Users: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as const,
  });

  // Check if current user is superadmin
  const isSuperAdmin = user?.role === "superadmin";

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    const user: User = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      subscription: "trial",
      lastActive: "Jamais",
    };

    setUsers([...users, user]);
    setShowAddUserDialog(false);
    setNewUser({ name: "", email: "", role: "user" });
    toast.success("Utilisateur ajouté avec succès");
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "inactive" : "active";
          return { ...user, status: newStatus };
        }
        return user;
      })
    );

    const targetUser = users.find((user) => user.id === userId);
    const newStatus = targetUser?.status === "active" ? "inactive" : "active";
    
    toast.success(
      `Statut de l'utilisateur mis à jour : ${
        newStatus === "active" ? "Actif" : "Inactif"
      }`
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    toast.success("Utilisateur supprimé avec succès");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les utilisateurs de l'application
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur(s) au total
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
              <DialogTrigger asChild>
                <Button className="bg-brand-500 hover:bg-brand-600">
                  <Plus size={16} className="mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer un nouvel utilisateur
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "user" | "admin" | "superadmin") => 
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        {isSuperAdmin && (
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-brand-500 hover:bg-brand-600" onClick={handleAddUser}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "superadmin"
                      ? "Super Admin"
                      : user.role === "admin"
                      ? "Administrateur"
                      : "Utilisateur"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status === "active" ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.subscription === "premium"
                          ? "bg-purple-100 text-purple-800"
                          : user.subscription === "standard"
                          ? "bg-blue-100 text-blue-800"
                          : user.subscription === "trial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.subscription === "premium"
                        ? "Premium"
                        : user.subscription === "standard"
                        ? "Standard"
                        : user.subscription === "trial"
                        ? "Essai"
                        : "Aucun"}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>
                          {user.status === "active" ? (
                            <>
                              <UserX size={16} className="mr-2" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <UserCheck size={16} className="mr-2" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>
                        {isSuperAdmin && user.role !== "superadmin" && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive"
                          >
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
