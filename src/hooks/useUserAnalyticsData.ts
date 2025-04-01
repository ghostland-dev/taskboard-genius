
import { useState, useEffect } from "react";

export const useUserAnalyticsData = () => {
  const [timeRange, setTimeRange] = useState("30");
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 128,
    activeUsers: 89,
    newUsers: 12,
    retentionRate: "76%",
    avgSessionTime: "24 min",
    growthData: [],
    activityData: [],
    statusData: [],
    subscriptionData: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Simulation d'un appel API avec un délai
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Dans une implémentation réelle, vous feriez un appel API ici
        // const response = await fetch(`/api/analytics/users?timeRange=${timeRange}`);
        // const data = await response.json();
        
        // Pour la démo, nous utilisons des données fictives
        setAnalyticsData({
          totalUsers: 128,
          activeUsers: 89,
          newUsers: parseInt(timeRange) < 30 ? 5 : 12,
          retentionRate: "76%",
          avgSessionTime: "24 min",
          growthData: [],
          activityData: [],
          statusData: [],
          subscriptionData: []
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données d'analyse:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return {
    timeRange,
    setTimeRange,
    isLoading,
    analyticsData
  };
};
