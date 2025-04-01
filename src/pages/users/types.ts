
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subscription: string;
  created_at: string;
  tasks_count?: number;
  stripe_customer_id?: string;
  subscription_id?: string;
  subscription_status?: string;
  subscription_period_end?: string;
};

export type UserStats = {
  total: number;
  active: number;
  premium: number;
};
