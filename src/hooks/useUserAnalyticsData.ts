
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Types pour les données d'analyse
interface UserAnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retentionRate: string;
  avgSessionTime: string;
  growthData: GrowthDataPoint[];
  activityData: ActivityDataPoint[];
  statusData: StatusDataPoint[];
  subscriptionData: SubscriptionDataPoint[];
}

interface GrowthDataPoint {
  date: string;
  count: number;
}

interface ActivityDataPoint {
  date: string;
  active: number;
  inactive: number;
}

interface StatusDataPoint {
  status: string;
  count: number;
}

interface SubscriptionDataPoint {
  plan: string;
  count: number;
}

// Fonction pour générer des données de croissance selon la période
const generateGrowthData = (timeRange: number): GrowthDataPoint[] => {
  const data: GrowthDataPoint[] = [];
  const now = new Date();
  const baseUsers = 100;
  
  for (let i = timeRange; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Croissance progressive avec variations aléatoires
    const growthFactor = 1 + (timeRange - i) / timeRange; // Croissance plus importante vers aujourd'hui
    const randomVariation = 0.8 + Math.random() * 0.4; // Variation entre 0.8 et 1.2
    const count = Math.floor(baseUsers * growthFactor * randomVariation);
    
    data.push({ date: dateString, count });
  }
  
  return data;
};

// Fonction pour générer des données d'activité
const generateActivityData = (timeRange: number): ActivityDataPoint[] => {
  const data: ActivityDataPoint[] = [];
  const now = new Date();
  const baseActiveUsers = 70;
  const baseInactiveUsers = 30;
  
  for (let i = timeRange; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Variation d'activité avec tendance
    const dayFactor = 1 + (Math.sin(i / 7 * Math.PI) * 0.2); // Variation hebdomadaire
    const active = Math.floor(baseActiveUsers * dayFactor);
    const inactive = Math.floor(baseInactiveUsers * (2 - dayFactor));
    
    data.push({ date: dateString, active, inactive });
  }
  
  return data;
};

// Fonction pour générer des données de statut
const generateStatusData = (): StatusDataPoint[] => {
  return [
    { status: "Actif", count: 89 },
    { status: "Inactif", count: 23 },
    { status: "En attente", count: 16 }
  ];
};

// Fonction pour générer des données d'abonnement
const generateSubscriptionData = (): SubscriptionDataPoint[] => {
  return [
    { plan: "Trial", count: 45 },
    { plan: "Standard", count: 62 },
    { plan: "Premium", count: 21 }
  ];
};

export const useUserAnalyticsData = () => {
  const [timeRange, setTimeRange] = useState<string>("30");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<UserAnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    retentionRate: "0%",
    avgSessionTime: "0 min",
    growthData: [],
    activityData: [],
    statusData: [],
    subscriptionData: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simuler un délai de chargement
        await new Promise((resolve) => setTimeout(resolve, 1200));
        
        // Dans une implémentation réelle, vous feriez un appel API ici
        // const response = await fetch(`/api/analytics/users?timeRange=${timeRange}`);
        // if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        // const data = await response.json();
        
        // Pour la démo, nous générons des données fictives
        const timeRangeNum = parseInt(timeRange);
        const newUsers = timeRangeNum < 30 ? 5 : (timeRangeNum < 90 ? 12 : 28);
        const totalUsers = 128;
        const activeUsers = 89;
        const retentionRate = "76%";
        const avgSessionTime = "24 min";
        
        // Générer des données pour les graphiques
        const growthData = generateGrowthData(timeRangeNum);
        const activityData = generateActivityData(timeRangeNum);
        const statusData = generateStatusData();
        const subscriptionData = generateSubscriptionData();
        
        setAnalyticsData({
          totalUsers,
          activeUsers,
          newUsers,
          retentionRate,
          avgSessionTime,
          growthData,
          activityData,
          statusData,
          subscriptionData
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données d'analyse:", error);
        setError("Impossible de charger les données d'analyse. Veuillez réessayer plus tard.");
        toast.error("Erreur de chargement", {
          description: "Les données d'analyse n'ont pas pu être chargées."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const refreshData = () => {
    toast.info("Actualisation des données...");
    // Réexécute l'effet useEffect en changeant sa dépendance puis en la remettant
    setTimeRange(prev => {
      const current = prev;
      setTimeRange("refresh");
      setTimeout(() => setTimeRange(current), 0);
      return current;
    });
  };

  return {
    timeRange,
    setTimeRange,
    isLoading,
    error,
    analyticsData,
    refreshData
  };
};
