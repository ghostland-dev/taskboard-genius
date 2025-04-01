
import { useEffect } from "react";
import { useFetchUsers } from "./useFetchUsers";
import { useUserStats } from "./useUserStats";
import { useUserRole } from "./useUserRole";
import { useUserStatus } from "./useUserStatus";
import { useNewUserForm } from "./useNewUserForm";
import { formatDate } from "../utils/formatUtils";

/**
 * Main hook for user management functionality
 */
export const useUserManagement = () => {
  const { users, setUsers, loading } = useFetchUsers();
  const { stats, updateStats } = useUserStats(users);
  const { handleRoleChange } = useUserRole(users, setUsers);
  const { handleStatusChange } = useUserStatus(users, setUsers, stats, updateStats);
  const { 
    newUser, 
    setNewUser, 
    isDialogOpen, 
    setIsDialogOpen, 
    isSubmitting,
    handleNewUserSubmit 
  } = useNewUserForm(users, setUsers, stats, updateStats);

  // Update stats when users change
  useEffect(() => {
    updateStats(users);
  }, [users]);

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
