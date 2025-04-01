
import { useState } from "react";
import { UserProfile, UserStats } from "../types";

/**
 * Hook for managing user statistics
 */
export const useUserStats = (users: UserProfile[]) => {
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    premium: 0
  });

  // This function should directly calculate and set stats
  const updateStats = (usersList: UserProfile[]) => {
    setStats({
      total: usersList.length,
      active: usersList.filter(u => u.status === 'active').length,
      premium: usersList.filter(u => u.subscription === 'premium').length
    });
  };

  return {
    stats,
    updateStats
  };
};
