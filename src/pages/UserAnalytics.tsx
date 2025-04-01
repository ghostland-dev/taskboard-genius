
import React from "react";
import { useUserAnalyticsData } from "@/hooks/useUserAnalyticsData";
import UserAnalyticsHeader from "@/components/analytics/UserAnalyticsHeader";
import UserAnalyticsCards from "@/components/analytics/UserAnalyticsCards";
import UserAnalyticsTabs from "@/components/analytics/UserAnalyticsTabs";
import AccessDeniedAlert from "@/components/analytics/AccessDeniedAlert";
import { useAuth } from "@/contexts/AuthContext";

const UserAnalytics: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const { timeRange, setTimeRange, isLoading, analyticsData } = useUserAnalyticsData();

  if (!isAdmin) {
    return <AccessDeniedAlert />;
  }

  return (
    <div className="space-y-6">
      <UserAnalyticsHeader 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange} 
      />
      
      <UserAnalyticsCards 
        data={analyticsData} 
        isLoading={isLoading} 
      />
      
      <UserAnalyticsTabs 
        timeRange={parseInt(timeRange)}
        analyticsData={analyticsData}
        isLoading={isLoading} 
      />
    </div>
  );
};

export default UserAnalytics;
