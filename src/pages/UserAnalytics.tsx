
import React, { useEffect } from "react";
import { useUserAnalyticsData } from "@/hooks/useUserAnalyticsData";
import UserAnalyticsHeader from "@/components/analytics/UserAnalyticsHeader";
import UserAnalyticsCards from "@/components/analytics/UserAnalyticsCards";
import UserAnalyticsTabs from "@/components/analytics/UserAnalyticsTabs";
import AccessDeniedAlert from "@/components/analytics/AccessDeniedAlert";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const UserAnalytics: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const { 
    timeRange, 
    setTimeRange, 
    isLoading, 
    error, 
    analyticsData,
    refreshData 
  } = useUserAnalyticsData();

  useEffect(() => {
    // Logique de vérification d'accès
    if (!authLoading && user && !isAdmin) {
      toast.error("Accès non autorisé", {
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
      });
    }
  }, [user, authLoading, isAdmin]);

  // Afficher un indicateur de chargement pendant la vérification d'authentification
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Vérification de vos permissions...</span>
      </div>
    );
  }

  // Afficher un message d'accès refusé si l'utilisateur n'est pas admin
  if (!isAdmin) {
    return <AccessDeniedAlert />;
  }

  return (
    <div className="space-y-6">
      <UserAnalyticsHeader 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange}
        onRefresh={refreshData}
        isLoading={isLoading}
      />
      
      <UserAnalyticsCards 
        data={analyticsData}
        isLoading={isLoading}
      />
      
      <UserAnalyticsTabs 
        timeRange={parseInt(timeRange)}
        analyticsData={analyticsData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default UserAnalytics;
