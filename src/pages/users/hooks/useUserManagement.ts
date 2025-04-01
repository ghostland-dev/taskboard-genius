
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserStats } from "../types";
import { useAuth } from "@/contexts/AuthContext";

export const useUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  // Load users from Supabase
  useEffect(() => {
    if (user?.role !== "superadmin") {
      return;
    }
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Get users from the profiles table with type assertion
        const { data: profiles, error } = await (supabase
          .from('profiles') as any)
          .select('*');
        
        if (error) {
          console.error('Error fetching profiles:', error);
          toast.error("Erreur lors du chargement des utilisateurs");
          return;
        }
        
        // Get user stats with type assertion
        const { data: statsData, error: statsError } = await (supabase
          .from('user_stats') as any)
          .select('user_id, tasks_count');
          
        if (statsError) {
          console.error('Error fetching user stats:', statsError);
        }
        
        // Get user emails from auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
        }
        
        // Map emails to profiles
        let usersWithEmail: UserProfile[] = [];
        
        if (profiles) {
          usersWithEmail = profiles.map((profile: any) => {
            // Find matching auth user to get email
            const authUser = authUsers?.users?.find((u: any) => u.id === profile.id);
            // Find user stats
            const userStats = statsData?.find((s: any) => s.user_id === profile.id);
            
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

  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Type assertion for the profiles table
      const { error } = await (supabase
        .from('profiles') as any)
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
      // Type assertion for profiles table
      const { error } = await (supabase
        .from('profiles') as any)
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
        // Type assertion for profiles table
        const { error: profileError } = await (supabase
          .from('profiles') as any)
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
          const newUserProfile: UserProfile = {
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

  return {
    users,
    loading,
    stats,
    newUser,
    setNewUser,
    isDialogOpen,
    setIsDialogOpen,
    isSubmitting,
    formatDate,
    handleRoleChange,
    handleStatusChange,
    handleNewUserSubmit
  };
};
