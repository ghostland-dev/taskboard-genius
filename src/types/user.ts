
export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: 'user' | 'admin' | 'superadmin';
  subscription?: 'trial' | 'standard' | 'premium' | 'expired';
  status?: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  standardUsers: number;
  trialUsers: number;
  newUsersThisMonth: number;
}
