
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subscription: string;
  created_at: string;
  tasks_count?: number;
};

export type UserStats = {
  total: number;
  active: number;
  premium: number;
};
