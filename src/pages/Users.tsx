
import React, { useState, useEffect } from "react";
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
import { MoreVertical, Plus, User, UserPlus, AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subscription: string;
  created_at: string;
  tasks_count?: number;
};

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    premium: 0
  });
  
  // New user form state
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user",
    status: "active",
    subscription: "trial"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users from Supabase
  useEffect(() => {
    if (user?.role !== "superadmin") {
      return;
    }
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Get users from the profiles table
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error fetching profiles:', error);
          toast.error("Erreur lors du chargement des utilisateurs");
          return;
        }
        
        // Get user stats
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('user_id, tasks_count');
          
        if (statsError) {
          console.error('Error fetching user stats:', statsError);
        }
        
        // Get user emails from auth.users
        // This requires a superadmin to have the right to access the auth.users table
        // For production, you might want to implement this differently
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
        }
        
        // Map emails to profiles
        let usersWithEmail: UserProfile[] = [];
        
        if (profiles) {
          usersWithEmail = profiles.map(profile => {
            // Find matching auth user to get email
            const authUser = authUsers?.users?.find(u => u.id === profile.id);
            // Find user stats
            const userStats = statsData?.find(s => s.user_id === profile.id);
            
            return {
              ...profile,
              email: authUser?.email || 'Email non disponible',
              tasks_count: userStats?.tasks_count || 0
            };
          });
          
          setUsers(usersWithEmail);
          
          // Calculate stats
          setStats({
            total: usersWithEmail.length,
            active: usersWithEmail.filter(u => u.status === 'active').length,
            premium: usersWithEmail.filter(u => u.subscription === 'premium').length
          });
        }
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        toast.error("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user?.role]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };
  
  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating user role:', error);
        toast.error("Erreur lors de la mise à jour du rôle");
        return;
      }
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("Rôle mis à jour avec succès");
    } catch (error) {
      console.error('Error in handleRoleChange:', error);
      toast.error("Une erreur est survenue");
    }
  };
  
  // Handle user status change
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating user status:', error);
        toast.error("Erreur lors de la mise à jour du statut");
        return;
      }
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      
      // Update stats
      setStats({
        ...stats,
        active: newStatus === 'active' 
          ? stats.active + 1 
          : stats.active - 1
      });
      
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast.error("Une erreur est survenue");
    }
  };
  
  // Handle new user form submission
  const handleNewUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Generate a random secure password
      const tempPassword = Math.random().toString(36).slice(-10) + 
                           Math.random().toString(36).toUpperCase().slice(-2) + 
                           Math.floor(Math.random() * 10) + 
                           "!";
      
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name: newUser.name }
      });
      
      if (error) {
        console.error('Error creating user:', error);
        toast.error(`Erreur: ${error.message}`);
        return;
      }
      
      if (data.user) {
        // Update the user's profile with role and subscription
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: newUser.role,
            status: newUser.status,
            subscription: newUser.subscription
          })
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error('Error updating user profile:', profileError);
          toast.error("Utilisateur créé mais erreur lors de la mise à jour du profil");
        } else {
          toast.success("Utilisateur créé avec succès");
          setIsDialogOpen(false);
          
          // Reset form
          setNewUser({
            email: "",
            name: "",
            role: "user",
            status: "active",
            subscription: "trial"
          });
          
          // Refresh user list
          const newUserProfile = {
            id: data.user.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            subscription: newUser.subscription,
            created_at: new Date().toISOString(),
            tasks_count: 0
          };
          
          setUsers([...users, newUserProfile]);
          
          // Update stats
          setStats({
            total: stats.total + 1,
            active: newUser.status === 'active' ? stats.active + 1 : stats.active,
            premium: newUser.subscription === 'premium' ? stats.premium + 1 : stats.premium
          });
        }
      }
    } catch (error) {
      console.error('Error in handleNewUserSubmit:', error);
      toast.error("Une erreur est survenue lors de la création de l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the user isn't superadmin, show access denied
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-500 hover:bg-brand-600">
              <UserPlus size={16} className="mr-2" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouvel utilisateur dans le système.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewUserSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={newUser.status} 
                    onValueChange={(value) => setNewUser({...newUser, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subscription">Abonnement</Label>
                  <Select 
                    value={newUser.subscription} 
                    onValueChange={(value) => setNewUser({...newUser, subscription: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un abonnement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Essai</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer l'utilisateur"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total utilisateurs</p>
                <p className="text-3xl font-bold">{stats.total}</p>
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
                <p className="text-3xl font-bold">{stats.active}</p>
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
                <p className="text-3xl font-bold">{stats.premium}</p>
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement des utilisateurs...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
              <p>Aucun utilisateur trouvé</p>
              <p className="text-sm mt-1">Créez votre premier utilisateur en cliquant sur "Nouvel utilisateur"</p>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
