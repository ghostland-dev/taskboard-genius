
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserStats } from "@/types/user";

export const useUserAnalyticsData = () => {
  const [timeRange, setTimeRange] = useState<string>("30");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    standardUsers: 0,
    trialUsers: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Fetch from Supabase
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*");
          
        if (profiles) {
          const currentDate = new Date();
          const thirtyDaysAgo = new Date(currentDate);
          thirtyDaysAgo.setDate(currentDate.getDate() - 30);
          
          const active = profiles.filter(p => p.status === "active").length;
          const premium = profiles.filter(p => p.subscription === "premium").length;
          const standard = profiles.filter(p => p.subscription === "standard").length;
          const trial = profiles.filter(p => p.subscription === "trial").length;
          const newUsers = profiles.filter(p => {
            const createdAt = new Date(p.created_at);
            return createdAt >= thirtyDaysAgo;
          }).length;
          
          setAnalyticsData({
            totalUsers: profiles.length,
            activeUsers: active,
            premiumUsers: premium,
            standardUsers: standard,
            trialUsers: trial,
            newUsersThisMonth: newUsers
          });
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return {
    timeRange,
    setTimeRange,
    isLoading,
    analyticsData
  };
};
