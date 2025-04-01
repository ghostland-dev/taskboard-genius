
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MoreVertical, Plus, User, UserPlus, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

// Données fictives d'utilisateurs pour la démo
const mockUsers = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@nomdomain.fr",
    role: "superadmin",
    status: "active",
    tasks: 15,
    dateJoined: "2023-01-15",
    subscription: "premium"
  },
  {
    id: "2",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "user",
    status: "active",
    tasks: 32,
    dateJoined: "2023-03-22",
    subscription: "standard"
  },
  {
    id: "3",
    name: "Marie Leroy",
    email: "marie.leroy@example.com",
    role: "user",
    status: "active",
    tasks: 27,
    dateJoined: "2023-04-10",
    subscription: "trial"
  },
  {
    id: "4",
    name: "Pierre Martin",
    email: "pierre.martin@example.com",
    role: "user",
    status: "inactive",
    tasks: 8,
    dateJoined: "2023-05-05",
    subscription: "expired"
  },
  {
    id: "5",
    name: "Sophie Petit",
    email: "sophie.petit@example.com",
    role: "user",
    status: "active",
    tasks: 45,
    dateJoined: "2023-02-18",
    subscription: "premium"
  }
];

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  // Si l'utilisateur n'est pas superadmin, rediriger ou afficher un message
  if (user?.role !== "superadmin") {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
            Cette section est réservée aux super administrateurs.
          </AlertDescription>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
          >
            Retour au tableau de bord
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground mt-1">
            Administrez les comptes utilisateurs de votre application
          </p>
        </div>
        <Button className="bg-brand-500 hover:bg-brand-600">
          <UserPlus size={16} className="mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total utilisateurs</p>
                <p className="text-3xl font-bold">{mockUsers.length}</p>
              </div>
              <div className="bg-brand-100 p-3 rounded-full">
                <User className="text-brand-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Utilisateurs actifs</p>
                <p className="text-3xl font-bold">{mockUsers.filter(u => u.status === "active").length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <User className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Abonnés premium</p>
                <p className="text-3xl font-bold">{mockUsers.filter(u => u.subscription === "premium").length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <User className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez tous les utilisateurs enregistrés dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "superadmin" ? "default" : "outline"}>
                      {user.role === "superadmin" ? "Super Admin" : "Utilisateur"}
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
                  <TableCell>{user.tasks}</TableCell>
                  <TableCell>{formatDate(user.dateJoined)}</TableCell>
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
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier l'utilisateur</DropdownMenuItem>
                        <DropdownMenuItem>Voir les tâches</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Désactiver le compte
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
